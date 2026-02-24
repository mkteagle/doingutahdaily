import { NextResponse } from "next/server";
import { prisma } from "@dud/db";
import { CATEGORIES } from "@/constants/categories";

export async function GET() {
  try {
    const categoryStats = [];

    for (const category of CATEGORIES) {
      const count = await prisma.post.count({
        where: {
          published: true,
          categories: {
            some: {
              name: category,
            },
          },
        },
      });
      categoryStats.push({
        name: category,
        count,
      });
    }

    return NextResponse.json({ categoryStats });
  } catch (error) {
    console.error("Error loading category stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch category stats" },
      { status: 500 }
    );
  }
}
