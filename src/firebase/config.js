import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration from environment variables or smart defaults
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForSmartAttendIoTProject",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smartattend-af03a.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://smartattend-af03a-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smartattend-af03a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smartattend-af03a.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456789"
};

// Initialize Firebase App singleton safely
let app;
let database;
let initError = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  database = getDatabase(app);
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
  initError = error;
}

export { app, database, initError };
