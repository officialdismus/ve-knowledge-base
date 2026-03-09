export type ArticleRecord = {
  Title?: string;
  Slug?: string;
  Category?: string[];
  Subcategory?: string[];
  "Content Type"?: string;
  "Primary Audience"?: string;
  Tags?: string[];
  Status?: "Draft" | "In Review" | "Published" | "Archived";
  Author?: string;
  Version?: string;
  "Last Updated"?: string;
  "Last Reviewed"?: string;
  "Next Review Due"?: string;
  Overview?: string;
  "When to Use"?: string;
  Steps?: string;
  Troubleshooting?: string;
  "Related Articles"?: string[];
  "External Resources"?: string;
  "Total Views"?: number;
  "Last Viewed"?: string;
  "Helpful Count"?: number;
  "Not Helpful Count"?: number;
};

const ARTICLES_TABLE_NAME =
  process.env.AIRTABLE_TABLE_ARTICLES && process.env.AIRTABLE_TABLE_ARTICLES.length > 0
    ? process.env.AIRTABLE_TABLE_ARTICLES
    : "Articles";

import { airtableFindByField, airtableSelect } from "./client";

export async function getPublishedArticlesForHome(limit = 12): Promise<ArticleRecord[]> {
  const response = await airtableSelect<ArticleRecord>(ARTICLES_TABLE_NAME, {
    maxRecords: limit,
    view: "Articles (Published)",
    sort: [
      { field: "Last Viewed", direction: "desc" },
      { field: "Last Updated", direction: "desc" },
    ],
    fields: [
      "Title",
      "Slug",
      "Overview",
      "Primary Audience",
      "Content Type",
      "Category",
      "Tags",
      "Total Views",
      "Last Viewed",
    ],
  });

  return response.records.map((record) => record.fields);
}

export async function getArticleBySlug(slug: string): Promise<ArticleRecord | null> {
  if (!slug) return null;

  return airtableFindByField<ArticleRecord>(ARTICLES_TABLE_NAME, "Slug", slug, {
    view: "Articles (Published)",
  });
}

export function estimateReadingTime(article: ArticleRecord): number {
  const text = [
    article.Overview,
    article["When to Use"],
    article.Steps,
    article.Troubleshooting,
  ]
    .filter(Boolean)
    .join(" ");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

