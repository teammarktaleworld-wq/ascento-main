




// // app/api/admin/webinars/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers";
// import { getWebinarTargets, getEmailTargets } from "@/lib/helpers/notification-helpers";
// import { sendWebinarEmail } from "@/lib/helpers/webinarEmail";

// // ── GET /api/admin/webinars ───────────────────────────────────────────────────
// export async function GET(req: NextRequest) {
//   const authErr = await requireAdmin(req);
//   if (authErr) return authErr;

//   try {
//     const { searchParams } = new URL(req.url);
//     const programId = searchParams.get("programId");
//     const status    = searchParams.get("status");

//     const webinars = await prisma.webinar.findMany({
//       where: {
//         ...(programId ? { programId } : {}),
//         ...(status    ? { status: status as any } : {}),
//       },
//       include: {
//         program: { select: { id: true, name: true } },
//         level:   { select: { id: true, name: true } },
//       },
//       orderBy: { scheduledAt: "asc" },
//     });

//     return NextResponse.json(webinars);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// // ── POST /api/admin/webinars ──────────────────────────────────────────────────
// export async function POST(req: NextRequest) {
//   const authErr = await requireAdmin(req);
//   if (authErr) return authErr;

//   try {
//     const body = await req.json();

//     const {
//       title, description, platform, meetingLink, meetingId, passcode,
//       hostName, hostEmail, scheduledAt, durationMins,
//       programId, levelId, bannerUrl,
//       isActive, sendEmail,
//     } = body;

//     if (!title || !meetingLink || !scheduledAt) {
//       return NextResponse.json(
//         { error: "title, meetingLink and scheduledAt are required" },
//         { status: 400 }
//       );
//     }

//     // New schema: status is "active" | "inactive" (not scheduled/live/etc.)
//     const webinar = await prisma.webinar.create({
//       data: {
//         title,
//         description:  description  || null,
//         platform:     platform     || "zoom",
//         meetingLink,
//         meetingId:    meetingId    || null,
//         passcode:     passcode     || null,
//         hostName:     hostName     || null,
//         hostEmail:    hostEmail    || null,
//         scheduledAt:  new Date(scheduledAt),
//         durationMins: durationMins ? Number(durationMins) : 60,
//         programId:    programId    || null,
//         levelId:      levelId      || null,
//         bannerUrl:    bannerUrl    || null,
//         status:       isActive === false ? "inactive" : "active",
//       },
//       include: {
//         program: { select: { id: true, name: true } },
//         level:   { select: { id: true, name: true } },
//       },
//     });

//     // Auto-create in-app notifications for all targets
//     await createWebinarNotifications(webinar);

//     // Optionally send emails immediately on create
//     if (sendEmail) {
//       await sendWebinarEmails(webinar);
//       await prisma.webinar.update({
//         where: { id: webinar.id },
//         data:  { emailSent: true, emailSentAt: new Date(), emailSentCount: { increment: 1 } },
//       });
//     }

//     return NextResponse.json(webinar, { status: 201 });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// async function createWebinarNotifications(webinar: any) {
//   const targets = await getWebinarTargets(webinar);
//   if (!targets.length) return;

//   const dateStr = new Date(webinar.scheduledAt).toLocaleString("en-IN", {
//     dateStyle: "medium", timeStyle: "short",
//   });

//   await prisma.notification.createMany({
//     data: targets.map(t => ({
//       userId:    t.userId,
//       type:      "webinar" as const,
//       title:     `📹 Webinar: ${webinar.title}`,
//       message:   `Scheduled on ${dateStr}. Click to join.`,
//       link:      webinar.meetingLink,
//       webinarId: webinar.id,
//       isRead:    false,
//     })),
//     skipDuplicates: true,
//   });

//   await prisma.webinar.update({
//     where: { id: webinar.id },
//     data: {
//       notificationSent:      true,
//       notificationSentAt:    new Date(),
//       notificationSentCount: { increment: 1 },
//     },
//   });
// }

// async function sendWebinarEmails(webinar: any) {
//   const targets = await getEmailTargets(webinar);
//   await Promise.allSettled(
//     targets.map(({ email, name }) =>
//       sendWebinarEmail({ email, webinar, recipientName: name })
//     )
//   );
// }











// // app/api/admin/webinars/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers";
// import { getWebinarTargets, getEmailTargets } from "@/lib/helpers/notification-helpers";
// import { sendWebinarEmail } from "@/lib/helpers/webinarEmail";

// // ── GET /api/admin/webinars ───────────────────────────────────────────────────
// export async function GET(req: NextRequest) {
//   const authErr = await requireAdmin(req);
//   if (authErr) return authErr;

