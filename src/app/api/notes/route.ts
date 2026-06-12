


// app/api/notes/route.ts  (updated)
//


import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search     = searchParams.get("search")?.trim()     ?? "";
  const categoryId = searchParams.get("categoryId")?.trim() ?? "";
  const priceFilter= searchParams.get("price")              ?? "";   // "free" | "paid"
  const access     = searchParams.get("access")             ?? "";   // "owned" | "free"
  const page       = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit      = Math.min(100, Number(searchParams.get("limit") ?? 50));

  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { label: { contains: search, mode: "insensitive" } },
    ];
  }
  if (categoryId === "uncategorized") where.categoryId = null;
  else if (categoryId)                where.categoryId = categoryId;

  if (priceFilter === "free") where.price = 0;
  if (priceFilter === "paid") where.price = { gt: 0 };

  const [rawNotes, total, userPurchases] = await Promise.all([
    prisma.note.findMany({
      where,
      skip:    (page - 1) * limit,
      take:    limit,
      orderBy: { serialId: "asc" },
      include: {
        category: { select: { id: true, name: true } },
        _count:   { select: { purchases: true } },
      },
    }),
    prisma.note.count({ where }),
    // Fetch this user's note purchases
    prisma.purchase.findMany({
      where:  { userId: user.id, noteId: { not: null } },
      select: { noteId: true, finalPrice: true, discountApplied: true, purchasedAt: true },
    }),
  ]);

  const purchasedNoteIds = new Set(userPurchases.map((p) => p.noteId!));

  const notes = rawNotes.map((note) => {
    const isPurchased = note.price === 0 || purchasedNoteIds.has(note.id);
    const purchase    = userPurchases.find((p) => p.noteId === note.id);

    const effectivePrice =
      note.discountPercent
        ? Math.round(note.price * (1 - note.discountPercent / 100))
        : note.price;

    return {
      id:              note.id,
      serialId:        note.serialId,
      title:           note.title,
      label:           note.label,
      categoryId:      note.categoryId,
      category:        note.category,
      price:           note.price,
      discountPercent: note.discountPercent,
      effectivePrice,
      createdAt:       note.createdAt,
      // Access gating
      isPurchased,
      locked:          !isPurchased,
      // Demo PDF is always visible; real PDF only if purchased
      demoUrl:  note.demoUrl,
      realUrl:  isPurchased ? note.realUrl : null,
      // Purchase metadata
      purchase: purchase
        ? {
            paidAmount:      purchase.finalPrice,
            discountApplied: purchase.discountApplied,
            purchasedAt:     purchase.purchasedAt,
          }
        : null,
      _count: note._count,
    };
  });

  // Filter "access" param after enrichment
  const filtered =
    access === "owned" ? notes.filter((n) => n.isPurchased)
    : access === "free"  ? notes.filter((n) => n.price === 0)
    : notes;

  return NextResponse.json({ notes: filtered, total, page, limit });
}