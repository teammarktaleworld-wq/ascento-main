// app/api/admin/attendance/[studentId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

type Ctx = { params: Promise<{ studentId: string }> };

// GET /api/admin/attendance/[studentId]?month=2025-06
// GET /api/admin/attendance/[studentId]?year=2025
// (no param = all time)
export async function GET(req: NextRequest, ctx: Ctx) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { studentId } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // "2025-06"
  const year  = searchParams.get("year");  // "2025"

  try {
    const student = await prisma.student.findUnique({
      where:   { id: studentId },
      include: { program: true, programLevel: true, user: true },
    });
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    // ── Build date filter ────────────────────────────────────────────────────
    let dateFilter: any = {};
    if (month) {
      const [y, m] = month.split("-").map(Number);
      const nextM = m === 12 ? 1 : m + 1;
      const nextY = m === 12 ? y + 1 : y;
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

    const records = await prisma.attendance.findMany({
      where: {
        studentId,
        ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
      },
      orderBy: { date: "desc" },
    });

    // ── Compute stats ────────────────────────────────────────────────────────
    const total       = records.length;
    const present     = records.filter((r) => r.status === "present").length;
    const absent      = records.filter((r) => r.status === "absent").length;
    const late        = records.filter((r) => r.status === "late").length;
    const holiday     = records.filter((r) => r.status === "holiday").length;
    const workingDays = total - holiday;
    const percentage  = workingDays > 0
      ? Math.round(((present + late) / workingDays) * 100)
      : 0;

    // ── Serialize dates for JSON ─────────────────────────────────────────────
    const serializedRecords = records.map((r) => ({
      ...r,
      date: r.date.toISOString().split("T")[0],
    }));

    return NextResponse.json({
      student,
      records: serializedRecords,
      stats: { total, present, absent, late, holiday, workingDays, percentage },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}