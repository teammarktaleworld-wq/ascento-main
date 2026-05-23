

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";

// import { createClient } from "@supabase/supabase-js";

// const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!,
// );

// export async function GET(
//   _req: NextRequest,
//   context: { params: Promise<{ id: string }> },
// ) {
//   const { id } = await context.params;

//   const student = await prisma.student.findUnique({
//     where: { id },
//     include: {
//       user: true,
//     },
//   });

//   if (!student)
//     return NextResponse.json({ error: "Not found" }, { status: 404 });
//   return NextResponse.json(student);
// }

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
//       fullName: body.fullName,
//       dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
//       gender: body.gender,
//       bloodGroup: body.bloodGroup,
//       phone: body.phone,
//       address: body.address,
//       city: body.city,
//       state: body.state,
//       parentName: body.parentName,
//       parentPhone: body.parentPhone,
//       parentEmail: body.parentEmail,
//       rollNumber: body.rollNumber,
//       status: body.status,
//       section: body.section ?? null,
//       class: body.class ?? null,
//       academicYear: body.academicYear ?? null,
//     },
//   });

//   return NextResponse.json(student);
// }

// // export async function DELETE(
// //   req: NextRequest,
// //   context: { params: Promise<{ id: string }> }
// // ) {
// //   const err = await requireAdmin(req);
// //   if (err) return err;

// //   const { id } = await context.params;
// //   await prisma.student.delete({ where: { id } });
// //   return NextResponse.json({ success: true });
// // }

// // export async function DELETE(
// //   req: NextRequest,
// //   context: { params: Promise<{ id: string }> }
// // ) {
// //   const err = await requireAdmin(req);
// //   if (err) return err;

// //   const { id } = await context.params;

// //   // find student
// //   const student = await prisma.student.findUnique({
// //     where: { id },
// //     select: { userId: true },
// //   });

// //   if (!student) {
// //     return NextResponse.json(
// //       { error: "Student not found" },
// //       { status: 404 }
// //     );
// //   }

// //   // delete user -> student auto deletes because of Cascade
// //   await prisma.user.delete({
// //     where: { id: student.userId },
// //   });

// //   return NextResponse.json({ success: true });
// // }

// export async function DELETE(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> },
// ) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { id } = await context.params;

//   // Find student + user
//   const student = await prisma.student.findUnique({
//     where: { id },
//     select: {
//       userId: true,
//     },
//   });

//   if (!student) {
//     return NextResponse.json({ error: "Student not found" }, { status: 404 });
//   }

//   // 1. Delete from Supabase Auth
//   const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
//     student.userId,
//   );

//   if (authError) {
//     return NextResponse.json({ error: authError.message }, { status: 500 });
//   }

//   // 2. Delete from users table
//   // student auto deletes because of cascade
//   await prisma.user.delete({
//     where: {
//       id: student.userId,
//     },
//   });

//   return NextResponse.json({
//     success: true,
//   });
// }










// app/api/admin/students/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
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
    include: {
      user:         true,
      program:      true,
      programLevel: true,
    },
  });

  if (!student)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(student);
}

// ── PATCH /api/admin/students/:id ─────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;
  const body = await req.json();

  const student = await prisma.student.update({
    where: { id },
    data: {
      fullName:      body.fullName      ?? undefined,
      dateOfBirth:   body.dateOfBirth   ? new Date(body.dateOfBirth) : undefined,
      gender:        body.gender        ?? undefined,
      bloodGroup:    body.bloodGroup    ?? undefined,
      phone:         body.phone         ?? undefined,
      address:       body.address       ?? undefined,
      city:          body.city          ?? undefined,
      state:         body.state         ?? undefined,
      parentName:    body.parentName    ?? undefined,
      parentPhone:   body.parentPhone   ?? undefined,
      parentEmail:   body.parentEmail   ?? undefined,
      rollNumber:    body.rollNumber    ?? undefined,
      status:        body.status        ?? undefined,
      section:       body.section       !== undefined ? (body.section || null) : undefined,
      academicYear:  body.academicYear  !== undefined ? (body.academicYear || null) : undefined,
      programId:     body.programId     !== undefined ? (body.programId || null) : undefined,
      programLevelId: body.programLevelId !== undefined ? (body.programLevelId || null) : undefined,
    },
    include: {
      program:      true,
      programLevel: true,
    },
  });

  return NextResponse.json(student);
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

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(student.userId);
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  await prisma.user.delete({ where: { id: student.userId } });
  return NextResponse.json({ success: true });
}