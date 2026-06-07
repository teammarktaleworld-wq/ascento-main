// app/api/notes/test-papers/route.ts



import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search      = searchParams.get("search")?.trim()     ?? "";
  const categoryId  = searchParams.get("categoryId")?.trim() ?? "";
  const priceFilter = searchParams.get("price")              ?? "";
  const access      = searchParams.get("access")             ?? "";
  const page        = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit       = Math.min(100, Number(searchParams.get("limit") ?? 50));

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

  const [rawPapers, total, userPurchases] = await Promise.all([
    prisma.testPaper.findMany({
      where,
      skip:    (page - 1) * limit,
      take:    limit,
      orderBy: { serialId: "asc" },
      include: {
        category: { select: { id: true, name: true } },
        _count:   { select: { purchases: true } },
      },
    }),
    prisma.testPaper.count({ where }),
    prisma.purchase.findMany({
      where:  { userId: user.id, testPaperId: { not: null } },
      select: { testPaperId: true, finalPrice: true, discountApplied: true, purchasedAt: true },
    }),
  ]);

  const purchasedIds = new Set(userPurchases.map((p) => p.testPaperId!));

  const papers = rawPapers.map((paper) => {
    const isPurchased = paper.price === 0 || purchasedIds.has(paper.id);
    const purchase    = userPurchases.find((p) => p.testPaperId === paper.id);
    const effectivePrice = paper.discountPercent
      ? Math.round(paper.price * (1 - paper.discountPercent / 100))
      : paper.price;

    return {
      id:              paper.id,
      serialId:        paper.serialId,
      title:           paper.title,
      label:           paper.label,
      categoryId:      paper.categoryId,
      category:        paper.category,
      price:           paper.price,
      discountPercent: paper.discountPercent,
      effectivePrice,
      createdAt:       paper.createdAt,
      isPurchased,
      locked:          !isPurchased,
      fileUrl:         isPurchased ? paper.fileUrl : null,
      purchase: purchase
        ? {
            paidAmount:      purchase.finalPrice,
            discountApplied: purchase.discountApplied,
            purchasedAt:     purchase.purchasedAt,
          }
        : null,
      _count: paper._count,
    };
  });

  const filtered =
    access === "owned" ? papers.filter((p) => p.isPurchased)
    : access === "free"  ? papers.filter((p) => p.price === 0)
    : papers;

  return NextResponse.json({ papers: filtered, total, page, limit });
}