










// // app/api/admin/webinars/[id]/send-email/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";
// import { sendWebinarEmail } from "@/lib/webinarEmail";

// type RouteContext = { params: Promise<{ id: string }> };

// export async function POST(req: NextRequest, ctx: RouteContext) {
//   try {
//     await requireAdmin(req);
//     const { id } = await ctx.params;

//     const webinar = await prisma.webinar.findUnique({
//       where: { id },
//       include: {
//         program: { select: { id: true, name: true } },
//         level:   { select: { id: true, name: true } },
//       },
//     });
//     if (!webinar) return NextResponse.json({ error: "Webinar not found" }, { status: 404 });

//     const targets = await getTargetEmails(webinar);
//     if (targets.length === 0)
//       return NextResponse.json({ sent: 0, failed: 0, total: 0, errors: [] });

//     const results = await Promise.allSettled(
//       targets.map(({ email, name }) =>
//         sendWebinarEmail({ email, webinar, recipientName: name })
//       )
//     );

//     const sent   = results.filter((r) => r.status === "fulfilled").length;
//     const failed = results.filter((r) => r.status === "rejected").length;
//     const errors = results
//       .map((r, i) =>
//         r.status === "rejected"
//           ? `${targets[i].email}: ${(r as PromiseRejectedResult).reason?.message ?? "Unknown"}`
//           : null
//       )
//       .filter(Boolean) as string[];

//     // Always update timestamp so UI shows "last sent at X"
//     await prisma.webinar.update({
//       where: { id },
//       data: { emailSent: true, emailSentAt: new Date() },
//     });

//     return NextResponse.json({ sent, failed, total: targets.length, errors });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// async function getTargetEmails(webinar: any): Promise<{ email: string; name: string }[]> {
//   if (webinar.programId) {
//     const students = await prisma.student.findMany({
//       where: {
//         programId: webinar.programId,
//         ...(webinar.levelId ? { programLevelId: webinar.levelId } : {}),
//         status: "Active",
//       },
//       include: { user: { select: { email: true } } },
//     });

//     const results: { email: string; name: string }[] = [];
//     for (const s of students) {
//       if (s.parentEmail) results.push({ email: s.parentEmail, name: s.parentName || s.fullName });
//       if (s.user?.email) results.push({ email: s.user.email,  name: s.fullName });
//     }

//     const seen = new Set<string>();
//     return results.filter((r) => {
//       if (!r.email || seen.has(r.email)) return false;
//       seen.add(r.email);
//       return true;
//     });
//   }

//   // All users + deduplicate against student parentEmails
//   const users = await prisma.user.findMany({
//     where: { role: { in: ["student", "teacher", "user"] } },
//     select: { email: true, name: true },
//   });

//   // Also get all parent emails from students
//   const students = await prisma.student.findMany({
//     where: { parentEmail: { not: null }, status: "Active" },
//     select: { parentEmail: true, parentName: true, fullName: true },
//   });

//   const seen = new Set<string>();
//   const results: { email: string; name: string }[] = [];

//   for (const u of users) {
//     if (u.email && !seen.has(u.email)) {
//       seen.add(u.email);
//       results.push({ email: u.email, name: u.name || u.email });
//     }
//   }
//   for (const s of students) {
//     if (s.parentEmail && !seen.has(s.parentEmail)) {
//       seen.add(s.parentEmail);
//       results.push({ email: s.parentEmail, name: s.parentName || s.fullName });
//     }
//   }

//   return results;
// }













import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { sendWebinarEmail } from "@/lib/webinarEmail";
import { getTargetedUsers } from "../../route";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;

    const webinar = await prisma.webinar.findUnique({
      where: { id },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
    });
    if (!webinar) return NextResponse.json({ error: "Webinar not found" }, { status: 404 });

    const targets = await getTargetedUsers(webinar);
    if (!targets.length)
      return NextResponse.json({ sent: 0, failed: 0, total: 0, errors: [] });

    // Send all emails in parallel — no one-time gate, sends every time
    const results = await Promise.allSettled(
      targets.map(({ email, name }) =>
        sendWebinarEmail({ email, webinar, recipientName: name })
      )
    );

    const sent   = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;
    const errors = results
      .map((r, i) =>
        r.status === "rejected"
          ? `${targets[i].email}: ${(r as PromiseRejectedResult).reason?.message ?? "Unknown"}`
          : null
      )
      .filter(Boolean) as string[];

    // Always update — increment count so admin can see how many times sent
    await prisma.webinar.update({
      where: { id },
      data: {
        emailSent:      true,
        emailSentAt:    new Date(),
        emailSentCount: { increment: sent },
      },
    });

    return NextResponse.json({ sent, failed, total: targets.length, errors });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}