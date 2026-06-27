import { prisma } from "@/lib/helpers/prisma";

// Deterministic seeded PRNG so question order is stable per-registration
// but not predictable/identical for everyone.
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStringToInt(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

export function seededShuffle<T>(arr: T[], seedStr: string): T[] {
  const rand = mulberry32(hashStringToInt(seedStr));
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns true if the exam time window for this registration has elapsed,
 * based purely on server-side timestamps (startedAt + paper.duration).
 */
export function isTimeExpired(startedAt: Date | null, durationMins: number): boolean {
  if (!startedAt) return false;
  const elapsedMs = Date.now() - startedAt.getTime();
  // Small grace period (10s) to absorb network/render latency on submit
  return elapsedMs > durationMins * 60 * 1000 + 10_000;
}

export function remainingSeconds(startedAt: Date, durationMins: number): number {
  const elapsedMs = Date.now() - startedAt.getTime();
  const remainingMs = durationMins * 60 * 1000 - elapsedMs;
  return Math.max(0, Math.floor(remainingMs / 1000));
}

/**
 * Grades a registration server-side and marks it submitted/expired.
 * Safe to call multiple times — only the first call (status === in_progress
 * or registered) actually does anything; subsequent calls are no-ops.
 */
export async function gradeAndFinalize(
  registrationId: string,
  finalStatus: "submitted" | "expired"
) {
  return prisma.$transaction(async (tx) => {
    const reg = await tx.portalRegistration.findUnique({
      where: { id: registrationId },
      include: {
        paper: { include: { portalQuestions: true } },
        portalAnswers: true,
      },
    });

    if (!reg) throw new Error("Registration not found");

    // Already finalized — return as-is (idempotent, prevents double scoring)
    if (reg.status === "submitted" || reg.status === "expired") {
      return reg;
    }

    const answerMap = new Map(reg.portalAnswers.map((a) => [a.questionId, a]));

    let score = 0;
    const totalMarks = reg.paper.totalMarks;

    for (const q of reg.paper.portalQuestions) {
      const ans = answerMap.get(q.id);
      if (!ans) continue; // skipped/unanswered

      const isCorrect = ans.selectedIndex === q.correctOptionIndex;
      const marksAwarded = isCorrect ? q.marks : 0;

      if (isCorrect) score += q.marks;

      // Persist correctness/marks now that the exam is over
      await tx.portalAnswer.update({
        where: { id: ans.id },
        data: { isCorrect, marksAwarded },
      });
    }

    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const passed = percentage >= (reg.paper.passingMarks / totalMarks) * 100;

    const startedAt = reg.startedAt ?? reg.createdAt;
    const timeTaken = Math.max(
      0,
      Math.floor((Date.now() - startedAt.getTime()) / 1000)
    );
    const cappedTimeTaken = Math.min(timeTaken, reg.paper.duration * 60);

    return tx.portalRegistration.update({
      where: { id: registrationId },
      data: {
        status: finalStatus,
        score,
        totalMarks,
        percentage,
        passed,
        submittedAt: new Date(),
        timeTaken: cappedTimeTaken,
      },
    });
  });
}