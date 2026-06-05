









import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { createClient } from "@supabase/supabase-js";
import { NoteType } from "@prisma/client";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "notes-pdfs";

// ─── GET /api/admin/notes/[id] ────────────────────────────────────────────────
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;
  const note = await prisma.note.findUnique({
    where: { id },
    include: { category: { select: { id: true, name: true } } },
  });
  if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });
  return NextResponse.json({ note });
}

// ─── PATCH /api/admin/notes/[id] ─────────────────────────────────────────────
// Receives JSON metadata. If a new PDF was uploaded client-side, pass the new
// pdfUrl + storagePath and the server deletes the old file from storage.
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;

  const existing = await prisma.note.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Note not found" }, { status: 404 });

  let body: {
    title?: string;
    label?: string;
    type?: string;
    serialId?: number;
    pdfUrl?: string;
    storagePath?: string;
    categoryId?: string | null;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, label, type: rawType, serialId, pdfUrl, storagePath, categoryId } = body;

  if (rawType && rawType !== "DEMO" && rawType !== "REAL")
    return NextResponse.json({ error: "type must be DEMO or REAL" }, { status: 400 });

  // Validate categoryId exists if a non-null value is provided
  if (categoryId) {
    const cat = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!cat)
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const updateData: {
    title?: string;
    label?: string;
    type?: NoteType;
    serialId?: number;
    pdfUrl?: string;
    storagePath?: string;
    categoryId?: string | null;
  } = {};

  if (title?.trim()) updateData.title = title.trim();
  if (label !== undefined) updateData.label = label.trim();
  if (rawType) updateData.type = rawType as NoteType;
  if (serialId && serialId > 0) updateData.serialId = serialId;

  // categoryId: explicitly set to null (unassign) or a new string (assign)
  // Only update if the key was present in the request body
  if ("categoryId" in body) {
    updateData.categoryId = categoryId ?? null;
  }

  // New PDF was uploaded client-side — update URLs and delete old file
  const hasNewPdf = !!(pdfUrl && storagePath && storagePath !== existing.storagePath);
  if (hasNewPdf) {
    updateData.pdfUrl = pdfUrl;
    updateData.storagePath = storagePath;
  }

  try {
    const note = await prisma.note.update({
      where: { id },
      data: updateData,
      include: { category: { select: { id: true, name: true } } },
    });

    // Delete old PDF from Supabase Storage after successful DB update
    if (hasNewPdf && existing.storagePath) {
      const { error: storageErr } = await supabaseAdmin.storage
        .from(BUCKET)
        .remove([existing.storagePath]);
      if (storageErr) console.error("Old PDF delete warning:", storageErr.message);
    }

    return NextResponse.json({ note });
  } catch (dbErr) {
    console.error("DB update error:", dbErr);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

// ─── DELETE /api/admin/notes/[id] ─────────────────────────────────────────────
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;
  const existing = await prisma.note.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Note not found" }, { status: 404 });

  try {
    await prisma.note.delete({ where: { id } });
  } catch (dbErr) {
    console.error("DB delete error:", dbErr);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }

  if (existing.storagePath) {
    const { error: storageErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .remove([existing.storagePath]);
    if (storageErr) console.error("Storage delete warning:", storageErr.message);
  }

  return NextResponse.json({ success: true });
}