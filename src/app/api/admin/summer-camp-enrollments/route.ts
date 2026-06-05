import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

// GET — list all summer camp enrollments
export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const enrollments = await prisma.summerCampEnrollment.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(enrollments);
}

// DELETE — delete a summer camp enrollment by id (?id=...)
export async function DELETE(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.summerCampEnrollment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

// PATCH — update status of a summer camp enrollment (?id=...)
export async function PATCH(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const body = await req.json();
  const updated = await prisma.summerCampEnrollment.update({
    where: { id },
    data: { status: body.status },
  });
  return NextResponse.json(updated);
}