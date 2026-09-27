import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Percent, 
  Building2,
  Calendar,
  AlertTriangle,
  Award,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/common/StatCard';
import LiveScanFeed from '../components/dashboard/LiveScanFeed';
import AttendanceChart from '../components/dashboard/AttendanceChart';
import RecentScansTable from '../components/dashboard/RecentScansTable';
import DefaultersSummaryCard from '../components/dashboard/DefaultersSummaryCard';
import { CardSkeleton, TableSkeleton } from '../components/common/LoadingSkeleton';

export default function Dashboard() {
  const { stats, loading, settings, navigateTo } = useApp();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Thakur College Branding */}
      <div className="rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-brand-700 via-brand-800 to-indigo-900 text-white shadow-xl shadow-brand-700/10 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Smart RFID Attendance Portal Active</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              {settings.collegeName || 'Thakur College of Science & Commerce'}
            </h1>
            <p className="text-xs lg:text-sm text-brand-100 max-w-xl">
              {settings.department} • {settings.courseName} — 100 Working Days Attendance Master Records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div 
              onClick={() => navigateTo('students')}
              className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center cursor-pointer hover:bg-white/15 transition"
            >
              <span className="text-[10px] uppercase font-bold text-brand-200 block">Total Enrolled</span>
              <span className="text-xl font-bold font-mono">{stats.totalRegistered} Students</span>
            </div>
            <div 
              onClick={() => navigateTo('defaulters')}
              className="px-4 py-3 rounded-2xl bg-rose-500/20 backdrop-blur-md border border-rose-400/30 text-center cursor-pointer hover:bg-rose-500/30 transition"
            >
              <span className="text-[10px] uppercase font-bold text-rose-200 block">Defaulters (&lt;75%)</span>
              <span className="text-xl font-bold font-mono text-rose-300">{stats.defaultersCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Today's Card Scans"
          value={stats.todayTotalTaps}
          subtitle="Total RFID card taps today"
          icon={Radio}
          color="violet"
          trend="Live Counter"
          highlight={true}
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          subtitle="Unique students present"
          icon={UserCheck}
          color="emerald"
          trend={`${stats.todayPercentage}% today`}
        />
        <StatCard
          title="Absent Today"
          value={stats.absentToday}
          subtitle="Students absent today"
          icon={UserX}
          color="rose"
        />
        <StatCard
          title="Total Students"
          value={stats.totalRegistered}
          subtitle="Enrolled in TYIT & CS"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Eligible Students"
          value={stats.eligibleCount}
          subtitle={`Satisfying >= ${settings.attendanceThreshold || 75}%`}
          icon={Award}
          color="emerald"
        />
      </div>

      {/* Live Scan Monitor Bar */}
      <LiveScanFeed />

      {/* Charts Section */}
      <AttendanceChart />

      {/* Bottom Grid: Recent Scans & Defaulters Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentScansTable limit={8} />
        </div>
        <div>
          <DefaultersSummaryCard />
        </div>
      </div>
    </div>
  );
}
