




// // app/api/admin/webinars/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";

// type RouteContext = { params: Promise<{ id: string }> };

// // ── GET /api/admin/webinars/[id] ─────────────────────────────────────────────
// export async function GET(req: NextRequest, ctx: RouteContext) {
//   try {
//     await requireAdmin(req);
//     const { id } = await ctx.params;

//     const webinar = await prisma.webinar.findUnique({
//       where: { id },
//       include: {
//         program: { select: { id: true, name: true } },
//         level:   { select: { id: true, name: true } },
//       },
//     });
//     if (!webinar) return NextResponse.json({ error: "Not found" }, { status: 404 });
//     return NextResponse.json(webinar);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// // ── PATCH /api/admin/webinars/[id] ───────────────────────────────────────────
// export async function PATCH(req: NextRequest, ctx: RouteContext) {
//   try {
//     await requireAdmin(req);
//     const { id } = await ctx.params;
//     const body = await req.json();

//     const {
//       title, description, platform, meetingLink, meetingId, passcode,
//       hostName, hostEmail, scheduledAt, durationMins, programId, levelId,
//       bannerUrl, status,
//     } = body;

//     const webinar = await prisma.webinar.update({
//       where: { id },
//       data: {
//         ...(title        !== undefined ? { title }                              : {}),
//         ...(description  !== undefined ? { description }                        : {}),
//         ...(platform     !== undefined ? { platform }                           : {}),
//         ...(meetingLink  !== undefined ? { meetingLink }                        : {}),
//         ...(meetingId    !== undefined ? { meetingId }                          : {}),
//         ...(passcode     !== undefined ? { passcode }                           : {}),
//         ...(hostName     !== undefined ? { hostName }                           : {}),
//         ...(hostEmail    !== undefined ? { hostEmail }                          : {}),
//         ...(scheduledAt  !== undefined ? { scheduledAt: new Date(scheduledAt) } : {}),
//         ...(durationMins !== undefined ? { durationMins: Number(durationMins) } : {}),
//         ...(programId    !== undefined ? { programId: programId || null }       : {}),
//         ...(levelId      !== undefined ? { levelId: levelId || null }           : {}),
//         ...(bannerUrl    !== undefined ? { bannerUrl }                          : {}),
//         ...(status       !== undefined ? { status }                             : {}),
//       },
//       include: {
//         program: { select: { id: true, name: true } },
//         level:   { select: { id: true, name: true } },
//       },
//     });

//     return NextResponse.json(webinar);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// // ── DELETE /api/admin/webinars/[id] ──────────────────────────────────────────
// export async function DELETE(req: NextRequest, ctx: RouteContext) {
//   try {
//     await requireAdmin(req);
//     const { id } = await ctx.params;
//     await prisma.webinar.delete({ where: { id } });
//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }














import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;

    const webinar = await prisma.webinar.findUnique({
      where: { id },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
    });
    if (!webinar) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(webinar);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const body   = await req.json();

    const {
      title, description, platform, meetingLink, meetingId, passcode,
      hostName, hostEmail, scheduledAt, durationMins, programId, levelId,
      bannerUrl, status,
    } = body;

    const webinar = await prisma.webinar.update({
      where: { id },
      data: {
        ...(title        !== undefined ? { title }                              : {}),
        ...(description  !== undefined ? { description }                        : {}),
        ...(platform     !== undefined ? { platform }                           : {}),
        ...(meetingLink  !== undefined ? { meetingLink }                        : {}),
        ...(meetingId    !== undefined ? { meetingId }                          : {}),
        ...(passcode     !== undefined ? { passcode }                           : {}),
        ...(hostName     !== undefined ? { hostName }                           : {}),
        ...(hostEmail    !== undefined ? { hostEmail }                          : {}),
        ...(scheduledAt  !== undefined ? { scheduledAt: new Date(scheduledAt) } : {}),
        ...(durationMins !== undefined ? { durationMins: Number(durationMins) } : {}),
        ...(programId    !== undefined ? { programId: programId || null }       : {}),
        ...(levelId      !== undefined ? { levelId:   levelId   || null }       : {}),
        ...(bannerUrl    !== undefined ? { bannerUrl }                          : {}),
        ...(status       !== undefined ? { status }                             : {}),
      },
      include: {
        program: { select: { id: true, name: true } },
        level:   { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(webinar);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    await prisma.webinar.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}