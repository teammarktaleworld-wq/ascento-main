







// // app/api/notifications/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
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











// // app/api/notifications/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { getSessionUser } from "@/lib/helpers/auth-helpers";

// // ── GET /api/notifications ────────────────────────────────────────────────────
// export async function GET(req: NextRequest) {
//   try {
//     const user = await getSessionUser(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { searchParams } = new URL(req.url);
//     const unreadOnly = searchParams.get("unread") === "true";
//     const limit      = Math.min(Number(searchParams.get("limit") ?? 50), 200);

//     // Every user (including admin) sees only their own Notification rows.
//     // Admin gets notifications because getWebinarTargets() now includes admins.
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











// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { getSessionUser } from "@/lib/helpers/auth-helpers";

// export async function GET(req: NextRequest) {
//   try {
//     const user = await getSessionUser(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { searchParams } = new URL(req.url);
//     const unreadOnly = searchParams.get("unread") === "true";
//     const limit      = Math.min(Number(searchParams.get("limit") ?? 50), 200);
//     const type       = searchParams.get("type") ?? undefined; // filter by type

//     const notifications = await prisma.notification.findMany({
//       where: {
//         userId: user.id,
//         ...(unreadOnly ? { isRead: false } : {}),
//         ...(type ? { type: type as any } : {}),
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
//         exam: {
//           select: {
//             id: true, examName: true,
//             examStartDate: true, examEndDate: true,
//             description: true, fileUrl: true, fileName: true,
//             program: { select: { id: true, name: true } },
//             level:   { select: { id: true, name: true } },
//           },
//         },
//       },
//     });

//     const unreadCount = await prisma.notification.count({
//       where: { userId: user.id, isRead: false },
//     });

//     // Unread counts broken down by type
//     const unreadByType = await prisma.notification.groupBy({
//       by: ["type"],
//       where: { userId: user.id, isRead: false },
//       _count: { id: true },
//     });

//     const unreadCounts = unreadByType.reduce(
//       (acc, row) => ({ ...acc, [row.type]: row._count.id }),
//       {} as Record<string, number>
//     );

//     return NextResponse.json({ notifications, unreadCount, unreadCounts });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function PATCH(req: NextRequest) {
//   try {
//     const user = await getSessionUser(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json().catch(() => ({}));
//     const type = body?.type ?? undefined; // optionally mark only one type as read

//     await prisma.notification.updateMany({
//       where: {
//         userId: user.id,
//         isRead: false,
//         ...(type ? { type } : {}),
//       },
//       data: { isRead: true },
//     });

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }













// // /api/notifications/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { getSessionUser } from "@/lib/helpers/auth-helpers";

// export async function GET(req: NextRequest) {
//   try {
//     const user = await getSessionUser(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { searchParams } = new URL(req.url);
//     const unreadOnly    = searchParams.get("unread") === "true";
//     const limit         = Math.min(Number(searchParams.get("limit") ?? 50), 200);
//     const filterUserId  = searchParams.get("userId") ?? null;   // ← admin filter
//     const typeFilter    = searchParams.get("type") ?? null;     // ← type filter

//     const isAdmin = user.role === "admin";

//     const where = {
//       // scope: admin can filter by a specific user, otherwise own notifs
//       ...(isAdmin
//         ? filterUserId ? { userId: filterUserId } : {}
//         : { userId: user.id }),
//       ...(unreadOnly            ? { isRead: false }           : {}),
//       ...(typeFilter            ? { type: typeFilter as any } : {}),
//     };

//     const notifications = await prisma.notification.findMany({
//       where,
//       orderBy: { createdAt: "desc" },
//       take: limit,
//       include: {
//         user: isAdmin
//           ? { select: { id: true, name: true, email: true, role: true } }
//           : false,
//         webinar: {
//           select: {
//             id: true, title: true, scheduledAt: true,
//             meetingLink: true, platform: true, status: true,
//           },
//         },
//         exam: {
//           select: {
//             id: true, examName: true,
//             examStartDate: true, examEndDate: true,
//             description: true, fileUrl: true, fileName: true,
//             program: { select: { id: true, name: true } },
//             level:   { select: { id: true, name: true } },
//           },
//         },
//       },
//     });

//     const unreadCount = await prisma.notification.count({ where: { ...where, isRead: false } });

