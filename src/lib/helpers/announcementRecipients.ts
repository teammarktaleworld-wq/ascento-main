// lib/announcementRecipients.ts
import { prisma } from "@/lib/helpers/prisma";

/**
 * Resolves the list of email addresses that should receive an announcement,
 * based on audience + optional programId / levelId.
 */
export async function resolveRecipients(opts: {
  audience:   string;
  programId?: string | null;
  levelId?:   string | null;
}): Promise<string[]> {
  const { audience, programId, levelId } = opts;

  const emails: string[] = [];

  if (audience === "all") {
    // Everyone: all users with a student or teacher role
    const users = await prisma.user.findMany({
      where: { role: { in: ["student", "teacher", "admin"] } },
      select: { email: true },
    });
    emails.push(...users.map((u) => u.email));

  } else if (audience === "students") {
    // All students
    const students = await prisma.student.findMany({
      where: { status: "Active" },
      include: { user: { select: { email: true } } },
    });
    emails.push(...students.map((s) => s.user.email));

    // Also include parent emails
    students.forEach((s) => {
      if (s.parentEmail) emails.push(s.parentEmail);
    });

  } else if (audience === "teachers") {
    // All teachers
    const teachers = await prisma.teacher.findMany({
      include: { user: { select: { email: true } } },
    });
    emails.push(...teachers.map((t) => t.user.email));

  } else if (audience === "program" && programId) {
    // All students enrolled in the specific program
    const students = await prisma.student.findMany({
      where: { programId, status: "Active" },
      include: { user: { select: { email: true } } },
    });
    emails.push(...students.map((s) => s.user.email));
    students.forEach((s) => {
      if (s.parentEmail) emails.push(s.parentEmail);
    });

  } else if (audience === "level" && levelId) {
    // All students in the specific program level
    const students = await prisma.student.findMany({
      where: { programLevelId: levelId, status: "Active" },
      include: { user: { select: { email: true } } },
    });
    emails.push(...students.map((s) => s.user.email));
    students.forEach((s) => {
      if (s.parentEmail) emails.push(s.parentEmail);
    });
  }

  // Deduplicate and filter out empty/invalid
  return [...new Set(emails.filter((e) => e && e.includes("@")))];
}