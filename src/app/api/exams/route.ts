// src/app/api/student/exams/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

// ─── GET /api/student/exams ───────────────────────────────────────────────────
export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Students only see exams for their program + level.
    // Admin / teacher see everything.
    let where: { programId?: string; levelId?: string } = {};

    if (user.role === "student") {
      const student = await prisma.student.findUnique({
        where: { userId: user.id },
        select: { programId: true, programLevelId: true },
      });

      if (!student) {
        return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
      }

      if (student.programId)      where.programId = student.programId;
      if (student.programLevelId) where.levelId   = student.programLevelId;
    }

    const exams = await prisma.exam.findMany({
      where,
      include: {
        program: { select: { name: true } },
        level:   { select: { name: true } },
      },
      orderBy: { examStartDate: "asc" },
    });

    return NextResponse.json(exams);
  } catch (err) {
    console.error("[GET /api/student/exams]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}