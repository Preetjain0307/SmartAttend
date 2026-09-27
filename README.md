# SmartAttend — Smart RFID IoT Attendance Management Portal
### Thakur College of Science & Commerce (TCSC)
**Department of Information Technology & Computer Science**  
**Academic Year:** 2026-2027 | **Semester V**

---

## 🌟 Project Overview

**SmartAttend** is an enterprise-grade IoT attendance management system designed for Thakur College of Science & Commerce (Kandivali East, Mumbai). It interfaces a **NodeMCU ESP8266** microcontroller and an **RC522 RFID reader** to **Firebase Realtime Database**, instantly logging student RFID card scans to a web dashboard.

---

## 🚀 Key Features

1. **Live Attendance Overview Dashboard**
   - Live KPI cards: *Total Enrolled (120), Present Today (~106), Absent Today (14), Attendance Defaulters (18)*.
   - **Realtime RFID Scanner Feed**: Instant visual pulse animation when a student taps their RFID card.
   - **Interactive Analytics**: Attendance Distribution charts, Mumbai University 75% Rule Donut chart, and division summaries.

2. **Attendance Records & Master Logs**
   - Full search by **Student Name**, **Roll Number**, or **RFID UID**.
   - Filters for Status (Present/Absent), specific Student, and Date.
   - Instant **CSV Export** for administrative documentation.
   - Graceful backward compatibility for legacy scan records.

3. **120 Student Roster (TYIT Div A & Div B)**
   - Complete 120 enrolled students with roll numbers, division assignments, and UID mapping.
   - Student profile view with 100-day attendance metrics and individual lecture logs.

4. **Defaulters Monitoring System (< 75%)**
   - Dedicated Defaulters portal tracking students failing Mumbai University attendance criteria.
   - Displays exact lecture shortage and provides one-click **"Export Defaulters CSV"** and **"Print Notice"**.

5. **Examination & Term Reports**
   - Executive Attendance Summary Report.
   - Division-wise filtering (`TYIT - Div A` vs `TYIT - Div B`).
   - One-click Print-ready view & CSV downloads.

6. **System Settings**
   - Configurable Institute Name, Department, Course, and Attendance Threshold.
   - Dark Mode / Light Mode with seamless local persistence.

---

## 💻 Tech Stack

- **Frontend:** React 18, Vite 5, Tailwind CSS, Lucide Icons, Recharts
- **Database:** Firebase Realtime Database (Web SDK v10)
- **Hardware:** NodeMCU ESP8266, RC522 RFID Module (13.56 MHz), 0.96" SSD1306 OLED, Active Buzzer, LED

---

## 📦 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## ☁️ Firebase Configuration

Edit `.env` in the root directory if connecting to a custom Firebase project:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=smartattend-af03a.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://smartattend-af03a-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=smartattend-af03a
```
