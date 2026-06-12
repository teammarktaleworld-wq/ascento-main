// // app/api/admin/webinars/[id]/send-email/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { Resend } from "resend";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers";

// const resend     = new Resend(process.env.RESEND_API_KEY);
// const FROM       = process.env.RESEND_FROM_EMAIL        ?? "noreply@ascentoabacus.com";
// const SCHOOL     = process.env.NEXT_PUBLIC_SCHOOL_NAME  ?? "Ascento Playschool";
// const PORTAL_URL = process.env.NEXT_PUBLIC_SITE_URL     ?? "https://myascento.com";

// type RouteContext = { params: Promise<{ id: string }> };

// // ─── Platform display meta ────────────────────────────────────────────────────
// const PLATFORM: Record<string, { label: string; color: string; icon: string }> = {
//   zoom:            { label: "Zoom",            color: "#2D8CFF", icon: "📹" },
//   google_meet:     { label: "Google Meet",     color: "#34A853", icon: "🎥" },
//   microsoft_teams: { label: "Microsoft Teams", color: "#6264A7", icon: "💼" },
//   other:           { label: "Online",          color: "#FF6B6B", icon: "🖥️" },
// };

// const DEFAULT_BANNERS: Record<string, string> = {
//   zoom:            "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80",
//   google_meet:     "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
//   microsoft_teams: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
//   other:           "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
// };

// // ─── HTML email builder ───────────────────────────────────────────────────────
// function buildHtml(opts: {
//   recipientName: string;
//   webinar: {
//     title: string;
//     description?: string | null;
//     platform: string;
//     meetingLink: string;
//     meetingId?: string | null;
//     passcode?: string | null;
//     hostName?: string | null;
//     scheduledAt: Date;
//     durationMins: number;
//     bannerUrl?: string | null;
//     program?: { name: string } | null;
//     level?: { name: string } | null;
//   };
// }): string {
//   const { recipientName, webinar: w } = opts;
//   const pm      = PLATFORM[w.platform] ?? PLATFORM.other;
//   const banner  = w.bannerUrl ?? DEFAULT_BANNERS[w.platform] ?? DEFAULT_BANNERS.other;
//   const sched   = new Date(w.scheduledAt);
//   const dateStr = sched.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
//   const timeStr = sched.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
//   const endTime = new Date(sched.getTime() + w.durationMins * 60_000)
//     .toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
//   const audience = w.program
//     ? `${w.program.name}${w.level ? ` › ${w.level.name}` : ""}`
//     : "All Students & Parents";

//   // Extra detail rows (meeting ID, passcode, host)
//   const extraRows = [
//     w.hostName  ? { icon: "🎤", label: "Host",       val: w.hostName  } : null,
//     w.meetingId ? { icon: "🔢", label: "Meeting ID", val: w.meetingId } : null,
//     w.passcode  ? { icon: "🔑", label: "Passcode",   val: w.passcode  } : null,
//   ].filter(Boolean) as { icon: string; label: string; val: string }[];

//   return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <meta name="viewport" content="width=device-width,initial-scale=1"/>
//   <title>Webinar Invitation — ${SCHOOL}</title>
// </head>
// <body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif">
// <div style="max-width:560px;margin:32px auto 40px;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #e8edf3;box-shadow:0 8px 40px rgba(0,0,0,.10)">

//   <!-- Banner -->
//   <div style="position:relative;height:180px;overflow:hidden">
//     <img src="${banner}" alt="" width="100%" style="width:100%;height:100%;object-fit:cover"/>
//     <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.15),rgba(0,0,0,.65))"/>
//   </div>

//   <!-- Coloured header -->
//   <div style="background:linear-gradient(135deg,${pm.color},${pm.color}bb);padding:24px 28px 20px">
//     <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
//       <div style="width:40px;height:40px;background:rgba(255,255,255,.22);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#fff;flex-shrink:0">A</div>
//       <div>
//         <div style="color:#fff;font-weight:900;font-size:15px">${SCHOOL}</div>
//         <div style="color:rgba(255,255,255,.72);font-size:11px;margin-top:2px">Webinar Invitation</div>
//       </div>
//     </div>
//     <div style="display:inline-block;background:rgba(255,255,255,.2);border-radius:20px;padding:4px 12px;font-size:12px;color:#fff;font-weight:700;margin-bottom:10px">
//       ${pm.icon} ${pm.label}
//     </div>
//     <h1 style="color:#fff;font-size:21px;font-weight:900;margin:0 0 6px;line-height:1.3">${w.title}</h1>
//     ${w.description ? `<p style="color:rgba(255,255,255,.82);font-size:13px;margin:0;line-height:1.6">${w.description}</p>` : ""}
//   </div>

//   <!-- Body -->
//   <div style="padding:28px">

//     <p style="color:#555;font-size:14px;margin:0 0 22px;line-height:1.75">
//       Dear <strong>${recipientName}</strong>,<br/>
//       You're invited to join a live online webinar. Please review the details below and mark your calendar!
//     </p>

