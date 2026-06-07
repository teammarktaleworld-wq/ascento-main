// app/api/razorpay-verify/route.ts
//
// POST /api/razorpay-verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// Verifies the HMAC signature, records the purchase, returns the item PDF URL.

import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

export async function POST(req: Request) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
    }

    // ── Verify HMAC signature ─────────────────────────────────────────────────
    const body      = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected  = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    // ── Fetch order notes from Razorpay (we stored meta there) ───────────────
    // We re-derive the meta from the order via Razorpay SDK
    const Razorpay = (await import("razorpay")).default;
    const rzp = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await rzp.orders.fetch(razorpay_order_id);
    const notes  = order.notes as Record<string, string>;

    const { userId, itemId, itemType, couponId, originalPrice, discountApplied } = notes;

    // Ensure this user matches the order
    if (userId !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    // Idempotency — if already recorded, just return success
    const existing = await prisma.purchase.findFirst({
      where: {
        userId,
        ...(itemType === "note"       ? { noteId:      itemId } : {}),
        ...(itemType === "test_paper" ? { testPaperId: itemId } : {}),
      },
    });

    if (!existing) {
      await prisma.$transaction(async (tx) => {
        // Increment coupon usage if used
        if (couponId) {
          await tx.coupon.update({
            where: { id: couponId },
            data:  { usedCount: { increment: 1 } },
          });
        }

        const finalPrice = Number(originalPrice) - Number(discountApplied);

        await tx.purchase.create({
          data: {
            userId,
            noteId:        itemType === "note"       ? itemId : null,
            testPaperId:   itemType === "test_paper" ? itemId : null,
            couponId:      couponId || null,
            originalPrice: Number(originalPrice),
            finalPrice,
            discountApplied: Number(discountApplied),
          },
        });
      });
    }

    // ── Return real PDF URL for the purchased item ────────────────────────────
    let pdfUrl: string | null = null;
    let downloadUrl: string | null = null;

    if (itemType === "note") {
      const note = await prisma.note.findUnique({ where: { id: itemId } });
      pdfUrl = note?.realUrl ?? note?.demoUrl ?? null;
    } else {
      const paper = await prisma.testPaper.findUnique({ where: { id: itemId } });
      pdfUrl = paper?.fileUrl ?? null;
      downloadUrl = pdfUrl;
    }

    return NextResponse.json({ success: true, pdfUrl, downloadUrl });
  } catch (e: any) {
    console.error("[razorpay-verify]", e);
    return NextResponse.json({ error: e.message ?? "Verification failed." }, { status: 500 });
  }
}