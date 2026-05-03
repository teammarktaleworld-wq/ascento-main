"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Page =
  | "dashboard"
  | "students"
  | "teachers"
  | "parents"
  | "schedule"
  | "exams"
  | "notes"
  | "attendance"
  | "fees"
  | "reports"
  | "settings"
  | "addStudent"
  | "addTeacher"
  | "addExam";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const students = [
  { id: 1, name: "Aarav Sharma", class: "5A", roll: "01", fees: "Paid", attendance: 92, grade: "A", parent: "Rahul Sharma", phone: "98765xxxxx" },
  { id: 2, name: "Diya Patel", class: "3B", roll: "02", fees: "Pending", attendance: 85, grade: "B+", parent: "Meena Patel", phone: "98123xxxxx" },
  { id: 3, name: "Rohan Verma", class: "7C", roll: "03", fees: "Paid", attendance: 97, grade: "A+", parent: "Suresh Verma", phone: "97456xxxxx" },
  { id: 4, name: "Ananya Singh", class: "6A", roll: "04", fees: "Paid", attendance: 88, grade: "A", parent: "Priya Singh", phone: "96789xxxxx" },
  { id: 5, name: "Kabir Mehta", class: "4B", roll: "05", fees: "Pending", attendance: 79, grade: "B", parent: "Vikram Mehta", phone: "95432xxxxx" },
  { id: 6, name: "Ishaan Joshi", class: "8A", roll: "06", fees: "Paid", attendance: 94, grade: "A+", parent: "Kavya Joshi", phone: "94567xxxxx" },
];

const teachers = [
  { id: 1, name: "Mrs. Bhavna Tomar", subject: "Mathematics", class: "6-8", exp: "12 yrs", status: "Active", phone: "98111xxxxx" },
  { id: 2, name: "Mrs. Aarti Rathore", subject: "Science", class: "5-7", exp: "8 yrs", status: "Active", phone: "97222xxxxx" },
  { id: 3, name: "Mr. Rajesh Kumar", subject: "English", class: "3-5", exp: "15 yrs", status: "Active", phone: "96333xxxxx" },
  { id: 4, name: "Mrs. Kashish S.", subject: "Hindi", class: "1-4", exp: "6 yrs", status: "On Leave", phone: "95444xxxxx" },
  { id: 5, name: "Mr. Arjun Nair", subject: "Social Studies", class: "6-8", exp: "10 yrs", status: "Active", phone: "94555xxxxx" },
];

const scheduleData = [
  { time: "08:30", subject: "Mathematics", teacher: "Mrs. Bhavna Tomar", class: "6A", room: "Room 12", color: "#FF6B6B" },
  { time: "10:00", subject: "Vedic Maths Session", teacher: "Mrs. Aarti Rathore", class: "5B", room: "Room 8", color: "#4ECDC4" },
  { time: "11:30", subject: "Science Lab", teacher: "Mr. Rajesh Kumar", class: "7C", room: "Lab 2", color: "#FFB347" },
  { time: "12:00", subject: "Brain Gym Session", teacher: "Mrs. Kashish S.", class: "All", room: "Hall", color: "#A78BFA" },
  { time: "13:30", subject: "English Literature", teacher: "Mr. Arjun Nair", class: "8A", room: "Room 3", color: "#F06292" },
  { time: "15:00", subject: "Physical Education", teacher: "Coach Ravi", class: "6-8", room: "Ground", color: "#FFB347" },
];

const exams = [
  { id: 1, name: "Unit Test 1 – Mathematics", date: "2025-05-10", class: "6A, 7B", duration: "2 hrs", status: "Upcoming", marks: 50 },
  { id: 2, name: "Science Quiz", date: "2025-05-08", class: "5A, 5B", duration: "1 hr", status: "Upcoming", marks: 25 },
  { id: 3, name: "Mid-Term – English", date: "2025-04-20", class: "All", duration: "3 hrs", status: "Completed", marks: 100 },
  { id: 4, name: "Hindi Dictation", date: "2025-04-15", class: "3A, 3B", duration: "30 min", status: "Completed", marks: 20 },
];

const enrollmentData = [
  { month: "Aug", count: 38 }, { month: "Sep", count: 40 }, { month: "Oct", count: 52 },
  { month: "Nov", count: 60 }, { month: "Dec", count: 45 }, { month: "Jan", count: 70 },
];

const feeData = [
  { student: "Aarav Sharma", class: "5A", amount: 12500, status: "Paid", date: "2025-04-01" },
  { student: "Diya Patel", class: "3B", amount: 12500, status: "Pending", date: "—" },
  { student: "Rohan Verma", class: "7C", amount: 15000, status: "Paid", date: "2025-04-02" },
  { student: "Kabir Mehta", class: "4B", amount: 12500, status: "Pending", date: "—" },
  { student: "Ananya Singh", class: "6A", amount: 15000, status: "Paid", date: "2025-03-30" },
];

