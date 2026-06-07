// import { NextResponse } from "next/server";
// import { supabase } from "@/lib/helpers/supabaseClient";
// import { prisma } from "@/lib/helpers/prisma";

// // ─── POST /api/auth/login ─────────────────────────────────────────────────────
// // Accepts email + password, returns JWT access_token + user info.
// // Works identically for web (fetch) and Flutter (http/dio).
// //
// // Request body (JSON):
// //   { "email": "...", "password": "..." }
// //
// // Success 200:
// //   {
// //     "access_token": "...",   ← use as Bearer token in all protected APIs
// //     "refresh_token": "...",  ← store securely; use to get new access_token
// //     "expires_in": 3600,      ← seconds until access_token expires
// //     "user": {
// //       "id": "...",
// //       "email": "...",
// //       "name": "...",
// //       "role": "admin" | "user" | "student",
// //       "avatarUrl": "..." | null
// //     }
// //   }
// //
// // Error 400 → missing fields
// // Error 401 → wrong email or password
// // Error 500 → server error

// export async function POST(req: Request) {
//   // ── 1. Parse body ─────────────────────────────────────────────────────────
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

//   // ── 2. Authenticate with Supabase ─────────────────────────────────────────
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email: email.trim().toLowerCase(),
//     password,
//   });

//   if (error || !data.session || !data.user) {
//     return NextResponse.json(
//       { error: "Invalid email or password" },
//       { status: 401 }
//     );
//   }

//   const { session, user: supabaseUser } = data;

//   // ── 3. Upsert user into Prisma DB ─────────────────────────────────────────
//   // Ensures user row exists with latest metadata (same as /api/auth/upsert-user)
//   let dbUser;
//   try {
//     const name =
//       supabaseUser.user_metadata?.full_name ||
//       supabaseUser.user_metadata?.name ||
//       supabaseUser.email?.split("@")[0] ||
//       "User";

//     const role =
//       supabaseUser.user_metadata?.role?.trim().toLowerCase() || "user";

//     const avatarUrl =
//       supabaseUser.user_metadata?.avatar_url ||
//       supabaseUser.user_metadata?.picture ||
//       null;

//     dbUser = await prisma.user.upsert({
//       where: { id: supabaseUser.id },
//       update: { email: supabaseUser.email!, name, avatarUrl },
//       create: {
//         id: supabaseUser.id,
//         email: supabaseUser.email!,
//         name,
//         role,
//         avatarUrl,
//       },
//       select: { id: true, email: true, name: true, role: true, avatarUrl: true },
//     });
//   } catch (dbErr) {
//     console.error("DB upsert error:", dbErr);
//     // Still return tokens even if DB upsert fails — don't block login
//     dbUser = {
//       id: supabaseUser.id,
//       email: supabaseUser.email!,
//       name: supabaseUser.user_metadata?.full_name || supabaseUser.email!.split("@")[0],
//       role: supabaseUser.user_metadata?.role?.trim().toLowerCase() || "user",
//       avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
//     };
//   }

//   // ── 4. Return tokens + user ───────────────────────────────────────────────
//   return NextResponse.json({
//     access_token: session.access_token,
//     refresh_token: session.refresh_token,
//     expires_in: session.expires_in,          // seconds (typically 3600)
//     token_type: "Bearer",
//     user: {
//       id: dbUser.id,
//       email: dbUser.email,
//       name: dbUser.name,
//       role: dbUser.role,
//       avatarUrl: dbUser.avatarUrl,
//     },
//   });
// }












import { NextResponse } from "next/server";
import { supabase } from "@/lib/helpers/supabaseClient";

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

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error || !data.session || !data.user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const { session, user } = data;

  return NextResponse.json({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: session.expires_in,
    token_type: "Bearer",

    // optional basic user info
    user: {
      id: user.id,
      email: user.email,
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