//   try {
//     const { searchParams } = new URL(req.url);
//     const programId = searchParams.get("programId");
//     const status    = searchParams.get("status");

//     const webinars = await prisma.webinar.findMany({
//       where: {
//         ...(programId ? { programId } : {}),
//         ...(status    ? { status: status as any } : {}),
//       },
//       include: {
//         program: { select: { id: true, name: true } },
//         level:   { select: { id: true, name: true } },
//       },
//       orderBy: { scheduledAt: "asc" },
//     });

//     return NextResponse.json(webinars);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// // ── POST /api/admin/webinars ──────────────────────────────────────────────────
// export async function POST(req: NextRequest) {
//   const authErr = await requireAdmin(req);
//   if (authErr) return authErr;

//   try {
//     const body = await req.json();

//     const {
//       title, description, platform, meetingLink, meetingId, passcode,
//       hostName, hostEmail, scheduledAt, durationMins,
//       programId, levelId, bannerUrl,
//       status, isActive,
//       sendEmail,        // boolean — send email on create
//       sendNotification, // boolean — send in-app notification on create
//     } = body;

//     if (!title || !meetingLink || !scheduledAt) {
//       return NextResponse.json(
//         { error: "title, meetingLink and scheduledAt are required" },
//         { status: 400 }
//       );
//     }

//     // Resolve status: explicit "active"/"inactive" > isActive boolean > default "active"
//     let resolvedStatus: "active" | "inactive" = "active";
//     if (status === "active" || status === "inactive") {
//       resolvedStatus = status;
//     } else if (isActive === false) {
//       resolvedStatus = "inactive";
//     }

//     const webinar = await prisma.webinar.create({
//       data: {
//         title,
//         description:  description  || null,
//         platform:     platform     || "zoom",
//         meetingLink,
//         meetingId:    meetingId    || null,
//         passcode:     passcode     || null,
//         hostName:     hostName     || null,
//         hostEmail:    hostEmail    || null,
//         scheduledAt:  new Date(scheduledAt),
//         durationMins: durationMins ? Number(durationMins) : 60,
//         programId:    programId    || null,
//         levelId:      levelId      || null,
//         bannerUrl:    bannerUrl    || null,
//         status:       resolvedStatus,
//       },
//       include: {
//         program: { select: { id: true, name: true } },
//         level:   { select: { id: true, name: true } },
//       },
//     });

//     // ── Optionally send in-app notifications ──────────────────────────────────
//     if (sendNotification) {
//       await sendWebinarNotifications(webinar);
//     }

//     // ── Optionally send emails ────────────────────────────────────────────────
//     if (sendEmail) {
//       await sendWebinarEmails(webinar);
//       await prisma.webinar.update({
//         where: { id: webinar.id },
//         data:  {
//           emailSent:      true,
//           emailSentAt:    new Date(),
//           emailSentCount: { increment: 1 },
//         },
//       });
//     }

//     // Return the latest webinar state (counts may have changed)
//     const fresh = await prisma.webinar.findUnique({
//       where: { id: webinar.id },
//       include: {
//         program: { select: { id: true, name: true } },
//         level:   { select: { id: true, name: true } },
//       },
//     });

//     return NextResponse.json(fresh, { status: 201 });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// /**
//  * Deletes ALL existing notifications for this webinar across all users,
//  * then creates fresh unread ones. This way every "send" is a true re-alert.
//  */
// async function sendWebinarNotifications(webinar: any) {
//   const targets = await getWebinarTargets(webinar);
//   if (!targets.length) return;

//   const dateStr = new Date(webinar.scheduledAt).toLocaleString("en-IN", {
//     dateStyle: "medium", timeStyle: "short",
//   });

//   // Wipe old notifications so every send = fresh unread for everyone
//   await prisma.notification.deleteMany({ where: { webinarId: webinar.id } });

//   await prisma.notification.createMany({
//     data: targets.map(t => ({
//       userId:    t.userId,
//       type:      "webinar" as const,
//       title:     `📹 Webinar: ${webinar.title}`,
//       message:   `Scheduled on ${dateStr}. Click to join.`,
//       link:      webinar.meetingLink,
//       webinarId: webinar.id,
//       isRead:    false,
//     })),
//     skipDuplicates: true,
//   });

//   await prisma.webinar.update({
//     where: { id: webinar.id },
//     data: {
//       notificationSent:      true,
//       notificationSentAt:    new Date(),
//       notificationSentCount: { increment: 1 },
//     },
//   });
// }

