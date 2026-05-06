// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";

// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   const err = await requireAdmin(req);
//   if (err) return err;
//   const body = await req.json();
//   const exam = await prisma.exam.update({
//     where: { id: params.id },
//     data: {
//       examName: body.examName,
//       description: body.description,
//       examStartDate: body.examStartDate ? new Date(body.examStartDate) : undefined,
//       examEndDate: body.examEndDate ? new Date(body.examEndDate) : undefined,
//     },
//   });
//   return NextResponse.json(exam);
// }

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   const err = await requireAdmin(req);
//   if (err) return err;
//   await prisma.exam.delete({ where: { id: params.id } });
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

  const exam = await prisma.exam.update({
    where: { id },
    data: {
      examName: body.examName,
      description: body.description,
      examStartDate: body.examStartDate
        ? new Date(body.examStartDate)
        : undefined,
      examEndDate: body.examEndDate
        ? new Date(body.examEndDate)
        : undefined,
    },
  });

  return NextResponse.json(exam);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;

  await prisma.exam.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}