const notes = [
  { id: 1, title: "Mathematics – Fractions", subject: "Math", class: "5A", teacher: "Mrs. Bhavna", date: "2025-05-01", type: "PDF" },
  { id: 2, title: "Science – Photosynthesis", subject: "Science", class: "6B", teacher: "Mrs. Aarti", date: "2025-04-28", type: "PDF" },
  { id: 3, title: "English – Grammar Worksheet", subject: "English", class: "4A", teacher: "Mr. Rajesh", date: "2025-04-25", type: "DOC" },
  { id: 4, title: "Hindi – Chapter 7 Notes", subject: "Hindi", class: "3B", teacher: "Mrs. Kashish", date: "2025-04-20", type: "PDF" },
];

// ─── Utility Components ───────────────────────────────────────────────────────
const Badge = ({ text, color }: { text: string; color: string }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>
    {text}
  </span>
);

// ─── MiniBarChart ─────────────────────────────────────────────────────────────
const MiniBarChart = () => {
  const max = Math.max(...enrollmentData.map(d => d.count));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100, padding: "0 4px" }}>
      {enrollmentData.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: "100%", height: (d.count / max) * 90,
            background: i === enrollmentData.length - 1
              ? "linear-gradient(135deg, #FF6B6B, #FFB347)"
              : "linear-gradient(135deg, #FFB34766, #FF6B6B44)",
            borderRadius: "6px 6px 0 0",
            transition: "height 1s cubic-bezier(.4,0,.2,1)",
            position: "relative",
          }} />
          <span style={{ fontSize: 10, color: "#999" }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
};

