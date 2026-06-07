// // // app/api/admin/users/[id]/route.ts
// // // GET    /api/admin/users/[id]  — full user detail (with student/teacher)
// // // PATCH  /api/admin/users/[id]  — edit name, phone, avatar, role, status
// // // DELETE /api/admin/users/[id]  — soft-delete (status = "Deleted")

// // import { NextResponse } from "next/server";
// // import { prisma } from "@/lib/helpers/prisma";
// // import { requireAdmin } from "@/lib/helpers/auth-helpers";
// // import { createClient } from "@supabase/supabase-js";

// // const supabaseAdmin = createClient(
// //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //   process.env.SUPABASE_SERVICE_ROLE_KEY!
// // );

// // // ── GET /api/admin/users/[id] ─────────────────────────────────────────────────
// // export async function GET(
// //   req: Request,
// //   { params }: { params: { id: string } }
// // ) {
// //   const err = await requireAdmin(req);
// //   if (err) return err;

// //   const user = await prisma.user.findUnique({
// //     where: { id: params.id },
// //     include: {
// //       student: {
// //         include: {
// //           program:      true,
// //           programLevel: true,
// //           attendance: {
// //             orderBy: { date: "desc" },
// //             take: 5,
// //           },
// //           fees: {
// //             orderBy: { createdAt: "desc" },
// //             take: 5,
// //           },
// //         },
// //       },
// //       teacher: {
// //         include: {
// //           subjects: { include: { subject: true } },
// //         },
// //       },
// //       notifications: {
// //         orderBy: { createdAt: "desc" },
// //         take: 5,
// //       },
// //     },
// //   });

// //   if (!user) {
// //     return NextResponse.json({ error: "User not found" }, { status: 404 });
// //   }

// //   // Fetch Supabase auth metadata (provider, email confirmed, last sign-in)
// //   let authMeta: {
// //     emailConfirmed: boolean;
// //     provider: string;
// //     lastSignIn: string | null;
// //     createdAt: string | null;
// //   } = {
// //     emailConfirmed: false,
// //     provider:       "email",
// //     lastSignIn:     null,
// //     createdAt:      null,
// //   };

// //   try {
// //     const { data } = await supabaseAdmin.auth.admin.getUserById(params.id);
// //     if (data.user) {
// //       authMeta = {
// //         emailConfirmed: data.user.email_confirmed_at != null,
// //         provider:       data.user.app_metadata?.provider ?? "email",
// //         lastSignIn:     data.user.last_sign_in_at ?? null,
// //         createdAt:      data.user.created_at      ?? null,
// //       };
// //     }
// //   } catch {
// //     // Non-fatal — return user without auth meta
// //   }

// //   return NextResponse.json({ user, authMeta });
// // }

// // // ── PATCH /api/admin/users/[id] ───────────────────────────────────────────────
// // export async function PATCH(
// //   req: Request,
// //   { params }: { params: { id: string } }
// // ) {
// //   const err = await requireAdmin(req);
// //   if (err) return err;

// //   const body = await req.json();
// //   const { name, phone, avatarUrl, role, status } = body;

// //   const existing = await prisma.user.findUnique({ where: { id: params.id } });
// //   if (!existing) {
// //     return NextResponse.json({ error: "User not found" }, { status: 404 });
// //   }

// //   const updated = await prisma.user.update({
// //     where: { id: params.id },
// //     data: {
// //       ...(name      !== undefined && { name      }),
// //       ...(phone     !== undefined && { phone     }),
// //       ...(avatarUrl !== undefined && { avatarUrl }),
// //       ...(role      !== undefined && { role      }),
// //       ...(status    !== undefined && { status    }),
// //     },
// //     include: {
// //       student: true,
// //       teacher: true,
// //     },
// //   });

// //   // Sync name change to student/teacher profile if present
// //   if (name) {
// //     if (updated.student) {
// //       await prisma.student.update({
// //         where: { userId: params.id },
// //         data:  { fullName: name },
// //       });
// //     }
// //     if (updated.teacher) {
// //       await prisma.teacher.update({
// //         where: { userId: params.id },
// //         data:  { name },
// //       });
// //     }
// //   }

// //   return NextResponse.json({ user: updated });
// // }

// // // ── DELETE /api/admin/users/[id] ──────────────────────────────────────────────
// // // Soft-delete only — set status = "Deleted"
// // // Hard-delete is intentionally not exposed to prevent data loss.
// // export async function DELETE(
// //   req: Request,
// //   { params }: { params: { id: string } }
// // ) {
// //   const err = await requireAdmin(req);
// //   if (err) return err;

// //   const existing = await prisma.user.findUnique({ where: { id: params.id } });
// //   if (!existing) {
// //     return NextResponse.json({ error: "User not found" }, { status: 404 });
// //   }

// //   // Soft-delete in DB
// //   await prisma.user.update({
// //     where: { id: params.id },
// //     data:  { status: "Deleted" },
// //   });

// //   // Disable in Supabase Auth (ban = can't log in) without removing their data
// //   try {
// //     await supabaseAdmin.auth.admin.updateUserById(params.id, { ban_duration: "876600h" });
// //   } catch {
// //     // Non-fatal
// //   }

