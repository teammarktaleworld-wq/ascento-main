





// // app/api/admin/students/route.ts
// // Changes: accept photoUrl in POST body and save to student record

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";
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

// // ── GET /api/admin/students ───────────────────────────────────────────────────
// export async function GET(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { searchParams } = new URL(req.url);
//   const search        = searchParams.get("search")    ?? "";
//   const programId     = searchParams.get("programId") ?? "";
//   const levelId       = searchParams.get("levelId")   ?? "";
//   const sectionFilter = searchParams.get("section")   ?? "";
//   const page          = Number(searchParams.get("page")  ?? 1);
//   const limit         = Number(searchParams.get("limit") ?? 100);

//   const where: Prisma.StudentWhereInput = {
//     AND: [
//       search ? {
//         OR: [
//           { fullName:   { contains: search, mode: "insensitive" } },
//           { studentId:  { contains: search, mode: "insensitive" } },
//           { parentName: { contains: search, mode: "insensitive" } },
//         ],
//       } : {},
//       programId     ? { programId }              : {},
//       levelId       ? { programLevelId: levelId } : {},
//       sectionFilter ? { section: sectionFilter }  : {},
//     ],
//   };

//   const [students, total] = await Promise.all([
//     prisma.student.findMany({
//       where,
//       skip: (page - 1) * limit,
//       take: limit,
//       orderBy: { createdAt: "desc" },
//       include: { user: true, program: true, programLevel: true },
//     }),
//     prisma.student.count({ where }),
//   ]);

//   return NextResponse.json({ students, total, page, limit });
// }

// // ── POST /api/admin/students ──────────────────────────────────────────────────
// export async function POST(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const body = await req.json();
//   const {
//     fullName, email, password,
//     photoUrl,                    // ← NEW
//     dateOfBirth, gender, bloodGroup, phone,
//     address, city, state,
//     parentName, parentPhone, parentEmail,
//     rollNumber, section, academicYear,
//     programId, programLevelId,
//   } = body;

//   if (!email || !fullName) {
//     return NextResponse.json({ error: "Email and full name are required" }, { status: 400 });
//   }

//   if (programLevelId && !programId) {
//     return NextResponse.json(
//       { error: "A program must be selected when a level is specified" },
//       { status: 400 }
//     );
//   }

//   const generatedPassword = password || generatePassword();

//   try {
//     const { data: authUser, error: authError } =
//       await supabaseAdmin.auth.admin.createUser({
//         email,
//         password: generatedPassword,
//         email_confirm: true,
//       });

//     if (authError || !authUser.user) {
//       return NextResponse.json(
//         { error: authError?.message || "Failed to create auth user" },
//         { status: 400 }
//       );
//     }

//     const userId = authUser.user.id;

//     try {
//       const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
//         const dbUser = await tx.user.create({
//           data: { id: userId, email, name: fullName, role: "student" },
//         });

//         const studentId = await generateStudentId();

//         return tx.student.create({
//           data: {
//             userId:         dbUser.id,
//             studentId,
//             fullName,
//             photoUrl:       photoUrl       || null,   // ← NEW
//             dateOfBirth:    dateOfBirth    ? new Date(dateOfBirth) : null,
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
//           include: { program: true, programLevel: true },
//         });
//       });

//       return NextResponse.json(
//         {
//           ...result,
//           credentials: { studentId: result.studentId, email, password: generatedPassword },
//         },
//         { status: 201 }
//       );
//     } catch (txError: any) {
//       await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => {});
//       return NextResponse.json(
//         { error: txError?.message || "Failed to create student record" },
//         { status: 500 }
//       );
//     }
//   } catch (err: any) {
//     return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
//   }
// }





// app/api/admin/students/route.ts
// Changes: accept photoUrl + admissionDate in POST body and save to student record

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { createClient } from "@supabase/supabase-js";
import { Prisma } from "@prisma/client";

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

// ── GET /api/admin/students ───────────────────────────────────────────────────
export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const search        = searchParams.get("search")    ?? "";
  const programId     = searchParams.get("programId") ?? "";
  const levelId       = searchParams.get("levelId")   ?? "";
  const sectionFilter = searchParams.get("section")   ?? "";
  const page          = Number(searchParams.get("page")  ?? 1);
  const limit         = Number(searchParams.get("limit") ?? 100);

  const where: Prisma.StudentWhereInput = {
    AND: [
      search ? {
        OR: [
          { fullName:   { contains: search, mode: "insensitive" } },
          { studentId:  { contains: search, mode: "insensitive" } },
          { parentName: { contains: search, mode: "insensitive" } },
        ],
      } : {},
      programId     ? { programId }              : {},
      levelId       ? { programLevelId: levelId } : {},
      sectionFilter ? { section: sectionFilter }  : {},
    ],
  };

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: true, program: true, programLevel: true },
    }),
    prisma.student.count({ where }),
  ]);

  return NextResponse.json({ students, total, page, limit });
}

// ── POST /api/admin/students ──────────────────────────────────────────────────
export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const body = await req.json();
  const {
    fullName, email, password,
    photoUrl,
    admissionDate,               // ← NEW
    dateOfBirth, gender, bloodGroup, phone,
    address, city, state,
    parentName, parentPhone, parentEmail,
    rollNumber, section, academicYear,
    programId, programLevelId,
  } = body;

  if (!email || !fullName) {
    return NextResponse.json({ error: "Email and full name are required" }, { status: 400 });
  }

  if (programLevelId && !programId) {
    return NextResponse.json(
      { error: "A program must be selected when a level is specified" },
      { status: 400 }
    );
  }

  const generatedPassword = password || generatePassword();

  try {
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: generatedPassword,
        email_confirm: true,
      });

    if (authError || !authUser.user) {
      return NextResponse.json(
        { error: authError?.message || "Failed to create auth user" },
        { status: 400 }
      );
    }

    const userId = authUser.user.id;

    try {
      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const dbUser = await tx.user.create({
          data: { id: userId, email, name: fullName, role: "student" },
        });

        const studentId = await generateStudentId();

        return tx.student.create({
          data: {
            userId:         dbUser.id,
            studentId,
            fullName,
            photoUrl:       photoUrl       || null,
            admissionDate:  admissionDate  ? new Date(admissionDate) : null,   // ← NEW
            dateOfBirth:    dateOfBirth    ? new Date(dateOfBirth) : null,
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
          include: { program: true, programLevel: true },
        });
      });

      return NextResponse.json(
        {
          ...result,
          credentials: { studentId: result.studentId, email, password: generatedPassword },
        },
        { status: 201 }
      );
    } catch (txError: any) {
      await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => {});
      return NextResponse.json(
        { error: txError?.message || "Failed to create student record" },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}