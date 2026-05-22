










// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";

// // ─── Mock Data ────────────────────────────────────────────────────────────────
// const STUDENT = {
//   name: "Aarav Sharma",
//   initials: "AS",
//   program: "Abacus Mastery",
//   level: "Level 5",
//   batch: "Mon–Wed–Fri · 4:00 PM",
//   rollNo: "ASC-2024-047",
//   teacher: "Mrs. Bala Tomar",
//   joinedDate: "Aug 2024",
//   avatar: null,
// };

// const ANNOUNCEMENTS = [
//   { id: 1, title: "🎉 Annual Competition Registration Open!", body: "Register now for the National Abacus Championship 2025. Last date: 15 Feb. Prizes worth ₹50,000!", date: "Today", tag: "Competition", color: "#FF6B6B", urgent: true },
//   { id: 2, title: "🏖️ Summer Camp 2025", body: "Enrol your child in our intensive 4-week summer brain development camp starting May 15th.", date: "2 days ago", tag: "Event", color: "#FFB347", urgent: false },
//   { id: 3, title: "📅 Holiday Notice — Republic Day", body: "Centre will remain closed on 26th January. Classes will resume on 27th January as usual.", date: "5 days ago", tag: "Notice", color: "#4ECDC4", urgent: false },
//   { id: 4, title: "📝 Level 5 Mid-Term Exam Schedule", body: "Your mid-term assessment is scheduled for February 8th, 10:00 AM. Topic: Speed addition & multiplication.", date: "1 week ago", tag: "Exam", color: "#A78BFA", urgent: false },
// ];

// const SCHEDULE = [
//   { day: "Mon", subject: "Abacus Speed Practice", time: "4:00–6:00 PM", teacher: "Mrs. Bala Tomar", room: "Room 2", color: "#FF6B6B", active: true },
//   { day: "Wed", subject: "Abacus Speed Practice", time: "4:00–6:00 PM", teacher: "Mrs. Bala Tomar", room: "Room 2", color: "#FF6B6B", active: false },
//   { day: "Fri", subject: "Worksheet + Oral Test", time: "4:00–6:00 PM", teacher: "Mrs. Bala Tomar", room: "Room 2", color: "#FFB347", active: false },
// ];

// const NOTES = [
//   { id: 1, title: "Level 5 — Multiplication Worksheet", type: "PDF", size: "1.2 MB", program: "Abacus", color: "#FF6B6B", emoji: "📄", date: "Jan 20", new: true },
//   { id: 2, title: "Speed Drill Practice Set #12", type: "PDF", size: "0.8 MB", program: "Abacus", color: "#FF6B6B", emoji: "📋", date: "Jan 15", new: false },
//   { id: 3, title: "Vedic Maths — Nikhilam Intro", type: "PDF", size: "1.5 MB", program: "Vedic", color: "#A78BFA", emoji: "📘", date: "Jan 10", new: false },
//   { id: 4, title: "Abacus Level 5 — Complete Notes", type: "PDF", size: "3.2 MB", program: "Abacus", color: "#FF6B6B", emoji: "📚", date: "Jan 5", new: false },
//   { id: 5, title: "Mental Maths Tricks — Part 2", type: "Video", size: "Watch", program: "Abacus", color: "#4ECDC4", emoji: "🎬", date: "Dec 28", new: false },
// ];

// const ATTENDANCE = [
//   { date: "Jan 20", day: "Mon", status: "present" },
//   { date: "Jan 17", day: "Fri", status: "present" },
//   { date: "Jan 15", day: "Wed", status: "late" },
//   { date: "Jan 13", day: "Mon", status: "present" },
//   { date: "Jan 10", day: "Fri", status: "present" },
//   { date: "Jan 8",  day: "Wed", status: "absent"  },
//   { date: "Jan 6",  day: "Mon", status: "present" },
//   { date: "Jan 3",  day: "Fri", status: "present" },
// ];

// const EXAMS = [
//   { title: "Level 5 Mid-Term", date: "Feb 8, 2025", time: "10:00 AM", status: "upcoming", score: null,  total: 100, color: "#FFB347" },
//   { title: "Level 5 Speed Test", date: "Jan 12, 2025", time: "4:30 PM", status: "completed", score: 87, total: 100, color: "#4ECDC4" },
//   { title: "Level 4 Final Exam", date: "Dec 14, 2024", time: "10:00 AM", status: "completed", score: 92, total: 100, color: "#4ECDC4" },
// ];

// const FEES = [
//   { month: "February 2025", amount: 1800, status: "pending", due: "Feb 5" },
//   { month: "January 2025",  amount: 1800, status: "paid",    paid: "Jan 3" },
//   { month: "December 2024", amount: 1800, status: "paid",    paid: "Dec 2" },
// ];

// type NavPage = "home" | "schedule" | "notes" | "attendance" | "exams" | "fees" | "announcements" | "profile";

// export default function UserDashboard() {
//   const [activePage, setActivePage] = useState<NavPage>("home");
//   const [sidebarOpen, setSidebarOpen] = useState(false); // mobile: closed by default
//   const [greeting, setGreeting] = useState("Good Morning");
//   const [toast, setToast] = useState<string | null>(null);

//   useEffect(() => {
//     const h = new Date().getHours();
//     setGreeting(h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening");
//   }, []);

//   const showToast = (msg: string) => {
//     setToast(msg);
//     setTimeout(() => setToast(null), 3000);
//   };

//   // attendance stats
//   const presentCount = ATTENDANCE.filter(a => a.status === "present").length;
//   const attendancePct = Math.round((presentCount / ATTENDANCE.length) * 100);

//   const NAV = [
//     { id: "home",          icon: "⊞",  label: "Dashboard"    },
//     { id: "announcements", icon: "📢", label: "Announcements", badge: ANNOUNCEMENTS.filter(a => a.urgent).length },
//     { id: "schedule",      icon: "📅", label: "Schedule"      },
//     { id: "notes",         icon: "📚", label: "Notes"         , badge: NOTES.filter(n => n.new).length },
//     { id: "attendance",    icon: "✅", label: "Attendance"    },
//     { id: "exams",         icon: "📝", label: "Exams"         },
//     { id: "fees",          icon: "💳", label: "Fees"          , badge: FEES.filter(f => f.status === "pending").length },
//     { id: "profile",       icon: "👤", label: "My Profile"    },
//   ] as const;

//   // ─── Page Renderers ──────────────────────────────────────────────────────────

//   const renderHome = () => (
//     <div className="page-content">
//       {/* Welcome banner */}
//       <div className="welcome-banner">
//         <div className="welcome-left">
//           <div className="welcome-tag">🌟 Student Portal</div>
//           <h1 className="welcome-title">{greeting}, <span>{STUDENT.name.split(" ")[0]}!</span> 👋</h1>
//           <p className="welcome-sub">You have <strong>{ANNOUNCEMENTS.filter(a => a.urgent).length} new announcement</strong> and your next class is <strong>today at 4:00 PM</strong>.</p>
//         </div>
//         <div className="welcome-emoji">🧮</div>
//       </div>

