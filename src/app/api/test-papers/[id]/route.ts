import { NextResponse } from "next/server";
import { questionBank, testPapers } from "../data";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testPaperId = id;

    const testPaper = testPapers.find((paper) => paper.id === testPaperId);

    if (!testPaper) {
      return NextResponse.json(
        { error: "Test paper not found" },
        { status: 404 }
      );
    }

    const questions = questionBank[testPaper.category as keyof typeof questionBank] || [];
    const limitedQuestions = questions.slice(0, 20);

    return NextResponse.json({
      success: true,
      data: {
        ...testPaper,
        questions: limitedQuestions,
        totalQuestions: limitedQuestions.length,
      },
    });
  } catch (error) {
    console.error("[GET /api/test-papers/[id]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
