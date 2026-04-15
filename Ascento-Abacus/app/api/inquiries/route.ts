import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Public endpoint for submitting admission inquiries from the mobile app / website
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, program, age, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        studentName: name,
        email: "",
        phone,
        course: program || null,
        source: "App",
        message: [age ? `Child's Age: ${age}` : "", message || ""]
          .filter(Boolean)
          .join(". ") || null,
        status: "New",
      },
    });

    return NextResponse.json(
      { id: enquiry.id, message: "Inquiry submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submit inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
