// src\app\api\admin\announcements\notify-email\route.ts// ─────────────────────────────────────────────────────────────────────────────
// Announcement email sender — uses Resend (same as notify-email/route.ts).
//
// STUDENTS  → parentEmail  (Student.parentEmail)
// TEACHERS  → user email   (User.email via Teacher.userId)
// ADMINS    → user email   (User.email)
// ─────────────────────────────────────────────────────────────────────────────

import { Resend } from "resend";
import { prisma }  from "@/lib/helpers/prisma";

const resend      = new Resend(process.env.RESEND_API_KEY);
const SCHOOL_NAME = process.env.NEXT_PUBLIC_SCHOOL_NAME ?? "Ascento Playschool";
const FROM_EMAIL  = process.env.RESEND_FROM_EMAIL       ?? "noreply@ascentoabacus.com";
const PORTAL_URL  = process.env.NEXT_PUBLIC_SITE_URL    ?? "https://myascento.com";

// ── Types ────────────────────────────────────────────────────────────────────

export interface RecipientRow {
  userId: string;
  email:  string;   // parent email for students, own email for everyone else
  name:   string;
  role:   string;   // "student" | "teacher" | "admin"
}

export interface AnnouncementEmailPayload {
  to:        RecipientRow[];
  title:     string;
  message:   string;
  priority:  string;
  audience:  string;
  fileUrl:   string | null;
  fileName:  string | null;
  fileType:  string | null;
  expiresAt: string | null;
}

export interface EmailResult {
  sent:         number;
  failed:       number;
  failedEmails: string[];
}

// ── Priority config ───────────────────────────────────────────────────────────

const PRIORITY_COLOR: Record<string, string> = {
  urgent: "#FF6B6B",
  normal: "#FFB347",
  info:   "#4ECDC4",
};
const PRIORITY_EMOJI: Record<string, string> = {
  urgent: "🚨",
  normal: "📢",
  info:   "ℹ️",
};
const AUDIENCE_LABEL: Record<string, string> = {
  all:      "Everyone",
  students: "All Students",
  teachers: "Teachers Only",
  program:  "Specific Program",
  level:    "Specific Level",
};

// ── HTML builder ──────────────────────────────────────────────────────────────

