import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getAuthUser } from "@/lib/helpers/auth-helpers";
import { isTimeExpired, gradeAndFinalize } from "@/lib/helpers/portal-exam";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ regId: string }> }
) {
  try {
    const { regId } = await params;
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { questionId, selectedIndex } = body as {
      questionId: string;
      selectedIndex: number | null;
    };

    if (!questionId) {
      return NextResponse.json({ error: "questionId is required" }, { status: 400 });
    }
    if (
      selectedIndex !== null &&
      (typeof selectedIndex !== "number" || !Number.isInteger(selectedIndex) || selectedIndex < 0)
    ) {
      return NextResponse.json({ error: "Invalid selectedIndex" }, { status: 400 });
    }

    const reg = await prisma.portalRegistration.findUnique({
      where: { id: regId },
      include: { paper: { select: { duration: true } } },
    });

    if (!reg) return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    if (reg.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (reg.status !== "in_progress") {
      return NextResponse.json({ error: "Exam is not in progress" }, { status: 409 });
    }

    if (isTimeExpired(reg.startedAt, reg.paper.duration)) {
      await gradeAndFinalize(reg.id, "expired");
      return NextResponse.json({ error: "Time is up. Exam has been auto-submitted." }, { status: 409 });
    }

    // ── Verify the question actually belongs to this paper ────────────
    const question = await prisma.portalQuestion.findFirst({
      where: { id: questionId, paperId: reg.paperId },
      select: { id: true, options: true },
    });
    if (!question) {
      return NextResponse.json({ error: "Invalid question for this paper" }, { status: 400 });
    }

    // ── Validate selectedIndex is within range of actual options ───────
    if (selectedIndex !== null) {
      const options = JSON.parse(question.options) as unknown[];
      if (selectedIndex >= options.length) {
        return NextResponse.json({ error: "Invalid option index" }, { status: 400 });
      }
    }

    await prisma.portalAnswer.upsert({
      where: { registrationId_questionId: { registrationId: reg.id, questionId } },
      create: {
        registrationId: reg.id,
        questionId,
        selectedIndex,
      },
      update: {
        selectedIndex,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}