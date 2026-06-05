// app/api/admin/announcements/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin }              from "@/lib/helpers/auth-helpers";
import { createClient }              from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const BUCKET   = "announcements";
const ALLOWED_MIME = [
  "application/pdf",
  "image/jpeg", "image/png", "image/webp", "image/gif",
];

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 413 });

    if (!ALLOWED_MIME.includes(file.type))
      return NextResponse.json({ error: "Only PDF and images are allowed" }, { status: 415 });

    const ext         = file.name.split(".").pop() ?? "bin";
    const storagePath = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer      = Buffer.from(await file.arrayBuffer());

    const { error: uploadErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert:      false,
      });

    if (uploadErr)
      return NextResponse.json({ error: uploadErr.message }, { status: 500 });

    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      fileUrl:     urlData.publicUrl,
      storagePath,
      fileType:    file.type.startsWith("image/") ? "image" : "pdf",
      fileName:    file.name,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}