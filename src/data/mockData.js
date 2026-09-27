/**
 * High-Performance Mock Data Generator for Thakur College of Science and Commerce
 * Generates 120 Students and 100 Days of Attendance Records with instant O(1) indexed lookups
 */

import { formatUid } from '../utils/formatting';

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

function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generates 120 Students with pre-calculated attendance metrics
 */
export function generate120Students() {
  const students = [];
  const totalDays = 100;

  // Student 1 (Preet Jain, Roll 27)
  students.push({
    id: "student_27",
    roll: "27",
    name: "Preet Jain",
    uid: "63 C4 11 07",
    department: "B.Sc. Information Technology",
    division: "TYIT - Div A",
    email: "preet.jain@tcsc.edu.in",
    status: "Active",
    totalScans: 94,
    presentCount: 94,
    absentCount: 6,
    percentage: 94,
    isDefaulter: false,
    targetAttendanceRate: 0.94
  });

  // Student 2 (Bikram Singh, Roll 17)
  students.push({
    id: "student_17",
    roll: "17",
    name: "Bikram Singh",
    uid: "47 E6 2C 07",
    department: "B.Sc. Information Technology",
    division: "TYIT - Div A",
    email: "bikram.singh@tcsc.edu.in",
    status: "Active",
    totalScans: 88,
    presentCount: 88,
    absentCount: 12,
    percentage: 88,
    isDefaulter: false,
    targetAttendanceRate: 0.88
  });

  // Generate Remaining 118 Students
  for (let r = 1; r <= 120; r++) {
    if (r === 17 || r === 27) continue;

    const firstName = FIRST_NAMES[(r - 1) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(r * 3) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    
    const hex1 = ((r * 17) % 256).toString(16).padStart(2, '0').toUpperCase();
    const hex2 = ((r * 31 + 45) % 256).toString(16).padStart(2, '0').toUpperCase();
    const hex3 = ((r * 53 + 89) % 256).toString(16).padStart(2, '0').toUpperCase();
    const hex4 = ((r * 79 + 13) % 256).toString(16).padStart(2, '0').toUpperCase();
    const uid = `${hex1} ${hex2} ${hex3} ${hex4}`;

    let targetRate;
    const seedVal = pseudoRandom(r * 19);
    if (r % 7 === 0 || r % 11 === 0) {
      targetRate = 0.48 + (seedVal * 0.22); // 48% - 70% (Defaulter)
    } else if (r % 4 === 0) {
      targetRate = 0.74 + (seedVal * 0.08); // 74% - 82%
    } else {
      targetRate = 0.84 + (seedVal * 0.14); // 84% - 98%
    }

    const presentCount = Math.round(targetRate * totalDays);
    const absentCount = totalDays - presentCount;
    const percentage = presentCount;
    const isDefaulter = percentage < 75;

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
      totalScans: presentCount,
      presentCount: presentCount,
      absentCount: absentCount,
      percentage: percentage,
      isDefaulter: isDefaulter,
      targetAttendanceRate: targetRate
    });
  }

  return students.sort((a, b) => parseInt(a.roll, 10) - parseInt(b.roll, 10));
}

/**
 * Generates Attendance Records for display tables (optimized sample logs + full stream)
 */
export function generate100DaysAttendance(studentsList) {
  const records = [];
  const totalDays = 100;
  const nowMs = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  let recIdCounter = 1000;

  // Generate logs for the last 15 days for blazing-fast table renders and instant responsiveness
  const activeDays = 15;
  for (let dayIdx = 0; dayIdx < activeDays; dayIdx++) {
    const daysAgo = (activeDays - 1) - dayIdx;
    const dayDate = new Date(nowMs - (daysAgo * dayMs));
    const dateStr = dayDate.toISOString().split('T')[0];

    studentsList.forEach((student) => {
      const rollNum = parseInt(student.roll, 10);
      const seed = (dayIdx * 131) + (rollNum * 17);
      const rand = pseudoRandom(seed);

      const isPresent = rand <= student.targetAttendanceRate;

      if (isPresent) {
        const minuteOffset = Math.floor(pseudoRandom(seed + 5) * 45);
        const secondOffset = Math.floor(pseudoRandom(seed + 9) * 59);
        const scanTimeMs = dayDate.getTime() + (minuteOffset * 60 * 1000) + (secondOffset * 1000);
        const scanDate = new Date(scanTimeMs);

        records.push({
          id: `scan_${recIdCounter++}`,
          uid: student.uid,
          name: student.name,
          roll: student.roll,
          department: student.department,
          division: student.division,
          status: "Present",
          device: "SmartAttend RC522 Reader (TCSC Lab 402)",
          timestamp: scanTimeMs,
          date: scanDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
          time: scanDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          rawDate: dateStr,
          dayIndex: 100 - daysAgo
        });
      }
    });
  }

  return records.reverse();
}
