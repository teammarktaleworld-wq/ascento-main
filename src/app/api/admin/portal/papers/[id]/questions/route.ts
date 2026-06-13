// // src/app/api/portal/admin/papers/[id]/questions/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers";

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//   // WITH:
// const authError = await requireAdmin(req);
// if (authError) return authError;

//     const questions = await prisma.portalQuestion.findMany({
//       where: { paperId: params.id },
//       orderBy: { order: "asc" },
//     });

//     // Parse options JSON into array
//     const parsed = questions.map(q => ({
//       ...q,
//       options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
//     }));

//     return NextResponse.json({ questions: parsed });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//    // WITH:
// const authError = await requireAdmin(req);
// if (authError) return authError;
//     const body = await req.json();
//     const { questionText, options, correctOptionIndex, marks = 1, explanation = "", order } = body;

//     if (!questionText?.trim()) return NextResponse.json({ error: "Question text required" }, { status: 400 });
//     if (!Array.isArray(options) || options.length !== 4)
//       return NextResponse.json({ error: "Exactly 4 options required" }, { status: 400 });

//     // Auto-assign order if not provided
//     const nextOrder = order ?? (await prisma.portalQuestion.count({ where: { paperId: params.id } }));

//     const question = await prisma.portalQuestion.create({
//       data: {
//         paperId: params.id,
//         questionText: questionText.trim(),
//         options: JSON.stringify(options),
//         correctOptionIndex: Number(correctOptionIndex),
//         marks: Number(marks),
//         explanation: explanation.trim(),
//         order: nextOrder,
//       },
//     });

//     return NextResponse.json({
//       question: { ...question, options },
//     }, { status: 201 });
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

    const questions = await prisma.portalQuestion.findMany({
      where: { paperId: id },
      orderBy: { order: "asc" },
    });

    const parsed = questions.map(q => ({
      ...q,
      options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
    }));

    return NextResponse.json({ questions: parsed });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const body = await req.json();
    const { questionText, options, correctOptionIndex, marks = 1, explanation = "", order } = body;

    if (!questionText?.trim())
      return NextResponse.json({ error: "Question text required" }, { status: 400 });
    if (!Array.isArray(options) || options.length !== 4)
      return NextResponse.json({ error: "Exactly 4 options required" }, { status: 400 });

    const nextOrder = order ?? (await prisma.portalQuestion.count({ where: { paperId: id } }));

    const question = await prisma.portalQuestion.create({
      data: {
        paperId: id,
        questionText: questionText.trim(),
        options: JSON.stringify(options),
        correctOptionIndex: Number(correctOptionIndex),
        marks: Number(marks),
        explanation: explanation.trim(),
        order: nextOrder,
      },
    });

    return NextResponse.json({ question: { ...question, options } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}