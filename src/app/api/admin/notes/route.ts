




// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";
// import { createClient } from "@supabase/supabase-js";
// import { NoteType } from "@prisma/client";

// const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// // ── IMPORTANT: This must EXACTLY match the bucket name in your Supabase dashboard
// // Go to Supabase → Storage → and copy the exact bucket name here.
// // Common mistake: bucket might be "notes_pdfs" (underscore) not "notes-pdfs" (dash)
// const BUCKET = "notes-pdfs";

// /**
//  * Ensures the storage bucket exists. Creates it if missing.
//  * Call this before any upload operation.
//  */
// async function ensureBucket(): Promise<string | null> {
//   // Check if bucket exists
//   const { data: buckets, error: listErr } = await supabaseAdmin.storage.listBuckets();
//   if (listErr) return `Failed to list buckets: ${listErr.message}`;

//   const exists = buckets?.some((b) => b.name === BUCKET);
//   if (exists) return null; // all good

//   // Bucket doesn't exist — create it as a public bucket
//   const { error: createErr } = await supabaseAdmin.storage.createBucket(BUCKET, {
//     public: true,
//     fileSizeLimit: 52428800, // 50 MB
//     allowedMimeTypes: ["application/pdf"],
//   });

//   if (createErr) return `Failed to create bucket "${BUCKET}": ${createErr.message}`;
//   return null; // created successfully
// }

// // ─── GET /api/admin/notes ─────────────────────────────────────────────────────
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
// // export async function POST(req: Request) {
// //   const err = await requireAdmin(req);
// //   if (err) return err;

// //   let formData: FormData;
// //   try {
// //     formData = await req.formData();
// //   } catch {
// //     return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
// //   }

// //   const file = formData.get("file") as File | null;
// //   const title = (formData.get("title") as string | null)?.trim();
// //   const label = ((formData.get("label") as string | null) ?? "").trim();
// //   const rawType = (formData.get("type") as string | null)?.toUpperCase();
// //   const serialId = Number(formData.get("serialId") ?? 0);

// //   // ── Validation ──────────────────────────────────────────────────────────────
// //   if (!title) {
// //     return NextResponse.json({ error: "title is required" }, { status: 400 });
// //   }
// //   if (rawType !== "DEMO" && rawType !== "REAL") {
// //     return NextResponse.json({ error: "type must be DEMO or REAL" }, { status: 400 });
// //   }
// //   if (!serialId || serialId < 1) {
// //     return NextResponse.json({ error: "serialId must be a positive integer" }, { status: 400 });
// //   }
// //   if (!file || file.type !== "application/pdf") {
// //     return NextResponse.json({ error: "A valid PDF file is required" }, { status: 400 });
// //   }

// //   const type = rawType as NoteType;

// //   // ── Ensure bucket exists ────────────────────────────────────────────────────
// //   const bucketErr = await ensureBucket();
// //   if (bucketErr) {
// //     console.error("Bucket error:", bucketErr);
// //     return NextResponse.json(
// //       {
// //         error: `Storage bucket error: ${bucketErr}. Please create a public bucket named "${BUCKET}" in your Supabase dashboard under Storage.`,
// //       },
// //       { status: 500 }
// //     );
// //   }

// //   // ── Upload PDF to Supabase Storage ──────────────────────────────────────────
// //   const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
// //   const storagePath = `${Date.now()}-${safeName}`;

// //   const arrayBuffer = await file.arrayBuffer();

// //   const { error: uploadError } = await supabaseAdmin.storage
// //     .from(BUCKET)
// //     .upload(storagePath, new Uint8Array(arrayBuffer), {
// //       contentType: "application/pdf",
// //       upsert: false,
// //     });

// //   if (uploadError) {
// //     console.error("Storage upload error:", uploadError);
// //     return NextResponse.json(
// //       { error: `PDF upload failed: ${uploadError.message}` },
// //       { status: 500 }
// //     );
// //   }

// //   const { data: urlData } = supabaseAdmin.storage
// //     .from(BUCKET)
// //     .getPublicUrl(storagePath);

// //   console.log("PUBLIC URL:", urlData.publicUrl);
// //   console.log("PROJECT URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

// //   // ── Save to DB ──────────────────────────────────────────────────────────────
// //   try {
// //     const note = await prisma.note.create({
// //       data: {
// //         serialId,
// //         title,
// //         label,
// //         type,
// //         pdfUrl: urlData.publicUrl,
// //         storagePath,
// //       },
// //     });

