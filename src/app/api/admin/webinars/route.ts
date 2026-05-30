// // app/api/admin/webinars/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";
// import { sendWebinarEmail } from "@/lib/webinarEmail";

// // ── GET /api/admin/webinars ───────────────────────────────────────────────────
// export async function GET(req: NextRequest) {
//   try {
//     await requireAdmin(req);
//     const { searchParams } = new URL(req.url);
//     const programId = searchParams.get("programId");
//     const levelId   = searchParams.get("levelId");
//     const status    = searchParams.get("status");

//     const webinars = await prisma.webinar.findMany({
//       where: {
//         ...(programId ? { programId } : {}),
//         ...(levelId   ? { levelId }   : {}),
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
//   try {
//     await requireAdmin(req);
//     const body = await req.json();

//     const {
//       title, description, platform, meetingLink, meetingId, passcode,
//       hostName, hostEmail, scheduledAt, durationMins, programId, levelId,
//       bannerUrl, sendEmail,
//     } = body;

//     if (!title || !meetingLink || !scheduledAt)
//       return NextResponse.json({ error: "title, meetingLink and scheduledAt are required" }, { status: 400 });

//     const webinar = await prisma.webinar.create({
//       data: {
//         title, description: description || null,
//         platform: platform || "zoom",
//         meetingLink, meetingId: meetingId || null,
//         passcode: passcode || null,
//         hostName: hostName || null, hostEmail: hostEmail || null,
//         scheduledAt: new Date(scheduledAt),
//         durationMins: durationMins ? Number(durationMins) : 60,
//         programId: programId || null, levelId: levelId || null,
//         bannerUrl: bannerUrl || null,
//       },
//       include: {
//         program: { select: { id: true, name: true } },
//         level:   { select: { id: true, name: true } },
//       },
//     });

//     // Build notifications for targeted users
//     await createWebinarNotifications(webinar);

//     // Send emails if requested
//     if (sendEmail) {
//       await sendWebinarEmails(webinar);
//       await prisma.webinar.update({
//         where: { id: webinar.id },
//         data: { emailSent: true, emailSentAt: new Date() },
//       });
//     }

//     return NextResponse.json(webinar, { status: 201 });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// async function getTargetedUsers(webinar: any) {
//   if (webinar.programId) {
//     // Students in that program (optionally filtered by level)
//     const students = await prisma.student.findMany({
//       where: {
//         programId: webinar.programId,
//         ...(webinar.levelId ? { programLevelId: webinar.levelId } : {}),
//         status: "Active",
//       },
//       include: { user: { select: { id: true, email: true } } },
//     });
//     return students.map((s) => ({
//       userId:      s.user.id,
//       email:       s.parentEmail || s.user.email,
//       studentName: s.fullName,
//     }));
//   }
//   // All users
//   const users = await prisma.user.findMany({
//     where: { role: { in: ["student", "teacher", "user"] } },
//     select: { id: true, email: true },
//   });
//   return users.map((u) => ({ userId: u.id, email: u.email, studentName: null }));
// }

// async function createWebinarNotifications(webinar: any) {
//   const targets = await getTargetedUsers(webinar);
//   if (!targets.length) return;

//   const dateStr = new Date(webinar.scheduledAt).toLocaleString("en-IN", {
//     dateStyle: "medium", timeStyle: "short",
//   });

//   await prisma.notification.createMany({
//     data: targets.map((t) => ({
//       userId:    t.userId,
//       type:      "webinar",
//       title:     `📹 Webinar: ${webinar.title}`,
//       message:   `Scheduled on ${dateStr}. Click to join.`,
//       link:      webinar.meetingLink,
//       webinarId: webinar.id,
//     })),
//     skipDuplicates: true,
//   });
// }

// async function sendWebinarEmails(webinar: any) {
//   const targets = await getTargetedUsers(webinar);
//   const emails  = [...new Set(targets.map((t) => t.email).filter(Boolean))];
//   for (const email of emails) {
//     try {
//       await sendWebinarEmail({ email, webinar });
//     } catch {}
//   }
// }












// // app/api/admin/webinars/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";
// import { sendWebinarEmail } from "@/lib/webinarEmail";

// export async function GET(req: NextRequest) {
//   try {
//     await requireAdmin(req);
//     const { searchParams } = new URL(req.url);
//     const programId = searchParams.get("programId");
//     const levelId   = searchParams.get("levelId");
//     const status    = searchParams.get("status");

//     // Auto-deactivate past webinars
//     await prisma.webinar.updateMany({
//       where: {
//         scheduledAt: {
//           lt: new Date(Date.now() - 60 * 60 * 1000), // past by more than durationMins ideally, but 1hr as safe default
//         },
//         status: "active",
//       },
//       data: { status: "inactive" },
//     });

//     const webinars = await prisma.webinar.findMany({
//       where: {
//         ...(programId ? { programId } : {}),
//         ...(levelId   ? { levelId }   : {}),
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

