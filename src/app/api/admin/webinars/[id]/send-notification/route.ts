
// // // app/api/admin/webinars/[id]/send-notification/route.ts


// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";
// import { getTargetedUsers } from "../../route";

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

//     const targets = await getTargetedUsers(webinar);
//     if (!targets.length)
//       return NextResponse.json({ count: 0, message: "No target users found" });

//     const dateStr = new Date(webinar.scheduledAt).toLocaleString("en-IN", {
//       dateStyle: "medium", timeStyle: "short",
//     });

//     // Delete old notifications for this webinar → recreate as unread
//     // This ensures every click of "Send Notification" delivers a fresh notification
//     await prisma.notification.deleteMany({ where: { webinarId: webinar.id } });

//     await prisma.notification.createMany({
//       data: targets.map((t) => ({
//         userId:    t.userId,
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
//       data: {
//         notificationSent:      true,
//         notificationSentAt:    new Date(),
//         notificationSentCount: { increment: 1 },
//       },
//     });

//     return NextResponse.json({ count: targets.length });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }










// // app/api/admin/webinars/[id]/send-notification/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";
// import { getTargetedUsers } from "../../route";

// type RouteContext = { params: Promise<{ id: string }> };

// export async function POST(req: NextRequest, ctx: RouteContext) {
//   try {
//     await requireAdmin(req);
//     const { id } = await ctx.params;

//     const webinar = await prisma.webinar.findUnique({
//       where: { id },
//       include: {
//         program: { select: { id: true, name: true } },
//         level: { select: { id: true, name: true } },
//       },
//     });
//     if (!webinar) return NextResponse.json({ error: "Webinar not found" }, { status: 404 });

//     const targets = await getTargetedUsers(webinar);
//     if (!targets.length)
//       return NextResponse.json({ count: 0, message: "No target users found" });

//     const dateStr = new Date(webinar.scheduledAt).toLocaleString("en-IN", {
//       dateStyle: "medium", timeStyle: "short",
//     });

//     // ✅ DO NOT delete old notifications — just mark existing ones as unread again
//     // so users who already read it get a fresh alert
//     await prisma.notification.updateMany({
//       where: { webinarId: webinar.id },
//       data: { isRead: false },
//     });

//     // Only create for users who don't already have one
//     const existingUserIds = await prisma.notification
//       .findMany({ where: { webinarId: webinar.id }, select: { userId: true } })
//       .then((rows) => new Set(rows.map((r) => r.userId)));

//     const newTargets = targets.filter((t) => !existingUserIds.has(t.userId));

//     if (newTargets.length > 0) {
//       await prisma.notification.createMany({
//         data: newTargets.map((t) => ({
//           userId: t.userId,
//           type: "webinar" as const,
//           title: `📹 Webinar: ${webinar.title}`,
//           message: `Scheduled on ${dateStr}. Click to join.`,
//           link: webinar.meetingLink,
//           webinarId: webinar.id,
//           isRead: false,
//         })),
//         skipDuplicates: true,
//       });
//     }

//     await prisma.webinar.update({
//       where: { id },
//       data: {
//         notificationSent: true,
//         notificationSentAt: new Date(),
//         notificationSentCount: { increment: 1 },
//       },
//     });

//     return NextResponse.json({ count: targets.length });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }












// app/api/admin/webinars/[id]/send-notification/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { getWebinarTargets } from "@/lib/notification-helpers";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;

    const webinar = await prisma.webinar.findUnique({ where: { id } });
    if (!webinar) return NextResponse.json({ error: "Webinar not found" }, { status: 404 });

    // Get ALL targets including admin
    const targets = await getWebinarTargets(webinar);
    if (!targets.length) return NextResponse.json({ count: 0 });

    const dateStr = new Date(webinar.scheduledAt).toLocaleString("en-IN", {
      dateStyle: "medium", timeStyle: "short",
    });

    // Mark existing notifications as unread (re-alert users who already read)
    await prisma.notification.updateMany({
      where: { webinarId: webinar.id },
      data:  { isRead: false },
    });

    // Create fresh notifications for users who don't have one yet
    const existing = await prisma.notification.findMany({
      where: { webinarId: webinar.id },
      select: { userId: true },
    });
    const existingSet = new Set(existing.map(r => r.userId));
    const newTargets  = targets.filter(t => !existingSet.has(t.userId));

    if (newTargets.length > 0) {
      await prisma.notification.createMany({
        data: newTargets.map(t => ({
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
    }

    await prisma.webinar.update({
      where: { id },
      data: {
        notificationSent:     true,
        notificationSentAt:   new Date(),
        notificationSentCount: { increment: 1 },
      },
    });

    return NextResponse.json({ count: targets.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}