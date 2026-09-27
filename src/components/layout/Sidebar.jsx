import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Users, 
  FileBarChart, 
  AlertTriangle,
  Settings, 
  Radio, 
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { activeTab, navigateTo, isFirebaseConnected, stats, settings } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance Logs', icon: ClipboardCheck },
    { id: 'students', label: 'Students Roster', icon: Users, badge: `${stats.totalRegistered}` },
    { id: 'defaulters', label: 'Defaulters (<75%)', icon: AlertTriangle, alertBadge: `${stats.defaultersCount}` },
    { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 transition-all duration-300 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base text-slate-900 dark:text-white tracking-tight truncate">
                {settings.appName || 'SmartAttend'}
              </h1>
              <span className="px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-[10px] font-bold shrink-0">
                TCSC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium truncate">
              Thakur College (Kandivali)
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'students' && activeTab === 'student-details');

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25 dark:shadow-brand-600/15'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : item.alertBadge ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500 group-hover:text-brand-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}

              {item.alertBadge && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {item.alertBadge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* College Info Widget at Bottom */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <Building2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
              {settings.department || 'B.Sc. IT & CS'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>100 Working Days</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Semester V</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
