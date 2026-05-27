// // // app/api/admin/teachers/route.ts

// // import { NextResponse } from "next/server";
// // import { prisma }       from "@/lib/prisma";
// // import { requireAdmin } from "@/lib/auth-helpers";
// // import { createClient } from "@supabase/supabase-js";

// // const supabaseAdmin = createClient(
// //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //   process.env.SUPABASE_SERVICE_ROLE_KEY!
// // );

// // // ─── GET /api/admin/teachers ──────────────────────────────────────────────────
// // // Returns all teachers with their linked user email
// // export async function GET(req: Request) {
// //   const err = await requireAdmin(req);
// //   if (err) return err;

// //   const { searchParams } = new URL(req.url);
// //   const search = searchParams.get("search")?.trim() ?? "";

// //   const teachers = await prisma.teacher.findMany({
// //     where: search
// //       ? {
// //           OR: [
// //             { name:       { contains: search, mode: "insensitive" } },
// //             { user: { email: { contains: search, mode: "insensitive" } } },
// //           ],
// //         }
// //       : undefined,
// //     include: {
// //       user: { select: { id: true, email: true, avatarUrl: true } },
// //     },
// //     orderBy: { name: "asc" },
// //   });

// //   return NextResponse.json(teachers);
// // }

// // // ─── POST /api/admin/teachers ─────────────────────────────────────────────────
// // // Creates a Supabase Auth user (invite), a User row, and a Teacher row.
// // // Body: { name, email, phone?, experience? }
// // export async function POST(req: Request) {
// //   const err = await requireAdmin(req);
// //   if (err) return err;

// //   let body: {
// //     name?:       string;
// //     email?:      string;
// //     phone?:      string;
// //     experience?: string;
// //   };

// //   try { body = await req.json(); }
// //   catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

// //   const { name, email, phone, experience } = body;

// //   if (!name?.trim())
// //     return NextResponse.json({ error: "Name is required" }, { status: 400 });
// //   if (!email?.trim())
// //     return NextResponse.json({ error: "Email is required" }, { status: 400 });

// //   // Check if email already registered
// //   const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
// //   if (existing)
// //     return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });

// //   // 1. Create Supabase Auth user and send invite email
// //   const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(
// //     email.trim().toLowerCase(),
// //     { data: { name: name.trim(), role: "user" } }
// //   );

// //   if (authErr || !authData.user) {
// //     console.error("Supabase invite error:", authErr?.message);
// //     return NextResponse.json(
// //       { error: authErr?.message ?? "Failed to create auth user" },
// //       { status: 500 }
// //     );
// //   }

// //   try {
// //     // 2. Create User row (role = user by default; admin can elevate later)
// //     const user = await prisma.user.create({
// //       data: {
// //         id:    authData.user.id,
// //         email: email.trim().toLowerCase(),
// //         name:  name.trim(),
// //         phone: phone?.trim() ?? null,
// //         role:  "user",
// //       },
// //     });

// //     // 3. Create Teacher row
// //     const teacher = await prisma.teacher.create({
// //       data: {
// //         userId:     user.id,
// //         name:       name.trim(),
// //         phone:      phone?.trim()      ?? null,
// //         experience: experience?.trim() ?? null,
// //       },
// //       include: {
// //         user: { select: { id: true, email: true, avatarUrl: true } },
// //       },
// //     });

// //     return NextResponse.json(teacher, { status: 201 });

// //   } catch (dbErr: any) {
// //     // Roll back the Supabase Auth user if DB insert fails
// //     await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
// //     console.error("DB error:", dbErr);
// //     return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
// //   }
// // }












// // app/api/admin/teachers/route.ts

// import { NextResponse } from "next/server";
// import { prisma }       from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";
// import { createClient } from "@supabase/supabase-js";

// const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// // ─── GET /api/admin/teachers ──────────────────────────────────────────────────
// export async function GET(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { searchParams } = new URL(req.url);
//   const search = searchParams.get("search")?.trim() ?? "";

//   const teachers = await prisma.teacher.findMany({
//     where: search
//       ? {
//           OR: [
//             { name:       { contains: search, mode: "insensitive" } },
//             { user: { email: { contains: search, mode: "insensitive" } } },
//           ],
//         }
//       : undefined,
//     include: {
//       user: { select: { id: true, email: true, avatarUrl: true } },
//     },
//     orderBy: { name: "asc" },
//   });

//   return NextResponse.json(teachers);
// }

