// // app/api/admin/announcements/route.ts
// import { NextRequest, NextResponse }      from "next/server";
// import { prisma }                          from "@/lib/helpers/prisma";
// import { requireAdmin }                    from "@/lib/helpers/auth-helpers";
// import { sendAnnouncementEmails }          from "@/lib/helpers/mailer";
// import { resolveRecipients }              from "@/lib/helpers/announcementRecipients";
// import { getAnnouncementTargets }          from "@/lib/helpers/notification-helpers";

// const announcementInclude = {
//   program: { select: { id: true, name: true } },
//   level:   { select: { id: true, name: true } },
// } as const;

// // ── GET /api/admin/announcements ──────────────────────────────────────────────
// export async function GET(req: NextRequest) {
//   const guard = await requireAdmin(req);
//   if (guard) return guard;

//   try {
//     const { searchParams } = new URL(req.url);
//     const audience  = searchParams.get("audience")  ?? undefined;
//     const programId = searchParams.get("programId") ?? undefined;
//     const levelId   = searchParams.get("levelId")   ?? undefined;
//     const active    = searchParams.get("active");

//     const announcements = await prisma.announcement.findMany({
//       where: {
//         ...(audience  ? { audience: audience as any } : {}),
//         ...(programId ? { programId }                 : {}),
//         ...(levelId   ? { levelId }                   : {}),
//         ...(active === "true"  ? { isActive: true }   : {}),
//         ...(active === "false" ? { isActive: false }  : {}),
//       },
//       include: announcementInclude,
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json(announcements);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// // ── POST /api/admin/announcements ─────────────────────────────────────────────
// export async function POST(req: NextRequest) {
//   const guard = await requireAdmin(req);
//   if (guard) return guard;

//   try {
//     const body = await req.json();
//     const {
//       title, message, priority, audience,
//       programId, levelId, expiresAt,
//       sendEmail      = false,
//       sendNotification = true,   // ← default: always push in-app notification on create
//       fileUrl, storagePath, fileType, fileName,
//     } = body;

//     if (!title?.trim() || !message?.trim())
//       return NextResponse.json({ error: "Title and message are required" }, { status: 400 });

//     // ── Create announcement ──────────────────────────────────────────────────
//     const announcement = await prisma.announcement.create({
//       data: {
//         title:       title.trim(),
//         message:     message.trim(),
//         priority:    priority    ?? "normal",
//         audience:    audience    ?? "all",
//         programId:   programId   ?? null,
//         levelId:     levelId     ?? null,
//         expiresAt:   expiresAt   ? new Date(expiresAt) : null,
//         isActive:    true,
//         emailSent:   false,
//         fileUrl:     fileUrl     ?? null,
//         storagePath: storagePath ?? null,
//         fileType:    fileType    ?? null,
//         fileName:    fileName    ?? null,
//       },
//       include: announcementInclude,
//     });

//     // ── Push in-app notifications ────────────────────────────────────────────
//     if (sendNotification) {
//       await pushAnnouncementNotifications(announcement);
//     }

//     // ── Send emails if requested ─────────────────────────────────────────────
//     let emailResult: { sent: number; failed: number } | null = null;

//     if (sendEmail) {
//       const to = await resolveRecipients({ audience, programId, levelId });
//       emailResult = await sendAnnouncementEmails({
//         to,
//         title:     announcement.title,
//         message:   announcement.message,
//         priority:  announcement.priority,
//         audience:  announcement.audience,
//         fileUrl:   announcement.fileUrl,
//         fileName:  announcement.fileName,
//         fileType:  announcement.fileType,
//         expiresAt: announcement.expiresAt?.toISOString() ?? null,
//       });

//       if (emailResult.sent > 0) {
//         await prisma.announcement.update({
//           where: { id: announcement.id },
//           data:  { emailSent: true },
//         });
//         announcement.emailSent = true;
//       }
//     }

//     return NextResponse.json(
//       { ...announcement, ...(emailResult ? { emailResult } : {}) },
//       { status: 201 }
//     );
//   } catch (err: any) {
//     console.error("POST /announcements error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// // ─── Helper: create in-app notifications for an announcement ─────────────────
// export async function pushAnnouncementNotifications(announcement: {
//   id:        string;
//   title:     string;
//   message:   string;
//   audience:  string;
//   priority:  string;
//   programId: string | null;
//   levelId:   string | null;
// }) {
//   const targets = await getAnnouncementTargets({
//     audience:  announcement.audience,
//     programId: announcement.programId,
//     levelId:   announcement.levelId,
//   });

//   if (!targets.length) return 0;

//   const priorityEmoji: Record<string, string> = {
//     urgent: "🚨",
//     normal: "📢",
//     info:   "ℹ️",
//   };
//   const emoji = priorityEmoji[announcement.priority] ?? "📢";

//   // Re-alert: mark any existing announcement notifications as unread
//   await prisma.notification.updateMany({
//     where: {
//       type:    "announcement",
//       title:   `${emoji} ${announcement.title}`,
//       message: { contains: announcement.id }, // message won't contain id — so this safely no-ops
//     },
//     data: { isRead: false },
//   });

