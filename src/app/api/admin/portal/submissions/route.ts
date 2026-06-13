// src/app/api/admin/portal/submissions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function GET(req: NextRequest) {
  try {
   // WITH:
const authError = await requireAdmin(req);
if (authError) return authError;
    const { searchParams } = new URL(req.url);
    const paperId    = searchParams.get("paperId");
    const status     = searchParams.get("status");
    const take       = Number(searchParams.get("take") ?? 200);
    const skip       = Number(searchParams.get("skip") ?? 0);

    const where: any = {};
    if (paperId) where.paperId = paperId;
    if (status)  where.status  = status;

    const [submissions, total] = await Promise.all([
      prisma.portalRegistration.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
        include: {
          user: { select: { name: true, email: true, phone: true } },
          paper: {
            select: {
              title: true,
              passingMarks: true,
              category: { select: { name: true } },
            },
          },
        },
      }),
      prisma.portalRegistration.count({ where }),
    ]);

    return NextResponse.json({ submissions, total });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}