


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";

// // ─── GET /api/admin/homework-files ────────────────────────────────────────────
// export async function GET(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { searchParams } = new URL(req.url);
//   const fileType = searchParams.get("fileType")?.toLowerCase(); // "pdf" | "image"
//   const search = searchParams.get("search")?.trim() ?? "";
//   const page = Math.max(1, Number(searchParams.get("page") ?? 1));
//   const limit = Math.min(100, Number(searchParams.get("limit") ?? 50));

//   const where = {
//     ...(fileType === "pdf" || fileType === "image" ? { fileType } : {}),
//     ...(search
//       ? {
//           OR: [
//             { title: { contains: search, mode: "insensitive" as const } },
//             { label: { contains: search, mode: "insensitive" as const } },
//           ],
//         }
//       : {}),
//   };

//   const [homeworkFiles, total] = await Promise.all([
//     prisma.homeworkFile.findMany({
//       where,
//       skip: (page - 1) * limit,
//       take: limit,
//       orderBy: { serialId: "asc" },
//     }),
//     prisma.homeworkFile.count({ where }),
//   ]);

//   return NextResponse.json({ homeworkFiles, total, page, limit });
// }

// // ─── POST /api/admin/homework-files ──────────────────────────────────────────
// // Receives JSON metadata only — the file is uploaded directly from the browser
// // to Supabase Storage (bypasses Vercel's 4.5MB serverless limit).
// export async function POST(req: Request) {
//   try {
//     const err = await requireAdmin(req);
//     if (err) return err;

//     let body: {
//       title?: string;
//       label?: string;
//       serialId?: number;
//       fileUrl?: string;
//       storagePath?: string;
//       fileType?: string;
//     };

//     try {
//       body = await req.json();
//     } catch {
//       return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
//     }

//     const {
//       title,
//       label = "",
//       serialId,
//       fileUrl,
//       storagePath,
//       fileType,
//     } = body;

//     // ── Validation ─────────────────────────────────────────────────────────────
//     if (!title?.trim())
//       return NextResponse.json({ error: "Title is required" }, { status: 400 });
//     if (fileType !== "pdf" && fileType !== "image")
//       return NextResponse.json(
//         { error: "fileType must be 'pdf' or 'image'" },
//         { status: 400 }
//       );
//     if (!serialId || serialId < 1)
//       return NextResponse.json(
//         { error: "serialId must be a positive integer" },
//         { status: 400 }
//       );
//     if (!fileUrl || !storagePath)
//       return NextResponse.json(
//         { error: "fileUrl and storagePath are required" },
//         { status: 400 }
//       );

//     const homeworkFile = await prisma.homeworkFile.create({
//       data: {
//         serialId,
//         title: title.trim(),
//         label: label.trim(),
//         fileType,
//         fileUrl,
//         storagePath,
//       },
//     });

//     return NextResponse.json({ success: true, homeworkFile }, { status: 201 });
//   } catch (error) {
//     console.error("POST /api/admin/homework-files error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }








import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

// ─── GET /api/admin/homework-files ────────────────────────────────────────────
export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const fileType = searchParams.get("fileType")?.toLowerCase();
  const search = searchParams.get("search")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Number(searchParams.get("limit") ?? 50));

  const where = {
    ...(fileType === "pdf" || fileType === "image" ? { fileType } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { label: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [homeworkFiles, total] = await Promise.all([
    prisma.homeworkFile.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { serialId: "asc" },
    }),
    prisma.homeworkFile.count({ where }),
  ]);

  return NextResponse.json({ homeworkFiles, total, page, limit });
}

// ─── POST /api/admin/homework-files ──────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const err = await requireAdmin(req);
    if (err) return err;

    let body: {
      title?: string;
      label?: string;
      fileUrl?: string;
      storagePath?: string;
      fileType?: string;
    };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { title, label = "", fileUrl, storagePath, fileType } = body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!title?.trim())
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (fileType !== "pdf" && fileType !== "image")
      return NextResponse.json(
        { error: "fileType must be 'pdf' or 'image'" },
        { status: 400 }
      );
    if (!fileUrl || !storagePath)
      return NextResponse.json(
        { error: "fileUrl and storagePath are required" },
        { status: 400 }
      );

    // ── Auto-assign serialId as max + 1 ──────────────────────────────────────
    const last = await prisma.homeworkFile.findFirst({
      orderBy: { serialId: "desc" },
      select: { serialId: true },
    });
    const nextSerialId = (last?.serialId ?? 0) + 1;

    const homeworkFile = await prisma.homeworkFile.create({
      data: {
        serialId: nextSerialId,
        title: title.trim(),
        label: label.trim(),
        fileType,
        fileUrl,
        storagePath,
      },
    });

    return NextResponse.json({ success: true, homeworkFile }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/homework-files error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}