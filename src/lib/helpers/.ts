// lib/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT ?? 465),
  secure: Number(process.env.SMTP_PORT ?? 465) === 465, // true for 465, false for others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface AnnouncementEmailPayload {
  to:          string[];
  title:       string;
  message:     string;
  priority:    "info" | "normal" | "urgent";
  audience:    string;
  fileUrl?:    string | null;
  fileName?:   string | null;
  fileType?:   string | null;
  expiresAt?:  string | null;
}

const PRIORITY_COLOR: Record<string, string> = {
  urgent: "#FF6B6B",
  normal: "#FFB347",
  info:   "#4ECDC4",
};

const PRIORITY_LABEL: Record<string, string> = {
  urgent: "🚨 URGENT",
  normal: "🔔 Notice",
  info:   "ℹ️ Info",
};

function buildHtml(p: AnnouncementEmailPayload): string {
  const color  = PRIORITY_COLOR[p.priority] ?? "#FFB347";
  const label  = PRIORITY_LABEL[p.priority] ?? "Notice";
  const expiry = p.expiresAt
    ? `<p style="font-size:12px;color:#999;margin-top:8px;">⏳ Expires: ${new Date(p.expiresAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}</p>`
    : "";
  const attachment = p.fileUrl
    ? `<div style="margin-top:16px;padding:12px 16px;background:#F8F9FA;border-radius:10px;border:1px solid #E9ECEF;">
         <a href="${p.fileUrl}" target="_blank" style="color:#4A90E2;font-weight:700;text-decoration:none;font-size:14px;">
           📎 ${p.fileName ?? "View Attachment"}
         </a>
       </div>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F4F8;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:580px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,${color},${color}CC);padding:28px 32px;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:900;letter-spacing:3px;color:rgba(255,255,255,0.7);text-transform:uppercase;">${label}</p>
      <h1 style="margin:0;font-size:22px;font-weight:900;color:#fff;line-height:1.3;">${p.title}</h1>
    </div>
    <!-- Body -->
    <div style="padding:28px 32px;">
      <p style="font-size:15px;color:#444;line-height:1.7;white-space:pre-wrap;margin:0;">${p.message}</p>
      ${attachment}
      ${expiry}
    </div>
    <!-- Footer -->
    <div style="padding:20px 32px;background:#FAFAFA;border-top:1px solid #F0EEF8;">
      <p style="margin:0;font-size:12px;color:#AAA;">This announcement was sent via the Ascento Admin Portal.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Send announcement email to a batch of recipients.
 * Returns { sent, failed } counts.
 */
export async function sendAnnouncementEmails(
  payload: AnnouncementEmailPayload
): Promise<{ sent: number; failed: number }> {
  if (!payload.to.length) return { sent: 0, failed: 0 };

  const html    = buildHtml(payload);
  const subject = `[${PRIORITY_LABEL[payload.priority] ?? "Notice"}] ${payload.title}`;

  // Send in batches of 50 to avoid SMTP limits
  const BATCH = 50;
  let sent = 0, failed = 0;

  for (let i = 0; i < payload.to.length; i += BATCH) {
    const batch = payload.to.slice(i, i + BATCH);
    try {
      await transporter.sendMail({
        from:    `"Ascento Notifications" <${process.env.SMTP_USER}>`,
        bcc:     batch,          // BCC keeps recipients private
        subject,
        html,
      });
      sent += batch.length;
    } catch (err) {
      console.error("Mail batch error:", err);
      failed += batch.length;
    }
  }

  return { sent, failed };
}