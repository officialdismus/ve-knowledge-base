import { NextResponse } from "next/server";
import { airtableCreate } from "@/lib/airtable/client";

export async function POST(request: Request) {
  const { source, type, query, categoryGuess, roleFilter } = (await request.json().catch(() => ({}))) as {
    source?: string;
    type?: string;
    query?: string;
    categoryGuess?: string;
    roleFilter?: string;
  };

  const FEEDBACK_FUNNEL_TABLE = process.env.AIRTABLE_TABLE_FEEDBACK_FUNNEL || "Feedback Funnel";

  try {
    await airtableCreate(FEEDBACK_FUNNEL_TABLE, {
      Source: source || null,
      Type: type || null,
      Query: query || null,
      "Category Guess": categoryGuess || null,
      "Role Filter": roleFilter || null,
      Timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
