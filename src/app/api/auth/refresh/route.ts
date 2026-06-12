import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin"; // ← replaced


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