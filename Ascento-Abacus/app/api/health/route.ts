import { NextResponse } from "next/server";

export async function GET() {
  const envCheck = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL: !!process.env.POSTGRES_URL,
    POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
  };

  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    "";

  let dbStatus = "not attempted";
  let dbError = null;

  try {
    const { PrismaClient } = await import("@/lib/generated/prisma/client");
    const { PrismaNeon } = await import("@prisma/adapter-neon");
    const client = new PrismaClient({
      adapter: new PrismaNeon({ connectionString }),
    });
    const count = await client.user.count();
    dbStatus = `connected - ${count} users found`;
    await client.$disconnect();
  } catch (err: any) {
    dbStatus = "failed";
    dbError = err.message || String(err);
  }

  return NextResponse.json({
    envCheck,
    connectionStringPresent: connectionString.length > 0,
    connectionStringPrefix: connectionString.substring(0, 30) + "...",
    dbStatus,
    dbError,
  });
}
