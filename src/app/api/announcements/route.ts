// src\app\api\announcements\route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

export async function GET(req: NextRequest) {
  const dbUser = await getSessionUser(req);

  if (!dbUser) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Get student's program + level
  const student = await prisma.student.findUnique({
    where: { userId: dbUser.id },
    select: {
      programId: true,
      programLevelId: true,
    },
  });

  const now = new Date();

const audienceConditions: any[] = [
  { audience: "all" },
  { audience: "students" },
];

  if (student?.programId) {
    audienceConditions.push({
      audience: "program",
      programId: student.programId,
    });
  }

  if (student?.programLevelId) {
    audienceConditions.push({
      audience: "level",
      levelId: student.programLevelId,
    });
  }

  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        AND: [
          {
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: now } },
            ],
          },
          {
            OR: audienceConditions,
          },
        ],
      },
      include: {
        program: {
          select: {
            id: true,
            name: true,
          },
        },
        level: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const PRIORITY_ORDER: Record<string, number> = {
      urgent: 0,
      normal: 1,
      info: 2,
    };

    announcements.sort((a, b) => {
      const priorityDiff =
        (PRIORITY_ORDER[a.priority] ?? 99) -
        (PRIORITY_ORDER[b.priority] ?? 99);

      if (priorityDiff !== 0) return priorityDiff;

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

    return NextResponse.json(announcements);
  } catch (error: any) {
    console.error("[GET /api/announcements]", error);

    return NextResponse.json(
      {
        error: error?.message || "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}