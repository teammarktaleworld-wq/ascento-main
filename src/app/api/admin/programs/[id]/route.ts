// app/api/admin/programs/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

// PATCH /api/admin/programs/:id
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;
  const body = await req.json();

  const program = await prisma.program.update({
    where: { id },
    data: {
      name:        body.name        ?? undefined,
      description: body.description ?? undefined,
      hasLevels:   body.hasLevels   ?? undefined,
      sortOrder:   body.sortOrder   ?? undefined,
      isActive:    body.isActive    ?? undefined,
    },
    include: { levels: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json(program);
}

// DELETE /api/admin/programs/:id  (soft delete)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;

  // Check if any students are enrolled
  const count = await prisma.student.count({ where: { programId: id } });
  if (count > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${count} student(s) enrolled in this program` },
      { status: 409 }
    );
  }

  await prisma.program.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ success: true });
}