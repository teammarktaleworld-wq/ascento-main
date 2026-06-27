import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getAuthUser } from "@/lib/helpers/auth-helpers";
import {
  seededShuffle,
  isTimeExpired,
  remainingSeconds,
  gradeAndFinalize,
} from "@/lib/helpers/portal-exam";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ regId: string }> }
) {
  try {
    const { regId } = await params;
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let reg = await prisma.portalRegistration.findUnique({
      where: { id: regId },
      include: {
        paper: {
          include: {
            category: { select: { id: true, name: true } },
            portalQuestions: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                questionText: true,
                options: true,
                marks: true,
                order: true,
                // NOTE: correctOptionIndex & explanation deliberately omitted
              },
            },
          },
        },
        portalAnswers: { select: { questionId: true, selectedIndex: true } },
      },
    });

    if (!reg) return NextResponse.json({ error: "Registration not found" }, { status: 404 });

    // ── Ownership check ──────────────────────────────────────────────
    if (reg.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const paper = reg.paper;

    // ── Already finished ─────────────────────────────────────────────
    if (reg.status === "submitted" || reg.status === "expired") {
      return NextResponse.json({
        status: reg.status,
        result: {
          score: reg.score,
          totalMarks: reg.totalMarks,
          percentage: reg.percentage,
          passed: reg.passed,
          submittedAt: reg.submittedAt,
          timeTaken: reg.timeTaken,
        },
        paper: { id: paper.id, title: paper.title, totalMarks: paper.totalMarks, passingMarks: paper.passingMarks },
      });
    }

    // ── If in_progress but time is already up → auto-finalize as expired ──
    if (reg.status === "in_progress" && isTimeExpired(reg.startedAt, paper.duration)) {
      const finalized = await gradeAndFinalize(reg.id, "expired");
      return NextResponse.json({
        status: "expired",
        result: {
          score: finalized.score,
          totalMarks: finalized.totalMarks,
          percentage: finalized.percentage,
          passed: finalized.passed,
          submittedAt: finalized.submittedAt,
          timeTaken: finalized.timeTaken,
        },
        paper: { id: paper.id, title: paper.title, totalMarks: paper.totalMarks, passingMarks: paper.passingMarks },
      });
    }

    // ── Validate paper-level scheduling window (defense in depth) ─────
    const now = new Date();
    if (paper.endDate && now > paper.endDate) {
      // Window closed without finishing — finalize as expired
      const finalized = await gradeAndFinalize(reg.id, "expired");
      return NextResponse.json({
        status: "expired",
        result: {
          score: finalized.score,
          totalMarks: finalized.totalMarks,
          percentage: finalized.percentage,
          passed: finalized.passed,
          submittedAt: finalized.submittedAt,
          timeTaken: finalized.timeTaken,
        },
        paper: { id: paper.id, title: paper.title, totalMarks: paper.totalMarks, passingMarks: paper.passingMarks },
      });
    }
    if (paper.startDate && now < paper.startDate) {
      return NextResponse.json({ error: "This exam has not started yet" }, { status: 403 });
    }
    if (!paper.isActive || !paper.isPublished) {
      return NextResponse.json({ error: "This exam is not available" }, { status: 403 });
    }

    // ── First open: registered -> in_progress (atomic, race-safe) ─────
    if (reg.status === "registered") {
      // updateMany with a status guard ensures only one request can win
      // this transition even under concurrent double-clicks/tabs.
      const updateResult = await prisma.portalRegistration.updateMany({
        where: { id: reg.id, status: "registered" },
        data: { status: "in_progress", startedAt: now },
      });

      if (updateResult.count === 1) {
        reg = await prisma.portalRegistration.findUnique({
          where: { id: regId },
          include: {
            paper: {
              include: {
                category: { select: { id: true, name: true } },
                portalQuestions: {
                  orderBy: { order: "asc" },
                  select: {
                    id: true, questionText: true, options: true,
                    marks: true, order: true,
                  },
                },
              },
            },
            portalAnswers: { select: { questionId: true, selectedIndex: true } },
          },
        });
      } else {
        // Another concurrent request already started it — reload fresh state
        reg = await prisma.portalRegistration.findUnique({
          where: { id: regId },
          include: {
            paper: {
              include: {
                category: { select: { id: true, name: true } },
                portalQuestions: {
                  orderBy: { order: "asc" },
                  select: {
                    id: true, questionText: true, options: true,
                    marks: true, order: true,
                  },
                },
              },
            },
            portalAnswers: { select: { questionId: true, selectedIndex: true } },
          },
        });
      }
    }

    if (!reg || !reg.startedAt) {
      return NextResponse.json({ error: "Could not start exam" }, { status: 500 });
    }

    // Re-check expiry after potential start (edge case: duration=0 etc.)
    if (isTimeExpired(reg.startedAt, paper.duration)) {
      const finalized = await gradeAndFinalize(reg.id, "expired");
      return NextResponse.json({
        status: "expired",
        result: {
          score: finalized.score,
          totalMarks: finalized.totalMarks,
          percentage: finalized.percentage,
          passed: finalized.passed,
          submittedAt: finalized.submittedAt,
          timeTaken: finalized.timeTaken,
        },
        paper: { id: paper.id, title: paper.title, totalMarks: paper.totalMarks, passingMarks: paper.passingMarks },
      });
    }

    // ── Build sanitized question list (shuffle if configured) ─────────
    let questions = reg.paper.portalQuestions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      options: JSON.parse(q.options) as { text: string }[],
      marks: q.marks,
    }));

    if (paper.shuffleQuestions) {
      // Seed includes regId so each user gets a stable-but-unique order,
      // and userId so it can't be guessed from the registration id alone.
      questions = seededShuffle(questions, `${reg.id}:${reg.userId}`);
    }

    const answersMap: Record<string, number | null> = {};
    for (const a of reg.portalAnswers) {
      answersMap[a.questionId] = a.selectedIndex;
    }

    return NextResponse.json({
      status: "in_progress",
      registrationId: reg.id,
      attemptNumber: reg.attemptNumber,
      remainingSeconds: remainingSeconds(reg.startedAt, paper.duration),
      paper: {
        id: paper.id,
        title: paper.title,
        description: paper.description,
        duration: paper.duration,
        totalMarks: paper.totalMarks,
        passingMarks: paper.passingMarks,
        allowReview: paper.allowReview,
        category: paper.category,
      },
      questions,
      answers: answersMap,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}