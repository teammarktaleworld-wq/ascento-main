// lib/helpers/sendCredentialsEmail.ts

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SCHOOL_NAME = process.env.NEXT_PUBLIC_SCHOOL_NAME ?? "Ascento Playschool";
const FROM_EMAIL  = process.env.RESEND_FROM_EMAIL       ?? "noreply@ascentoabacus.com";
const PORTAL_URL  = process.env.NEXT_PUBLIC_SITE_URL    ?? "https://myascento.com";

function buildCredentialsEmail(opts: {
  studentName: string;
  studentId:   string;
  loginEmail:  string;
  password:    string;
  portalUrl:   string;
  schoolName:  string;
  isNewStudent?: boolean;
}): string {
  const { studentName, studentId, loginEmail, password, portalUrl, schoolName, isNewStudent } = opts;
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
    <div style="background:linear-gradient(135deg,#e91e8c,#9c27b0);padding:28px 28px 20px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="width:40px;height:40px;background:rgba(255,255,255,.2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#fff;flex-shrink:0">A</div>
        <div>
          <div style="color:#fff;font-weight:900;font-size:15px;line-height:1.2">${schoolName}</div>
          <div style="color:rgba(255,255,255,.7);font-size:11px;margin-top:1px">Student Portal</div>
        </div>
      </div>
      <h1 style="color:#fff;font-size:22px;font-weight:900;margin:0 0 6px">
        ${isNewStudent ? '🎉 Welcome to ' + schoolName + '!' : '🔐 Login Credentials'}
      </h1>
      <p style="color:rgba(255,255,255,.8);font-size:13px;margin:0">
        ${isNewStudent ? 'Account created for' : 'New password generated for'} <strong>${studentName}</strong>
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px">
      <p style="color:#555;font-size:14px;margin:0 0 22px;line-height:1.7">
        Dear Parent / Guardian,<br/>
        ${isNewStudent
          ? `Your child <strong>${studentName}</strong> has been successfully registered on the student portal. Use the credentials below to log in for the first time.`
          : `A new password has been generated for <strong>${studentName}</strong>'s student portal account. All previous sessions have been signed out for security. Please use the credentials below to log in.`
        }
      </p>

      <!-- Credentials card -->
      <div style="background:#f8f4ff;border:1px solid rgba(233,30,140,.15);border-radius:12px;padding:20px;margin-bottom:20px">
        <p style="margin:0 0 14px;font-size:10px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:2px">Login Details</p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #ece8f8;vertical-align:top">
              <span style="color:#999;font-size:11px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">Student ID</span>
              <strong style="color:#1A1A2E;font-size:15px;font-family:monospace;letter-spacing:1px">${studentId}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #ece8f8;vertical-align:top">
              <span style="color:#999;font-size:11px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">Login Email</span>
              <strong style="color:#1A1A2E;font-size:15px">${loginEmail}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0 6px;vertical-align:top">
              <span style="color:#999;font-size:11px;display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">
                ${isNewStudent ? 'Password' : 'New Password'}
              </span>
              <div style="display:inline-block;background:#fff;border:2px dashed rgba(233,30,140,.4);border-radius:8px;padding:12px 20px;font-family:monospace;font-size:24px;font-weight:900;color:#e91e8c;letter-spacing:5px">${password}</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:24px">
        <a href="${portalUrl}" style="display:inline-block;background:linear-gradient(135deg,#e91e8c,#9c27b0);color:#fff;font-weight:900;font-size:15px;padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.5px">
          Open Student Portal →
        </a>
      </div>

      <!-- Steps -->
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 16px;margin-bottom:20px">
        <p style="color:#166534;font-size:12px;margin:0 0 8px;font-weight:700">How to log in:</p>
        <ol style="margin:0;padding-left:18px;color:#166534;font-size:12px;line-height:1.8">
          <li>Visit <a href="${portalUrl}" style="color:#e91e8c;font-weight:700">${portalUrl}</a></li>
          <li>Enter the login email above</li>
          <li>Enter the ${isNewStudent ? '' : 'new '}password shown above</li>
          <li>Ask your child to change the password after first login</li>
        </ol>
      </div>

      <!-- Warning -->
      <div style="background:#fff8ee;border:1px solid rgba(255,179,71,.4);border-radius:10px;padding:14px 16px">
        <p style="color:#92650a;font-size:12px;margin:0;line-height:1.7">
          ⚠️ <strong>Important:</strong> Do not share these credentials with anyone other than your child.
          ${isNewStudent ? '' : 'This password was generated by the school administrator and replaces any previous password.'}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:16px 28px;border-top:1px solid #f0eef8;text-align:center">
      <p style="color:#ccc;font-size:11px;margin:0">${schoolName} · Student Portal · Automated message — do not reply</p>
    </div>
  </div>
</body>
</html>`;
}

export interface SendCredentialsEmailOpts {
  parentEmail:  string;
  studentName:  string;
  studentId:    string;
  loginEmail:   string;
  password:     string;
  isNewStudent?: boolean; // true = registration email, false = password reset email
  logPrefix?:   string;  // e.g. "[generate-password]" for cleaner logs
}

export interface SendCredentialsEmailResult {
  emailSent:       boolean;
  emailError?:     string;
  emailMessageId?: string;
}

export async function sendCredentialsEmail(
  opts: SendCredentialsEmailOpts,
): Promise<SendCredentialsEmailResult> {
  const {
    parentEmail, studentName, studentId,
    loginEmail, password, isNewStudent = false,
    logPrefix = "[sendCredentialsEmail]",
  } = opts;

  let emailSent      = false;
  let emailError     = "";
  let emailMessageId: string | undefined;

  try {
    console.log(`${logPrefix} Sending credentials email to: ${parentEmail}`);
    console.log(`${logPrefix} FROM_EMAIL: ${FROM_EMAIL}`);
    console.log(`${logPrefix} RESEND_API_KEY set: ${!!process.env.RESEND_API_KEY}`);

    const subject = isNewStudent
      ? `🎉 Welcome! Login Credentials for ${studentName} — ${SCHOOL_NAME}`
      : `🔐 Login Credentials for ${studentName} — ${SCHOOL_NAME}`;

    const sendResult = await resend.emails.send({
      from:    FROM_EMAIL,
      to:      parentEmail,
      subject,
      html:    buildCredentialsEmail({
        studentName,
        studentId,
        loginEmail,
        password,
        portalUrl:  PORTAL_URL,
        schoolName: SCHOOL_NAME,
        isNewStudent,
      }),
    });

    console.log(`${logPrefix} Resend result:`, JSON.stringify(sendResult));

    if (sendResult.error) {
      console.warn(`${logPrefix} Resend returned error:`, sendResult.error);
      emailError = sendResult.error.message ?? "Resend error";
      emailSent  = false;
    } else if (sendResult.data?.id) {
      emailSent      = true;
      emailMessageId = sendResult.data.id;
      console.log(`${logPrefix} Email accepted by Resend, message id: ${emailMessageId}`);
    } else {
      emailError = "Resend returned no error but also no message ID — check Resend dashboard";
      emailSent  = false;
      console.warn(`${logPrefix} Unexpected Resend response — no error and no id:`, sendResult);
    }
  } catch (err: any) {
    console.error(`${logPrefix} Email send exception:`, err);
    emailError = err?.message ?? "Unknown error";
    emailSent  = false;
  }

  return {
    emailSent,
    emailError:     emailError || undefined,
    emailMessageId,
  };
}