//     <!-- Details card -->
//     <div style="background:#f8faff;border:1px solid #dce8ff;border-radius:14px;padding:22px;margin-bottom:22px">
//       <p style="margin:0 0 14px;font-size:10px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:2px">Session Details</p>
//       <table style="width:100%;border-collapse:collapse">
//         <tr>
//           <td style="padding:9px 0;border-bottom:1px solid #e8f0ff;vertical-align:top;width:50%">
//             <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">📅 Date</span>
//             <strong style="color:#1A1A2E;font-size:13px">${dateStr}</strong>
//           </td>
//           <td style="padding:9px 0;border-bottom:1px solid #e8f0ff;vertical-align:top;padding-left:16px">
//             <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">⏰ Time</span>
//             <strong style="color:#1A1A2E;font-size:13px">${timeStr} – ${endTime}</strong>
//           </td>
//         </tr>
//         <tr>
//           <td style="padding:9px 0;border-bottom:${extraRows.length ? "1px solid #e8f0ff" : "none"};vertical-align:top">
//             <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">⏱️ Duration</span>
//             <strong style="color:#1A1A2E;font-size:13px">${w.durationMins} minutes</strong>
//           </td>
//           <td style="padding:9px 0;border-bottom:${extraRows.length ? "1px solid #e8f0ff" : "none"};vertical-align:top;padding-left:16px">
//             <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">👥 For</span>
//             <strong style="color:#1A1A2E;font-size:13px">${audience}</strong>
//           </td>
//         </tr>
//         ${extraRows.map((r, i) => `
//         <tr>
//           <td colspan="2" style="padding:9px 0;border-bottom:${i < extraRows.length - 1 ? "1px solid #e8f0ff" : "none"};vertical-align:top">
//             <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">${r.icon} ${r.label}</span>
//             <strong style="color:#1A1A2E;font-size:14px;letter-spacing:1px">${r.val}</strong>
//           </td>
//         </tr>`).join("")}
//       </table>
//     </div>

//     <!-- Join link box -->
//     <div style="background:${pm.color}12;border:2px solid ${pm.color}35;border-radius:14px;padding:20px;text-align:center;margin-bottom:22px">
//       <p style="color:#888;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">Meeting Link</p>
//       <p style="color:${pm.color};font-size:13px;font-weight:700;word-break:break-all;margin:0 0 16px;line-height:1.5">${w.meetingLink}</p>
//       <a href="${w.meetingLink}" style="display:inline-block;background:${pm.color};color:#fff;font-weight:900;font-size:15px;padding:14px 36px;border-radius:12px;text-decoration:none;letter-spacing:.4px">
//         ${pm.icon} Join Webinar →
//       </a>
//     </div>

//     <!-- Portal CTA -->
//     <div style="text-align:center;margin-bottom:22px">
//       <a href="${PORTAL_URL}" style="display:inline-block;background:linear-gradient(135deg,#FF6B6B,#FFB347);color:#fff;font-weight:900;font-size:14px;padding:12px 32px;border-radius:10px;text-decoration:none">
//         Open Student Portal →
//       </a>
//     </div>

//     <!-- Tip -->
//     <div style="background:#fff8ee;border:1px solid rgba(255,179,71,.4);border-radius:12px;padding:14px 16px">
//       <p style="color:#92650a;font-size:12px;margin:0;line-height:1.7">
//         📌 <strong>Reminder:</strong> Please join on time. Ensure a stable internet connection and a quiet environment. Reach out to us if you face any difficulty joining.
//       </p>
//     </div>
//   </div>

//   <!-- Footer -->
//   <div style="padding:16px 28px;border-top:1px solid #f0f0f0;text-align:center">
//     <p style="color:#bbb;font-size:11px;margin:0;line-height:1.6">
//       ${SCHOOL} · Student Portal · Automated message — please do not reply to this email.
//     </p>
//   </div>

// </div>
// </body>
// </html>`;
// }

// // ─── POST /api/admin/webinars/[id]/send-email ─────────────────────────────────
// export async function POST(req: NextRequest, ctx: RouteContext) {
//   const authErr = await requireAdmin(req);
//   if (authErr) return authErr;

//   try {
//     const { id } = await ctx.params;

//     // Fetch webinar with relations
//     const webinar = await prisma.webinar.findUnique({
//       where:   { id },
//       include: {
//         program: { select: { id: true, name: true } },
//         level:   { select: { id: true, name: true } },
//       },
//     });
//     if (!webinar) {
//       return NextResponse.json({ error: "Webinar not found" }, { status: 404 });
//     }

//     // ── Build recipient list (deduped by email) ──────────────────────────────
//     type Recipient = { email: string; name: string };
//     const seen       = new Set<string>();
//     const recipients: Recipient[] = [];

