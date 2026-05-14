









// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";
// import { createClient } from "@supabase/supabase-js";
// import { NoteType } from "@prisma/client";

// const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// const BUCKET = "notes-pdfs";

// async function ensureBucket(): Promise<string | null> {
//   const { data: buckets, error: listErr } = await supabaseAdmin.storage.listBuckets();
//   if (listErr) return `Failed to list buckets: ${listErr.message}`;
//   const exists = buckets?.some((b) => b.name === BUCKET);
//   if (exists) return null;
//   const { error: createErr } = await supabaseAdmin.storage.createBucket(BUCKET, {
//     public: true,
//     fileSizeLimit: 52428800,
//     allowedMimeTypes: ["application/pdf"],
//   });
//   if (createErr) return `Failed to create bucket "${BUCKET}": ${createErr.message}`;
//   return null;
// }

// // ─── GET /api/admin/notes/[id] ────────────────────────────────────────────────
// export async function GET(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { id } = await context.params;

//   const note = await prisma.note.findUnique({ where: { id } });
//   if (!note) {
//     return NextResponse.json({ error: "Note not found" }, { status: 404 });
//   }
//   return NextResponse.json({ note });
// }

// // ─── PATCH /api/admin/notes/[id] ─────────────────────────────────────────────
// export async function PATCH(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   // ✅ Always await params in Next.js 15
//   const { id } = await context.params;

//   const existing = await prisma.note.findUnique({ where: { id } });
//   if (!existing) {
//     return NextResponse.json({ error: "Note not found" }, { status: 404 });
//   }

//   let formData: FormData;
//   try {
//     formData = await req.formData();
//   } catch {
//     return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
//   }

//   const file = formData.get("file") as File | null;
//   const title = (formData.get("title") as string | null)?.trim();
//   const label = (formData.get("label") as string | null)?.trim();
//   const rawType = (formData.get("type") as string | null)?.toUpperCase();
//   const rawSerialId = formData.get("serialId");
//   const serialId = rawSerialId ? Number(rawSerialId) : undefined;

//   if (rawType && rawType !== "DEMO" && rawType !== "REAL") {
//     return NextResponse.json({ error: "type must be DEMO or REAL" }, { status: 400 });
//   }
//   if (file && file.size > 0 && file.type !== "application/pdf") {
//     return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
//   }

//   const updateData: {
//     title?: string;
//     label?: string;
//     type?: NoteType;
//     serialId?: number;
//     pdfUrl?: string;
//     storagePath?: string;
//   } = {};

//   if (title) updateData.title = title;
//   if (label !== undefined) updateData.label = label;
//   if (rawType) updateData.type = rawType as NoteType;
//   if (serialId && serialId > 0) updateData.serialId = serialId;

//   let newStoragePath: string | null = null;

//   // Only upload if a real non-empty file was provided
//   if (file && file.size > 0) {
//     const bucketErr = await ensureBucket();
//     if (bucketErr) {
//       return NextResponse.json(
//         { error: `Storage bucket error: ${bucketErr}` },
//         { status: 500 }
//       );
//     }

//     const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
//     newStoragePath = `${Date.now()}-${safeName}`;

//     const arrayBuffer = await file.arrayBuffer();
//     const { error: uploadError } = await supabaseAdmin.storage
//       .from(BUCKET)
//       .upload(newStoragePath, new Uint8Array(arrayBuffer), {
//         contentType: "application/pdf",
//         upsert: false,
//       });

//     if (uploadError) {
//       console.error("Storage upload error:", uploadError);
//       return NextResponse.json(
//         { error: `PDF upload failed: ${uploadError.message}` },
//         { status: 500 }
//       );
//     }

//     const { data: urlData } = supabaseAdmin.storage
//       .from(BUCKET)
//       .getPublicUrl(newStoragePath);

//     updateData.pdfUrl = urlData.publicUrl;
//     updateData.storagePath = newStoragePath;
//   }

//   try {
//     const note = await prisma.note.update({
//       where: { id },
//       data: updateData,
//     });

//     // Delete old PDF from storage only after DB update succeeds
//     if (newStoragePath && existing.storagePath) {
//       await supabaseAdmin.storage.from(BUCKET).remove([existing.storagePath]);
//     }

