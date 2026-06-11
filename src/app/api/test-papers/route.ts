import { NextResponse } from "next/server";
import { questionBank, testPapers } from "./data";

// GET /api/test-papers
export async function GET(req: Request) {
  try {
    // Return all test papers with metadata (but not questions yet)
    return NextResponse.json({
      success: true,
      data: testPapers,
    });
  } catch (error) {
    console.error("[GET /api/test-papers]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
