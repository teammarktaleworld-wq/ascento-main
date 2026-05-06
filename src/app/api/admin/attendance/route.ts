import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

// GET /api/admin/attendance?sectionId=&date=2025-05-04
export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get("sectionId");
  const date = searchParams.get("date");

  const where: any = {};
  if (date) where.date = new Date(date);
  if (sectionId) {
    where.student = {
      enrollments: { some: { sectionId } },
    };
  }

  const records = await prisma.attendance.findMany({
    where,
    include: { student: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(records);
}

// POST /api/admin/attendance  — bulk upsert
// body: { date: "2025-05-04", records: [{ studentId, status }] }
export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { data: sessionData } = await import("@/lib/auth-helpers").then(m => ({ data: null }));
  const body = await req.json();
  const { date, records, markedById } = body as {
    date: string;
    records: { studentId: string; status: string }[];
    markedById?: string;
  };

  const ops = records.map((r) =>
    prisma.attendance.upsert({
      where: { studentId_date: { studentId: r.studentId, date: new Date(date) } },
      update: { status: r.status },
      create: { studentId: r.studentId, date: new Date(date), status: r.status, markedById },
    })
  );

  const result = await prisma.$transaction(ops);
  return NextResponse.json({ saved: result.length });
}