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
 * Decodes the millisecond timestamp embedded in a Firebase Push ID (e.g. "-Nxyz123...")
 */
export function decodeFirebasePushIdTime(id) {
  if (!id || typeof id !== 'string' || id.length < 8) return null;
  const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
  let timestamp = 0;
  for (let i = 0; i < 8; i++) {
    const c = id.charAt(i);
    const charIndex = PUSH_CHARS.indexOf(c);
    if (charIndex === -1) return null;
    timestamp = timestamp * 64 + charIndex;
  }
  // Sanity check: valid timestamp between Jan 1 2020 and Jan 1 2035
  if (timestamp > 1577836800000 && timestamp < 2051222400000) {
    return timestamp;
  }
  return null;
}

/**
 * Safely extracts human-readable date & time strings from an attendance record.
 * Supports explicit timestamps, field aliases (scanTime, scannedAt, etc.),
 * explicit date/time strings, and automatic Firebase Push ID decoding.
 */
export function extractRecordDateTime(record) {
  if (!record) {
    return { date: 'Not available', time: 'Not available', hasTimestamp: false, raw: null };
  }

  // Check possible timestamp fields across different ESP8266 & server implementations
  let rawTs = record.timestamp || 
              record.time_stamp || 
              record.createdAt || 
              record.created_at ||
              record.date_time || 
              record.dateTime ||
              record.scanTime ||
              record.scan_time ||
              record.scannedAt ||
              record.scanned_at ||
              record.time_of_scan ||
              record.timeOfScan ||
              record.scan_timestamp ||
              record.ts;

  // Fallback: decode timestamp from Firebase push key (e.g. record.id = "-O...")
  if (!rawTs && record.id) {
    const pushTime = decodeFirebasePushIdTime(record.id);
    if (pushTime) {
      rawTs = pushTime;
    }
  }
  
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

  // Legacy records without any timestamp
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
