// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";

// export async function GET(_req: Request, { params }: { params: { id: string } }) {
//   const student = await prisma.student.findUnique({
//     where: { id: params.id },
//     include: {
//       user: true,
//       enrollments: { include: { section: { include: { class: { include: { domain: true } } } } } },
//       fees: { orderBy: { dueDate: "asc" } },
//       attendance: { orderBy: { date: "desc" }, take: 30 },
//       marks: { include: { exam: true, subject: true } },
//       documents: true,
//       notifications: { include: { notification: true }, take: 10 },
//     },
//   });
//   if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
//   return NextResponse.json(student);
// }

// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   const err = await requireAdmin(req);
//   if (err) return err;
//   const body = await req.json();
//   const student = await prisma.student.update({
//     where: { id: params.id },
//     data: {
//       fullName: body.fullName,
//       phone: body.phone,
//       address: body.address,
//       city: body.city,
//       state: body.state,
//       parentName: body.parentName,
//       parentPhone: body.parentPhone,
//       parentEmail: body.parentEmail,
//       gender: body.gender,
//       bloodGroup: body.bloodGroup,
//       status: body.status,
//       rollNumber: body.rollNumber,
//     },
//   });
//   return NextResponse.json(student);
// }

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   const err = await requireAdmin(req);
//   if (err) return err;
//   await prisma.student.delete({ where: { id: params.id } });
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
      enrollments: {
        include: {
          section: {
            include: {
              class: { include: { domain: true } },
            },
          },
        },
      },
      fees: { orderBy: { dueDate: "asc" } },
      attendance: { orderBy: { date: "desc" }, take: 30 },
      marks: { include: { exam: true, subject: true } },
      documents: true,
      notifications: {
        include: { notification: true },
        take: 10,
      },
    },
  });

  if (!student) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

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
      fullName: body.fullName,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      parentName: body.parentName,
      parentPhone: body.parentPhone,
      parentEmail: body.parentEmail,
      gender: body.gender,
      bloodGroup: body.bloodGroup,
      status: body.status,
      rollNumber: body.rollNumber,
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

  await prisma.student.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}