// ─── DonutChart ───────────────────────────────────────────────────────────────
const DonutChart = ({ value, color, label }: { value: number; color: string; label: string }) => {
  const r = 28, circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={72} height={72} viewBox="0 0 72 72">
        <circle cx={36} cy={36} r={r} fill="none" stroke="#FFF0E8" strokeWidth={8} />
        <circle cx={36} cy={36} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 36 36)" style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }} />
        <text x={36} y={40} textAnchor="middle" fill={color} fontSize={13} fontWeight={700}>{value}%</text>
      </svg>
      <span style={{ fontSize: 11, color: "#777", textAlign: "center" }}>{label}</span>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, title, value, sub, gradient, delay }: any) => (
  <div className="stat-card" style={{
    background: "#fff",
    borderRadius: 20,
    padding: "20px 22px",
    boxShadow: "0 4px 24px rgba(255,107,107,0.07)",
    border: "1px solid #FFF0E8",
    position: "relative",
    overflow: "hidden",
    animationDelay: delay,
    cursor: "default",
  }}>
    <div style={{
      position: "absolute", top: -20, right: -20, width: 80, height: 80,
      borderRadius: "50%", background: gradient, opacity: 0.12,
    }} />
    <div style={{
      width: 44, height: 44, borderRadius: 14, background: gradient,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 22, marginBottom: 14, boxShadow: `0 4px 16px ${gradient.includes("FF6B6B") ? "#FF6B6B" : "#FFB347"}33`,
    }}>{icon}</div>
    <div style={{ fontSize: 12, color: "#999", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1A2E", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: "#777", marginTop: 8 }}>{sub}</div>
  </div>
);

// ─── Form Components ──────────────────────────────────────────────────────────
const FormInput = ({ label, type = "text", placeholder, required = false }: any) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>{label}{required && <span style={{ color: "#FF6B6B" }}> *</span>}</label>
    <input type={type} placeholder={placeholder} style={{
      padding: "10px 14px", borderRadius: 12, border: "2px solid #FFF0E8",
      background: "#FFFDF7", fontSize: 14, color: "#1A1A2E", outline: "none",
      transition: "border-color 0.2s",
      fontFamily: "inherit",
    }}
      onFocus={e => (e.target.style.borderColor = "#FFB347")}
      onBlur={e => (e.target.style.borderColor = "#FFF0E8")}
    />
  </div>
);

const FormSelect = ({ label, options, required = false }: any) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>{label}{required && <span style={{ color: "#FF6B6B" }}> *</span>}</label>
    <select style={{
      padding: "10px 14px", borderRadius: 12, border: "2px solid #FFF0E8",
      background: "#FFFDF7", fontSize: 14, color: "#1A1A2E", outline: "none",
      fontFamily: "inherit", cursor: "pointer",
    }}
      onFocus={e => (e.target.style.borderColor = "#FFB347")}
      onBlur={e => (e.target.style.borderColor = "#FFF0E8")}
    >
      <option value="">Select…</option>
      {options.map((o: string) => <option key={o}>{o}</option>)}
    </select>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard", section: "OVERVIEW" },
    { id: "reports", icon: "📊", label: "Reports", section: "OVERVIEW", badge: 3 },
    { id: "students", icon: "🎒", label: "Students", section: "PEOPLE" },
    { id: "teachers", icon: "🧑‍🏫", label: "Teachers", section: "PEOPLE" },
    { id: "parents", icon: "👨‍👩‍👧", label: "Parents", section: "PEOPLE" },
    { id: "schedule", icon: "📅", label: "Schedule", section: "ACADEMICS" },
    { id: "exams", icon: "📝", label: "Exams", section: "ACADEMICS", badge: 2 },
    { id: "notes", icon: "📚", label: "Notes & Material", section: "ACADEMICS" },
    { id: "attendance", icon: "✅", label: "Attendance", section: "ACADEMICS" },
    { id: "fees", icon: "💳", label: "Fees & Payments", section: "FINANCE" },
    { id: "settings", icon: "⚙️", label: "Settings", section: "SYSTEM" },
  ];

  const groupedNav = navItems.reduce((acc: any, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const bg = darkMode ? "#1A1A2E" : "#FFFDF7";
  const cardBg = darkMode ? "#2D2D4E" : "#FFFFFF";
  const textMain = darkMode ? "#F5F0FF" : "#1A1A2E";
  const textMuted = darkMode ? "#A78BFA" : "#777";
  const borderColor = darkMode ? "#2A2A45" : "#FFF0E8";
  const sidebarBg = darkMode ? "#16162A" : "#1A1A2E";

  // ── Pages ──────────────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Welcome */}
      <div style={{
        background: "linear-gradient(135deg, #FF6B6B, #FFB347)",
        borderRadius: 24, padding: "28px 32px", color: "#fff",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        boxShadow: "0 8px 32px rgba(255,107,107,0.3)",
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Good Morning, Surendra! 👋</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Here's what's happening at Ascento today.</div>
        </div>
        <div style={{ fontSize: 48 }}>🏫</div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
        <StatCard icon="🎒" title="Total Students" value="348" sub="↑ 12 this month" gradient="linear-gradient(135deg, #FF6B6B, #FFB347)" delay="0s" />
        <StatCard icon="🧑‍🏫" title="Teachers" value="24" sub="↑ 2 new hires" gradient="linear-gradient(135deg, #4ECDC4, #45B7AA)" delay=".1s" />
        <StatCard icon="💰" title="Fees Collected" value="₹4.2L" sub="↓ ₹18K pending" gradient="linear-gradient(135deg, #FFB347, #FFD700)" delay=".2s" />
        <StatCard icon="✅" title="Attendance" value="91%" sub="↑ 3% vs last week" gradient="linear-gradient(135deg, #A78BFA, #7C3AED)" delay=".3s" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 }}>
        {/* Enrollment Chart */}
        <div style={{ background: cardBg, borderRadius: 20, padding: 24, border: `1px solid ${borderColor}`, boxShadow: "0 4px 24px rgba(255,107,107,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: textMain }}>Enrollment Trend</div>
              <div style={{ fontSize: 12, color: textMuted }}>Last 6 months</div>
            </div>
            <span style={{ background: "#FF6B6B22", color: "#FF6B6B", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>2025</span>
          </div>
          <MiniBarChart />
        </div>

        {/* Performance */}
        <div style={{ background: cardBg, borderRadius: 20, padding: 24, border: `1px solid ${borderColor}`, boxShadow: "0 4px 24px rgba(255,107,107,0.06)" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: textMain, marginBottom: 4 }}>Performance</div>
          <div style={{ fontSize: 12, color: textMuted, marginBottom: 20 }}>Class averages</div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <DonutChart value={91} color="#FF6B6B" label="Attendance" />
            <DonutChart value={78} color="#4ECDC4" label="Grades" />
            <DonutChart value={85} color="#FFB347" label="Fees" />
          </div>
        </div>
      </div>

      {/* Today's Schedule + Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Schedule */}
        <div style={{ background: cardBg, borderRadius: 20, padding: 24, border: `1px solid ${borderColor}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: textMain }}>Today's Schedule</div>
            <button onClick={() => setActivePage("schedule")} style={{ background: "none", border: "none", color: "#FF6B6B", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>View all →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {scheduleData.slice(0, 4).map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", borderRadius: 14, background: darkMode ? "#2A2A45" : "#FFFDF7", border: `1px solid ${borderColor}` }}>
                <div style={{ fontSize: 12, color: textMuted, width: 40, fontWeight: 600 }}>{s.time}</div>
                <div style={{ width: 4, height: 36, borderRadius: 4, background: s.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: textMain }}>{s.subject}</div>
                  <div style={{ fontSize: 11, color: textMuted }}>{s.teacher} · {s.room}</div>
                </div>
                <Badge text={s.class} color={s.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div style={{ background: cardBg, borderRadius: 20, padding: 24, border: `1px solid ${borderColor}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: textMain }}>Recent Students</div>
            <button onClick={() => setActivePage("students")} style={{ background: "none", border: "none", color: "#FF6B6B", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>View all →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {students.slice(0, 4).map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 14, background: darkMode ? "#2A2A45" : "#FFFDF7", border: `1px solid ${borderColor}` }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: ["linear-gradient(135deg,#FF6B6B,#FFB347)", "linear-gradient(135deg,#4ECDC4,#45B7AA)", "linear-gradient(135deg,#A78BFA,#7C3AED)", "linear-gradient(135deg,#F06292,#E91E63)"][i % 4],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 14,
                }}>{s.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: textMain }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: textMuted }}>Class {s.class} · Roll #{s.roll}</div>
                </div>
                <Badge text={s.fees} color={s.fees === "Paid" ? "#4ECDC4" : "#FF6B6B"} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: cardBg, borderRadius: 20, padding: 24, border: `1px solid ${borderColor}` }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: textMain, marginBottom: 18 }}>Quick Actions</div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            { label: "Add Student", icon: "➕🎒", page: "addStudent" as Page, gradient: "linear-gradient(135deg, #FF6B6B, #FFB347)" },
            { label: "Add Teacher", icon: "➕🧑‍🏫", page: "addTeacher" as Page, gradient: "linear-gradient(135deg, #4ECDC4, #45B7AA)" },
            { label: "New Exam", icon: "📝", page: "addExam" as Page, gradient: "linear-gradient(135deg, #A78BFA, #7C3AED)" },
            { label: "View Reports", icon: "📊", page: "reports" as Page, gradient: "linear-gradient(135deg, #FFB347, #FFD700)" },
            { label: "Attendance", icon: "✅", page: "attendance" as Page, gradient: "linear-gradient(135deg, #F06292, #E91E63)" },
          ].map((a, i) => (
            <button key={i} onClick={() => setActivePage(a.page)} style={{
              padding: "12px 22px", borderRadius: 14, border: "none",
              background: a.gradient, color: "#fff", fontWeight: 700, fontSize: 14,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 16px rgba(255,107,107,0.2)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(255,107,107,0.35)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(255,107,107,0.2)"; }}
            >
              <span>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudents = () => {
    const filtered = students.filter(s =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.class.toLowerCase().includes(studentSearch.toLowerCase())
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: textMain }}>Students</div>
            <div style={{ fontSize: 13, color: textMuted }}>Manage all enrolled students</div>
          </div>
          <button onClick={() => setActivePage("addStudent")} style={{
            padding: "10px 22px", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #FF6B6B, #FFB347)", color: "#fff", fontWeight: 700, fontSize: 14,
            cursor: "pointer", boxShadow: "0 4px 16px rgba(255,107,107,0.3)",
          }}>+ Add Student</button>
        </div>
        <div style={{ background: cardBg, borderRadius: 20, padding: 24, border: `1px solid ${borderColor}` }}>
          <input placeholder="Search by name or class…" value={studentSearch} onChange={e => setStudentSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 16px", borderRadius: 12, border: `2px solid ${borderColor}`, background: darkMode ? "#2A2A45" : "#FFFDF7", fontSize: 14, color: textMain, outline: "none", marginBottom: 20, boxSizing: "border-box", fontFamily: "inherit" }} />
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
            <thead>
              <tr style={{ fontSize: 12, color: textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
                {["#", "Name", "Class", "Roll", "Attendance", "Grade", "Fees", "Parent"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "0 12px 10px", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ background: darkMode ? "#2A2A45" : "#FFFDF7", borderRadius: 14 }}>
                  <td style={{ padding: "12px", borderRadius: "12px 0 0 12px", fontSize: 13, color: textMuted }}>{s.id}</td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: ["linear-gradient(135deg,#FF6B6B,#FFB347)", "linear-gradient(135deg,#4ECDC4,#45B7AA)", "linear-gradient(135deg,#A78BFA,#7C3AED)"][i % 3], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>{s.name[0]}</div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: textMain }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px", fontSize: 14, color: textMain }}>{s.class}</td>
                  <td style={{ padding: "12px", fontSize: 14, color: textMuted }}>{s.roll}</td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ height: 6, width: 60, background: "#FFF0E8", borderRadius: 6 }}>
                        <div style={{ height: 6, width: `${s.attendance * 0.6}%`, background: s.attendance >= 90 ? "#4ECDC4" : "#FFB347", borderRadius: 6 }} />
                      </div>
                      <span style={{ fontSize: 13, color: textMain }}>{s.attendance}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}><Badge text={s.grade} color="#A78BFA" /></td>
                  <td style={{ padding: "12px" }}><Badge text={s.fees} color={s.fees === "Paid" ? "#4ECDC4" : "#FF6B6B"} /></td>
                  <td style={{ padding: "12px", borderRadius: "0 12px 12px 0", fontSize: 13, color: textMuted }}>{s.parent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTeachers = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: textMain }}>Teachers</div>
          <div style={{ fontSize: 13, color: textMuted }}>Manage all faculty members</div>
        </div>
        <button onClick={() => setActivePage("addTeacher")} style={{
          padding: "10px 22px", borderRadius: 14, border: "none",
          background: "linear-gradient(135deg, #4ECDC4, #45B7AA)", color: "#fff", fontWeight: 700, fontSize: 14,
          cursor: "pointer", boxShadow: "0 4px 16px rgba(78,205,196,0.3)",
        }}>+ Add Teacher</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {teachers.map((t, i) => (
          <div key={t.id} style={{ background: cardBg, borderRadius: 20, padding: 22, border: `1px solid ${borderColor}`, display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: ["linear-gradient(135deg,#FF6B6B,#FFB347)", "linear-gradient(135deg,#4ECDC4,#45B7AA)", "linear-gradient(135deg,#A78BFA,#7C3AED)", "linear-gradient(135deg,#F06292,#E91E63)"][i % 4], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 800, flexShrink: 0 }}>{t.name.split(" ").slice(-1)[0][0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: textMain }}>{t.name}</div>
              <div style={{ fontSize: 13, color: textMuted, marginBottom: 10 }}>{t.subject} · {t.exp}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge text={`Class ${t.class}`} color="#FFB347" />
                <Badge text={t.status} color={t.status === "Active" ? "#4ECDC4" : "#F06292"} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: textMain }}>Today's Schedule</div>
      <div style={{ background: cardBg, borderRadius: 20, padding: 24, border: `1px solid ${borderColor}` }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {scheduleData.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 20px", borderRadius: 16, background: darkMode ? "#2A2A45" : "#FFFDF7", border: `2px solid ${s.color}22`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: s.color, borderRadius: "0 4px 4px 0" }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: s.color, width: 52 }}>{s.time}</div>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: s.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📖</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: textMain }}>{s.subject}</div>
                <div style={{ fontSize: 13, color: textMuted }}>{s.teacher}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Badge text={s.class} color={s.color} />
                <Badge text={s.room} color="#999" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExams = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: textMain }}>Exams</div>
          <div style={{ fontSize: 13, color: textMuted }}>Upcoming & completed tests</div>
        </div>
        <button onClick={() => setActivePage("addExam")} style={{
          padding: "10px 22px", borderRadius: 14, border: "none",
          background: "linear-gradient(135deg, #A78BFA, #7C3AED)", color: "#fff", fontWeight: 700, fontSize: 14,
          cursor: "pointer", boxShadow: "0 4px 16px rgba(167,139,250,0.3)",
        }}>+ Add Exam</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {exams.map(e => (
          <div key={e.id} style={{ background: cardBg, borderRadius: 18, padding: "20px 24px", border: `1px solid ${borderColor}`, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: e.status === "Upcoming" ? "linear-gradient(135deg,#FF6B6B,#FFB347)" : "linear-gradient(135deg,#4ECDC4,#45B7AA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>📝</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: textMain }}>{e.name}</div>
              <div style={{ fontSize: 13, color: textMuted }}>Class: {e.class} · Duration: {e.duration} · Max Marks: {e.marks}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: textMain }}>{e.date}</div>
              <Badge text={e.status} color={e.status === "Upcoming" ? "#FF6B6B" : "#4ECDC4"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotes = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: textMain }}>Notes & Study Material</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {notes.map(n => (
          <div key={n.id} style={{ background: cardBg, borderRadius: 18, padding: 22, border: `1px solid ${borderColor}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: n.type === "PDF" ? "linear-gradient(135deg,#FF6B6B,#FFB347)" : "linear-gradient(135deg,#4ECDC4,#45B7AA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#fff", fontWeight: 700 }}>{n.type === "PDF" ? "📄" : "📃"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: textMain }}>{n.title}</div>
              <div style={{ fontSize: 12, color: textMuted, marginBottom: 10 }}>{n.teacher} · Class {n.class} · {n.date}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Badge text={n.subject} color="#A78BFA" />
                <Badge text={n.type} color={n.type === "PDF" ? "#FF6B6B" : "#4ECDC4"} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAttendance = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const classes = ["Class 3A", "Class 4B", "Class 5A", "Class 6A", "Class 7C"];
    const data: Record<string, Record<string, number>> = {};
    classes.forEach(c => {
      data[c] = {};
      days.forEach(d => { data[c][d] = Math.floor(Math.random() * 5) + 25; });
    });
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: textMain }}>Attendance</div>
        <div style={{ background: cardBg, borderRadius: 20, padding: 24, border: `1px solid ${borderColor}` }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "0 12px 10px", fontSize: 12, color: textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Class</th>
                  {days.map(d => <th key={d} style={{ textAlign: "center", padding: "0 12px 10px", fontSize: 12, color: textMuted, fontWeight: 600, letterSpacing: 1 }}>{d}</th>)}
                  <th style={{ textAlign: "center", padding: "0 12px 10px", fontSize: 12, color: textMuted, fontWeight: 600 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(c => {
                  const total = Object.values(data[c]).reduce((a, b) => a + b, 0);
                  return (
                    <tr key={c} style={{ background: darkMode ? "#2A2A45" : "#FFFDF7" }}>
                      <td style={{ padding: "12px", borderRadius: "12px 0 0 12px", fontWeight: 700, color: textMain, fontSize: 14 }}>{c}</td>
                      {days.map(d => {
                        const v = data[c][d];
                        const pct = Math.round(v / 30 * 100);
                        return (
                          <td key={d} style={{ padding: "12px", textAlign: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: pct >= 90 ? "#4ECDC4" : pct >= 75 ? "#FFB347" : "#FF6B6B" }}>{v}</span>
                              <span style={{ fontSize: 11, color: textMuted }}>{pct}%</span>
                            </div>
                          </td>
                        );
                      })}
                      <td style={{ padding: "12px", borderRadius: "0 12px 12px 0", textAlign: "center" }}>
                        <Badge text={`${total}`} color="#A78BFA" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderFees = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: textMain }}>Fees & Payments</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <StatCard icon="💰" title="Total Collected" value="₹4.2L" sub="This month" gradient="linear-gradient(135deg, #4ECDC4, #45B7AA)" delay="0s" />
        <StatCard icon="⏳" title="Pending" value="₹18K" sub="2 students" gradient="linear-gradient(135deg, #FF6B6B, #FFB347)" delay=".1s" />
        <StatCard icon="✅" title="Paid Students" value="85%" sub="Of total enrolled" gradient="linear-gradient(135deg, #A78BFA, #7C3AED)" delay=".2s" />
      </div>
      <div style={{ background: cardBg, borderRadius: 20, padding: 24, border: `1px solid ${borderColor}` }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
          <thead>
            <tr>
              {["Student", "Class", "Amount", "Status", "Paid On", "Action"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "0 12px 10px", fontSize: 12, color: textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {feeData.map((f, i) => (
              <tr key={i} style={{ background: darkMode ? "#2A2A45" : "#FFFDF7" }}>
                <td style={{ padding: "12px", borderRadius: "12px 0 0 12px", fontWeight: 700, color: textMain, fontSize: 14 }}>{f.student}</td>
                <td style={{ padding: "12px", fontSize: 14, color: textMuted }}>{f.class}</td>
                <td style={{ padding: "12px", fontSize: 14, fontWeight: 700, color: textMain }}>₹{f.amount.toLocaleString()}</td>
                <td style={{ padding: "12px" }}><Badge text={f.status} color={f.status === "Paid" ? "#4ECDC4" : "#FF6B6B"} /></td>
                <td style={{ padding: "12px", fontSize: 13, color: textMuted }}>{f.date}</td>
                <td style={{ padding: "12px", borderRadius: "0 12px 12px 0" }}>
                  {f.status === "Pending" && (
                    <button onClick={() => showToast(`Payment reminder sent to ${f.student}!`)} style={{ padding: "6px 14px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Send Reminder</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: textMain }}>Reports & Analytics</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
        {[
          { title: "Student Performance Report", desc: "Class-wise grade distribution and averages", icon: "📊", color: "#FF6B6B" },
          { title: "Attendance Summary", desc: "Monthly attendance trends by class", icon: "✅", color: "#4ECDC4" },
          { title: "Fee Collection Report", desc: "Paid vs pending breakdown", icon: "💳", color: "#FFB347" },
          { title: "Teacher Activity Log", desc: "Lessons taught and sessions completed", icon: "🧑‍🏫", color: "#A78BFA" },
          { title: "Exam Results Analysis", desc: "Score distribution across subjects", icon: "📝", color: "#F06292" },
          { title: "Enrollment Trends", desc: "Monthly admissions and withdrawals", icon: "📈", color: "#45B7AA" },
        ].map((r, i) => (
          <div key={i} style={{ background: cardBg, borderRadius: 18, padding: 22, border: `1px solid ${borderColor}`, display: "flex", gap: 16, alignItems: "center", cursor: "pointer", transition: "transform 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "")}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: r.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: textMain }}>{r.title}</div>
              <div style={{ fontSize: 13, color: textMuted }}>{r.desc}</div>
            </div>
            <button onClick={() => showToast(`Generating ${r.title}…`)} style={{ padding: "8px 16px", borderRadius: 12, border: `2px solid ${r.color}`, background: "none", color: r.color, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Export</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderParents = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: textMain }}>Parents</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {students.map((s, i) => (
          <div key={s.id} style={{ background: cardBg, borderRadius: 18, padding: 20, border: `1px solid ${borderColor}`, display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: ["linear-gradient(135deg,#FF6B6B,#FFB347)", "linear-gradient(135deg,#4ECDC4,#45B7AA)", "linear-gradient(135deg,#A78BFA,#7C3AED)"][i % 3], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18 }}>{s.parent[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: textMain }}>{s.parent}</div>
              <div style={{ fontSize: 12, color: textMuted }}>Parent of {s.name} · {s.phone}</div>
            </div>
            <button onClick={() => showToast(`Message sent to ${s.parent}!`)} style={{ padding: "7px 14px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#FFB347,#FFD700)", color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>📨 Message</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: textMain }}>Settings</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ background: cardBg, borderRadius: 20, padding: 24, border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: textMain, marginBottom: 20 }}>School Profile</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FormInput label="School Name" placeholder="Ascento Academy" required />
            <FormInput label="Principal Name" placeholder="Surendra Tomar" required />
            <FormInput label="Email" type="email" placeholder="admin@ascento.edu" required />
            <FormInput label="Phone" placeholder="+91 98765 XXXXX" />
            <button onClick={() => showToast("Profile updated successfully!")} style={{ padding: "12px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 4 }}>Save Changes</button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: cardBg, borderRadius: 20, padding: 24, border: `1px solid ${borderColor}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: textMain, marginBottom: 16 }}>Appearance</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: textMain }}>Dark Mode</div>
                <div style={{ fontSize: 12, color: textMuted }}>Toggle dark theme</div>
              </div>
              <div onClick={() => setDarkMode(!darkMode)} style={{
                width: 52, height: 28, borderRadius: 14, background: darkMode ? "linear-gradient(135deg,#FF6B6B,#FFB347)" : "#FFF0E8",
                cursor: "pointer", position: "relative", transition: "background 0.3s", border: `2px solid ${borderColor}`,
              }}>
                <div style={{ position: "absolute", top: 2, left: darkMode ? 26 : 2, width: 20, height: 20, borderRadius: "50%", background: darkMode ? "#fff" : "#FFB347", transition: "left 0.3s", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }} />
              </div>
            </div>
          </div>
          <div style={{ background: cardBg, borderRadius: 20, padding: 24, border: `1px solid ${borderColor}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: textMain, marginBottom: 16 }}>Notifications</div>
            {["Email Alerts", "Fee Reminders", "Exam Notifications", "Attendance Alerts"].map(n => (
              <div key={n} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 14, color: textMain }}>{n}</span>
                <div style={{ width: 44, height: 24, borderRadius: 12, background: "linear-gradient(135deg,#4ECDC4,#45B7AA)", cursor: "pointer", position: "relative" }}>
                  <div style={{ position: "absolute", top: 2, left: 22, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddStudent = () => (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button onClick={() => setActivePage("students")} style={{ background: "none", border: "none", color: "#FF6B6B", cursor: "pointer", fontSize: 22 }}>←</button>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: textMain }}>Add New Student</div>
          <div style={{ fontSize: 13, color: textMuted }}>Fill in the student details below</div>
        </div>
      </div>
      <div style={{ background: cardBg, borderRadius: 20, padding: 30, border: `1px solid ${borderColor}`, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <FormInput label="First Name" placeholder="Aarav" required />
          <FormInput label="Last Name" placeholder="Sharma" required />
          <FormInput label="Date of Birth" type="date" required />
          <FormSelect label="Gender" options={["Male", "Female", "Other"]} required />
          <FormSelect label="Class" options={["1A","2A","3A","3B","4A","4B","5A","5B","6A","6B","7A","7B","8A","8B"]} required />
          <FormInput label="Roll Number" placeholder="01" required />
          <FormInput label="Parent Name" placeholder="Rahul Sharma" required />
          <FormInput label="Parent Phone" placeholder="+91 98765 XXXXX" required />
          <FormInput label="Email" type="email" placeholder="parent@email.com" />
          <FormSelect label="Blood Group" options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]} />
        </div>
        <FormInput label="Address" placeholder="123, Gandhi Nagar, Indore, MP" />
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button onClick={() => { showToast("Student added successfully! 🎒"); setActivePage("students"); }} style={{ flex: 1, padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#FF6B6B,#FFB347)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(255,107,107,0.3)" }}>Add Student</button>
          <button onClick={() => setActivePage("students")} style={{ padding: "14px 24px", borderRadius: 14, border: `2px solid ${borderColor}`, background: "none", color: textMuted, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const renderAddTeacher = () => (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button onClick={() => setActivePage("teachers")} style={{ background: "none", border: "none", color: "#4ECDC4", cursor: "pointer", fontSize: 22 }}>←</button>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: textMain }}>Add New Teacher</div>
          <div style={{ fontSize: 13, color: textMuted }}>Fill in teacher details below</div>
        </div>
      </div>
      <div style={{ background: cardBg, borderRadius: 20, padding: 30, border: `1px solid ${borderColor}`, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <FormInput label="Full Name" placeholder="Mrs. Bhavna Tomar" required />
          <FormSelect label="Subject" options={["Mathematics","Science","English","Hindi","Social Studies","Computer","Art","PE"]} required />
          <FormInput label="Phone" placeholder="+91 98111 XXXXX" required />
          <FormInput label="Email" type="email" placeholder="teacher@ascento.edu" required />
          <FormInput label="Experience (years)" type="number" placeholder="8" />
          <FormSelect label="Classes Assigned" options={["1-3","4-5","6-8","All"]} />
          <FormInput label="Joining Date" type="date" required />
          <FormSelect label="Status" options={["Active","On Leave","Resigned"]} />
        </div>
        <FormInput label="Address" placeholder="456, Vijay Nagar, Indore, MP" />
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button onClick={() => { showToast("Teacher added successfully! 🧑‍🏫"); setActivePage("teachers"); }} style={{ flex: 1, padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#4ECDC4,#45B7AA)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(78,205,196,0.3)" }}>Add Teacher</button>
          <button onClick={() => setActivePage("teachers")} style={{ padding: "14px 24px", borderRadius: 14, border: `2px solid ${borderColor}`, background: "none", color: textMuted, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const renderAddExam = () => (
    <div style={{ maxWidth: 600 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button onClick={() => setActivePage("exams")} style={{ background: "none", border: "none", color: "#A78BFA", cursor: "pointer", fontSize: 22 }}>←</button>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: textMain }}>Schedule New Exam</div>
          <div style={{ fontSize: 13, color: textMuted }}>Fill in exam details below</div>
        </div>
      </div>
      <div style={{ background: cardBg, borderRadius: 20, padding: 30, border: `1px solid ${borderColor}`, display: "flex", flexDirection: "column", gap: 18 }}>
        <FormInput label="Exam Title" placeholder="Unit Test 1 – Mathematics" required />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <FormSelect label="Subject" options={["Mathematics","Science","English","Hindi","Social Studies","Computer"]} required />
          <FormSelect label="Classes" options={["3A","4B","5A","6A","7C","8A","All"]} required />
          <FormInput label="Exam Date" type="date" required />
          <FormSelect label="Duration" options={["30 min","1 hr","1.5 hrs","2 hrs","3 hrs"]} required />
          <FormInput label="Max Marks" type="number" placeholder="100" required />
          <FormSelect label="Exam Type" options={["Unit Test","Quiz","Mid-Term","Final","Oral"]} />
        </div>
        <FormInput label="Additional Instructions" placeholder="Bring calculator, no phones allowed" />
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button onClick={() => { showToast("Exam scheduled successfully! 📝"); setActivePage("exams"); }} style={{ flex: 1, padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#A78BFA,#7C3AED)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(167,139,250,0.3)" }}>Schedule Exam</button>
          <button onClick={() => setActivePage("exams")} style={{ padding: "14px 24px", borderRadius: 14, border: `2px solid ${borderColor}`, background: "none", color: textMuted, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const pageContent: Record<Page, () => React.ReactElement> = {
    dashboard: renderDashboard,
    students: renderStudents,
    teachers: renderTeachers,
    parents: renderParents,
    schedule: renderSchedule,
    exams: renderExams,
    notes: renderNotes,
    attendance: renderAttendance,
    fees: renderFees,
    reports: renderReports,
    settings: renderSettings,
    addStudent: renderAddStudent,
    addTeacher: renderAddTeacher,
    addExam: renderAddExam,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; }
        .stat-card { animation: fadeUp 0.5s ease both; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(255,107,107,0.15) !important; transition: all 0.2s; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        .nav-item:hover { background: rgba(255,107,107,0.08) !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #FFB34744; border-radius: 6px; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", background: bg, fontFamily: "'Nunito', sans-serif", overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{
          width: sidebarOpen ? 240 : 72, background: sidebarBg, height: "100vh",
          display: "flex", flexDirection: "column", flexShrink: 0,
          transition: "width 0.3s cubic-bezier(.4,0,.2,1)", overflow: "hidden",
          boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
        }}>
          {/* Logo */}
          <div style={{ padding: "22px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🏫</div>
            {sidebarOpen && <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 17, fontFamily: "'Poppins', sans-serif" }}>Ascento</div>
              <div style={{ color: "#FFB34799", fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>ADMIN PANEL</div>
            </div>}
          </div>

          {/* Nav */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
            {Object.entries(groupedNav).map(([section, items]) => (
              <div key={section}>
                {sidebarOpen && <div style={{ padding: "12px 18px 4px", fontSize: 10, color: "#FFB34766", fontWeight: 700, letterSpacing: 1.5 }}>{section}</div>}
                {(items as typeof navItems).map(item => {
                  const isActive = activePage === item.id;
                  return (
                    <div key={item.id} className="nav-item" onClick={() => setActivePage(item.id as Page)} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: sidebarOpen ? "10px 18px" : "10px",
                      margin: "2px 8px", borderRadius: 12,
                      background: isActive ? "linear-gradient(135deg,#FF6B6B22,#FFB34722)" : "transparent",
                      borderLeft: isActive ? "3px solid #FF6B6B" : "3px solid transparent",
                      cursor: "pointer", transition: "all 0.15s", justifyContent: sidebarOpen ? "flex-start" : "center",
                    }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                      {sidebarOpen && <>
                        <span style={{ fontSize: 14, fontWeight: isActive ? 700 : 600, color: isActive ? "#FF6B6B" : "#ffffff99", flex: 1 }}>{item.label}</span>
                        {item.badge && <span style={{ background: "#FF6B6B", color: "#fff", borderRadius: 10, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>{item.badge}</span>}
                      </>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* User */}
          <div style={{ padding: "16px 14px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, flexShrink: 0 }}>S</div>
            {sidebarOpen && <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Surendra Tomar</div>
              <div style={{ color: "#FFB34799", fontSize: 11 }}>Administrator</div>
            </div>}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Topbar */}
          <div style={{ height: 64, background: cardBg, borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: textMuted }}>☰</button>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 800, fontSize: 18, color: textMain, fontFamily: "'Poppins', sans-serif" }}>
                {activePage.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: darkMode ? "#2A2A45" : "#FFFDF7", border: `2px solid ${borderColor}`, borderRadius: 12, padding: "6px 14px", flex: "0 0 240px" }}>
              <span style={{ color: textMuted }}>🔍</span>
              <input placeholder="Search student…" value={search} onChange={e => setSearch(e.target.value)}
                style={{ border: "none", background: "none", outline: "none", fontSize: 13, color: textMain, width: "100%", fontFamily: "inherit" }} />
            </div>
            <div style={{ position: "relative" }}>
              <button onClick={() => setNotifOpen(!notifOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, position: "relative" }}>
                🔔
                <span style={{ position: "absolute", top: -4, right: -4, background: "#FF6B6B", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
              </button>
              {notifOpen && (
                <div style={{ position: "absolute", right: 0, top: 40, background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: 16, width: 300, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", zIndex: 100 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: textMain, marginBottom: 12 }}>Notifications</div>
                  {["₹18K fees pending for 2 students", "Exam scheduled: Unit Test 1 – May 10", "New teacher: Mr. Arjun Nair joined"].map((n, i) => (
                    <div key={i} style={{ padding: "10px 0", borderBottom: i < 2 ? `1px solid ${borderColor}` : "none", fontSize: 13, color: textMuted }}>{n}</div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg,#FF6B6B,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>S</div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 28 }} onClick={() => notifOpen && setNotifOpen(false)}>
            {pageContent[activePage]?.()}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "fixed", bottom: 28, right: 28,
            background: "linear-gradient(135deg,#FF6B6B,#FFB347)",
            color: "#fff", padding: "14px 24px", borderRadius: 16,
            fontWeight: 700, fontSize: 14, boxShadow: "0 8px 24px rgba(255,107,107,0.4)",
            zIndex: 999, animation: "fadeUp 0.3s ease",
          }}>{toast}</div>
        )}
      </div>
    </>
  );
}