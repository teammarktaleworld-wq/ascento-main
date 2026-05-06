import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

// GET /api/admin/marks?examId=&subjectId=
export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const examId = searchParams.get("examId");
  const subjectId = searchParams.get("subjectId");

  const where: any = {};
  if (examId) where.examId = examId;
  if (subjectId) where.subjectId = subjectId;

  const marks = await prisma.mark.findMany({
    where,
    include: { student: true, exam: true, subject: true },
  });
  return NextResponse.json(marks);
}

// POST /api/admin/marks — bulk upsert marks
// body: { marks: [{ studentId, examId, subjectId, marksObtained, totalMarks }] }
export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { marks } = await req.json() as {
    marks: { studentId: string; examId: string; subjectId: string; marksObtained: number; totalMarks: number }[];
  };

  const ops = marks.map((m) =>
    prisma.mark.upsert({
      where: { studentId_examId_subjectId: { studentId: m.studentId, examId: m.examId, subjectId: m.subjectId } },
      update: { marksObtained: m.marksObtained, totalMarks: m.totalMarks },
      create: m,
    })
  );

  const result = await prisma.$transaction(ops);
  return NextResponse.json({ saved: result.length });
}