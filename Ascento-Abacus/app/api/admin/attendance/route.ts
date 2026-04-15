import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "date query parameter is required (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const sectionId = searchParams.get("sectionId");

    const students = await prisma.student.findMany({
      where: sectionId
        ? {
            enrollments: {
              some: {
                sectionId,
              },
            },
          }
        : undefined,
      select: {
        id: true,
        fullName: true,
        rollNumber: true,
        studentId: true,
        attendance: {
          where: {
            date: { gte: date, lt: nextDay },
          },
          select: {
            id: true,
            status: true,
            date: true,
          },
        },
        enrollments: {
          include: {
            section: {
              include: {
                class: true,
              },
            },
          },
        },
      },
      orderBy: { fullName: "asc" },
    });

    const result = students.map((s) => ({
      ...s,
      attendanceStatus: s.attendance.length > 0 ? s.attendance[0].status : null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get attendance error:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, date, status } = body;

    if (!studentId || !date || !status) {
      return NextResponse.json(
        { error: "studentId, date, and status are required" },
        { status: 400 }
      );
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId,
          date: attendanceDate,
        },
      },
      update: { status },
      create: {
        studentId,
        date: attendanceDate,
        status,
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Mark attendance error:", error);
    return NextResponse.json(
      { error: "Failed to mark attendance" },
      { status: 500 }
    );
  }
}
