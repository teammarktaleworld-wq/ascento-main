// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";

// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   const err = await requireAdmin(req);
//   if (err) return err;
//   const body = await req.json();
//   const teacher = await prisma.teacher.update({
//     where: { id: params.id },
//     data: { name: body.name, phone: body.phone, experience: body.experience },
//   });
//   return NextResponse.json(teacher);
// }

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   const err = await requireAdmin(req);
//   if (err) return err;
//   await prisma.teacher.delete({ where: { id: params.id } });
//   return NextResponse.json({ success: true });
// }







import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params; // ✅ important
  const body = await req.json();

  const teacher = await prisma.teacher.update({
    where: { id },
    data: {
      name: body.name,
      phone: body.phone,
      experience: body.experience,
    },
  });

  return NextResponse.json(teacher);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;

  await prisma.teacher.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}