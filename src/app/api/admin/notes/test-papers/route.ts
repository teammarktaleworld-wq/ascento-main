// // app/api/admin/notes/test-papers/route.ts
// // GET  /api/admin/test-papers
// // POST /api/admin/test-papers

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers";

// // ── GET ───────────────────────────────────────────────────────────────────────
// export async function GET(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { searchParams } = new URL(req.url);
//   const search      = searchParams.get("search")?.trim()    ?? "";
//   const categoryId  = searchParams.get("categoryId")?.trim() ?? "";
//   const priceFilter = searchParams.get("price")             ?? "";
//   const page        = Math.max(1, Number(searchParams.get("page")  ?? 1));
//   const limit       = Math.min(100, Number(searchParams.get("limit") ?? 50));

//   const where: Record<string, unknown> = {};

//   if (search) {
//     where.OR = [
//       { title: { contains: search, mode: "insensitive" } },
//       { label: { contains: search, mode: "insensitive" } },
//     ];
//   }

//   if (categoryId === "uncategorized") where.categoryId = null;
//   else if (categoryId)                where.categoryId = categoryId;

//   if (priceFilter === "free") where.price = 0;
//   if (priceFilter === "paid") where.price = { gt: 0 };

//   const [papers, total] = await Promise.all([
//     prisma.testPaper.findMany({
//       where,
//       skip: (page - 1) * limit,
//       take: limit,
//       orderBy: { serialId: "asc" },
//       include: {
//         category: { select: { id: true, name: true } },
//         _count:   { select: { purchases: true } },
//       },
//     }),
//     prisma.testPaper.count({ where }),
//   ]);

//   return NextResponse.json({ papers, total, page, limit });
// }

// // ── POST ──────────────────────────────────────────────────────────────────────
// export async function POST(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   let body: {
//     serialId?:        number;
//     title?:           string;
//     label?:           string;
//     categoryId?:      string | null;
//     price?:           number;
//     discountPercent?: number | null;
//     fileUrl?:         string;
//     filePath?:        string;
//   };

//   try { body = await req.json(); }
//   catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

//   const {
//     serialId,
//     title,
//     label           = "",
//     categoryId      = null,
//     price           = 0,
//     discountPercent = null,
//     fileUrl,
//     filePath,
//   } = body;

//   if (!title?.trim())
//     return NextResponse.json({ error: "Title is required" }, { status: 400 });
//   if (!serialId || serialId < 1)
//     return NextResponse.json({ error: "serialId must be a positive integer" }, { status: 400 });
//   if (!fileUrl || !filePath)
//     return NextResponse.json({ error: "fileUrl and filePath are required" }, { status: 400 });
//   if (price < 0)
//     return NextResponse.json({ error: "price must be >= 0" }, { status: 400 });
//   if (discountPercent !== null && (discountPercent < 1 || discountPercent > 100))
//     return NextResponse.json({ error: "discountPercent must be 1–100" }, { status: 400 });

//   if (categoryId) {
//     const cat = await prisma.testPaperCategory.findUnique({ where: { id: categoryId } });
//     if (!cat) return NextResponse.json({ error: "Category not found" }, { status: 404 });
//   }

//   const paper = await prisma.testPaper.create({
//     data: {
//       serialId,
//       title: title.trim(),
//       label: label.trim(),
//       categoryId,
//       price,
//       discountPercent,
//       fileUrl,
//       filePath,
//     },
//     include: {
//       category: { select: { id: true, name: true } },
//       _count:   { select: { purchases: true } },
//     },
//   });

//   return NextResponse.json({ paper }, { status: 201 });
// }










// ═══════════════════════════════════════════════════════════════
// FILE 1: app/api/admin/notes/test-papers/route.ts
// Updated to support demoUrl/demoPath + realUrl/realPath
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const search      = searchParams.get("search")?.trim()    ?? "";
  const categoryId  = searchParams.get("categoryId")?.trim() ?? "";
  const priceFilter = searchParams.get("price")             ?? "";
  const page        = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit       = Math.min(200, Number(searchParams.get("limit") ?? 50));

  const where: Record<string, unknown> = {};
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

  const [papers, total] = await Promise.all([
    prisma.testPaper.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { serialId: "asc" },
      include: {
        category: { select: { id: true, name: true } },
        _count:   { select: { purchases: true } },
      },
    }),
    prisma.testPaper.count({ where }),
  ]);

  return NextResponse.json({ papers, total, page, limit });
}

export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  let body: {
    serialId?:        number;
    title?:           string;
    label?:           string;
    categoryId?:      string | null;
    price?:           number;
    discountPercent?: number | null;
    demoUrl?:         string | null;
    demoPath?:        string | null;
    realUrl?:         string | null;
    realPath?:        string | null;
    // Legacy compat
    fileUrl?:         string | null;
    filePath?:        string | null;
  };

  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const {
    serialId, title, label = "", categoryId = null,
    price = 0, discountPercent = null,
    demoUrl = null, demoPath = null,
    realUrl = null, realPath = null,
    fileUrl = null, filePath = null,
  } = body;

  if (!title?.trim())
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!serialId || serialId < 1)
    return NextResponse.json({ error: "serialId must be a positive integer" }, { status: 400 });

  // Require at least one PDF
  const finalRealUrl = realUrl ?? fileUrl;
  if (!demoUrl && !finalRealUrl)
    return NextResponse.json({ error: "Upload at least one PDF (Demo or Real)" }, { status: 400 });

  if (price < 0)
    return NextResponse.json({ error: "price must be >= 0" }, { status: 400 });
  if (discountPercent !== null && (discountPercent < 1 || discountPercent > 100))
    return NextResponse.json({ error: "discountPercent must be 1–100" }, { status: 400 });
  if (categoryId) {
    const cat = await prisma.testPaperCategory.findUnique({ where: { id: categoryId } });
    if (!cat) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  try {
    const paper = await prisma.testPaper.create({
      data: {
        serialId,
        title:    title.trim(),
        label:    label.trim(),
        categoryId,
        price,
        discountPercent,
        demoUrl,
        demoPath,
        realUrl:  finalRealUrl,
        realPath: realPath ?? filePath,
        // Keep legacy fields populated for backward compat
        fileUrl:  finalRealUrl ?? "",
        filePath: realPath ?? filePath ?? "",
      },
      include: {
        category: { select: { id: true, name: true } },
        _count:   { select: { purchases: true } },
      },
    });
    return NextResponse.json({ paper }, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002")
      return NextResponse.json({ error: "Serial ID already exists" }, { status: 409 });
    console.error("[POST test-papers]", e);
    return NextResponse.json({ error: "Failed to create test paper" }, { status: 500 });
  }
}

