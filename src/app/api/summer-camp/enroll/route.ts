import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { childName, parentName, phone, email, age, program, message } = body;

    // Basic validation
    if (!childName?.trim()) {
      return NextResponse.json({ error: "Child's name is required" }, { status: 400 });
    }
    if (!phone?.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }
    if (!age) {
      return NextResponse.json({ error: "Age group is required" }, { status: 400 });
    }
    if (!program) {
      return NextResponse.json({ error: "Program selection is required" }, { status: 400 });
    }

    const enrollment = await prisma.summerCampEnrollment.create({
      data: {
        childName: childName.trim(),
        parentName: parentName?.trim() || null,
        phone: phone.trim(),
        email: email?.trim() || null,
        ageGroup: age,
        program: program,
        message: message?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, id: enrollment.id }, { status: 201 });
  } catch (err) {
    console.error("Summer camp enrollment error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

// GET — admin can view all enrollments
export async function GET(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enrollments = await prisma.summerCampEnrollment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(enrollments);
}