//     const add = (email: string | null | undefined, name: string) => {
//       const e = email?.trim().toLowerCase();
//       if (e && !seen.has(e)) { seen.add(e); recipients.push({ email: e, name }); }
//     };

//     // 1) Students → parentEmail (scoped to webinar's program/level if set)
//     const students = await prisma.student.findMany({
//       where: {
//         status: "Active",
//         ...(webinar.programId ? { programId:      webinar.programId } : {}),
//         ...(webinar.levelId   ? { programLevelId: webinar.levelId   } : {}),
//       },
//       select: { fullName: true, parentEmail: true },
//     });
//     for (const s of students) add(s.parentEmail, s.fullName);

//     // 2) Users (parents / teachers / staff) → user.email
//     //    Only when no program filter — i.e. this is a broadcast webinar
//     if (!webinar.programId) {
//       const users = await prisma.user.findMany({
//         where:  { role: { in: ["user", "teacher"] } },
//         select: { email: true, name: true },
//       });
//       for (const u of users) add(u.email, u.name ?? "User");
//     }

//     if (recipients.length === 0) {
//       return NextResponse.json({
//         webinarId: webinar.id,
//         total: 0, sent: 0, failed: 0,
//         results: [],
//         message: "No recipients found.",
//       });
//     }

//     // ── Send emails ──────────────────────────────────────────────────────────
//     type Result = { email: string; success: boolean; id?: string; error?: string };
//     const results: Result[] = [];

//     await Promise.allSettled(
//       recipients.map(async r => {
//         try {
//           const res = await resend.emails.send({
//             from:    FROM,
//             to:      r.email,
//             subject: `${PLATFORM[webinar.platform]?.icon ?? "📹"} Webinar: ${webinar.title} — ${SCHOOL}`,
//             html:    buildHtml({ recipientName: r.name, webinar }),
//           });
//           if (res.error) {
//             results.push({ email: r.email, success: false, error: res.error.message });
//           } else {
//             results.push({ email: r.email, success: true, id: res.data?.id });
//           }
//         } catch (err: any) {
//           results.push({ email: r.email, success: false, error: err?.message ?? "Unknown error" });
//         }
//       })
//     );

//     const sent   = results.filter(r => r.success).length;
//     const failed = results.length - sent;

//     // ── Update tracking counters ─────────────────────────────────────────────
//     await prisma.webinar.update({
//       where: { id },
//       data:  {
//         emailSent:      true,
//         emailSentAt:    new Date(),
//         emailSentCount: { increment: 1 },
//       },
//     });

//     console.log(`[webinar/send-email] "${webinar.title}" — ${sent}/${results.length} sent`);

//     return NextResponse.json({
//       webinarId: webinar.id,
//       title:     webinar.title,
//       total:     results.length,
//       sent,
//       failed,
//       results,
//     });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }














// // app/api/admin/webinars/[id]/send-email/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { Resend } from "resend";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers";

// const resend     = new Resend(process.env.RESEND_API_KEY);
// const FROM       = process.env.RESEND_FROM_EMAIL       ?? "noreply@ascentoabacus.com";
// const SCHOOL     = process.env.NEXT_PUBLIC_SCHOOL_NAME ?? "Ascento Playschool";
// const PORTAL_URL = process.env.NEXT_PUBLIC_SITE_URL    ?? "https://myascento.com";

// type RouteContext = { params: Promise<{ id: string }> };

// const PLATFORM: Record<string, { label: string; color: string; icon: string }> = {
//   zoom:            { label: "Zoom",            color: "#2D8CFF", icon: "📹" },
//   google_meet:     { label: "Google Meet",     color: "#34A853", icon: "🎥" },
//   microsoft_teams: { label: "Microsoft Teams", color: "#6264A7", icon: "💼" },
//   other:           { label: "Online",          color: "#FF6B6B", icon: "🖥️" },
// };

// const DEFAULT_BANNERS: Record<string, string> = {
//   zoom:            "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80",
//   google_meet:     "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
//   microsoft_teams: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
//   other:           "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
// };

// function buildHtml(opts: {
//   recipientName: string;
//   webinar: {
//     title: string; description?: string | null; platform: string;
//     meetingLink: string; meetingId?: string | null; passcode?: string | null;
//     hostName?: string | null; scheduledAt: Date; durationMins: number;
//     bannerUrl?: string | null;
//     attachmentUrl?: string | null; attachmentName?: string | null;
//     program?: { name: string } | null;
//     level?:   { name: string } | null;
//   };
// }): string {
//   const { recipientName, webinar: w } = opts;
//   const pm      = PLATFORM[w.platform] ?? PLATFORM.other;
//   const banner  = w.bannerUrl ?? DEFAULT_BANNERS[w.platform] ?? DEFAULT_BANNERS.other;
//   const sched   = new Date(w.scheduledAt);
//   const dateStr = sched.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
//   const timeStr = sched.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
//   const endTime = new Date(sched.getTime() + w.durationMins * 60_000)
//     .toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
//   const audience = w.program
//     ? `${w.program.name}${w.level ? ` › ${w.level.name}` : ""}`
//     : "All Students & Parents";

