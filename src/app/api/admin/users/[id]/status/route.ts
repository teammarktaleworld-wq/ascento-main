



// app/api/admin/users/[id]/status/route.ts
// PATCH /api/admin/users/[id]/status
// Set status: Active | Inactive | Suspended | Deleted

import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin"; // ← replaced

const ALLOWED_STATUSES = [
  "Active",
  "Inactive",
  "Suspended",
  "Deleted",
] as const;

type UserStatus = (typeof ALLOWED_STATUSES)[number];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;

  const body = await req.json();
  const status = body.status as UserStatus;

  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json(
      {
        error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // Update database
  const updated = await prisma.user.update({
    where: { id },
    data: {
      status,
    },
  });

  // Sync with Supabase Auth
  try {
    if (status === "Suspended" || status === "Deleted") {
      await supabaseAdmin.auth.admin.updateUserById(id, {
        ban_duration: "876600h", // ~100 years
      });
    } else {
      await supabaseAdmin.auth.admin.updateUserById(id, {
        ban_duration: "none",
      });
    }
  } catch (error) {
    console.error("Failed to sync Supabase status:", error);
    // Non-fatal: database remains source of truth
  }

  return NextResponse.json({
    success: true,
    user: updated,
  });
}