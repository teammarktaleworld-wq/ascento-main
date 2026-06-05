





import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function generatePassword(): string {
  const chars =
    "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$";

  return Array.from({ length: 10 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

// ─────────────────────────────────────────────────────────────
// GET /api/admin/teachers
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);

  if (guard) return guard;

  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true,
        subjects: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(teachers);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/admin/teachers
// ─────────────────────────────────────────────────────────────
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
    } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const password = generatePassword();

    // Create Supabase auth user
    const { data: authData, error: authErr } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name,
          role: "teacher",
        },
      });

    if (authErr) {
      throw new Error(authErr.message);
    }

    const supabaseUid = authData.user.id;

    // Parse subjects
    const subjectNames: string[] =
      typeof subjects === "string"
        ? subjects
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
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

      // Upsert subjects
      const subjectRecords = await Promise.all(
        subjectNames.map((subjectName) =>
          tx.subject.upsert({
            where: {
              name: subjectName,
            },
            create: {
              name: subjectName,
            },
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
          designation: designation ?? null,
          wifeOrHusbandOf: wifeOrHusbandOf ?? null,

          subjects:
            subjectRecords.length > 0
              ? {
                  create: subjectRecords.map((s) => ({
                    subjectId: s.id,
                  })),
                }
              : undefined,
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

    return NextResponse.json(
      {
        teacher,
        credentials: {
          name,
          email,
          password,
        },
      },
      {
        status: 201,
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}