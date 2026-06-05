









// lib/notification-helpers.ts
import { prisma } from "@/lib/helpers/prisma";

export interface TargetUser {
  userId: string;
  email:  string;
  name:   string;
}

// ─── Dedup utils ──────────────────────────────────────────────────────────────
function dedupeByUserId(arr: TargetUser[]): TargetUser[] {
  const seen = new Set<string>();
  return arr.filter(r => {
    if (seen.has(r.userId)) return false;
    seen.add(r.userId);
    return true;
  });
}

function dedupeByEmail(arr: { email: string; name: string }[]): { email: string; name: string }[] {
  const seen = new Set<string>();
  return arr.filter(r => {
    if (!r.email) return false;
    const key = r.email.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Always append admins ─────────────────────────────────────────────────────
async function appendAdmins(results: TargetUser[]): Promise<TargetUser[]> {
  const admins = await prisma.user.findMany({
    where:  { role: "admin" },
    select: { id: true, email: true, name: true },
  });
  for (const a of admins) {
    results.push({ userId: a.id, email: a.email, name: a.name ?? a.email });
  }
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBINAR TARGETS
// Rule: no programId → everyone | programId → enrolled students + all teachers
// Admin always included.
// ─────────────────────────────────────────────────────────────────────────────
export async function getWebinarTargets(webinar: {
  programId?: string | null;
  levelId?:   string | null;
}): Promise<TargetUser[]> {
  const results: TargetUser[] = [];

  if (webinar.programId) {
    const students = await prisma.student.findMany({
      where: {
        programId: webinar.programId,
        ...(webinar.levelId ? { programLevelId: webinar.levelId } : {}),
        status: "Active",
      },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    for (const s of students) {
      results.push({ userId: s.userId, email: s.user.email, name: s.fullName });
    }
    // Teachers always get program webinars
    const teachers = await prisma.user.findMany({
      where:  { role: "teacher" },
      select: { id: true, email: true, name: true },
    });
    for (const t of teachers) {
      results.push({ userId: t.id, email: t.email, name: t.name ?? t.email });
    }
  } else {
    // No filter → all roles
    const users = await prisma.user.findMany({
      where:  { role: { in: ["student", "teacher", "user", "admin"] } },
      select: { id: true, email: true, name: true },
    });
    for (const u of users) {
      results.push({ userId: u.id, email: u.email, name: u.name ?? u.email });
    }
  }

  return dedupeByUserId(await appendAdmins(results));
}

// ─────────────────────────────────────────────────────────────────────────────
// ANNOUNCEMENT TARGETS (in-app notifications)
//
// audience = "all"      → students + users + teachers + admin
// audience = "students" → students + admin
// audience = "teachers" → teachers + admin
// audience = "program"  → enrolled students in program + admin
// audience = "level"    → enrolled students in level + admin
// ─────────────────────────────────────────────────────────────────────────────
export async function getAnnouncementTargets(announcement: {
  audience:   string;
  programId?: string | null;
  levelId?:   string | null;
}): Promise<TargetUser[]> {
  const results: TargetUser[] = [];
  const { audience, programId, levelId } = announcement;

  if (audience === "all") {
    const users = await prisma.user.findMany({
      where:  { role: { in: ["student", "teacher", "user", "admin"] } },
      select: { id: true, email: true, name: true },
    });
    for (const u of users) results.push({ userId: u.id, email: u.email, name: u.name ?? u.email });

  } else if (audience === "students") {
    const users = await prisma.user.findMany({
      where:  { role: "student" },
      select: { id: true, email: true, name: true },
    });
    for (const u of users) results.push({ userId: u.id, email: u.email, name: u.name ?? u.email });

  } else if (audience === "teachers") {
    const users = await prisma.user.findMany({
      where:  { role: "teacher" },
      select: { id: true, email: true, name: true },
    });
    for (const u of users) results.push({ userId: u.id, email: u.email, name: u.name ?? u.email });

  } else if (audience === "program" && programId) {
    const students = await prisma.student.findMany({
      where:   { programId, status: "Active" },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    for (const s of students) {
      results.push({ userId: s.userId, email: s.user.email, name: s.fullName });
    }

  } else if (audience === "level" && programId) {
    const students = await prisma.student.findMany({
      where: {
        programId,
        ...(levelId ? { programLevelId: levelId } : {}),
        status: "Active",
      },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    for (const s of students) {
      results.push({ userId: s.userId, email: s.user.email, name: s.fullName });
    }
  }

  return dedupeByUserId(await appendAdmins(results));
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL TARGETS (includes parent emails — no userId needed)
// ─────────────────────────────────────────────────────────────────────────────
export async function getEmailTargets(webinar: {
  programId?: string | null;
  levelId?:   string | null;
}): Promise<{ email: string; name: string }[]> {
  const results: { email: string; name: string }[] = [];

  if (webinar.programId) {
    const students = await prisma.student.findMany({
      where: {
        programId: webinar.programId,
        ...(webinar.levelId ? { programLevelId: webinar.levelId } : {}),
        status: "Active",
      },
      include: { user: { select: { email: true } } },
    });
    for (const s of students) {
      if (s.user?.email)  results.push({ email: s.user.email,  name: s.fullName });
      if (s.parentEmail)  results.push({ email: s.parentEmail, name: s.parentName ?? s.fullName });
    }
    const teachers = await prisma.user.findMany({
      where:  { role: "teacher" },
      select: { email: true, name: true },
    });
    for (const t of teachers) results.push({ email: t.email, name: t.name ?? t.email });
  } else {
    const users = await prisma.user.findMany({
      where:  { role: { in: ["student", "teacher", "user", "admin"] } },
      select: { email: true, name: true },
    });
    for (const u of users) results.push({ email: u.email, name: u.name ?? u.email });

    const students = await prisma.student.findMany({
      where:  { status: "Active", parentEmail: { not: null } },
      select: { parentEmail: true, parentName: true, fullName: true },
    });
    for (const s of students) {
      if (s.parentEmail) results.push({ email: s.parentEmail, name: s.parentName ?? s.fullName });
    }
  }

  const admins = await prisma.user.findMany({
    where:  { role: "admin" },
    select: { email: true, name: true },
  });
  for (const a of admins) results.push({ email: a.email, name: a.name ?? a.email });

  return dedupeByEmail(results);
}