function buildAnnouncementHtml(
  payload: AnnouncementEmailPayload,
  recipientName: string,
): string {
  const color   = PRIORITY_COLOR[payload.priority]  ?? "#FFB347";
  const emoji   = PRIORITY_EMOJI[payload.priority]  ?? "📢";
  const label   = (payload.priority ?? "normal").charAt(0).toUpperCase()
                + (payload.priority ?? "normal").slice(1);

  const expiryRow = payload.expiresAt
    ? `<p style="margin:0 0 8px;font-size:12px;color:#888;">
         ⏳ Expires: ${new Date(payload.expiresAt).toLocaleDateString("en-IN", {
           day: "numeric", month: "long", year: "numeric",
         })}
       </p>`
    : "";

  const attachmentBlock = payload.fileUrl
    ? `<div style="margin-bottom:20px;text-align:center;">
         <a href="${payload.fileUrl}" target="_blank"
            style="display:inline-block;background:#F0F4FF;border:2px solid rgba(59,130,246,.2);
                   color:#3B82F6;font-weight:900;font-size:13px;padding:12px 28px;
                   border-radius:10px;text-decoration:none;">
           ${payload.fileType === "image" ? "🖼️ View Image" : "📎 View PDF"}: ${payload.fileName ?? "Attachment"} →
         </a>
       </div>`
    : "";

  const safeMessage = payload.message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${payload.title} — ${SCHOOL_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#FF6B6B,#FFB347);padding:28px 28px 20px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:40px;height:40px;background:rgba(255,255,255,.2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#fff;flex-shrink:0;">A</div>
        <div>
          <div style="color:#fff;font-weight:900;font-size:15px;line-height:1.2;">${SCHOOL_NAME}</div>
          <div style="color:rgba(255,255,255,.7);font-size:11px;margin-top:1px;">Announcement</div>
        </div>
      </div>
      <h1 style="color:#fff;font-size:22px;font-weight:900;margin:0 0 6px;">
        ${emoji} ${payload.title}
      </h1>
      <p style="color:rgba(255,255,255,.8);font-size:13px;margin:0;">
        ${AUDIENCE_LABEL[payload.audience] ?? payload.audience}
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px;">
      <p style="color:#555;font-size:14px;margin:0 0 22px;line-height:1.7;">
        Dear <strong>${recipientName}</strong>,<br/>
        Please find the following announcement from ${SCHOOL_NAME}.
      </p>

      <!-- Priority pill -->
      <div style="display:inline-block;margin-bottom:16px;padding:4px 14px;border-radius:20px;
                  background:${color}18;border:1px solid ${color}44;">
        <span style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${color};">
          ${label}
        </span>
      </div>

      <!-- Message card -->
      <div style="background:#FFFDF7;border-left:4px solid ${color};border-radius:0 10px 10px 0;
                  padding:20px;margin-bottom:20px;">
        <p style="margin:0;font-size:15px;line-height:1.75;color:#374151;white-space:pre-wrap;">${safeMessage}</p>
      </div>

      <!-- Meta -->
      <p style="margin:0 0 4px;font-size:12px;color:#888;">
        👥 Audience: ${AUDIENCE_LABEL[payload.audience] ?? payload.audience}
      </p>
      ${expiryRow}

      ${attachmentBlock}

      <!-- CTA -->
      <div style="text-align:center;margin:24px 0;">
        <a href="${PORTAL_URL}"
           style="display:inline-block;background:linear-gradient(135deg,#FF6B6B,#FFB347);
                  color:#fff;font-weight:900;font-size:15px;padding:14px 36px;
                  border-radius:10px;text-decoration:none;letter-spacing:0.5px;">
          Open Student Portal →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:16px 28px;border-top:1px solid #f0eef8;text-align:center;">
      <p style="color:#ccc;font-size:11px;margin:0;">
        ${SCHOOL_NAME} · Student Portal · Automated message — do not reply
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ── Main sender ───────────────────────────────────────────────────────────────

/**
 * Send announcement emails via Resend and return delivery counts.
 * Call logEmailDelivery() afterwards once you have the announcementId.
 */
export async function sendAnnouncementEmails(
  payload: AnnouncementEmailPayload,
): Promise<EmailResult> {
  let sent   = 0;
  let failed = 0;
  const failedEmails: string[] = [];

  for (const recipient of payload.to) {
    const toEmail = recipient.email?.trim();
    if (!toEmail) { failed++; failedEmails.push("(missing)"); continue; }

    try {
      const result = await resend.emails.send({
        from:    FROM_EMAIL,
        to:      toEmail,
        subject: `${PRIORITY_EMOJI[payload.priority] ?? "📢"} ${payload.title} — ${SCHOOL_NAME}`,
        html:    buildAnnouncementHtml(payload, recipient.name),
      });

      if (result.error) {
        failed++;
        failedEmails.push(toEmail);
        console.error(`[mailer] Resend error for ${toEmail}:`, result.error.message);
      } else {
        sent++;
      }
    } catch (err: any) {
      failed++;
      failedEmails.push(toEmail);
      console.error(`[mailer] Exception sending to ${toEmail}:`, err?.message);
    }
  }

  return { sent, failed, failedEmails };
}

// ── Delivery log ──────────────────────────────────────────────────────────────

/**
 * Persist a per-recipient delivery row for the given announcement.
 * Call this after sendAnnouncementEmails() once you have the announcementId.
 */
export async function logEmailDelivery(
  announcementId: string,
  recipients:     RecipientRow[],
  result:         EmailResult,
): Promise<void> {
  const failedSet = new Set(result.failedEmails.map((e) => e.toLowerCase()));

  await prisma.announcementEmailLog.createMany({
    data: recipients.map((r) => ({
      announcementId,
      userId:  r.userId,
      email:   r.email,
      status:  failedSet.has(r.email.toLowerCase()) ? "failed" : "sent",
      sentAt:  failedSet.has(r.email.toLowerCase()) ? null     : new Date(),
    })),
    skipDuplicates: true,
  });
}

// ── Recipient resolver ────────────────────────────────────────────────────────
// Matches your actual Prisma schema:
//   Student.programId / Student.programLevelId  (direct fields, no enrollment join)
//   Student.parentEmail                         (email destination for students)
//   Teacher → User.email                        (via Teacher.userId)

export async function resolveRecipients(opts: {
  audience:  string;
  programId: string | null | undefined;
  levelId:   string | null | undefined;
}): Promise<RecipientRow[]> {
  const { audience, programId, levelId } = opts;

  // ── helpers ──────────────────────────────────────────────────────────────
  async function fetchStudents(extraWhere: Record<string, any> = {}): Promise<RecipientRow[]> {
    const students = await prisma.student.findMany({
      where: { status: "Active", ...extraWhere },
      select: {
        userId:      true,
        fullName:    true,
        parentEmail: true,
      },
    });
    return students
      .filter((s) => !!s.parentEmail?.trim())
      .map((s) => ({
        userId: s.userId,
        email:  s.parentEmail!.trim(),
        name:   s.fullName,
        role:   "student",
      }));
  }

  async function fetchTeachers(): Promise<RecipientRow[]> {
    const teachers = await prisma.teacher.findMany({
      where:  { status: "Active" },
      select: {
        userId: true,
        name:   true,
        user:   { select: { email: true } },
      },
    });
    return teachers
      .filter((t) => !!t.user.email?.trim())
      .map((t) => ({
        userId: t.userId,
        email:  t.user.email.trim(),
        name:   t.name,
        role:   "teacher",
      }));
  }

  // ── audience branches ─────────────────────────────────────────────────────
  switch (audience) {

    case "all": {
      const [students, teachers] = await Promise.all([
        fetchStudents(),
        fetchTeachers(),
      ]);
      // Deduplicate by email (a teacher who is also a parent edge-case)
      const seen = new Set<string>();
      return [...students, ...teachers].filter((r) => {
        if (seen.has(r.email)) return false;
        seen.add(r.email);
        return true;
      });
    }

    case "students":
      return fetchStudents(programId ? { programId } : {});

    case "teachers":
      return fetchTeachers();

    case "program": {
      if (!programId) return [];
      const [students, teachers] = await Promise.all([
        fetchStudents({ programId }),
        fetchTeachers(),   // teachers are not scoped to a program in your schema
      ]);
      const seen = new Set<string>();
      return [...students, ...teachers].filter((r) => {
        if (seen.has(r.email)) return false;
        seen.add(r.email);
        return true;
      });
    }

    case "level": {
      if (!levelId) return [];
      return fetchStudents({
        programLevelId: levelId,
        ...(programId ? { programId } : {}),
      });
    }

    default:
      return [];
  }
}