







// // app/api/notifications/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getSessionUser } from "@/lib/auth-helpers";

// // ── GET /api/notifications ────────────────────────────────────────────────────
// export async function GET(req: NextRequest) {
//   try {
//     const user = await getSessionUser(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { searchParams } = new URL(req.url);
//     const unreadOnly = searchParams.get("unread") === "true";
//     const limit      = Number(searchParams.get("limit") ?? 50);

//     const notifications = await prisma.notification.findMany({
//       where: {
//         userId: user.id,
//         ...(unreadOnly ? { isRead: false } : {}),
//       },
//       orderBy: { createdAt: "desc" },
//       take: limit,
//       include: {
//         webinar: {
//           select: {
//             id: true, title: true, scheduledAt: true,
//             meetingLink: true, platform: true, status: true,
//           },
//         },
//       },
//     });

//     const unreadCount = await prisma.notification.count({
//       where: { userId: user.id, isRead: false },
//     });

//     return NextResponse.json({ notifications, unreadCount });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// // ── PATCH /api/notifications — mark all read ──────────────────────────────────
// export async function PATCH(req: NextRequest) {
//   try {
//     const user = await getSessionUser(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     await prisma.notification.updateMany({
//       where: { userId: user.id, isRead: false },
//       data:  { isRead: true },
//     });

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }











// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-helpers";

// ── GET /api/notifications ────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const limit      = Math.min(Number(searchParams.get("limit") ?? 50), 200);

    // Every user (including admin) sees only their own Notification rows.
    // Admin gets notifications because getWebinarTargets() now includes admins.
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
        ...(unreadOnly ? { isRead: false } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        webinar: {
          select: {
            id: true, title: true, scheduledAt: true,
            meetingLink: true, platform: true, status: true,
          },
        },
      },
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── PATCH /api/notifications — mark all read ──────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data:  { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}