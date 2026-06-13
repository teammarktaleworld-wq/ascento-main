// // src/app/api/admin/portal/papers/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers";

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//   // WITH:
// const authError = await requireAdmin(req);
// if (authError) return authError;

//     const paper = await prisma.portalPaper.findUnique({
//       where: { id: params.id },
//       include: {
//         category: { select: { id: true, name: true } },
//         _count: { select: { portalQuestions: true, portalRegistrations: true } },
//       },
//     });
//     if (!paper) return NextResponse.json({ error: "Not found" }, { status: 404 });
//     return NextResponse.json({ paper });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

// export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//    // WITH:
// const authError = await requireAdmin(req);
// if (authError) return authError;

//     const body = await req.json();
//     const allowed = [
//       "title", "description", "categoryId", "duration", "totalMarks", "passingMarks",
//       "shuffleQuestions", "allowReview", "showResultImmediately", "maxAttempts",
//       "startDate", "endDate", "isActive", "isPublished",
//     ];

//     const data: any = {};
//     for (const key of allowed) {
//       if (body[key] !== undefined) {
//         if ((key === "startDate" || key === "endDate") && body[key]) {
//           data[key] = new Date(body[key]);
//         } else {
//           data[key] = body[key];
//         }
//       }
//     }

//     const paper = await prisma.portalPaper.update({ where: { id: params.id }, data });
//     return NextResponse.json({ paper });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     // WITH:
// const authError = await requireAdmin(req);
// if (authError) return authError;

//     await prisma.portalPaper.delete({ where: { id: params.id } });
//     return NextResponse.json({ success: true });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }















import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const paper = await prisma.portalPaper.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { portalQuestions: true, portalRegistrations: true } },
      },
    });
    if (!paper) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ paper });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const body = await req.json();
    const allowed = [
      "title", "description", "categoryId", "duration", "totalMarks", "passingMarks",
      "shuffleQuestions", "allowReview", "showResultImmediately", "maxAttempts",
      "startDate", "endDate", "isActive", "isPublished",
    ];

    const data: any = {};
    for (const key of allowed) {
      if (body[key] !== undefined) {
        if ((key === "startDate" || key === "endDate") && body[key]) {
          data[key] = new Date(body[key]);
        } else {
          data[key] = body[key];
        }
      }
    }

    const paper = await prisma.portalPaper.update({ where: { id }, data });
    return NextResponse.json({ paper });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authError = await requireAdmin(req);
    if (authError) return authError;

    await prisma.portalPaper.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}