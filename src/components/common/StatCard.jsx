import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend, highlight }) {
  const colorMap = {
    blue: {
      bg: 'from-blue-500/10 to-indigo-500/5',
      border: 'border-blue-200 dark:border-blue-900/40',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
      text: 'text-blue-600 dark:text-blue-400'
    },
    emerald: {
      bg: 'from-emerald-500/10 to-teal-500/5',
      border: 'border-emerald-200 dark:border-emerald-900/40',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
    rose: {
      bg: 'from-rose-500/10 to-pink-500/5',
      border: 'border-rose-200 dark:border-rose-900/40',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
      text: 'text-rose-600 dark:text-rose-400'
    },
    violet: {
      bg: 'from-violet-500/10 to-purple-500/5',
      border: 'border-violet-200 dark:border-violet-900/40',
      iconBg: 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400',
      text: 'text-violet-600 dark:text-violet-400'
    },
    amber: {
      bg: 'from-amber-500/10 to-orange-500/5',
      border: 'border-amber-200 dark:border-amber-900/40',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
      text: 'text-amber-600 dark:text-amber-400'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${scheme.bg} bg-white dark:bg-slate-900/90 border ${scheme.border} shadow-sm hover:shadow-md transition-all duration-200 group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {value}
            </h3>
            {trend && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-3.5 rounded-2xl ${scheme.iconBg} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {highlight && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-75" />
      )}
    </div>
  );
}
