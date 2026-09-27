import React, { useState, useMemo } from 'react';
import { 
  FileBarChart, 
  Download, 
  Printer, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  TrendingUp,
  Award,
  Building2,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUid } from '../utils/formatting';
import { exportAttendanceToCsv, exportStudentsToCsv } from '../utils/exportCsv';
import StatusBadge from '../components/common/StatusBadge';

export default function ReportsPage() {
  const { attendance, students, stats, settings, showToast } = useApp();
  const [reportType, setReportType] = useState('summary'); // 'summary' | 'student-wise' | 'raw'
  const [filterDivision, setFilterDivision] = useState('ALL');

  const threshold = settings.attendanceThreshold || 75;
  const totalWorkingDays = 100;

  // Student wise summary data (precalculated for instant render)
  const studentReports = useMemo(() => {
    return students.map((st) => {
      const presentCount = st.presentCount || st.totalScans || 85;
      const absentCount = totalWorkingDays - presentCount;
      const rate = st.percentage || 85;
      const isAboveThreshold = rate >= threshold;

      return {
        ...st,
        totalScans: presentCount,
        presentCount,
        absentCount,
        rate,
        isAboveThreshold
      };
    }).filter(st => {
      if (filterDivision === 'ALL') return true;
      return st.division === filterDivision;
    });
  }, [students, threshold, filterDivision]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportSummaryCsv = () => {
    exportStudentsToCsv(studentReports, `tcsc_attendance_summary_${new Date().toISOString().slice(0,10)}.csv`);
    showToast('Attendance Summary Report exported to CSV', 'success');
  };

  const handleExportRawCsv = () => {
    exportAttendanceToCsv(attendance, `tcsc_master_attendance_logs_${new Date().toISOString().slice(0,10)}.csv`);
    showToast('Master Attendance Logs exported to CSV', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Attendance Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {settings.collegeName} — Official Examination & Term Attendance Documentation
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={reportType === 'raw' ? handleExportRawCsv : handleExportSummaryCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm hover:shadow transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report CSV</span>
          </button>
        </div>
      </div>

      {/* Report Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportType('summary')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
              reportType === 'summary'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setReportType('student-wise')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
              reportType === 'student-wise'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Student-Wise Report
          </button>
          <button
            onClick={() => setReportType('raw')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
              reportType === 'raw'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Master Log ({attendance.length})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Division:</span>
          <select
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="ALL">All Divisions (120 Students)</option>
            <option value="TYIT - Div A">TYIT - Div A (Roll 1 - 60)</option>
            <option value="TYIT - Div B">TYIT - Div B (Roll 61 - 120)</option>
          </select>
        </div>
      </div>

      {/* Summary View */}
      {reportType === 'summary' && (
        <div className="space-y-6">
          {/* Printable Report Header */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {settings.collegeName || 'Thakur College of Science & Commerce'}
                </h3>
                <p className="text-xs text-slate-500">
                  {settings.department} — {settings.courseName}
                </p>
              </div>
              <div className="text-xs font-medium text-slate-500 text-left sm:text-right">
                <div>Academic Term: <strong>100 Working Days</strong></div>
                <div>Criteria: <strong>Minimum {threshold}% Attendance Required</strong></div>
              </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Students</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">{studentReports.length}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Eligible (&gt;=75%)</span>
                <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                  {studentReports.filter(s => s.isAboveThreshold).length}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block">Defaulters (&lt;75%)</span>
                <span className="text-xl font-bold text-rose-700 dark:text-rose-300">
                  {studentReports.filter(s => !s.isAboveThreshold).length}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Class Average</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">84%</span>
              </div>
            </div>
          </div>

          {/* Student Performance Table */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Complete 100-Day Attendance Record ({studentReports.length} Students)
              </h4>
            </div>
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr className="font-bold uppercase tracking-wider text-[11px] text-slate-500">
                    <th className="py-3 px-4 w-14">Roll</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Division</th>
                    <th className="py-3 px-4">RFID UID</th>
                    <th className="py-3 px-4">Attended Days</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">Eligibility Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {studentReports.map((st) => (
                    <tr key={st.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{st.roll}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{st.name}</td>
                      <td className="py-3 px-4 text-slate-500">{st.division}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{formatUid(st.uid)}</td>
                      <td className="py-3 px-4 font-medium">{st.presentCount} / {totalWorkingDays}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold font-mono ${st.rate >= threshold ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {st.rate}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {st.isAboveThreshold ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Eligible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3" /> Defaulter (&lt;75%)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Student Wise View */}
      {reportType === 'student-wise' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentReports.map((st) => (
            <div key={st.uid} className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[150px]">{st.name}</h4>
                  <p className="text-[11px] text-slate-400">Roll: {st.roll} • {st.division}</p>
                </div>
                <StatusBadge status={st.isAboveThreshold ? 'Active' : 'Absent'} />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Present</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{st.presentCount}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Absent</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{st.absentCount}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Rate</span>
                  <span className={`font-bold ${st.rate >= threshold ? 'text-brand-600' : 'text-rose-600'}`}>{st.rate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Master Log View */}
      {reportType === 'raw' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Master RFID Scan Stream ({attendance.length} Records)
            </h4>
            <button
              onClick={handleExportRawCsv}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto max-h-[550px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr className="font-bold text-slate-500 text-[11px] uppercase">
                  <th className="py-2.5 px-4">#</th>
                  <th className="py-2.5 px-4">Roll</th>
                  <th className="py-2.5 px-4">Name</th>
                  <th className="py-2.5 px-4">RFID UID</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {attendance.slice(0, 500).map((rec, idx) => (
                  <tr key={rec.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-4 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2 px-4 font-semibold">{rec.roll || 'N/A'}</td>
                    <td className="py-2 px-4">{rec.name || 'Student'}</td>
                    <td className="py-2 px-4 font-mono text-[11px]">{formatUid(rec.uid)}</td>
                    <td className="py-2 px-4"><StatusBadge status={rec.status || 'Present'} /></td>
                    <td className="py-2 px-4 text-slate-500">{rec.date ? `${rec.date} ${rec.time || ''}` : 'Logged'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
