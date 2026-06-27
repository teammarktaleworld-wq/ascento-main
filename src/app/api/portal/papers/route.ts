// src\app\api\portal\papers\route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getAuthUser } from "@/lib/helpers/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    const now = new Date();

    const papers = await prisma.portalPaper.findMany({
      where: {
        isPublished: true,
        isActive: true,
        ...(categoryId ? { categoryId } : {}),
        // Exclude scheduled papers whose window has fully closed
        OR: [
          { endDate: null },
          { endDate: { gte: now } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { portalQuestions: true } },
        portalRegistrations: {
          where: { userId: user.id },
          select: { id: true, status: true, score: true, percentage: true, attemptNumber: true, submittedAt: true },
        },
      },
    });

    return NextResponse.json({ papers });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}