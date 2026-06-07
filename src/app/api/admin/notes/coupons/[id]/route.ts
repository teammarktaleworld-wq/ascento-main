// app/api/admin/notes/coupons/[id]/route.ts
// GET    /api/admin/coupons/[id]
// PATCH  /api/admin/coupons/[id]  — update or toggle active
// DELETE /api/admin/coupons/[id]

import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

const include = {
  note:      { select: { id: true, title: true } },
  testPaper: { select: { id: true, title: true } },
  _count:    { select: { purchases: true } },
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({ where: { id }, include });
  if (!coupon) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  return NextResponse.json({ coupon });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });

  let body: {
    discountPercent?: number;
    maxUses?:         number | null;
    expiresAt?:       string | null;
    isActive?:        boolean;
  };

  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { discountPercent, maxUses, expiresAt, isActive } = body;

  if (discountPercent !== undefined && (discountPercent < 1 || discountPercent > 100))
    return NextResponse.json({ error: "discountPercent must be 1–100" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (discountPercent !== undefined) data.discountPercent = discountPercent;
  if ("maxUses"    in body)          data.maxUses         = maxUses ?? null;
  if ("expiresAt"  in body)          data.expiresAt       = expiresAt ? new Date(expiresAt) : null;
  if (isActive     !== undefined)    data.isActive        = isActive;

  try {
    const coupon = await prisma.coupon.update({ where: { id }, data, include });
    return NextResponse.json({ coupon });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;
  try {
    // Nullify couponId on purchases that used this coupon before deleting
    await prisma.purchase.updateMany({
      where: { couponId: id },
      data:  { couponId: null },
    });
    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}