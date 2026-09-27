import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  UserX, 
  Mail, 
  Building2,
  Phone,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUid } from '../utils/formatting';
import { exportStudentsToCsv } from '../utils/exportCsv';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';

export default function DefaultersPage() {
  const { students, attendance, settings, stats, navigateTo, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('ALL');

  const threshold = settings.attendanceThreshold || 75;

  // Compute student stats over the 100 working days
  const studentMetrics = useMemo(() => {
    // Total recorded days is 100
    const totalWorkingDays = 100;

    return students.map((st) => {
      const studentScans = attendance.filter(a => formatUid(a.uid) === formatUid(st.uid));
      const presentCount = studentScans.length;
      const absentCount = Math.max(0, totalWorkingDays - presentCount);
      const percentage = Math.round((presentCount / totalWorkingDays) * 100);
      const isDefaulter = percentage < threshold;

      return {
        ...st,
        totalWorkingDays,
        presentCount,
        absentCount,
        percentage,
        isDefaulter
      };
    });
  }, [students, attendance, threshold]);

  // Filter only defaulters
  const defaulters = useMemo(() => {
    return studentMetrics.filter(s => s.isDefaulter);
  }, [studentMetrics]);

  // Search & Filter
  const filteredDefaulters = useMemo(() => {
    return defaulters.filter((st) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const rollMatch = String(st.roll || '').toLowerCase().includes(q);
        const nameMatch = String(st.name || '').toLowerCase().includes(q);
        const uidMatch = formatUid(st.uid || '').toLowerCase().includes(q);
        if (!rollMatch && !nameMatch && !uidMatch) return false;
      }

      if (divisionFilter !== 'ALL') {
        if (st.division !== divisionFilter) return false;
      }

      return true;
    }).sort((a, b) => a.percentage - b.percentage); // Lowest attendance first
  }, [defaulters, searchQuery, divisionFilter]);

  const handleExportCsv = () => {
    exportStudentsToCsv(filteredDefaulters, `tcsc_defaulters_list_${new Date().toISOString().slice(0,10)}.csv`);
    showToast(`Exported ${filteredDefaulters.length} defaulter records to CSV`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Alert */}
      <div className="rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-rose-700 via-rose-800 to-red-950 text-white shadow-xl shadow-rose-900/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold tracking-wide text-rose-200">
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>Official TCSC Attendance Warning System</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Attendance Defaulters List (&lt; {threshold}%)
            </h1>
            <p className="text-xs lg:text-sm text-rose-100 max-w-2xl">
              {settings.collegeName} — {settings.department}. Students below {threshold}% attendance are ineligible for term exams under Mumbai University ordinances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="text-[10px] uppercase font-bold text-rose-200 block">Total Defaulters</span>
              <span className="text-2xl font-extrabold font-mono text-white">{defaulters.length}</span>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <span className="text-[10px] uppercase font-bold text-rose-200 block">Total Enrolled</span>
              <span className="text-2xl font-extrabold font-mono text-white">{students.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search defaulter by Name, Roll Number, or UID..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Divisions</option>
            <option value="TYIT - Div A">TYIT - Div A</option>
            <option value="TYIT - Div B">TYIT - Div B</option>
          </select>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Notice</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm hover:shadow transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Notice CSV</span>
          </button>
        </div>
      </div>

      {/* Defaulters Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredDefaulters.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={CheckCircle}
              title="No Defaulters Found"
              description="Excellent! All students currently satisfy the 75% attendance criteria in this category."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-rose-50/70 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/60 font-bold uppercase tracking-wider text-[11px] text-rose-900 dark:text-rose-300">
                  <th className="py-3.5 px-4 w-14">Roll</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Division / Class</th>
                  <th className="py-3.5 px-4">RFID UID</th>
                  <th className="py-3.5 px-4">Present / Total Days</th>
                  <th className="py-3.5 px-4">Attendance %</th>
                  <th className="py-3.5 px-4">Shortage</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredDefaulters.map((st) => {
                  const requiredLectures = Math.ceil((threshold / 100) * st.totalWorkingDays);
                  const lecturesNeeded = Math.max(0, requiredLectures - st.presentCount);

                  return (
                    <tr 
                      key={st.uid}
                      className="hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition cursor-pointer"
                      onClick={() => navigateTo('student-details', st)}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {st.roll}
                      </td>
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {st.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {st.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {st.division || 'TYIT'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {formatUid(st.uid)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{st.presentCount}</span>
                        <span className="text-slate-400"> / {st.totalWorkingDays} days</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-rose-500 h-full rounded-full" 
                              style={{ width: `${st.percentage}%` }}
                            />
                          </div>
                          <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                            {st.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded-md">
                          Short by {lecturesNeeded} lectures
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast(`Parent notice dispatched for ${st.name} (Roll ${st.roll})`, 'info');
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:text-white hover:bg-rose-600 dark:text-rose-400 dark:hover:bg-rose-600 border border-rose-200 dark:border-rose-800 rounded-lg transition"
                        >
                          Issue Notice
                        </button>
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
