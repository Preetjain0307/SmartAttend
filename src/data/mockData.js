/**
 * Mock Data Generator for Thakur College of Science and Commerce
 * Generates 120 Students and 100 Days of Real-World Attendance History
 */

import { formatUid } from '../utils/formatting';

// Realistic student names for Thakur College
const FIRST_NAMES = [
  "Preet", "Bikram", "Aarav", "Ananya", "Rohan", "Sneha", "Aditya", "Priya", "Rahul", "Pooja",
  "Karan", "Tanvi", "Sahil", "Riya", "Varun", "Neha", "Yash", "Ishita", "Akash", "Divya",
  "Manish", "Kavya", "Siddharth", "Simran", "Deepak", "Anjali", "Harsh", "Megha", "Gaurav", "Nisha",
  "Nikhil", "Shreya", "Kunal", "Bhavna", "Abhishek", "Komal", "Mayank", "Ritika", "Chirag", "Swati",
  "Pratik", "Sakshi", "Sumeet", "Pallavi", "Alok", "Aditi", "Vikas", "Rashmi", "Jatin", "Payal",
  "Omkar", "Akanksha", "Sanket", "Prachi", "Bhavesh", "Mansi", "Tejas", "Shruti", "Saurabh", "Sonali",
  "Tushar", "Priyanka", "Vivek", "Sonal", "Pranav", "Karishma", "Ashish", "Jyoti", "Hemant", "Rupal",
  "Sameer", "Monika", "Amol", "Kajal", "Dharmesh", "Nidhi", "Rajesh", "Poonam", "Vijay", "Aarti",
  "Sanjay", "Kiran", "Ajay", "Dipti", "Sunil", "Anita", "Pankaj", "Sheetal", "Mukesh", "Sarita",
  "Chetan", "Archana", "Nitin", "Deepika", "Paresh", "Vandana", "Hitesh", "Bhumika", "Jayesh", "Twinkle",
  "Ritesh", "Bijal", "Mihir", "Urvi", "Kalpesh", "Kinjal", "Shailesh", "Dhara", "Bharat", "Apeksha",
  "Mahesh", "Hetu", "Dinesh", "Krupa", "Suresh", "Mitali", "Ramesh", "Heena", "Girish", "Pragna"
];

const LAST_NAMES = [
  "Jain", "Singh", "Sharma", "Verma", "Patel", "Shah", "Mehta", "Gupta", "Mishra", "Pandey",
  "Yadav", "Tiwari", "Chauhan", "Joshi", "Deshmukh", "Kulkarni", "Patil", "Pawar", "Shinde", "More",
  "Gaikwad", "Sawant", "Thakur", "Rathore", "Choudhary", "Dubey", "Shukla", "Tripathi", "Dwivedi", "Pandit"
];

// Seeded random helper for consistent deterministic data
function pseudoRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/**
 * Generates 120 Students with proper Thakur College B.Sc. IT & CS data
 */
