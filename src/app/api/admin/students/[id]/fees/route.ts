import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

// GET /api/admin/students/:id/fees
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;

  const fees = await prisma.studentFee.findMany({
    where: { studentId: id },
    orderBy: { createdAt: "desc" },
  });

  const totalAmount = fees.reduce((s, f) => s + f.amount, 0);
  const totalPaid   = fees.reduce((s, f) => s + f.paidAmount, 0);
  const totalDue    = totalAmount - totalPaid;

  return NextResponse.json({ fees, summary: { totalAmount, totalPaid, totalDue } });
}

// POST /api/admin/students/:id/fees
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;
  const body = await req.json();

  const { feeType, description, amount, paidAmount, dueDate, paidDate,
          status, month, academicYear, receiptNo, remarks } = body;

  if (!feeType || amount == null) {
    return NextResponse.json({ error: "feeType and amount are required" }, { status: 400 });
  }

  const fee = await prisma.studentFee.create({
    data: {
      studentId:   id,
      feeType,
      description: description || null,
      amount:      Number(amount),
      paidAmount:  Number(paidAmount ?? 0),
      dueDate:     dueDate  ? new Date(dueDate)  : null,
      paidDate:    paidDate ? new Date(paidDate) : null,
      status:      status   ?? "Pending",
      month:       month        || null,
      academicYear:academicYear || null,
      receiptNo:   receiptNo    || null,
      remarks:     remarks      || null,
    },
  });

  return NextResponse.json(fee, { status: 201 });
}