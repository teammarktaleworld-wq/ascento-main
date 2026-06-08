// app/api/admin/notes/purchases/route.ts
// GET /api/admin/notes/purchases — paginated list of all purchases for admin

import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const search     = searchParams.get("search")?.trim() ?? "";
  const typeFilter = searchParams.get("type")           ?? ""; // "note" | "paper"
  const page       = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit      = Math.min(100, Number(searchParams.get("limit") ?? 50));

  const where: any = {};

  if (search) {
    where.OR = [
      { user:      { name:  { contains: search, mode: "insensitive" } } },
      { user:      { email: { contains: search, mode: "insensitive" } } },
      { note:      { title: { contains: search, mode: "insensitive" } } },
      { testPaper: { title: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (typeFilter === "note")  where.noteId      = { not: null };
  if (typeFilter === "paper") where.testPaperId = { not: null };

  const [purchases, total] = await Promise.all([
    prisma.purchase.findMany({
      where,
      skip:    (page - 1) * limit,
      take:    limit,
      orderBy: { purchasedAt: "desc" },
      include: {
        user:      { select: { id: true, name: true, email: true } },
        note:      { select: { id: true, title: true } },
        testPaper: { select: { id: true, title: true } },
        coupon:    { select: { id: true, code: true } },
      },
    }),
    prisma.purchase.count({ where }),
  ]);

  return NextResponse.json({ purchases, total, page, limit });
}