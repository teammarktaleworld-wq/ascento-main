// app/api/admin/timetable-uploads/[id]/route.ts
// Mirrors notes/[id]/route.ts DELETE pattern exactly

import { NextResponse } from "next/server";
import { prisma }       from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "timetable-uploads";

// ─── DELETE /api/admin/timetable-uploads/:id ─────────────────────────────────

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;

  const existing = await prisma.timetableUpload.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Upload not found" }, { status: 404 });

  // Delete DB record first (mirrors notes DELETE)
  try {
    await prisma.timetableUpload.delete({ where: { id } });
  } catch (dbErr) {
    console.error("DB delete error:", dbErr);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }

  // Then remove file from Supabase Storage
  if (existing.storagePath) {
    const { error: storageErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .remove([existing.storagePath]);
    if (storageErr)
      console.error("Storage delete warning:", storageErr.message);
  }

  return NextResponse.json({ success: true });
}