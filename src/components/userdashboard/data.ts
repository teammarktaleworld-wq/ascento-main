// ─── Mock Data ────────────────────────────────────────────────────────────────

export const STUDENT = {
  name: "Aarav Sharma",
  initials: "AS",
  program: "Abacus Mastery",
  level: "Level 5",
  batch: "Mon–Wed–Fri · 4:00 PM",
  rollNo: "ASC-2024-047",
  teacher: "Mrs. Bala Tomar",
  joinedDate: "Aug 2024",
  avatar: null,
};

export const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "🎉 Annual Competition Registration Open!",
    body: "Register now for the National Abacus Championship 2025. Last date: 15 Feb. Prizes worth ₹50,000!",
    date: "Today",
    tag: "Competition",
    color: "#FF6B6B",
    urgent: true,
  },
  {
    id: 2,
    title: "🏖️ Summer Camp 2025",
    body: "Enrol your child in our intensive 4-week summer brain development camp starting May 15th.",
    date: "2 days ago",
    tag: "Event",
    color: "#FFB347",
    urgent: false,
  },
  {
    id: 3,
    title: "📅 Holiday Notice — Republic Day",
    body: "Centre will remain closed on 26th January. Classes will resume on 27th January as usual.",
    date: "5 days ago",
    tag: "Notice",
    color: "#4ECDC4",
    urgent: false,
  },
  {
    id: 4,
    title: "📝 Level 5 Mid-Term Exam Schedule",
    body: "Your mid-term assessment is scheduled for February 8th, 10:00 AM. Topic: Speed addition & multiplication.",
    date: "1 week ago",
    tag: "Exam",
    color: "#A78BFA",
    urgent: false,
  },
];

export const SCHEDULE = [
  {
    day: "Mon",
    subject: "Abacus Speed Practice",
    time: "4:00–6:00 PM",
    teacher: "Mrs. Bala Tomar",
    room: "Room 2",
    color: "#FF6B6B",
    active: true,
  },
  {
    day: "Wed",
    subject: "Abacus Speed Practice",
    time: "4:00–6:00 PM",
    teacher: "Mrs. Bala Tomar",
    room: "Room 2",
    color: "#FF6B6B",
    active: false,
  },
  {
    day: "Fri",
    subject: "Worksheet + Oral Test",
    time: "4:00–6:00 PM",
    teacher: "Mrs. Bala Tomar",
    room: "Room 2",
    color: "#FFB347",
    active: false,
  },
];

export const NOTES = [
  {
    id: 1,
    title: "Level 5 — Multiplication Worksheet",
    type: "PDF",
    size: "1.2 MB",
    program: "Abacus",
    color: "#FF6B6B",
    emoji: "📄",
    date: "Jan 20",
    new: true,
  },
  {
    id: 2,
    title: "Speed Drill Practice Set #12",
    type: "PDF",
    size: "0.8 MB",
    program: "Abacus",
    color: "#FF6B6B",
    emoji: "📋",
    date: "Jan 15",
    new: false,
  },
  {
    id: 3,
    title: "Vedic Maths — Nikhilam Intro",
    type: "PDF",
    size: "1.5 MB",
    program: "Vedic",
    color: "#A78BFA",
    emoji: "📘",
    date: "Jan 10",
    new: false,
  },
  {
    id: 4,
    title: "Abacus Level 5 — Complete Notes",
    type: "PDF",
    size: "3.2 MB",
    program: "Abacus",
    color: "#FF6B6B",
    emoji: "📚",
    date: "Jan 5",
    new: false,
  },
  {
    id: 5,
    title: "Mental Maths Tricks — Part 2",
    type: "Video",
    size: "Watch",
    program: "Abacus",
    color: "#4ECDC4",
    emoji: "🎬",
    date: "Dec 28",
    new: false,
  },
];

export const ATTENDANCE = [
  { date: "Jan 20", day: "Mon", status: "present" },
  { date: "Jan 17", day: "Fri", status: "present" },
  { date: "Jan 15", day: "Wed", status: "late" },
  { date: "Jan 13", day: "Mon", status: "present" },
  { date: "Jan 10", day: "Fri", status: "present" },
  { date: "Jan 8", day: "Wed", status: "absent" },
  { date: "Jan 6", day: "Mon", status: "present" },
  { date: "Jan 3", day: "Fri", status: "present" },
];

export const EXAMS = [
  {
    title: "Level 5 Mid-Term",
    date: "Feb 8, 2025",
    time: "10:00 AM",
    status: "upcoming",
    score: null,
    total: 100,
    color: "#FFB347",
  },
  {
    title: "Level 5 Speed Test",
    date: "Jan 12, 2025",
    time: "4:30 PM",
    status: "completed",
    score: 87,
    total: 100,
    color: "#4ECDC4",
  },
  {
    title: "Level 4 Final Exam",
    date: "Dec 14, 2024",
    time: "10:00 AM",
    status: "completed",
    score: 92,
    total: 100,
    color: "#4ECDC4",
  },
];

export const FEES = [
  {
    month: "February 2025",
    amount: 1800,
    status: "pending",
    due: "Feb 5",
    paid: null,
  },
  {
    month: "January 2025",
    amount: 1800,
    status: "paid",
    due: null,
    paid: "Jan 3",
  },
  {
    month: "December 2024",
    amount: 1800,
    status: "paid",
    due: null,
    paid: "Dec 2",
  },
];
export type NavPage =
  | "home"
  | "schedule"
  | "notes"
  | "attendance"
  | "homework"
  | "exams"
  | "fees"
  | "announcements"
  | "profile";

export const NAV_ITEMS: { id: NavPage; icon: string; label: string }[] = [
  { id: "home",          icon: "⊞", label: "Dashboard" },
  { id: "announcements", icon: "📢", label: "Announcements" },
  { id: "schedule",      icon: "📅", label: "Schedule" },
  { id: "notes",         icon: "📚", label: "Notes" },
  { id: "homework",      icon: "📂", label: "Homework Files" },
  { id: "attendance",    icon: "✅", label: "Attendance" },
  { id: "exams",         icon: "📝", label: "Exams" },
  { id: "fees",          icon: "💳", label: "Fees" },
  { id: "profile",       icon: "👤", label: "My Profile" },
];