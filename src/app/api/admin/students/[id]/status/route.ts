// app/api/admin/students/[id]/status/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await context.params;
  const { status } = await req.json(); // "Active" | "Disabled"

  if (!["Active", "Disabled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
  }

  const student = await prisma.student.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  // Ban duration: very long = effectively disabled; "none" = re-enabled
  const banDuration = status === "Disabled" ? "876600h" : "none";
  const { error } = await supabaseAdmin.auth.admin.updateUserById(student.userId, {
    ban_duration: banDuration,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Sync status in DB
  const updated = await prisma.student.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ status: updated.status });
}