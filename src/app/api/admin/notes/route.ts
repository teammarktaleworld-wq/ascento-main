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

// // ─── GET /api/admin/notes ─────────────────────────────────────────────────────
// // Query params:
// //   ?type=DEMO|REAL   (optional filter)
// //   ?search=          (search title / label)
// //   ?page=1&limit=50
// export async function GET(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { searchParams } = new URL(req.url);
//   const type = searchParams.get("type")?.toUpperCase() as NoteType | null;
//   const search = searchParams.get("search") ?? "";
//   const page = Math.max(1, Number(searchParams.get("page") ?? 1));
//   const limit = Math.min(100, Number(searchParams.get("limit") ?? 50));

//   const where = {
//     ...(type && (type === "DEMO" || type === "REAL") ? { type } : {}),
//     ...(search
//       ? {
//           OR: [
//             { title: { contains: search, mode: "insensitive" as const } },
//             { label: { contains: search, mode: "insensitive" as const } },
//           ],
//         }
//       : {}),
//   };

//   const [notes, total] = await Promise.all([
//     prisma.note.findMany({
//       where,
//       skip: (page - 1) * limit,
//       take: limit,
//       orderBy: { serialId: "asc" },
//     }),
//     prisma.note.count({ where }),
//   ]);

//   return NextResponse.json({ notes, total, page, limit });
// }

// // ─── POST /api/admin/notes ────────────────────────────────────────────────────
// // Accepts multipart/form-data:
// //   file       File   (PDF, required)
// //   title      string (required)
// //   label      string (optional)
// //   type       DEMO | REAL (required)
// //   serialId   number (required)
// export async function POST(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   let formData: FormData;
//   try {
//     formData = await req.formData();
//   } catch {
//     return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
//   }

//   const file = formData.get("file") as File | null;
//   const title = (formData.get("title") as string | null)?.trim();
//   const label = ((formData.get("label") as string | null) ?? "").trim();
//   const rawType = (formData.get("type") as string | null)?.toUpperCase();
//   const serialId = Number(formData.get("serialId") ?? 0);

//   // ── Validation ──────────────────────────────────────────────────────────────
//   if (!title) {
//     return NextResponse.json({ error: "title is required" }, { status: 400 });
//   }
//   if (rawType !== "DEMO" && rawType !== "REAL") {
//     return NextResponse.json(
//       { error: "type must be DEMO or REAL" },
//       { status: 400 }
//     );
//   }
//   if (!serialId || serialId < 1) {
//     return NextResponse.json(
//       { error: "serialId must be a positive integer" },
//       { status: 400 }
//     );
//   }
//   if (!file || file.type !== "application/pdf") {
//     return NextResponse.json(
//       { error: "A valid PDF file is required" },
//       { status: 400 }
//     );
//   }

//   const type = rawType as NoteType;

//   // ── Upload PDF to Supabase Storage ──────────────────────────────────────────
//   const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
//   const storagePath = `${Date.now()}-${safeName}`;

//   const arrayBuffer = await file.arrayBuffer();

//   const { error: uploadError } = await supabaseAdmin.storage
//     .from(BUCKET)
//     .upload(storagePath, new Uint8Array(arrayBuffer), {
//       contentType: "application/pdf",
//       upsert: false,
//     });

//   if (uploadError) {
//     console.error("Storage upload error:", uploadError);
//     return NextResponse.json(
//       { error: `PDF upload failed: ${uploadError.message}` },
//       { status: 500 }
//     );
//   }

//   const { data: urlData } = supabaseAdmin.storage
//     .from(BUCKET)
//     .getPublicUrl(storagePath);
//     console.log("PUBLIC URL:", urlData.publicUrl);
// console.log("PROJECT URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

//   // ── Save to DB ──────────────────────────────────────────────────────────────
//   try {
//     const note = await prisma.note.create({
//       data: {
//         serialId,
//         title,
//         label,
//         type,
//         pdfUrl: urlData.publicUrl,
//         storagePath,
//       },
//     });

