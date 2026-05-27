// // app/api/admin/exams/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth";

// /**
//  * GET /api/admin/exams/:id
//  * Returns a single exam with program & level details.
//  */
// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await requireAdmin(req);
//   } catch {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { id } = params;

//   try {
//     const exam = await prisma.exam.findUnique({
//       where: { id },
//       include: {
//         program: { select: { id: true, name: true } },
//         level: { select: { id: true, name: true } },
//       },
//     });

//     if (!exam) {
//       return NextResponse.json({ error: "Exam not found" }, { status: 404 });
//     }

//     return NextResponse.json(exam);
//   } catch (err) {
//     console.error("[GET /api/admin/exams/:id]", err);
//     return NextResponse.json({ error: "Failed to fetch exam" }, { status: 500 });
//   }
// }

// /**
//  * PATCH /api/admin/exams/:id
//  * Partial update — send only fields you want to change.
//  * Body: same shape as POST (all fields optional)
//  */
// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await requireAdmin(req);
//   } catch {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { id } = params;

//   let body: any;
//   try {
//     body = await req.json();
//   } catch {
//     return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
//   }

//   const existing = await prisma.exam.findUnique({ where: { id } });
//   if (!existing) {
//     return NextResponse.json({ error: "Exam not found" }, { status: 404 });
//   }

//   const { examName, description, examStartDate, examEndDate, programId, levelId } = body;

//   // Validate programId if changing
//   if (programId !== undefined && programId !== null) {
//     const program = await prisma.program.findUnique({ where: { id: programId } });
//     if (!program) {
//       return NextResponse.json({ error: "Program not found" }, { status: 404 });
//     }
//   }

//   // Validate levelId if changing
//   if (levelId !== undefined && levelId !== null) {
//     const level = await prisma.programLevel.findUnique({ where: { id: levelId } });
//     if (!level) {
//       return NextResponse.json({ error: "Level not found" }, { status: 404 });
//     }
//     const resolvedProgramId = programId ?? existing.programId;
//     if (resolvedProgramId && level.programId !== resolvedProgramId) {
//       return NextResponse.json({ error: "Level does not belong to the selected program" }, { status: 400 });
//     }
//   }

//   try {
//     const updated = await prisma.exam.update({
//       where: { id },
//       data: {
//         ...(examName !== undefined && { examName: examName.trim() }),
//         ...(description !== undefined && { description: description?.trim() || null }),
//         ...(examStartDate !== undefined && { examStartDate: examStartDate ? new Date(examStartDate) : null }),
//         ...(examEndDate !== undefined && { examEndDate: examEndDate ? new Date(examEndDate) : null }),
//         ...(programId !== undefined && { programId: programId || null }),
//         ...(levelId !== undefined && { levelId: levelId || null }),
//       },
//       include: {
//         program: { select: { id: true, name: true } },
//         level: { select: { id: true, name: true } },
//       },
//     });

//     return NextResponse.json(updated);
//   } catch (err) {
//     console.error("[PATCH /api/admin/exams/:id]", err);
//     return NextResponse.json({ error: "Failed to update exam" }, { status: 500 });
//   }
// }

// /**
//  * DELETE /api/admin/exams/:id
//  * Permanently removes the exam.
//  */
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await requireAdmin(req);
//   } catch {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { id } = params;

//   try {
//     await prisma.exam.delete({ where: { id } });
//     return NextResponse.json({ success: true, id });
//   } catch (err: any) {
//     if (err?.code === "P2025") {
//       return NextResponse.json({ error: "Exam not found" }, { status: 404 });
//     }
//     console.error("[DELETE /api/admin/exams/:id]", err);
//     return NextResponse.json({ error: "Failed to delete exam" }, { status: 500 });
//   }
// }











import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try { await requireAdmin(req); }
  catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  try {
    const exam = await prisma.exam.findUnique({
      where: { id: params.id },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
    });
    if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    return NextResponse.json(exam);
  } catch (err) {
    console.error("[GET /api/admin/exams/:id]", err);
    return NextResponse.json({ error: "Failed to fetch exam" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try { await requireAdmin(req); }
  catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  let body: any;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const existing = await prisma.exam.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

  const {
    examName, description, examStartDate, examEndDate,
    programId, levelId,
    fileUrl, fileType, fileName, storagePath,  // ← NEW
  } = body;

  if (programId !== undefined && programId !== null) {
    const program = await prisma.program.findUnique({ where: { id: programId } });
    if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }

  if (levelId !== undefined && levelId !== null) {
    const level = await prisma.programLevel.findUnique({ where: { id: levelId } });
    if (!level) return NextResponse.json({ error: "Level not found" }, { status: 404 });
    const resolvedProgramId = programId ?? existing.programId;
    if (resolvedProgramId && level.programId !== resolvedProgramId)
      return NextResponse.json({ error: "Level does not belong to the selected program" }, { status: 400 });
  }

  try {
    const updated = await prisma.exam.update({
      where: { id: params.id },
      data: {
        ...(examName      !== undefined && { examName:      examName.trim() }),
        ...(description   !== undefined && { description:   description?.trim() || null }),
        ...(examStartDate !== undefined && { examStartDate: examStartDate ? new Date(examStartDate) : null }),
        ...(examEndDate   !== undefined && { examEndDate:   examEndDate   ? new Date(examEndDate)   : null }),
        ...(programId     !== undefined && { programId:     programId     || null }),
        ...(levelId       !== undefined && { levelId:       levelId       || null }),
        ...(fileUrl       !== undefined && { fileUrl:       fileUrl       || null }),  // ← NEW
        ...(fileType      !== undefined && { fileType:      fileType      || null }),  // ← NEW
        ...(fileName      !== undefined && { fileName:      fileName      || null }),  // ← NEW
        ...(storagePath   !== undefined && { storagePath:   storagePath   || null }),  // ← NEW
      },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/admin/exams/:id]", err);
    return NextResponse.json({ error: "Failed to update exam" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try { await requireAdmin(req); }
  catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  try {
    // ← Delete storage file before removing DB record
    const exam = await prisma.exam.findUnique({ where: { id: params.id } });
    if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

    if (exam.storagePath) {
      await supabaseAdmin.storage.from("exam-files").remove([exam.storagePath]);
    }

    await prisma.exam.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, id: params.id });
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    console.error("[DELETE /api/admin/exams/:id]", err);
    return NextResponse.json({ error: "Failed to delete exam" }, { status: 500 });
  }
}