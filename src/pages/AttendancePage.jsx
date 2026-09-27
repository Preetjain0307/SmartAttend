import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import AttendanceTable from '../components/attendance/AttendanceTable';
import { useApp } from '../context/AppContext';

export default function AttendancePage() {
  const { stats } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Attendance Records & Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete database of all RFID attendance logs streamed from SmartAttend reader
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
            Total Records: <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{stats.totalScans}</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <AttendanceTable />
    </div>
  );
}
