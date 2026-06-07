// // app/api/admin/users/route.ts
// // GET  /api/admin/users  — paginated list with search/filter/sort
// // POST /api/admin/users  — create user (student | teacher | admin | user)

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers";
// import { createClient } from "@supabase/supabase-js";
// import { Prisma } from "@prisma/client";

// const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// function generatePassword(): string {
//   const upper   = "ABCDEFGHJKLMNPQRSTUVWXYZ";
//   const lower   = "abcdefghjkmnpqrstuvwxyz";
//   const digits  = "23456789";
//   const special = "@#$!";
//   const rand = (s: string) => s[Math.floor(Math.random() * s.length)];
//   const required = [rand(upper), rand(lower), rand(digits), rand(special)];
//   const rest = Array.from({ length: 4 }, () => rand(upper + lower + digits));
//   return [...required, ...rest].sort(() => Math.random() - 0.5).join("");
// }

// async function generateStudentId(): Promise<string> {
//   const year = new Date().getFullYear();
//   for (let attempt = 0; attempt < 10; attempt++) {
//     const id = `STU-${year}-${String(Math.floor(1000 + Math.random() * 9000))}`;
//     const exists = await prisma.student.findUnique({ where: { studentId: id } });
//     if (!exists) return id;
//   }
//   throw new Error("Could not generate unique student ID");
// }

// // ── GET /api/admin/users ──────────────────────────────────────────────────────
// export async function GET(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { searchParams } = new URL(req.url);
//   const search  = searchParams.get("search")  ?? "";
//   const role    = searchParams.get("role")    ?? "";   // admin|student|teacher|user
//   const status  = searchParams.get("status")  ?? "";   // Active|Inactive|Suspended|Deleted
//   const sortBy  = searchParams.get("sortBy")  ?? "newest"; // newest|oldest|name_asc
//   const page    = Math.max(1, Number(searchParams.get("page")  ?? 1));
//   const limit   = Math.min(100, Number(searchParams.get("limit") ?? 20));

//   const where: Prisma.UserWhereInput = {
//     AND: [
//       search
//         ? {
//             OR: [
//               { name:  { contains: search, mode: "insensitive" } },
//               { email: { contains: search, mode: "insensitive" } },
//               { phone: { contains: search, mode: "insensitive" } },
//             ],
//           }
//         : {},
//       role   ? { role:   role   as any } : {},
//       status ? { status: status }        : {},
//     ],
//   };

//   const orderBy: Prisma.UserOrderByWithRelationInput =
//     sortBy === "oldest"   ? { createdAt: "asc"  } :
//     sortBy === "name_asc" ? { name:      "asc"  } :
//                             { createdAt: "desc" };

//   const [users, total] = await Promise.all([
//     prisma.user.findMany({
//       where,
//       skip: (page - 1) * limit,
//       take: limit,
//       orderBy,
//       include: {
//         student: { include: { program: true, programLevel: true } },
//         teacher: { include: { subjects: { include: { subject: true } } } },
//       },
//     }),
//     prisma.user.count({ where }),
//   ]);

//   // Analytics counts (always unfiltered)
//   const [totalCount, studentCount, teacherCount, adminCount, activeCount, inactiveCount] =
//     await Promise.all([
//       prisma.user.count(),
//       prisma.user.count({ where: { role: "student" } }),
//       prisma.user.count({ where: { role: "teacher" } }),
//       prisma.user.count({ where: { role: "admin"   } }),
//       prisma.user.count({ where: { status: "Active"   } }),
//       prisma.user.count({ where: { status: { in: ["Inactive", "Suspended"] } } }),
//     ]);

//   return NextResponse.json({
//     users,
//     total,
//     page,
//     limit,
//     analytics: {
//       total:    totalCount,
//       students: studentCount,
//       teachers: teacherCount,
//       admins:   adminCount,
//       active:   activeCount,
//       inactive: inactiveCount,
//     },
//   });
// }

