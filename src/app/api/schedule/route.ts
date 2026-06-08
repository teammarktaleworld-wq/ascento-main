import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

export async function GET(req: NextRequest) {
  const dbUser = await getSessionUser(req);
  if (!dbUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get student's program + level
  const student = await prisma.student.findUnique({
    where: { userId: dbUser.id },
    select: { programId: true, programLevelId: true },
  });

  const { searchParams } = new URL(req.url);

  // Allow overriding via query params (so student can browse other classes)
  const programId = searchParams.get("programId") || student?.programId || undefined;
  const levelId   = searchParams.get("levelId")   || student?.programLevelId || undefined;
  const dayOfWeek = searchParams.get("dayOfWeek") || undefined;
  const search    = searchParams.get("search")    || undefined;

  try {
    const slots = await prisma.scheduleSlot.findMany({
      where: {
        ...(programId ? { programId }            : {}),
        ...(levelId   ? { levelId }              : {}),
        ...(dayOfWeek ? { dayOfWeek }            : {}),
        ...(search    ? {
          OR: [
            { subjectName: { contains: search, mode: "insensitive" } },
            { teacherName: { contains: search, mode: "insensitive" } },
          ],
        } : {}),
      },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { periodNumber: "asc" },
      ],
    });

    return NextResponse.json({
      slots,
      studentContext: {
        programId:   student?.programId      ?? null,
        levelId:     student?.programLevelId ?? null,
      },
    });
  } catch (err: any) {
    console.error("[GET /api/schedule]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}