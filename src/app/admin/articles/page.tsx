import Link from "next/link";
import { airtableSelect } from "@/lib/airtable/client";
import type { ArticleRecord } from "@/lib/airtable/articles";

export default async function AdminArticlesPage() {
  const tableName = process.env.AIRTABLE_TABLE_ARTICLES || "Articles";

  const response = await airtableSelect<ArticleRecord>(tableName, {
    maxRecords: 200,
    sort: [{ field: "Last Updated", direction: "desc" }],
  });

  const records = response.records;

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#4D2C0A]">Articles</h1>
          <p className="mt-1 text-sm text-[#4D2C0A]/80">
            Workflow: Draft → In Review → Published → Archived.
          </p>
        </div>
      </header>

      <div className="overflow-auto rounded-lg border border-[#F2E2C1]">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#F2E2C1] text-xs uppercase tracking-wide text-[#4D2C0A]/70">
              <th className="py-2 px-3">Title</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Audience</th>
              <th className="py-2 px-3">Views</th>
              <th className="py-2 px-3">Last Updated</th>
              <th className="py-2 px-3">Open</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
              const a = record.fields;
              return (
                <tr key={record.id} className="border-b border-[#F2E2C1]/60">
                  <td className="py-2 px-3 text-[#4D2C0A]">
                    <div className="flex flex-col">
                      <span className="font-medium">{a.Title ?? "Untitled"}</span>
                      {a.Slug && (
                        <span className="text-[11px] text-[#4D2C0A]/60">
                          /articles/{a.Slug}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-xs text-[#4D2C0A]/80">{a.Status ?? "—"}</td>
                  <td className="py-2 px-3 text-xs text-[#4D2C0A]/80">
                    {a["Primary Audience"] ?? "All Staff"}
                  </td>
                  <td className="py-2 px-3 text-xs text-[#4D2C0A]/80">
                    {a["Total Views"] ?? 0}
                  </td>
                  <td className="py-2 px-3 text-xs text-[#4D2C0A]/80">
                    {a["Last Updated"] ?? "Not set"}
                  </td>
                  <td className="py-2 px-3 text-xs">
                    {a.Slug ? (
                      <Link
                        href={`/articles/${a.Slug}`}
                        className="rounded-full bg-[#00A651] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white hover:bg-[#008b44]"
                      >
                        View
                      </Link>
                    ) : (
                      <span className="text-[#4D2C0A]/50">No slug</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

