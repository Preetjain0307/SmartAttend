import { ref, onValue, get, set, remove, update } from 'firebase/database';
import { database, initError } from './config';
import { sanitizeFirebaseKey, formatUid } from '../utils/formatting';

const STUDENTS_PATH = 'students';

// Default initial students specified in project overview
export const DEFAULT_STUDENTS = [
  {
    uid: "63 C4 11 07",
    name: "Preet Jain",
    roll: "27",
    department: "Computer Science / IoT",
    email: "preet.jain@college.edu",
    status: "Active"
  },
  {
    uid: "47 E6 2C 07",
    name: "Bikram",
    roll: "17",
    department: "Computer Science / IoT",
    email: "bikram@college.edu",
    status: "Active"
  }
];

/**
 * Subscribes to real-time updates of registered students
 */
export function subscribeToStudents(onData, onError) {
  if (!database) {
    if (onError) onError(initError || new Error("Firebase database not initialized"));
    return () => {};
  }

  const studentsRef = ref(database, STUDENTS_PATH);

  return onValue(
    studentsRef,
    (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        // Return empty or fallback
        onData([]);
        return;
      }

      const list = [];
      Object.keys(val).forEach((key) => {
        const item = val[key];
        if (item && typeof item === 'object') {
          list.push({
            id: key,
            ...item,
            uid: formatUid(item.uid || key)
          });
        }
      });

      // Sort students by Roll number numerically if possible, or name
      list.sort((a, b) => {
        const numA = parseInt(a.roll, 10);
        const numB = parseInt(b.roll, 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return (a.name || '').localeCompare(b.name || '');
      });

      onData(list);
    },
    (error) => {
      console.error("Firebase students subscription error:", error);
      if (onError) onError(error);
    }
  );
}

/**
 * Seeds initial student records if `/students` node is empty in Firebase
 */
export async function seedDefaultStudentsIfEmpty() {
  if (!database) return;

  try {
    const studentsRef = ref(database, STUDENTS_PATH);
    const snapshot = await get(studentsRef);
    if (!snapshot.exists() || !snapshot.val()) {
      for (const student of DEFAULT_STUDENTS) {
        const key = sanitizeFirebaseKey(student.uid);
        await set(ref(database, `${STUDENTS_PATH}/${key}`), student);
      }
    }
  } catch (err) {
    console.warn("Could not seed default students to Firebase:", err.message);
  }
}

/**
 * Registers a new student or updates an existing one
 */
export async function saveStudent(studentData) {
  if (!database) throw initError || new Error("Firebase database not initialized");

  const formattedUid = formatUid(studentData.uid);
  const key = sanitizeFirebaseKey(formattedUid);

  const payload = {
    uid: formattedUid,
    name: studentData.name.trim(),
    roll: studentData.roll.trim(),
    department: studentData.department?.trim() || 'IoT Lab',
    email: studentData.email?.trim() || '',
    status: studentData.status || 'Active',
    updatedAt: Date.now()
  };

  await set(ref(database, `${STUDENTS_PATH}/${key}`), payload);
  return { id: key, ...payload };
}

/**
 * Deletes a registered student record
 * Note: Does not delete attendance history, keeping records intact as required!
 */
export async function deleteStudent(studentId) {
  if (!database) throw initError || new Error("Firebase database not initialized");
  const studentRef = ref(database, `${STUDENTS_PATH}/${studentId}`);
  await remove(studentRef);
}
