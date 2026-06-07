// app/api/admin/students/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// ── GET /api/admin/students/:id ───────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: { user: true, program: true, programLevel: true },
  });

  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(student);
}

// // ── PATCH /api/admin/students/:id ─────────────────────────────────────────────
// export async function PATCH(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> },
// ) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { id } = await context.params;
//   const body = await req.json();

//   const student = await prisma.student.update({
//     where: { id },
//     data: {
//       fullName:       body.fullName       ?? undefined,
//       photoUrl:       body.photoUrl       !== undefined ? (body.photoUrl || null)       : undefined,
//       dateOfBirth:    body.dateOfBirth    ? new Date(body.dateOfBirth)                  : undefined,
//       gender:         body.gender         ?? undefined,
//       bloodGroup:     body.bloodGroup     ?? undefined,
//       phone:          body.phone          ?? undefined,
//       address:        body.address        ?? undefined,
//       city:           body.city           ?? undefined,
//       state:          body.state          ?? undefined,
//       parentName:     body.parentName     ?? undefined,
//       parentPhone:    body.parentPhone    ?? undefined,
//       parentEmail:    body.parentEmail    ?? undefined,
//       rollNumber:     body.rollNumber     ?? undefined,
//       status:         body.status         ?? undefined,
//       section:        body.section        !== undefined ? (body.section        || null) : undefined,
//       academicYear:   body.academicYear   !== undefined ? (body.academicYear   || null) : undefined,
//       programId:      body.programId      !== undefined ? (body.programId      || null) : undefined,
//       programLevelId: body.programLevelId !== undefined ? (body.programLevelId || null) : undefined,
//     },
//     include: { program: true, programLevel: true },
//   });

//   return NextResponse.json(student);
// }






export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;
  const body = await req.json();

  const existingStudent = await prisma.student.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!existingStudent) {
    return NextResponse.json(
      { error: "Student not found" },
      { status: 404 }
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // Update User table if name/email changed
    if (body.fullName !== undefined || body.email !== undefined) {
      await tx.user.update({
        where: {
          id: existingStudent.userId,
        },
        data: {
          ...(body.fullName !== undefined && {
            name: body.fullName,
          }),
          ...(body.email !== undefined && {
            email: body.email,
          }),
        },
      });
    }

    // Update Student table
    const student = await tx.student.update({
      where: { id },
      data: {
        fullName: body.fullName ?? undefined,

        photoUrl:
          body.photoUrl !== undefined
            ? body.photoUrl || null
            : undefined,

        dateOfBirth: body.dateOfBirth
          ? new Date(body.dateOfBirth)
          : undefined,

        admissionDate: body.admissionDate
          ? new Date(body.admissionDate)
          : undefined,

        gender: body.gender ?? undefined,
        bloodGroup: body.bloodGroup ?? undefined,
        phone: body.phone ?? undefined,
        address: body.address ?? undefined,
        city: body.city ?? undefined,
        state: body.state ?? undefined,

        parentName: body.parentName ?? undefined,
        parentPhone: body.parentPhone ?? undefined,
        parentEmail: body.parentEmail ?? undefined,

        rollNumber: body.rollNumber ?? undefined,
        status: body.status ?? undefined,

        section:
          body.section !== undefined
            ? body.section || null
            : undefined,

        academicYear:
          body.academicYear !== undefined
            ? body.academicYear || null
            : undefined,

        programId:
          body.programId !== undefined
            ? body.programId || null
            : undefined,

        programLevelId:
          body.programLevelId !== undefined
            ? body.programLevelId || null
            : undefined,
      },
      include: {
        user: true,
        program: true,
        programLevel: true,
      },
    });

    return student;
  });

  // Update Supabase email outside transaction
  if (
    body.email &&
    body.email !== existingStudent.user.email
  ) {
    const { error: authError } =
      await supabaseAdmin.auth.admin.updateUserById(
        existingStudent.userId,
        {
          email: body.email,
          email_confirm: true,
        }
      );

    if (authError) {
      console.error(
        "Supabase email update failed:",
        authError
      );
    }
  }

  return NextResponse.json(result);
}
// ── DELETE /api/admin/students/:id ────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;

  const student = await prisma.student.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(student.userId);
  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 });

  await prisma.user.delete({ where: { id: student.userId } });
  return NextResponse.json({ success: true });
}