//   const extraRows = [
//     w.hostName  ? { icon: "🎤", label: "Host",       val: w.hostName  } : null,
//     w.meetingId ? { icon: "🔢", label: "Meeting ID", val: w.meetingId } : null,
//     w.passcode  ? { icon: "🔑", label: "Passcode",   val: w.passcode  } : null,
//   ].filter(Boolean) as { icon: string; label: string; val: string }[];

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <meta name="viewport" content="width=device-width,initial-scale=1"/>
//   <title>Webinar Invitation — ${SCHOOL}</title>
// </head>
// <body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif">
// <div style="max-width:560px;margin:32px auto 40px;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #e8edf3;box-shadow:0 8px 40px rgba(0,0,0,.10)">
//   <div style="position:relative;height:180px;overflow:hidden">
//     <img src="${banner}" alt="" width="100%" style="width:100%;height:180px;object-fit:cover"/>
//     <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.1),rgba(0,0,0,.65))"/>
//   </div>
//   <div style="background:linear-gradient(135deg,${pm.color},${pm.color}bb);padding:24px 28px 20px">
//     <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
//       <div style="width:40px;height:40px;background:rgba(255,255,255,.22);border-radius:10px;font-size:18px;font-weight:900;color:#fff;display:flex;align-items:center;justify-content:center">A</div>
//       <div>
//         <div style="color:#fff;font-weight:900;font-size:15px">${SCHOOL}</div>
//         <div style="color:rgba(255,255,255,.72);font-size:11px;margin-top:2px">Webinar Invitation</div>
//       </div>
//     </div>
//     <div style="display:inline-block;background:rgba(255,255,255,.2);border-radius:20px;padding:4px 12px;font-size:12px;color:#fff;font-weight:700;margin-bottom:10px">${pm.icon} ${pm.label}</div>
//     <h1 style="color:#fff;font-size:21px;font-weight:900;margin:0 0 6px;line-height:1.3">${w.title}</h1>
//     ${w.description ? `<p style="color:rgba(255,255,255,.82);font-size:13px;margin:0;line-height:1.6">${w.description}</p>` : ""}
//   </div>
//   <div style="padding:28px">
//     <p style="color:#555;font-size:14px;margin:0 0 22px;line-height:1.75">Dear <strong>${recipientName}</strong>,<br/>You're invited to join a live online webinar. Please review the details below and mark your calendar!</p>
//     <div style="background:#f8faff;border:1px solid #dce8ff;border-radius:14px;padding:22px;margin-bottom:22px">
//       <p style="margin:0 0 14px;font-size:10px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:2px">Session Details</p>
//       <table style="width:100%;border-collapse:collapse">
//         <tr>
//           <td style="padding:9px 0;border-bottom:1px solid #e8f0ff;vertical-align:top;width:50%">
//             <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">📅 Date</span>
//             <strong style="color:#1A1A2E;font-size:13px">${dateStr}</strong>
//           </td>
//           <td style="padding:9px 0;border-bottom:1px solid #e8f0ff;vertical-align:top;padding-left:16px">
//             <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">⏰ Time</span>
//             <strong style="color:#1A1A2E;font-size:13px">${timeStr} – ${endTime}</strong>
//           </td>
//         </tr>
//         <tr>
//           <td style="padding:9px 0;border-bottom:${extraRows.length ? "1px solid #e8f0ff" : "none"};vertical-align:top">
//             <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">⏱️ Duration</span>
//             <strong style="color:#1A1A2E;font-size:13px">${w.durationMins} minutes</strong>
//           </td>
//           <td style="padding:9px 0;border-bottom:${extraRows.length ? "1px solid #e8f0ff" : "none"};vertical-align:top;padding-left:16px">
//             <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">👥 For</span>
//             <strong style="color:#1A1A2E;font-size:13px">${audience}</strong>
//           </td>
//         </tr>
//         ${extraRows.map((r, i) => `
//         <tr>
//           <td colspan="2" style="padding:9px 0;border-bottom:${i < extraRows.length - 1 ? "1px solid #e8f0ff" : "none"};vertical-align:top">
//             <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">${r.icon} ${r.label}</span>
//             <strong style="color:#1A1A2E;font-size:14px;letter-spacing:1px">${r.val}</strong>
//           </td>
//         </tr>`).join("")}
//       </table>
//     </div>
//     <div style="background:${pm.color}12;border:2px solid ${pm.color}35;border-radius:14px;padding:20px;text-align:center;margin-bottom:22px">
//       <p style="color:#888;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">Meeting Link</p>
//       <p style="color:${pm.color};font-size:13px;font-weight:700;word-break:break-all;margin:0 0 16px;line-height:1.5">${w.meetingLink}</p>
//       <a href="${w.meetingLink}" style="display:inline-block;background:${pm.color};color:#fff;font-weight:900;font-size:15px;padding:14px 36px;border-radius:12px;text-decoration:none">${pm.icon} Join Webinar →</a>
//     </div>
//     ${w.attachmentUrl ? `
//     <div style="background:#f3f0ff;border:2px solid #c4b5fd;border-radius:14px;padding:18px;text-align:center;margin-bottom:22px">
//       <p style="color:#7C3AED;font-size:12px;font-weight:700;margin:0 0 10px">📎 Attachment: ${w.attachmentName ?? "Document"}</p>
//       <a href="${w.attachmentUrl}" style="display:inline-block;background:#7C3AED;color:#fff;font-weight:800;font-size:13px;padding:10px 24px;border-radius:10px;text-decoration:none">Download Attachment</a>
//     </div>` : ""}
//     <div style="text-align:center;margin-bottom:22px">
//       <a href="${PORTAL_URL}" style="display:inline-block;background:linear-gradient(135deg,#FF6B6B,#FFB347);color:#fff;font-weight:900;font-size:14px;padding:12px 32px;border-radius:10px;text-decoration:none">Open Student Portal →</a>
//     </div>
//     <div style="background:#fff8ee;border:1px solid rgba(255,179,71,.4);border-radius:12px;padding:14px 16px">
//       <p style="color:#92650a;font-size:12px;margin:0;line-height:1.7">📌 <strong>Reminder:</strong> Please join on time. Ensure a stable internet connection and a quiet environment.</p>
//     </div>
//   </div>
//   <div style="padding:16px 28px;border-top:1px solid #f0f0f0;text-align:center">
//     <p style="color:#bbb;font-size:11px;margin:0">${SCHOOL} · Student Portal · Automated message — please do not reply.</p>
//   </div>
// </div>
// </body>
// </html>`;
// }

