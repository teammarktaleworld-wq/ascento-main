// src/app/api/admin/homework-files/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "homework-files";

// ─── PATCH /api/admin/homework-files/[id] ────────────────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;

  let body: {
    title?: string;
    label?: string;
    serialId?: number;
    fileUrl?: string;
    storagePath?: string;
    fileType?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, label, serialId, fileUrl, storagePath, fileType } = body;

  if (fileType && fileType !== "pdf" && fileType !== "image") {
    return NextResponse.json(
      { error: "fileType must be 'pdf' or 'image'" },
      { status: 400 }
    );
  }

  try {
    // If a new file is being set, delete the old one from storage
    if (storagePath) {
      const existing = await prisma.homeworkFile.findUnique({ where: { id } });
      if (existing && existing.storagePath !== storagePath) {
        await supabase.storage.from(BUCKET).remove([existing.storagePath]);
      }
    }

    const homeworkFile = await prisma.homeworkFile.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(label !== undefined && { label: label.trim() }),
        ...(serialId !== undefined && { serialId }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(storagePath !== undefined && { storagePath }),
        ...(fileType !== undefined && { fileType }),
      },
    });

    return NextResponse.json({ success: true, homeworkFile });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── DELETE /api/admin/homework-files/[id] ───────────────────────────────────
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;

  try {
    const existing = await prisma.homeworkFile.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete from Supabase Storage first
    await supabase.storage.from(BUCKET).remove([existing.storagePath]);

    // Then delete from DB
    await prisma.homeworkFile.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}