// // app/api/razorpay-order/route.ts
// //
// // POST /api/razorpay-order
// // Body: { itemId: string; itemType: "note" | "test_paper"; couponCode?: string }
// // Returns: { orderId, amount, currency, keyId, item, coupon? }

// import { NextResponse } from "next/server";
// import Razorpay from "razorpay";
// import { prisma } from "@/lib/helpers/prisma";
// import { getSessionUser } from "@/lib/helpers/auth-helpers";

// const razorpay = new Razorpay({
//   key_id:     process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!,
// });

// function effectivePrice(price: number, discount: number | null): number {
//   if (!discount || discount <= 0) return price;
//   return Math.max(0, Math.round(price * (1 - discount / 100)));
// }

// export async function POST(req: Request) {
//   const user = await getSessionUser(req);
//   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   try {
//     const { itemId, itemType, couponCode } = await req.json();

//     if (!itemId || !itemType) {
//       return NextResponse.json({ error: "itemId and itemType are required." }, { status: 400 });
//     }

//     // ── Fetch the item ────────────────────────────────────────────────────────
//     let title         = "";
//     let basePrice     = 0;
//     let itemDiscount: number | null = null;

//     if (itemType === "note") {
//       const note = await prisma.note.findUnique({ where: { id: itemId } });
//       if (!note) return NextResponse.json({ error: "Note not found." }, { status: 404 });
//       title        = note.title;
//       basePrice    = note.price;
//       itemDiscount = note.discountPercent ?? null;
//     } else if (itemType === "test_paper") {
//       const paper = await prisma.testPaper.findUnique({ where: { id: itemId } });
//       if (!paper) return NextResponse.json({ error: "Test paper not found." }, { status: 404 });
//       title        = paper.title;
//       basePrice    = paper.price;
//       itemDiscount = paper.discountPercent ?? null;
//     } else {
//       return NextResponse.json({ error: "Invalid itemType." }, { status: 400 });
//     }

//     // ── Check already purchased ───────────────────────────────────────────────
//     const alreadyBought = await prisma.purchase.findFirst({
//       where: {
//         userId:                user.id,
//         ...(itemType === "note"       ? { noteId:      itemId } : {}),
//         ...(itemType === "test_paper" ? { testPaperId: itemId } : {}),
//       },
//     });
//     if (alreadyBought) {
//       return NextResponse.json({ error: "You already own this item." }, { status: 409 });
//     }

//     // ── Apply item-level discount ─────────────────────────────────────────────
//     let priceAfterItemDiscount = effectivePrice(basePrice, itemDiscount);

//     // ── Validate coupon ───────────────────────────────────────────────────────
//     let coupon: Awaited<ReturnType<typeof prisma.coupon.findUnique>> | null = null;
//     let couponDiscount = 0;

//     if (couponCode) {
//       coupon = await prisma.coupon.findUnique({
//         where: { code: couponCode.trim().toUpperCase() },
//       });

//       if (!coupon || !coupon.isActive) {
//         return NextResponse.json({ error: "Invalid or inactive coupon." }, { status: 400 });
//       }
//       if (coupon.expiresAt && coupon.expiresAt < new Date()) {
//         return NextResponse.json({ error: "Coupon has expired." }, { status: 400 });
//       }
//       if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
//         return NextResponse.json({ error: "Coupon usage limit reached." }, { status: 400 });
//       }
//       // Scope check
//       if (coupon.scope === "note" && (itemType !== "note" || coupon.noteId !== itemId)) {
//         return NextResponse.json({ error: "This coupon is not valid for this item." }, { status: 400 });
//       }
//       if (coupon.scope === "test_paper" && (itemType !== "test_paper" || coupon.testPaperId !== itemId)) {
//         return NextResponse.json({ error: "This coupon is not valid for this item." }, { status: 400 });
//       }

//       couponDiscount = Math.round(priceAfterItemDiscount * (coupon.discountPercent / 100));
//     }

