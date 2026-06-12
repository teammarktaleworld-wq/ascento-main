import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const test = await prisma.onlineTest.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        questions: {
          take: 20,
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!test) {
      return NextResponse.json(
        {
          success: false,
          error: "Test not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: test,
    });
  } catch (error) {
    console.error("[GET /api/onlineExams/tests/[id]]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch test",
      },
      {
        status: 500,
      }
    );
  }
}