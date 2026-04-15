// ─── Student Data Types & Mock Fallbacks ─────────────────────────────────────
// When backend is connected, data comes from API. These serve as types + fallback.

export interface StudentProfile {
  name: string;
  id: string;
  class: string;
  roll: number | string;
  avatar: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  blood: string;
  address: string;
  parent: string;
  parentPhone: string;
  parentEmail: string;
  joined: string;
  domainName?: string;
}

export interface KPI {
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
  trend: string;
}

export interface Subject {
  code: string;
  name: string;
  teacher: string;
  desc: string;
}

export interface ExamItem {
  name: string;
  dates: string;
  duration: string;
  status: string;
  subjects: string[];
  id?: string;
}

export interface FeeItem {
  type: string;
  amount: number;
  due: string;
  status: string;
  id?: string;
}

export interface ResultItem {
  subject: string;
  marksObtained: number | null;
  totalMarks: number;
  grade: string;
  examName?: string;
}

export interface TeacherItem {
  name: string;
  subject: string;
  exp: string;
  email: string;
  phone: string;
}

export interface NotificationItem {
  type: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  id?: string;
}

export interface AttendanceData {
  overall: number;
  bySubject: { subject: string; present: number; total: number; pct: number }[];
  records: { date: string; status: string }[];
}

export interface TimetableData {
  [day: string]: string[];
}

export interface DocumentItem {
  name: string;
  type: string;
  date: string;
  size: string;
}

// ─── Subject Colors ──────────────────────────────────────────────────────────

export const subjectColors: Record<string, string> = {
  "Mathematics": "#6366f1",
  "English": "#10b981",
  "Science": "#f59e0b",
  "Social Studies": "#ec4899",
  "Hindi": "#14b8a6",
  "Computer Sc.": "#8b5cf6",
  "Computer Science": "#8b5cf6",
  "Sports": "#06b6d4",
  "Art": "#f97316",
  "Library": "#84cc16",
  "Activities": "#e879f9",
  "—": "#cbd5e1",
};

// ─── Transform API data to portal format ─────────────────────────────────────

