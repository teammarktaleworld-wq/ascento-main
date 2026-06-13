// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers";

// export async function GET(req: NextRequest) {
//   try {
//     // const auth = await requireAdmin(req);
//     // if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// // WITH:
// const authError = await requireAdmin(req);
// if (authError) return authError;
//     const { searchParams } = new URL(req.url);
//     const categoryId = searchParams.get("categoryId");

//     const papers = await prisma.portalPaper.findMany({
//       where: categoryId ? { categoryId } : undefined,
//       orderBy: { createdAt: "desc" },
//       include: {
//         category: { select: { id: true, name: true } },
//         _count: { select: { portalQuestions: true, portalRegistrations: true } },
//       },
//     });
//     return NextResponse.json({ papers });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//    // WITH:
// const authError = await requireAdmin(req);
// if (authError) return authError;
//     const body = await req.json();
//     const {
//       title, description = "", categoryId,
//       duration = 60, totalMarks = 100, passingMarks = 40,
//       shuffleQuestions = false, allowReview = true,
//       showResultImmediately = true, maxAttempts = 1,
//       startDate = null, endDate = null,
//     } = body;

//     if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
//     if (!categoryId)    return NextResponse.json({ error: "Category is required" }, { status: 400 });

//     const paper = await prisma.portalPaper.create({
//       data: {
//         title: title.trim(), description, categoryId,
//         duration, totalMarks, passingMarks,
//         shuffleQuestions, allowReview, showResultImmediately, maxAttempts,
//         startDate: startDate ? new Date(startDate) : null,
//         endDate: endDate ? new Date(endDate) : null,
//       },
//       include: { category: { select: { id: true, name: true } } },
//     });
//     return NextResponse.json({ paper }, { status: 201 });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }











// // src/app/api/admin/portal/papers/route.ts


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    const papers = await prisma.portalPaper.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { portalQuestions: true, portalRegistrations: true } },
      },
    });
    return NextResponse.json({ papers });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const body = await req.json();
    const {
      title, description = "", categoryId,
      duration = 60, totalMarks = 100, passingMarks = 40,
      shuffleQuestions = false, allowReview = true,
      showResultImmediately = true, maxAttempts = 1,
      startDate = null, endDate = null,
    } = body;

    if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!categoryId)    return NextResponse.json({ error: "Category is required" }, { status: 400 });

    const paper = await prisma.portalPaper.create({
      data: {
        title: title.trim(), description, categoryId,
        duration, totalMarks, passingMarks,
        shuffleQuestions, allowReview, showResultImmediately, maxAttempts,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: { category: { select: { id: true, name: true } } },
    });
    return NextResponse.json({ paper }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}