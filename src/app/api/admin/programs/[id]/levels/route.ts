// app/api/admin/programs/[id]/levels/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

// GET /api/admin/programs/:id/levels
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const levels = await prisma.programLevel.findMany({
    where: { programId: id, isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { students: true } } },
  });
  return NextResponse.json({ levels });
}

// POST /api/admin/programs/:id/levels
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;
  const body = await req.json();
  const { name, sortOrder } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Level name is required" }, { status: 400 });
  }

  try {
    const level = await prisma.programLevel.create({
      data: {
        programId: id,
        name: name.trim(),
        sortOrder: sortOrder ?? 0,
      },
    });
    return NextResponse.json(level, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "A level with this name already exists in this program" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create level" }, { status: 500 });
  }
}


// ── app/api/admin/programs/[id]/levels/[levelId]/route.ts ────────────────────
// (Put this in a separate file: levels/[levelId]/route.ts)

// PATCH /api/admin/programs/:id/levels/:levelId
export async function PATCH_LEVEL(levelId: string, body: any) {
  return prisma.programLevel.update({
    where: { id: levelId },
    data: {
      name:      body.name      ?? undefined,
      sortOrder: body.sortOrder ?? undefined,
      isActive:  body.isActive  ?? undefined,
    },
  });
}

// DELETE /api/admin/programs/:id/levels/:levelId  (soft delete)
export async function DELETE_LEVEL(levelId: string) {
  const count = await prisma.student.count({ where: { programLevelId: levelId } });
  if (count > 0) throw new Error(`${count} student(s) enrolled at this level`);
  return prisma.programLevel.update({ where: { id: levelId }, data: { isActive: false } });
}