export function transformStudentProfile(apiUser: any, enrollment: any): StudentProfile {
  return {
    name: apiUser.fullName || apiUser.name || "Student",
    id: apiUser.userId || apiUser._id || "",
    class: enrollment
      ? `${enrollment.classId?.name || ""}${enrollment.sectionId?.name ? " - " + enrollment.sectionId.name : ""}`
      : "Not Enrolled",
    roll: apiUser.rollNumber || "",
    avatar: (apiUser.fullName || "S").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
    email: apiUser.parentEmail || apiUser.email || "",
    phone: apiUser.parentPhone || "",
    dob: apiUser.dateOfBirth ? new Date(apiUser.dateOfBirth).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "",
    gender: apiUser.gender || "",
    blood: apiUser.bloodGroup || "",
    address: [apiUser.address, apiUser.city, apiUser.state].filter(Boolean).join(", "),
    parent: apiUser.parentName || "",
    parentPhone: apiUser.parentPhone || "",
    parentEmail: apiUser.parentEmail || "",
    joined: apiUser.createdAt ? new Date(apiUser.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "",
    domainName: enrollment?.classId?.domainId?.name || "",
  };
}

export function transformDashboardToKPIs(dashboard: any): KPI[] {
  const attendancePct = dashboard.attendance?.monthly ?? 0;
  const pendingFeesTotal = (dashboard.pendingFees || []).reduce((a: number, f: any) => a + (f.amount || 0), 0);
  const upcomingExamCount = (dashboard.upcomingExams || []).length;
  const nextExam = dashboard.upcomingExams?.[0];

  return [
    {
      label: "Attendance",
      value: `${Math.round(attendancePct)}%`,
      sub: attendancePct < 85 ? "Below 85% target" : "On target",
      icon: "📅",
      color: attendancePct < 85 ? "#f59e0b" : "#10b981",
      trend: "",
    },
    {
      label: "Pending Homework",
      value: String((dashboard.pendingHomework || []).length),
      sub: "Assignments due",
      icon: "📝",
      color: "#6366f1",
      trend: "",
    },
    {
      label: "Pending Fees",
      value: pendingFeesTotal > 0 ? `₹${pendingFeesTotal.toLocaleString("en-IN")}` : "₹0",
      sub: pendingFeesTotal > 0 ? "Payment due" : "All clear",
      icon: "💰",
      color: pendingFeesTotal > 0 ? "#ef4444" : "#10b981",
      trend: "",
    },
    {
      label: "Upcoming Exams",
      value: String(upcomingExamCount),
      sub: nextExam ? `Next: ${new Date(nextExam.examStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : "None scheduled",
      icon: "📝",
      color: "#10b981",
      trend: "",
    },
  ];
}

export function transformFees(apiFees: any[]): FeeItem[] {
  return (apiFees || []).map((f) => ({
    type: f.feeType || "Fee",
    amount: f.amount || 0,
    due: f.dueDate ? new Date(f.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "",
    status: f.paymentStatus === "paid" ? "Paid" : "Pending",
    id: f._id,
  }));
}

export function transformExams(apiExams: any[]): ExamItem[] {
  return (apiExams || []).map((e) => {
    const start = e.examStartDate ? new Date(e.examStartDate) : null;
    const end = e.examEndDate ? new Date(e.examEndDate) : null;
    const now = new Date();
    let status = "Scheduled";
    if (start && end) {
      if (now > end) status = "Completed";
      else if (now >= start && now <= end) status = "Ongoing";
      else status = "Upcoming";
    }
    return {
      name: e.examName || "Exam",
      dates: start && end
        ? `${start.toLocaleDateString("en-IN", { day: "numeric" })}–${end.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
        : "",
      duration: e.description || "",
      status,
      subjects: [],
      id: e._id,
    };
  });
}

export function transformMarksToResults(apiMarks: any[]): ResultItem[] {
  const bySubject: Record<string, ResultItem> = {};
  for (const m of apiMarks || []) {
    const subjectName = m.subjectId?.name || "Unknown";
    if (!bySubject[subjectName]) {
      bySubject[subjectName] = {
        subject: subjectName,
        marksObtained: m.marksObtained ?? null,
        totalMarks: 50,
        grade: "",
        examName: m.examId?.examName || "",
      };
    }
    // Keep the latest marks
    bySubject[subjectName].marksObtained = m.marksObtained ?? null;
  }
  // Calculate grades
  for (const r of Object.values(bySubject)) {
    if (r.marksObtained !== null && r.totalMarks > 0) {
      const pct = (r.marksObtained / r.totalMarks) * 100;
      if (pct >= 90) r.grade = "A+";
      else if (pct >= 80) r.grade = "A";
      else if (pct >= 70) r.grade = "B+";
      else if (pct >= 60) r.grade = "B";
      else if (pct >= 50) r.grade = "C";
      else r.grade = "F";
    }
  }
  return Object.values(bySubject);
}

export function transformAttendance(apiAttendance: any[]): AttendanceData {
  const records = (apiAttendance || []).map((a: any) => ({
    date: a.date ? new Date(a.date).toISOString().split("T")[0] : "",
    status: a.status || "absent",
  }));
  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const overall = total > 0 ? Math.round((present / total) * 100) : 0;

  return { overall, bySubject: [], records };
}

export function transformTimetable(apiTable: any[]): TimetableData {
  const dayMap: Record<string, string[]> = {
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [],
  };
  const dayLookup: Record<string, string> = {
    monday: "Mon", tuesday: "Tue", wednesday: "Wed",
    thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun",
  };

  for (const dayEntry of apiTable || []) {
    const dayKey = dayLookup[dayEntry.dayOfWeek?.toLowerCase()] || dayEntry.dayOfWeek;
    if (!dayMap[dayKey]) dayMap[dayKey] = [];
    const periods = (dayEntry.periods || []).sort((a: any, b: any) => a.periodNumber - b.periodNumber);
    dayMap[dayKey] = periods.map((p: any) => p.subject?.name || "—");
  }

  return dayMap;
}

export function transformNotifications(apiNotifs: any[]): NotificationItem[] {
  return (apiNotifs || []).map((n) => {
    const created = n.createdAt ? new Date(n.createdAt) : new Date();
    const diffMs = Date.now() - created.getTime();
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);
    let time = "now";
    if (diffD > 0) time = `${diffD}d ago`;
    else if (diffH > 0) time = `${diffH}h ago`;
    else time = `${Math.floor(diffMs / 60000)}m ago`;

    let type = "Announcement";
    if (n.targetType === "broadcast") type = "Announcement";
    else if (n.title?.toLowerCase().includes("reminder")) type = "Reminder";
    else if (n.title?.toLowerCase().includes("event")) type = "Event";

    return {
      type,
      title: n.title || "",
      body: n.message || "",
      time,
      read: n.status === "inactive",
      id: n._id,
    };
  });
}