//   // Create for users who don't have one yet
//   await prisma.notification.createMany({
//     data: targets.map(t => ({
//       userId:  t.userId,
//       type:    "announcement" as const,
//       title:   `${emoji} ${announcement.title}`,
//       message: announcement.message.length > 120
//         ? announcement.message.slice(0, 120) + "…"
//         : announcement.message,
//       isRead:  false,
//     })),
//     skipDuplicates: true,
//   });

//   return targets.length;
// }

// app/api/admin/announcements/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import {
  sendAnnouncementEmails,
  logEmailDelivery,
  resolveRecipients,
} from "@/lib/helpers/announcement-email";
import { getAnnouncementTargets } from "@/lib/helpers/notification-helpers";
import type { EmailResult } from "@/lib/helpers/announcement-email";


const announcementInclude = {
  program: { select: { id: true, name: true } },
  level: { select: { id: true, name: true } },
} as const;

// ── GET /api/admin/announcements ──────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get("audience") ?? undefined;
    const programId = searchParams.get("programId") ?? undefined;
    const levelId = searchParams.get("levelId") ?? undefined;
    const active = searchParams.get("active");

    const announcements = await prisma.announcement.findMany({
      where: {
        ...(audience ? { audience: audience as any } : {}),
        ...(programId ? { programId } : {}),
        ...(levelId ? { levelId } : {}),
        ...(active === "true" ? { isActive: true } : {}),
        ...(active === "false" ? { isActive: false } : {}),
      },
      include: announcementInclude,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(announcements);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST /api/admin/announcements ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    const body = await req.json();
    const {
      title,
      message,
      priority,
      audience,
      programId,
      levelId,
      expiresAt,
      sendEmail = false,
      sendNotification = false,
      fileUrl,
      storagePath,
      fileType,
      fileName,
    } = body;

    if (!title?.trim() || !message?.trim())
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 },
      );

    // ── Create ───────────────────────────────────────────────────────────────
    const announcement = await prisma.announcement.create({
      data: {
        title: title.trim(),
        message: message.trim(),
        priority: priority ?? "normal",
        audience: audience ?? "all",
        programId: programId ?? null,
        levelId: levelId ?? null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true,
        emailSent: false,
        emailSentCount: 0,
        fileUrl: fileUrl ?? null,
        storagePath: storagePath ?? null,
        fileType: fileType ?? null,
        fileName: fileName ?? null,
      },
      include: announcementInclude,
    });

    // ── In-app notification ──────────────────────────────────────────────────
    let notifCount = 0;
    if (sendNotification) {
      notifCount = await pushAnnouncementNotifications(announcement);
    }

    // ── Email ────────────────────────────────────────────────────────────────
    // let emailResult: { sent: number; failed: number } | null = null;

    let emailResult: EmailResult | null = null;

    if (sendEmail) {
      const to = await resolveRecipients({ audience, programId, levelId });

      emailResult = await sendAnnouncementEmails({
        to,
        title: announcement.title,
        message: announcement.message,
        priority: announcement.priority,
        audience: announcement.audience,
        fileUrl: announcement.fileUrl,
        fileName: announcement.fileName,
        fileType: announcement.fileType,
        expiresAt: announcement.expiresAt?.toISOString() ?? null,
      });

      // Persist delivery log
      await logEmailDelivery(announcement.id, to, emailResult);

      if (emailResult.sent > 0) {
        await prisma.announcement.update({
          where: { id: announcement.id },
          data: {
            emailSent: true,
            emailSentCount: { increment: emailResult.sent },
          },
        });
        (announcement as any).emailSent = true;
        (announcement as any).emailSentCount = emailResult.sent;
      }
    }

    return NextResponse.json(
      {
        ...announcement,
        ...(emailResult ? { emailResult } : {}),
        ...(notifCount ? { notifCount } : {}),
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("[POST /announcements]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── Helper: push in-app notifications ─────────────────────────────────────────
export async function pushAnnouncementNotifications(announcement: {
  id: string;
  title: string;
  message: string;
  audience: string;
  priority: string;
  programId: string | null;
  levelId: string | null;
}): Promise<number> {
  const targets = await getAnnouncementTargets({
    audience: announcement.audience,
    programId: announcement.programId,
    levelId: announcement.levelId,
  });

  if (!targets.length) return 0;

  const emoji: Record<string, string> = {
    urgent: "🚨",
    normal: "📢",
    info: "ℹ️",
  };
  const e = emoji[announcement.priority] ?? "📢";

  await prisma.notification.createMany({
    data: targets.map((t) => ({
      userId: t.userId,
      type: "announcement" as const,
      title: `${e} ${announcement.title}`,
      message:
        announcement.message.length > 120
          ? announcement.message.slice(0, 120) + "…"
          : announcement.message,
      isRead: false,
    })),
    skipDuplicates: true,
  });

  return targets.length;
}
