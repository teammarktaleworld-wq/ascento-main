// // app/api/admin/exams/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/auth-helpers"; // adjust to your auth helper

// /**
//  * GET /api/admin/exams
//  * Returns all exams with program & level info.
//  * Optional query params:
//  *   ?programId=<id>   — filter by program
//  *   ?levelId=<id>     — filter by level
//  *   ?status=upcoming|completed|all  (default: all)
//  */
// export async function GET(req: NextRequest) {
//   try {
//     await requireAdmin(req);
//   } catch {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { searchParams } = new URL(req.url);
//   const programId = searchParams.get("programId") ?? undefined;
//   const levelId = searchParams.get("levelId") ?? undefined;
//   const status = searchParams.get("status") ?? "all";

//   const now = new Date();
//   now.setHours(0, 0, 0, 0);

//   const where: Record<string, any> = {};
//   if (programId) where.programId = programId;
//   if (levelId) where.levelId = levelId;
//   if (status === "upcoming") where.examStartDate = { gte: now };
//   if (status === "completed") where.examStartDate = { lt: now };

//   try {
//     const exams = await prisma.exam.findMany({
//       where,
//       include: {
//         program: { select: { id: true, name: true } },
//         level: { select: { id: true, name: true } },
//       },
//       orderBy: { examStartDate: "asc" },
//     });

//     return NextResponse.json(exams);
//   } catch (err) {
//     console.error("[GET /api/admin/exams]", err);
//     return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
//   }
// }

// /**
//  * POST /api/admin/exams
//  * Body:
//  * {
//  *   examName: string          (required)
//  *   description?: string
//  *   examStartDate?: string    (ISO date string)
//  *   examEndDate?: string      (ISO date string)
//  *   programId?: string
//  *   levelId?: string
//  * }
//  */
// export async function POST(req: NextRequest) {
//   try {
//     await requireAdmin(req);
//   } catch {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   let body: any;
//   try {
//     body = await req.json();
//   } catch {
//     return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
//   }

//   const { examName, description, examStartDate, examEndDate, programId, levelId } = body;

//   if (!examName || typeof examName !== "string" || examName.trim().length === 0) {
//     return NextResponse.json({ error: "examName is required" }, { status: 400 });
//   }

//   // Validate programId exists if provided
//   if (programId) {
//     const program = await prisma.program.findUnique({ where: { id: programId } });
//     if (!program) {
//       return NextResponse.json({ error: "Program not found" }, { status: 404 });
//     }
//   }

//   // Validate levelId exists and belongs to program if provided
//   if (levelId) {
//     const level = await prisma.programLevel.findUnique({ where: { id: levelId } });
//     if (!level) {
//       return NextResponse.json({ error: "Program level not found" }, { status: 404 });
//     }
//     if (programId && level.programId !== programId) {
//       return NextResponse.json({ error: "Level does not belong to the selected program" }, { status: 400 });
//     }
//   }

//   try {
//     const exam = await prisma.exam.create({
//       data: {
//         examName: examName.trim(),
//         description: description?.trim() || null,
//         examStartDate: examStartDate ? new Date(examStartDate) : null,
//         examEndDate: examEndDate ? new Date(examEndDate) : null,
//         programId: programId || null,
//         levelId: levelId || null,
//       },
//       include: {
//         program: { select: { id: true, name: true } },
//         level: { select: { id: true, name: true } },
//       },
//     });

//     return NextResponse.json(exam, { status: 201 });
//   } catch (err) {
//     console.error("[POST /api/admin/exams]", err);
//     return NextResponse.json({ error: "Failed to create exam" }, { status: 500 });
//   }
// }







// src\app\api\admin\exams\route.ts


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const programId = searchParams.get("programId") ?? undefined;
  const levelId   = searchParams.get("levelId")   ?? undefined;
  const status    = searchParams.get("status")     ?? "all";

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const where: Record<string, any> = {};
  if (programId) where.programId = programId;
  if (levelId)   where.levelId   = levelId;
  if (status === "upcoming")  where.examStartDate = { gte: now };
  if (status === "completed") where.examStartDate = { lt: now };

  try {
    const exams = await prisma.exam.findMany({
      where,
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
      orderBy: { examStartDate: "asc" },
    });
    return NextResponse.json(exams);
  } catch (err) {
    console.error("[GET /api/admin/exams]", err);
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    examName, description,
    examStartDate, examEndDate,
    programId, levelId,
    fileUrl, fileType, fileName, storagePath,  // ← NEW
  } = body;

  if (!examName || typeof examName !== "string" || !examName.trim()) {
    return NextResponse.json({ error: "examName is required" }, { status: 400 });
  }

  if (programId) {
    const program = await prisma.program.findUnique({ where: { id: programId } });
    if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }

  if (levelId) {
    const level = await prisma.programLevel.findUnique({ where: { id: levelId } });
    if (!level) return NextResponse.json({ error: "Program level not found" }, { status: 404 });
    if (programId && level.programId !== programId)
      return NextResponse.json({ error: "Level does not belong to the selected program" }, { status: 400 });
  }

  try {
    const exam = await prisma.exam.create({
      data: {
        examName:     examName.trim(),
        description:  description?.trim() || null,
        examStartDate: examStartDate ? new Date(examStartDate) : null,
        examEndDate:   examEndDate   ? new Date(examEndDate)   : null,
        programId:    programId  || null,
        levelId:      levelId    || null,
        fileUrl:      fileUrl    || null,      // ← NEW
        fileType:     fileType   || null,      // ← NEW
        fileName:     fileName   || null,      // ← NEW
        storagePath:  storagePath || null,     // ← NEW
      },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(exam, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/exams]", err);
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 });
  }
}