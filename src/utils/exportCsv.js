import { extractRecordDateTime, formatUid } from './formatting';

/**
 * Generates and downloads a CSV file in the browser
 */
export function exportAttendanceToCsv(records, filename = 'smartattend_attendance_export.csv') {
  if (!records || records.length === 0) {
    alert('No attendance records available to export.');
    return;
  }

  // Headers matching requirement: Roll Number, Name, UID, Status, Date, Time, Device
  const headers = ['Roll Number', 'Student Name', 'RFID UID', 'Status', 'Date', 'Time', 'Device'];

  const rows = records.map((rec) => {
    const dt = extractRecordDateTime(rec);
    return [
      escapeCsvField(rec.roll || ''),
      escapeCsvField(rec.name || 'Unknown Student'),
      escapeCsvField(formatUid(rec.uid || '')),
      escapeCsvField(rec.status || 'Present'),
      escapeCsvField(dt.hasTimestamp ? dt.date : ''),
      escapeCsvField(dt.hasTimestamp ? dt.time : ''),
      escapeCsvField(rec.device || 'SmartAttend ESP8266')
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');

  downloadCsvFile(csvContent, filename);
}

/**
 * Exports students list to CSV
 */
export function exportStudentsToCsv(students, filename = 'smartattend_students_list.csv') {
  if (!students || students.length === 0) {
    alert('No student records available to export.');
    return;
  }

  const headers = ['Roll Number', 'Student Name', 'RFID UID', 'Total Attendance', 'Percentage', 'Status'];

  const rows = students.map((s) => [
    escapeCsvField(s.roll || ''),
    escapeCsvField(s.name || ''),
    escapeCsvField(formatUid(s.uid || '')),
    escapeCsvField(s.totalAttendance || 0),
    escapeCsvField(`${s.percentage || 0}%`),
    escapeCsvField(s.status || 'Active')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');

  downloadCsvFile(csvContent, filename);
}

function escapeCsvField(val) {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsvFile(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
