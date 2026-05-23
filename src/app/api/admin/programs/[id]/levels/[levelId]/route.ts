// app/api/admin/programs/[id]/levels/[levelId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string; levelId: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { levelId } = await context.params;
  const body = await req.json();

  const level = await prisma.programLevel.update({
    where: { id: levelId },
    data: {
      name:      body.name      ?? undefined,
      sortOrder: body.sortOrder ?? undefined,
      isActive:  body.isActive  ?? undefined,
    },
  });
  return NextResponse.json(level);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string; levelId: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { levelId } = await context.params;

  const count = await prisma.student.count({ where: { programLevelId: levelId } });
  if (count > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${count} student(s) enrolled at this level` },
      { status: 409 }
    );
  }

  await prisma.programLevel.update({ where: { id: levelId }, data: { isActive: false } });
  return NextResponse.json({ success: true });
}