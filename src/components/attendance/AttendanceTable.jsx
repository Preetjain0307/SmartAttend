import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  Calendar,
  User,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatUid, extractRecordDateTime } from '../../utils/formatting';
import { exportAttendanceToCsv } from '../../utils/exportCsv';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

export default function AttendanceTable() {
  const { attendance, students, showToast } = useApp();

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [studentFilter, setStudentFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [sortField, setSortField] = useState('none'); // 'roll' | 'name' | 'time'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered & Sorted records
  const filteredRecords = useMemo(() => {
    return attendance.filter((rec) => {
      // 1. Search query (Roll, Name, UID)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const rollMatch = String(rec.roll || '').toLowerCase().includes(q);
        const nameMatch = String(rec.name || '').toLowerCase().includes(q);
        const uidMatch = formatUid(rec.uid || '').toLowerCase().includes(q);
        if (!rollMatch && !nameMatch && !uidMatch) return false;
      }

      // 2. Status filter
      if (statusFilter !== 'ALL') {
        const recStatus = String(rec.status || 'Present').toLowerCase();
        if (recStatus !== statusFilter.toLowerCase()) return false;
      }

      // 3. Student filter by UID
      if (studentFilter !== 'ALL') {
        if (formatUid(rec.uid) !== formatUid(studentFilter)) return false;
      }

      // 4. Date filter (if timestamp/date exists)
      if (dateFilter) {
        const dt = extractRecordDateTime(rec);
        if (dt.hasTimestamp && dt.dateObj) {
          const recordDateStr = dt.dateObj.toISOString().split('T')[0];
          if (recordDateStr !== dateFilter) return false;
        } else if (!dt.hasTimestamp) {
          // If filtering by specific date, legacy records without timestamp are excluded
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortField === 'roll') {
        const numA = parseInt(a.roll, 10);
        const numB = parseInt(b.roll, 10);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortOrder === 'asc' ? numA - numB : numB - numA;
        }
        return sortOrder === 'asc' 
          ? String(a.roll || '').localeCompare(String(b.roll || ''))
          : String(b.roll || '').localeCompare(String(a.roll || ''));
      }
      if (sortField === 'name') {
        return sortOrder === 'asc'
          ? String(a.name || '').localeCompare(String(b.name || ''))
          : String(b.name || '').localeCompare(String(a.name || ''));
      }
      return 0;
    });
  }, [attendance, searchQuery, statusFilter, studentFilter, dateFilter, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Handle Sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Attendance data synchronized with Firebase', 'info');
    }, 500);
  };

  const handleExport = () => {
    exportAttendanceToCsv(filteredRecords, `smartattend_records_${new Date().toISOString().slice(0,10)}.csv`);
    showToast(`Exported ${filteredRecords.length} attendance records to CSV`, 'success');
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by student name, roll number, or RFID UID..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
            />
          </div>

          {/* Action Buttons: Refresh & Export */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
              title="Refresh attendance records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm hover:shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Present">Present Only</option>
              <option value="Absent">Absent Only</option>
            </select>
          </div>

          {/* Student Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium whitespace-nowrap">Student:</span>
            <select
              value={studentFilter}
              onChange={(e) => { setStudentFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 truncate"
            >
              <option value="ALL">All Students</option>
              {students.map((st) => (
                <option key={st.uid} value={st.uid}>
                  {st.name} (Roll {st.roll})
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium whitespace-nowrap">Date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="p-8">
            <EmptyState 
              icon={Filter}
              title="No Attendance Matches"
              description="No attendance records found matching your current filter criteria."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setStudentFilter('ALL');
                setDateFilter('');
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
                  <th className="py-3 px-4 w-12">#</th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                    onClick={() => handleSort('roll')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Roll Number</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Student Name</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">RFID Card UID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Device Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {paginatedRecords.map((record, index) => {
                  const absoluteIndex = (currentPage - 1) * pageSize + index + 1;
                  const dt = extractRecordDateTime(record);
                  return (
                    <tr 
                      key={record.id || index}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {absoluteIndex}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {record.roll || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {record.name || 'Unknown Student'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-600 dark:text-slate-400 text-[11px]">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          {formatUid(record.uid)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={record.status || 'Present'} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {dt.hasTimestamp ? (
                          dt.date
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Not available</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {dt.hasTimestamp ? (
                          <span className="font-medium font-mono text-[11px]">{dt.time}</span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Not available</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {record.device || 'SmartAttend ESP8266'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer: Pagination & Counts */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredRecords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to <strong className="text-slate-900 dark:text-white">{Math.min(currentPage * pageSize, filteredRecords.length)}</strong> of <strong className="text-slate-900 dark:text-white">{filteredRecords.length}</strong> records
            </span>
            
            <div className="flex items-center gap-1.5">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Page controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
