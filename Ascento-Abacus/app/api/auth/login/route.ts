import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password, role } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email (case-insensitive)
    const normalizedEmail = identifier.toLowerCase().trim();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
        ],
      },
      include: {
        student: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check role if specified
    if (role && user.role !== role) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Account has no password set. Please contact your administrator." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate session key
    const sessionKey = crypto.randomUUID();

    // Return user data (without password)
    const { passwordHash: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      data: {
        sessionKey,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        user: safeUser,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
