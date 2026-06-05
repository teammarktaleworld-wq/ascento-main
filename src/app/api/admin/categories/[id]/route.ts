import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;
  let body: { name?: string; description?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { name, description } = body;
  const data: { name?: string; description?: string } = {};
  if (name?.trim()) data.name = name.trim();
  if (description !== undefined) data.description = description.trim();

  try {
    const category = await prisma.category.update({
      where: { id },
      data,
      include: { _count: { select: { notes: true } } },
    });
    return NextResponse.json({ category });
  } catch (e: any) {
    if (e.code === "P2025")
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    if (e.code === "P2002")
      return NextResponse.json({ error: "Category name already exists" }, { status: 409 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;

  // Unlink notes from category before deleting
  await prisma.note.updateMany({
    where: { categoryId: id },
    data: { categoryId: null },
  });

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.code === "P2025")
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}