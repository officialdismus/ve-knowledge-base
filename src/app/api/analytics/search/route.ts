import { NextResponse } from "next/server";
import { airtableCreate } from "@/lib/airtable/client";

export async function POST(request: Request) {
  const { query, resultsCount, role, contentTypes, category } = (await request.json().catch(() => ({}))) as {
    query?: string;
    resultsCount?: number;
    role?: string;
    contentTypes?: string[];
    category?: string;
  };

  if (!query) return NextResponse.json({ error: "query required" }, { status: 400 });

  const SEARCHES_TABLE = process.env.AIRTABLE_TABLE_SEARCHES || "Searches";

  try {
    await airtableCreate(SEARCHES_TABLE, {
      Query: query,
      Results: typeof resultsCount === "number" ? resultsCount : null,
      "Is Zero Result": resultsCount === 0,
      Timestamp: new Date().toISOString(),
      Role: role || null,
      "Content Types": contentTypes && contentTypes.length ? contentTypes.join(", ") : null,
      Category: category || null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
