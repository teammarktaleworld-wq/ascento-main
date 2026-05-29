// app/api/admin/attendance/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { getUserFromToken } from "@/lib/getUserFromToken";

// ── GET /api/admin/attendance?date=YYYY-MM-DD&programId=xxx&levelId=yyy ───────
// Returns students (filtered) + existing attendance records for that date
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { searchParams } = new URL(req.url);
  const date      = searchParams.get("date");
  const programId = searchParams.get("programId");
  const levelId   = searchParams.get("levelId");

  if (!date) return NextResponse.json({ error: "date is required" }, { status: 400 });

  try {
    const dayStart = new Date(date + "T00:00:00.000Z");
    const dayEnd   = new Date(date + "T23:59:59.999Z");

    const studentWhere: any = { status: "Active" };
    if (programId) studentWhere.programId      = programId;
    if (levelId)   studentWhere.programLevelId = levelId;

    const [students, existing] = await Promise.all([
      prisma.student.findMany({
        where: studentWhere,
        select: {
          id: true, studentId: true, fullName: true,
          rollNumber: true, photoUrl: true, status: true,
          parentPhone: true,
          program:      { select: { id: true, name: true } },
          programLevel: { select: { id: true, name: true } },
        },
        orderBy: [
          { programId:      "asc" },
          { programLevelId: "asc" },
          { rollNumber:     "asc" },
          { fullName:       "asc" },
        ],
      }),
      prisma.attendance.findMany({
        where: {
          date:    { gte: dayStart, lte: dayEnd },
          student: studentWhere,
        },
      }),
    ]);

    const recordMap: Record<string, any> = {};
    existing.forEach((r) => {
      recordMap[r.studentId] = {
        ...r,
        date: r.date.toISOString().split("T")[0],
      };
    });

    return NextResponse.json({ students, records: recordMap, date });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST /api/admin/attendance ────────────────────────────────────────────────
// Body: { date: "YYYY-MM-DD", records: [{ studentId, status, note? }] }
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    // Reuse your existing getUserFromToken for the markedBy field
    const token    = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
    const dbUser   = await getUserFromToken(token);
    const markedBy = dbUser?.id ?? null;

    const { date, records } = await req.json();

    if (!date || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: "date and records[] are required" },
        { status: 400 }
      );
    }

    const dayDate = new Date(date + "T00:00:00.000Z");

    // Safety: validate student IDs exist
    const studentIds    = records.map((r: any) => r.studentId);
    const foundStudents = await prisma.student.findMany({
      where:  { id: { in: studentIds } },
      select: { id: true },
    });
    const validIds     = new Set(foundStudents.map((s) => s.id));
    const validRecords = records.filter((r: any) => validIds.has(r.studentId));

    // Upsert all — one record per student per day (@@unique constraint)
    const results = await prisma.$transaction(
      validRecords.map(({ studentId, status, note }: any) =>
        prisma.attendance.upsert({
          where:  { studentId_date: { studentId, date: dayDate } },
          create: { studentId, date: dayDate, status, note: note ?? null, markedBy },
          update: { status, note: note ?? null, markedBy },
        })
      )
    );

    return NextResponse.json({
      saved:   results.length,
      skipped: records.length - validRecords.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}