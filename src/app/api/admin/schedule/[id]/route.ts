// app/api/admin/schedule/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

// ─── DELETE /api/admin/schedule/:id ───────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;

  const existing = await prisma.scheduleSlot.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Slot not found" }, { status: 404 });

  await prisma.scheduleSlot.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

// ─── PATCH /api/admin/schedule/:id ────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;

  const existing = await prisma.scheduleSlot.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Slot not found" }, { status: 404 });

  let body: any;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const updateData: any = {};
  if (body.dayOfWeek)    updateData.dayOfWeek    = body.dayOfWeek;
  if (body.periodNumber) updateData.periodNumber = body.periodNumber;
  if (body.startTime)    updateData.startTime    = body.startTime;
  if (body.endTime)      updateData.endTime      = body.endTime;
  if (body.subjectName)  updateData.subjectName  = body.subjectName.trim();
  if (body.teacherName)  updateData.teacherName  = body.teacherName.trim();
  if ("notes" in body)   updateData.notes        = body.notes?.trim() ?? null;
  if ("levelId" in body) updateData.levelId      = body.levelId ?? null;

  try {
    const slot = await prisma.scheduleSlot.update({
      where: { id },
      data: updateData,
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
    });
    return NextResponse.json({ slot });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json(
        { error: "That period/day combination is already occupied" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update slot" }, { status: 500 });
  }
}