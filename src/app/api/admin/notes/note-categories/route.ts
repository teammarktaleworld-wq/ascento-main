// app/api/admin/notes/note-categories/route.ts
// GET  /api/admin/note-categories
// POST /api/admin/note-categories

import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const categories = await prisma.noteCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { notes: true } } },
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
    const category = await prisma.noteCategory.create({
      data: { name: name.trim(), description: description.trim() },
      include: { _count: { select: { notes: true } } },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002")
      return NextResponse.json({ error: "Category name already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}