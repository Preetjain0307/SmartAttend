import React from 'react';
import { Radio, Zap, UserCheck, ShieldCheck, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatUid, extractRecordDateTime } from '../../utils/formatting';
import StatusBadge from '../common/StatusBadge';

export default function LiveScanFeed() {
  const { stats, newScanAlert, isFirebaseConnected } = useApp();
  const latest = stats.latestScan;

  if (!latest) {
    return (
      <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live RFID Reader
            </h4>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Awaiting RFID Card Tap on RC522...
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full font-medium">
          Ready
        </span>
      </div>
    );
  }

  const dt = extractRecordDateTime(latest);
  const isHighlight = Boolean(newScanAlert);

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-slate-900 border transition-all duration-500 shadow-sm ${
      isHighlight 
        ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/20 dark:bg-brand-950/20' 
        : 'border-slate-200 dark:border-slate-800'
    }`}>
      {isHighlight && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-indigo-500 to-brand-500 animate-pulse" />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Scan information */}
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform duration-300 ${
            isHighlight 
              ? 'bg-gradient-to-tr from-brand-600 to-indigo-600 scale-105 rfid-pulse' 
              : 'bg-gradient-to-tr from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-700'
          }`}>
            <Radio className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-0.5 rounded-md">
                Latest RFID Scan
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-950/80 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Zap className="w-3 h-3 text-violet-500" />
                <span>Today's Taps: <strong className="font-mono">{stats.todayTotalTaps}</strong></span>
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-mono font-medium flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                <span>{dt.time}</span>
                <span className="text-[10px] text-slate-400 font-normal">({dt.date})</span>
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {latest.name || 'Unknown Student'}
              </h3>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                (Roll: {latest.roll || 'N/A'})
              </span>
            </div>
          </div>
        </div>

        {/* Right: RFID UID & Status */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">
              RFID Card UID
            </p>
            <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {formatUid(latest.uid)}
            </p>
          </div>

          <StatusBadge status={latest.status || 'Present'} size="lg" />
        </div>
      </div>
    </div>
  );
}
