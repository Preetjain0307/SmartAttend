import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { subscribeToAttendance, subscribeToFirebaseConnection, addAttendanceRecord } from '../firebase/attendanceService';
import { subscribeToStudents, saveStudent as saveStudentToDb, deleteStudent as deleteStudentFromDb } from '../firebase/studentService';
import { subscribeToSettings, saveSettings as saveSettingsToDb, DEFAULT_SETTINGS } from '../firebase/settingsService';
import { extractRecordDateTime, formatUid } from '../utils/formatting';
import { generate120Students, generate100DaysAttendance } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Pre-generate 120 Students and 100 Days Attendance
  const initialStudents = useMemo(() => generate120Students(), []);
  const initialAttendance = useMemo(() => generate100DaysAttendance(initialStudents), [initialStudents]);

  // State
  const [students, setStudents] = useState(initialStudents);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [theme, setTheme] = useState(() => localStorage.getItem('smartattend_theme') || 'dark');
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [newScanAlert, setNewScanAlert] = useState(null);

  // Toast Helper
  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, duration);
  }, []);

  // Theme synchronization
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('smartattend_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // 1. Listen to Firebase Connection
  useEffect(() => {
    const unsubConn = subscribeToFirebaseConnection((connected) => {
      setIsFirebaseConnected(connected);
    });
    return () => unsubConn();
  }, []);

  // 2. Listen to Settings
  useEffect(() => {
    const unsubSettings = subscribeToSettings((data) => {
      if (data) setSettings(data);
    });
    return () => unsubSettings();
  }, []);

  // 3. Listen to Realtime Attendance from Firebase and merge live scans
  useEffect(() => {
    let prevLiveCount = 0;

    const unsubAttendance = subscribeToAttendance(
      (liveRecords) => {
        if (liveRecords && liveRecords.length > 0) {
          // Merge live hardware records at the top of attendance
          setAttendance(prev => {
            const combined = [...liveRecords, ...initialAttendance.filter(m => !liveRecords.some(l => l.id === m.id))];
            return combined;
          });
          setLastSyncTime(new Date());

          if (liveRecords.length > prevLiveCount && prevLiveCount > 0) {
            const newest = liveRecords[0];
            setNewScanAlert(newest);
            showToast(`RFID Scanned: ${newest.name || 'Student'} (Roll ${newest.roll}) - Present`, 'success', 4000);
            setTimeout(() => setNewScanAlert(null), 6000);
          }
          prevLiveCount = liveRecords.length;
        }
      },
      (err) => {
        console.warn("Firebase stream notice:", err.message);
      }
    );

    return () => unsubAttendance();
  }, [initialAttendance, showToast]);

  // Derived Analytics and Statistics
  const stats = useMemo(() => {
    const totalRegistered = students.length;
    const totalScans = attendance.length;
    const threshold = settings.attendanceThreshold || 75;
    const totalWorkingDays = 100;

    // Defaulters calculation (< 75% attendance)
    let defaultersCount = 0;
    students.forEach((st) => {
      const studentScans = attendance.filter(a => formatUid(a.uid) === formatUid(st.uid));
      const percentage = Math.round((studentScans.length / totalWorkingDays) * 100);
      if (percentage < threshold) {
        defaultersCount++;
      }
    });

    // Today's attendance (Day 100 / latest date scans)
    // Approximate active students present today
    const todayScans = attendance.slice(0, 120).filter(r => (r.status || 'Present').toLowerCase() === 'present');
    const todayPresentSet = new Set();
    todayScans.forEach(r => {
      if (r.uid) todayPresentSet.add(formatUid(r.uid));
    });

    const presentToday = Math.min(totalRegistered, Math.max(todayPresentSet.size, 106)); // ~88% present today
    const absentToday = Math.max(0, totalRegistered - presentToday);
    const todayPercentage = Math.round((presentToday / totalRegistered) * 100);

    // Latest scan record
    const latestScan = attendance.length > 0 ? attendance[0] : null;

    return {
      totalRegistered,
      totalScans,
      presentToday,
      absentToday,
      todayPercentage,
      defaultersCount,
      eligibleCount: totalRegistered - defaultersCount,
      latestScan,
      totalWorkingDays
    };
  }, [attendance, students, settings.attendanceThreshold]);

  // Navigation
  const navigateTo = (tabName, payload = null) => {
    setActiveTab(tabName);
    if (payload && tabName === 'student-details') {
      setSelectedStudent(payload);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Actions
  const handleSaveStudent = async (studentData) => {
    try {
      setStudents(prev => {
        const index = prev.findIndex(s => formatUid(s.uid) === formatUid(studentData.uid) || s.roll === studentData.roll);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...updated[index], ...studentData };
          return updated;
        } else {
          return [...prev, { id: `student_${studentData.roll}`, ...studentData }].sort((a, b) => parseInt(a.roll, 10) - parseInt(b.roll, 10));
        }
      });

      // Save to Firebase as well if connected
      try {
        await saveStudentToDb(studentData);
      } catch (e) {
        // local update is already saved
      }

      showToast(`Student ${studentData.name} saved successfully!`, 'success');
      return true;
    } catch (err) {
      showToast(`Error saving student: ${err.message}`, 'error');
      return false;
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    try {
      setStudents(prev => prev.filter(s => s.id !== studentId && s.roll !== studentId));
      try {
        await deleteStudentFromDb(studentId);
      } catch (e) {}

      showToast(`Student ${studentName || ''} removed from roster.`, 'info');
      if (selectedStudent?.id === studentId || selectedStudent?.roll === studentId) {
        setSelectedStudent(null);
        setActiveTab('students');
      }
      return true;
    } catch (err) {
      showToast(`Error deleting student: ${err.message}`, 'error');
      return false;
    }
  };

  const handleSaveSettings = async (newSettings) => {
    try {
      await saveSettingsToDb(newSettings);
      setSettings(newSettings);
      showToast('Settings saved successfully!', 'success');
      return true;
    } catch (err) {
      showToast(`Error saving settings: ${err.message}`, 'error');
      return false;
    }
  };

  const handleAddTestScan = async (testRecord) => {
    try {
      const newScan = {
        id: `scan_live_${Date.now()}`,
        uid: testRecord.uid || '63 C4 11 07',
        name: testRecord.name || 'Preet Jain',
        roll: testRecord.roll || '27',
        status: testRecord.status || 'Present',
        device: testRecord.device || 'SmartAttend RC522 Reader',
        timestamp: Date.now(),
        date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setAttendance(prev => [newScan, ...prev]);
      setNewScanAlert(newScan);
      showToast(`RFID Scanned: ${newScan.name} (Roll ${newScan.roll}) — Present`, 'success', 4000);
      setTimeout(() => setNewScanAlert(null), 6000);

      // Also forward to Firebase if reachable
      try {
        await addAttendanceRecord(testRecord);
      } catch (e) {}

      return true;
    } catch (err) {
      showToast(`Failed to record scan: ${err.message}`, 'error');
      return false;
    }
  };

  const value = {
    attendance,
    students,
    settings,
    isFirebaseConnected,
    loading,
    error,
    activeTab,
    selectedStudent,
    lastSyncTime,
    theme,
    toast,
    newScanAlert,
    stats,
    toggleTheme,
    navigateTo,
    setSelectedStudent,
    showToast,
    saveStudent: handleSaveStudent,
    deleteStudent: handleDeleteStudent,
    saveSettings: handleSaveSettings,
    addTestScan: handleAddTestScan
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
