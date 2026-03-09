import { NextResponse } from "next/server";
import { getActiveCategories } from "@/lib/airtable/categories";
import { airtableSelect } from "@/lib/airtable/client";
import type { ArticleRecord } from "@/lib/airtable/articles";

const ARTICLES_TABLE = process.env.AIRTABLE_TABLE_ARTICLES || "Articles";

export async function GET() {
  try {
    const [categories, articlesRes] = await Promise.all([
      getActiveCategories(),
      airtableSelect<ArticleRecord>(ARTICLES_TABLE, {
        maxRecords: 200,
        view: "Articles (Published)",
        fields: ["Primary Audience", "Content Type", "Category"],
      }),
    ]);

    const audienceSet = new Set<string>();
    const contentTypeSet = new Set<string>();

    articlesRes.records.forEach((record) => {
      const fields = record.fields;
      if (fields["Primary Audience"]) {
        audienceSet.add(fields["Primary Audience"] as string);
      }
      if (fields["Content Type"]) {
        contentTypeSet.add(fields["Content Type"] as string);
      }
    });

    const data = {
      categories: categories.map((cat) => ({ id: cat.id, name: cat.Name ?? "Untitled" })),
      audiences: Array.from(audienceSet).sort(),
      contentTypes: Array.from(contentTypeSet).sort(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch filter metadata", error);
    return NextResponse.json(
      { categories: [], audiences: [], contentTypes: [] },
      { status: 500 },
    );
  }
}
