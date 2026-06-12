import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { attemptId, answers } = body;

    let score = 0;
    let totalMarks = 0;

    for (const answer of answers) {
      const question = await prisma.question.findUnique({
        where: {
          id: answer.questionId,
        },
      });

      if (!question) continue;

      totalMarks += question.marks;

      const isCorrect =
        question.correctAnswer === answer.selectedAnswer;

      if (isCorrect) {
        score += question.marks;
      }

      await prisma.examAnswer.create({
        data: {
          attemptId,
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
        },
      });
    }

    await prisma.examAttempt.update({
      where: {
        id: attemptId,
      },
      data: {
        score,
        totalMarks,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      score,
      totalMarks,
      percentage:
        totalMarks > 0
          ? Number(((score / totalMarks) * 100).toFixed(2))
          : 0,
    });
  } catch (error) {
    console.error("[POST /api/onlineExams/submit]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit exam",
      },
      {
        status: 500,
      }
    );
  }
}