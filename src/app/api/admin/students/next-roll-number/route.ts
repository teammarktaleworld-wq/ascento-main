







// app/api/admin/students/next-roll-number/route.ts
// Roll number is scoped per program + level + section
// e.g. Playschool > Nursery > Section A gets its own sequence: 01, 02, 03...

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const err = await requireAdmin(req);
    if (err) return err;

    const { searchParams } = new URL(req.url);
    const programId      = searchParams.get("programId")      ?? "";
    const programLevelId = searchParams.get("programLevelId") ?? "";
    const section        = searchParams.get("section")        ?? "";

    // Build a scoped filter so each class/level/section has its own roll sequence
    const where: Record<string, string> = {};
    if (programId)      where.programId      = programId;
    if (programLevelId) where.programLevelId = programLevelId;
    if (section)        where.section        = section;

    // Count existing students in this exact scope
    const count = await prisma.student.count({ where });

    const nextRollNumber = count + 1;

    // Zero-pad to 2 digits: 01, 02 ... 09, 10, 11 ...
    const formatted = String(nextRollNumber).padStart(2, "0");

    return NextResponse.json({ nextRollNumber, formatted });
  } catch (error) {
    console.error("Next roll number error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}