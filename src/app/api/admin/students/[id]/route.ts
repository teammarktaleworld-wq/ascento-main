








// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";

// export async function GET(
//   _req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await context.params;

//   const student = await prisma.student.findUnique({
//     where: { id },
//     include: {
//       user: true,
//       fees:       { orderBy: { dueDate: "asc" } },
//       attendance: { orderBy: { date: "desc" }, take: 30 },
//       marks:      { include: { exam: true, subject: true } },
//       documents:  true,
//       notifications: { include: { notification: true }, take: 10 },
//     },
//   });

//   if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
//   return NextResponse.json(student);
// }

// export async function PATCH(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { id } = await context.params;
//   const body = await req.json();

//   const student = await prisma.student.update({
//     where: { id },
//     data: {
//       fullName:     body.fullName,
//       dateOfBirth:  body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
//       gender:       body.gender,
//       bloodGroup:   body.bloodGroup,
//       phone:        body.phone,
//       address:      body.address,
//       city:         body.city,
//       state:        body.state,
//       parentName:   body.parentName,
//       parentPhone:  body.parentPhone,
//       parentEmail:  body.parentEmail,
//       rollNumber:   body.rollNumber,
//       status:       body.status,
//       section:      body.section      ?? null,
//       class:        body.class        ?? null,
//       academicYear: body.academicYear ?? null,
//     },
//   });

//   return NextResponse.json(student);
// }

// export async function DELETE(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { id } = await context.params;
//   await prisma.student.delete({ where: { id } });
//   return NextResponse.json({ success: true });
// }








import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(student);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;
  const body = await req.json();

  const student = await prisma.student.update({
    where: { id },
    data: {
      fullName:     body.fullName,
      dateOfBirth:  body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      gender:       body.gender,
      bloodGroup:   body.bloodGroup,
      phone:        body.phone,
      address:      body.address,
      city:         body.city,
      state:        body.state,
      parentName:   body.parentName,
      parentPhone:  body.parentPhone,
      parentEmail:  body.parentEmail,
      rollNumber:   body.rollNumber,
      status:       body.status,
      section:      body.section      ?? null,
      class:        body.class        ?? null,
      academicYear: body.academicYear ?? null,
    },
  });

  return NextResponse.json(student);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;
  await prisma.student.delete({ where: { id } });
  return NextResponse.json({ success: true });
}