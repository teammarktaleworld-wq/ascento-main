







import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { createClient } from "@supabase/supabase-js";
import { Prisma } from "@prisma/client";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET  /api/admin/students
export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);

  const where = search
    ? {
        OR: [
          { fullName: { contains: search, mode: "insensitive" as const } },
          { studentId: { contains: search, mode: "insensitive" as const } },
          { parentName: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        enrollments: {
          include: { section: { include: { class: { include: { domain: true } } } } },
          take: 1,
        },
        fees: { orderBy: { createdAt: "desc" }, take: 1 },
        attendance: {
          where: {
            date: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    }),
    prisma.student.count({ where }),
  ]);

  return NextResponse.json({ students, total, page, limit });
}

// POST /api/admin/students
export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const body = await req.json();

  const {
    fullName,
    email,
    password,
    dateOfBirth,
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
    sectionId,
    academicYear,
  } = body;

  if (!email || !fullName) {
    return NextResponse.json(
      { error: "Email and fullName are required" },
      { status: 400 }
    );
  }

  try {
    // 🔥 STEP 1: Create Supabase Auth User
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: password || "Temp@123456",
        email_confirm: true,
      });

    if (authError || !authUser.user) {
      return NextResponse.json(
        { error: authError?.message || "Failed to create auth user" },
        { status: 400 }
      );
    }

    const userId = authUser.user.id;

    // 🔥 STEP 2: Transaction (safe)
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // create Prisma user
      const dbUser = await tx.user.create({
        data: {
          id: userId,
          email,
          name: fullName,
          role: "student",
        },
      });

      const studentId = `AA-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      // create student
      const student = await tx.student.create({
        data: {
          userId: dbUser.id,
          studentId,
          fullName,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
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
          ...(sectionId && academicYear
            ? {
                enrollments: {
                  create: {
                    sectionId,
                    academicYear: academicYear ?? "2024-25",
                  },
                },
              }
            : {}),
        },
        include: { enrollments: true },
      });

      return student;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("Student creation error:", err);

    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}