// export async function POST(req: NextRequest) {
//   try {
//     await requireAdmin(req);
//     const body = await req.json();

//     const {
//       title, description, platform, meetingLink, meetingId, passcode,
//       hostName, hostEmail, scheduledAt, durationMins, programId, levelId,
//       bannerUrl, sendEmail,
//     } = body;

//     if (!title || !meetingLink || !scheduledAt)
//       return NextResponse.json({ error: "title, meetingLink and scheduledAt are required" }, { status: 400 });

//     const webinar = await prisma.webinar.create({
//       data: {
//         title,
//         description: description || null,
//         platform: platform || "zoom",
//         meetingLink,
//         meetingId: meetingId || null,
//         passcode: passcode || null,
//         hostName: hostName || null,
//         hostEmail: hostEmail || null,
//         scheduledAt: new Date(scheduledAt),
//         durationMins: durationMins ? Number(durationMins) : 60,
//         programId: programId || null,
//         levelId: levelId || null,
//         bannerUrl: bannerUrl || null,
//         status: "active",
//       },
//       include: {
//         program: { select: { id: true, name: true } },
//         level:   { select: { id: true, name: true } },
//       },
//     });

//     await createWebinarNotifications(webinar);

//     if (sendEmail) {
//       await sendWebinarEmails(webinar);
//       await prisma.webinar.update({
//         where: { id: webinar.id },
//         data: { emailSent: true, emailSentAt: new Date() },
//       });
//     }

//     return NextResponse.json(webinar, { status: 201 });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// async function getTargetedUsers(webinar: any) {
//   if (webinar.programId) {
//     const students = await prisma.student.findMany({
//       where: {
//         programId: webinar.programId,
//         ...(webinar.levelId ? { programLevelId: webinar.levelId } : {}),
//         status: "Active",
//       },
//       include: { user: { select: { id: true, email: true } } },
//     });
//     return students.map((s) => ({
//       userId:      s.user.id,
//       email:       s.parentEmail || s.user.email,
//       studentName: s.fullName,
//     }));
//   }
//   const users = await prisma.user.findMany({
//     where: { role: { in: ["student", "teacher", "user"] } },
//     select: { id: true, email: true },
//   });
//   return users.map((u) => ({ userId: u.id, email: u.email, studentName: null }));
// }

// async function createWebinarNotifications(webinar: any) {
//   const targets = await getTargetedUsers(webinar);
//   if (!targets.length) return;

//   const dateStr = new Date(webinar.scheduledAt).toLocaleString("en-IN", {
//     dateStyle: "medium", timeStyle: "short",
//   });

//   await prisma.notification.createMany({
//     data: targets.map((t) => ({
//       userId:    t.userId,
//       type:      "webinar" as const,
//       title:     `📹 Webinar: ${webinar.title}`,
//       message:   `Scheduled on ${dateStr}. Click to join.`,
//       link:      webinar.meetingLink,
//       webinarId: webinar.id,
//     })),
//     skipDuplicates: true,
//   });
// }

// async function sendWebinarEmails(webinar: any) {
//   const targets = await getTargetedUsers(webinar);
//   const emails  = [...new Set(targets.map((t) => t.email).filter(Boolean))];
//   for (const email of emails) {
//     try { await sendWebinarEmail({ email, webinar }); } catch {}
//   }
// }













import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { sendWebinarEmail } from "@/lib/webinarEmail";

// export async function GET(req: NextRequest) {
//   try {
//     await requireAdmin(req);
//     const { searchParams } = new URL(req.url);
//     const programId = searchParams.get("programId");
//     const status    = searchParams.get("status");

//     // Auto-deactivate webinars whose time has passed
//     await prisma.webinar.updateMany({
//       where: {
//         status: "active",
//         scheduledAt: { lt: new Date() },
//         // Only mark inactive if scheduledAt + durationMins < now
//         // We use a raw check below via a separate query for accuracy
//       },
//       data: { status: "inactive" },
//     });

//     // More precise: check scheduledAt + durationMins < now
//     // The above catches most cases; for exact duration, use this raw update:
//     await prisma.$executeRaw`
//       UPDATE webinars
//       SET status = 'inactive'
//       WHERE status = 'active'
//         AND (scheduled_at + (duration_mins * interval '1 minute')) < NOW()
//     `;

//     const webinars = await prisma.webinar.findMany({
//       where: {
//         ...(programId ? { programId } : {}),
//         ...(status    ? { status: status as any } : {}),
//       },
//       include: {
//         program: { select: { id: true, name: true } },
//         level:   { select: { id: true, name: true } },
//       },
//       orderBy: { scheduledAt: "desc" },
//     });