// async function sendWebinarEmails(webinar: any) {
//   const targets = await getEmailTargets(webinar);
//   await Promise.allSettled(
//     targets.map(({ email, name }) =>
//       sendWebinarEmail({ email, webinar, recipientName: name })
//     )
//   );
// }








import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { getWebinarTargets, getEmailTargets } from "@/lib/helpers/notification-helpers";
import { sendWebinarEmail } from "@/lib/helpers/webinarEmail";

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

export async function POST(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();

    const {
      title, description, platform, meetingLink, meetingId, passcode,
      hostName, hostEmail, scheduledAt, durationMins,
      programId, levelId, bannerUrl,
      attachmentUrl, attachmentName, attachmentType, attachmentSize,
      status, isActive,
      sendEmail,
      sendNotification,
    } = body;

    if (!title || !meetingLink || !scheduledAt) {
      return NextResponse.json(
        { error: "title, meetingLink and scheduledAt are required" },
        { status: 400 }
      );
    }

    let resolvedStatus: "active" | "inactive" = "active";
    if (status === "active" || status === "inactive") {
      resolvedStatus = status;
    } else if (isActive === false) {
      resolvedStatus = "inactive";
    }

    const webinar = await prisma.webinar.create({
      data: {
        title,
        description:    description    || null,
        platform:       platform       || "zoom",
        meetingLink,
        meetingId:      meetingId      || null,
        passcode:       passcode       || null,
        hostName:       hostName       || null,
        hostEmail:      hostEmail      || null,
        scheduledAt:    new Date(scheduledAt),
        durationMins:   durationMins ? Number(durationMins) : 60,
        programId:      programId      || null,
        levelId:        levelId        || null,
        bannerUrl:      bannerUrl      || null,
        attachmentUrl:  attachmentUrl  || null,
        attachmentName: attachmentName || null,
        attachmentType: attachmentType || null,
        attachmentSize: attachmentSize ? Number(attachmentSize) : null,
        status:         resolvedStatus,
      },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
    });

    if (sendNotification) {
      await sendWebinarNotifications(webinar);
    }

    if (sendEmail) {
      await sendWebinarEmails(webinar);
      await prisma.webinar.update({
        where: { id: webinar.id },
        data:  {
          emailSent:      true,
          emailSentAt:    new Date(),
          emailSentCount: { increment: 1 },
        },
      });
    }

    const fresh = await prisma.webinar.findUnique({
      where: { id: webinar.id },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(fresh, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function sendWebinarNotifications(webinar: any) {
  const targets = await getWebinarTargets(webinar);
  if (!targets.length) return;

  const dateStr = new Date(webinar.scheduledAt).toLocaleString("en-IN", {
    dateStyle: "medium", timeStyle: "short",
  });

  await prisma.notification.deleteMany({ where: { webinarId: webinar.id } });

  type NotifResult = { userId: string; name: string; success: boolean; errorMsg?: string };
  const results: NotifResult[] = [];

  await Promise.allSettled(
    targets.map(async (t: any) => {
      try {
        await prisma.notification.create({
          data: {
            userId:    t.userId,
            type:      "webinar" as const,
            title:     `📹 Webinar: ${webinar.title}`,
            message:   `Scheduled on ${dateStr}. Click to join.`,
            link:      webinar.meetingLink,
            webinarId: webinar.id,
            isRead:    false,
          },
        });
        results.push({ userId: t.userId, name: t.name ?? t.userId, success: true });
      } catch (err: any) {
        results.push({ userId: t.userId, name: t.name ?? t.userId, success: false, errorMsg: err?.message });
      }
    })
  );

  const now    = new Date();
  const sent   = results.filter(r => r.success).length;

  await prisma.webinarNotificationLog.deleteMany({ where: { webinarId: webinar.id } });
  await prisma.webinarNotificationLog.createMany({
    data: results.map(r => ({
      webinarId: webinar.id,
      userId:    r.userId,
      name:      r.name,
      status:    r.success ? "sent" : "failed",
      errorMsg:  r.errorMsg ?? null,
      sentAt:    r.success ? now : null,
    })),
  });

  await prisma.webinar.update({
    where: { id: webinar.id },
    data: {
      notificationSent:      true,
      notificationSentAt:    now,
      notificationSentCount: { increment: 1 },
    },
  });
}

async function sendWebinarEmails(webinar: any) {
  const targets = await getEmailTargets(webinar);
  await Promise.allSettled(
    targets.map(({ email, name }: { email: string; name: string }) =>
      sendWebinarEmail({ email, webinar, recipientName: name })
    )
  );
}