// export async function POST(req: NextRequest, ctx: RouteContext) {
//   const authErr = await requireAdmin(req);
//   if (authErr) return authErr;

//   try {
//     const { id } = await ctx.params;

//     const webinar = await prisma.webinar.findUnique({
//       where:   { id },
//       include: {
//         program: { select: { id: true, name: true } },
//         level:   { select: { id: true, name: true } },
//       },
//     });
//     if (!webinar) return NextResponse.json({ error: "Webinar not found" }, { status: 404 });

//     type Recipient = {
//       email: string; name: string;
//       studentId?: string; userId?: string;
//     };
//     const seen       = new Set<string>();
//     const recipients: Recipient[] = [];

//     const add = (r: Recipient) => {
//       const e = r.email.trim().toLowerCase();
//       if (!e || seen.has(e)) return;
//       seen.add(e);
//       recipients.push({ ...r, email: e });
//     };

//     const students = await prisma.student.findMany({
//       where: {
//         status: "Active",
//         ...(webinar.programId ? { programId:      webinar.programId } : {}),
//         ...(webinar.levelId   ? { programLevelId: webinar.levelId   } : {}),
//       },
//       select: { id: true, userId: true, fullName: true, parentEmail: true },
//     });
//     for (const s of students) {
//       if (s.parentEmail) add({ email: s.parentEmail, name: s.fullName, studentId: s.id, userId: s.userId });
//     }

//     if (!webinar.programId) {
//       const users = await prisma.user.findMany({
//         where:  { role: { in: ["user", "teacher"] } },
//         select: { id: true, email: true, name: true },
//       });
//       for (const u of users) add({ email: u.email, name: u.name ?? "User", userId: u.id });
//     }

//     if (recipients.length === 0) {
//       return NextResponse.json({
//         webinarId: webinar.id, total: 0, sent: 0, failed: 0,
//         results: [], message: "No recipients found.",
//       });
//     }

//     type SendResult = {
//       email: string; name: string;
//       studentId?: string; userId?: string;
//       success: boolean; resendId?: string; errorMsg?: string;
//     };

//     const sendResults: SendResult[] = [];

//     // Prepare attachment for Resend (if present) — fetched once, reused for all sends
//     let resendAttachment: { filename: string; content: string }[] | undefined;
//     if (webinar.attachmentUrl) {
//       try {
//         const fileRes = await fetch(webinar.attachmentUrl);
//         const arrBuf  = await fileRes.arrayBuffer();
//         const base64  = Buffer.from(arrBuf).toString("base64");
//         resendAttachment = [{
//           filename: webinar.attachmentName ?? "attachment",
//           content:  base64,
//         }];
//       } catch (e) {
//         console.error("[webinar/send-email] failed to fetch attachment:", e);
//       }
//     }

