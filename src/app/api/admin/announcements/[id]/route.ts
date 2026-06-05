// // app/api/admin/announcements/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma }                    from "@/lib/prisma";
// import { requireAdmin }              from "@/lib/auth-helpers";
// import { sendAnnouncementEmails }    from "@/lib/mailer";
// import { resolveRecipients }         from "@/lib/announcementRecipients";
// import { createClient }              from "@supabase/supabase-js";

// const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// const announcementInclude = {
//   program: { select: { id: true, name: true } },
//   level:   { select: { id: true, name: true } },
// } as const;

// type Ctx = { params: Promise<{ id: string }> };

// // ── GET /api/admin/announcements/[id] ─────────────────────────────────────────
// export async function GET(req: NextRequest, ctx: Ctx) {
//   const guard = await requireAdmin(req);
//   if (guard) return guard;

//   const { id } = await ctx.params;

//   const announcement = await prisma.announcement.findUnique({
//     where:   { id },
//     include: announcementInclude,
//   });

//   if (!announcement)
//     return NextResponse.json({ error: "Not found" }, { status: 404 });

//   return NextResponse.json(announcement);
// }

// // ── PATCH /api/admin/announcements/[id] ───────────────────────────────────────
// // Supports partial update. Pass sendEmail: true to resend.
// export async function PATCH(req: NextRequest, ctx: Ctx) {
//   const guard = await requireAdmin(req);
//   if (guard) return guard;

//   const { id } = await ctx.params;

//   const existing = await prisma.announcement.findUnique({ where: { id } });
//   if (!existing)
//     return NextResponse.json({ error: "Not found" }, { status: 404 });

//   let body: Record<string, any>;
//   try { body = await req.json(); }
//   catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

//   const {
//     title, message, priority, audience,
//     programId, levelId, expiresAt, isActive,
//     fileUrl, storagePath, fileType, fileName,
//     sendEmail = false,
//   } = body;

//   // Build update payload — only include keys that were sent
//   const data: Record<string, any> = {};
//   if (title     !== undefined) data.title       = title?.trim();
//   if (message   !== undefined) data.message     = message?.trim();
//   if (priority  !== undefined) data.priority    = priority;
//   if (audience  !== undefined) data.audience    = audience;
//   if (programId !== undefined) data.programId   = programId  ?? null;
//   if (levelId   !== undefined) data.levelId     = levelId    ?? null;
//   if (expiresAt !== undefined) data.expiresAt   = expiresAt ? new Date(expiresAt) : null;
//   if (isActive  !== undefined) data.isActive    = isActive;
//   if (fileUrl   !== undefined) data.fileUrl     = fileUrl    ?? null;
//   if (storagePath !== undefined) data.storagePath = storagePath ?? null;
//   if (fileType  !== undefined) data.fileType    = fileType   ?? null;
//   if (fileName  !== undefined) data.fileName    = fileName   ?? null;

//   const updated = await prisma.announcement.update({
//     where:   { id },
//     data,
//     include: announcementInclude,
//   });

//   // ── Resend / send email ────────────────────────────────────────────────────
//   let emailResult: { sent: number; failed: number } | null = null;

//   if (sendEmail) {
//     const resolveAudience  = audience  ?? existing.audience;
//     const resolveProgramId = programId ?? existing.programId;
//     const resolveLevelId   = levelId   ?? existing.levelId;

//     const to = await resolveRecipients({
//       audience:  resolveAudience,
//       programId: resolveProgramId,
//       levelId:   resolveLevelId,
//     });

//     emailResult = await sendAnnouncementEmails({
//       to,
//       title:     updated.title,
//       message:   updated.message,
//       priority:  updated.priority,
//       audience:  updated.audience,
//       fileUrl:   updated.fileUrl,
//       fileName:  updated.fileName,
//       fileType:  updated.fileType,
//       expiresAt: updated.expiresAt?.toISOString() ?? null,
//     });

//     if (emailResult.sent > 0) {
//       await prisma.announcement.update({ where: { id }, data: { emailSent: true } });
//       updated.emailSent = true;
//     }
//   }

//   return NextResponse.json({
//     ...updated,
//     ...(emailResult ? { emailResult } : {}),
//   });
// }

// // ── DELETE /api/admin/announcements/[id] ──────────────────────────────────────
// // Also deletes the file from Supabase Storage if storagePath exists.
// export async function DELETE(req: NextRequest, ctx: Ctx) {
//   const guard = await requireAdmin(req);
//   if (guard) return guard;

//   const { id } = await ctx.params;

//   const existing = await prisma.announcement.findUnique({ where: { id } });
//   if (!existing)
//     return NextResponse.json({ error: "Not found" }, { status: 404 });

//   // Delete from storage first (non-fatal)
//   if (existing.storagePath) {
//     const { error } = await supabaseAdmin.storage
//       .from("announcements")
//       .remove([existing.storagePath]);
//     if (error) console.warn("Storage delete warning:", error.message);
//   }

