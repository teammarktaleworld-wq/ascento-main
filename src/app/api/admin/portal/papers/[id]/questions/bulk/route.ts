// // src/app/api/admin/portal/papers/[id]/questions/bulk/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers";

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//   // WITH:
// const authError = await requireAdmin(req);
// if (authError) return authError;

//     const { questions } = await req.json();
//     if (!Array.isArray(questions) || questions.length === 0)
//       return NextResponse.json({ error: "No questions provided" }, { status: 400 });

//     // Validate each
//     for (const [i, q] of questions.entries()) {
//       if (!q.questionText?.trim())
//         return NextResponse.json({ error: `Q${i + 1}: question text is required` }, { status: 400 });
//       if (!Array.isArray(q.options) || q.options.length !== 4)
//         return NextResponse.json({ error: `Q${i + 1}: exactly 4 options required` }, { status: 400 });
//     }

//     const baseOrder = await prisma.portalQuestion.count({ where: { paperId: params.id } });

//     const created = await prisma.$transaction(
//       questions.map((q: any, i: number) =>
//         prisma.portalQuestion.create({
//           data: {
//             paperId: params.id,
//             questionText: q.questionText.trim(),
//             options: JSON.stringify(q.options),
//             correctOptionIndex: Number(q.correctOptionIndex ?? 0),
//             marks: Number(q.marks ?? 1),
//             explanation: (q.explanation ?? "").trim(),
//             order: baseOrder + i,
//           },
//         })
//       )
//     );

//     return NextResponse.json({ created: created.length }, { status: 201 });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }
















import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const { questions } = await req.json();
    if (!Array.isArray(questions) || questions.length === 0)
      return NextResponse.json({ error: "No questions provided" }, { status: 400 });

    for (const [i, q] of questions.entries()) {
      if (!q.questionText?.trim())
        return NextResponse.json({ error: `Q${i + 1}: question text is required` }, { status: 400 });
      if (!Array.isArray(q.options) || q.options.length !== 4)
        return NextResponse.json({ error: `Q${i + 1}: exactly 4 options required` }, { status: 400 });
    }

    const baseOrder = await prisma.portalQuestion.count({ where: { paperId: id } });

    const created = await prisma.$transaction(
      questions.map((q: any, i: number) =>
        prisma.portalQuestion.create({
          data: {
            paperId: id,
            questionText: q.questionText.trim(),
            options: JSON.stringify(q.options),
            correctOptionIndex: Number(q.correctOptionIndex ?? 0),
            marks: Number(q.marks ?? 1),
            explanation: (q.explanation ?? "").trim(),
            order: baseOrder + i,
          },
        })
      )
    );

    return NextResponse.json({ created: created.length }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}