//     // For admin: also return the list of distinct users who have notifications
//     // so the frontend can populate the user-filter dropdown
//     let usersWithNotifs: { id: string; name: string | null; email: string }[] = [];
//     if (isAdmin) {
//       const rows = await prisma.notification.findMany({
//         where: typeFilter ? { type: typeFilter as any } : {},
//         select: { user: { select: { id: true, name: true, email: true } } },
//         distinct: ["userId"],
//         orderBy: { user: { name: "asc" } },
//       });
//       usersWithNotifs = rows.map(r => r.user);
//     }

//     return NextResponse.json({ notifications, unreadCount, usersWithNotifs });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

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











// /api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

const VALID_TYPES = ["webinar", "announcement", "exam", "attendance", "general"] as const;
type NotifType = typeof VALID_TYPES[number];

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const isAdmin = user.role === "admin";

    // ── Parse & validate params ──────────────────────────────────────────────
    const unreadOnly   = searchParams.get("unread") === "true";
    const rawLimit     = searchParams.get("limit");
    const limit        = Math.min(Math.max(Number(rawLimit ?? 50), 1), 200);
    const filterUserId = searchParams.get("userId") ?? null;
    const typeParam    = searchParams.get("type") ?? null;

    // Non-admins must not filter by another user's id
    if (filterUserId && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate type against the enum the frontend knows about
    if (typeParam && !VALID_TYPES.includes(typeParam as NotifType)) {
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 });
    }
    const typeFilter = typeParam as NotifType | null;

    // ── Build where clause ───────────────────────────────────────────────────
    const where = {
      ...(isAdmin
        ? filterUserId ? { userId: filterUserId } : {}
        : { userId: user.id }),
      ...(unreadOnly  ? { isRead: false }        : {}),
      ...(typeFilter  ? { type: typeFilter }     : {}),
    };

    // ── Fetch notifications ──────────────────────────────────────────────────
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: isAdmin
          ? { select: { id: true, name: true, email: true, role: true } }
          : false,
        webinar: {
          select: {
            id: true, title: true, scheduledAt: true,
            meetingLink: true, platform: true, status: true,
          },
        },
        exam: {
          select: {
            id: true, examName: true,
            examStartDate: true, examEndDate: true,
            description: true, fileUrl: true, fileName: true,
            program: { select: { id: true, name: true } },
            level:   { select: { id: true, name: true } },
          },
        },
      },
    });

    // ── Unread count (scoped to current where) ───────────────────────────────
    const unreadCount = await prisma.notification.count({
      where: { ...where, isRead: false },
    });

    // ── Admin: distinct user list for the filter dropdown ───────────────────
    // Respects active typeFilter and unreadOnly so the dropdown only shows
    // users who actually have notifications matching the current filters.
    let usersWithNotifs: { id: string; name: string | null; email: string }[] = [];
    if (isAdmin) {
      const dropdownWhere = {
        ...(typeFilter ? { type: typeFilter } : {}),
        ...(unreadOnly ? { isRead: false }    : {}),
      };
      const rows = await prisma.notification.findMany({
        where: dropdownWhere,
        select: { user: { select: { id: true, name: true, email: true } } },
        distinct: ["userId"],
        orderBy: { user: { name: "asc" } },
      });
      usersWithNotifs = rows.map(r => r.user);
    }

    return NextResponse.json({ notifications, unreadCount, usersWithNotifs });
  } catch (err: any) {
    console.error("[GET /api/notifications]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Optional body: { id: string } → mark a single notification read
    //                omitted         → mark ALL unread notifications read
    let singleId: string | null = null;
    try {
      const body = await req.json();
      singleId = body?.id ?? null;
    } catch {
      // no body — bulk mark-all-read
    }

    if (singleId) {
      // Single: verify ownership before updating
      const existing = await prisma.notification.findUnique({
        where: { id: singleId },
        select: { userId: true },
      });

      if (!existing) {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 });
      }
      if (existing.userId !== user.id && user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      await prisma.notification.update({
        where: { id: singleId },
        data:  { isRead: true },
      });
    } else {
      // Bulk: only the user's own unread notifications
      await prisma.notification.updateMany({
        where: { userId: user.id, isRead: false },
        data:  { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[PATCH /api/notifications]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}