// // app/api/admin/students/[id]/report/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";

// // GET /api/admin/students/:id/report
// // Returns full student profile data (used by frontend to render/download)
// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> },
// ) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { id } = await context.params;

//   const student = await prisma.student.findUnique({
//     where: { id },
//     include: {
//       user:         true,
//       program:      true,
//       programLevel: true,
//     },
//   });

//   if (!student) {
//     return NextResponse.json({ error: "Student not found" }, { status: 404 });
//   }

//   // Shape the report payload
//   const report = {
//     studentId:    student.studentId,
//     fullName:     student.fullName,
//     email:        student.user?.email ?? "",
//     dateOfBirth:  student.dateOfBirth?.toISOString().split("T")[0] ?? null,
//     gender:       student.gender,
//     bloodGroup:   student.bloodGroup,
//     phone:        student.phone,
//     address:      student.address,
//     city:         student.city,
//     state:        student.state,
//     status:       student.status,
//     rollNumber:   student.rollNumber,
//     section:      student.section,
//     academicYear: student.academicYear,
//     parentName:   student.parentName,
//     parentPhone:  student.parentPhone,
//     parentEmail:  student.parentEmail,
//     program:      student.program  ? { id: student.program.id,  name: student.program.name  } : null,
//     level:        student.programLevel ? { id: student.programLevel.id, name: student.programLevel.name } : null,
//     enrolledAt:   student.createdAt.toISOString(),
//   };

//   return NextResponse.json({ report });
// }








// // app/api/admin/students/[id]/report/route.ts
// // Changes: include photoUrl in the report payload

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";

// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> },
// ) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { id } = await context.params;

//   const student = await prisma.student.findUnique({
//     where: { id },
//     include: { user: true, program: true, programLevel: true },
//   });

//   if (!student) {
//     return NextResponse.json({ error: "Student not found" }, { status: 404 });
//   }

//   const report = {
//     studentId:    student.studentId,
//     fullName:     student.fullName,
//     email:        student.user?.email ?? "",
//     photoUrl:     student.photoUrl ?? null,           // ← NEW
//     dateOfBirth:  student.dateOfBirth?.toISOString().split("T")[0] ?? null,
//     gender:       student.gender,
//     bloodGroup:   student.bloodGroup,
//     phone:        student.phone,
//     address:      student.address,
//     city:         student.city,
//     state:        student.state,
//     status:       student.status,
//     rollNumber:   student.rollNumber,
//     section:      student.section,
//     academicYear: student.academicYear,
//     parentName:   student.parentName,
//     parentPhone:  student.parentPhone,
//     parentEmail:  student.parentEmail,
//     program:      student.program      ? { id: student.program.id,      name: student.program.name      } : null,
//     level:        student.programLevel ? { id: student.programLevel.id, name: student.programLevel.name } : null,
//     enrolledAt:   student.createdAt.toISOString(),
//   };

//   return NextResponse.json({ report });
// }






// app/api/admin/students/[id]/report/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: { user: true, program: true, programLevel: true },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const report = {
    studentId:    student.studentId,
    fullName:     student.fullName,
    email:        student.user?.email ?? "",
    photoUrl:     student.photoUrl    ?? null,
    dateOfBirth:  student.dateOfBirth?.toISOString().split("T")[0] ?? null,
    admissionDate: student.admissionDate?.toISOString().split("T")[0] ?? null,
    gender:       student.gender,
    bloodGroup:   student.bloodGroup,
    phone:        student.phone,
    address:      student.address,
    city:         student.city,
    state:        student.state,
    status:       student.status,
    rollNumber:   student.rollNumber,
    section:      student.section,
    academicYear: student.academicYear,
    parentName:   student.parentName,
    parentPhone:  student.parentPhone,
    parentEmail:  student.parentEmail,
    program:      student.program
      ? { id: student.program.id, name: student.program.name }
      : null,
    level:        student.programLevel
      ? { id: student.programLevel.id, name: student.programLevel.name }
      : null,
    enrolledAt:   student.createdAt.toISOString(),
  };

  return NextResponse.json({ report });
}