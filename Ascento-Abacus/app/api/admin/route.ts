import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalStudents,
      totalTeachers,
      paidFeesAgg,
      pendingFeesAgg,
      attendanceToday,
      totalStudentsForAttendance,
      recentEnquiries,
      upcomingExams,
      recentPayments,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.fee.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: "paid" },
      }),
      prisma.fee.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: { not: "paid" } },
      }),
      prisma.attendance.count({
        where: {
          date: { gte: today, lt: tomorrow },
          status: "present",
        },
      }),
      prisma.attendance.count({
        where: {
          date: { gte: today, lt: tomorrow },
        },
      }),
      prisma.enquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.exam.findMany({
        where: { examStartDate: { gte: today } },
        orderBy: { examStartDate: "asc" },
      }),
      prisma.fee.findMany({
        where: { paymentStatus: "paid" },
        orderBy: { paidAt: "desc" },
        take: 5,
        include: { student: true },
      }),
    ]);

    const attendanceTodayPercentage =
      totalStudentsForAttendance > 0
        ? Math.round((attendanceToday / totalStudentsForAttendance) * 100)
        : 0;

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalFeesCollected: paidFeesAgg._sum.amount ?? 0,
      pendingFees: pendingFeesAgg._sum.amount ?? 0,
      attendanceTodayPercentage,
      recentEnquiries,
      upcomingExams,
      recentPayments,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
