import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: { examStartDate: "desc" },
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error("List exams error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exams" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { examName, description, examStartDate, examEndDate } = body;

    if (!examName || !examStartDate || !examEndDate) {
      return NextResponse.json(
        { error: "examName, examStartDate, and examEndDate are required" },
        { status: 400 }
      );
    }

    const exam = await prisma.exam.create({
      data: {
        examName,
        description,
        examStartDate: new Date(examStartDate),
        examEndDate: new Date(examEndDate),
      },
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    console.error("Create exam error:", error);
    return NextResponse.json(
      { error: "Failed to create exam" },
      { status: 500 }
    );
  }
}
