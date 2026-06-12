// app/api/test-email/route.ts

import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function GET() {
  try {
    const data = await resend.emails.send({
      from: "Ascento Abacus <info@ascentoabacus.com>",
      to: "apatil9399273310@gmail.com",
      subject: "Resend Setup Successful",
      html: `
        <h1>🎉 Resend Working!</h1>
        <p>Your domain has been verified.</p>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}