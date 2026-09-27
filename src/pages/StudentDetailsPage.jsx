import React from 'react';
import { 
  ArrowLeft, 
  User, 
  Radio, 
  Hash, 
  Mail, 
  Building, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Percent,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUid, extractRecordDateTime } from '../utils/formatting';
import StatusBadge from '../components/common/StatusBadge';
import StatCard from '../components/common/StatCard';
import EmptyState from '../components/common/EmptyState';

export default function StudentDetailsPage() {
  const { selectedStudent, attendance, navigateTo, stats } = useApp();

  if (!selectedStudent) {
    return (
      <div className="p-8">
        <EmptyState
          icon={User}
          title="No Student Selected"
          description="Please select a student from the student list to view their attendance profile."
          actionLabel="Go to Student List"
          onAction={() => navigateTo('students')}
        />
      </div>
    );
  }

  // Find all attendance records for this student by UID
  const studentLogs = attendance.filter(
    a => formatUid(a.uid) === formatUid(selectedStudent.uid)
  );

  const presentLogs = studentLogs.filter(
    a => (a.status || 'Present').toLowerCase() === 'present'
  );

  const totalWorkingDays = 100;
  const totalScans = studentLogs.length;
  const presentCount = studentLogs.length;
  const absentCount = Math.max(0, totalWorkingDays - presentCount);
  const percentage = Math.round((presentCount / totalWorkingDays) * 100);
  const isDefaulter = percentage < 75;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back Button */}
      <button
        onClick={() => navigateTo('students')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Roster</span>
      </button>

      {/* Student Profile Card Header */}
      <div className="rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {selectedStudent.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {selectedStudent.name}
                </h1>
                <StatusBadge status={isDefaulter ? 'Absent' : 'Active'} size="sm" />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Hash className="w-3.5 h-3.5 text-brand-400" />
                  Roll: <strong className="text-white">{selectedStudent.roll}</strong>
                </span>
                <span className="flex items-center gap-1.5 font-mono text-brand-300">
                  <Radio className="w-3.5 h-3.5 text-brand-400" />
                  UID: {formatUid(selectedStudent.uid)}
                </span>
                {selectedStudent.division && (
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {selectedStudent.division}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Attendance Rate</span>
              <span className={`text-2xl font-extrabold font-mono ${percentage >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {percentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards for Student */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Present Days"
          value={presentCount}
          subtitle={`Out of ${totalWorkingDays} working days`}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Absent Days"
          value={absentCount}
          subtitle="Lectures missed"
          icon={Clock}
          color={absentCount > 25 ? "rose" : "amber"}
        />
        <StatCard
          title="Attendance Rate"
          value={`${percentage}%`}
          subtitle={percentage >= 75 ? "Eligible for Exams" : "Defaulter (<75%)"}
          icon={Percent}
          color={percentage >= 75 ? "emerald" : "rose"}
        />
        <StatCard
          title="RFID Card Status"
          value="Linked"
          subtitle={formatUid(selectedStudent.uid)}
          icon={Radio}
          color="blue"
        />
      </div>

      {/* Student Attendance History Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Attendance History for {selectedStudent.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Log of all RFID card scans received by NodeMCU ESP8266
          </p>
        </div>

        {studentLogs.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Clock}
              title="No Attendance Logs Found"
              description={`No RFID card scans recorded yet for UID ${formatUid(selectedStudent.uid)}.`}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">RFID UID</th>
                  <th className="py-3 px-4">Device Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {studentLogs.map((log, index) => {
                  const dt = extractRecordDateTime(log);
                  return (
                    <tr key={log.id || index} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-slate-400 font-mono">{index + 1}</td>
                      <td className="py-3 px-4"><StatusBadge status={log.status || 'Present'} /></td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {dt.hasTimestamp ? dt.date : <span className="text-slate-400 italic">Not available</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">
                        {dt.hasTimestamp ? dt.time : <span className="text-slate-400 italic">Not available</span>}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {formatUid(log.uid)}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {log.device || 'SmartAttend ESP8266'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
