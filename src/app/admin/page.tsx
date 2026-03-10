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
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-3 text-xs text-[--color-text-muted]">
        <div className="inline-flex items-center gap-2 rounded-full bg-[--color-primary-green-light]/70 px-3 py-1 font-semibold text-[--color-primary-green]">
          <span className="h-2 w-2 rounded-full bg-[--color-primary-green]" /> Live data
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 font-semibold">
          {totalArticles} records synced
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[24px] border border-white/60 bg-gradient-to-br from-[#fdf3d8] via-white to-[#e9f4ea] p-6 shadow-[0_20px_50px_rgba(20,63,34,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-support-teal]">Articles</p>
          <p className="mt-3 text-4xl font-semibold text-[--color-text-primary]">{totalArticles}</p>
          <p className="mt-2 text-sm text-[--color-text-muted]">
            {publishedCount} published • {draftCount} draft
          </p>
        </div>
        <div className="rounded-[24px] border border-white/60 bg-gradient-to-br from-[#e8f6f6] via-white to-[#fdf5ea] p-6 shadow-[0_20px_50px_rgba(20,63,34,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-support-teal]">Feedback queue</p>
          <p className="mt-3 text-4xl font-semibold text-[--color-text-primary]">{pendingFeedback}</p>
          <p className="mt-2 text-sm text-[--color-text-muted]">
            {highUrgency} marked high urgency
          </p>
        </div>
        <div className="rounded-[24px] border border-white/60 bg-gradient-to-br from-[#f4fbf5] via-white to-[#e9f4ea] p-6 shadow-[0_20px_50px_rgba(20,63,34,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-support-teal]">Usage signals</p>
          <p className="mt-3 text-sm text-[--color-text-muted]">
            Tracking views and helpful votes per article via Airtable fields.
          </p>
          <div className="mt-4 text-xs text-[--color-primary-green]">Last sync • {new Date().toLocaleDateString()}</div>
        </div>
      </section>

      <section className="rounded-[24px] border border-white/60 bg-white/95 p-6 shadow-[0_20px_60px_rgba(20,63,34,0.08)]">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[--color-text-primary]">Most viewed articles</h2>
            <p className="text-sm text-[--color-text-muted]">Pulse over the last 30 days</p>
          </div>
        </div>
        {mostViewed.length === 0 ? (
          <p className="mt-6 text-sm text-[--color-text-muted]">
            No view data yet. As staff use the knowledge base, you&apos;ll see top articles here.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {mostViewed.map((a) => (
              <li
                key={a.Slug}
                className="flex flex-col gap-2 rounded-2xl border border-[--color-border] bg-white/80 p-4 text-sm text-[--color-text-primary] shadow-[0_12px_30px_rgba(20,63,34,0.05)] md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold">{a.Title}</p>
                  <p className="text-xs text-[--color-text-muted]">
                    {a["Primary Audience"] || "All Staff"}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-[--color-support-teal]">
                  <span className="rounded-full bg-[--color-soft-beige] px-3 py-1 font-semibold text-[--color-text-primary]">
                    {a["Total Views"] ?? 0} views
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