//     return NextResponse.json({ note });
//   } catch (dbErr) {
//     console.error("Note DB update error:", dbErr);
//     if (newStoragePath) {
//       await supabaseAdmin.storage.from(BUCKET).remove([newStoragePath]);
//     }
//     return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
//   }
// }

// // ─── DELETE /api/admin/notes/[id] ─────────────────────────────────────────────
// export async function DELETE(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { id } = await context.params;

//   const existing = await prisma.note.findUnique({ where: { id } });
//   if (!existing) {
//     return NextResponse.json({ error: "Note not found" }, { status: 404 });
//   }

//   try {
//     await prisma.note.delete({ where: { id } });
//   } catch (dbErr) {
//     console.error("Note DB delete error:", dbErr);
//     return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
//   }

//   if (existing.storagePath) {
//     const { error: storageErr } = await supabaseAdmin.storage
//       .from(BUCKET)
//       .remove([existing.storagePath]);
//     if (storageErr) {
//       console.error("Storage delete warning:", storageErr.message);
//     }
//   }

//   return NextResponse.json({ success: true });
// }






import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { createClient } from "@supabase/supabase-js";
import { NoteType } from "@prisma/client";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "notes-pdfs";

export const maxDuration = 60;

async function ensureBucket(): Promise<string | null> {
  const { data: buckets, error: listErr } = await supabaseAdmin.storage.listBuckets();
  if (listErr) return `Failed to list buckets: ${listErr.message}`;
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (exists) return null;
  const { error: createErr } = await supabaseAdmin.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 52428800,
    allowedMimeTypes: ["application/pdf"],
  });
  if (createErr) return `Failed to create bucket "${BUCKET}": ${createErr.message}`;
  return null;
}

// ─── GET /api/admin/notes/[id] ────────────────────────────────────────────────
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;
  const { id } = await context.params;
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });
  return NextResponse.json({ note });
}

// ─── PATCH /api/admin/notes/[id] ─────────────────────────────────────────────
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;

  const existing = await prisma.note.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Note not found" }, { status: 404 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const title = formData.get("title")?.toString().trim();
  const label = formData.get("label")?.toString().trim();
  const rawType = formData.get("type")?.toString().toUpperCase();
  const rawSerialId = formData.get("serialId");
  const serialId = rawSerialId ? Number(rawSerialId) : undefined;

  if (rawType && rawType !== "DEMO" && rawType !== "REAL")
    return NextResponse.json({ error: "type must be DEMO or REAL" }, { status: 400 });
  if (file && file.size > 0 && file.type !== "application/pdf")
    return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });

  const updateData: {
    title?: string; label?: string; type?: NoteType;
    serialId?: number; pdfUrl?: string; storagePath?: string;
  } = {};

  if (title) updateData.title = title;
  if (label !== undefined) updateData.label = label;
  if (rawType) updateData.type = rawType as NoteType;
  if (serialId && serialId > 0) updateData.serialId = serialId;

  let newStoragePath: string | null = null;

  if (file && file.size > 0) {
    const bucketErr = await ensureBucket();
    if (bucketErr)
      return NextResponse.json({ error: `Storage error: ${bucketErr}` }, { status: 500 });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    newStoragePath = `notes/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(newStoragePath, await file.arrayBuffer(), {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: `PDF upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(newStoragePath);
    updateData.pdfUrl = urlData.publicUrl;
    updateData.storagePath = newStoragePath;
  }

  try {
    const note = await prisma.note.update({ where: { id }, data: updateData });

    // Delete old PDF after successful DB update
    if (newStoragePath && existing.storagePath) {
      await supabaseAdmin.storage.from(BUCKET).remove([existing.storagePath]);
    }

    return NextResponse.json({ note });
  } catch (dbErr) {
    console.error("DB update error:", dbErr);
    if (newStoragePath)
      await supabaseAdmin.storage.from(BUCKET).remove([newStoragePath]);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

// ─── DELETE /api/admin/notes/[id] ─────────────────────────────────────────────
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;
  const existing = await prisma.note.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Note not found" }, { status: 404 });

  try {
    await prisma.note.delete({ where: { id } });
  } catch (dbErr) {
    console.error("DB delete error:", dbErr);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }

  if (existing.storagePath) {
    const { error: storageErr } = await supabaseAdmin.storage
      .from(BUCKET).remove([existing.storagePath]);
    if (storageErr) console.error("Storage delete warning:", storageErr.message);
  }

  return NextResponse.json({ success: true });
}