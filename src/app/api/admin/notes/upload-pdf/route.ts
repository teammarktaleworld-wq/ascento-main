// app/api/admin/notes/upload-pdf/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin";

// Accepts multipart/form-data with fields:
//   file   — the PDF File
//   bucket — Supabase storage bucket name
//   path   — storage path (e.g. "demo/1234.pdf")
// Returns: { url: string }

export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  try {
    const form   = await req.formData();
    const file   = form.get("file")   as File   | null;
    const bucket = form.get("bucket") as string | null;
    const path   = form.get("path")   as string | null;

    if (!file || !bucket || !path) {
      return NextResponse.json(
        { error: "file, bucket and path are all required." },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 415 });
    }

    const MAX_MB = 50;
    if (file.size > MAX_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File exceeds the ${MAX_MB} MB limit.` },
        { status: 413 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType:  "application/pdf",
        cacheControl: "3600",
        upsert:       true,          // overwrite if same path (e.g. re-upload)
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({ url: data.publicUrl, path }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Upload failed." }, { status: 500 });
  }
}