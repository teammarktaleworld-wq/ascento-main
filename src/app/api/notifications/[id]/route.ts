








// // app/api/notifications/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { getSessionUser } from "@/lib/helpers/auth-helpers";

// type RouteContext = { params: Promise<{ id: string }> };

// // ── PATCH /api/notifications/[id] — mark single read ─────────────────────────
// export async function PATCH(req: NextRequest, ctx: RouteContext) {
//   try {
//     const user = await getSessionUser(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { id } = await ctx.params;

//     await prisma.notification.updateMany({
//       where: { id, userId: user.id },
//       data:  { isRead: true },
//     });

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// // ── DELETE /api/notifications/[id] ───────────────────────────────────────────
// export async function DELETE(req: NextRequest, ctx: RouteContext) {
//   try {
//     const user = await getSessionUser(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { id } = await ctx.params;

//     await prisma.notification.deleteMany({
//       where: { id, userId: user.id },
//     });

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }











// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { getSessionUser } from "@/lib/helpers/auth-helpers";

// type RouteContext = { params: Promise<{ id: string }> };

// export async function PATCH(req: NextRequest, ctx: RouteContext) {
//   try {
//     const user = await getSessionUser(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { id } = await ctx.params;

//     await prisma.notification.updateMany({
//       where: { id, userId: user.id },
//       data:  { isRead: true },
//     });

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function DELETE(req: NextRequest, ctx: RouteContext) {
//   try {
//     const user = await getSessionUser(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { id } = await ctx.params;

//     if (user.role === "admin") {
//       const notif = await prisma.notification.findUnique({ where: { id } });

//       if (notif?.webinarId) {
//         // Delete all notifications for this webinar across all users
//         await prisma.notification.deleteMany({ where: { webinarId: notif.webinarId } });
//       } else if (notif?.examId) {
//         // Delete all notifications for this exam across all users
//         await prisma.notification.deleteMany({ where: { examId: notif.examId } });
//       } else {
//         await prisma.notification.delete({ where: { id } });
//       }
//     } else {
//       await prisma.notification.deleteMany({ where: { id, userId: user.id } });
//     }

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }















import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;

    // Admins can mark any notification read; users only their own
    const where = user.role === "admin" ? { id } : { id, userId: user.id };

    const result = await prisma.notification.updateMany({
      where,
      data: { isRead: true },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[PATCH /api/notifications/:id]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;

    if (user.role === "admin") {
      await prisma.$transaction(async (tx) => {
        const notif = await tx.notification.findUnique({
          where: { id },
          select: { webinarId: true, examId: true },
        });

        if (!notif) throw new Error("NOT_FOUND");

        if (notif.webinarId) {
          await tx.notification.deleteMany({ where: { webinarId: notif.webinarId } });
        } else if (notif.examId) {
          await tx.notification.deleteMany({ where: { examId: notif.examId } });
        } else {
          await tx.notification.delete({ where: { id } });
        }
      });
    } else {
      const result = await prisma.notification.deleteMany({
        where: { id, userId: user.id },
      });

      if (result.count === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[DELETE /api/notifications/:id]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}