//     const finalPrice      = Math.max(0, priceAfterItemDiscount - couponDiscount);
//     const discountApplied = basePrice - finalPrice;

//     // ── Free item — skip Razorpay, record purchase directly ──────────────────
//     if (finalPrice === 0) {
//       const purchase = await prisma.$transaction(async (tx) => {
//         if (coupon) {
//           await tx.coupon.update({
//             where: { id: coupon!.id },
//             data:  { usedCount: { increment: 1 } },
//           });
//         }
//         return tx.purchase.create({
//           data: {
//             userId:        user.id,
//             noteId:        itemType === "note"       ? itemId : null,
//             testPaperId:   itemType === "test_paper" ? itemId : null,
//             couponId:      coupon?.id ?? null,
//             originalPrice: basePrice,
//             finalPrice:    0,
//             discountApplied,
//           },
//         });
//       });

//       return NextResponse.json({ free: true, purchase });
//     }

//     // ── Paid item — create Razorpay order ─────────────────────────────────────
//     // Razorpay amount is in paise (1 INR = 100 paise)
//     const order = await razorpay.orders.create({
//       amount:   finalPrice * 100,
//       currency: "INR",
//       receipt:  `rcpt_${user.id.slice(0, 8)}_${Date.now()}`,
//       notes: {
//         userId:       user.id,
//         itemId,
//         itemType,
//         couponId:     coupon?.id ?? "",
//         originalPrice: String(basePrice),
//         discountApplied: String(discountApplied),
//       },
//     });

//     return NextResponse.json({
//       free:     false,
//       orderId:  order.id,
//       amount:   finalPrice * 100,
//       currency: "INR",
//       keyId:    process.env.RAZORPAY_KEY_ID,
//       item:     { id: itemId, type: itemType, title, originalPrice: basePrice, finalPrice },
//       couponApplied: coupon
//         ? { code: coupon.code, discountPercent: coupon.discountPercent, saved: couponDiscount }
//         : null,
//     });
//   } catch (e: any) {
//     console.error("[razorpay-order]", e);
//     return NextResponse.json({ error: e.message ?? "Failed to create order." }, { status: 500 });
//   }
// }













// app/api/razorpay-order/route.ts
// POST /api/razorpay-order
// Body: { itemId: string; itemType: "note" | "test_paper"; couponCode?: string }
//
// Key fixes vs. previous version:
//  1. Coupon dry-run: if couponCode is sent, validates and returns couponApplied
//     WITHOUT creating a Razorpay order (so UI can show discount preview).
//  2. Actual pay: creates Razorpay order; for free items records purchase directly.
//  3. Returns full couponApplied object so frontend can display savings.

import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

function effectivePrice(price: number, discount: number | null): number {
  if (!discount || discount <= 0) return price;
  return Math.max(0, Math.round(price * (1 - discount / 100)));
}

