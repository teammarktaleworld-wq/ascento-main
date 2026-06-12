import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin"; // ← replaced


type Ctx = { params: Promise<{ id: string }> };


export async function PATCH(req: NextRequest, ctx: Ctx) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await ctx.params;

  try {
    const {
      name,
      email,
      phone,
      experience,
      designation,
      wifeOrHusbandOf,
      subjects,
      photoUrl,
      dateOfBirth,
      status,
    } = await req.json();

    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!existingTeacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    const subjectNames: string[] =
      typeof subjects === "string"
        ? subjects
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(subjects)
        ? subjects
        : [];

    const teacher = await prisma.$transaction(async (tx) => {
      // Remove old subject mappings
      await tx.teacherSubject.deleteMany({
        where: {
          teacherId: id,
        },
      });

      // Create / get subjects
      const subjectRecords = await Promise.all(
        subjectNames.map((subjectName) =>
          tx.subject.upsert({
            where: { name: subjectName },
            create: { name: subjectName },
            update: {},
          })
        )
      );

      return tx.teacher.update({
        where: { id },
        data: {
          name: name ?? undefined,
          phone: phone ?? null,
          experience: experience ?? null,
          designation: designation ?? null,
          wifeOrHusbandOf: wifeOrHusbandOf ?? null,
          photoUrl: photoUrl ?? null,
          status: status ?? undefined,

          dateOfBirth: dateOfBirth
            ? new Date(dateOfBirth)
            : null,

          subjects:
            subjectRecords.length > 0
              ? {
                  create: subjectRecords.map((s) => ({
                    subjectId: s.id,
                  })),
                }
              : undefined,

          user: {
            update: {
              ...(name !== undefined && { name }),
              ...(phone !== undefined && {
                phone: phone ?? null,
              }),
              ...(email !== undefined && { email }),
            },
          },
        },

        include: {
          user: true,
          subjects: {
            include: {
              subject: true,
            },
          },
        },
      });
    });

    // Sync email to Supabase
    if (
      email &&
      email !== existingTeacher.user.email
    ) {
      const { error: authError } =
        await supabaseAdmin.auth.admin.updateUserById(
          existingTeacher.userId,
          {
            email,
            email_confirm: true,
          }
        );

      if (authError) {
        console.error(
          "Failed to update Supabase email:",
          authError.message
        );
      }
    }

    return NextResponse.json(teacher);
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error: err.message || "Failed to update teacher",
      },
      { status: 500 }
    );
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