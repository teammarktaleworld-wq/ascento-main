// app/api/notes/my-purchases/route.ts
// GET /api/notes/my-purchases
// Returns the current user's purchase history with order IDs, item titles,
// amounts, discounts, and coupon codes — used by the "My Orders" modal.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const raw = await prisma.purchase.findMany({
      where: { userId: user.id },
      orderBy: { purchasedAt: "desc" },
      include: {
        note:      { select: { id: true, title: true, serialId: true } },
        testPaper: { select: { id: true, title: true, serialId: true } },
        coupon:    { select: { code: true } },
      },
    });

    const purchases = raw.map(p => ({
      id:              p.id,
      // orderId not stored in DB; use purchase id as reference
      orderId:         p.id,
      itemId:          p.noteId ?? p.testPaperId,
      itemType:        p.noteId ? "note" : "test_paper",
      itemTitle:       p.note?.title ?? p.testPaper?.title ?? "—",
      itemSerial:      p.note?.serialId ?? p.testPaper?.serialId ?? 0,
      originalPrice:   p.originalPrice,
      paidAmount:      p.finalPrice,
      discountApplied: p.discountApplied,
      purchasedAt:     p.purchasedAt,
      couponCode:      p.coupon?.code ?? null,
    }));

    return NextResponse.json({ purchases, total: purchases.length });
  } catch (e: any) {
    console.error("[my-purchases]", e);
    return NextResponse.json({ error: "Failed to load purchases" }, { status: 500 });
  }
}