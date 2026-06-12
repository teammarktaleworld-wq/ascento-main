// src/app/api/schedule/uploads/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

export async function GET(req: NextRequest) {
  const dbUser = await getSessionUser(req);
  if (!dbUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const student = await prisma.student.findUnique({
    where: { userId: dbUser.id },
    select: { programId: true, programLevelId: true },
  });

  const { searchParams } = new URL(req.url);
  const programId = searchParams.get("programId") || student?.programId || undefined;
  const levelId   = searchParams.get("levelId")   || student?.programLevelId || undefined;

  try {
    const uploads = await prisma.timetableUpload.findMany({
      where: {
        OR: [
          { programId: null, levelId: null }, // global uploads
          ...(programId ? [{ programId, levelId: null }] : []),
          ...(programId && levelId ? [{ programId, levelId }] : []),
        ],
      },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ uploads });
  } catch (err: any) {
    console.error("[GET /api/schedule/uploads]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}