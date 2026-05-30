// lib/webinarEmail.ts
// Uses nodemailer — install: npm install nodemailer @types/nodemailer

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST     ?? "smtp.gmail.com",
  port:   Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE   === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const SCHOOL_NAME = "Ascento Playschool";
const SCHOOL_LOGO = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/Acento-Logo.jpg` : "";

function platformLabel(platform: string) {
  const map: Record<string, string> = {
    zoom:             "Zoom",
    google_meet:      "Google Meet",
    microsoft_teams:  "Microsoft Teams",
    other:            "Online",
  };
  return map[platform] ?? "Online";
}

function platformColor(platform: string) {
  const map: Record<string, string> = {
    zoom:            "#2D8CFF",
    google_meet:     "#34A853",
    microsoft_teams: "#6264A7",
    other:           "#FF6B6B",
  };
  return map[platform] ?? "#FF6B6B";
}

function platformIcon(platform: string) {
  const map: Record<string, string> = {
    zoom:            "📹",
    google_meet:     "🎥",
    microsoft_teams: "💼",
    other:           "🖥️",
  };
  return map[platform] ?? "📹";
}

export async function sendWebinarEmail({
  email,
  webinar,
  recipientName,
}: {
  email: string;
  webinar: any;
  recipientName?: string;
}) {
  const scheduled = new Date(webinar.scheduledAt);
  const dateStr   = scheduled.toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const timeStr = scheduled.toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });

  const pLabel = platformLabel(webinar.platform);
  const pColor = platformColor(webinar.platform);
  const pIcon  = platformIcon(webinar.platform);

  const endTime = new Date(scheduled.getTime() + (webinar.durationMins ?? 60) * 60000);
  const endTimeStr = endTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  const audience = webinar.program
    ? `${webinar.program.name}${webinar.level ? ` — ${webinar.level.name}` : ""}`
    : "All Students & Parents";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webinar Invitation — ${webinar.title}</title>
</head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header gradient -->
        <tr>
          <td style="background:linear-gradient(135deg,#FF6B6B 0%,#FFB347 100%);border-radius:16px 16px 0 0;padding:32px 40px 28px;text-align:center;">
            <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:12px;padding:10px 16px;margin-bottom:16px;">
              <span style="font-size:24px;">${pIcon}</span>
            </div>
            <h1 style="color:#fff;font-size:26px;font-weight:900;margin:0 0 6px;letter-spacing:-0.5px;">You're Invited!</h1>
            <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">Online Webinar from ${SCHOOL_NAME}</p>
          </td>
        </tr>

        <!-- White body -->
        <tr>
          <td style="background:#fff;padding:36px 40px;">

            ${recipientName ? `<p style="color:#555;font-size:15px;margin:0 0 20px;">Dear <strong style="color:#1A1A2E;">${recipientName}</strong>,</p>` : ""}

            <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 24px;">
              We are pleased to invite you to an upcoming online session.
              Please find the details below and join us on time.
            </p>

            <!-- Webinar title card -->
            <div style="background:linear-gradient(135deg,#FFFDF7,#FFF3E0);border:2px solid #FFB34740;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
              <p style="color:#FF6B6B;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">WEBINAR TITLE</p>
              <h2 style="color:#1A1A2E;font-size:20px;font-weight:900;margin:0 0 8px;">${webinar.title}</h2>
              ${webinar.description ? `<p style="color:#666;font-size:14px;margin:0;line-height:1.6;">${webinar.description}</p>` : ""}
            </div>

            <!-- Details grid -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td width="50%" style="padding:0 6px 12px 0;vertical-align:top;">
                  <div style="background:#F8F9FF;border-radius:10px;padding:14px 16px;">
                    <p style="color:#aaa;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">📅 DATE</p>
                    <p style="color:#1A1A2E;font-size:13px;font-weight:700;margin:0;">${dateStr}</p>
                  </div>
                </td>
                <td width="50%" style="padding:0 0 12px 6px;vertical-align:top;">
                  <div style="background:#F8F9FF;border-radius:10px;padding:14px 16px;">
                    <p style="color:#aaa;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">⏰ TIME</p>
                    <p style="color:#1A1A2E;font-size:13px;font-weight:700;margin:0;">${timeStr} – ${endTimeStr}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:0 6px 12px 0;vertical-align:top;">
                  <div style="background:#F8F9FF;border-radius:10px;padding:14px 16px;">
                    <p style="color:#aaa;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">⏱️ DURATION</p>
                    <p style="color:#1A1A2E;font-size:13px;font-weight:700;margin:0;">${webinar.durationMins} minutes</p>
                  </div>
                </td>
                <td style="padding:0 0 12px 6px;vertical-align:top;">
                  <div style="background:#F8F9FF;border-radius:10px;padding:14px 16px;">
                    <p style="color:#aaa;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">👥 FOR</p>
                    <p style="color:#1A1A2E;font-size:13px;font-weight:700;margin:0;">${audience}</p>
                  </div>
                </td>
              </tr>
              ${webinar.hostName ? `
              <tr>
                <td colspan="2" style="padding:0 0 12px;">
                  <div style="background:#F8F9FF;border-radius:10px;padding:14px 16px;">
                    <p style="color:#aaa;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">🎤 HOST</p>
                    <p style="color:#1A1A2E;font-size:13px;font-weight:700;margin:0;">${webinar.hostName}</p>
                  </div>
                </td>
              </tr>` : ""}
            </table>

            <!-- Platform + Join button -->
            <div style="background:linear-gradient(135deg,${pColor}15,${pColor}08);border:2px solid ${pColor}30;border-radius:12px;padding:20px 24px;margin-bottom:28px;text-align:center;">
              <div style="display:inline-block;background:${pColor};color:#fff;border-radius:8px;padding:4px 12px;font-size:11px;font-weight:900;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;">
                ${pIcon} ${pLabel}
              </div>
              ${webinar.meetingId ? `<p style="color:#666;font-size:13px;margin:0 0 4px;">Meeting ID: <strong style="color:#1A1A2E;">${webinar.meetingId}</strong></p>` : ""}
              ${webinar.passcode  ? `<p style="color:#666;font-size:13px;margin:0 0 16px;">Passcode: <strong style="color:#1A1A2E;">${webinar.passcode}</strong></p>` : ""}
              <a href="${webinar.meetingLink}"
                 style="display:inline-block;background:linear-gradient(135deg,#FF6B6B,#FFB347);color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:900;letter-spacing:0.5px;margin-top:8px;">
                🚀 Join Webinar
              </a>
              <p style="color:#aaa;font-size:11px;margin:12px 0 0;">Or copy this link: <a href="${webinar.meetingLink}" style="color:${pColor};word-break:break-all;">${webinar.meetingLink}</a></p>
            </div>

            <p style="color:#666;font-size:13px;line-height:1.7;margin:0;">
              Please join 5 minutes early. Ensure a stable internet connection.
              For any queries, reach out to us at <a href="mailto:${process.env.SMTP_USER}" style="color:#FF6B6B;">${process.env.SMTP_USER}</a>.
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1A1A2E;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0 0 4px;">${SCHOOL_NAME}</p>
            <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">This is an automated notification. Please do not reply to this email.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from:    `"${SCHOOL_NAME}" <${process.env.SMTP_USER}>`,
    to:      email,
    subject: `📹 Webinar Invitation: ${webinar.title} — ${dateStr}`,
    html,
  });
}