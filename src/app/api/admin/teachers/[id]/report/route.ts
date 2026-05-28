// // app/api/admin/teachers/[id]/report/route.ts

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

//   const teacher = await prisma.teacher.findUnique({
//     where: { id },
//     include: {
//       user: true,
//       subjects: { include: { subject: true } },
//     },
//   });

//   if (!teacher) {
//     return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
//   }

//   const report = {
//     teacherId:   teacher.id,
//     name:        teacher.name,
//     email:       teacher.user?.email ?? "",
//     photoUrl:    teacher.photoUrl    ?? null,
//     phone:       teacher.phone       ?? null,
//     experience:  teacher.experience  ?? null,
//     designation: teacher.designation ?? null,
//     wifeOrHusbandOf: teacher.wifeOrHusbandOf ?? null,
//     status:      teacher.status      ?? "Active",
//     subjects:    teacher.subjects.map((s) => s.subject?.name ?? s.name ?? ""),
//     joinedAt:    teacher.createdAt.toISOString(),
//   };

//   return NextResponse.json({ report });
// }


// app/api/admin/teachers/[id]/report/route.ts

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

  const teacher = await prisma.teacher.findUnique({
    where: { id },

    include: {
      user: true,

      subjects: {
        include: {
          subject: true,
        },
      },
    },
  });

  if (!teacher) {
    return NextResponse.json(
      { error: "Teacher not found" },
      { status: 404 }
    );
  }

  const report = {
    teacherId: teacher.id,

    name: teacher.name,

    email: teacher.user?.email ?? "",

    photoUrl: teacher.photoUrl ?? null,

    phone: teacher.phone ?? null,

    experience: teacher.experience ?? null,

    designation: teacher.designation ?? null,

    wifeOrHusbandOf:
      teacher.wifeOrHusbandOf ?? null,

    dateOfBirth:
      teacher.dateOfBirth?.toISOString() ?? null,

    status: "Active",

    subjects: teacher.subjects.map(
      (s) => s.subject?.name ?? ""
    ),

    joinedAt:
      teacher.createdAt.toISOString(),
  };

  return NextResponse.json({ report });
}