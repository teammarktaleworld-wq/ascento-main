// src/app/api/admin/portal/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function GET(req: NextRequest) {
    try {
      // WITH:
      const authError = await requireAdmin(req);
      if (authError) return authError;


    const categories = await prisma.portalCategory.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { portalPapers: true } } },
    });
    return NextResponse.json({ categories });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
  // WITH:
const authError = await requireAdmin(req);
if (authError) return authError;
    const body = await req.json();
    const { name, description = "", slug } = body;

    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const finalSlug = slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const exists = await prisma.portalCategory.findFirst({ where: { OR: [{ name }, { slug: finalSlug }] } });
    if (exists) return NextResponse.json({ error: "A category with this name or slug already exists" }, { status: 400 });

    const category = await prisma.portalCategory.create({
      data: { name: name.trim(), description, slug: finalSlug },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}