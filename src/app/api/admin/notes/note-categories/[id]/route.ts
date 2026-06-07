// app/api/admin/notes/note-categories/[id]/route.ts
// PATCH  /api/admin/note-categories/[id]
// DELETE /api/admin/note-categories/[id]

import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;
  let body: { name?: string; description?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { name, description } = body;
  const data: Record<string, string> = {};
  if (name?.trim())          data.name        = name.trim();
  if (description !== undefined) data.description = description.trim();

  try {
    const category = await prisma.noteCategory.update({
      where: { id },
      data,
      include: { _count: { select: { notes: true } } },
    });
    return NextResponse.json({ category });
  } catch (e: any) {
    if (e.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (e.code === "P2002") return NextResponse.json({ error: "Name already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;

  // Unlink notes from this category instead of blocking
  await prisma.note.updateMany({
    where: { categoryId: id },
    data:  { categoryId: null },
  });

  try {
    await prisma.noteCategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}