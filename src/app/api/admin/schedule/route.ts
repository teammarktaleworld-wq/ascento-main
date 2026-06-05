// app/api/admin/schedule/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

// ─── GET /api/admin/schedule ──────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const programId = searchParams.get("programId") ?? undefined;
  const levelId   = searchParams.get("levelId")   ?? undefined;
  const dayOfWeek = searchParams.get("dayOfWeek") ?? undefined;
  const search    = searchParams.get("search")?.trim() ?? undefined;

  const where: any = {};
  if (programId)  where.programId  = programId;
  if (levelId)    where.levelId    = levelId;
  if (dayOfWeek)  where.dayOfWeek  = dayOfWeek;
  if (search) {
    where.OR = [
      { subjectName: { contains: search, mode: "insensitive" } },
      { teacherName: { contains: search, mode: "insensitive" } },
    ];
  }

  const DAY_ORDER = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const slots = await prisma.scheduleSlot.findMany({
    where,
    include: {
      program: { select: { id: true, name: true } },
      level:   { select: { id: true, name: true } },
    },
    orderBy: [{ periodNumber: "asc" }],
  });

  // Sort by day order in JS (Prisma doesn't support custom ordering on string)
  slots.sort((a, b) => {
    const di = DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek);
    return di !== 0 ? di : a.periodNumber - b.periodNumber;
  });

  return NextResponse.json({ slots });
}

// ─── POST /api/admin/schedule ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const err = await requireAdmin(req);
  if (err) return err;

  let body: {
    programId?: string;
    levelId?: string | null;
    dayOfWeek?: string;
    periodNumber?: number;
    startTime?: string;
    endTime?: string;
    subjectName?: string;
    teacherName?: string;
    notes?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    programId, levelId, dayOfWeek, periodNumber,
    startTime, endTime, subjectName, teacherName, notes,
  } = body;

  // ── Validation ───────────────────────────────────────────────────────────────
  if (!programId)
    return NextResponse.json({ error: "programId is required" }, { status: 400 });
  if (!dayOfWeek || !["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].includes(dayOfWeek))
    return NextResponse.json({ error: "Valid dayOfWeek is required" }, { status: 400 });
  if (!periodNumber || periodNumber < 1 || periodNumber > 12)
    return NextResponse.json({ error: "periodNumber must be 1–12" }, { status: 400 });
  if (!startTime || !endTime)
    return NextResponse.json({ error: "startTime and endTime are required" }, { status: 400 });
  if (!subjectName?.trim())
    return NextResponse.json({ error: "subjectName is required" }, { status: 400 });
  if (!teacherName?.trim())
    return NextResponse.json({ error: "teacherName is required" }, { status: 400 });

  // Validate programId exists
  const program = await prisma.program.findUnique({ where: { id: programId } });
  if (!program)
    return NextResponse.json({ error: "Program not found" }, { status: 404 });

  // Validate levelId if provided
  if (levelId) {
    const level = await prisma.programLevel.findUnique({ where: { id: levelId } });
    if (!level)
      return NextResponse.json({ error: "Level not found" }, { status: 404 });
  }

  try {
    const slot = await prisma.scheduleSlot.create({
      data: {
        programId,
        levelId: levelId ?? null,
        dayOfWeek,
        periodNumber,
        startTime,
        endTime,
        subjectName: subjectName.trim(),
        teacherName: teacherName.trim(),
        notes: notes?.trim() ?? null,
      },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
    });
    return NextResponse.json({ slot }, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json(
        { error: `Period ${periodNumber} on ${dayOfWeek} is already occupied for this program/level` },
        { status: 409 }
      );
    }
    console.error("POST /api/admin/schedule error:", e);
    return NextResponse.json({ error: "Failed to create slot" }, { status: 500 });
  }
}