import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";

export async function GET() {
  try {
    const categories = await prisma.examCategory.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("[GET /api/onlineExams/categories]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}