// app/api/admin/notes/coupons/route.ts
// GET  /api/admin/coupons   — list all coupons (with filters)
// POST /api/admin/coupons   — create coupon

import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { CouponScope } from "@prisma/client";

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const scope       = searchParams.get("scope")      as CouponScope | null;
  const noteId      = searchParams.get("noteId")     ?? "";
  const testPaperId = searchParams.get("testPaperId") ?? "";
  const activeOnly  = searchParams.get("active") === "true";

  const where: Record<string, unknown> = {};
  if (scope)        where.scope       = scope;
  if (noteId)       where.noteId      = noteId;
  if (testPaperId)  where.testPaperId = testPaperId;
  if (activeOnly)   where.isActive    = true;

  const coupons = await prisma.coupon.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      note:      { select: { id: true, title: true } },
      testPaper: { select: { id: true, title: true } },
      _count:    { select: { purchases: true } },
    },
  });

  return NextResponse.json({ coupons });
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  let body: {
    code?:            string;
    discountPercent?: number;
    scope?:           CouponScope;
    noteId?:          string | null;
    testPaperId?:     string | null;
    maxUses?:         number | null;
    expiresAt?:       string | null;
    isActive?:        boolean;
  };

  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const {
    code,
    discountPercent,
    scope       = "global",
    noteId      = null,
    testPaperId = null,
    maxUses     = null,
    expiresAt   = null,
    isActive    = true,
  } = body;

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!code?.trim())
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  if (!discountPercent || discountPercent < 1 || discountPercent > 100)
    return NextResponse.json({ error: "discountPercent must be 1–100" }, { status: 400 });

  if (scope === "note" && !noteId)
    return NextResponse.json({ error: "noteId required for scope=note" }, { status: 400 });
  if (scope === "test_paper" && !testPaperId)
    return NextResponse.json({ error: "testPaperId required for scope=test_paper" }, { status: 400 });

  // Validate referenced items exist
  if (noteId) {
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }
  if (testPaperId) {
    const paper = await prisma.testPaper.findUnique({ where: { id: testPaperId } });
    if (!paper) return NextResponse.json({ error: "Test paper not found" }, { status: 404 });
  }

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code:            code.trim().toUpperCase(),
        discountPercent,
        scope:           scope as CouponScope,
        noteId:          scope === "note"       ? noteId      : null,
        testPaperId:     scope === "test_paper" ? testPaperId : null,
        maxUses,
        expiresAt:       expiresAt ? new Date(expiresAt) : null,
        isActive,
      },
      include: {
        note:      { select: { id: true, title: true } },
        testPaper: { select: { id: true, title: true } },
      },
    });
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002")
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}