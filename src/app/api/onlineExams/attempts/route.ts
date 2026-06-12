import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, testId } = body;

    const attempt = await prisma.examAttempt.create({
      data: {
        userId,
        testId,
      },
    });

    return NextResponse.json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    console.error("[POST /api/onlineExams/attempts]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create attempt",
      },
      {
        status: 500,
      }
    );
  }
}