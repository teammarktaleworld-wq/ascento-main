










import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { NoteType } from "@prisma/client";

// ─── GET /api/admin/notes ─────────────────────────────────────────────────────
export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type")?.toUpperCase() as NoteType | null;
  const search = searchParams.get("search")?.trim() ?? "";
  const categoryId = searchParams.get("categoryId")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Number(searchParams.get("limit") ?? 50));

  const where = {
    ...(type && (type === "DEMO" || type === "REAL") ? { type } : {}),
    ...(categoryId === "uncategorized"
      ? { categoryId: null }
      : categoryId
      ? { categoryId }
      : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { label: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { serialId: "asc" },
      include: {
        category: { select: { id: true, name: true } },
      },
    }),
    prisma.note.count({ where }),
  ]);

  return NextResponse.json({ notes, total, page, limit });
}

// ─── POST /api/admin/notes ────────────────────────────────────────────────────
// Receives JSON metadata only — the PDF is uploaded directly from the browser
// to Supabase Storage (bypasses Vercel's 4.5MB function payload limit).
export async function POST(req: Request) {
  try {
    const err = await requireAdmin(req);
    if (err) return err;

    let body: {
      title?: string;
      label?: string;
      type?: string;
      serialId?: number;
      pdfUrl?: string;
      storagePath?: string;
      categoryId?: string | null;
    };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const {
      title,
      label = "",
      type: rawType,
      serialId,
      pdfUrl,
      storagePath,
      categoryId = null,
    } = body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!title?.trim())
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (rawType !== "DEMO" && rawType !== "REAL")
      return NextResponse.json({ error: "Type must be DEMO or REAL" }, { status: 400 });
    if (!serialId || serialId < 1)
      return NextResponse.json({ error: "serialId must be a positive integer" }, { status: 400 });
    if (!pdfUrl || !storagePath)
      return NextResponse.json({ error: "pdfUrl and storagePath are required" }, { status: 400 });

    // Validate categoryId exists if provided
    if (categoryId) {
      const cat = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!cat)
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const note = await prisma.note.create({
      data: {
        serialId,
        title: title.trim(),
        label: label.trim(),
        type: rawType as NoteType,
        pdfUrl,
        storagePath,
        ...(categoryId ? { categoryId } : {}),
      },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/notes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}