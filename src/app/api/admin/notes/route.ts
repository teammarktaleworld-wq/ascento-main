






// app/api/admin/notes/route.ts


import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

// ── GET /api/admin/notes ──────────────────────────────────────────────────────
export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const search      = searchParams.get("search")?.trim() ?? "";
  const categoryId  = searchParams.get("categoryId")?.trim() ?? "";
  const priceFilter = searchParams.get("price") ?? "";          // "free" | "paid"
  const avail       = searchParams.get("availability") ?? "";   // "both" | "demo_only" | "real_only"
  const page        = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit       = Math.min(100, Number(searchParams.get("limit") ?? 50));

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { label: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId === "uncategorized") {
    where.categoryId = null;
  } else if (categoryId) {
    where.categoryId = categoryId;
  }

  if (priceFilter === "free") where.price = 0;
  if (priceFilter === "paid") where.price = { gt: 0 };

  if (avail === "both")      { where.demoUrl = { not: null }; where.realUrl = { not: null }; }
  if (avail === "demo_only") { where.demoUrl = { not: null }; where.realUrl = null; }
  if (avail === "real_only") { where.demoUrl = null;          where.realUrl = { not: null }; }

  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { serialId: "asc" },
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { purchases: true } },
      },
    }),
    prisma.note.count({ where }),
  ]);

  return NextResponse.json({ notes, total, page, limit });
}

// ── POST /api/admin/notes ─────────────────────────────────────────────────────
export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  let body: {
    serialId?:       number;
    title?:          string;
    label?:          string;
    categoryId?:     string | null;
    price?:          number;
    discountPercent?: number | null;
    demoUrl?:        string | null;
    demoPath?:       string | null;
    realUrl?:        string | null;
    realPath?:       string | null;
  };

  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const {
    serialId,
    title,
    label        = "",
    categoryId   = null,
    price        = 0,
    discountPercent = null,
    demoUrl      = null,
    demoPath     = null,
    realUrl      = null,
    realPath     = null,
  } = body;

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!title?.trim())
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!serialId || serialId < 1)
    return NextResponse.json({ error: "serialId must be a positive integer" }, { status: 400 });
  if (!demoUrl && !realUrl)
    return NextResponse.json({ error: "At least one of demoUrl or realUrl is required" }, { status: 400 });
  if (price < 0)
    return NextResponse.json({ error: "price must be >= 0" }, { status: 400 });
  if (discountPercent !== null && (discountPercent < 1 || discountPercent > 100))
    return NextResponse.json({ error: "discountPercent must be 1–100" }, { status: 400 });

  if (categoryId) {
    const cat = await prisma.noteCategory.findUnique({ where: { id: categoryId } });
    if (!cat) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const note = await prisma.note.create({
    data: {
      serialId,
      title:    title.trim(),
      label:    label.trim(),
      categoryId,
      price,
      discountPercent,
      demoUrl,
      demoPath,
      realUrl,
      realPath,
    },
    include: {
      category: { select: { id: true, name: true } },
      _count: { select: { purchases: true } },
    },
  });

  return NextResponse.json({ note }, { status: 201 });
}