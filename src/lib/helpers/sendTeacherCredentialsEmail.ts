// lib/helpers/sendTeacherCredentialsEmail.ts

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SCHOOL_NAME = process.env.NEXT_PUBLIC_SCHOOL_NAME ?? "Ascento Playschool";
const FROM_EMAIL  = process.env.RESEND_FROM_EMAIL       ?? "noreply@ascentoabacus.com";
const PORTAL_URL  = process.env.NEXT_PUBLIC_SITE_URL    ?? "https://myascento.com";

function buildTeacherCredentialsEmail(opts: {
  teacherName:  string;
  teacherId:    string;
  loginEmail:   string;
  password:     string;
  portalUrl:    string;
  schoolName:   string;
  isNew:        boolean;
}): string {
  const { teacherName, teacherId, loginEmail, password, portalUrl, schoolName, isNew } = opts;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Login Credentials — ${schoolName}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee;box-shadow:0 4px 24px rgba(0,0,0,0.07)">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#2e7d32,#1b5e20);padding:28px 28px 20px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="width:40px;height:40px;background:rgba(255,255,255,.2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#fff;flex-shrink:0">A</div>
        <div>
          <div style="color:#fff;font-weight:900;font-size:15px;line-height:1.2">${schoolName}</div>
          <div style="color:rgba(255,255,255,.7);font-size:11px;margin-top:1px">Faculty Portal</div>
        </div>
      </div>
      <h1 style="color:#fff;font-size:22px;font-weight:900;margin:0 0 6px">
        ${isNew ? "🎉 Welcome to " + schoolName + "!" : "🔐 New Login Credentials"}
      </h1>
      <p style="color:rgba(255,255,255,.8);font-size:13px;margin:0">
        ${isNew ? "Account created for" : "Password reset for"} <strong>${teacherName}</strong>
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px">
      <p style="color:#555;font-size:14px;margin:0 0 22px;line-height:1.7">
        Dear <strong>${teacherName}</strong>,<br/>
        ${isNew
          ? `You have been registered as a faculty member on the ${schoolName} portal. Use the credentials below to log in for the first time.`
          : `A new password has been generated for your faculty account. All previous sessions have been signed out for security. Please use the credentials below to log in.`
        }
      </p>

      <!-- Credentials card -->
      <div style="background:#f1f8f1;border:1px solid rgba(46,125,50,.2);border-radius:12px;padding:20px;margin-bottom:20px">
        <p style="margin:0 0 14px;font-size:10px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:2px">Login Details</p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #c8e6c9;vertical-align:top">
              <span style="color:#999;font-size:11px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">Teacher ID</span>
              <strong style="color:#1A1A2E;font-size:15px;font-family:monospace;letter-spacing:1px">${teacherId}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #c8e6c9;vertical-align:top">
              <span style="color:#999;font-size:11px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">Login Email</span>
              <strong style="color:#1A1A2E;font-size:15px">${loginEmail}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0 6px;vertical-align:top">
              <span style="color:#999;font-size:11px;display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">
                ${isNew ? "Password" : "New Password"}
              </span>
              <div style="display:inline-block;background:#fff;border:2px dashed rgba(46,125,50,.4);border-radius:8px;padding:12px 20px;font-family:monospace;font-size:24px;font-weight:900;color:#2e7d32;letter-spacing:5px">${password}</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:24px">
        <a href="${portalUrl}" style="display:inline-block;background:linear-gradient(135deg,#2e7d32,#1b5e20);color:#fff;font-weight:900;font-size:15px;padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.5px">
          Open Faculty Portal →
        </a>
      </div>

      <!-- Steps -->
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 16px;margin-bottom:20px">
        <p style="color:#166534;font-size:12px;margin:0 0 8px;font-weight:700">How to log in:</p>
        <ol style="margin:0;padding-left:18px;color:#166534;font-size:12px;line-height:1.8">
          <li>Visit <a href="${portalUrl}" style="color:#2e7d32;font-weight:700">${portalUrl}</a></li>
          <li>Enter the login email above</li>
          <li>Enter the ${isNew ? "" : "new "}password shown above</li>
          <li>Please change your password after first login</li>
        </ol>
      </div>

      <!-- Warning -->
      <div style="background:#fff8ee;border:1px solid rgba(255,179,71,.4);border-radius:10px;padding:14px 16px">
        <p style="color:#92650a;font-size:12px;margin:0;line-height:1.7">
          ⚠️ <strong>Important:</strong> Do not share these credentials with anyone.
          ${isNew ? "" : "This password was generated by the school administrator and replaces any previous password."}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:16px 28px;border-top:1px solid #f0eef8;text-align:center">
      <p style="color:#ccc;font-size:11px;margin:0">${schoolName} · Faculty Portal · Automated message — do not reply</p>
    </div>
  </div>
</body>
</html>`;
}

export interface SendTeacherCredentialsEmailOpts {
  teacherEmail: string;
  teacherName:  string;
  teacherId:    string;
  loginEmail:   string;
  password:     string;
  isNew:        boolean;
  logPrefix?:   string;
}

export interface SendTeacherCredentialsEmailResult {
  emailSent:       boolean;
  emailError?:     string;
  emailMessageId?: string;
}

export async function sendTeacherCredentialsEmail(
  opts: SendTeacherCredentialsEmailOpts,
): Promise<SendTeacherCredentialsEmailResult> {
  const {
    teacherEmail, teacherName, teacherId,
    loginEmail, password, isNew,
    logPrefix = "[sendTeacherCredentialsEmail]",
  } = opts;

  let emailSent      = false;
  let emailError     = "";
  let emailMessageId: string | undefined;

  try {
    console.log(`${logPrefix} Sending credentials email to: ${teacherEmail}`);
    console.log(`${logPrefix} FROM_EMAIL: ${FROM_EMAIL}`);
    console.log(`${logPrefix} RESEND_API_KEY set: ${!!process.env.RESEND_API_KEY}`);

    const subject = isNew
      ? `🎉 Welcome! Your Login Credentials — ${SCHOOL_NAME}`
      : `🔐 New Login Credentials — ${SCHOOL_NAME}`;

    const sendResult = await resend.emails.send({
      from:    FROM_EMAIL,
      to:      teacherEmail,
      subject,
      html:    buildTeacherCredentialsEmail({
        teacherName,
        teacherId,
        loginEmail,
        password,
        portalUrl:  PORTAL_URL,
        schoolName: SCHOOL_NAME,
        isNew,
      }),
    });

    console.log(`${logPrefix} Resend result:`, JSON.stringify(sendResult));

    if (sendResult.error) {
      console.warn(`${logPrefix} Resend returned error:`, sendResult.error);
      emailError = sendResult.error.message ?? "Resend error";
    } else if (sendResult.data?.id) {
      emailSent      = true;
      emailMessageId = sendResult.data.id;
      console.log(`${logPrefix} Email accepted, message id: ${emailMessageId}`);
    } else {
      emailError = "Resend returned no error but also no message ID";
      console.warn(`${logPrefix} Unexpected Resend response:`, sendResult);
    }
  } catch (err: any) {
    console.error(`${logPrefix} Email send exception:`, err);
    emailError = err?.message ?? "Unknown error";
  }

  return {
    emailSent,
    emailError:     emailError || undefined,
    emailMessageId,
  };
}