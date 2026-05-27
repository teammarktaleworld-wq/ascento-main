// app/api/admin/announcements/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma }             from "@/lib/prisma";
import { requireAdmin }       from "@/lib/auth-helpers";
import { sendAnnouncementEmails } from "@/lib/mailer";
import { resolveRecipients }  from "@/lib/announcementRecipients";

const announcementInclude = {
  program: { select: { id: true, name: true } },
  level:   { select: { id: true, name: true } },
} as const;

// ── GET /api/admin/announcements ──────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    const { searchParams } = new URL(req.url);
    const audience  = searchParams.get("audience")  ?? undefined;
    const programId = searchParams.get("programId") ?? undefined;
    const levelId   = searchParams.get("levelId")   ?? undefined;
    const active    = searchParams.get("active");

    const announcements = await prisma.announcement.findMany({
      where: {
        ...(audience  ? { audience: audience as any } : {}),
        ...(programId ? { programId }                 : {}),
        ...(levelId   ? { levelId }                   : {}),
        ...(active === "true"  ? { isActive: true }   : {}),
        ...(active === "false" ? { isActive: false }  : {}),
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
// Body: { title, message, priority, audience, programId?, levelId?,
//         expiresAt?, sendEmail?, fileUrl?, storagePath?, fileType?, fileName? }
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    const body = await req.json();
    const {
      title, message, priority, audience,
      programId, levelId, expiresAt,
      sendEmail = false,
      fileUrl, storagePath, fileType, fileName,
    } = body;

    if (!title?.trim() || !message?.trim())
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });

    // ── Create announcement ──────────────────────────────────────────────────
    const announcement = await prisma.announcement.create({
      data: {
        title:       title.trim(),
        message:     message.trim(),
        priority:    priority    ?? "normal",
        audience:    audience    ?? "all",
        programId:   programId   ?? null,
        levelId:     levelId     ?? null,
        expiresAt:   expiresAt   ? new Date(expiresAt) : null,
        isActive:    true,
        emailSent:   false,
        fileUrl:     fileUrl     ?? null,
        storagePath: storagePath ?? null,
        fileType:    fileType    ?? null,
        fileName:    fileName    ?? null,
      },
      include: announcementInclude,
    });

    // ── Send emails if requested ─────────────────────────────────────────────
    let emailResult: { sent: number; failed: number } | null = null;

    if (sendEmail) {
      const to = await resolveRecipients({ audience, programId, levelId });

      emailResult = await sendAnnouncementEmails({
        to,
        title:     announcement.title,
        message:   announcement.message,
        priority:  announcement.priority,
        audience:  announcement.audience,
        fileUrl:   announcement.fileUrl,
        fileName:  announcement.fileName,
        fileType:  announcement.fileType,
        expiresAt: announcement.expiresAt?.toISOString() ?? null,
      });

      // Mark emailSent = true if at least some went through
      if (emailResult.sent > 0) {
        await prisma.announcement.update({
          where: { id: announcement.id },
          data:  { emailSent: true },
        });
        announcement.emailSent = true;
      }
    }

    return NextResponse.json(
      { ...announcement, ...(emailResult ? { emailResult } : {}) },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /announcements error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}