// //     return NextResponse.json({ note }, { status: 201 });
// //   } catch (dbErr) {
// //     console.error("Note DB create error:", dbErr);
// //     // Rollback: remove uploaded PDF if DB save fails
// //     await supabaseAdmin.storage.from(BUCKET).remove([storagePath]);
// //     return NextResponse.json({ error: "Failed to save note to database" }, { status: 500 });
// //   }
// // }





// // ─── POST /api/admin/notes ────────────────────────────────────────────────────
// export async function POST(req: Request) {
//   try {
//     const err = await requireAdmin(req);
//     if (err) return err;

//     let formData: FormData;

//     try {
//       formData = await req.formData();
//     } catch (e) {
//       console.error("FormData Parse Error:", e);

//       return NextResponse.json(
//         {
//           error:
//             "Invalid form-data request. Make sure you are uploading using multipart/form-data.",
//         },
//         { status: 400 }
//       );
//     }

//     const file = formData.get("file") as File | null;
//     const title = formData.get("title")?.toString().trim();
//     const label = formData.get("label")?.toString().trim() || "";
//     const rawType = formData.get("type")?.toString().toUpperCase();
//     const serialId = Number(formData.get("serialId"));

//     // ─── Validation ───────────────────────────────────────────────────────────
//     if (!title) {
//       return NextResponse.json(
//         { error: "Title is required" },
//         { status: 400 }
//       );
//     }

//     if (rawType !== "DEMO" && rawType !== "REAL") {
//       return NextResponse.json(
//         { error: "Type must be DEMO or REAL" },
//         { status: 400 }
//       );
//     }

//     if (!serialId || serialId < 1) {
//       return NextResponse.json(
//         { error: "SerialId must be a positive number" },
//         { status: 400 }
//       );
//     }

//     if (!file) {
//       return NextResponse.json(
//         { error: "PDF file is required" },
//         { status: 400 }
//       );
//     }

//     // ─── File Validation ──────────────────────────────────────────────────────
//     if (file.type !== "application/pdf") {
//       return NextResponse.json(
//         { error: "Only PDF files are allowed" },
//         { status: 400 }
//       );
//     }

//     // 50MB limit
//     const MAX_SIZE = 50 * 1024 * 1024;

//     if (file.size > MAX_SIZE) {
//       return NextResponse.json(
//         { error: "File size exceeds 50MB limit" },
//         { status: 413 }
//       );
//     }

//     const type = rawType as NoteType;

//     // ─── Ensure bucket exists ────────────────────────────────────────────────
//     const bucketErr = await ensureBucket();

//     if (bucketErr) {
//       console.error("Bucket Error:", bucketErr);

//       return NextResponse.json(
//         {
//           error: bucketErr,
//         },
//         { status: 500 }
//       );
//     }

//     // ─── Generate Safe File Name ─────────────────────────────────────────────
//     const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

//     const storagePath = `notes/${Date.now()}-${safeName}`;

//     // ─── Convert File ────────────────────────────────────────────────────────
//     const bytes = await file.arrayBuffer();

//     // ─── Upload to Supabase ──────────────────────────────────────────────────
//     const { error: uploadError } = await supabaseAdmin.storage
//       .from(BUCKET)
//       .upload(storagePath, bytes, {
//         contentType: "application/pdf",
//         upsert: false,
//       });

//     if (uploadError) {
//       console.error("Supabase Upload Error:", uploadError);

//       return NextResponse.json(
//         {
//           error: uploadError.message,
//         },
//         { status: 500 }
//       );
//     }

//     // ─── Public URL ──────────────────────────────────────────────────────────
//     const { data: publicUrlData } = supabaseAdmin.storage
//       .from(BUCKET)
//       .getPublicUrl(storagePath);

//     // ─── Save DB ─────────────────────────────────────────────────────────────
//     try {
//       const note = await prisma.note.create({
//         data: {
//           serialId,
//           title,
//           label,
//           type,
//           pdfUrl: publicUrlData.publicUrl,
//           storagePath,
//         },
//       });

//       return NextResponse.json(
//         {
//           success: true,
//           note,
//         },
//         { status: 201 }
//       );
//     } catch (dbError) {
//       console.error("DB Error:", dbError);

//       // rollback uploaded file
//       await supabaseAdmin.storage
//         .from(BUCKET)
//         .remove([storagePath]);

//       return NextResponse.json(
//         {
//           error: "Database save failed",
//         },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("POST /api/admin/notes ERROR:", error);

//     return NextResponse.json(
//       {
//         error: "Internal server error",
//       },
//       { status: 500 }
//     );
//   }
// }

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

