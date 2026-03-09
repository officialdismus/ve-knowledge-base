import { getPublishedArticlesForHome } from "@/lib/airtable/articles";
import { airtableSelect } from "@/lib/airtable/client";
import type { FeedbackRecord } from "@/lib/airtable/feedback";

export default async function AdminDashboardPage() {
  const [articles, feedback] = await Promise.all([
    getPublishedArticlesForHome(50),
    airtableSelect<FeedbackRecord>(
      process.env.AIRTABLE_TABLE_FEEDBACK || "Feedback",
      { maxRecords: 50 },
    ),
  ]);

  const totalArticles = articles.length;
  const publishedCount = articles.filter((a) => a.Status === "Published").length;
  const draftCount = articles.filter((a) => a.Status === "Draft").length;

  const feedbackRecords = feedback.records;
  const pendingFeedback = feedbackRecords.filter((f) => f.fields.Status === "Pending").length;
  const highUrgency = feedbackRecords.filter((f) => f.fields.Urgency === "High").length;

  const mostViewed = [...articles]
    .filter((a) => typeof a["Total Views"] === "number")
    .sort((a, b) => (b["Total Views"] ?? 0) - (a["Total Views"] ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-xl font-semibold text-[#4D2C0A]">Content health</h1>
        <p className="mt-2 text-sm text-[#4D2C0A]/80">
          High-level view of knowledge base coverage, feedback, and demand signals.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-[#F2E2C1]/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#00A5A5]">
            Articles
          </p>
          <p className="mt-2 text-2xl font-semibold text-[#4D2C0A]">{totalArticles}</p>
          <p className="mt-1 text-xs text-[#4D2C0A]/80">
            {publishedCount} published • {draftCount} draft
          </p>
        </div>

        <div className="rounded-lg bg-[#F2E2C1]/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#00A5A5]">
            Feedback queue
          </p>
          <p className="mt-2 text-2xl font-semibold text-[#4D2C0A]">{pendingFeedback}</p>
          <p className="mt-1 text-xs text-[#4D2C0A]/80">
            {highUrgency} marked high urgency
          </p>
        </div>

        <div className="rounded-lg bg-[#F2E2C1]/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#00A5A5]">
            Usage signals
          </p>
          <p className="mt-2 text-sm text-[#4D2C0A]">
            Tracking views and helpful votes per article via Airtable fields.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-[#4D2C0A]">Most viewed articles</h2>
        {mostViewed.length === 0 ? (
          <p className="mt-2 text-xs text-[#4D2C0A]/80">
            No view data yet. As staff use the knowledge base, you&apos;ll see top articles here.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-[#F2E2C1] text-sm">
            {mostViewed.map((a) => (
              <li key={a.Slug} className="flex items-center justify-between py-2">
                <span className="text-[#4D2C0A]">{a.Title}</span>
                <span className="text-xs text-[#4D2C0A]/70">
                  {a["Total Views"] ?? 0} views
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

