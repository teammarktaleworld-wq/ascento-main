// app/api/admin/notes/test-papers/test-paper-categories/route.ts
// GET  /api/admin/test-paper-categories
// POST /api/admin/test-paper-categories

import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const categories = await prisma.testPaperCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { papers: true } } },
  });

  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  let body: { name?: string; description?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { name, description = "" } = body;
  if (!name?.trim())
    return NextResponse.json({ error: "name is required" }, { status: 400 });

  try {
    const category = await prisma.testPaperCategory.create({
      data: { name: name.trim(), description: description.trim() },
      include: { _count: { select: { papers: true } } },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002")
      return NextResponse.json({ error: "Category name already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// app/api/admin/test-paper-categories/[id]/route.ts

// PATCH  /api/admin/test-paper-categories/[id]
// DELETE /api/admin/test-paper-categories/[id]

// (Put in separate file in your project — included here for brevity)
export async function PATCH_ID(
  req: Request,
  id: string
) {
  let body: { name?: string; description?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { name, description } = body;
  const data: Record<string, string> = {};
  if (name?.trim())              data.name        = name.trim();
  if (description !== undefined) data.description = description.trim();

  try {
    const category = await prisma.testPaperCategory.update({
      where: { id },
      data,
      include: { _count: { select: { papers: true } } },
    });
    return NextResponse.json({ category });
  } catch (e: any) {
    if (e.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (e.code === "P2002") return NextResponse.json({ error: "Name already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE_ID(id: string) {
  // Unlink papers from this category before deleting
  await prisma.testPaper.updateMany({
    where: { categoryId: id },
    data:  { categoryId: null },
  });

  try {
    await prisma.testPaperCategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}