// ─── Mock Data (fallback when backend is unavailable) ────────────────────────

export const mockStudent: StudentProfile = {
  name: "Aryan Mehta",
  id: "AA-2024-0847",
  class: "Grade 9 - Section A",
  roll: 12,
  avatar: "AM",
  email: "aryan.mehta@student.acentoabacus.edu",
  phone: "+91 98765 43210",
  dob: "12 March 2010",
  gender: "Male",
  blood: "B+",
  address: "42, Green Park Colony, Pune - 411001",
  parent: "Mr. Rakesh Mehta",
  parentPhone: "+91 98700 11223",
  parentEmail: "rakesh.mehta@gmail.com",
  joined: "June 2021",
};

export const mockKpis: KPI[] = [
  { label: "Attendance", value: "82%", sub: "Below 85% target", icon: "📅", color: "#f59e0b", trend: "-3%" },
  { label: "GPA Score", value: "8.4", sub: "A Grade", icon: "🎓", color: "#6366f1", trend: "+0.2" },
  { label: "Pending Fees", value: "₹4,500", sub: "Due: 31 Mar", icon: "💰", color: "#ef4444", trend: "" },
  { label: "Upcoming Exams", value: "3", sub: "Next: 25 Mar", icon: "📝", color: "#10b981", trend: "" },
];

export const mockSubjects: Subject[] = [
  { code: "MATH-9A", name: "Mathematics", teacher: "Mrs. Priya Sharma", desc: "Algebra, Geometry, Trigonometry" },
  { code: "SCI-9A", name: "Science", teacher: "Mr. Anil Verma", desc: "Physics, Chemistry, Biology" },
  { code: "ENG-9A", name: "English", teacher: "Ms. Rachel D'Cruz", desc: "Language, Literature, Grammar" },
  { code: "SST-9A", name: "Social Studies", teacher: "Mr. Ramesh Patil", desc: "History, Geography, Civics" },
  { code: "HIN-9A", name: "Hindi", teacher: "Mrs. Sunita Joshi", desc: "Language and Literature" },
  { code: "CS-9A", name: "Computer Science", teacher: "Mr. Karan Malhotra", desc: "Python, Web Basics, Algorithms" },
];

export const mockTimetable: TimetableData = {
  Mon: ["Mathematics", "English", "Science", "—", "Social Studies", "Hindi", "Computer Sc.", "Sports"],
  Tue: ["Science", "Mathematics", "English", "—", "Computer Sc.", "Social Studies", "Hindi", "Art"],
  Wed: ["English", "Hindi", "Mathematics", "—", "Science", "Computer Sc.", "Social Studies", "Sports"],
  Thu: ["Social Studies", "Science", "Hindi", "—", "Mathematics", "English", "Computer Sc.", "Library"],
  Fri: ["Hindi", "Computer Sc.", "Social Studies", "—", "English", "Mathematics", "Science", "Activities"],
  Sat: ["Mathematics", "Science", "English", "—", "—", "—", "—", "—"],
};

export const mockExams: ExamItem[] = [
  { name: "Unit Test 3", dates: "25–27 Mar 2025", duration: "1.5 hrs", status: "Upcoming", subjects: ["Maths", "Science", "English"] },
  { name: "Mid-Term Exam", dates: "14–20 Apr 2025", duration: "3 hrs", status: "Scheduled", subjects: ["All Subjects"] },
  { name: "Unit Test 2", dates: "10–12 Feb 2025", duration: "1.5 hrs", status: "Completed", subjects: ["SST", "Hindi", "CS"] },
  { name: "Unit Test 1", dates: "15–17 Dec 2024", duration: "1.5 hrs", status: "Completed", subjects: ["All Subjects"] },
];

export const mockAttendance: AttendanceData = {
  overall: 82,
  bySubject: [
    { subject: "Mathematics", present: 41, total: 48, pct: 85 },
    { subject: "Science", present: 38, total: 48, pct: 79 },
    { subject: "English", present: 44, total: 48, pct: 92 },
    { subject: "Social Studies", present: 39, total: 48, pct: 81 },
    { subject: "Hindi", present: 36, total: 48, pct: 75 },
    { subject: "Computer Sc.", present: 43, total: 48, pct: 90 },
  ],
  records: [],
};

