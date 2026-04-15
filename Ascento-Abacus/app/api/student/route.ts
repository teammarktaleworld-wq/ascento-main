import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get("studentId");

  // Find the student — use studentId param or fall back to first student
  const student = studentId
    ? await prisma.student.findUnique({ where: { studentId }, include: { user: true } })
    : await prisma.student.findFirst({ include: { user: true } });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  // ─── Enrollment (with class/section/domain) ─────────────────────────────
  const enrollment = await prisma.enrollment.findFirst({
    where: { studentId: student.id, status: "Active" },
    include: {
      section: {
        include: {
          class: {
            include: { domain: true },
          },
        },
      },
    },
  });

  const className = enrollment
    ? `${enrollment.section.class.name} - ${enrollment.section.name}`
    : "Not Enrolled";
  const domainName = enrollment?.section.class.domain.name || "";

  // ─── Profile ────────────────────────────────────────────────────────────
  const initials = student.fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const profile = {
    name: student.fullName,
    id: student.studentId,
    class: className,
    roll: student.rollNumber || "",
    avatar: initials,
    email: student.parentEmail || student.user.email,
    phone: student.phone || "",
    dob: student.dateOfBirth
      ? student.dateOfBirth.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : "",
    gender: student.gender || "",
    blood: student.bloodGroup || "",
    address: [student.address, student.city, student.state].filter(Boolean).join(", "),
    parent: student.parentName || "",
    parentPhone: student.parentPhone || "",
    parentEmail: student.parentEmail || "",
    joined: student.createdAt.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    domainName,
  };

  // ─── Subjects + Teachers ────────────────────────────────────────────────
  const subjectTeachers = await prisma.subjectTeacher.findMany({
    include: { subject: true, teacher: true },
  });

  const subjects = subjectTeachers.map((st) => ({
    code: st.subject.code,
    name: st.subject.name,
    teacher: st.teacher.name,
    desc: st.subject.description || "",
  }));

  const teachersWithEmails = await prisma.teacher.findMany({
    include: { user: true, subjects: { include: { subject: true } } },
  });

  const teachersList = teachersWithEmails.map((t) => ({
    name: t.name,
    subject: t.subjects.map((s) => s.subject.name).join(", "),
    exp: t.experience || "",
    email: t.user.email,
    phone: t.phone || "",
  }));

  // ─── Timetable ──────────────────────────────────────────────────────────
  const timetableSlots = enrollment
    ? await prisma.timetableSlot.findMany({
        where: { sectionId: enrollment.sectionId },
        include: { subject: true },
        orderBy: [{ dayOfWeek: "asc" }, { periodNumber: "asc" }],
      })
    : [];

  const dayKeyMap: Record<string, string> = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
  };

  const timetable: Record<string, string[]> = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [] };
  for (const slot of timetableSlots) {
    const key = dayKeyMap[slot.dayOfWeek] || slot.dayOfWeek;
    if (!timetable[key]) timetable[key] = [];
    // Fill gaps with "—"
    while (timetable[key].length < slot.periodNumber - 1) {
      timetable[key].push("—");
    }
    timetable[key].push(slot.subject?.name || "—");
  }

  // ─── Exams ──────────────────────────────────────────────────────────────
  const examsRaw = await prisma.exam.findMany({ orderBy: { examStartDate: "desc" } });
  const now = new Date();

  const exams = examsRaw.map((e) => {
    let status = "Scheduled";
    if (e.examStartDate && e.examEndDate) {
      if (now > e.examEndDate) status = "Completed";
      else if (now >= e.examStartDate && now <= e.examEndDate) status = "Ongoing";
      else status = "Upcoming";
    }
    return {
      id: e.id,
      name: e.examName,
      dates:
        e.examStartDate && e.examEndDate
          ? `${e.examStartDate.toLocaleDateString("en-IN", { day: "numeric" })}–${e.examEndDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
          : "",
      duration: e.description || "",
      status,
      subjects: [],
    };
  });

  // ─── Attendance ─────────────────────────────────────────────────────────
  const attendanceRecs = await prisma.attendance.findMany({
    where: { studentId: student.id },
    orderBy: { date: "desc" },
  });

  const totalDays = attendanceRecs.length;
  const presentDays = attendanceRecs.filter((a) => a.status === "present").length;
  const overallPct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // Per-subject attendance (approximate from timetable distribution)
  const subjectList = subjectTeachers.map((st) => st.subject);
  const bySubject = subjectList.map((sub) => {
    // Each subject appears roughly equally in timetable
    const subSlots = timetableSlots.filter((s) => s.subjectId === sub.id).length;
    const totalSlots = timetableSlots.filter((s) => s.subjectId !== null).length;
    const ratio = totalSlots > 0 ? subSlots / totalSlots : 1 / subjectList.length;
    const total = Math.round(totalDays * ratio);
    const present = Math.round(presentDays * ratio);
    return {
      subject: sub.name,
      present,
      total,
      pct: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  });

  const attendance = {
    overall: overallPct,
    bySubject,
    records: attendanceRecs.map((a) => ({
      date: a.date.toISOString().split("T")[0],
      status: a.status,
    })),
  };

  // ─── Fees ───────────────────────────────────────────────────────────────
  const feesRaw = await prisma.fee.findMany({
    where: { studentId: student.id },
    orderBy: { dueDate: "desc" },
  });

  const fees = feesRaw.map((f) => ({
    id: f.id,
    type: f.feeType,
    amount: Number(f.amount),
    due: f.dueDate
      ? f.dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      : "",
    status: f.paymentStatus === "paid" ? "Paid" : "Pending",
  }));

  // ─── Marks / Results ───────────────────────────────────────────────────
  const marksRaw = await prisma.mark.findMany({
    where: { studentId: student.id },
    include: { subject: true, exam: true },
    orderBy: { createdAt: "desc" },
  });

  const resultsBySubject: Record<string, any> = {};
  for (const m of marksRaw) {
    const subName = m.subject.name;
    if (!resultsBySubject[subName]) {
      const obtained = m.marksObtained !== null ? Number(m.marksObtained) : null;
      const total = Number(m.totalMarks);
      let grade = "";
      if (obtained !== null && total > 0) {
        const pct = (obtained / total) * 100;
        if (pct >= 90) grade = "A+";
        else if (pct >= 80) grade = "A";
        else if (pct >= 70) grade = "B+";
        else if (pct >= 60) grade = "B";
        else if (pct >= 50) grade = "C";
        else grade = "F";
      }
      resultsBySubject[subName] = {
        subject: subName,
        marksObtained: obtained,
        totalMarks: total,
        grade,
        examName: m.exam.examName,
      };
    }
  }
  const results = Object.values(resultsBySubject);

  // ─── Notifications ──────────────────────────────────────────────────────
  const studentNotifs = await prisma.studentNotification.findMany({
    where: { studentId: student.id },
    include: { notification: true },
    orderBy: { notification: { createdAt: "desc" } },
  });

  const notifications = studentNotifs.map((sn) => {
    const n = sn.notification;
    const diffMs = Date.now() - n.createdAt.getTime();
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);
    let time = "now";
    if (diffD > 0) time = `${diffD}d ago`;
    else if (diffH > 0) time = `${diffH}h ago`;
    else time = `${Math.floor(diffMs / 60000)}m ago`;

    let type = "Announcement";
    if (n.targetType === "individual") type = "Reminder";
    else if (n.title.toLowerCase().includes("event")) type = "Event";

    return {
      id: n.id,
      type,
      title: n.title,
      body: n.message,
      time,
      read: sn.read,
    };
  });

  // ─── Documents ──────────────────────────────────────────────────────────
  const docsRaw = await prisma.document.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
  });

  const documents = docsRaw.map((d) => ({
    name: d.name,
    type: d.type,
    date: d.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    size: d.fileSize || "",
  }));

  // ─── KPIs (dashboard summary) ──────────────────────────────────────────
  const pendingFees = fees.filter((f) => f.status === "Pending");
  const pendingFeesTotal = pendingFees.reduce((a, f) => a + f.amount, 0);
  const upcomingExams = exams.filter((e) => e.status === "Upcoming" || e.status === "Scheduled");
  const nextExam = upcomingExams[0];

  const kpis = [
    {
      label: "Attendance",
      value: `${overallPct}%`,
      sub: overallPct < 85 ? "Below 85% target" : "On target",
      icon: "📅",
      color: overallPct < 85 ? "#f59e0b" : "#10b981",
      trend: "",
    },
    {
      label: "GPA Score",
      value: results.length > 0
        ? (results.reduce((a, r) => a + (r.marksObtained || 0), 0) / results.reduce((a, r) => a + r.totalMarks, 0) * 10).toFixed(1)
        : "0",
      sub: "Overall",
      icon: "🎓",
      color: "#6366f1",
      trend: "",
    },
    {
      label: "Pending Fees",
      value: pendingFeesTotal > 0 ? `₹${pendingFeesTotal.toLocaleString("en-IN")}` : "₹0",
      sub: pendingFeesTotal > 0 ? `Due: ${pendingFees[0]?.due || ""}` : "All clear",
      icon: "💰",
      color: pendingFeesTotal > 0 ? "#ef4444" : "#10b981",
      trend: "",
    },
    {
      label: "Upcoming Exams",
      value: String(upcomingExams.length),
      sub: nextExam ? `Next: ${nextExam.dates.split("–")[0]} ${nextExam.dates.split(" ").slice(-2).join(" ")}` : "None scheduled",
      icon: "📝",
      color: "#10b981",
      trend: "",
    },
  ];

  return NextResponse.json({
    profile,
    kpis,
    subjects,
    teachers: teachersList,
    timetable,
    exams,
    attendance,
    fees,
    results,
    notifications,
    documents,
  });
}
