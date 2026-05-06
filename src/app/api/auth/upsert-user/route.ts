// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import { createClient } from "@supabase/supabase-js";

// const prisma = new PrismaClient();

// // ✅ Server-side Supabase client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// export async function POST(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get("authorization");

//     if (!authHeader?.startsWith("Bearer ")) {
//       return NextResponse.json(
//         { error: "Missing or invalid Authorization header" },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.replace("Bearer ", "");

//     // ✅ Verify user with Supabase
//     const { data, error } = await supabase.auth.getUser(token);

//     if (error || !data.user) {
//       return NextResponse.json(
//         { error: "Invalid or expired token" },
//         { status: 401 }
//       );
//     }

//     const user = data.user;

//     // ✅ Safe extraction
//     const email = user.email;
//     const name =
//       user.user_metadata?.full_name ||
//       user.user_metadata?.name ||
//       null;

//     const avatarUrl = user.user_metadata?.avatar_url || null;

//     const phone = user.phone || null;

//     if (!email) {
//       return NextResponse.json(
//         { error: "User email missing" },
//         { status: 400 }
//       );
//     }

//     // ✅ Upsert (clean + safe)
//     const dbUser = await prisma.user.upsert({
//       where: { id: user.id },
//       update: {
//         email,
//         name,
//         avatarUrl,
//         phone,
//         // ❌ NEVER update role here
//       },
//       create: {
//         id: user.id,
//         email,
//         name,
//         avatarUrl,
//         phone,
//         role: "user",
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       user: dbUser,
//     });
//   } catch (err) {
//     console.error("Upsert error:", err);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }











import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { UserRole } from "@prisma/client";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // ✅ Verify user
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const user = data.user;

    const email = user.email;
    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      null;

    const avatarUrl = user.user_metadata?.avatar_url || null;
    const phone = user.phone || null;

    if (!email) {
      return NextResponse.json(
        { error: "User email missing" },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email,
        name,
        avatarUrl,
        phone,
        // 🚫 role NOT touched
      },
      create: {
        id: user.id,
        email,
        name,
        avatarUrl,
        phone,
        role: UserRole.user,
      },
    });

    return NextResponse.json({
      success: true,
      user: dbUser,
    });
  } catch (err) {
    console.error("Upsert error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}