// // ─── POST /api/admin/teachers ─────────────────────────────────────────────────
// // Body: { name, email, phone?, experience?, sendInvite? }
// //
// // sendInvite: true  → inviteUserByEmail (sends email, works on real domains)
// // sendInvite: false → createUser with a temp password (works on any valid email)
// export async function POST(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   let body: {
//     name?:        string;
//     email?:       string;
//     phone?:       string;
//     experience?:  string;
//     sendInvite?:  boolean;  // NEW: defaults to true
//   };

//   try { body = await req.json(); }
//   catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

//   const { name, email, phone, experience, sendInvite = true } = body;

//   if (!name?.trim())
//     return NextResponse.json({ error: "Name is required" }, { status: 400 });
//   if (!email?.trim())
//     return NextResponse.json({ error: "Email is required" }, { status: 400 });

//   // Basic email format check before hitting Supabase
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email.trim())) {
//     return NextResponse.json({ error: "Invalid email address format" }, { status: 400 });
//   }

//   const normalizedEmail = email.trim().toLowerCase();

//   // Check if email already registered in our DB
//   const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
//   if (existing)
//     return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });

//   // ── Create Supabase Auth user ─────────────────────────────────────────────
//   let authUserId: string;

//   if (sendInvite) {
//     // Path A: invite email (requires real, deliverable domain in Supabase)
//     const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(
//       normalizedEmail,
//       { data: { name: name.trim(), role: "user" } }
//     );

//     if (authErr || !authData.user) {
//       console.error("Supabase invite error:", authErr?.message);
//       // Surface the real Supabase message so the frontend can show it
//       return NextResponse.json(
//         { error: authErr?.message ?? "Failed to send invite email" },
//         { status: 500 }
//       );
//     }

//     authUserId = authData.user.id;
//   } else {
//     // Path B: create without invite — generates a temp password, no email sent.
//     // Teacher resets password on first login via "Forgot password".
//     const tempPassword = crypto.randomUUID(); // never shown, must reset via email

//     const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
//       email: normalizedEmail,
//       password: tempPassword,
//       email_confirm: true,           // skip the email confirmation step
//       user_metadata: { name: name.trim(), role: "user" },
//     });

//     if (authErr || !authData.user) {
//       console.error("Supabase createUser error:", authErr?.message);
//       return NextResponse.json(
//         { error: authErr?.message ?? "Failed to create auth user" },
//         { status: 500 }
//       );
//     }

//     authUserId = authData.user.id;
//   }

//   // ── Create DB rows ────────────────────────────────────────────────────────
//   try {
//     const user = await prisma.user.create({
//       data: {
//         id:    authUserId,
//         email: normalizedEmail,
//         name:  name.trim(),
//         phone: phone?.trim() ?? null,
//         role:  "user",
//       },
//     });

//     const teacher = await prisma.teacher.create({
//       data: {
//         userId:     user.id,
//         name:       name.trim(),
//         phone:      phone?.trim()      ?? null,
//         experience: experience?.trim() ?? null,
//       },
//       include: {
//         user: { select: { id: true, email: true, avatarUrl: true } },
//       },
//     });

//     return NextResponse.json(teacher, { status: 201 });

//   } catch (dbErr: any) {
//     // Roll back the Supabase Auth user if DB insert fails
//     await supabaseAdmin.auth.admin.deleteUser(authUserId);
//     console.error("DB error:", dbErr);
//     return NextResponse.json({ error: "Failed to create teacher record" }, { status: 500 });
//   }
// }












import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function generatePassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$";
  return Array.from({ length: 10 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

// GET /api/admin/teachers
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

// POST /api/admin/teachers
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    const { name, email, phone, experience, subjects } = await req.json();

    if (!name || !email)
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });

    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });

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

    // Create DB records in transaction
    const teacher = await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: supabaseUid,
          email,
          name,
          phone: phone ?? null,
          role: "teacher",
        },
      });

      // Upsert subjects first (outside nested create to avoid async issues)
      const subjectRecords = await Promise.all(
        subjectNames.map((subjectName) =>
          tx.subject.upsert({
            where: { name: subjectName },
            create: { name: subjectName },
            update: {},
          })
        )
      );

      return tx.teacher.create({
        data: {
          userId: supabaseUid,
          name,
          phone: phone ?? null,
          experience: experience ?? null,
          subjects: subjectRecords.length > 0
            ? { create: subjectRecords.map((s) => ({ subjectId: s.id })) }
            : undefined,
        },
        include: {
          user: true,
          subjects: { include: { subject: true } },
        },
      });
    });

    return NextResponse.json(
      {
        teacher,
        credentials: { name, email, password },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}