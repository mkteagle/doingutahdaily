import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

  if (!UNSPLASH_ACCESS_KEY) {
    return NextResponse.json(
      { error: "Unsplash access key is not defined" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("searchTerm");

  if (!searchTerm) {
    return NextResponse.json(
      { error: "Search term is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
        searchTerm
      )}&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Unsplash image");
    }

    const data = await response.json();
    const imageUrl = data.urls.regular; // Use 'regular' or adjust for the desired size

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
