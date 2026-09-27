import React from 'react';
import { ArrowRight, UserCheck, Clock, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatUid, extractRecordDateTime } from '../../utils/formatting';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

export default function RecentScansTable({ limit = 6 }) {
  const { attendance, navigateTo } = useApp();
  const recentRecords = attendance.slice(0, limit);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Recent Attendance Scans
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest RFID card readings from ESP8266
          </p>
        </div>

        <button
          onClick={() => navigateTo('attendance')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition"
        >
          <span>View All ({attendance.length})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Table content */}
      {recentRecords.length === 0 ? (
        <div className="p-6">
          <EmptyState 
            title="No RFID Scans Yet" 
            description="Tap an RFID card on the RC522 reader connected to the ESP8266 to see live scans appear here." 
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">RFID UID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {recentRecords.map((record, index) => {
                const dt = extractRecordDateTime(record);
                return (
                  <tr 
                    key={record.id || index}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {record.roll || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {record.name || 'Unknown Student'}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-600 dark:text-slate-400 text-[11px]">
                      {formatUid(record.uid)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={record.status || 'Present'} />
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {dt.hasTimestamp ? (
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{dt.time}</span>
                          <span className="text-[10px] text-slate-400 block">{dt.date}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Not available</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {record.device || 'SmartAttend'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
