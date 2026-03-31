import { NextResponse } from "next/server";
import { verificationService } from "@dud/db";

export async function POST(req: Request) {
  try {
    const { activityId, stillAccurate, notes, confirmedBy } = await req.json();

    if (!activityId || stillAccurate === undefined) {
      return NextResponse.json(
        { error: "activityId and stillAccurate are required" },
        { status: 400 }
      );
    }

    const confirmation = await verificationService.confirmStillAccurate({
      activityId,
      stillAccurate,
      notes,
      confirmedBy,
    });

    return NextResponse.json({ confirmation }, { status: 201 });
  } catch (error) {
    console.error("Error recording confirmation:", error);
    return NextResponse.json(
      { error: "Failed to record confirmation" },
      { status: 500 }
    );
  }
}
