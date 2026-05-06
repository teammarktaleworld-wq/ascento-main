// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";

// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   const err = await requireAdmin(req);
//   if (err) return err;
//   const body = await req.json();
//   const enquiry = await prisma.enquiry.update({
//     where: { id: params.id },
//     data: { status: body.status, message: body.message },
//   });
//   return NextResponse.json(enquiry);
// }

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   const err = await requireAdmin(req);
//   if (err) return err;
//   await prisma.enquiry.delete({ where: { id: params.id } });
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

  // ✅ NEW WAY
  const { id } = await context.params;

  const body = await req.json();

  const enquiry = await prisma.enquiry.update({
    where: { id },
    data: {
      status: body.status,
      message: body.message,
    },
  });

  return NextResponse.json(enquiry);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;

  await prisma.enquiry.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}