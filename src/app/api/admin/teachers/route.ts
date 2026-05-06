import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const teachers = await prisma.teacher.findMany({
    include: {
      user: true,
      subjects: { include: { subject: true } },
      timetableSlots: { include: { section: { include: { class: true } }, subject: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(teachers);
}

export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const body = await req.json();
  const { name, phone, experience, email, subjectIds } = body;

  let userId: string = body.userId;
  if (!userId && email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      userId = existing.id;
    } else {
      const u = await prisma.user.create({
        data: { id: crypto.randomUUID(), email, name },
      });
      userId = u.id;
    }
  }

  const teacher = await prisma.teacher.create({
    data: {
      userId,
      name,
      phone,
      experience,
      ...(subjectIds?.length
        ? { subjects: { create: subjectIds.map((sid: string) => ({ subjectId: sid })) } }
        : {}),
    },
    include: { user: true, subjects: { include: { subject: true } } },
  });
  return NextResponse.json(teacher, { status: 201 });
}