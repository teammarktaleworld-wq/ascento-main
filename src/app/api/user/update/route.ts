// app/api/user/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin"; // ← replaced

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Verify user
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, city } = body;

    // ✅ Update DB
    const updatedUser = await prisma.user.update({
      where: { id: data.user.id },
      data: {
        name,
        phone,
        city,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}