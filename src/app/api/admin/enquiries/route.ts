import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: true },
  });
  return NextResponse.json(enquiries);
}

export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const body = await req.json();
  const enquiry = await prisma.enquiry.create({
    data: {
      studentName: body.studentName,
      email: body.email,
      phone: body.phone,
      course: body.course,
      source: body.source,
      message: body.message,
      status: "New",
      createdById: body.createdById,
    },
  });
  return NextResponse.json(enquiry, { status: 201 });
}