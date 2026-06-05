








// app/api/notifications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

type RouteContext = { params: Promise<{ id: string }> };

// ── PATCH /api/notifications/[id] — mark single read ─────────────────────────
export async function PATCH(req: NextRequest, ctx: RouteContext) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;

    await prisma.notification.updateMany({
      where: { id, userId: user.id },
      data:  { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── DELETE /api/notifications/[id] ───────────────────────────────────────────
export async function DELETE(req: NextRequest, ctx: RouteContext) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;

    await prisma.notification.deleteMany({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}