//     await Promise.allSettled(
//       recipients.map(async r => {
//         try {
//           const res = await resend.emails.send({
//             from:        FROM,
//             to:          r.email,
//             subject:     `${PLATFORM[webinar.platform]?.icon ?? "📹"} Webinar: ${webinar.title} — ${SCHOOL}`,
//             html:        buildHtml({ recipientName: r.name, webinar }),
//             ...(resendAttachment ? { attachments: resendAttachment } : {}),
//           });
//           if (res.error) {
//             sendResults.push({ ...r, success: false, errorMsg: res.error.message });
//           } else {
//             sendResults.push({ ...r, success: true, resendId: res.data?.id });
//           }
//         } catch (err: any) {
//           sendResults.push({ ...r, success: false, errorMsg: err?.message ?? "Unknown error" });
//         }
//       })
//     );

//     const now    = new Date();
//     const sent   = sendResults.filter(r => r.success).length;
//     const failed = sendResults.length - sent;

//     await prisma.webinarEmailLog.deleteMany({ where: { webinarId: id } });

//     await prisma.webinarEmailLog.createMany({
//       data: sendResults.map(r => ({
//         webinarId: id,
//         studentId: r.studentId ?? null,
//         userId:    r.userId    ?? null,
//         email:     r.email,
//         name:      r.name,
//         status:    r.success ? "sent" : "failed",
//         errorMsg:  r.errorMsg ?? null,
//         resendId:  r.resendId ?? null,
//         sentAt:    r.success ? now : null,
//       })),
//     });

//     await prisma.webinar.update({
//       where: { id },
//       data:  {
//         emailSent:      true,
//         emailSentAt:    now,
//         emailSentCount: { increment: 1 },
//       },
//     });

//     console.log(`[webinar/send-email] "${webinar.title}" — ${sent}/${sendResults.length} sent`);

//     return NextResponse.json({
//       webinarId: webinar.id,
//       title:     webinar.title,
//       total:     sendResults.length,
//       sent,
//       failed,
//       results: sendResults.map(r => ({
//         email:     r.email,
//         name:      r.name,
//         studentId: r.studentId,
//         userId:    r.userId,
//         success:   r.success,
//         resendId:  r.resendId,
//         errorMsg:  r.errorMsg,
//       })),
//     });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

















import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

const resend     = new Resend(process.env.RESEND_API_KEY);
const FROM       = process.env.RESEND_FROM_EMAIL       ?? "noreply@ascentoabacus.com";
const SCHOOL     = process.env.NEXT_PUBLIC_SCHOOL_NAME ?? "Ascento Playschool";
const PORTAL_URL = process.env.NEXT_PUBLIC_SITE_URL    ?? "https://myascento.com";

type RouteContext = { params: Promise<{ id: string }> };

const PLATFORM: Record<string, { label: string; color: string; icon: string }> = {
  zoom:            { label: "Zoom",            color: "#2D8CFF", icon: "📹" },
  google_meet:     { label: "Google Meet",     color: "#34A853", icon: "🎥" },
  microsoft_teams: { label: "Microsoft Teams", color: "#6264A7", icon: "💼" },
  other:           { label: "Online",          color: "#FF6B6B", icon: "🖥️" },
};

const DEFAULT_BANNERS: Record<string, string> = {
  zoom:            "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80",
  google_meet:     "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
  microsoft_teams: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
  other:           "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
};

