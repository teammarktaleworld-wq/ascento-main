// app/api/admin/webinars/[id]/logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: RouteContext) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const { id } = await ctx.params;

    const [emailLogs, notificationLogs] = await Promise.all([
      prisma.webinarEmailLog.findMany({
        where: { webinarId: id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.webinarNotificationLog.findMany({
        where: { webinarId: id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const emailStats = {
      total:  emailLogs.length,
      sent:   emailLogs.filter(l => l.status === "sent").length,
      failed: emailLogs.filter(l => l.status === "failed").length,
    };
    const notifStats = {
      total:  notificationLogs.length,
      sent:   notificationLogs.filter(l => l.status === "sent").length,
      failed: notificationLogs.filter(l => l.status === "failed").length,
    };

    return NextResponse.json({ emailLogs, notificationLogs, emailStats, notifStats });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}