//       {/* Quick stats */}
//       <div className="quick-stats">
//         {[
//           { icon: "✅", label: "Attendance", value: `${attendancePct}%`, sub: "Last 30 days", color: "#4ECDC4", bg: "#F0FFFE" },
//           { icon: "📝", label: "Next Exam", value: "Feb 8", sub: "Level 5 Mid-Term", color: "#FFB347", bg: "#FFF8EE" },
//           { icon: "📚", label: "New Notes", value: `${NOTES.filter(n => n.new).length}`, sub: "Unread materials", color: "#A78BFA", bg: "#F5F0FF" },
//           { icon: "💳", label: "Fee Due", value: "₹1,800", sub: "Due Feb 5", color: "#FF6B6B", bg: "#FFF0F0" },
//         ].map((s, i) => (
//           <div key={i} className="quick-stat-card" style={{ "--accent": s.color, "--card-bg": s.bg } as any}>
//             <div className="qs-icon">{s.icon}</div>
//             <div className="qs-body">
//               <div className="qs-label">{s.label}</div>
//               <div className="qs-value">{s.value}</div>
//               <div className="qs-sub">{s.sub}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Two-column middle */}
//       <div className="home-mid">
//         {/* Today's class */}
//         <div className="dash-card">
//           <div className="card-head">
//             <div>
//               <div className="card-title">Today's Class</div>
//               <div className="card-sub">Monday · Jan 20</div>
//             </div>
//             <button className="card-action" onClick={() => setActivePage("schedule")}>View all →</button>
//           </div>
//           <div className="today-class-box">
//             <div className="today-dot" />
//             <div className="today-info">
//               <div className="today-subject">Abacus Speed Practice</div>
//               <div className="today-meta">4:00–6:00 PM · Room 2 · Mrs. Bala Tomar</div>
//             </div>
//             <div className="today-live">LIVE TODAY</div>
//           </div>
//           <div className="today-tip">💡 Tip: Practice 5-minute speed drills before class for best results!</div>
//         </div>

