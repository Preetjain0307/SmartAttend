import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Menu, 
  Radio, 
  Zap, 
  Building2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Header({ onOpenMobileMenu }) {
  const { 
    theme, 
    toggleTheme, 
    isFirebaseConnected, 
    settings, 
    activeTab,
    addTestScan,
    students
  } = useApp();

  const [simulating, setSimulating] = useState(false);

  // Quick simulate RFID scan for demonstration
  const handleQuickSimulate = async () => {
    setSimulating(true);
    const student = (students && students.length > 0) 
      ? students[Math.floor(Math.random() * students.length)]
      : { name: "Preet Jain", roll: "27", uid: "63 C4 11 07" };

    await addTestScan({
      uid: student.uid,
      name: student.name,
      roll: student.roll,
      status: "Present",
      device: "SmartAttend RC522 Reader (Lab 402)"
    });
    setSimulating(false);
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Attendance Overview';
      case 'attendance': return 'Attendance Records & Logs';
      case 'students': return 'Students Roster (120 Enrolled)';
      case 'student-details': return 'Student Attendance Profile';
      case 'defaulters': return 'Attendance Defaulters List (< 75%)';
      case 'reports': return 'College Attendance Reports & Analytics';
      case 'settings': return 'System Settings & Thresholds';
      default: return 'SmartAttend';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-3.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 lg:hidden rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {getPageTitle()}
          </h2>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              {settings.collegeName || 'Thakur College of Science & Commerce'}
            </span>
            <span>•</span>
            <span className="text-brand-600 dark:text-brand-400 font-medium">
              {settings.courseName || 'B.Sc. IT & CS'}
            </span>
          </div>
        </div>
      </div>

      {/* Right: RFID Tap Simulator, Sync Status, Theme Toggle */}
      <div className="flex items-center gap-2.5">
        {/* Quick Demo RFID Scan Button */}
        <button
          onClick={handleQuickSimulate}
          disabled={simulating}
          title="Simulate RFID Card Scan"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 rounded-xl hover:bg-brand-100 dark:hover:bg-brand-900/50 transition shadow-sm"
        >
          <Zap className={`w-3.5 h-3.5 text-brand-600 dark:text-brand-400 ${simulating ? 'animate-spin' : ''}`} />
          <span>{simulating ? 'Scanning...' : 'Simulate RFID Tap'}</span>
        </button>

        {/* Live Cloud Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800">
          <span className={`w-2 h-2 rounded-full ${isFirebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="text-slate-600 dark:text-slate-300">
            {isFirebaseConnected ? 'Firebase Cloud Active' : 'System Ready'}
          </span>
        </div>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle dark mode"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>
      </div>
    </header>
  );
}
