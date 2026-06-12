

import { NextRequest, NextResponse } from "next/server";
import { syncUser } from "@/lib/auth/syncUser";
import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin"; // ← replaced


export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: "Missing or invalid Authorization header",
        },
        {
          status: 401,
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      return NextResponse.json(
        {
          error: "Invalid or expired token",
        },
        {
          status: 401,
        }
      );
    }

    const dbUser = await syncUser(data.user);

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        avatarUrl: dbUser.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Upsert user error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}