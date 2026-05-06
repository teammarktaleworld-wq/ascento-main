import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const exams = await prisma.exam.findMany({
    include: { marks: { include: { student: true, subject: true } } },
    orderBy: { examStartDate: "desc" },
  });
  return NextResponse.json(exams);
}

export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const body = await req.json();
  const exam = await prisma.exam.create({
    data: {
      examName: body.examName,
      description: body.description,
      examStartDate: body.examStartDate ? new Date(body.examStartDate) : null,
      examEndDate: body.examEndDate ? new Date(body.examEndDate) : null,
    },
  });
  return NextResponse.json(exam, { status: 201 });
}