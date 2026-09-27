import React from 'react';
import { ClipboardCheck, ShieldAlert, Info } from 'lucide-react';
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
            Attendance Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete database of all RFID attendance logs streamed from ESP8266 NodeMCU
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Total Logs: <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{stats.totalScans}</span>
          </div>
        </div>
      </div>

      {/* Legacy Timestamp Note Alert */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-0.5">Firebase Schema & Timestamp Notice</p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Existing ESP8266 records are logged without human-readable date/time fields. The system preserves raw records and gracefully displays <span className="font-mono text-slate-700 dark:text-slate-300">"Not available"</span> without fabricating fake timestamps. New records will automatically include high-precision timestamps.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <AttendanceTable />
    </div>
  );
}
