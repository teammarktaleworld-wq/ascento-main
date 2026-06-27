import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getAuthUser } from "@/lib/helpers/auth-helpers";
import { gradeAndFinalize } from "@/lib/helpers/portal-exam";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ regId: string }> }
) {
  try {
    const { regId } = await params;
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const reg = await prisma.portalRegistration.findUnique({
      where: { id: regId },
      select: { id: true, userId: true, status: true, paper: { select: { showResultImmediately: true } } },
    });

    if (!reg) return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    if (reg.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (reg.status === "submitted" || reg.status === "expired") {
      // Idempotent — already finalized, just return current state
      const current = await prisma.portalRegistration.findUnique({ where: { id: reg.id } });
      return NextResponse.json({
        status: current!.status,
        result: {
          score: current!.score,
          totalMarks: current!.totalMarks,
          percentage: current!.percentage,
          passed: current!.passed,
          submittedAt: current!.submittedAt,
          timeTaken: current!.timeTaken,
        },
      });
    }

    if (reg.status !== "in_progress") {
      return NextResponse.json({ error: "Exam is not in progress" }, { status: 409 });
    }

    const finalized = await gradeAndFinalize(reg.id, "submitted");

    return NextResponse.json({
      status: finalized.status,
      result: {
        score: finalized.score,
        totalMarks: finalized.totalMarks,
        percentage: finalized.percentage,
        passed: finalized.passed,
        submittedAt: finalized.submittedAt,
        timeTaken: finalized.timeTaken,
      },
      showResultImmediately: reg.paper.showResultImmediately,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}