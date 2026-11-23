import { NextResponse } from "next/server";
import { subscriberService } from "@dud/db";

export async function POST(req: Request) {
  try {
    const { email, name, regions, ageBands } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const result = await subscriberService.subscribe({
      email,
      name,
      regions,
      ageBands,
    });

    if (result.alreadySubscribed) {
      return NextResponse.json({
        message: "You're already on the newsletter list.",
        status: "existing",
      });
    }

    if (result.reactivated) {
      return NextResponse.json({
        message: "Welcome back! You're resubscribed.",
        status: "reactivated",
      });
    }

    return NextResponse.json(
      {
        message: "You're on the newsletter list!",
        status: "new",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
