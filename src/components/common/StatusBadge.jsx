import React from 'react';

export default function StatusBadge({ status, size = 'sm' }) {
  const normalized = String(status || '').trim().toLowerCase();

  const isPresent = normalized === 'present';
  const isAbsent = normalized === 'absent';
  const isActive = normalized === 'active';
  const isOnline = normalized === 'online' || normalized === 'connected';

  let colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
  let dotColor = 'bg-slate-400';

  if (isPresent || isActive || isOnline) {
    colorClasses = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
    dotColor = 'bg-emerald-500';
  } else if (isAbsent) {
    colorClasses = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
    dotColor = 'bg-rose-500';
  }

  const sizeClasses = size === 'lg' 
    ? 'px-3 py-1 text-sm font-semibold' 
    : 'px-2.5 py-0.5 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${colorClasses} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      {status || 'Unknown'}
    </span>
  );
}
