import { NextResponse } from "next/server";
import { airtableSelect, airtableUpdate } from "@/lib/airtable/client";
import type { ArticleRecord } from "@/lib/airtable/articles";

export async function POST(request: Request) {
  const { recordId, slug } = (await request.json().catch(() => ({}))) as {
    recordId?: string;
    slug?: string;
  };

  const ARTICLES_TABLE = process.env.AIRTABLE_TABLE_ARTICLES || "Articles";

  let targetId = recordId;
  let currentFields: ArticleRecord | null = null;

  if (!targetId) {
    if (!slug) {
      return NextResponse.json({ error: "recordId or slug required" }, { status: 400 });
    }

    // find the record by slug to get its id and fields
    const formula = `LOWER({Slug}) = '${slug.toLowerCase().replace(/'/g, "\\'")}'`;
    const res = await airtableSelect<ArticleRecord>(ARTICLES_TABLE, { maxRecords: 1, filterByFormula: formula });
    const rec = res.records[0];
    if (!rec) return NextResponse.json({ error: "article not found" }, { status: 404 });
    targetId = rec.id;
    currentFields = rec.fields;
  }

  try {
    if (!currentFields) {
      const res = await airtableSelect<ArticleRecord>(ARTICLES_TABLE, { maxRecords: 1, filterByFormula: `RECORD_ID() = '${targetId}'` });
      const rec = res.records[0];
      if (!rec) return NextResponse.json({ error: "article not found" }, { status: 404 });
      currentFields = rec.fields;
    }

    const current = typeof currentFields["Total Views"] === "number" ? currentFields["Total Views"] : 0;
    const updated = await airtableUpdate<ArticleRecord>(ARTICLES_TABLE, targetId!, {
      "Total Views": current + 1,
      "Last Viewed": new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, updated: updated.fields });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
