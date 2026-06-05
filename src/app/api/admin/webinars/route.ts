




// // app/api/notifications/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { getSessionUser } from "@/lib/auth-helpers";

// // ── GET /api/notifications ────────────────────────────────────────────────────
// export async function GET(req: NextRequest) {
//   try {
//     const user = await getSessionUser(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { searchParams } = new URL(req.url);
//     const unreadOnly = searchParams.get("unread") === "true";
//     const limit      = Math.min(Number(searchParams.get("limit") ?? 50), 200);

//     // Every user (including admin) sees only their own Notification rows.
//     // Admin gets notifications because getWebinarTargets() now includes admins.
//     const notifications = await prisma.notification.findMany({
//       where: {
//         userId: user.id,
//         ...(unreadOnly ? { isRead: false } : {}),
//       },
//       orderBy: { createdAt: "desc" },
//       take: limit,
//       include: {
//         webinar: {
//           select: {
//             id: true, title: true, scheduledAt: true,
//             meetingLink: true, platform: true, status: true,
//           },
//         },
//       },
//     });

//     const unreadCount = await prisma.notification.count({
//       where: { userId: user.id, isRead: false },
//     });

//     return NextResponse.json({ notifications, unreadCount });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// // ── PATCH /api/notifications — mark all read ──────────────────────────────────
// export async function PATCH(req: NextRequest) {
//   try {
//     const user = await getSessionUser(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     await prisma.notification.updateMany({
//       where: { userId: user.id, isRead: false },
//       data:  { isRead: true },
//     });

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }








// app/api/admin/webinars/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { getWebinarTargets, getEmailTargets } from "@/lib/helpers/notification-helpers";
import { sendWebinarEmail } from "@/lib/helpers/webinarEmail";

// ── GET /api/admin/webinars ───────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(req.url);
    const programId = searchParams.get("programId");
    const status    = searchParams.get("status");

    const webinars = await prisma.webinar.findMany({
      where: {
        ...(programId ? { programId } : {}),
        ...(status    ? { status: status as any } : {}),
      },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
      orderBy: { scheduledAt: "asc" },
    });

    return NextResponse.json(webinars);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST /api/admin/webinars ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();

    const {
      title, description, platform, meetingLink, meetingId, passcode,
      hostName, hostEmail, scheduledAt, durationMins,
      programId, levelId, bannerUrl,
      isActive, sendEmail,
    } = body;

    if (!title || !meetingLink || !scheduledAt) {
      return NextResponse.json(
        { error: "title, meetingLink and scheduledAt are required" },
        { status: 400 }
      );
    }

    // New schema: status is "active" | "inactive" (not scheduled/live/etc.)
    const webinar = await prisma.webinar.create({
      data: {
        title,
        description:  description  || null,
        platform:     platform     || "zoom",
        meetingLink,
        meetingId:    meetingId    || null,
        passcode:     passcode     || null,
        hostName:     hostName     || null,
        hostEmail:    hostEmail    || null,
        scheduledAt:  new Date(scheduledAt),
        durationMins: durationMins ? Number(durationMins) : 60,
        programId:    programId    || null,
        levelId:      levelId      || null,
        bannerUrl:    bannerUrl    || null,
        status:       isActive === false ? "inactive" : "active",
      },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
    });

    // Auto-create in-app notifications for all targets
    await createWebinarNotifications(webinar);

    // Optionally send emails immediately on create
    if (sendEmail) {
      await sendWebinarEmails(webinar);
      await prisma.webinar.update({
        where: { id: webinar.id },
        data:  { emailSent: true, emailSentAt: new Date(), emailSentCount: { increment: 1 } },
      });
    }

    return NextResponse.json(webinar, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function createWebinarNotifications(webinar: any) {
  const targets = await getWebinarTargets(webinar);
  if (!targets.length) return;

  const dateStr = new Date(webinar.scheduledAt).toLocaleString("en-IN", {
    dateStyle: "medium", timeStyle: "short",
  });

  await prisma.notification.createMany({
    data: targets.map(t => ({
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
    where: { id: webinar.id },
    data: {
      notificationSent:      true,
      notificationSentAt:    new Date(),
      notificationSentCount: { increment: 1 },
    },
  });
}

async function sendWebinarEmails(webinar: any) {
  const targets = await getEmailTargets(webinar);
  await Promise.allSettled(
    targets.map(({ email, name }) =>
      sendWebinarEmail({ email, webinar, recipientName: name })
    )
  );
}