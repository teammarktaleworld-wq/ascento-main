import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || "" }),
});

async function main() {
  console.log("Seeding database...");

  // ─── Domain ────────────────────────────────────────────────────────────────
  const domain = await prisma.domain.create({
    data: { name: "Abacus", description: "Mental arithmetic and abacus training" },
  });

  // ─── Class & Section ───────────────────────────────────────────────────────
  const cls = await prisma.class.create({
    data: { name: "Grade 9", domainId: domain.id },
  });

  const section = await prisma.section.create({
    data: { name: "Section A", classId: cls.id },
  });

  // ─── Subjects ──────────────────────────────────────────────────────────────
  const subjectsData = [
    { code: "MATH-9A", name: "Mathematics", description: "Algebra, Geometry, Trigonometry" },
    { code: "SCI-9A", name: "Science", description: "Physics, Chemistry, Biology" },
    { code: "ENG-9A", name: "English", description: "Language, Literature, Grammar" },
    { code: "SST-9A", name: "Social Studies", description: "History, Geography, Civics" },
    { code: "HIN-9A", name: "Hindi", description: "Language and Literature" },
    { code: "CS-9A", name: "Computer Science", description: "Python, Web Basics, Algorithms" },
  ];

  const subjects: Record<string, any> = {};
  for (const s of subjectsData) {
    subjects[s.code] = await prisma.subject.create({ data: s });
  }

  // ─── Teacher Users & Teachers ──────────────────────────────────────────────
  const teachersData = [
    { name: "Mrs. Priya Sharma", email: "priya.sharma@acentoabacus.edu", exp: "12 years", phone: "Ext. 201", subjectCode: "MATH-9A" },
    { name: "Mr. Anil Verma", email: "anil.verma@acentoabacus.edu", exp: "9 years", phone: "Ext. 202", subjectCode: "SCI-9A" },
    { name: "Ms. Rachel D'Cruz", email: "rachel.dcruz@acentoabacus.edu", exp: "7 years", phone: "Ext. 203", subjectCode: "ENG-9A" },
    { name: "Mr. Ramesh Patil", email: "ramesh.patil@acentoabacus.edu", exp: "15 years", phone: "Ext. 204", subjectCode: "SST-9A" },
    { name: "Mrs. Sunita Joshi", email: "sunita.joshi@acentoabacus.edu", exp: "11 years", phone: "Ext. 205", subjectCode: "HIN-9A" },
    { name: "Mr. Karan Malhotra", email: "karan.malhotra@acentoabacus.edu", exp: "5 years", phone: "Ext. 206", subjectCode: "CS-9A" },
  ];

  const teachers: Record<string, any> = {};
  for (const t of teachersData) {
    const user = await prisma.user.create({
      data: { email: t.email, name: t.name, role: "user" },
    });
    const teacher = await prisma.teacher.create({
      data: { userId: user.id, name: t.name, phone: t.phone, experience: t.exp },
    });
    await prisma.subjectTeacher.create({
      data: { subjectId: subjects[t.subjectCode].id, teacherId: teacher.id },
    });
    teachers[t.subjectCode] = teacher;
  }

  // ─── Student User & Student ────────────────────────────────────────────────
  const studentUser = await prisma.user.create({
    data: { email: "aryan.mehta@student.acentoabacus.edu", name: "Aryan Mehta", role: "student" },
  });

  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      studentId: "AA-2024-0847",
      rollNumber: "12",
      fullName: "Aryan Mehta",
      dateOfBirth: new Date("2010-03-12"),
      gender: "Male",
      bloodGroup: "B+",
      phone: "+91 98765 43210",
      address: "42, Green Park Colony",
      city: "Pune",
      state: "Maharashtra",
      parentName: "Mr. Rakesh Mehta",
      parentPhone: "+91 98700 11223",
      parentEmail: "rakesh.mehta@gmail.com",
    },
  });

  // ─── Enrollment ────────────────────────────────────────────────────────────
  await prisma.enrollment.create({
    data: { studentId: student.id, sectionId: section.id, academicYear: "2024-25" },
  });

  // ─── Timetable Slots ──────────────────────────────────────────────────────
  const timetableMap: Record<string, string[]> = {
    monday: ["MATH-9A", "ENG-9A", "SCI-9A", "", "SST-9A", "HIN-9A", "CS-9A", ""],
    tuesday: ["SCI-9A", "MATH-9A", "ENG-9A", "", "CS-9A", "SST-9A", "HIN-9A", ""],
    wednesday: ["ENG-9A", "HIN-9A", "MATH-9A", "", "SCI-9A", "CS-9A", "SST-9A", ""],
    thursday: ["SST-9A", "SCI-9A", "HIN-9A", "", "MATH-9A", "ENG-9A", "CS-9A", ""],
    friday: ["HIN-9A", "CS-9A", "SST-9A", "", "ENG-9A", "MATH-9A", "SCI-9A", ""],
    saturday: ["MATH-9A", "SCI-9A", "ENG-9A", "", "", "", "", ""],
  };

  for (const [day, periods] of Object.entries(timetableMap)) {
    for (let i = 0; i < periods.length; i++) {
      const code = periods[i];
      await prisma.timetableSlot.create({
        data: {
          sectionId: section.id,
          dayOfWeek: day,
          periodNumber: i + 1,
          subjectId: code ? subjects[code]?.id : null,
          teacherId: code ? teachers[code]?.id : null,
        },
      });
    }
  }

  // ─── Exams ─────────────────────────────────────────────────────────────────
  const examsData = [
    { examName: "Unit Test 3", description: "1.5 hrs", examStartDate: new Date("2025-03-25"), examEndDate: new Date("2025-03-27") },
    { examName: "Mid-Term Exam", description: "3 hrs", examStartDate: new Date("2025-04-14"), examEndDate: new Date("2025-04-20") },
    { examName: "Unit Test 2", description: "1.5 hrs", examStartDate: new Date("2025-02-10"), examEndDate: new Date("2025-02-12") },
    { examName: "Unit Test 1", description: "1.5 hrs", examStartDate: new Date("2024-12-15"), examEndDate: new Date("2024-12-17") },
  ];

  const exams: any[] = [];
  for (const e of examsData) {
    exams.push(await prisma.exam.create({ data: e }));
  }

  // ─── Marks (for Unit Test 2 – most recent completed) ──────────────────────
  const marksData = [
    { subjectCode: "MATH-9A", marks: 34 },
    { subjectCode: "SCI-9A", marks: 40 },
    { subjectCode: "ENG-9A", marks: 43 },
    { subjectCode: "SST-9A", marks: 38 },
    { subjectCode: "HIN-9A", marks: 35 },
    { subjectCode: "CS-9A", marks: 44 },
  ];

  for (const m of marksData) {
    await prisma.mark.create({
      data: {
        studentId: student.id,
        examId: exams[2].id, // Unit Test 2
        subjectId: subjects[m.subjectCode].id,
        marksObtained: m.marks,
        totalMarks: 50,
      },
    });
  }

  // ─── Attendance (past 60 school days) ──────────────────────────────────────
  const today = new Date();
  let schoolDays = 0;
  const d = new Date(today);
  d.setDate(d.getDate() - 90);

  while (d <= today && schoolDays < 60) {
    const dow = d.getDay();
    if (dow !== 0) {
      // Skip Sundays
      // ~82% attendance: roughly 49 present out of 60
      const rand = Math.random();
      const status = rand < 0.82 ? "present" : "absent";
      await prisma.attendance.create({
        data: {
          studentId: student.id,
          date: new Date(d),
          status,
        },
      });
      schoolDays++;
    }
    d.setDate(d.getDate() + 1);
  }

  // ─── Fees ──────────────────────────────────────────────────────────────────
  const feesData = [
    { feeType: "Tuition Fee – Q4", amount: 12000, dueDate: new Date("2025-03-31"), paymentStatus: "pending" },
    { feeType: "Activity Fee", amount: 2500, dueDate: new Date("2025-03-31"), paymentStatus: "pending" },
    { feeType: "Tuition Fee – Q3", amount: 12000, dueDate: new Date("2024-12-31"), paymentStatus: "paid", paidAt: new Date("2024-12-28") },
    { feeType: "Exam Fee", amount: 800, dueDate: new Date("2024-12-20"), paymentStatus: "paid", paidAt: new Date("2024-12-18") },
    { feeType: "Tuition Fee – Q2", amount: 12000, dueDate: new Date("2024-09-30"), paymentStatus: "paid", paidAt: new Date("2024-09-25") },
  ];

  for (const f of feesData) {
    await prisma.fee.create({
      data: { studentId: student.id, ...f },
    });
  }

  // ─── Notifications ─────────────────────────────────────────────────────────
  const notifsData = [
    { title: "Annual Day Celebration", message: "Annual Day is on 5th April. All students must participate in at least one event.", targetType: "broadcast", createdAt: new Date(Date.now() - 2 * 3600000) },
    { title: "Fee Due Alert", message: "Q4 Tuition Fee of ₹12,000 is due by 31 March 2025. Please pay before the deadline.", targetType: "broadcast", createdAt: new Date(Date.now() - 5 * 3600000) },
    { title: "Science Fair Registration", message: "Register for the Inter-School Science Fair by 28 March. Contact your Science teacher.", targetType: "broadcast", createdAt: new Date(Date.now() - 24 * 3600000) },
    { title: "Unit Test 3 Schedule Released", message: "Unit Test 3 will be held from 25–27 March. Detailed schedule shared below.", targetType: "broadcast", createdAt: new Date(Date.now() - 48 * 3600000) },
    { title: "Attendance Warning", message: "Your overall attendance is below the required 85%. Please improve.", targetType: "individual", createdAt: new Date(Date.now() - 72 * 3600000) },
  ];

  for (let i = 0; i < notifsData.length; i++) {
    const notif = await prisma.notification.create({ data: notifsData[i] });
    await prisma.studentNotification.create({
      data: {
        notificationId: notif.id,
        studentId: student.id,
        read: i >= 2, // first 2 unread
      },
    });
  }

  // ─── Documents ─────────────────────────────────────────────────────────────
  const docsData = [
    { name: "Admit Card – Unit Test 3", type: "Admit Card", fileSize: "142 KB", createdAt: new Date("2025-03-22") },
    { name: "Report Card – Q2 2024", type: "Report Card", fileSize: "380 KB", createdAt: new Date("2024-10-15") },
    { name: "Fee Receipt – Q3", type: "Receipt", fileSize: "95 KB", createdAt: new Date("2025-01-02") },
    { name: "Transfer Certificate", type: "Certificate", fileSize: "210 KB", createdAt: new Date("2021-06-10") },
    { name: "Bonafide Certificate", type: "Certificate", fileSize: "180 KB", createdAt: new Date("2024-08-01") },
  ];

  for (const doc of docsData) {
    await prisma.document.create({
      data: { studentId: student.id, ...doc },
    });
  }

  // ─── Events ────────────────────────────────────────────────────────────────
  await prisma.event.create({
    data: { title: "Annual Day Celebration", description: "All students participate", eventDate: new Date("2025-04-05") },
  });
  await prisma.event.create({
    data: { title: "Inter-School Science Fair", description: "Science project exhibition", eventDate: new Date("2025-04-12") },
  });

  console.log("Seed complete!");
  console.log(`  Student: ${student.studentId} (${student.fullName})`);
  console.log(`  User ID: ${studentUser.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
