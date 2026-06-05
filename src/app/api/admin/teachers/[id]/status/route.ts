// app/api/admin/teachers/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/admin/teachers/[id]/status
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await ctx.params;

  try {
    const { status } = await req.json();

    if (!["Active", "Disabled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Find teacher to get userId
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    // Update status field on Teacher model
    await prisma.teacher.update({
      where: { id },
      data: { status } as any,
    });

    if (status === "Disabled") {
      // Ban the user in Supabase — this invalidates all active sessions
      // and blocks future logins
      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        teacher.userId,
        { ban_duration: "876600h" } // ~100 years = effectively permanent
      );
      if (error) {
        console.error("Supabase ban error:", error.message);
        // Non-fatal: DB already updated, Supabase ban is best-effort
      }
    } else {
      // Re-enable: lift the ban
      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        teacher.userId,
        { ban_duration: "none" }
      );
      if (error) {
        console.error("Supabase unban error:", error.message);
      }
    }

    return NextResponse.json({ success: true, status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}