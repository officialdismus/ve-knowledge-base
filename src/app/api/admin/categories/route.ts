import { NextResponse } from "next/server";
import { airtableCreate } from "@/lib/airtable/client";
import type { CategoryRecord, CategoryWithMeta } from "@/lib/airtable/categories";

const CATEGORIES_TABLE = process.env.AIRTABLE_TABLE_CATEGORIES || "Categories";

function mapCategory(record: { id: string; fields: CategoryRecord }): CategoryWithMeta {
  return {
    id: record.id,
    ...record.fields,
    articleCount: record.fields.Articles?.length ?? 0,
  };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    description?: string;
    status?: CategoryRecord["Status"];
    order?: number;
  };

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const fields: CategoryRecord = {
    Name: name,
    Description: body.description?.trim() || undefined,
    Status: body.status ?? "Active",
    "Display Order": typeof body.order === "number" && !Number.isNaN(body.order) ? body.order : undefined,
  };

  try {
    const created = await airtableCreate<CategoryRecord>(CATEGORIES_TABLE, fields);
    return NextResponse.json(mapCategory(created));
  } catch (error) {
    console.error("Failed to create category", error);
    return NextResponse.json({ error: "Unable to create category" }, { status: 500 });
  }
}
