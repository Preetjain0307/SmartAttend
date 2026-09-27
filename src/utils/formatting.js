/**
 * SmartAttend Utilities for formatting RFID and Attendance data
 */

/**
 * Normalizes RFID UID to standard uppercase format (e.g., "63 C4 11 07")
 */
export function formatUid(uid) {
  if (!uid) return 'UNKNOWN UID';
  const clean = String(uid).trim().toUpperCase();
  // If it's already spaced like "63 C4 11 07", return it
  if (clean.includes(' ')) return clean;
  // If it's continuous hex string like "63C41107", space every 2 chars
  return clean.match(/.{1,2}/g)?.join(' ') || clean;
}

/**
 * Safely extracts human-readable date & time strings from an attendance record.
 * Important: If no timestamp exists in the record (like legacy ESP8266 records),
 * it returns { date: 'Not available', time: 'Not available', hasTimestamp: false }.
 */
export function extractRecordDateTime(record) {
  if (!record) {
    return { date: 'Not available', time: 'Not available', hasTimestamp: false, raw: null };
  }

  // Check possible timestamp fields
  const rawTs = record.timestamp || record.time_stamp || record.createdAt || record.date_time || record.dateTime;
  
  if (rawTs) {
    try {
      const d = new Date(typeof rawTs === 'number' ? rawTs : (isNaN(Number(rawTs)) ? rawTs : Number(rawTs)));
      if (!isNaN(d.getTime())) {
        return {
          date: d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
          time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          full: d.toLocaleString(),
          hasTimestamp: true,
          dateObj: d,
          raw: rawTs
        };
      }
    } catch (e) {
      // ignore parsing error
    }
  }

  // Check explicit date and time fields if provided as strings
  if (record.date || record.time) {
    return {
      date: record.date || 'Not available',
      time: record.time || 'Not available',
      full: `${record.date || ''} ${record.time || ''}`.trim(),
      hasTimestamp: true,
      raw: null
    };
  }

  // Legacy records without timestamp
  return {
    date: 'Not available',
    time: 'Not available',
    full: 'Not available (Legacy record)',
    hasTimestamp: false,
    raw: null
  };
}

/**
 * Calculates student attendance percentage safely
 */
export function calculateAttendancePercentage(presentCount, totalDays) {
  if (!totalDays || totalDays <= 0) return 0;
  return Math.min(100, Math.round((presentCount / totalDays) * 100));
}

/**
 * Sanitizes Firebase key for safe path usage (e.g. UID strings with spaces or special chars)
 */
export function sanitizeFirebaseKey(str) {
  if (!str) return 'unknown';
  return String(str).replace(/[.#$[\]/ ]/g, '_');
}
