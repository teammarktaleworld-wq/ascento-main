// src\app\api\attendance\route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

export async function GET(req: NextRequest) {
  const dbUser = await getSessionUser(req);
  if (!dbUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const student = await prisma.student.findUnique({
    where: { userId: dbUser.id },
    include: { program: true, programLevel: true },
  });
  if (!student)
    return NextResponse.json({ error: "Student record not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // "2025-06"
  const year  = searchParams.get("year");  // "2025"

  let dateFilter: any = {};
  if (month) {
    const [y, m] = month.split("-").map(Number);
    const nextM  = m === 12 ? 1 : m + 1;
    const nextY  = m === 12 ? y + 1 : y;
    dateFilter = {
      gte: new Date(`${y}-${String(m).padStart(2, "0")}-01T00:00:00.000Z`),
      lt:  new Date(`${nextY}-${String(nextM).padStart(2, "0")}-01T00:00:00.000Z`),
    };
  } else if (year) {
    dateFilter = {
      gte: new Date(`${year}-01-01T00:00:00.000Z`),
      lt:  new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`),
    };
  }

  try {
    const records = await prisma.attendance.findMany({
      where: {
        studentId: student.id,
        ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
      },
      orderBy: { date: "desc" },
    });

    const serialized = records.map(r => ({
      ...r,
      date: r.date.toISOString().split("T")[0],
    }));

    const total       = records.length;
    const present     = records.filter(r => r.status === "present").length;
    const absent      = records.filter(r => r.status === "absent").length;
    const late        = records.filter(r => r.status === "late").length;
    const holiday     = records.filter(r => r.status === "holiday").length;
    const workingDays = total - holiday;
    const percentage  = workingDays > 0
      ? Math.round(((present + late) / workingDays) * 100)
      : 0;

    return NextResponse.json({
      student: {
        id:           student.id,
        studentId:    student.studentId,
        fullName:     student.fullName,
        photoUrl:     student.photoUrl,
        program:      student.program,
        programLevel: student.programLevel,
      },
      records:  serialized,
      stats:    { total, present, absent, late, holiday, workingDays, percentage },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}