// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";

// // PATCH /api/admin/fees/[id]/pay  — mark as paid
// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const fee = await prisma.fee.update({
//     where: { id: params.id },
//     data: { paymentStatus: "paid", paidAt: new Date() },
//   });
//   return NextResponse.json(fee);
// }





import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

// PATCH /api/admin/fees/[id]/pay — mark as paid
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params; // ✅ IMPORTANT

  const fee = await prisma.fee.update({
    where: { id },
    data: {
      paymentStatus: "paid",
      paidAt: new Date(),
    },
  });

  return NextResponse.json(fee);
}