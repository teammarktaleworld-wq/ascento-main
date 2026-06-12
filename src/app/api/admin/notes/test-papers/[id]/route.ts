// app/api/admin/notes/test-papers/[id]/route.ts
// GET    /api/admin/notes/test-papers/[id]
// PATCH  /api/admin/notes/test-papers/[id]
// DELETE /api/admin/notes/test-papers/[id]

import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin"; // ← replaced


const BUCKET = "test-papers";

async function removeFromStorage(paths: (string | null | undefined)[]) {
  const valid = paths.filter((p): p is string => !!p);
  if (!valid.length) return;
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove(valid);
  if (error) console.error("Storage remove warning:", error.message);
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;

  const paper = await prisma.testPaper.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      coupons: true,
      _count: { select: { purchases: true } },
    },
  });

  if (!paper)
    return NextResponse.json({ error: "Test paper not found" }, { status: 404 });

  return NextResponse.json({ paper });
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;

  const existing = await prisma.testPaper.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Test paper not found" }, { status: 404 });

  let body: {
    serialId?: number;
    title?: string;
    label?: string;
    categoryId?: string | null;
    price?: number;
    discountPercent?: number | null;
    // Demo PDF
    demoUrl?: string | null;
    demoPath?: string | null;
    removeDemo?: boolean;
    // Real PDF (supports both new and legacy field names)
    realUrl?: string | null;
    realPath?: string | null;
    fileUrl?: string | null;
    filePath?: string | null;
    removeReal?: boolean;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    serialId,
    title,
    label,
    categoryId,
    price,
    discountPercent,
    demoUrl,
    demoPath,
    removeDemo = false,
    realUrl,
    realPath,
    fileUrl,
    filePath,
    removeReal = false,
  } = body;

  // ── Validate scalar fields ─────────────────────────────────────────────────
  if (price !== undefined && price < 0)
    return NextResponse.json({ error: "price must be >= 0" }, { status: 400 });

  if (
    discountPercent !== undefined &&
    discountPercent !== null &&
    (discountPercent < 1 || discountPercent > 100)
  )
    return NextResponse.json(
      { error: "discountPercent must be 1–100" },
      { status: 400 }
    );

  if (categoryId) {
    const cat = await prisma.testPaperCategory.findUnique({
      where: { id: categoryId },
    });
    if (!cat)
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  // ── Build update payload ───────────────────────────────────────────────────
  const data: Record<string, unknown> = {};

  if (serialId !== undefined)        data.serialId        = serialId;
  if (title?.trim())                 data.title           = title.trim();
  if (label !== undefined)           data.label           = label?.trim() ?? "";
  if ("categoryId" in body)          data.categoryId      = categoryId ?? null;
  if (price !== undefined)           data.price           = price;
  if ("discountPercent" in body)     data.discountPercent = discountPercent ?? null;

  const toDelete: (string | null | undefined)[] = [];

  // ── Demo PDF ───────────────────────────────────────────────────────────────
  if (removeDemo) {
    data.demoUrl  = null;
    data.demoPath = null;
    toDelete.push(existing.demoPath);
  } else if (demoUrl && demoPath && demoPath !== existing.demoPath) {
    data.demoUrl  = demoUrl;
    data.demoPath = demoPath;
    toDelete.push(existing.demoPath); // delete old demo from storage
  }

  // ── Real PDF (support legacy fileUrl/filePath field names) ─────────────────
  const incomingRealUrl  = realUrl  ?? fileUrl  ?? null;
  const incomingRealPath = realPath ?? filePath ?? null;
  const existingRealPath = existing.realPath ?? existing.filePath ?? null;

  if (removeReal) {
    data.realUrl  = null;
    data.realPath = null;
    data.fileUrl  = null;
    data.filePath = null;
    toDelete.push(existingRealPath);
  } else if (
    incomingRealUrl &&
    incomingRealPath &&
    incomingRealPath !== existingRealPath
  ) {
    data.realUrl  = incomingRealUrl;
    data.realPath = incomingRealPath;
    data.fileUrl  = incomingRealUrl;   // keep legacy columns in sync
    data.filePath = incomingRealPath;
    toDelete.push(existingRealPath);   // delete old real PDF from storage
  }

  // ── Guard: at least one PDF must remain after the update ──────────────────
  const finalDemoUrl = "demoUrl" in data
    ? (data.demoUrl as string | null)
    : (existing.demoUrl ?? null);

  const finalRealUrl = "realUrl" in data
    ? (data.realUrl as string | null)
    : (existing.realUrl ?? existing.fileUrl ?? null);

  if (!finalDemoUrl && !finalRealUrl)
    return NextResponse.json(
      { error: "At least one PDF (demo or real) must remain" },
      { status: 400 }
    );

  // ── Persist ────────────────────────────────────────────────────────────────
  try {
    const paper = await prisma.testPaper.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true } },
        _count:   { select: { purchases: true } },
      },
    });

    await removeFromStorage(toDelete);
    return NextResponse.json({ paper });
  } catch (e) {
    console.error("PATCH test-paper error:", e);
    return NextResponse.json(
      { error: "Failed to update test paper" },
      { status: 500 }
    );
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;

  const existing = await prisma.testPaper.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Test paper not found" }, { status: 404 });

  await prisma.testPaper.delete({ where: { id } });

  // Remove both demo and real PDFs from storage on full delete
  await removeFromStorage([
    existing.demoPath,
    existing.realPath ?? existing.filePath,
  ]);

  return NextResponse.json({ success: true });
}