import { NextResponse } from "next/server";
import { postService } from "@dud/db";
import { CATEGORIES } from "@/constants/categories";

export async function GET() {
  try {
    const categoryStats = await postService.getCategoryStats(CATEGORIES);
    return NextResponse.json({ categoryStats });
  } catch (error) {
    console.error("Error loading category stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch category stats" },
      { status: 500 }
    );
  }
}
