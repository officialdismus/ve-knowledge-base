import { NextResponse } from "next/server";
import { airtableSelect, airtableUpdate } from "@/lib/airtable/client";
import type { ArticleRecord } from "@/lib/airtable/articles";

export async function POST(request: Request) {
  const { recordId, slug, helpful } = (await request.json().catch(() => ({}))) as {
    recordId?: string;
    slug?: string;
    helpful?: boolean;
  };

  if (typeof helpful !== "boolean") {
    return NextResponse.json({ error: "missing 'helpful' boolean" }, { status: 400 });
  }

  const ARTICLES_TABLE = process.env.AIRTABLE_TABLE_ARTICLES || "Articles";

  let targetId = recordId;
  let currentFields: ArticleRecord | null = null;

  if (!targetId) {
    if (!slug) {
      return NextResponse.json({ error: "recordId or slug required" }, { status: 400 });
    }

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

    const helpfulCount = typeof currentFields["Helpful Count"] === "number" ? currentFields["Helpful Count"] : 0;
    const notHelpfulCount = typeof currentFields["Not Helpful Count"] === "number" ? currentFields["Not Helpful Count"] : 0;

    const fieldsToUpdate: Record<string, number> = {};
    if (helpful) fieldsToUpdate["Helpful Count"] = helpfulCount + 1;
    else fieldsToUpdate["Not Helpful Count"] = notHelpfulCount + 1;

    const updated = await airtableUpdate<ArticleRecord>(ARTICLES_TABLE, targetId!, fieldsToUpdate);

    return NextResponse.json({ ok: true, updated: updated.fields });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
