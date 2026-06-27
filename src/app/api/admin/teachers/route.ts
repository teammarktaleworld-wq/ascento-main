



// // src\app\api\admin\teachers\route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers";
// import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin"; // ← replaced


// function generatePassword(): string {
//   const chars =
//     "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$";

//   return Array.from({ length: 10 }, () =>
//     chars[Math.floor(Math.random() * chars.length)]
//   ).join("");
// }

// // ─────────────────────────────────────────────────────────────
// // GET /api/admin/teachers
// // ─────────────────────────────────────────────────────────────
// export async function GET(req: NextRequest) {
//   const guard = await requireAdmin(req);

//   if (guard) return guard;

//   try {
//     const teachers = await prisma.teacher.findMany({
//       include: {
//         user: true,
//         subjects: {
//           include: {
//             subject: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return NextResponse.json(teachers);
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: err.message },
//       { status: 500 }
//     );
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // POST /api/admin/teachers
// // ─────────────────────────────────────────────────────────────
// export async function POST(req: NextRequest) {
//   const guard = await requireAdmin(req);

//   if (guard) return guard;

//   try {
//     const {
//       name,
//       email,
//       phone,
//       experience,
//       designation,
//       wifeOrHusbandOf,
//       subjects,
//     } = await req.json();

//     if (!name || !email) {
//       return NextResponse.json(
//         { error: "Name and email are required" },
//         { status: 400 }
//       );
//     }

//     // Check duplicate email
//     const existing = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existing) {
//       return NextResponse.json(
//         { error: "A user with this email already exists" },
//         { status: 409 }
//       );
//     }

//     const password = generatePassword();

//     // Create Supabase auth user
//     const { data: authData, error: authErr } =
//       await supabaseAdmin.auth.admin.createUser({
//         email,
//         password,
//         email_confirm: true,
//         user_metadata: {
//           name,
//           role: "teacher",
//         },
//       });

//     if (authErr) {
//       throw new Error(authErr.message);
//     }

//     const supabaseUid = authData.user.id;

//     // Parse subjects
//     const subjectNames: string[] =
//       typeof subjects === "string"
//         ? subjects
//             .split(",")
//             .map((s) => s.trim())
//             .filter(Boolean)
//         : Array.isArray(subjects)
//         ? subjects
//         : [];

//     // Create DB records in transaction
//     const teacher = await prisma.$transaction(async (tx) => {
//       await tx.user.create({
//         data: {
//           id: supabaseUid,
//           email,
//           name,
//           phone: phone ?? null,
//           role: "teacher",
//         },
//       });

//       // Upsert subjects
//       const subjectRecords = await Promise.all(
//         subjectNames.map((subjectName) =>
//           tx.subject.upsert({
//             where: {
//               name: subjectName,
//             },
//             create: {
//               name: subjectName,
//             },
//             update: {},
//           })
//         )
//       );

//       return tx.teacher.create({
//         data: {
//           userId: supabaseUid,
//           name,
//           phone: phone ?? null,
//           experience: experience ?? null,
//           designation: designation ?? null,
//           wifeOrHusbandOf: wifeOrHusbandOf ?? null,

//           subjects:
//             subjectRecords.length > 0
//               ? {
//                   create: subjectRecords.map((s) => ({
//                     subjectId: s.id,
//                   })),
//                 }
//               : undefined,
//         },

//         include: {
//           user: true,

//           subjects: {
//             include: {
//               subject: true,
//             },
//           },
//         },
//       });
//     });

//     return NextResponse.json(
//       {
//         teacher,
//         credentials: {
//           name,
//           email,
//           password,
//         },
//       },
//       {
//         status: 201,
//       }
//     );
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: err.message },
//       { status: 500 }
//     );
//   }
// }
















// src/app/api/admin/teachers/route.ts

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

// ── GET /api/admin/teachers ───────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true,
        subjects: { include: { subject: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(teachers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST /api/admin/teachers ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    const {
      name,
      email,
      phone,
      experience,
      designation,
      wifeOrHusbandOf,
      subjects,
      photoUrl,      // ← now read from body
      dateOfBirth,   // ← now read from body
    } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 },
      );
    }

    const password = generatePassword();

    // Create Supabase auth user
    const { data: authData, error: authErr } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role: "teacher" },
      });

    if (authErr) throw new Error(authErr.message);

    const supabaseUid = authData.user.id;

    // Parse subjects
    const subjectNames: string[] =
      typeof subjects === "string"
        ? subjects.split(",").map((s) => s.trim()).filter(Boolean)
        : Array.isArray(subjects)
        ? subjects
        : [];

    // Create DB records in a transaction
    const teacher = await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id:    supabaseUid,
          email,
          name,
          phone: phone ?? null,
          role:  "teacher",
        },
      });

      const subjectRecords = await Promise.all(
        subjectNames.map((subjectName) =>
          tx.subject.upsert({
            where:  { name: subjectName },
            create: { name: subjectName },
            update: {},
          }),
        ),
      );

      return tx.teacher.create({
        data: {
          userId:          supabaseUid,
          name,
          phone:           phone          ?? null,
          experience:      experience     ?? null,
          designation:     designation    ?? null,
          wifeOrHusbandOf: wifeOrHusbandOf ?? null,
          photoUrl:        photoUrl        ?? null,   // ← saved
          dateOfBirth:     dateOfBirth ? new Date(dateOfBirth) : null, // ← saved
          subjects:
            subjectRecords.length > 0
              ? { create: subjectRecords.map((s) => ({ subjectId: s.id })) }
              : undefined,
        },
        include: {
          user: true,
          subjects: { include: { subject: true } },
        },
      });
    });

    // Send credentials email to the teacher's own email address
    const { emailSent, emailError, emailMessageId } =
      await sendTeacherCredentialsEmail({
        teacherEmail: email,
        teacherName:  name,
        teacherId:    teacher.id,
        loginEmail:   email,
        password,
        isNew:        true,
        logPrefix:    "[POST /api/admin/teachers]",
      });

    if (!emailSent) {
      console.warn("[POST /api/admin/teachers] Email not sent:", emailError);
    }

    return NextResponse.json(
      {
        teacher,
        credentials: { name, email, password },
        emailSent,
        emailError,
        emailMessageId,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}