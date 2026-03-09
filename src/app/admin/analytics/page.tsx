import { airtableSelect } from "@/lib/airtable/client";
import { getPublishedArticlesForHome } from "@/lib/airtable/articles";

type SearchRecord = {
  Query?: string;
  Results?: number;
  "Is Zero Result"?: boolean;
  Timestamp?: string;
};

export default async function AdminAnalyticsPage() {
  const SEARCHES_TABLE = process.env.AIRTABLE_TABLE_SEARCHES || "Searches";

  const [articles, searchesRes] = await Promise.all([
    getPublishedArticlesForHome(100),
    airtableSelect<SearchRecord>(SEARCHES_TABLE, {
      maxRecords: 200,
      sort: [{ field: "Timestamp", direction: "desc" }],
    }).catch(() => ({ records: [] as { id: string; fields: SearchRecord; createdTime: string }[] })),
  ]);

  const searches = searchesRes.records;
  const zeroResults = searches.filter((s) => s.fields["Is Zero Result"]);

  const queryCounts: Record<string, number> = {};
  for (const s of searches) {
    const q = (s.fields.Query ?? "").toLowerCase().trim();
    if (q) queryCounts[q] = (queryCounts[q] ?? 0) + 1;
  }
  const topQueries = Object.entries(queryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const zeroQueryCounts: Record<string, number> = {};
  for (const s of zeroResults) {
    const q = (s.fields.Query ?? "").toLowerCase().trim();
    if (q) zeroQueryCounts[q] = (zeroQueryCounts[q] ?? 0) + 1;
  }
  const topZeroQueries = Object.entries(zeroQueryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const sortedByViews = [...articles]
    .filter((a) => typeof a["Total Views"] === "number")
    .sort((a, b) => (b["Total Views"] ?? 0) - (a["Total Views"] ?? 0))
    .slice(0, 10);

  const sortedByHelpful = [...articles]
    .filter((a) => typeof a["Helpful Count"] === "number" || typeof a["Not Helpful Count"] === "number")
    .map((a) => {
      const h = a["Helpful Count"] ?? 0;
      const n = a["Not Helpful Count"] ?? 0;
      const total = h + n;
      const ratio = total > 0 ? Math.round((h / total) * 100) : null;
      return { ...a, ratio, total };
    })
    .filter((a) => a.total >= 1)
    .sort((a, b) => (b.ratio ?? 0) - (a.ratio ?? 0))
    .slice(0, 10);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-xl font-semibold text-[#4D2C0A]">Analytics</h1>
        <p className="mt-1 text-sm text-[#4D2C0A]/80">
          Search demand, content performance, and helpfulness signals.
        </p>
      </header>

      {/* Search stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-[#F2E2C1]/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#00A5A5]">Total Searches</p>
          <p className="mt-2 text-2xl font-semibold text-[#4D2C0A]">{searches.length}</p>
        </div>
        <div className="rounded-lg bg-[#F2E2C1]/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#00A5A5]">Zero-Result Searches</p>
          <p className="mt-2 text-2xl font-semibold text-[#4D2C0A]">{zeroResults.length}</p>
          <p className="mt-1 text-xs text-[#4D2C0A]/70">
            {searches.length > 0 ? Math.round((zeroResults.length / searches.length) * 100) : 0}% miss rate
          </p>
        </div>
        <div className="rounded-lg bg-[#F2E2C1]/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#00A5A5]">Unique Queries</p>
          <p className="mt-2 text-2xl font-semibold text-[#4D2C0A]">{Object.keys(queryCounts).length}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top queries */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[#4D2C0A]">Top search queries</h2>
          {topQueries.length === 0 ? (
            <p className="text-xs text-[#4D2C0A]/60">No search data yet. Searches are logged to the &ldquo;Searches&rdquo; table in Airtable.</p>
          ) : (
            <ul className="divide-y divide-[#F2E2C1] rounded-lg border border-[#F2E2C1]">
              {topQueries.map(([query, count]) => (
                <li key={query} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="text-[#4D2C0A] font-medium">{query}</span>
                  <span className="rounded-full bg-[#E6F2E6] px-2 py-0.5 text-[10px] font-semibold text-[#4D2C0A]/70">
                    {count}×
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Zero-result queries (content demand) */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[#4D2C0A]">
            Zero-result queries
            <span className="ml-2 text-xs font-normal text-[#4D2C0A]/50">(content demand)</span>
          </h2>
          {topZeroQueries.length === 0 ? (
            <p className="text-xs text-[#4D2C0A]/60">No zero-result searches recorded yet.</p>
          ) : (
            <ul className="divide-y divide-[#F2E2C1] rounded-lg border border-[#F2E2C1]">
              {topZeroQueries.map(([query, count]) => (
                <li key={query} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="text-[#4D2C0A] font-medium">{query}</span>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                    {count}× no results
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Top viewed articles */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[#4D2C0A]">Most viewed articles</h2>
        {sortedByViews.length === 0 ? (
          <p className="text-xs text-[#4D2C0A]/60">No view data yet.</p>
        ) : (
          <ul className="divide-y divide-[#F2E2C1] rounded-lg border border-[#F2E2C1]">
            {sortedByViews.map((a) => (
              <li key={a.Slug} className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="text-[#4D2C0A]">{a.Title}</span>
                <span className="text-xs text-[#4D2C0A]/60">{a["Total Views"]} views</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Helpful ratio */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[#4D2C0A]">Article helpfulness ratio</h2>
        {sortedByHelpful.length === 0 ? (
          <p className="text-xs text-[#4D2C0A]/60">No helpful/not-helpful votes yet.</p>
        ) : (
          <ul className="divide-y divide-[#F2E2C1] rounded-lg border border-[#F2E2C1]">
            {sortedByHelpful.map((a) => (
              <li key={a.Slug} className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="text-[#4D2C0A]">{a.Title}</span>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#F2E2C1]">
                    <div
                      className="h-full rounded-full bg-[#00A651]"
                      style={{ width: `${a.ratio ?? 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-[#4D2C0A]/70 w-10 text-right">
                    {a.ratio ?? 0}%
                  </span>
                  <span className="text-[10px] text-[#4D2C0A]/50">
                    ({a["Helpful Count"] ?? 0}/{a.total})
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
