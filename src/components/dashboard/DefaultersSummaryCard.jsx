import React from 'react';
import { AlertTriangle, ShieldCheck, ArrowRight, Users, Award, Percent } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DefaultersSummaryCard() {
  const { stats, settings, navigateTo } = useApp();

  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-lg relative overflow-hidden flex flex-col justify-between h-full">
      {/* Background ambient light */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Title */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Defaulters Monitoring
              </h4>
              <p className="text-xs text-slate-400">
                Threshold: &lt; {settings.attendanceThreshold || 75}%
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('defaulters')}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 inline-flex items-center gap-1"
          >
            <span>View List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">
              Defaulter Count
            </span>
            <span className="text-2xl font-extrabold font-mono text-rose-400">
              {stats.defaultersCount}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Below 75% Criteria
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
              Eligible Students
            </span>
            <span className="text-2xl font-extrabold font-mono text-emerald-400">
              {stats.eligibleCount}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Exam Hall-Ticket Ready
            </span>
          </div>
        </div>

        {/* Division Breakdown */}
        <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
          <div className="flex justify-between items-center text-slate-400">
            <span>TYIT - Division A:</span>
            <span className="font-semibold text-slate-200">86% Avg. Attendance</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>TYIT - Division B:</span>
            <span className="font-semibold text-slate-200">82% Avg. Attendance</span>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => navigateTo('defaulters')}
        className="w-full mt-4 py-2.5 px-4 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
      >
        <AlertTriangle className="w-4 h-4" />
        <span>Manage {stats.defaultersCount} Attendance Defaulters</span>
      </button>
    </div>
  );
}
