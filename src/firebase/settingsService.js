import { ref, onValue, set } from 'firebase/database';
import { database } from './config';

const SETTINGS_PATH = 'settings';

export const DEFAULT_SETTINGS = {
  appName: "SmartAttend",
  tagline: "Smart RFID Attendance Management Portal",
  collegeName: "Thakur College of Science & Commerce",
  department: "Department of Information Technology & Computer Science",
  courseName: "B.Sc. IT & Computer Science — Semester V",
  academicYear: "2026-2027",
  attendanceThreshold: 75,
  autoRefreshInterval: 5,
  soundAlerts: true,
  theme: "dark"
};

/**
 * Subscribes to application settings in Firebase or falls back to localStorage
 */
export function subscribeToSettings(onData) {
  // Check localStorage first
  const local = localStorage.getItem('smartattend_settings');
  if (local) {
    try {
      const parsed = JSON.parse(local);
      // Ensure Thakur College branding is applied if previous college was default
      if (!parsed.collegeName || parsed.collegeName.includes('College of Engineering')) {
        parsed.collegeName = DEFAULT_SETTINGS.collegeName;
        parsed.department = DEFAULT_SETTINGS.department;
        parsed.courseName = DEFAULT_SETTINGS.courseName;
      }
      onData({ ...DEFAULT_SETTINGS, ...parsed });
    } catch (e) {
      onData(DEFAULT_SETTINGS);
    }
  } else {
    onData(DEFAULT_SETTINGS);
  }

  if (!database) return () => {};

  const settingsRef = ref(database, SETTINGS_PATH);
  return onValue(
    settingsRef,
    (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const merged = { ...DEFAULT_SETTINGS, ...val };
        localStorage.setItem('smartattend_settings', JSON.stringify(merged));
        onData(merged);
      }
    },
    (err) => {
      console.warn("Settings subscription fallback to local:", err.message);
    }
  );
}

/**
 * Saves updated settings to Firebase and localStorage
 */
export async function saveSettings(newSettings) {
  const merged = { ...DEFAULT_SETTINGS, ...newSettings };
  localStorage.setItem('smartattend_settings', JSON.stringify(merged));

  if (database) {
    try {
      await set(ref(database, SETTINGS_PATH), merged);
    } catch (err) {
      console.warn("Could not save settings to Firebase (saved locally):", err.message);
    }
  }

  return merged;
}
