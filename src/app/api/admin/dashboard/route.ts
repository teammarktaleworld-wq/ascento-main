import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const [
    totalStudents,
    totalTeachers,
    feesCollected,
    feesPending,
    attendanceRecords,
    recentStudents,
    upcomingExams,
    todaySlots,
    enrollmentTrend,
  ] = await Promise.all([
    prisma.student.count({ where: { status: "Active" } }),

    prisma.teacher.count(),

    prisma.fee.aggregate({
      where: { paymentStatus: "paid" },
      _sum: { amount: true },
    }),

    prisma.fee.aggregate({
      where: { paymentStatus: "pending" },
      _sum: { amount: true },
    }),

    // attendance rate: last 30 days
    prisma.attendance.groupBy({
      by: ["status"],
      _count: true,
      where: {
        date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),

    prisma.student.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        fees: { orderBy: { createdAt: "desc" }, take: 1 },
        enrollments: {
          include: { section: { include: { class: true } } },
          take: 1,
        },
      },
    }),

    prisma.exam.findMany({
      where: { examStartDate: { gte: new Date() } },
      orderBy: { examStartDate: "asc" },
      take: 5,
    }),

    prisma.timetableSlot.findMany({
      where: {
        dayOfWeek: new Date()
          .toLocaleDateString("en-US", { weekday: "long" })
          .toLowerCase(),
      },
      include: { subject: true, teacher: { include: { user: true } }, section: { include: { class: true } } },
      orderBy: { periodNumber: "asc" },
    }),

    // enrollment count per month (last 6 months)
    prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') AS month,
             COUNT(*) AS count
      FROM students
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt")
    `,
  ]);

  const presentCount =
    attendanceRecords.find((r) => r.status === "present")?._count ?? 0;
  const totalCount = attendanceRecords.reduce((s, r) => s + r._count, 0);
  const attendancePct = totalCount ? Math.round((presentCount / totalCount) * 100) : 0;

  return NextResponse.json({
    stats: {
      totalStudents,
      totalTeachers,
      feesCollected: Number(feesCollected._sum.amount ?? 0),
      feesPending: Number(feesPending._sum.amount ?? 0),
      attendancePct,
    },
    recentStudents,
    upcomingExams,
    todaySchedule: todaySlots,
    enrollmentTrend: enrollmentTrend.map((e) => ({
      month: e.month,
      count: Number(e.count),
    })),
  });
}