import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

// GET — all students with parent info
export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const students = await prisma.student.findMany({
    select: {
      id: true,
      fullName: true,
      parentName: true,
      parentPhone: true,
      parentEmail: true,
      enrollments: {
        take: 1,
        include: { section: { include: { class: true } } },
      },
    },
    where: { parentName: { not: null } },
    orderBy: { fullName: "asc" },
  });
  return NextResponse.json(students);
}