//     return NextResponse.json(webinars);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const programId = searchParams.get("programId");
    const status = searchParams.get("status");

    // Auto-expire webinars whose end time has passed
    const activeWebinars = await prisma.webinar.findMany({
      where: {
        status: "active",
      },
      select: {
        id: true,
        scheduledAt: true,
        durationMins: true,
      },
    });

    const expiredIds = activeWebinars
      .filter((webinar) => {
        const endTime =
          webinar.scheduledAt.getTime() +
          webinar.durationMins * 60 * 1000;

        return endTime < Date.now();
      })
      .map((webinar) => webinar.id);

    if (expiredIds.length > 0) {
      await prisma.webinar.updateMany({
        where: {
          id: {
            in: expiredIds,
          },
        },
        data: {
          status: "inactive",
        },
      });
    }

    const webinars = await prisma.webinar.findMany({
      where: {
        ...(programId ? { programId } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: {
        program: {
          select: {
            id: true,
            name: true,
          },
        },
        level: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "desc",
      },
    });

    return NextResponse.json(webinars);
  } catch (err: any) {
    console.error("WEBINARS GET ERROR:", err);

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}



export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();

    const {
      title, description, platform, meetingLink, meetingId, passcode,
      hostName, hostEmail, scheduledAt, durationMins, programId, levelId,
      bannerUrl, sendEmail,
    } = body;

    if (!title || !meetingLink || !scheduledAt)
      return NextResponse.json(
        { error: "title, meetingLink and scheduledAt are required" },
        { status: 400 }
      );

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
        status: "active",
      },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
    });

    // Always create in-app notifications on create
    await createWebinarNotifications(webinar);

    if (sendEmail) {
      const { sent } = await sendWebinarEmails(webinar);
      await prisma.webinar.update({
        where: { id: webinar.id },
        data: {
          emailSent:      true,
          emailSentAt:    new Date(),
          emailSentCount: sent,
        },
      });
    }

    return NextResponse.json(webinar, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── Shared helpers ────────────────────────────────────────────────────────────

export async function getTargetedUsers(webinar: any) {
  if (webinar.programId) {
    const students = await prisma.student.findMany({
      where: {
        programId: webinar.programId,
        ...(webinar.levelId ? { programLevelId: webinar.levelId } : {}),
        status: "Active",
      },
      include: { user: { select: { id: true, email: true } } },
    });

    const seen  = new Set<string>();
    const users: { userId: string; email: string; name: string }[] = [];

    for (const s of students) {
      // Student user account
      if (s.user?.email && !seen.has(s.user.email)) {
        seen.add(s.user.email);
        users.push({ userId: s.userId, email: s.user.email, name: s.fullName });
      }
      // Parent email (may differ) — still map to student's userId for notifications
      if (s.parentEmail && !seen.has(s.parentEmail)) {
        seen.add(s.parentEmail);
        users.push({ userId: s.userId, email: s.parentEmail, name: s.parentName || s.fullName });
      }
    }
    return users;
  }

  // All users + all parent emails (deduped)
  const dbUsers = await prisma.user.findMany({
    where: { role: { in: ["student", "teacher", "user"] } },
    select: { id: true, email: true, name: true },
  });

  const students = await prisma.student.findMany({
    where:  { parentEmail: { not: null }, status: "Active" },
    select: { userId: true, parentEmail: true, parentName: true, fullName: true },
  });

  const seen  = new Set<string>();
  const users: { userId: string; email: string; name: string }[] = [];

  for (const u of dbUsers) {
    if (u.email && !seen.has(u.email)) {
      seen.add(u.email);
      users.push({ userId: u.id, email: u.email, name: u.name || u.email });
    }
  }
  for (const s of students) {
    if (s.parentEmail && !seen.has(s.parentEmail)) {
      seen.add(s.parentEmail);
      users.push({ userId: s.userId, email: s.parentEmail, name: s.parentName || s.fullName });
    }
  }

  return users;
}

async function createWebinarNotifications(webinar: any) {
  const targets = await getTargetedUsers(webinar);
  if (!targets.length) return 0;

  const dateStr = new Date(webinar.scheduledAt).toLocaleString("en-IN", {
    dateStyle: "medium", timeStyle: "short",
  });

  await prisma.notification.createMany({
    data: targets.map((t) => ({
      userId:    t.userId,
      type:      "webinar" as const,
      title:     `📹 Webinar: ${webinar.title}`,
      message:   `Scheduled on ${dateStr}. Click to join.`,
      link:      webinar.meetingLink,
      webinarId: webinar.id,
    })),
    skipDuplicates: true,
  });

  return targets.length;
}

async function sendWebinarEmails(webinar: any) {
  const targets = await getTargetedUsers(webinar);
  if (!targets.length) return { sent: 0, failed: 0, total: 0 };

  const results = await Promise.allSettled(
    targets.map((t) =>
      sendWebinarEmail({ email: t.email, webinar, recipientName: t.name })
    )
  );

  return {
    sent:   results.filter((r) => r.status === "fulfilled").length,
    failed: results.filter((r) => r.status === "rejected").length,
    total:  targets.length,
  };
}