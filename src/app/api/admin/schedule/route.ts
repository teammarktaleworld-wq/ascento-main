import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

// GET /api/admin/schedule?sectionId=&dayOfWeek=monday
export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get("sectionId");
  const dayOfWeek = searchParams.get("dayOfWeek");

  const where: any = {};
  if (sectionId) where.sectionId = sectionId;
  if (dayOfWeek) where.dayOfWeek = dayOfWeek;

  const slots = await prisma.timetableSlot.findMany({
    where,
    include: {
      subject: true,
      teacher: { include: { user: true } },
      section: { include: { class: { include: { domain: true } } } },
    },
    orderBy: [{ dayOfWeek: "asc" }, { periodNumber: "asc" }],
  });
  return NextResponse.json(slots);
}

// POST /api/admin/schedule — upsert a slot
export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const body = await req.json();
  const slot = await prisma.timetableSlot.upsert({
    where: {
      sectionId_dayOfWeek_periodNumber: {
        sectionId: body.sectionId,
        dayOfWeek: body.dayOfWeek,
        periodNumber: body.periodNumber,
      },
    },
    update: { subjectId: body.subjectId, teacherId: body.teacherId },
    create: {
      sectionId: body.sectionId,
      dayOfWeek: body.dayOfWeek,
      periodNumber: body.periodNumber,
      subjectId: body.subjectId,
      teacherId: body.teacherId,
    },
    include: { subject: true, teacher: { include: { user: true } } },
  });
  return NextResponse.json(slot, { status: 201 });
}