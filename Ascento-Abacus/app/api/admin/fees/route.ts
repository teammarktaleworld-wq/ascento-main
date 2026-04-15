import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const fees = await prisma.fee.findMany({
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            rollNumber: true,
            studentId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(fees);
  } catch (error) {
    console.error("List fees error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fees" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, feeType, amount, dueDate, paymentStatus } = body;

    if (!studentId || !feeType || !amount || !dueDate) {
      return NextResponse.json(
        { error: "studentId, feeType, amount, and dueDate are required" },
        { status: 400 }
      );
    }

    const fee = await prisma.fee.create({
      data: {
        studentId,
        feeType,
        amount,
        dueDate: new Date(dueDate),
        paymentStatus: paymentStatus || "pending",
      },
    });

    return NextResponse.json(fee, { status: 201 });
  } catch (error) {
    console.error("Create fee error:", error);
    return NextResponse.json(
      { error: "Failed to create fee" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, paymentStatus, paidAt } = body;

    if (!id || !paymentStatus) {
      return NextResponse.json(
        { error: "id and paymentStatus are required" },
        { status: 400 }
      );
    }

    const fee = await prisma.fee.update({
      where: { id },
      data: {
        paymentStatus,
        paidAt: paidAt ? new Date(paidAt) : paymentStatus === "paid" ? new Date() : undefined,
      },
    });

    return NextResponse.json(fee);
  } catch (error) {
    console.error("Update fee error:", error);
    return NextResponse.json(
      { error: "Failed to update fee" },
      { status: 500 }
    );
  }
}