function buildHtml(opts: {
  recipientName: string;
  webinar: {
    title: string; description?: string | null; platform: string;
    meetingLink: string; meetingId?: string | null; passcode?: string | null;
    hostName?: string | null; scheduledAt: Date; durationMins: number;
    bannerUrl?: string | null;
    attachmentUrl?: string | null; attachmentName?: string | null;
    program?: { name: string } | null;
    level?:   { name: string } | null;
  };
}): string {
  const { recipientName, webinar: w } = opts;
  const pm      = PLATFORM[w.platform] ?? PLATFORM.other;
  const banner  = w.bannerUrl ?? DEFAULT_BANNERS[w.platform] ?? DEFAULT_BANNERS.other;
  const sched   = new Date(w.scheduledAt);
  const dateStr = sched.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timeStr = sched.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const endTime = new Date(sched.getTime() + w.durationMins * 60_000)
    .toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const audience = w.program
    ? `${w.program.name}${w.level ? ` › ${w.level.name}` : ""}`
    : "All Students & Parents";

  const extraRows = [
    w.hostName  ? { icon: "🎤", label: "Host",       val: w.hostName  } : null,
    w.meetingId ? { icon: "🔢", label: "Meeting ID", val: w.meetingId } : null,
    w.passcode  ? { icon: "🔑", label: "Passcode",   val: w.passcode  } : null,
  ].filter(Boolean) as { icon: string; label: string; val: string }[];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Webinar Invitation — ${SCHOOL}</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif">
<div style="max-width:560px;margin:32px auto 40px;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #e8edf3;box-shadow:0 8px 40px rgba(0,0,0,.10)">
  <div style="position:relative;height:180px;overflow:hidden">
    <img src="${banner}" alt="" width="100%" style="width:100%;height:180px;object-fit:cover"/>
    <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.1),rgba(0,0,0,.65))"/>
  </div>
  <div style="background:linear-gradient(135deg,${pm.color},${pm.color}bb);padding:24px 28px 20px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
      <div style="width:40px;height:40px;background:rgba(255,255,255,.22);border-radius:10px;font-size:18px;font-weight:900;color:#fff;display:flex;align-items:center;justify-content:center">A</div>
      <div>
        <div style="color:#fff;font-weight:900;font-size:15px">${SCHOOL}</div>
        <div style="color:rgba(255,255,255,.72);font-size:11px;margin-top:2px">Webinar Invitation</div>
      </div>
    </div>
    <div style="display:inline-block;background:rgba(255,255,255,.2);border-radius:20px;padding:4px 12px;font-size:12px;color:#fff;font-weight:700;margin-bottom:10px">${pm.icon} ${pm.label}</div>
    <h1 style="color:#fff;font-size:21px;font-weight:900;margin:0 0 6px;line-height:1.3">${w.title}</h1>
    ${w.description ? `<p style="color:rgba(255,255,255,.82);font-size:13px;margin:0;line-height:1.6">${w.description}</p>` : ""}
  </div>
  <div style="padding:28px">
    <p style="color:#555;font-size:14px;margin:0 0 22px;line-height:1.75">Dear <strong>${recipientName}</strong>,<br/>You're invited to join a live online webinar. Please review the details below and mark your calendar!</p>
    <div style="background:#f8faff;border:1px solid #dce8ff;border-radius:14px;padding:22px;margin-bottom:22px">
      <p style="margin:0 0 14px;font-size:10px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:2px">Session Details</p>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:9px 0;border-bottom:1px solid #e8f0ff;vertical-align:top;width:50%">
            <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">📅 Date</span>
            <strong style="color:#1A1A2E;font-size:13px">${dateStr}</strong>
          </td>
          <td style="padding:9px 0;border-bottom:1px solid #e8f0ff;vertical-align:top;padding-left:16px">
            <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">⏰ Time</span>
            <strong style="color:#1A1A2E;font-size:13px">${timeStr} – ${endTime}</strong>
          </td>
        </tr>
        <tr>
          <td style="padding:9px 0;border-bottom:${extraRows.length ? "1px solid #e8f0ff" : "none"};vertical-align:top">
            <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">⏱️ Duration</span>
            <strong style="color:#1A1A2E;font-size:13px">${w.durationMins} minutes</strong>
          </td>
          <td style="padding:9px 0;border-bottom:${extraRows.length ? "1px solid #e8f0ff" : "none"};vertical-align:top;padding-left:16px">
            <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">👥 For</span>
            <strong style="color:#1A1A2E;font-size:13px">${audience}</strong>
          </td>
        </tr>
        ${extraRows.map((r, i) => `
        <tr>
          <td colspan="2" style="padding:9px 0;border-bottom:${i < extraRows.length - 1 ? "1px solid #e8f0ff" : "none"};vertical-align:top">
            <span style="color:#999;font-size:10px;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px">${r.icon} ${r.label}</span>
            <strong style="color:#1A1A2E;font-size:14px;letter-spacing:1px">${r.val}</strong>
          </td>
        </tr>`).join("")}
      </table>
    </div>
    <div style="background:${pm.color}12;border:2px solid ${pm.color}35;border-radius:14px;padding:20px;text-align:center;margin-bottom:22px">
      <p style="color:#888;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">Meeting Link</p>
      <p style="color:${pm.color};font-size:13px;font-weight:700;word-break:break-all;margin:0 0 16px;line-height:1.5">${w.meetingLink}</p>
      <a href="${w.meetingLink}" style="display:inline-block;background:${pm.color};color:#fff;font-weight:900;font-size:15px;padding:14px 36px;border-radius:12px;text-decoration:none">${pm.icon} Join Webinar →</a>
    </div>
    ${w.attachmentUrl ? `
    <div style="background:#f3f0ff;border:2px solid #c4b5fd;border-radius:14px;padding:18px;text-align:center;margin-bottom:22px">
      <p style="color:#7C3AED;font-size:12px;font-weight:700;margin:0 0 10px">📎 Attachment: ${w.attachmentName ?? "Document"}</p>
      <a href="${w.attachmentUrl}" style="display:inline-block;background:#7C3AED;color:#fff;font-weight:800;font-size:13px;padding:10px 24px;border-radius:10px;text-decoration:none">Download Attachment</a>
    </div>` : ""}
    <div style="text-align:center;margin-bottom:22px">
      <a href="${PORTAL_URL}" style="display:inline-block;background:linear-gradient(135deg,#FF6B6B,#FFB347);color:#fff;font-weight:900;font-size:14px;padding:12px 32px;border-radius:10px;text-decoration:none">Open Student Portal →</a>
    </div>
    <div style="background:#fff8ee;border:1px solid rgba(255,179,71,.4);border-radius:12px;padding:14px 16px">
      <p style="color:#92650a;font-size:12px;margin:0;line-height:1.7">📌 <strong>Reminder:</strong> Please join on time. Ensure a stable internet connection and a quiet environment.</p>
    </div>
  </div>
  <div style="padding:16px 28px;border-top:1px solid #f0f0f0;text-align:center">
    <p style="color:#bbb;font-size:11px;margin:0">${SCHOOL} · Student Portal · Automated message — please do not reply.</p>
  </div>
