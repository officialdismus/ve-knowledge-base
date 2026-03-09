import { NextResponse } from "next/server";
import { getActiveCategories } from "@/lib/airtable/categories";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : undefined;

    const categories = await getActiveCategories();
    const payload = typeof limit === "number" && !Number.isNaN(limit)
      ? categories.slice(0, Math.max(0, limit))
      : categories;

    return NextResponse.json({ categories: payload });
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return NextResponse.json({ error: "Unable to load categories" }, { status: 500 });
  }
}
