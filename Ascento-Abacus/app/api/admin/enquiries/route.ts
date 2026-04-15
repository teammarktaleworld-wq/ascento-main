import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(enquiries);
  } catch (error) {
    console.error("List enquiries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentName, email, phone, course, source, message } = body;

    if (!studentName || !email) {
      return NextResponse.json(
        { error: "studentName and email are required" },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        studentName,
        email,
        phone,
        course,
        source,
        message,
      },
    });

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    console.error("Create enquiry error:", error);
    return NextResponse.json(
      { error: "Failed to create enquiry" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(enquiry);
  } catch (error) {
    console.error("Update enquiry error:", error);
    return NextResponse.json(
      { error: "Failed to update enquiry" },
      { status: 500 }
    );
  }
}
