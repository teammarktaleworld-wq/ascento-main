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

// ── PATCH /api/admin/teachers/[id] ───────────────────────────────────────────
// app/api/admin/teachers/[id]/route.ts  (PATCH section — merge with your existing DELETE)
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await ctx.params;

  try {
    const { 
      name, phone, experience, designation, 
      wifeOrHusbandOf, subjects, photoUrl, dateOfBirth 
    } = await req.json();

    const subjectNames: string[] =
      typeof subjects === "string"
        ? subjects.split(",").map((s) => s.trim()).filter(Boolean)
        : Array.isArray(subjects) ? subjects : [];

    const teacher = await prisma.$transaction(async (tx) => {
      await tx.teacherSubject.deleteMany({ where: { teacherId: id } });

      const subjectRecords = await Promise.all(
        subjectNames.map((subjectName) =>
          tx.subject.upsert({
            where:  { name: subjectName },
            create: { name: subjectName },
            update: {},
          })
        )
      );

      return tx.teacher.update({
        where: { id },
        data: {
          name,
          phone:           phone           ?? null,
          experience:      experience      ?? null,
          designation:     designation     ?? null,
          wifeOrHusbandOf: wifeOrHusbandOf ?? null,
          photoUrl:        photoUrl        ?? null,
          dateOfBirth:     dateOfBirth ? new Date(dateOfBirth) : null,
          subjects:
            subjectRecords.length > 0
              ? { create: subjectRecords.map((s) => ({ subjectId: s.id })) }
              : undefined,
          user: { update: { name, phone: phone ?? null } },
        },
        include: {
          user:     true,
          subjects: { include: { subject: true } },
        },
      });
    });

    return NextResponse.json(teacher);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
// ── DELETE /api/admin/teachers/[id] ──────────────────────────────────────────
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await ctx.params;

  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!teacher)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Delete Supabase auth user first
    await supabaseAdmin.auth.admin.deleteUser(teacher.userId);

    // Delete DB user — cascades to Teacher via onDelete: Cascade
    await prisma.user.delete({ where: { id: teacher.userId } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}