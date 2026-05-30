





// // app/api/admin/webinars/[id]/send-notification/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";

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

//     const userIds = await getTargetUserIds(webinar);
//     if (userIds.length === 0)
//       return NextResponse.json({ count: 0, message: "No target users found" });

//     const dateStr = new Date(webinar.scheduledAt).toLocaleString("en-IN", {
//       dateStyle: "medium", timeStyle: "short",
//     });

//     // Delete old notifications for this webinar and recreate — so every click = fresh delivery
//     await prisma.notification.deleteMany({ where: { webinarId: webinar.id } });

//     await prisma.notification.createMany({
//       data: userIds.map((userId) => ({
//         userId,
//         type:      "webinar" as const,
//         title:     `📹 Webinar: ${webinar.title}`,
//         message:   `Scheduled on ${dateStr}. Click to join.`,
//         link:      webinar.meetingLink,
//         webinarId: webinar.id,
//         isRead:    false,
//       })),
//       skipDuplicates: true,
//     });

//     await prisma.webinar.update({
//       where: { id },
//       data: { notificationSent: true, notificationSentAt: new Date() },
//     });

//     return NextResponse.json({ count: userIds.length });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// async function getTargetUserIds(webinar: any): Promise<string[]> {
//   if (webinar.programId) {
//     const students = await prisma.student.findMany({
//       where: {
//         programId: webinar.programId,
//         ...(webinar.levelId ? { programLevelId: webinar.levelId } : {}),
//         status: "Active",
//       },
//       select: { userId: true },
//     });
//     return students.map((s) => s.userId);
//   }

//   const users = await prisma.user.findMany({
//     where: { role: { in: ["student", "teacher", "user"] } },
//     select: { id: true },
//   });
//   return users.map((u) => u.id);
// }









import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
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
      return NextResponse.json({ count: 0, message: "No target users found" });

    const dateStr = new Date(webinar.scheduledAt).toLocaleString("en-IN", {
      dateStyle: "medium", timeStyle: "short",
    });

    // Delete old notifications for this webinar → recreate as unread
    // This ensures every click of "Send Notification" delivers a fresh notification
    await prisma.notification.deleteMany({ where: { webinarId: webinar.id } });

    await prisma.notification.createMany({
      data: targets.map((t) => ({
        userId:    t.userId,
        type:      "webinar" as const,
        title:     `📹 Webinar: ${webinar.title}`,
        message:   `Scheduled on ${dateStr}. Click to join.`,
        link:      webinar.meetingLink,
        webinarId: webinar.id,
        isRead:    false,
      })),
      skipDuplicates: true,
    });

    await prisma.webinar.update({
      where: { id },
      data: {
        notificationSent:      true,
        notificationSentAt:    new Date(),
        notificationSentCount: { increment: 1 },
      },
    });

    return NextResponse.json({ count: targets.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}