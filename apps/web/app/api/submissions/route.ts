import { NextResponse } from "next/server";
import { submissionService } from "@dud/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      submitterName,
      submitterEmail,
      submitterRole,
      businessName,
      title,
      description,
      address,
      city,
      website,
      phone,
      categories,
      ageBands,
      costTier,
      isFree,
      duration,
      parking,
      restrooms,
      strollerFriendly,
      wheelchairAccessible,
    } = body;

    if (!submitterName || !submitterEmail || !title) {
      return NextResponse.json(
        { error: "Name, email, and activity title are required" },
        { status: 400 }
      );
    }

    const submission = await submissionService.createSubmission({
      submitterName,
      submitterEmail,
      submitterRole,
      businessName,
      title,
      description,
      address,
      city,
      website,
      phone,
      categories,
      ageBands,
      costTier,
      isFree: isFree ?? false,
      duration,
      parking,
      restrooms,
      strollerFriendly,
      wheelchairAccessible,
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
