






// app/api/admin/notes/[id]/route.ts


import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const BUCKET = "notes-pdfs";

async function removeFromStorage(paths: (string | null)[]) {
  const valid = paths.filter((p): p is string => !!p);
  if (!valid.length) return;
  const { error } = await supabase.storage.from(BUCKET).remove(valid);
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
  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      coupons:  true,
      _count:   { select: { purchases: true } },
    },
  });

  if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });
  return NextResponse.json({ note });
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;
  const existing = await prisma.note.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Note not found" }, { status: 404 });

  let body: {
    serialId?:       number;
    title?:          string;
    label?:          string;
    categoryId?:     string | null;
    price?:          number;
    discountPercent?: number | null;
    // Pass new URL+path to replace; omit or pass null to keep existing
    demoUrl?:        string | null;
    demoPath?:       string | null;
    realUrl?:        string | null;
    realPath?:       string | null;
    // Explicit flags to remove a version
    removeDemo?:     boolean;
    removeReal?:     boolean;
  };

  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const {
    serialId, title, label, categoryId,
    price, discountPercent,
    demoUrl, demoPath, realUrl, realPath,
    removeDemo = false, removeReal = false,
  } = body;

  // Validate
  if (price !== undefined && price < 0)
    return NextResponse.json({ error: "price must be >= 0" }, { status: 400 });
  if (discountPercent !== undefined && discountPercent !== null && (discountPercent < 1 || discountPercent > 100))
    return NextResponse.json({ error: "discountPercent must be 1–100" }, { status: 400 });
  if (categoryId) {
    const cat = await prisma.noteCategory.findUnique({ where: { id: categoryId } });
    if (!cat) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  // Build update payload
  const data: Record<string, unknown> = {};
  if (serialId !== undefined)        data.serialId        = serialId;
  if (title?.trim())                 data.title           = title.trim();
  if (label !== undefined)           data.label           = label.trim();
  if ("categoryId" in body)          data.categoryId      = categoryId ?? null;
  if (price !== undefined)           data.price           = price;
  if ("discountPercent" in body)     data.discountPercent = discountPercent ?? null;

  // Paths to delete from storage after DB update
  const toDelete: (string | null)[] = [];

  // Demo PDF handling
  if (removeDemo) {
    data.demoUrl  = null;
    data.demoPath = null;
    toDelete.push(existing.demoPath);
  } else if (demoUrl && demoPath && demoPath !== existing.demoPath) {
    data.demoUrl  = demoUrl;
    data.demoPath = demoPath;
    toDelete.push(existing.demoPath); // delete old
  }

  // Real PDF handling
  if (removeReal) {
    data.realUrl  = null;
    data.realPath = null;
    toDelete.push(existing.realPath);
  } else if (realUrl && realPath && realPath !== existing.realPath) {
    data.realUrl  = realUrl;
    data.realPath = realPath;
    toDelete.push(existing.realPath);
  }

  // Ensure at least one PDF will remain
  const finalDemoUrl = data.demoUrl !== undefined ? data.demoUrl : existing.demoUrl;
  const finalRealUrl = data.realUrl !== undefined ? data.realUrl : existing.realUrl;
  if (!finalDemoUrl && !finalRealUrl)
    return NextResponse.json({ error: "At least one of demo or real PDF must remain" }, { status: 400 });

  try {
    const note = await prisma.note.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true } },
        _count:   { select: { purchases: true } },
      },
    });

    await removeFromStorage(toDelete);
    return NextResponse.json({ note });
  } catch (e) {
    console.error("PATCH note error:", e);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
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
  const existing = await prisma.note.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Note not found" }, { status: 404 });

  // Purchases → SetNull (from schema), coupons → Cascade
  await prisma.note.delete({ where: { id } });

  await removeFromStorage([existing.demoPath, existing.realPath]);
  return NextResponse.json({ success: true });
}