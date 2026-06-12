
// app/api/admin/students/[id]/status/route.ts
// Toggles Active ↔ Inactive on BOTH Student.status and User.status (UserStatus enum)
// Also signs out all sessions when deactivating.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { UserStatus } from "@prisma/client";
import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin"; // ← replaced


export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  const { id } = await context.params;
  const body = await req.json();

  // Accept either "Active"/"Inactive" or derive from toggle
  const newStatus: UserStatus = body.status === "Inactive"
    ? UserStatus.Inactive
    : UserStatus.Active;

  // Find student with its linked user
  const student = await prisma.student.findUnique({
    where: { id },
    select: { userId: true, fullName: true },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  // Update BOTH tables in a single transaction
  await prisma.$transaction([
    // 1. Update Student.status (UserStatus enum)
    prisma.student.update({
      where: { id },
      data: { status: newStatus },
    }),
    // 2. Update User.status (same UserStatus enum)
    prisma.user.update({
      where: { id: student.userId },
      data: { status: newStatus },
    }),
  ]);

  // If deactivating → sign out all active sessions immediately
  if (newStatus === UserStatus.Inactive) {
    const { error: signOutErr } = await supabaseAdmin.auth.admin.signOut(
      student.userId,
      "global",
    );
    if (signOutErr) {
      console.warn("Session sign-out warning:", signOutErr.message);
    }
  }

  return NextResponse.json({
    success: true,
    status: newStatus,
    message: `${student.fullName} is now ${newStatus}${newStatus === UserStatus.Inactive ? " — all sessions signed out" : ""}`,
  });
}