//         {/* Recent announcements */}
//         <div className="dash-card">
//           <div className="card-head">
//             <div>
//               <div className="card-title">Announcements</div>
//               <div className="card-sub">{ANNOUNCEMENTS.length} total</div>
//             </div>
//             <button className="card-action" onClick={() => setActivePage("announcements")}>View all →</button>
//           </div>
//           {ANNOUNCEMENTS.slice(0, 3).map(a => (
//             <div key={a.id} className="ann-item" style={{ "--ann-color": a.color } as any}>
//               <div className="ann-dot" />
//               <div className="ann-body">
//                 <div className="ann-title">{a.title}</div>
//                 <div className="ann-date">{a.date}</div>
//               </div>
//               {a.urgent && <div className="ann-urgent">NEW</div>}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Recent notes */}
//       <div className="dash-card" style={{ marginTop: 18 }}>
//         <div className="card-head">
//           <div>
//             <div className="card-title">Recent Study Material</div>
//             <div className="card-sub">Latest uploads from your teacher</div>
//           </div>
//           <button className="card-action" onClick={() => setActivePage("notes")}>View all →</button>
//         </div>
//         <div className="notes-row">
//           {NOTES.slice(0, 3).map(n => (
//             <div key={n.id} className="note-mini" style={{ "--note-color": n.color } as any} onClick={() => showToast(`Opening "${n.title}"…`)}>
//               <div className="note-mini-emoji">{n.emoji}</div>
//               <div className="note-mini-name">{n.title}</div>
//               <div className="note-mini-meta">{n.type} · {n.size}</div>
//               {n.new && <div className="note-new-dot" />}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Progress ring */}
//       <div className="home-bottom">
//         <div className="dash-card progress-card">
//           <div className="card-title" style={{ marginBottom: 18 }}>My Progress</div>
//           <div className="progress-row">
//             <div className="progress-ring-wrap">
//               <svg viewBox="0 0 80 80" className="progress-svg">
//                 <circle cx="40" cy="40" r="30" fill="none" stroke="#FFF0E8" strokeWidth="8" />
//                 <circle cx="40" cy="40" r="30" fill="none" stroke="#FF6B6B" strokeWidth="8"
//                   strokeDasharray={`${(attendancePct / 100) * 188} 188`}
//                   strokeLinecap="round" transform="rotate(-90 40 40)"
//                   style={{ transition: "stroke-dasharray 1.5s cubic-bezier(.4,0,.2,1)" }} />
//                 <text x="40" y="44" textAnchor="middle" fill="#FF6B6B" fontSize="13" fontWeight="700">{attendancePct}%</text>
//               </svg>
//               <div className="ring-label">Attendance</div>
//             </div>
//             <div className="progress-bars">
//               {[
//                 { label: "Speed",    pct: 72, color: "#FF6B6B" },
//                 { label: "Accuracy", pct: 88, color: "#4ECDC4" },
//                 { label: "Oral",     pct: 65, color: "#FFB347" },
//                 { label: "Mental",   pct: 55, color: "#A78BFA" },
//               ].map(b => (
//                 <div key={b.label} className="prog-bar-row">
//                   <span className="prog-bar-label">{b.label}</span>
//                   <div className="prog-bar-track">
//                     <div className="prog-bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
//                   </div>
//                   <span className="prog-bar-pct">{b.pct}%</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="dash-card">
//           <div className="card-title" style={{ marginBottom: 16 }}>Upcoming Exam</div>
//           <div className="exam-card-inner">
//             <div className="exam-date-badge">
//               <div className="exam-month">FEB</div>
//               <div className="exam-day">08</div>
//             </div>
//             <div className="exam-info">
//               <div className="exam-name">Level 5 Mid-Term</div>
//               <div className="exam-meta">10:00 AM · Room 2</div>
//               <div className="exam-topics">Topics: Speed addition, 2×3 digit multiplication</div>
//             </div>
//           </div>
//           <div className="exam-days-left">
//             <span>🕐</span> 19 days to prepare
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderAnnouncements = () => (
//     <div className="page-content">
//       <div className="page-header">
//         <h2 className="page-title">Announcements</h2>
//         <p className="page-sub">Stay up to date with notices, events & exam updates</p>
//       </div>
//       <div className="ann-list">
//         {ANNOUNCEMENTS.map(a => (
//           <div key={a.id} className="ann-full-card" style={{ "--ann-color": a.color } as any}>
//             <div className="ann-full-left">
//               <div className="ann-full-tag" style={{ background: a.color + "20", color: a.color }}>{a.tag}</div>
//               <div className="ann-full-title">{a.title}</div>
//               <div className="ann-full-body">{a.body}</div>
//               <div className="ann-full-date">🕐 {a.date}</div>
//             </div>
//             {a.urgent && <div className="ann-full-urgent">NEW</div>}
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const renderSchedule = () => (
//     <div className="page-content">
//       <div className="page-header">
//         <h2 className="page-title">My Schedule</h2>
//         <p className="page-sub">{STUDENT.batch}</p>
//       </div>
//       <div className="schedule-week">
//         {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => {
//           const cls = SCHEDULE.find(s => s.day === d);
//           const isToday = d === "Mon";
//           return (
//             <div key={d} className={`sched-day-card ${cls ? "has-class" : "empty-day"} ${isToday ? "today-day" : ""}`}>
//               <div className="sched-day-label">{d}</div>
//               {cls ? (
//                 <div className="sched-class-info" style={{ "--sched-color": cls.color } as any}>
//                   <div className="sched-subject">{cls.subject}</div>
//                   <div className="sched-time">{cls.time}</div>
//                   <div className="sched-teacher">👩‍🏫 {cls.teacher}</div>
//                   <div className="sched-room">📍 {cls.room}</div>
//                   {isToday && <div className="sched-live-pill">● LIVE TODAY</div>}
//                 </div>
//               ) : (
//                 <div className="sched-off">No class 🌿</div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//       <div className="dash-card" style={{ marginTop: 20 }}>
//         <div className="card-title" style={{ marginBottom: 16 }}>Class Details</div>
//         <div className="class-detail-grid">
//           {[["📚 Program", STUDENT.program], ["📊 Level", STUDENT.level], ["👩‍🏫 Teacher", STUDENT.teacher], ["📍 Batch", STUDENT.batch], ["🔢 Roll No.", STUDENT.rollNo], ["📅 Joined", STUDENT.joinedDate]].map(([l, v]) => (
//             <div key={l} className="class-detail-item">
//               <div className="cd-label">{l}</div>
//               <div className="cd-value">{v}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderNotes = () => (
//     <div className="page-content">
//       <div className="page-header">
//         <h2 className="page-title">Notes & Materials</h2>
//         <p className="page-sub">Study resources shared by your teacher</p>
//       </div>
//       <div className="notes-filter">
//         {["All", "Abacus", "Vedic", "PDF", "Video"].map(f => (
//           <button key={f} className={`filter-pill ${f === "All" ? "active" : ""}`}>{f}</button>
//         ))}
//       </div>
//       <div className="notes-grid">
//         {NOTES.map(n => (
//           <div key={n.id} className="note-card" style={{ "--note-color": n.color } as any} onClick={() => showToast(`Downloading "${n.title}"…`)}>
//             {n.new && <div className="note-new-badge">NEW</div>}
//             <div className="note-card-emoji">{n.emoji}</div>
//             <div className="note-card-name">{n.title}</div>
//             <div className="note-card-prog" style={{ color: n.color }}>{n.program}</div>
//             <div className="note-card-meta">{n.type} · {n.size} · {n.date}</div>
//             <div className="note-card-btn" style={{ background: n.color }}>
//               {n.type === "Video" ? "▶ Watch" : "⬇ Download"}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const renderAttendance = () => (
//     <div className="page-content">
//       <div className="page-header">
//         <h2 className="page-title">Attendance</h2>
//         <p className="page-sub">Your attendance record</p>
//       </div>
//       <div className="att-stats">
//         {[
//           { label: "Present", value: ATTENDANCE.filter(a => a.status === "present").length, color: "#4ECDC4", bg: "#F0FFFE" },
//           { label: "Absent",  value: ATTENDANCE.filter(a => a.status === "absent").length,  color: "#FF6B6B", bg: "#FFF0F0" },
//           { label: "Late",    value: ATTENDANCE.filter(a => a.status === "late").length,     color: "#FFB347", bg: "#FFF8EE" },
//           { label: "Overall", value: `${attendancePct}%`,                                    color: "#A78BFA", bg: "#F5F0FF" },
//         ].map((s, i) => (
//           <div key={i} className="att-stat-box" style={{ background: s.bg, borderColor: s.color + "44" }}>
//             <div className="att-stat-val" style={{ color: s.color }}>{s.value}</div>
//             <div className="att-stat-label">{s.label}</div>
//           </div>
//         ))}
//       </div>
//       <div className="dash-card">
//         <div className="card-title" style={{ marginBottom: 16 }}>Recent Classes</div>
//         <div className="att-list">
//           {ATTENDANCE.map((a, i) => (
//             <div key={i} className="att-row">
//               <div className="att-date-col">
//                 <div className="att-date">{a.date}</div>
//                 <div className="att-day">{a.day}</div>
//               </div>
//               <div className="att-bar" />
//               <div className="att-subject">Abacus Speed Practice</div>
//               <div className={`att-badge att-${a.status}`}>
//                 {a.status === "present" ? "✓ Present" : a.status === "late" ? "⏱ Late" : "✗ Absent"}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderExams = () => (
//     <div className="page-content">
//       <div className="page-header">
//         <h2 className="page-title">Exams & Results</h2>
//         <p className="page-sub">Your exam schedule and performance</p>
//       </div>
//       <div className="exams-list">
//         {EXAMS.map((e, i) => (
//           <div key={i} className={`exam-full-card ${e.status === "upcoming" ? "exam-upcoming" : ""}`}>
//             <div className="exam-full-left">
//               <div className="efcard-date-box" style={{ background: e.color + "20", color: e.color }}>
//                 <div className="efcard-month">{e.date.split(",")[0].split(" ")[0].toUpperCase()}</div>
//                 <div className="efcard-day">{e.date.split(" ")[1]?.replace(",", "")}</div>
//               </div>
//               <div className="efcard-info">
//                 <div className="efcard-title">{e.title}</div>
//                 <div className="efcard-meta">{e.date} · {e.time}</div>
//                 {e.status === "upcoming"
//                   ? <div className="efcard-upcoming-tag">📅 Upcoming</div>
//                   : (
//                     <div className="efcard-result">
//                       Score: <strong style={{ color: (e.score ?? 0) >= 80 ? "#4ECDC4" : "#FFB347" }}>{e.score}/{e.total}</strong>
//                       <div className="efcard-grade">{(e.score ?? 0) >= 90 ? "A+ 🏆" : (e.score ?? 0) >= 80 ? "A 🌟" : "B ✔"}</div>
//                     </div>
//                   )}
//               </div>
//             </div>
//             {e.status === "completed" && e.score && (
//               <div className="efcard-score-circle" style={{ borderColor: e.color }}>
//                 <span style={{ color: e.color, fontFamily: "'Fredoka One', cursive" }}>{e.score}%</span>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const renderFees = () => (
//     <div className="page-content">
//       <div className="page-header">
//         <h2 className="page-title">Fees</h2>
//         <p className="page-sub">Monthly fee statements</p>
//       </div>
//       {FEES.filter(f => f.status === "pending").map((f, i) => (
//         <div key={i} className="fee-alert">
//           <div>
//             <div className="fee-alert-title">⚠️ Payment Due — {f.month}</div>
//             <div className="fee-alert-sub">₹{f.amount.toLocaleString()} due by {(f as any).due}</div>
//           </div>
//           <button className="fee-pay-btn" onClick={() => showToast("Redirecting to payment gateway…")}>Pay Now</button>
//         </div>
//       ))}
//       <div className="dash-card">
//         <div className="card-title" style={{ marginBottom: 16 }}>Fee History</div>
//         <div className="fee-list">
//           {FEES.map((f, i) => (
//             <div key={i} className="fee-row">
//               <div className="fee-month">{f.month}</div>
//               <div className="fee-amount">₹{f.amount.toLocaleString()}</div>
//               <div className={`fee-status-badge ${f.status === "paid" ? "fee-paid" : "fee-pending"}`}>
//                 {f.status === "paid" ? `✓ Paid on ${(f as any).paid}` : `⏳ Due ${(f as any).due}`}
//               </div>
//               {f.status === "paid" && (
//                 <button className="receipt-btn" onClick={() => showToast("Generating receipt…")}>Receipt</button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderProfile = () => (
//     <div className="page-content">
//       <div className="page-header">
//         <h2 className="page-title">My Profile</h2>
//       </div>
//       <div className="profile-hero">
//         <div className="profile-avatar-big">{STUDENT.initials}</div>
//         <div className="profile-name">{STUDENT.name}</div>
//         <div className="profile-prog-badge">{STUDENT.program} · {STUDENT.level}</div>
//       </div>
//       <div className="profile-grid">
//         {[
//           ["🔢 Roll Number", STUDENT.rollNo],
//           ["📚 Program", STUDENT.program],
//           ["📊 Level", STUDENT.level],
//           ["📅 Batch", STUDENT.batch],
//           ["👩‍🏫 Teacher", STUDENT.teacher],
//           ["🗓️ Joined", STUDENT.joinedDate],
//           ["✅ Attendance", `${attendancePct}%`],
//           ["🏆 Best Score", "92/100 (Level 4 Final)"],
//         ].map(([l, v]) => (
//           <div key={l} className="profile-field">
//             <div className="pf-label">{l}</div>
//             <div className="pf-value">{v}</div>
//           </div>
//         ))}
//       </div>
//       <div className="profile-actions">
//         <button className="profile-btn" onClick={() => showToast("Opening change password…")}>🔒 Change Password</button>
//         <button className="profile-btn" onClick={() => showToast("Opening contact form…")}>📨 Message Teacher</button>
//         <button className="profile-btn danger" onClick={() => showToast("Logging out…")}>🚪 Log Out</button>
//       </div>
//     </div>
//   );

//   const PAGE_MAP: Record<NavPage, () => React.ReactElement> = {
//     home: renderHome,
//     announcements: renderAnnouncements,
//     schedule: renderSchedule,
//     notes: renderNotes,
//     attendance: renderAttendance,
//     exams: renderExams,
//     fees: renderFees,
//     profile: renderProfile,
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');

//         *{box-sizing:border-box;margin:0;padding:0;}
//         html{scroll-behavior:smooth;}

//         /* ── Layout shell ── */
//         .ud-shell{
//           display:flex; height:100vh; overflow:hidden;
//           background:#FFFDF7; font-family:'Nunito',sans-serif;
//         }

//         /* ══════════════════════════════════
//            SIDEBAR
//         ══════════════════════════════════ */
//         .ud-sidebar{
//           width:240px; background:#1A1A2E;
//           display:flex; flex-direction:column;
//           flex-shrink:0; overflow:hidden;
//           transition:width 0.3s cubic-bezier(.4,0,.2,1);
//           box-shadow:4px 0 24px rgba(0,0,0,0.18);
//           z-index:200;
//         }
//         .sidebar-logo{
//           padding:22px 18px; display:flex; align-items:center; gap:12px;
//           border-bottom:1px solid rgba(255,255,255,0.08); flex-shrink:0;
//         }
//         .logo-icon{
//           width:40px;height:40px;border-radius:12px;
//           background:linear-gradient(135deg,#FF6B6B,#FFB347);
//           display:flex;align-items:center;justify-content:center;
//           font-size:20px;flex-shrink:0;
//         }
//         .logo-text{color:#fff;font-weight:800;font-size:17px;font-family:'Fredoka One',cursive;}
//         .logo-sub{color:#FFB34799;font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;}

//         .sidebar-nav{flex:1;overflow-y:auto;padding:12px 0;}
//         .sidebar-nav::-webkit-scrollbar{width:3px;}
//         .sidebar-nav::-webkit-scrollbar-thumb{background:#FFB34744;border-radius:3px;}

//         .nav-item{
//           display:flex;align-items:center;gap:12px;
//           padding:10px 18px;margin:2px 8px;border-radius:12px;
//           cursor:pointer;transition:all 0.15s;
//           background:transparent;border:none;border-left:3px solid transparent;
//           font-family:'Nunito',sans-serif;
//         }
//         .nav-item:hover{background:rgba(255,107,107,0.08);color:#fff;}
//         .nav-item.active{
//           background:linear-gradient(135deg,#FF6B6B22,#FFB34722);
//           border-left-color:#FF6B6B;
//         }
//         .nav-icon{font-size:18px;flex-shrink:0;}
//         .nav-label{
//           font-size:14px;font-weight:600;
//           color:rgba(255,255,255,0.6);flex:1;white-space:nowrap;
//         }
//         .nav-item.active .nav-label{color:#FF6B6B;font-weight:700;}
//         .nav-badge{
//           background:#FF6B6B;color:#fff;
//           border-radius:10px;padding:2px 7px;
//           font-size:11px;font-weight:700;
//         }

//         .sidebar-user{
//           padding:14px 16px;border-top:1px solid rgba(255,255,255,0.08);
//           display:flex;align-items:center;gap:10px;flex-shrink:0;
//         }
//         .user-av{
//           width:36px;height:36px;border-radius:12px;flex-shrink:0;
//           background:linear-gradient(135deg,#FF6B6B,#FFB347);
//           display:flex;align-items:center;justify-content:center;
//           color:#fff;font-weight:800;font-size:13px;
//         }
//         .user-name{color:#fff;font-weight:700;font-size:13px;}
//         .user-role{color:#FFB34799;font-size:11px;}

//         /* ── Sidebar overlay for mobile ── */
//         .sidebar-overlay{
//           display:none;position:fixed;inset:0;
//           background:rgba(0,0,0,0.5);z-index:190;
//         }
//         .sidebar-overlay.visible{display:block;}

//         /* ══════════════════════════════════
//            MAIN AREA
//         ══════════════════════════════════ */
//         .ud-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}

//         .ud-topbar{
//           height:60px;background:#fff;
//           border-bottom:2px solid #FFF0E8;
//           display:flex;align-items:center;
//           padding:0 24px;gap:14px;flex-shrink:0;
//         }
//         .menu-btn{
//           background:none;border:none;cursor:pointer;
//           font-size:20px;color:#777;display:none;
//           padding:4px;border-radius:8px;
//         }
//         .topbar-title{
//           font-weight:800;font-size:17px;color:#1A1A2E;
//           font-family:'Fredoka One',cursive;flex:1;
//         }
//         .topbar-pill{
//           background:#FFF0F0;color:#FF6B6B;
//           font-weight:800;font-size:12px;
//           padding:6px 14px;border-radius:50px;
//           border:1.5px solid #FFD6D6;
//           white-space:nowrap;
//         }
//         .topbar-notif{
//           width:34px;height:34px;border-radius:10px;
//           background:#FFF0F0;border:1.5px solid #FFD6D6;
//           display:flex;align-items:center;justify-content:center;
//           cursor:pointer;font-size:16px;position:relative;flex-shrink:0;
//         }
//         .notif-dot{
//           width:7px;height:7px;background:#FF6B6B;border-radius:50%;
//           position:absolute;top:5px;right:5px;
//         }

//         /* ── Scroll container ── */
//         .ud-scroll{flex:1;overflow-y:auto;padding:24px;}
//         .ud-scroll::-webkit-scrollbar{width:5px;}
//         .ud-scroll::-webkit-scrollbar-thumb{background:#FFB34744;border-radius:3px;}

//         /* ══════════════════════════════════
//            PAGE CONTENT COMMONS
//         ══════════════════════════════════ */
//         .page-content{display:flex;flex-direction:column;gap:18px;}
//         .page-header{margin-bottom:4px;}
//         .page-title{font-family:'Fredoka One',cursive;font-size:26px;color:#1A1A2E;}
//         .page-sub{font-size:13px;color:#999;margin-top:2px;}

//         /* ══════════════════════════════════
//            WELCOME BANNER
//         ══════════════════════════════════ */
//         .welcome-banner{
//           background:linear-gradient(135deg,#FF6B6B,#FFB347);
//           border-radius:22px;padding:28px 32px;
//           display:flex;align-items:center;justify-content:space-between;
//           box-shadow:0 8px 32px rgba(255,107,107,0.3);
//           overflow:hidden;position:relative;
//         }
//         .welcome-tag{
//           display:inline-flex;align-items:center;gap:6px;
//           background:rgba(255,255,255,0.2);border-radius:50px;
//           padding:4px 14px;font-size:11px;font-weight:800;
//           color:#fff;letter-spacing:0.1em;text-transform:uppercase;
//           margin-bottom:10px;
//         }
//         .welcome-title{
//           font-family:'Fredoka One',cursive;font-size:clamp(20px,3vw,28px);
//           color:#fff;line-height:1.2;margin-bottom:8px;
//         }
//         .welcome-title span{color:rgba(255,255,255,0.9);}
//         .welcome-sub{font-size:14px;color:rgba(255,255,255,0.85);font-weight:600;line-height:1.5;}
//         .welcome-emoji{font-size:64px;line-height:1;flex-shrink:0;}

//         /* ══════════════════════════════════
//            QUICK STATS
//         ══════════════════════════════════ */
//         .quick-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
//         .quick-stat-card{
//           background:var(--card-bg);border-radius:18px;padding:18px;
//           border:2px solid color-mix(in srgb, var(--accent) 20%, transparent);
//           display:flex;gap:14px;align-items:center;
//           transition:transform 0.2s,box-shadow 0.2s;cursor:default;
//         }
//         .quick-stat-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.08);}
//         .qs-icon{font-size:28px;flex-shrink:0;}
//         .qs-label{font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:2px;}
//         .qs-value{font-family:'Fredoka One',cursive;font-size:22px;color:var(--accent);line-height:1;}
//         .qs-sub{font-size:11px;color:#999;margin-top:3px;}

//         /* ══════════════════════════════════
//            SHARED CARD
//         ══════════════════════════════════ */
//         .dash-card{
//           background:#fff;border-radius:18px;padding:20px;
//           border:1px solid #FFF0E8;
//         }
//         .card-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;}
//         .card-title{font-size:15px;font-weight:800;color:#1A1A2E;}
//         .card-sub{font-size:11px;color:#999;margin-top:2px;}
//         .card-action{
//           background:none;border:none;cursor:pointer;
//           font-size:13px;font-weight:700;color:#FF6B6B;
//           font-family:'Nunito',sans-serif;
//         }

//         /* ── Home mid ── */
//         .home-mid{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
//         .home-bottom{display:grid;grid-template-columns:1.2fr 1fr;gap:18px;}

//         /* ── Today class ── */
//         .today-class-box{
//           display:flex;align-items:center;gap:14px;
//           background:#FFF0F0;border-radius:14px;
//           padding:14px 16px;margin-bottom:12px;
//           border:1.5px solid #FFD6D6;position:relative;
//         }
//         .today-dot{width:10px;height:10px;border-radius:50%;background:#FF6B6B;flex-shrink:0;animation:pulse 2s infinite;}
//         @keyframes pulse{0%,100%{box-shadow:0 0 0 0 #FF6B6B55}50%{box-shadow:0 0 0 8px transparent;}}
//         .today-info{flex:1;}
//         .today-subject{font-weight:800;color:#1A1A2E;font-size:14px;}
//         .today-meta{font-size:12px;color:#777;margin-top:2px;}
//         .today-live{
//           background:#FF6B6B;color:#fff;font-size:9px;
//           font-weight:900;letter-spacing:0.1em;
//           padding:3px 10px;border-radius:50px;
//         }
//         .today-tip{font-size:12px;color:#999;padding:10px 14px;background:#FFFDF7;border-radius:10px;}

//         /* ── Announcement items ── */
//         .ann-item{
//           display:flex;align-items:center;gap:12px;
//           padding:10px 0;border-bottom:1px solid #FFF0E8;
//         }
//         .ann-item:last-child{border-bottom:none;}
//         .ann-dot{width:8px;height:8px;border-radius:50%;background:var(--ann-color);flex-shrink:0;}
//         .ann-body{flex:1;}
//         .ann-title{font-size:13px;font-weight:700;color:#1A1A2E;line-height:1.3;}
//         .ann-date{font-size:11px;color:#999;margin-top:2px;}
//         .ann-urgent{background:#FF6B6B;color:#fff;font-size:9px;font-weight:900;letter-spacing:0.1em;padding:3px 8px;border-radius:50px;flex-shrink:0;}

//         /* ── Notes row ── */
//         .notes-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
//         .note-mini{
//           background:#FFFDF7;border-radius:14px;padding:16px;
//           border:1.5px solid #FFF0E8;cursor:pointer;position:relative;
//           transition:all 0.2s;
//         }
//         .note-mini:hover{transform:translateY(-2px);border-color:var(--note-color);box-shadow:0 4px 16px rgba(0,0,0,0.06);}
//         .note-mini-emoji{font-size:24px;margin-bottom:8px;}
//         .note-mini-name{font-size:12px;font-weight:700;color:#1A1A2E;line-height:1.3;margin-bottom:4px;}
//         .note-mini-meta{font-size:10px;color:#999;}
//         .note-new-dot{
//           width:8px;height:8px;background:#FF6B6B;border-radius:50%;
//           position:absolute;top:10px;right:10px;
//         }

//         /* ── Progress ring ── */
//         .progress-card .progress-row{display:flex;gap:20px;align-items:center;}
//         .progress-ring-wrap{display:flex;flex-direction:column;align-items:center;gap:8px;flex-shrink:0;}
//         .progress-svg{width:80px;height:80px;}
//         .ring-label{font-size:11px;font-weight:700;color:#999;}
//         .progress-bars{flex:1;display:flex;flex-direction:column;gap:10px;}
//         .prog-bar-row{display:flex;align-items:center;gap:10px;}
//         .prog-bar-label{font-size:12px;font-weight:700;color:#555;width:60px;flex-shrink:0;}
//         .prog-bar-track{flex:1;height:6px;background:#FFF0E8;border-radius:6px;overflow:hidden;}
//         .prog-bar-fill{height:100%;border-radius:6px;transition:width 1.2s cubic-bezier(.4,0,.2,1);}
//         .prog-bar-pct{font-size:11px;font-weight:700;color:#999;width:32px;text-align:right;flex-shrink:0;}

//         /* ── Exam card inner ── */
//         .exam-card-inner{display:flex;gap:16px;align-items:flex-start;margin-bottom:12px;}
//         .exam-date-badge{
//           background:#FFB34720;border-radius:12px;padding:12px 14px;
//           text-align:center;flex-shrink:0;border:1.5px solid #FFB34744;
//         }
//         .exam-month{font-size:10px;font-weight:800;color:#FFB347;letter-spacing:0.1em;}
//         .exam-day{font-family:'Fredoka One',cursive;font-size:26px;color:#FFB347;line-height:1;}
//         .exam-info .exam-name{font-size:15px;font-weight:800;color:#1A1A2E;margin-bottom:4px;}
//         .exam-info .exam-meta{font-size:12px;color:#999;margin-bottom:6px;}
//         .exam-topics{font-size:12px;color:#555;font-weight:600;line-height:1.4;}
//         .exam-days-left{
//           font-size:12px;font-weight:700;color:#FFB347;
//           background:#FFF8EE;padding:8px 14px;border-radius:10px;
//           display:flex;align-items:center;gap:6px;
//           border:1px solid #FFB34744;
//         }

//         /* ══════════════════════════════════
//            ANNOUNCEMENTS PAGE
//         ══════════════════════════════════ */
//         .ann-list{display:flex;flex-direction:column;gap:14px;}
//         .ann-full-card{
//           background:#fff;border-radius:16px;padding:20px;
//           border:2px solid var(--ann-color,#FFF0E8);
//           display:flex;align-items:flex-start;justify-content:space-between;gap:16px;
//           border-left-width:5px;
//         }
//         .ann-full-left{flex:1;}
//         .ann-full-tag{
//           display:inline-block;font-size:11px;font-weight:800;
//           padding:3px 12px;border-radius:50px;margin-bottom:8px;
//         }
//         .ann-full-title{font-size:15px;font-weight:800;color:#1A1A2E;margin-bottom:8px;}
//         .ann-full-body{font-size:13px;color:#555;line-height:1.6;font-weight:600;margin-bottom:10px;}
//         .ann-full-date{font-size:11px;color:#999;}
//         .ann-full-urgent{
//           background:#FF6B6B;color:#fff;font-size:10px;font-weight:900;
//           letter-spacing:0.1em;padding:4px 12px;border-radius:50px;
//           flex-shrink:0;height:fit-content;
//         }

//         /* ══════════════════════════════════
//            SCHEDULE PAGE
//         ══════════════════════════════════ */
//         .schedule-week{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;}
//         .sched-day-card{
//           background:#fff;border-radius:16px;padding:16px 14px;
//           border:2px solid #FFF0E8;min-height:160px;
//           display:flex;flex-direction:column;gap:8px;
//         }
//         .sched-day-card.today-day{border-color:#FF6B6B33;background:#FFF5F5;}
//         .sched-day-card.has-class{}
//         .sched-day-label{font-size:12px;font-weight:800;color:#999;text-transform:uppercase;letter-spacing:0.1em;}
//         .sched-day-card.today-day .sched-day-label{color:#FF6B6B;}
//         .sched-class-info{
//           background:color-mix(in srgb, var(--sched-color) 12%, white);
//           border-radius:10px;padding:10px 10px;
//           border:1px solid color-mix(in srgb, var(--sched-color) 25%, transparent);
//           flex:1;display:flex;flex-direction:column;gap:4px;
//         }
//         .sched-subject{font-size:12px;font-weight:800;color:#1A1A2E;line-height:1.3;}
//         .sched-time{font-size:11px;color:#777;font-weight:600;}
//         .sched-teacher,.sched-room{font-size:10px;color:#999;}
//         .sched-live-pill{
//           background:#FF6B6B;color:#fff;font-size:9px;
//           font-weight:900;padding:3px 8px;border-radius:50px;
//           width:fit-content;margin-top:4px;letter-spacing:0.08em;
//         }
//         .sched-off{font-size:12px;color:#ccc;font-weight:700;margin-top:8px;}
//         .class-detail-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
//         .class-detail-item{background:#FFFDF7;border-radius:12px;padding:14px;border:1px solid #FFF0E8;}
//         .cd-label{font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;}
//         .cd-value{font-size:13px;font-weight:800;color:#1A1A2E;}

//         /* ══════════════════════════════════
//            NOTES PAGE
//         ══════════════════════════════════ */
//         .notes-filter{display:flex;gap:8px;flex-wrap:wrap;}
//         .filter-pill{
//           padding:6px 16px;border-radius:50px;border:2px solid #FFF0E8;
//           background:transparent;color:#999;font-size:13px;font-weight:700;
//           cursor:pointer;font-family:'Nunito',sans-serif;transition:all 0.15s;
//         }
//         .filter-pill.active,.filter-pill:hover{
//           background:#FF6B6B;border-color:#FF6B6B;color:#fff;
//         }
//         .notes-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
//         .note-card{
//           background:#fff;border-radius:18px;padding:20px;
//           border:2px solid #FFF0E8;cursor:pointer;position:relative;
//           transition:all 0.25s;display:flex;flex-direction:column;gap:8px;
//         }
//         .note-card:hover{border-color:var(--note-color);transform:translateY(-4px);box-shadow:0 12px 28px rgba(0,0,0,0.08);}
//         .note-new-badge{
//           position:absolute;top:12px;right:12px;
//           background:#FF6B6B;color:#fff;font-size:9px;font-weight:900;
//           padding:3px 8px;border-radius:50px;letter-spacing:0.1em;
//         }
//         .note-card-emoji{font-size:32px;}
//         .note-card-name{font-size:13px;font-weight:800;color:#1A1A2E;line-height:1.4;}
//         .note-card-prog{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;}
//         .note-card-meta{font-size:11px;color:#999;}
//         .note-card-btn{
//           margin-top:6px;padding:8px;border-radius:10px;text-align:center;
//           color:#fff;font-size:12px;font-weight:800;
//         }

//         /* ══════════════════════════════════
//            ATTENDANCE PAGE
//         ══════════════════════════════════ */
//         .att-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
//         .att-stat-box{
//           border-radius:16px;padding:18px;text-align:center;
//           border:2px solid;
//         }
//         .att-stat-val{font-family:'Fredoka One',cursive;font-size:28px;line-height:1;margin-bottom:4px;}
//         .att-stat-label{font-size:11px;font-weight:700;color:#777;text-transform:uppercase;letter-spacing:0.1em;}
//         .att-list{display:flex;flex-direction:column;gap:2px;}
//         .att-row{
//           display:flex;align-items:center;gap:14px;
//           padding:12px 14px;border-radius:12px;background:#FFFDF7;
//           border:1px solid #FFF0E8;
//         }
//         .att-date-col{width:60px;flex-shrink:0;}
//         .att-date{font-size:13px;font-weight:800;color:#1A1A2E;}
//         .att-day{font-size:10px;color:#999;font-weight:600;}
//         .att-bar{width:2px;height:28px;background:#FFF0E8;border-radius:2px;flex-shrink:0;}
//         .att-subject{flex:1;font-size:13px;color:#555;font-weight:600;}
//         .att-badge{font-size:12px;font-weight:800;padding:4px 12px;border-radius:50px;flex-shrink:0;}
//         .att-present{background:#F0FFFE;color:#4ECDC4;}
//         .att-absent{background:#FFF0F0;color:#FF6B6B;}
//         .att-late{background:#FFF8EE;color:#FFB347;}

//         /* ══════════════════════════════════
//            EXAMS PAGE
//         ══════════════════════════════════ */
//         .exams-list{display:flex;flex-direction:column;gap:14px;}
//         .exam-full-card{
//           background:#fff;border-radius:18px;padding:20px 24px;
//           border:2px solid #FFF0E8;display:flex;
//           align-items:center;justify-content:space-between;gap:20px;
//         }
//         .exam-full-card.exam-upcoming{border-color:#FFB34744;background:#FFFBF5;}
//         .exam-full-left{display:flex;gap:16px;align-items:flex-start;}
//         .efcard-date-box{border-radius:12px;padding:10px 14px;text-align:center;flex-shrink:0;}
//         .efcard-month{font-size:10px;font-weight:800;letter-spacing:0.1em;}
//         .efcard-day{font-family:'Fredoka One',cursive;font-size:24px;line-height:1;}
//         .efcard-title{font-size:15px;font-weight:800;color:#1A1A2E;margin-bottom:4px;}
//         .efcard-meta{font-size:12px;color:#999;margin-bottom:6px;}
//         .efcard-upcoming-tag{
//           display:inline-flex;align-items:center;gap:4px;
//           font-size:12px;font-weight:700;color:#FFB347;
//           background:#FFF8EE;padding:4px 12px;border-radius:50px;
//           border:1px solid #FFB34744;
//         }
//         .efcard-result{font-size:13px;font-weight:700;color:#555;}
//         .efcard-grade{display:inline-block;margin-top:4px;font-size:13px;font-weight:800;}
//         .efcard-score-circle{
//           width:60px;height:60px;border-radius:50%;
//           border:3px solid;display:flex;align-items:center;justify-content:center;
//           font-size:14px;flex-shrink:0;
//         }

//         /* ══════════════════════════════════
//            FEES PAGE
//         ══════════════════════════════════ */
//         .fee-alert{
//           background:linear-gradient(135deg,#FF6B6B,#FFB347);
//           border-radius:16px;padding:18px 22px;
//           display:flex;align-items:center;justify-content:space-between;gap:16px;
//           box-shadow:0 6px 20px rgba(255,107,107,0.3);
//         }
//         .fee-alert-title{font-size:15px;font-weight:800;color:#fff;margin-bottom:3px;}
//         .fee-alert-sub{font-size:13px;color:rgba(255,255,255,0.8);font-weight:600;}
//         .fee-pay-btn{
//           background:#fff;color:#FF6B6B;border:none;
//           font-family:'Nunito',sans-serif;font-weight:900;font-size:14px;
//           padding:10px 22px;border-radius:50px;cursor:pointer;
//           box-shadow:0 4px 12px rgba(0,0,0,0.1);flex-shrink:0;
//         }
//         .fee-list{display:flex;flex-direction:column;gap:4px;}
//         .fee-row{
//           display:flex;align-items:center;gap:14px;
//           padding:14px 16px;background:#FFFDF7;
//           border-radius:12px;border:1px solid #FFF0E8;flex-wrap:wrap;
//         }
//         .fee-month{font-size:14px;font-weight:800;color:#1A1A2E;flex:1;min-width:120px;}
//         .fee-amount{font-size:15px;font-weight:800;color:#1A1A2E;font-family:'Fredoka One',cursive;}
//         .fee-status-badge{font-size:12px;font-weight:700;padding:4px 12px;border-radius:50px;flex-shrink:0;}
//         .fee-paid{background:#F0FFFE;color:#4ECDC4;}
//         .fee-pending{background:#FFF0F0;color:#FF6B6B;}
//         .receipt-btn{
//           background:none;border:1.5px solid #FFF0E8;
//           font-family:'Nunito',sans-serif;font-size:12px;font-weight:700;
//           color:#999;padding:4px 12px;border-radius:50px;cursor:pointer;
//           transition:all 0.15s;
//         }
//         .receipt-btn:hover{border-color:#FF6B6B;color:#FF6B6B;}

//         /* ══════════════════════════════════
//            PROFILE PAGE
//         ══════════════════════════════════ */
//         .profile-hero{
//           text-align:center;padding:32px 20px;
//           background:linear-gradient(160deg,#FFF0F0,#FFFDF7);
//           border-radius:20px;border:2px solid #FFD6D6;
//         }
//         .profile-avatar-big{
//           width:72px;height:72px;border-radius:22px;
//           background:linear-gradient(135deg,#FF6B6B,#FFB347);
//           display:flex;align-items:center;justify-content:center;
//           color:#fff;font-size:26px;font-weight:800;
//           margin:0 auto 14px;
//           box-shadow:0 8px 24px rgba(255,107,107,0.3);
//         }
//         .profile-name{font-family:'Fredoka One',cursive;font-size:22px;color:#1A1A2E;margin-bottom:6px;}
//         .profile-prog-badge{
//           display:inline-block;background:#FF6B6B22;color:#FF6B6B;
//           font-size:12px;font-weight:800;padding:5px 16px;border-radius:50px;
//           border:1.5px solid #FF6B6B44;
//         }
//         .profile-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
//         .profile-field{background:#fff;border-radius:14px;padding:16px;border:1px solid #FFF0E8;}
//         .pf-label{font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;}
//         .pf-value{font-size:13px;font-weight:800;color:#1A1A2E;}
//         .profile-actions{display:flex;gap:12px;flex-wrap:wrap;}
//         .profile-btn{
//           padding:11px 22px;border-radius:50px;border:2px solid #FFF0E8;
//           background:#fff;color:#555;font-family:'Nunito',sans-serif;
//           font-size:14px;font-weight:700;cursor:pointer;
//           transition:all 0.15s;
//         }
//         .profile-btn:hover{border-color:#FF6B6B;color:#FF6B6B;}
//         .profile-btn.danger:hover{border-color:#FF6B6B;background:#FF6B6B;color:#fff;}

//         /* ══════════════════════════════════
//            TOAST
//         ══════════════════════════════════ */
//         .ud-toast{
//           position:fixed;bottom:28px;right:28px;
//           background:linear-gradient(135deg,#FF6B6B,#FFB347);
//           color:#fff;padding:14px 22px;border-radius:14px;
//           font-weight:700;font-size:14px;
//           box-shadow:0 8px 24px rgba(255,107,107,0.4);
//           z-index:9999;animation:toastIn 0.3s ease;
//           font-family:'Nunito',sans-serif;
//         }
//         @keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

//         /* ══════════════════════════════════
//            MEDIA QUERIES
//         ══════════════════════════════════ */

//         /* ── Tablet: ≤ 1024px ── */
//         @media (max-width: 1024px) {
//           .quick-stats { grid-template-columns: repeat(2, 1fr); }
//           .home-mid    { grid-template-columns: 1fr; }
//           .home-bottom { grid-template-columns: 1fr; }
//           .notes-grid  { grid-template-columns: repeat(2, 1fr); }
//           .notes-row   { grid-template-columns: repeat(2, 1fr); }
//           .profile-grid{ grid-template-columns: repeat(2, 1fr); }
//           .schedule-week{ grid-template-columns: repeat(3, 1fr); }
//           .class-detail-grid{ grid-template-columns: repeat(2, 1fr); }
//         }

//         /* ── Mobile sidebar toggle ── */
//         @media (max-width: 768px) {
//           .menu-btn    { display: flex; }
//           .ud-sidebar  {
//             position: fixed; left: 0; top: 0; height: 100vh;
//             transform: translateX(-100%);
//             transition: transform 0.3s cubic-bezier(.4,0,.2,1);
//           }
//           .ud-sidebar.open { transform: translateX(0); }

//           .welcome-emoji{ display: none; }
//           .welcome-banner{ padding: 22px 22px; }
//           .welcome-title { font-size: clamp(18px,5vw,24px); }

//           .quick-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
//           .quick-stat-card { padding: 14px; }
//           .qs-value { font-size: 18px; }

//           .home-mid    { grid-template-columns: 1fr; gap: 14px; }
//           .home-bottom { grid-template-columns: 1fr; gap: 14px; }
//           .notes-row   { grid-template-columns: 1fr; }

//           .schedule-week { grid-template-columns: repeat(2, 1fr); }
//           .notes-grid    { grid-template-columns: repeat(2, 1fr); }
//           .att-stats     { grid-template-columns: repeat(2, 1fr); }
//           .profile-grid  { grid-template-columns: repeat(2, 1fr); }
//           .class-detail-grid{ grid-template-columns: 1fr 1fr; }

//           .ud-scroll { padding: 16px; }
//           .ud-topbar { padding: 0 16px; }
//           .topbar-pill { display: none; }

//           .exam-full-card { flex-direction: column; gap: 12px; }
//           .efcard-score-circle { align-self: flex-start; }

//           .fee-row { flex-direction: column; align-items: flex-start; gap: 8px; }

//           .ud-toast { bottom: 16px; right: 16px; left: 16px; text-align: center; }
//         }

//         /* ── Small Mobile: ≤ 480px ── */
//         @media (max-width: 480px) {
//           .quick-stats { grid-template-columns: 1fr 1fr; gap: 8px; }
//           .qs-icon     { font-size: 22px; }
//           .qs-value    { font-size: 16px; }
//           .qs-label    { font-size: 9px; }

//           .schedule-week { grid-template-columns: 1fr 1fr; }
//           .notes-grid    { grid-template-columns: 1fr; }
//           .att-stats     { grid-template-columns: repeat(2, 1fr); }
//           .profile-grid  { grid-template-columns: 1fr 1fr; }

//           .ann-full-card { flex-direction: column; }
//           .exam-full-left{ flex-direction: column; gap: 10px; }

//           .page-title    { font-size: 22px; }
//           .welcome-title { font-size: 18px; }
//           .welcome-sub   { font-size: 13px; }
//           .welcome-banner{ padding: 18px 16px; }

//           .dash-card     { padding: 16px; }
//           .progress-row  { flex-direction: column; }
//           .class-detail-grid { grid-template-columns: 1fr; }
//         }

//         /* ── Extra Small: ≤ 360px ── */
//         @media (max-width: 360px) {
//           .quick-stats   { grid-template-columns: 1fr; }
//           .att-stats     { grid-template-columns: 1fr 1fr; }
//           .schedule-week { grid-template-columns: 1fr; }
//           .ud-scroll     { padding: 12px; }
//         }
//       `}</style>

//       {/* Sidebar overlay (mobile) */}
//       <div
//         className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
//         onClick={() => setSidebarOpen(false)}
//       />

//       <div className="ud-shell">

//         {/* ── Sidebar ── */}
//         <aside className={`ud-sidebar ${sidebarOpen ? "open" : ""}`}>
//           <div className="sidebar-logo">
//             <div className="logo-icon">🧮</div>
//             <div>
//               <div className="logo-text">Ascento</div>
//               <div className="logo-sub">Student Portal</div>
//             </div>
//           </div>

//           <nav className="sidebar-nav">
//             {NAV.map(item => (
//               <button
//                 key={item.id}
//                 className={`nav-item ${activePage === item.id ? "active" : ""}`}
//                 onClick={() => { setActivePage(item.id as NavPage); setSidebarOpen(false); }}
//               >
//                 <span className="nav-icon">{item.icon}</span>
//                 <span className="nav-label">{item.label}</span>
//                 {(item as any).badge ? <span className="nav-badge">{(item as any).badge}</span> : null}
//               </button>
//             ))}
//           </nav>

//           <div className="sidebar-user">
//             <div className="user-av">{STUDENT.initials}</div>
//             <div>
//               <div className="user-name">{STUDENT.name}</div>
//               <div className="user-role">{STUDENT.program}</div>
//             </div>
//           </div>
//         </aside>

//         {/* ── Main ── */}
//         <div className="ud-main">
//           {/* Topbar */}
//           <header className="ud-topbar">
//             <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
//             <div className="topbar-title">
//               {NAV.find(n => n.id === activePage)?.label ?? "Dashboard"}
//             </div>
//             <div className="topbar-pill">🎒 {STUDENT.level}</div>
//             <div className="topbar-notif" onClick={() => showToast("You have 1 urgent announcement!")}>
//               🔔
//               <div className="notif-dot" />
//             </div>
//           </header>

//           {/* Page */}
//           <div className="ud-scroll">
//             {PAGE_MAP[activePage]()}
//           </div>
//         </div>
//       </div>

//       {/* Toast */}
//       {toast && <div className="ud-toast">{toast}</div>}
//     </>
//   );
// }








import UserDashboard from "@/components/userdashboard/UserDashboard";

export default function DashboardPage() {
  return <UserDashboard />;
}