export const mockFees: FeeItem[] = [
  { type: "Tuition Fee – Q4", amount: 12000, due: "31 Mar 2025", status: "Pending" },
  { type: "Activity Fee", amount: 2500, due: "31 Mar 2025", status: "Pending" },
  { type: "Tuition Fee – Q3", amount: 12000, due: "31 Dec 2024", status: "Paid" },
  { type: "Exam Fee", amount: 800, due: "20 Dec 2024", status: "Paid" },
  { type: "Tuition Fee – Q2", amount: 12000, due: "30 Sep 2024", status: "Paid" },
];

export const mockResults: ResultItem[] = [
  { subject: "Mathematics", marksObtained: 34, totalMarks: 50, grade: "B+" },
  { subject: "Science", marksObtained: 40, totalMarks: 50, grade: "A" },
  { subject: "English", marksObtained: 43, totalMarks: 50, grade: "A+" },
  { subject: "Social Studies", marksObtained: 38, totalMarks: 50, grade: "B+" },
  { subject: "Hindi", marksObtained: 35, totalMarks: 50, grade: "B" },
  { subject: "Computer Sc.", marksObtained: 44, totalMarks: 50, grade: "A+" },
];

export const mockTeachers: TeacherItem[] = [
  { name: "Mrs. Priya Sharma", subject: "Mathematics", exp: "12 years", email: "priya.sharma@acentoabacus.edu", phone: "Ext. 201" },
  { name: "Mr. Anil Verma", subject: "Science", exp: "9 years", email: "anil.verma@acentoabacus.edu", phone: "Ext. 202" },
  { name: "Ms. Rachel D'Cruz", subject: "English", exp: "7 years", email: "rachel.dcruz@acentoabacus.edu", phone: "Ext. 203" },
  { name: "Mr. Ramesh Patil", subject: "Social Studies", exp: "15 years", email: "ramesh.patil@acentoabacus.edu", phone: "Ext. 204" },
  { name: "Mrs. Sunita Joshi", subject: "Hindi", exp: "11 years", email: "sunita.joshi@acentoabacus.edu", phone: "Ext. 205" },
  { name: "Mr. Karan Malhotra", subject: "Computer Science", exp: "5 years", email: "karan.malhotra@acentoabacus.edu", phone: "Ext. 206" },
];

export const mockNotifications: NotificationItem[] = [
  { type: "Announcement", title: "Annual Day Celebration", body: "Annual Day is on 5th April. All students must participate in at least one event.", time: "2h ago", read: false },
  { type: "Reminder", title: "Fee Due Alert", body: "Q4 Tuition Fee of ₹12,000 is due by 31 March 2025. Please pay before the deadline.", time: "5h ago", read: false },
  { type: "Event", title: "Science Fair Registration", body: "Register for the Inter-School Science Fair by 28 March. Contact your Science teacher.", time: "1d ago", read: true },
  { type: "Announcement", title: "Unit Test 3 Schedule Released", body: "Unit Test 3 will be held from 25–27 March. Detailed schedule shared below.", time: "2d ago", read: true },
  { type: "Reminder", title: "Attendance Warning", body: "Your overall attendance is 82% which is below the required 85%. Please improve.", time: "3d ago", read: true },
];

export const mockDocuments: DocumentItem[] = [
  { name: "Admit Card – Unit Test 3", type: "Admit Card", date: "22 Mar 2025", size: "142 KB" },
  { name: "Report Card – Q2 2024", type: "Report Card", date: "15 Oct 2024", size: "380 KB" },
  { name: "Fee Receipt – Q3", type: "Receipt", date: "2 Jan 2025", size: "95 KB" },
  { name: "Transfer Certificate", type: "Certificate", date: "10 Jun 2021", size: "210 KB" },
  { name: "Bonafide Certificate", type: "Certificate", date: "1 Aug 2024", size: "180 KB" },
];

// ─── Backward Compatibility Exports ──────────────────────────────────────────
// These are used by PortalPages.tsx — will be replaced by live data via context

export const student = mockStudent;
export const kpis = mockKpis;
export const subjects = mockSubjects;
export const timetable = mockTimetable;
export const exams = mockExams;
export const attendance = mockAttendance;
export const fees = mockFees;
export const results = mockResults;
export const teachers = mockTeachers;
export const notifications = mockNotifications;
export const documents = mockDocuments;
