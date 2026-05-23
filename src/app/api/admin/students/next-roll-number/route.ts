import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    // Admin auth
    const err = await requireAdmin(req);
    if (err) return err;

    // Get latest student
    const latestStudent = await prisma.student.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        rollNumber: true,
      },
    });

    // Default roll number
    let nextRollNumber = "1";

    // Increment if exists
    if (latestStudent?.rollNumber) {
      const current = parseInt(latestStudent.rollNumber, 10);

      if (!isNaN(current)) {
        nextRollNumber = String(current + 1);
      }
    }

    return NextResponse.json({
      rollNumber: nextRollNumber,
    });
  } catch (error) {
    console.error("Next roll number error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}