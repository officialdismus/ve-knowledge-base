import { NextResponse } from "next/server";
import { airtableUpdate } from "@/lib/airtable/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { status?: string };

  if (!body.status) {
    return NextResponse.json({ error: "status required" }, { status: 400 });
  }

  const allowed = ["Pending", "In Review", "Resolved", "Rejected"];
  if (!allowed.includes(body.status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  const FEEDBACK_TABLE = process.env.AIRTABLE_TABLE_FEEDBACK || "Feedback";

  try {
    await airtableUpdate(FEEDBACK_TABLE, id, { Status: body.status });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