export function generate120Students() {
  const students = [];

  // Required Student 1 and Student 2
  students.push({
    id: "student_27",
    roll: "27",
    name: "Preet Jain",
    uid: "63 C4 11 07",
    department: "B.Sc. Information Technology",
    division: "TYIT - Div A",
    email: "preet.jain@tcsc.edu.in",
    status: "Active",
    targetAttendanceRate: 0.94 // 94% attendance (High Performer)
  });

  students.push({
    id: "student_17",
    roll: "17",
    name: "Bikram Singh",
    uid: "47 E6 2C 07",
    department: "B.Sc. Information Technology",
    division: "TYIT - Div A",
    email: "bikram.singh@tcsc.edu.in",
    status: "Active",
    targetAttendanceRate: 0.88 // 88% attendance
  });

  // Generate Remaining 118 Students (Roll 1 to 120, skipping 17 and 27)
  let count = 3;
  for (let r = 1; r <= 120; r++) {
    if (r === 17 || r === 27) continue;

    const firstName = FIRST_NAMES[(r - 1) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(r * 3) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    
    // Generate deterministic hex RFID UID (e.g. "8A 1F 3B 0C")
    const hex1 = ((r * 17) % 256).toString(16).padStart(2, '0').toUpperCase();
    const hex2 = ((r * 31 + 45) % 256).toString(16).padStart(2, '0').toUpperCase();
    const hex3 = ((r * 53 + 89) % 256).toString(16).padStart(2, '0').toUpperCase();
    const hex4 = ((r * 79 + 13) % 256).toString(16).padStart(2, '0').toUpperCase();
    const uid = `${hex1} ${hex2} ${hex3} ${hex4}`;

    // Attendance profile distribution:
    // ~15% Defaulters (< 75%, e.g., 40% - 70%)
    // ~25% Average (75% - 82%)
    // ~60% Regular / High (83% - 98%)
    let targetRate;
    const seedVal = pseudoRandom(r * 19);
    if (r % 7 === 0 || r % 11 === 0) {
      // Defaulter student (<75%)
      targetRate = 0.45 + (seedVal * 0.25); // 45% - 70%
    } else if (r % 4 === 0) {
      // Borderline student
      targetRate = 0.74 + (seedVal * 0.08); // 74% - 82%
    } else {
      // Good attendance
      targetRate = 0.84 + (seedVal * 0.14); // 84% - 98%
    }

    const division = r <= 60 ? "TYIT - Div A" : "TYIT - Div B";
    const department = r <= 60 ? "B.Sc. Information Technology" : "B.Sc. Computer Science";

    students.push({
      id: `student_${r}`,
      roll: String(r),
      name: fullName,
      uid: uid,
      department: department,
      division: division,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${r}@tcsc.edu.in`,
      status: "Active",
      targetAttendanceRate: targetRate
    });

    count++;
  }

  // Sort by Roll Number numerically
  return students.sort((a, b) => parseInt(a.roll, 10) - parseInt(b.roll, 10));
}

/**
 * Generates 100 Working Days of Attendance Records for all 120 students
 */
export function generate100DaysAttendance(studentsList) {
  const records = [];
  const totalDays = 100;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 140); // 140 calendar days ago to account for weekends

  const workingDates = [];
  let curDate = new Date(startDate);
  const today = new Date();

  // Find 100 working days (Mon-Fri / Sat)
  while (workingDates.length < totalDays && curDate <= today) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0) { // Exclude Sundays
      workingDates.push(new Date(curDate));
    }
    curDate.setDate(curDate.getDate() + 1);
  }

  let recIdCounter = 1000;

  workingDates.forEach((dayObj, dayIdx) => {
    const isToday = dayIdx === workingDates.length - 1;
    const dateStr = dayObj.toISOString().split('T')[0];

    studentsList.forEach((student, sIdx) => {
      // Deterministic pseudo-random roll check
      const seed = (dayIdx * 131) + (parseInt(student.roll, 10) * 17);
      const rand = pseudoRandom(seed);

      const isPresent = rand <= student.targetAttendanceRate;

      if (isPresent) {
        // Morning lecture time between 08:30 AM and 09:15 AM
        const minuteOffset = Math.floor(pseudoRandom(seed + 5) * 45);
        const secondOffset = Math.floor(pseudoRandom(seed + 9) * 59);
        const scanDate = new Date(dayObj);
        scanDate.setHours(8, 30 + minuteOffset, secondOffset);

        records.push({
          id: `scan_${recIdCounter++}`,
          uid: student.uid,
          name: student.name,
          roll: student.roll,
          department: student.department,
          division: student.division,
          status: "Present",
          device: "SmartAttend RC522 Reader (TCSC Lab 402)",
          timestamp: scanDate.getTime(),
          date: scanDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
          time: scanDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          rawDate: dateStr,
          dayIndex: dayIdx + 1
        });
      }
    });
  });

  // Reverse so the latest scans (most recent day) are first
  return records.reverse();
}
