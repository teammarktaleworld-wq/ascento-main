// app/api/admin/timetable-uploads/route.ts
//
// Mirrors notes/route.ts exactly:
//   GET  → list uploads (filtered by programId / levelId)
//   POST → receive base64 file + metadata, upload to Supabase Storage
//          via service-role key, then save DB record

import { NextResponse } from "next/server";
import { prisma }       from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { randomUUID }   from "crypto";
import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin"; // ← replaced


const BUCKET = "timetable-uploads";

// ─── GET /api/admin/timetable-uploads ────────────────────────────────────────

export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const programId = searchParams.get("programId") ?? undefined;
  const levelId   = searchParams.get("levelId")   ?? undefined;

  const where: Record<string, unknown> = {};
  if (programId) where.programId = programId;
  if (levelId)   where.levelId   = levelId;

  const uploads = await prisma.timetableUpload.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ uploads });
}

// ─── POST /api/admin/timetable-uploads ───────────────────────────────────────
// Body: { base64, fileName, mimeType, size, programId?, levelId? }

export async function POST(req: Request) {
  try {
    const err = await requireAdmin(req);
    if (err) return err;

    let body: {
      base64?:    string;
      fileName?:  string;
      mimeType?:  string;
      size?:      number;
      programId?: string | null;
      levelId?:   string | null;
    };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { base64, fileName, mimeType, size, programId = null, levelId = null } = body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!base64 || !fileName || !mimeType || !size) {
      return NextResponse.json(
        { error: "base64, fileName, mimeType and size are required" },
        { status: 400 }
      );
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(mimeType)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WebP and PDF files are allowed" },
        { status: 400 }
      );
    }

    if (size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 20 MB)" },
        { status: 413 }
      );
    }

    // ── Decode base64 → Buffer ────────────────────────────────────────────────
    const buffer = Buffer.from(base64, "base64");

    // ── Build storage path (mirrors notes: bucket/uuid.ext) ──────────────────
    const ext         = fileName.split(".").pop()?.toLowerCase() ?? "bin";
    const storagePath = `timetables/${randomUUID()}.${ext}`;

    // ── Upload to Supabase Storage (service-role, no signed URL needed) ───────
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError.message);
      return NextResponse.json(
        { error: "Storage upload failed" },
        { status: 500 }
      );
    }

    // ── Get public URL ────────────────────────────────────────────────────────
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    // ── Save metadata to DB ───────────────────────────────────────────────────
    const upload = await prisma.timetableUpload.create({
      data: {
        originalName: fileName,
        storagePath,
        url:      publicUrl,
        mimeType,
        size,
        programId: programId ?? null,
        levelId:   levelId   ?? null,
      },
    });

    return NextResponse.json({ upload }, { status: 201 });

  } catch (error) {
    console.error("POST /api/admin/timetable-uploads error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}