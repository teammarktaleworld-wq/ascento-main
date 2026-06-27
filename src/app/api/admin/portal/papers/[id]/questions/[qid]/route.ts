// // src/app/api/portal/admin/papers/[id]/questions/[qid]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers";

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string; qid: string } }
// ) {
//   try {
//    // WITH:
// const authError = await requireAdmin(req);
// if (authError) return authError;
//     const body = await req.json();
//     const { questionText, options, correctOptionIndex, marks, explanation, order } = body;

//     const data: any = {};
//     if (questionText !== undefined)      data.questionText      = questionText.trim();
//     if (options !== undefined)           data.options           = JSON.stringify(options);
//     if (correctOptionIndex !== undefined) data.correctOptionIndex = Number(correctOptionIndex);
//     if (marks !== undefined)             data.marks             = Number(marks);
//     if (explanation !== undefined)       data.explanation       = explanation.trim();
//     if (order !== undefined)             data.order             = Number(order);

//     const question = await prisma.portalQuestion.update({
//       where: { id: params.qid },
//       data,
//     });

//     return NextResponse.json({
//       question: {
//         ...question,
//         options: typeof question.options === "string" ? JSON.parse(question.options) : question.options,
//       },
//     });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string; qid: string } }
// ) {
//   try {
//    // WITH:
// const authError = await requireAdmin(req);
// if (authError) return authError;

//     await prisma.portalQuestion.delete({ where: { id: params.qid } });

//     // Re-sequence remaining questions
//     const remaining = await prisma.portalQuestion.findMany({
//       where: { paperId: params.id },
//       orderBy: { order: "asc" },
//     });
//     await Promise.all(
//       remaining.map((q, i) =>
//         prisma.portalQuestion.update({ where: { id: q.id }, data: { order: i } })
//       )
//     );

//     return NextResponse.json({ success: true });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }














// src\app\api\admin\portal\papers\[id]\questions\[qid]\route.ts



import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; qid: string }> }
) {
  try {
    const { qid } = await params;
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const body = await req.json();
    const { questionText, options, correctOptionIndex, marks, explanation, order } = body;

    const data: any = {};
    if (questionText !== undefined)       data.questionText       = questionText.trim();
    if (options !== undefined)            data.options            = JSON.stringify(options);
    if (correctOptionIndex !== undefined) data.correctOptionIndex = Number(correctOptionIndex);
    if (marks !== undefined)              data.marks              = Number(marks);
    if (explanation !== undefined)        data.explanation        = explanation.trim();
    if (order !== undefined)              data.order              = Number(order);

    const question = await prisma.portalQuestion.update({
      where: { id: qid },
      data,
    });

    return NextResponse.json({
      question: {
        ...question,
        options: typeof question.options === "string" ? JSON.parse(question.options) : question.options,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; qid: string }> }
) {
  try {
    const { id, qid } = await params;
    const authError = await requireAdmin(req);
    if (authError) return authError;

    await prisma.portalQuestion.delete({ where: { id: qid } });

    const remaining = await prisma.portalQuestion.findMany({
      where: { paperId: id },
      orderBy: { order: "asc" },
    });

    await Promise.all(
      remaining.map((q, i) =>
        prisma.portalQuestion.update({ where: { id: q.id }, data: { order: i } })
      )
    );

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}