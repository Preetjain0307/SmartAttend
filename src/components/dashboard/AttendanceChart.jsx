import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatUid } from '../../utils/formatting';

export default function AttendanceChart() {
  const { stats, students, attendance, settings } = useApp();

  // Donut Chart: Eligible vs Defaulters
  const pieData = [
    { name: `Eligible (>= ${settings.attendanceThreshold || 75}%)`, value: stats.eligibleCount || 102, color: '#10b981' },
    { name: `Defaulter (< ${settings.attendanceThreshold || 75}%)`, value: stats.defaultersCount || 18, color: '#f43f5e' }
  ];

  // Distribution chart across sample students
  const sampleStudents = students.slice(0, 15).map((st) => {
    const studentScans = attendance.filter(a => formatUid(a.uid) === formatUid(st.uid));
    const percentage = Math.round((studentScans.length / 100) * 100);
    return {
      name: `R-${st.roll} ${st.name.split(' ')[0]}`,
      fullName: st.name,
      roll: st.roll,
      scans: studentScans.length,
      percentage: percentage,
      isDefaulter: percentage < (settings.attendanceThreshold || 75)
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Attendance Eligibility Donut Chart */}
      <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Eligibility Breakdown
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Based on Mumbai University 75% Rule
          </p>
        </div>

        <div className="h-44 relative flex items-center justify-center my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  backgroundColor: '#0f172a', 
                  color: '#fff', 
                  border: 'none',
                  fontSize: '12px' 
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {Math.round((stats.eligibleCount / (stats.totalRegistered || 120)) * 100)}%
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Eligible
            </span>
          </div>
        </div>

        <div className="flex items-center justify-around pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Eligible:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.eligibleCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-400">Defaulters:</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">{stats.defaultersCount}</span>
          </div>
        </div>
      </div>

      {/* Student Attendance % Distribution Bar Chart */}
      <div className="lg:col-span-2 rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Student Attendance Distribution (100 Working Days)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Attendance percentage per roll number (Sample View: Roll 1 - 15)
          </p>
        </div>

        <div className="h-44 my-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sampleStudents} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
              <Tooltip 
                formatter={(val, name, item) => [`${val}% Attendance (${item.payload.scans} / 100 Days)`, `${item.payload.fullName} (Roll: ${item.payload.roll})`]}
                contentStyle={{ 
                  borderRadius: '12px', 
                  backgroundColor: '#0f172a', 
                  color: '#fff', 
                  border: 'none',
                  fontSize: '12px' 
                }} 
              />
              <Bar dataKey="percentage" radius={[5, 5, 0, 0]}>
                {sampleStudents.map((entry, index) => (
                  <Cell 
                    key={`bar-${index}`} 
                    fill={entry.percentage >= (settings.attendanceThreshold || 75) ? '#2563eb' : '#f43f5e'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-brand-600" />
              <span>Eligible (&gt;= 75%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span>Defaulter (&lt; 75%)</span>
            </span>
          </div>
          <span>Total Database Logs: <strong className="text-slate-800 dark:text-slate-200">{attendance.length}</strong></span>
        </div>
      </div>
    </div>
  );
}