// //   return NextResponse.json({ success: true });
// // }



// app/api/admin/users/[id]/route.ts
// GET    /api/admin/users/[id]  — full user detail (with student/teacher)
// PATCH  /api/admin/users/[id]  — edit name, phone, avatar, role, status
// DELETE /api/admin/users/[id]  — soft-delete (status = "Deleted")

import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── GET /api/admin/users/[id] ─────────────────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;

console.log("Requested ID:", id);




  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      student: {
        include: {
          program: true,
          programLevel: true,
          attendance: {
            orderBy: { date: "desc" },
            take: 5,
          },
          fees: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      },
      teacher: {
        include: {
          subjects: {
            include: {
              subject: true,
            },
          },
        },
      },
      notifications: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }
console.log("Found User:", user);

  let authMeta: {
    emailConfirmed: boolean;
    provider: string;
    lastSignIn: string | null;
    createdAt: string | null;
  } = {
    emailConfirmed: false,
    provider: "email",
    lastSignIn: null,
    createdAt: null,
  };

  try {
    const { data } = await supabaseAdmin.auth.admin.getUserById(id);

    if (data.user) {
      authMeta = {
        emailConfirmed: data.user.email_confirmed_at != null,
        provider: data.user.app_metadata?.provider ?? "email",
        lastSignIn: data.user.last_sign_in_at ?? null,
        createdAt: data.user.created_at ?? null,
      };
    }
  } catch {
    // Non-fatal
  }

  return NextResponse.json({
    user,
    authMeta,
  });
}

// ── PATCH /api/admin/users/[id] ───────────────────────────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;
  const body = await req.json();

  const {
    name,
    phone,
    avatarUrl,
    role,
    status,
  } = body;

  const existing = await prisma.user.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(avatarUrl !== undefined && { avatarUrl }),
      ...(role !== undefined && { role }),
      ...(status !== undefined && { status }),
    },
    include: {
      student: true,
      teacher: true,
    },
  });

  if (name) {
    if (updated.student) {
      await prisma.student.update({
        where: { userId: id },
        data: {
          fullName: name,
        },
      });
    }

    if (updated.teacher) {
      await prisma.teacher.update({
        where: { userId: id },
        data: {
          name,
        },
      });
    }
  }

  return NextResponse.json({
    user: updated,
  });
}

// ── DELETE /api/admin/users/[id] ──────────────────────────────────────────────
// export async function DELETE(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { id } = await params;

//   const existing = await prisma.user.findUnique({
//     where: { id },
//   });

//   if (!existing) {
//     return NextResponse.json(
//       { error: "User not found" },
//       { status: 404 }
//     );
//   }

// //   await prisma.user.update({
// //     where: { id },
// //     data: {
// //       status: "Deleted",
// //     },
// //   });

//   await prisma.user.update({
//   where: { id },
//   data: {
//     status: "Suspended",
//   },
// });

//   try {
//     await supabaseAdmin.auth.admin.updateUserById(id, {
//       ban_duration: "876600h",
//     });
//   } catch {
//     // Non-fatal
//   }

//   return NextResponse.json({
//     success: true,
//   });
// }
















// ── DELETE /api/admin/users/[id] ──────────────────────────────────────────────
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { id } = await params;

  const existing = await prisma.user.findUnique({
    where: { id },
    include: {
      student: true,
      teacher: true,
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // ── 1. Manually delete records that won't cascade automatically ──────────────

  // Nullify enquiries created by this user (createdById is nullable, no cascade)
  await prisma.enquiry.updateMany({
    where: { createdById: id },
    data: { createdById: null },
  });

  // ── 2. Delete student sub-records (if student exists) ────────────────────────
  // Attendance and StudentFee both have onDelete: Cascade from Student,
  // but we delete explicitly here for clarity and safety.
  if (existing.student) {
    await prisma.attendance.deleteMany({
      where: { studentId: existing.student.id },
    });

    await prisma.studentFee.deleteMany({
      where: { studentId: existing.student.id },
    });

    await prisma.student.delete({
      where: { id: existing.student.id },
    });
  }

  // ── 3. Delete teacher sub-records (if teacher exists) ────────────────────────
  // TeacherSubject has onDelete: Cascade from Teacher, but explicit is safer.
  if (existing.teacher) {
    await prisma.teacherSubject.deleteMany({
      where: { teacherId: existing.teacher.id },
    });

    await prisma.teacher.delete({
      where: { id: existing.teacher.id },
    });
  }

  // ── 4. Delete notifications ───────────────────────────────────────────────────
  // Has onDelete: Cascade from User, but deleting before user.delete is safe too.
  await prisma.notification.deleteMany({
    where: { userId: id },
  });

  // ── 5. Delete the User row itself ─────────────────────────────────────────────
  await prisma.user.delete({
    where: { id },
  });

  // ── 6. Hard-delete from Supabase Auth ─────────────────────────────────────────
  try {
    await supabaseAdmin.auth.admin.deleteUser(id);
  } catch (e) {
    // Log but don't fail — DB record is already gone
    console.error("Supabase auth delete failed:", e);
  }

  return NextResponse.json({ success: true });
}