import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

// GET /api/admin/fees?status=pending|paid&studentId=
export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const studentId = searchParams.get("studentId");

  const where: any = {};
  if (status) where.paymentStatus = status;
  if (studentId) where.studentId = studentId;

  const fees = await prisma.fee.findMany({
    where,
    include: { student: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(fees);
}

// POST /api/admin/fees — create a fee record
export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const body = await req.json();
  const fee = await prisma.fee.create({
    data: {
      studentId: body.studentId,
      feeType: body.feeType,
      amount: body.amount,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      createdById: body.createdById,
    },
    include: { student: true },
  });
  return NextResponse.json(fee, { status: 201 });
}