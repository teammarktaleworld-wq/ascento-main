// src/app/api/admin/exams/[id]/notify-email/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SCHOOL_NAME = process.env.NEXT_PUBLIC_SCHOOL_NAME ?? "Ascento Playschool";
const FROM_EMAIL  = process.env.RESEND_FROM_EMAIL       ?? "noreply@ascentoabacus.com";
const PORTAL_URL  = process.env.NEXT_PUBLIC_SITE_URL    ?? "https://myascento.com";

// ─── Email Builder ────────────────────────────────────────────────────────────

function buildExamEmail(opts: {
  studentName:    string;
  examName:       string;
  programName:    string;
  levelName?:     string;
  examStartDate?: string;
  examEndDate?:   string;
  description?:   string;
  fileUrl?:       string;
  portalUrl:      string;
  schoolName:     string;
}): string {
  const {
    studentName, examName, programName, levelName,
    examStartDate, examEndDate, description, fileUrl,
    portalUrl, schoolName,
  } = opts;

  const formattedStart = examStartDate
    ? new Date(examStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const formattedEnd = examEndDate
    ? new Date(examEndDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Exam Notification — ${schoolName}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee;box-shadow:0 4px 24px rgba(0,0,0,0.07)">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#A78BFA,#7C3AED);padding:28px 28px 20px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="width:40px;height:40px;background:rgba(255,255,255,.2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#fff;flex-shrink:0">A</div>
        <div>
          <div style="color:#fff;font-weight:900;font-size:15px;line-height:1.2">${schoolName}</div>
          <div style="color:rgba(255,255,255,.7);font-size:11px;margin-top:1px">Exam Notification</div>
        </div>
      </div>
      <h1 style="color:#fff;font-size:22px;font-weight:900;margin:0 0 6px">📝 Exam Scheduled</h1>
      <p style="color:rgba(255,255,255,.8);font-size:13px;margin:0">
        For <strong>${studentName}</strong> · ${programName}${levelName ? ` · ${levelName}` : ""}
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px">
      <p style="color:#555;font-size:14px;margin:0 0 22px;line-height:1.7">
        Dear Parent / Guardian,<br/>
        An exam has been scheduled for <strong>${studentName}</strong>. Please find the details below and ensure your child is prepared.
      </p>

      <!-- Exam Details Card -->
      <div style="background:#f8f4ff;border:1px solid rgba(124,58,237,.15);border-radius:12px;padding:20px;margin-bottom:20px">
        <p style="margin:0 0 14px;font-size:10px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:2px">Exam Details</p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #ece8f8;vertical-align:top">
              <span style="color:#999;font-size:11px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">Exam Name</span>
              <strong style="color:#1A1A2E;font-size:16px">${examName}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #ece8f8;vertical-align:top">
              <span style="color:#999;font-size:11px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">Program / Class</span>
              <strong style="color:#1A1A2E;font-size:14px">${programName}${levelName ? ` — ${levelName}` : ""}</strong>
            </td>
          </tr>
          ${formattedStart ? `
          <tr>
            <td style="padding:10px 0;${formattedEnd ? "border-bottom:1px solid #ece8f8;" : ""}vertical-align:top">
              <span style="color:#999;font-size:11px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">Start Date</span>
              <strong style="color:#7C3AED;font-size:15px">📅 ${formattedStart}</strong>
            </td>
          </tr>` : ""}
          ${formattedEnd ? `
          <tr>
            <td style="padding:10px 0;vertical-align:top">
              <span style="color:#999;font-size:11px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">End Date</span>
              <strong style="color:#7C3AED;font-size:15px">📅 ${formattedEnd}</strong>
            </td>
          </tr>` : ""}
        </table>
      </div>

      ${description ? `
      <!-- Instructions -->
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:14px 16px;margin-bottom:20px">
        <p style="color:#0c4a6e;font-size:12px;margin:0 0 6px;font-weight:700">📋 Instructions / Notes</p>
        <p style="color:#0c4a6e;font-size:13px;margin:0;line-height:1.7">${description}</p>
      </div>` : ""}

      ${fileUrl ? `
      <!-- Attachment -->
      <div style="margin-bottom:20px;text-align:center">
        <a href="${fileUrl}" style="display:inline-block;background:#f8f4ff;border:2px solid rgba(124,58,237,.2);color:#7C3AED;font-weight:900;font-size:13px;padding:12px 28px;border-radius:10px;text-decoration:none">
          📎 View Exam Attachment →
        </a>
      </div>` : ""}

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:24px">
        <a href="${portalUrl}" style="display:inline-block;background:linear-gradient(135deg,#A78BFA,#7C3AED);color:#fff;font-weight:900;font-size:15px;padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.5px">
          Open Student Portal →
        </a>
      </div>

      <!-- Warning -->
      <div style="background:#fff8ee;border:1px solid rgba(255,179,71,.4);border-radius:10px;padding:14px 16px">
        <p style="color:#92650a;font-size:12px;margin:0;line-height:1.7">
          ⚠️ <strong>Important:</strong> Please ensure your child is well prepared. Log in to the student portal for more details and updates.
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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NotifyEmailResult {
  studentId:    string;
  studentName:  string;
  parentEmail:  string | null;
  emailSent:    boolean;
  error?:       string;
  resendId?:    string;
}

// ─── POST /api/admin/exams/[id]/notify-email ──────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const exam = await prisma.exam.findUnique({
    where: { id },
    include: {
      program: { select: { id: true, name: true } },
      level:   { select: { id: true, name: true } },
    },
  });

  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  if (!exam.programId) {
    return NextResponse.json(
      { error: "Exam has no program assigned — cannot determine recipients" },
      { status: 400 }
    );
  }

  // Fetch active students scoped to the exam's program (and level if set)
  const students = await prisma.student.findMany({
    where: {
      programId:     exam.programId,
      ...(exam.levelId ? { programLevelId: exam.levelId } : {}),
      status: "Active",
    },
    include: {
      user: { select: { id: true, email: true } },
    },
  });

  if (students.length === 0) {
    return NextResponse.json({
      examId:   exam.id,
      examName: exam.examName,
      total:    0,
      sent:     0,
      failed:   0,
      results:  [],
      message:  "No active students found for this program/level.",
    });
  }

  const results: NotifyEmailResult[] = [];

  for (const student of students) {
    const result: NotifyEmailResult = {
      studentId:   student.id,
      studentName: student.fullName,
      parentEmail: student.parentEmail ?? null,
      emailSent:   false,
    };

    const toEmail = student.parentEmail?.trim();

    if (!toEmail) {
      result.error = "No parent email on file";
      results.push(result);
      continue;
    }

    try {
      const sendResult = await resend.emails.send({
        from:    FROM_EMAIL,
        to:      toEmail,
        subject: `📝 Exam Scheduled: ${exam.examName} — ${SCHOOL_NAME}`,
        html: buildExamEmail({
          studentName:    student.fullName,
          examName:       exam.examName,
          programName:    exam.program?.name ?? "Unknown Program",
          levelName:      exam.level?.name,
          examStartDate:  exam.examStartDate?.toISOString(),
          examEndDate:    exam.examEndDate?.toISOString(),
          description:    exam.description ?? undefined,
          fileUrl:        exam.fileUrl ?? undefined,
          portalUrl:      PORTAL_URL,
          schoolName:     SCHOOL_NAME,
        }),
      });

      if (sendResult.error) {
        result.error = sendResult.error.message ?? "Resend error";
      } else if (sendResult.data?.id) {
        result.emailSent = true;
        result.resendId  = sendResult.data.id;
      } else {
        result.error = "No response ID from Resend";
      }
    } catch (err: any) {
      result.error = err?.message ?? "Email send exception";
    }

    results.push(result);
  }

  const sent   = results.filter(r => r.emailSent).length;
  const failed = results.filter(r => !r.emailSent).length;

  // Update email tracking counters on exam
  await prisma.exam.update({
    where: { id },
    data: {
      emailSentAt:    new Date(),
      emailSentCount: { increment: 1 },
    },
  });

  console.log(`[notify-email] Exam "${exam.examName}" — ${sent}/${results.length} emails sent`);

  return NextResponse.json({
    examId:    exam.id,
    examName:  exam.examName,
    program:   exam.program?.name,
    level:     exam.level?.name,
    total:     results.length,
    sent,
    failed,
    results,
  });
}