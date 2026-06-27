// src\app\api\portal\papers\[id]\register\route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getAuthUser } from "@/lib/helpers/auth-helpers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const paper = await prisma.portalPaper.findUnique({ where: { id } });
    if (!paper) return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    if (!paper.isPublished || !paper.isActive)
      return NextResponse.json({ error: "This exam is not available" }, { status: 403 });

    const now = new Date();

    // Scheduled exam — check window
    if (paper.startDate && now < paper.startDate)
      return NextResponse.json({ error: "This exam has not started yet" }, { status: 403 });
    if (paper.endDate && now > paper.endDate)
      return NextResponse.json({ error: "This exam window has closed" }, { status: 403 });

    // Check existing registrations
    const existing = await prisma.portalRegistration.findMany({
      where: { userId: user.id, paperId: id },
      orderBy: { attemptNumber: "desc" },
    });

    if (existing.length >= paper.maxAttempts)
      return NextResponse.json({
        error: `Maximum ${paper.maxAttempts} attempt(s) allowed`,
      }, { status: 403 });

    const registration = await prisma.portalRegistration.create({
      data: {
        userId: user.id,
        paperId: id,
        status: "registered",
        attemptNumber: existing.length + 1,
        totalMarks: paper.totalMarks,
      },
    });

    return NextResponse.json({ registration }, { status: 201 });
  } catch (e: any) {
    // Unique constraint = already registered for this attempt
    if (e.code === "P2002")
      return NextResponse.json({ error: "Already registered for this exam" }, { status: 409 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}