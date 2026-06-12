// src/app/api/admin/exams/[id]/notify-inapp/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const exam = await prisma.exam.findUnique({
    where: { id },
    include: {
      program: { select: { id: true, name: true } },
      level:   { select: { id: true, name: true } },
    },
  });

  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  if (!exam.programId) {
    return NextResponse.json(
      { error: "Exam has no program assigned — cannot determine recipients" },
      { status: 400 }
    );
  }

  // Fetch active students scoped to the exam's program (and level if set)
  const students = await prisma.student.findMany({
    where: {
      programId:     exam.programId,
      ...(exam.levelId ? { programLevelId: exam.levelId } : {}),
      status: "Active",
    },
    include: {
      user: { select: { id: true } },
    },
  });

  if (students.length === 0) {
    return NextResponse.json({
      examId:   exam.id,
      examName: exam.examName,
      total:    0,
      created:  0,
      message:  "No active students found for this program/level.",
    });
  }

  const dateStr = exam.examStartDate
    ? new Date(exam.examStartDate).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  const message = dateStr
    ? `${exam.examName} is scheduled on ${dateStr}.${exam.description ? " " + exam.description : ""}`
    : `${exam.examName} has been scheduled. Check the portal for details.`;

  // Delete existing notifications for this exam so each send is fresh/unread
  await prisma.notification.deleteMany({ where: { examId: exam.id } });

  // Create fresh notifications for all students
  await prisma.notification.createMany({
    data: students.map(s => ({
      userId:  s.userId,
      type:    "exam" as const,
      title:   `📝 Exam Scheduled: ${exam.examName}`,
      message,
      link:    "/dashboard/exams",
      examId:  exam.id,
      isRead:  false,
    })),
    skipDuplicates: true,
  });

  // Update exam notification tracking counters
  await prisma.exam.update({
    where: { id },
    data: {
      notifSentAt:    new Date(),
      notifSentCount: { increment: 1 },
    },
  });

  return NextResponse.json({
    examId:   exam.id,
    examName: exam.examName,
    total:    students.length,
    created:  students.length,
  });
}