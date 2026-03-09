import { NextResponse } from "next/server";
import { getPublishedArticlesForHome } from "@/lib/airtable/articles";

const SYNONYMS: Record<string, string[]> = {
  disbursement: ["payout", "payment"],
  payout: ["disbursement", "payment"],
  ticket: ["issue", "problem"],
};

function normalize(text: string): string {
  return text.toLowerCase();
}

function scoreMatch(query: string, text?: string | null): number {
  if (!text) return 0;
  const q = normalize(query);
  const t = normalize(text);
  if (!q || !t) return 0;

  if (t.includes(q)) {
    return 1;
  }

  // Very lightweight fuzzy: allow one missing or extra character
  if (Math.abs(t.length - q.length) <= 1 && t.startsWith(q.slice(0, Math.max(2, q.length - 1)))) {
    return 0.5;
  }

  return 0;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ query, results: [] });
  }

  const baseArticles = await getPublishedArticlesForHome(50);

  const expandedQueries = [query.toLowerCase()];
  const synonymMatches = SYNONYMS[query.toLowerCase()];
  if (synonymMatches) {
    expandedQueries.push(...synonymMatches.map((s) => s.toLowerCase()));
  }

  const scored = baseArticles
    .map((article) => {
      let score = 0;

      for (const q of expandedQueries) {
        score += scoreMatch(q, article.Title) * 3;
        score += scoreMatch(q, article.Overview) * 2;
        score += scoreMatch(q, article["When to Use"]) * 1.5;
        score += scoreMatch(q, article.Steps) * 1.5;
        score += scoreMatch(q, article.Troubleshooting) * 1.5;

        if (article.Tags) {
          for (const tag of article.Tags) {
            score += scoreMatch(q, tag) * 2.5;
          }
        }
      }

      return { article, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || (b.article["Total Views"] ?? 0) - (a.article["Total Views"] ?? 0))
    .slice(0, 10);

  const results = scored.map((item) => ({
    slug: item.article.Slug,
    title: item.article.Title,
    overview: item.article.Overview,
    primaryAudience: item.article["Primary Audience"],
    contentType: item.article["Content Type"] ?? null,
    category: Array.isArray(item.article.Category)
      ? item.article.Category[0] ?? null
      : item.article.Category ?? null,
    tags: item.article.Tags ?? [],
    totalViews: item.article["Total Views"],
  }));

  return NextResponse.json({ query, results });
}