//     return NextResponse.json({ note }, { status: 201 });
//   } catch (dbErr) {
//     console.error("Note DB create error:", dbErr);

//     // Rollback: remove uploaded PDF if DB save fails
//     await supabaseAdmin.storage.from(BUCKET).remove([storagePath]);

//     return NextResponse.json(
//       { error: "Failed to save note to database" },
//       { status: 500 }
//     );
//   }
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

// ── IMPORTANT: This must EXACTLY match the bucket name in your Supabase dashboard
// Go to Supabase → Storage → and copy the exact bucket name here.
// Common mistake: bucket might be "notes_pdfs" (underscore) not "notes-pdfs" (dash)
const BUCKET = "notes-pdfs";

/**
 * Ensures the storage bucket exists. Creates it if missing.
 * Call this before any upload operation.
 */
async function ensureBucket(): Promise<string | null> {
  // Check if bucket exists
  const { data: buckets, error: listErr } = await supabaseAdmin.storage.listBuckets();
  if (listErr) return `Failed to list buckets: ${listErr.message}`;

  const exists = buckets?.some((b) => b.name === BUCKET);
  if (exists) return null; // all good

  // Bucket doesn't exist — create it as a public bucket
  const { error: createErr } = await supabaseAdmin.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 52428800, // 50 MB
    allowedMimeTypes: ["application/pdf"],
  });

  if (createErr) return `Failed to create bucket "${BUCKET}": ${createErr.message}`;
  return null; // created successfully
}

// ─── GET /api/admin/notes ─────────────────────────────────────────────────────
export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type")?.toUpperCase() as NoteType | null;
  const search = searchParams.get("search") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Number(searchParams.get("limit") ?? 50));

  const where = {
    ...(type && (type === "DEMO" || type === "REAL") ? { type } : {}),
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
    }),
    prisma.note.count({ where }),
  ]);

  return NextResponse.json({ notes, total, page, limit });
}

// ─── POST /api/admin/notes ────────────────────────────────────────────────────
export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string | null)?.trim();
  const label = ((formData.get("label") as string | null) ?? "").trim();
  const rawType = (formData.get("type") as string | null)?.toUpperCase();
  const serialId = Number(formData.get("serialId") ?? 0);

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (rawType !== "DEMO" && rawType !== "REAL") {
    return NextResponse.json({ error: "type must be DEMO or REAL" }, { status: 400 });
  }
  if (!serialId || serialId < 1) {
    return NextResponse.json({ error: "serialId must be a positive integer" }, { status: 400 });
  }
  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "A valid PDF file is required" }, { status: 400 });
  }

  const type = rawType as NoteType;

  // ── Ensure bucket exists ────────────────────────────────────────────────────
  const bucketErr = await ensureBucket();
  if (bucketErr) {
    console.error("Bucket error:", bucketErr);
    return NextResponse.json(
      {
        error: `Storage bucket error: ${bucketErr}. Please create a public bucket named "${BUCKET}" in your Supabase dashboard under Storage.`,
      },
      { status: 500 }
    );
  }

  // ── Upload PDF to Supabase Storage ──────────────────────────────────────────
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${Date.now()}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(storagePath, new Uint8Array(arrayBuffer), {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return NextResponse.json(
      { error: `PDF upload failed: ${uploadError.message}` },
      { status: 500 }
    );
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  console.log("PUBLIC URL:", urlData.publicUrl);
  console.log("PROJECT URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  // ── Save to DB ──────────────────────────────────────────────────────────────
  try {
    const note = await prisma.note.create({
      data: {
        serialId,
        title,
        label,
        type,
        pdfUrl: urlData.publicUrl,
        storagePath,
      },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (dbErr) {
    console.error("Note DB create error:", dbErr);
    // Rollback: remove uploaded PDF if DB save fails
    await supabaseAdmin.storage.from(BUCKET).remove([storagePath]);
    return NextResponse.json({ error: "Failed to save note to database" }, { status: 500 });
  }
}