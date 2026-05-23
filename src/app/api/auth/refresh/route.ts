import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service-role client so we can refresh any session server-side
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── POST /api/auth/refresh ───────────────────────────────────────────────────
// Accepts a refresh_token, returns a new access_token.
// Call this when any API returns 401 (token expired).
//
// Request body (JSON):
//   { "refresh_token": "..." }
//
// Success 200:
//   {
//     "access_token": "...",
//     "refresh_token": "...",   ← new refresh token (rotate it)
//     "expires_in": 3600
//   }
//
// Error 400 → missing refresh_token
// Error 401 → invalid or expired refresh_token

export async function POST(req: Request) {
  let body: { refresh_token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { refresh_token } = body;
  if (!refresh_token) {
    return NextResponse.json({ error: "refresh_token is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.refreshSession({ refresh_token });

  if (error || !data.session) {
    return NextResponse.json(
      { error: "Invalid or expired refresh token. Please log in again." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in: data.session.expires_in,
    token_type: "Bearer",
  });
}