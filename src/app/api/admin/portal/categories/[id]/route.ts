// // src/app/api/admin/portal/categories/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers";

// export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//   // WITH:
// const authError = await requireAdmin(req);
// if (authError) return authError;

//     const body = await req.json();
//     const { name, description, slug, isActive } = body;

//     const data: any = {};
//     if (name !== undefined)        data.name        = name.trim();
//     if (description !== undefined) data.description = description;
//     if (slug !== undefined)        data.slug        = slug.trim();
//     if (isActive !== undefined)    data.isActive    = isActive;

//     const category = await prisma.portalCategory.update({
//       where: { id: params.id },
//       data,
//     });
//     return NextResponse.json({ category });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//    // WITH:
// const authError = await requireAdmin(req);
// if (authError) return authError;

//     // Cascade: delete papers → questions → registrations → answers via Prisma cascade
//     await prisma.portalCategory.delete({ where: { id: params.id } });
//     return NextResponse.json({ success: true });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }




















import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const { id } = await params;

    const body = await req.json();
    const { name, description, slug, isActive } = body;

    const data: any = {};

    if (name !== undefined) data.name = name.trim();
    if (description !== undefined) data.description = description;
    if (slug !== undefined) data.slug = slug.trim();
    if (isActive !== undefined) data.isActive = isActive;

    const category = await prisma.portalCategory.update({
      where: { id },
      data,
    });

    return NextResponse.json({ category });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const { id } = await params;

    await prisma.portalCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}