//   await prisma.announcement.delete({ where: { id } });

//   return NextResponse.json({ success: true });
// }



// app/api/admin/announcements/[id]/route.ts
import { NextRequest, NextResponse }         from "next/server";
import { prisma }                             from "@/lib/helpers/prisma";
import { requireAdmin }                       from "@/lib/helpers/auth-helpers";
import { sendAnnouncementEmails }             from "@/lib/helpers/mailer";
import { resolveRecipients }                 from "@/lib/helpers/announcementRecipients";
import { pushAnnouncementNotifications }      from "../route";
import { createClient }                       from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const announcementInclude = {
  program: { select: { id: true, name: true } },
  level:   { select: { id: true, name: true } },
} as const;

type Ctx = { params: Promise<{ id: string }> };

// ── GET /api/admin/announcements/[id] ─────────────────────────────────────────
export async function GET(req: NextRequest, ctx: Ctx) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await ctx.params;
  const announcement = await prisma.announcement.findUnique({
    where: { id }, include: announcementInclude,
  });
  if (!announcement) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(announcement);
}

// ── PATCH /api/admin/announcements/[id] ───────────────────────────────────────
// Extra body keys:
//   sendEmail:        boolean  — resend email to recipients
//   sendNotification: boolean  — push/re-push in-app notification
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await ctx.params;

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: Record<string, any>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const {
    title, message, priority, audience,
    programId, levelId, expiresAt, isActive,
    fileUrl, storagePath, fileType, fileName,
    sendEmail        = false,
    sendNotification = false,
  } = body;

  // Build partial update
  const data: Record<string, any> = {};
  if (title       !== undefined) data.title       = title?.trim();
  if (message     !== undefined) data.message     = message?.trim();
  if (priority    !== undefined) data.priority    = priority;
  if (audience    !== undefined) data.audience    = audience;
  if (programId   !== undefined) data.programId   = programId  ?? null;
  if (levelId     !== undefined) data.levelId     = levelId    ?? null;
  if (expiresAt   !== undefined) data.expiresAt   = expiresAt  ? new Date(expiresAt) : null;
  if (isActive    !== undefined) data.isActive    = isActive;
  if (fileUrl     !== undefined) data.fileUrl     = fileUrl    ?? null;
  if (storagePath !== undefined) data.storagePath = storagePath ?? null;
  if (fileType    !== undefined) data.fileType    = fileType   ?? null;
  if (fileName    !== undefined) data.fileName    = fileName   ?? null;

  const updated = await prisma.announcement.update({
    where: { id }, data, include: announcementInclude,
  });

  // ── Push in-app notification (re-push = mark old ones unread + add new) ────
  let notifCount = 0;
  if (sendNotification) {
    // Delete old notifications for this announcement title so we get a fresh one
    await prisma.notification.deleteMany({
      where: {
        type:  "announcement",
        title: { contains: updated.title },
      },
    });
    notifCount = await pushAnnouncementNotifications({
      id:        updated.id,
      title:     updated.title,
      message:   updated.message,
      audience:  updated.audience,
      priority:  updated.priority,
      programId: updated.programId,
      levelId:   updated.levelId,
    });
  }

  // ── Resend emails ────────────────────────────────────────────────────────────
  let emailResult: { sent: number; failed: number } | null = null;
  if (sendEmail) {
    const to = await resolveRecipients({
      audience:  updated.audience,
      programId: updated.programId,
      levelId:   updated.levelId,
    });
    emailResult = await sendAnnouncementEmails({
      to,
      title:     updated.title,
      message:   updated.message,
      priority:  updated.priority,
      audience:  updated.audience,
      fileUrl:   updated.fileUrl,
      fileName:  updated.fileName,
      fileType:  updated.fileType,
      expiresAt: updated.expiresAt?.toISOString() ?? null,
    });

    if (emailResult.sent > 0) {
      await prisma.announcement.update({ where: { id }, data: { emailSent: true } });
      updated.emailSent = true;
    }
  }

  return NextResponse.json({
    ...updated,
    ...(emailResult  ? { emailResult }              : {}),
    ...(notifCount   ? { notifCount }               : {}),
  });
}

// ── DELETE /api/admin/announcements/[id] ──────────────────────────────────────
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await ctx.params;
  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete file from storage (non-fatal)
  if (existing.storagePath) {
    const { error } = await supabaseAdmin.storage
      .from("announcements")
      .remove([existing.storagePath]);
    if (error) console.warn("Storage delete warning:", error.message);
  }

  // Cascade delete notifications too
  await prisma.notification.deleteMany({
    where: { type: "announcement", title: { contains: existing.title } },
  });

  await prisma.announcement.delete({ where: { id } });
  return NextResponse.json({ success: true });
}