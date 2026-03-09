import { NextResponse } from "next/server";
import { airtableUpdate } from "@/lib/airtable/client";
import type { CategoryRecord, CategoryWithMeta } from "@/lib/airtable/categories";

const CATEGORIES_TABLE = process.env.AIRTABLE_TABLE_CATEGORIES || "Categories";

function mapCategory(record: { id: string; fields: CategoryRecord }): CategoryWithMeta {
  return {
    id: record.id,
    ...record.fields,
    articleCount: record.fields.Articles?.length ?? 0,
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    description?: string;
    status?: CategoryRecord["Status"];
    order?: number;
  };

  const fields: CategoryRecord = {};

  if (typeof body.name === "string") {
    fields.Name = body.name.trim();
  }

  if (typeof body.description === "string") {
    fields.Description = body.description.trim();
  }

  if (body.status) {
    fields.Status = body.status;
  }

  if (typeof body.order === "number" && !Number.isNaN(body.order)) {
    fields["Display Order"] = body.order;
  }

  try {
    const updated = await airtableUpdate<CategoryRecord>(CATEGORIES_TABLE, id, fields);
    return NextResponse.json(mapCategory(updated));
  } catch (error) {
    console.error("Failed to update category", error);
    return NextResponse.json({ error: "Unable to update category" }, { status: 500 });
  }
}