export async function POST(req: Request) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { itemId?: string; itemType?: string; couponCode?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { itemId, itemType, couponCode } = body;

  if (!itemId || !itemType) {
    return NextResponse.json({ error: "itemId and itemType are required." }, { status: 400 });
  }

  // ── Fetch item ────────────────────────────────────────────────────────────
  let title         = "";
  let basePrice     = 0;
  let itemDiscount: number | null = null;

  if (itemType === "note") {
    const note = await prisma.note.findUnique({ where: { id: itemId } });
    if (!note) return NextResponse.json({ error: "Note not found." }, { status: 404 });
    title        = note.title;
    basePrice    = note.price;
    itemDiscount = note.discountPercent ?? null;
  } else if (itemType === "test_paper") {
    const paper = await prisma.testPaper.findUnique({ where: { id: itemId } });
    if (!paper) return NextResponse.json({ error: "Test paper not found." }, { status: 404 });
    title        = paper.title;
    basePrice    = paper.price;
    itemDiscount = paper.discountPercent ?? null;
  } else {
    return NextResponse.json({ error: "Invalid itemType." }, { status: 400 });
  }

  // ── Check already purchased ───────────────────────────────────────────────
  const alreadyBought = await prisma.purchase.findFirst({
    where: {
      userId: user.id,
      ...(itemType === "note"       ? { noteId: itemId }      : {}),
      ...(itemType === "test_paper" ? { testPaperId: itemId } : {}),
    },
  });
  if (alreadyBought) {
    return NextResponse.json({ error: "You already own this item." }, { status: 409 });
  }

  // ── Price after item-level discount ───────────────────────────────────────
  let priceAfterItemDiscount = effectivePrice(basePrice, itemDiscount);

  // ── Validate coupon (if provided) ─────────────────────────────────────────
  let coupon: Awaited<ReturnType<typeof prisma.coupon.findUnique>> | null = null;
  let couponDiscount = 0;

  if (couponCode?.trim()) {
    coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.trim().toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid or inactive coupon." }, { status: 400 });
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "Coupon usage limit reached." }, { status: 400 });
    }
    // Scope checks
    if (coupon.scope === "note" && (itemType !== "note" || coupon.noteId !== itemId)) {
      return NextResponse.json({ error: "This coupon is not valid for this item." }, { status: 400 });
    }
    if (coupon.scope === "test_paper" && (itemType !== "test_paper" || coupon.testPaperId !== itemId)) {
      return NextResponse.json({ error: "This coupon is not valid for this item." }, { status: 400 });
    }

    couponDiscount = Math.round(priceAfterItemDiscount * (coupon.discountPercent / 100));
  }

  const finalPrice      = Math.max(0, priceAfterItemDiscount - couponDiscount);
  const discountApplied = basePrice - finalPrice;

  const couponAppliedPayload = coupon
    ? {
        code:            coupon.code,
        discountPercent: coupon.discountPercent,
        saved:           couponDiscount,
      }
    : null;

  // ── Free item: record purchase directly, skip Razorpay ───────────────────
  if (finalPrice === 0) {
    const purchase = await prisma.$transaction(async (tx) => {
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon!.id },
          data:  { usedCount: { increment: 1 } },
        });
      }
      return tx.purchase.create({
        data: {
          userId:          user.id,
          noteId:          itemType === "note"       ? itemId : null,
          testPaperId:     itemType === "test_paper" ? itemId : null,
          couponId:        coupon?.id ?? null,
          originalPrice:   basePrice,
          finalPrice:      0,
          discountApplied,
        },
      });
    });

    // Return real PDF URL immediately
    let pdfUrl: string | null = null;
    if (itemType === "note") {
      const note = await prisma.note.findUnique({ where: { id: itemId } });
      pdfUrl = note?.realUrl ?? note?.demoUrl ?? null;
    } else {
      const paper = await prisma.testPaper.findUnique({ where: { id: itemId } });
      pdfUrl = paper?.realUrl ?? paper?.fileUrl ?? null;
    }

    return NextResponse.json({
      free:          true,
      purchase:      purchase,
      purchaseId:    purchase.id,
      pdfUrl,
      couponApplied: couponAppliedPayload,
    });
  }

  // ── Paid item: create Razorpay order ─────────────────────────────────────
  try {
    const order = await razorpay.orders.create({
      amount:   finalPrice * 100,    // paise
      currency: "INR",
      receipt:  `rcpt_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        userId:          user.id,
        itemId,
        itemType,
        couponId:        coupon?.id ?? "",
        originalPrice:   String(basePrice),
        discountApplied: String(discountApplied),
      },
    });

    return NextResponse.json({
      free:          false,
      orderId:       order.id,
      amount:        finalPrice * 100,
      currency:      "INR",
      keyId:         process.env.RAZORPAY_KEY_ID,
      item:          { id: itemId, type: itemType, title, originalPrice: basePrice, finalPrice },
      couponApplied: couponAppliedPayload,
    });
  } catch (e: any) {
    console.error("[razorpay-order]", e);
    return NextResponse.json({ error: e.message ?? "Failed to create order." }, { status: 500 });
  }
}