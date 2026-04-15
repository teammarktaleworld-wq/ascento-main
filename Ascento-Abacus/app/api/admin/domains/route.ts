import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const domains = await prisma.domain.findMany({
      include: {
        classes: {
          include: {
            _count: {
              select: { sections: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      domains.map((d) => ({
        id: d.id,
        name: d.name,
        description: d.description,
        classCount: d.classes.length,
        sectionCount: d.classes.reduce((sum, c) => sum + c._count.sections, 0),
      }))
    );
  } catch (error) {
    console.error("Failed to fetch domains:", error);
    return NextResponse.json(
      { error: "Failed to fetch domains" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const domain = await prisma.domain.create({
      data: { name, description },
    });

    return NextResponse.json(domain, { status: 201 });
  } catch (error) {
    console.error("Failed to create domain:", error);
    return NextResponse.json(
      { error: "Failed to create domain" },
      { status: 500 }
    );
  }
}
