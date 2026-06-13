









// import { NextResponse } from "next/server";
// import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin"; // ← replaced

// export async function POST(req: Request) {
//   let body: { email?: string; password?: string };

//   try {
//     body = await req.json();
//   } catch {
//     return NextResponse.json(
//       { error: "Invalid JSON body" },
//       { status: 400 }
//     );
//   }

//   const { email, password } = body;

//   if (!email?.trim() || !password) {
//     return NextResponse.json(
//       { error: "email and password are required" },
//       { status: 400 }
//     );
//   }

//   const { data, error } = await supabaseAdmin.auth.signInWithPassword({
//     email: email.trim().toLowerCase(),
//     password,
//   });

//   if (error || !data.session || !data.user) {
//     return NextResponse.json(
//       { error: "Invalid email or password" },
//       { status: 401 }
//     );
//   }

//   const { session, user } = data;

//   return NextResponse.json({
//     access_token: session.access_token,
//     refresh_token: session.refresh_token,
//     expires_in: session.expires_in,
//     token_type: "Bearer",

//     // optional basic user info
//     user: {
//       id: user.id,
//       email: user.email,
//       name:
//         user.user_metadata?.full_name ||
//         user.user_metadata?.name ||
//         null,
//       avatarUrl:
//         user.user_metadata?.avatar_url ||
//         user.user_metadata?.picture ||
//         null,
//     },
//   });
// }













import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin";
import { prisma } from "@/lib/helpers/prisma";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { email, password } = body;

  if (!email?.trim() || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error || !data.session || !data.user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }


console.log("SUPABASE ERROR:", error);
console.log("USER:", data?.user?.email);

  const { session, user } = data;

  // CHECK USER STATUS IN DB
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      status: true,
      role: true,
    },
  });

  if (!dbUser || dbUser.status !== "Active") {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: session.expires_in,
    token_type: "Bearer",

    user: {
      id: user.id,
      email: user.email,
      role: dbUser.role,
      name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        null,
      avatarUrl:
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        null,
    },
  });
}