// // src\app\api\admin\teachers\[id]\generate-password\route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers"; // ← match your actual filename
// import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin"; // ← replaced


// function generatePassword(): string {
//   const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$";
//   return Array.from({ length: 10 }, () =>
//     chars[Math.floor(Math.random() * chars.length)]
//   ).join("");
// }

// export async function POST(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> } // ← Promise in Next.js 15
// ) {
//   const guard = await requireAdmin(req);
//   if (guard) return guard;

//   try {
//     const { id } = await params; // ← await params

//     const teacher = await prisma.teacher.findUnique({
//       where: { id },
//       include: { user: true },
//     });
//     if (!teacher)
//       return NextResponse.json({ error: "Not found" }, { status: 404 });

//     const password = generatePassword();
//     await supabaseAdmin.auth.admin.updateUserById(teacher.userId, { password });

//     return NextResponse.json({
//       name: teacher.name,
//       email: teacher.user.email,
//       password,
//     });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }















// src/app/api/admin/teachers/[id]/generate-password/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin";
import { sendTeacherCredentialsEmail } from "@/lib/helpers/sendTeacherCredentialsEmail";

function generatePassword(): string {
  const upper   = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower   = "abcdefghjkmnpqrstuvwxyz";
  const digits  = "23456789";
  const special = "@#$!";
  const rand = (s: string) => s[Math.floor(Math.random() * s.length)];
  const required = [rand(upper), rand(lower), rand(digits), rand(special)];
  const rest = Array.from({ length: 6 }, () => rand(upper + lower + digits));
  return [...required, ...rest].sort(() => Math.random() - 0.5).join("");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const { id } = await params;

  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!teacher) {
    return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
  }

  const password = generatePassword();

  // 1. Update password in Supabase Auth
  const { error: pwErr } = await supabaseAdmin.auth.admin.updateUserById(
    teacher.userId,
    { password },
  );
  if (pwErr) {
    return NextResponse.json({ error: pwErr.message }, { status: 500 });
  }

  // 2. Sign out all existing sessions (non-fatal)
  const { error: signOutErr } = await supabaseAdmin.auth.admin.signOut(
    teacher.userId,
    "global",
  );
  if (signOutErr) {
    console.warn("[generate-password] Session revoke warning:", signOutErr.message);
  }

  // 3. Stamp forceLogoutAt so any active browser tab is kicked on next /api/me
  const forceLogoutAt = new Date();
  await prisma.user.update({
    where: { id: teacher.userId },
    data:  { forceLogoutAt },
  });

  // 4. Send credentials email to teacher's own email
  const teacherEmail = teacher.user.email;
  const { emailSent, emailError, emailMessageId } =
    await sendTeacherCredentialsEmail({
      teacherEmail,
      teacherName:  teacher.name,
      teacherId:    teacher.id,
      loginEmail:   teacherEmail,
      password,
      isNew:        false,
      logPrefix:    "[teacher generate-password]",
    });

  if (!emailSent) {
    console.warn("[generate-password] Email not sent:", emailError);
  }

  return NextResponse.json({
    name:           teacher.name,
    email:          teacherEmail,
    password,
    emailSent,
    emailError,
    emailMessageId,
    forceLogoutAt,
  });
}