</div>
</body>
</html>`;
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const { id } = await ctx.params;

    const webinar = await prisma.webinar.findUnique({
      where:   { id },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
    });
    if (!webinar) return NextResponse.json({ error: "Webinar not found" }, { status: 404 });

    type Recipient = { email: string; name: string; studentId?: string; userId?: string };
    const seen       = new Set<string>();
    const recipients: Recipient[] = [];

    const add = (r: Recipient) => {
      const e = r.email.trim().toLowerCase();
      if (!e || seen.has(e)) return;
      seen.add(e);
      recipients.push({ ...r, email: e });
    };

    const students = await prisma.student.findMany({
      where: {
        status: "Active",
        ...(webinar.programId ? { programId:      webinar.programId } : {}),
        ...(webinar.levelId   ? { programLevelId: webinar.levelId   } : {}),
      },
      select: { id: true, userId: true, fullName: true, parentEmail: true },
    });
    for (const s of students) {
      if (s.parentEmail) add({ email: s.parentEmail, name: s.fullName, studentId: s.id, userId: s.userId ?? undefined });
    }

    if (!webinar.programId) {
      const users = await prisma.user.findMany({
        where:  { role: { in: ["user", "teacher"] } },
        select: { id: true, email: true, name: true },
      });
      for (const u of users) add({ email: u.email, name: u.name ?? "User", userId: u.id });
    }

    if (recipients.length === 0) {
      return NextResponse.json({
        webinarId: webinar.id, total: 0, sent: 0, failed: 0,
        results: [], message: "No recipients found.",
      });
    }

    type SendResult = {
      email: string; name: string;
      studentId?: string; userId?: string;
      success: boolean; resendId?: string; errorMsg?: string;
    };
    const sendResults: SendResult[] = [];

    // Fetch attachment once and reuse for all sends
    let resendAttachment: { filename: string; content: string }[] | undefined;
    if (webinar.attachmentUrl) {
      try {
        const fileRes = await fetch(webinar.attachmentUrl);
        const arrBuf  = await fileRes.arrayBuffer();
        const base64  = Buffer.from(arrBuf).toString("base64");
        resendAttachment = [{
          filename: webinar.attachmentName ?? "attachment",
          content:  base64,
        }];
      } catch (e) {
        console.error("[webinar/send-email] failed to fetch attachment:", e);
      }
    }

    await Promise.allSettled(
      recipients.map(async r => {
        try {
          const res = await resend.emails.send({
            from:    FROM,
            to:      r.email,
            subject: `${PLATFORM[webinar.platform]?.icon ?? "📹"} Webinar: ${webinar.title} — ${SCHOOL}`,
            html:    buildHtml({ recipientName: r.name, webinar }),
            ...(resendAttachment ? { attachments: resendAttachment } : {}),
          });
          if (res.error) {
            sendResults.push({ ...r, success: false, errorMsg: res.error.message });
          } else {
            sendResults.push({ ...r, success: true, resendId: res.data?.id });
          }
        } catch (err: any) {
          sendResults.push({ ...r, success: false, errorMsg: err?.message ?? "Unknown error" });
        }
      })
    );

    const now    = new Date();
    const sent   = sendResults.filter(r => r.success).length;
    const failed = sendResults.length - sent;

    // Replace logs for this send batch
    await prisma.webinarEmailLog.deleteMany({ where: { webinarId: id } });
    await prisma.webinarEmailLog.createMany({
      data: sendResults.map(r => ({
        webinarId: id,
        studentId: r.studentId ?? null,
        userId:    r.userId    ?? null,
        email:     r.email,
        name:      r.name,
        status:    r.success ? "sent" : "failed",
        errorMsg:  r.errorMsg ?? null,
        resendId:  r.resendId ?? null,
        sentAt:    r.success ? now : null,
      })),
    });

    await prisma.webinar.update({
      where: { id },
      data:  {
        emailSent:      true,
        emailSentAt:    now,
        emailSentCount: { increment: 1 },
      },
    });

    console.log(`[webinar/send-email] "${webinar.title}" — ${sent}/${sendResults.length} sent`);

    return NextResponse.json({
      webinarId: webinar.id,
      title:     webinar.title,
      total:     sendResults.length,
      sent,
      failed,
      results: sendResults.map(r => ({
        email:     r.email,
        name:      r.name,
        studentId: r.studentId,
        userId:    r.userId,
        success:   r.success,
        resendId:  r.resendId,
        errorMsg:  r.errorMsg,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}