// // ── POST /api/admin/users ─────────────────────────────────────────────────────
// export async function POST(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const body = await req.json();
//   const {
//     role = "user",
//     name,
//     email,
//     password,
//     phone,
//     avatarUrl,
//     // student-specific
//     dateOfBirth, gender, bloodGroup,
//     address, city, state,
//     parentName, parentPhone, parentEmail,
//     rollNumber, section, academicYear,
//     programId, programLevelId, admissionDate,
//     // teacher-specific
//     experience, designation, wifeOrHusbandOf, dateOfBirthTeacher,
//   } = body;

//   if (!email || !name) {
//     return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
//   }

//   const generatedPassword = password || generatePassword();

//   // 1. Create Supabase auth user
//   const { data: authUser, error: authError } =
//     await supabaseAdmin.auth.admin.createUser({
//       email,
//       password: generatedPassword,
//       email_confirm: true,
//       user_metadata: { name },
//     });

//   if (authError || !authUser.user) {
//     return NextResponse.json(
//       { error: authError?.message ?? "Failed to create auth user" },
//       { status: 400 }
//     );
//   }

//   const userId = authUser.user.id;

//   try {
//     const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
//       // 2. Create User row
//       const dbUser = await tx.user.create({
//         data: {
//           id:       userId,
//           email,
//           name,
//           phone:    phone    || null,
//           avatarUrl: avatarUrl || null,
//           role:     role as any,
//           status:   "Active",
//         },
//       });

//       // 3a. Student profile
//       if (role === "student") {
//         const studentId = await generateStudentId();
//         await tx.student.create({
//           data: {
//             userId:         dbUser.id,
//             studentId,
//             fullName:       name,
//             photoUrl:       avatarUrl      || null,
//             admissionDate:  admissionDate  ? new Date(admissionDate) : null,
//             dateOfBirth:    dateOfBirth    ? new Date(dateOfBirth)   : null,
//             gender,
//             bloodGroup,
//             phone,
//             address,
//             city,
//             state,
//             parentName,
//             parentPhone,
//             parentEmail,
//             rollNumber,
//             section:        section        || null,
//             academicYear:   academicYear   || null,
//             programId:      programId      || null,
//             programLevelId: programLevelId || null,
//           },
//         });
//       }

//       // 3b. Teacher profile
//       if (role === "teacher") {
//         await tx.teacher.create({
//           data: {
//             userId:          dbUser.id,
//             name,
//             phone:           phone               || null,
//             experience:      experience          || null,
//             designation:     designation         || null,
//             wifeOrHusbandOf: wifeOrHusbandOf     || null,
//             dateOfBirth:     dateOfBirthTeacher   ? new Date(dateOfBirthTeacher) : null,
//           },
//         });
//       }

//       return dbUser;
//     });

//     return NextResponse.json(
//       { user: result, credentials: { email, password: generatedPassword } },
//       { status: 201 }
//     );
//   } catch (txErr: unknown) {
//     // Rollback auth user
//     await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => {});
//     const msg = txErr instanceof Error ? txErr.message : "Failed to create user";
//     return NextResponse.json({ error: msg }, { status: 500 });
//   }
// }












// app/api/admin/users/route.ts
// GET  /api/admin/users  — paginated list with search/filter/sort
// POST /api/admin/users  — create user (student | teacher | admin | user)

import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { createClient } from "@supabase/supabase-js";
import { Prisma, UserRole, UserStatus } from "@prisma/client";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generatePassword(): string {
  const upper   = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower   = "abcdefghjkmnpqrstuvwxyz";
  const digits  = "23456789";
  const special = "@#$!";
  const rand = (s: string) => s[Math.floor(Math.random() * s.length)];
  const required = [rand(upper), rand(lower), rand(digits), rand(special)];
  const rest = Array.from({ length: 4 }, () => rand(upper + lower + digits));
  return [...required, ...rest].sort(() => Math.random() - 0.5).join("");
}

