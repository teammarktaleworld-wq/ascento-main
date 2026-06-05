import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

// PATCH /api/admin/students/:id/fees/:feeId
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string; feeId: string }> },
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { feeId } = await context.params;
  const body = await req.json();

  const fee = await prisma.studentFee.update({
    where: { id: feeId },
    data: {
      feeType:     body.feeType     ?? undefined,
      description: body.description !== undefined ? (body.description || null) : undefined,
      amount:      body.amount      != null ? Number(body.amount)      : undefined,
      paidAmount:  body.paidAmount  != null ? Number(body.paidAmount)  : undefined,
      dueDate:     body.dueDate     !== undefined ? (body.dueDate  ? new Date(body.dueDate)  : null) : undefined,
      paidDate:    body.paidDate    !== undefined ? (body.paidDate ? new Date(body.paidDate) : null) : undefined,
      status:      body.status      ?? undefined,
      month:       body.month       !== undefined ? (body.month        || null) : undefined,
      academicYear:body.academicYear!== undefined ? (body.academicYear || null) : undefined,
      receiptNo:   body.receiptNo   !== undefined ? (body.receiptNo    || null) : undefined,
      remarks:     body.remarks     !== undefined ? (body.remarks      || null) : undefined,
    },
  });

  return NextResponse.json(fee);
}

// DELETE /api/admin/students/:id/fees/:feeId
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string; feeId: string }> },
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { feeId } = await context.params;
  await prisma.studentFee.delete({ where: { id: feeId } });
  return NextResponse.json({ success: true });
}