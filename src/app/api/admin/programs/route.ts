// app/api/admin/programs/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

// GET /api/admin/pronext-roll-number/route.tsgrams — list all programs with their levels
export async function GET(req: NextRequest) {
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      levels: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
      _count: { select: { students: true } },
    },
  });
  return NextResponse.json({ programs });
}

// POST /api/admin/programs — create a program
export async function POST(req: NextRequest) {
  const err = await requireAdmin(req);
  if (err) return err;

  const body = await req.json();
  const { name, description, hasLevels, sortOrder } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Program name is required" }, { status: 400 });
  }

  try {
    const program = await prisma.program.create({
      data: {
        name: name.trim(),
        description: description ?? null,
        hasLevels: hasLevels ?? false,
        sortOrder: sortOrder ?? 0,
      },
      include: { levels: true },
    });
    return NextResponse.json(program, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "A program with this name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create program" }, { status: 500 });
  }
}