// // ── CRITICAL: Tells Next.js to allow up to 52MB request bodies for this route.
// // Without this, Next.js rejects large PDFs with 413 before your code runs.
// export const config = {
//   api: {
//     bodyParser: false, // we parse FormData manually
//     responseLimit: false,
//     sizeLimit: "52mb",
//   },
// };

// // For Next.js App Router (app/), use this instead of config above:
// export const maxDuration = 60; // seconds — prevents timeout on large uploads

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

// // ─── GET /api/admin/notes ─────────────────────────────────────────────────────
// export async function GET(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { searchParams } = new URL(req.url);
//   const type = searchParams.get("type")?.toUpperCase() as NoteType | null;
//   const search = searchParams.get("search")?.trim() ?? "";
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
// export async function POST(req: Request) {
//   try {
//     const err = await requireAdmin(req);
//     if (err) return err;

//     let formData: FormData;
//     try {
//       formData = await req.formData();
//     } catch (e) {
//       console.error("FormData parse error:", e);
//       return NextResponse.json(
//         { error: "Invalid form-data. Make sure you are uploading using multipart/form-data." },
//         { status: 400 }
//       );
//     }

//     const file = formData.get("file") as File | null;
//     const title = formData.get("title")?.toString().trim();
//     const label = formData.get("label")?.toString().trim() ?? "";
//     const rawType = formData.get("type")?.toString().toUpperCase();
//     const serialId = Number(formData.get("serialId"));

//     // ── Validation ────────────────────────────────────────────────────────────
//     if (!title)
//       return NextResponse.json({ error: "Title is required" }, { status: 400 });
//     if (rawType !== "DEMO" && rawType !== "REAL")
//       return NextResponse.json({ error: "Type must be DEMO or REAL" }, { status: 400 });
//     if (!serialId || serialId < 1)
//       return NextResponse.json({ error: "SerialId must be a positive number" }, { status: 400 });
//     if (!file)
//       return NextResponse.json({ error: "PDF file is required" }, { status: 400 });
//     if (file.type !== "application/pdf")
//       return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
//     if (file.size > 50 * 1024 * 1024)
//       return NextResponse.json({ error: "File size exceeds 50 MB limit" }, { status: 413 });

//     const type = rawType as NoteType;

//     // ── Ensure bucket ─────────────────────────────────────────────────────────
//     const bucketErr = await ensureBucket();
//     if (bucketErr) {
//       console.error("Bucket error:", bucketErr);
//       return NextResponse.json({ error: bucketErr }, { status: 500 });
//     }

//     // ── Upload to Supabase ────────────────────────────────────────────────────
//     const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
//     const storagePath = `notes/${Date.now()}-${safeName}`;
//     const bytes = await file.arrayBuffer();

//     const { error: uploadError } = await supabaseAdmin.storage
//       .from(BUCKET)
//       .upload(storagePath, bytes, { contentType: "application/pdf", upsert: false });

//     if (uploadError) {
//       console.error("Supabase upload error:", uploadError);
//       return NextResponse.json({ error: uploadError.message }, { status: 500 });
//     }

//     const { data: publicUrlData } = supabaseAdmin.storage
//       .from(BUCKET)
//       .getPublicUrl(storagePath);

//     // ── Save to DB ────────────────────────────────────────────────────────────
//     try {
//       const note = await prisma.note.create({
//         data: { serialId, title, label, type, pdfUrl: publicUrlData.publicUrl, storagePath },
//       });
//       return NextResponse.json({ success: true, note }, { status: 201 });
//     } catch (dbError) {
//       console.error("DB error:", dbError);
//       await supabaseAdmin.storage.from(BUCKET).remove([storagePath]);
//       return NextResponse.json({ error: "Database save failed" }, { status: 500 });
//     }
//   } catch (error) {
//     console.error("POST /api/admin/notes unhandled error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }












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
    };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { title, label = "", type: rawType, serialId, pdfUrl, storagePath } = body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!title?.trim())
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (rawType !== "DEMO" && rawType !== "REAL")
      return NextResponse.json({ error: "Type must be DEMO or REAL" }, { status: 400 });
    if (!serialId || serialId < 1)
      return NextResponse.json({ error: "serialId must be a positive integer" }, { status: 400 });
    if (!pdfUrl || !storagePath)
      return NextResponse.json({ error: "pdfUrl and storagePath are required" }, { status: 400 });

    const note = await prisma.note.create({
      data: {
        serialId,
        title: title.trim(),
        label: label.trim(),
        type: rawType as NoteType,
        pdfUrl,
        storagePath,
      },
    });

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/notes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}