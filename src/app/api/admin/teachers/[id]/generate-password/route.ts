import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers"; // ← match your actual filename
import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin"; // ← replaced


function generatePassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$";
  return Array.from({ length: 10 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← Promise in Next.js 15
) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    const { id } = await params; // ← await params

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!teacher)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const password = generatePassword();
    await supabaseAdmin.auth.admin.updateUserById(teacher.userId, { password });

    return NextResponse.json({
      name: teacher.name,
      email: teacher.user.email,
      password,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}