async function generateStudentId(): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 10; attempt++) {
    const id = `STU-${year}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const exists = await prisma.student.findUnique({ where: { studentId: id } });
    if (!exists) return id;
  }
  throw new Error("Could not generate unique student ID");
}

// ── GET /api/admin/users ──────────────────────────────────────────────────────
export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const search  = searchParams.get("search")  ?? "";
  const role    = searchParams.get("role")    ?? "";
  const status  = searchParams.get("status")  ?? "";
  const sortBy  = searchParams.get("sortBy")  ?? "newest";
  const page    = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit   = Math.min(100, Number(searchParams.get("limit") ?? 20));

  const validRoles    = Object.values(UserRole);
  const validStatuses = Object.values(UserStatus);

  const where: Prisma.UserWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { name:  { contains: search, mode: Prisma.QueryMode.insensitive } },
              { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {},
      role   && validRoles.includes(role     as UserRole)   ? { role:   role   as UserRole   } : {},
      status && validStatuses.includes(status as UserStatus) ? { status: status as UserStatus } : {},
    ],
  };

  const orderBy: Prisma.UserOrderByWithRelationInput =
    sortBy === "oldest"   ? { createdAt: "asc"  } :
    sortBy === "name_asc" ? { name:      "asc"  } :
                            { createdAt: "desc" };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      include: {
        student: { include: { program: true, programLevel: true } },
        teacher: { include: { subjects: { include: { subject: true } } } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const [totalCount, studentCount, teacherCount, adminCount, activeCount, inactiveCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: UserRole.student } }),
      prisma.user.count({ where: { role: UserRole.teacher } }),
      prisma.user.count({ where: { role: UserRole.admin   } }),
      prisma.user.count({ where: { status: UserStatus.Active } }),
      prisma.user.count({ where: { status: { in: [UserStatus.Inactive, UserStatus.Suspended] } } }),
    ]);

  return NextResponse.json({
    users,
    total,
    page,
    limit,
    analytics: {
      total:    totalCount,
      students: studentCount,
      teachers: teacherCount,
      admins:   adminCount,
      active:   activeCount,
      inactive: inactiveCount,
    },
  });
}

// ── POST /api/admin/users ─────────────────────────────────────────────────────
export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const body = await req.json();
  const {
    role = UserRole.user,
    name,
    email,
    password,
    phone,
    avatarUrl,
    // student-specific
    dateOfBirth, gender, bloodGroup,
    address, city, state,
    parentName, parentPhone, parentEmail,
    rollNumber, section, academicYear,
    programId, programLevelId, admissionDate,
    // teacher-specific
    experience, designation, wifeOrHusbandOf, dateOfBirthTeacher,
  } = body;

  if (!email || !name) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const generatedPassword = password || generatePassword();

  const { data: authUser, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password: generatedPassword,
      email_confirm: true,
      user_metadata: { name },
    });

  if (authError || !authUser.user) {
    return NextResponse.json(
      { error: authError?.message ?? "Failed to create auth user" },
      { status: 400 }
    );
  }

  const userId = authUser.user.id;

  try {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const dbUser = await tx.user.create({
        data: {
          id:        userId,
          email,
          name,
          phone:     phone     || null,
          avatarUrl: avatarUrl || null,
          role:      role as UserRole,
          status:    UserStatus.Active,
        },
      });

      if (role === UserRole.student) {
        const studentId = await generateStudentId();
        await tx.student.create({
          data: {
            userId:         dbUser.id,
            studentId,
            fullName:       name,
            photoUrl:       avatarUrl      || null,
            admissionDate:  admissionDate  ? new Date(admissionDate) : null,
            dateOfBirth:    dateOfBirth    ? new Date(dateOfBirth)   : null,
            gender,
            bloodGroup,
            phone,
            address,
            city,
            state,
            parentName,
            parentPhone,
            parentEmail,
            rollNumber,
            section:        section        || null,
            academicYear:   academicYear   || null,
            programId:      programId      || null,
            programLevelId: programLevelId || null,
          },
        });
      }

      if (role === UserRole.teacher) {
        await tx.teacher.create({
          data: {
            userId:          dbUser.id,
            name,
            phone:           phone             || null,
            experience:      experience        || null,
            designation:     designation       || null,
            wifeOrHusbandOf: wifeOrHusbandOf   || null,
            dateOfBirth:     dateOfBirthTeacher ? new Date(dateOfBirthTeacher) : null,
          },
        });
      }

      return dbUser;
    });

    return NextResponse.json(
      { user: result, credentials: { email, password: generatedPassword } },
      { status: 201 }
    );
  } catch (txErr: unknown) {
    await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => {});
    const msg = txErr instanceof Error ? txErr.message : "Failed to create user";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}