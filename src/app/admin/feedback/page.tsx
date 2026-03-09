import Link from "next/link";
import { airtableSelect } from "@/lib/airtable/client";
import type { FeedbackRecord } from "@/lib/airtable/feedback";
import { FeedbackStatusSelect } from "@/components/FeedbackStatusSelect";

type FeedbackRecordWithSlug = FeedbackRecord & { "Article Slug"?: string };

const URGENCY_COLORS: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-[#F5A623]/20 text-[#b87c00]",
  Low: "bg-[#E6F2E6] text-[#4D2C0A]/70",
};

export default async function AdminFeedbackPage() {
  const tableName = process.env.AIRTABLE_TABLE_FEEDBACK || "Feedback";

  const response = await airtableSelect<FeedbackRecordWithSlug>(tableName, {
    maxRecords: 200,
    sort: [{ field: "Created At", direction: "desc" }],
  });

  const records = response.records;
  const pending = records.filter((r) => r.fields.Status === "Pending" || !r.fields.Status).length;
  const highUrgency = records.filter((r) => r.fields.Urgency === "High").length;

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#4D2C0A]">Feedback queue</h1>
          <p className="mt-1 text-sm text-[#4D2C0A]/80">
            Review suggestions, quality gaps, and content requests.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="rounded-full bg-[#F5A623]/20 px-3 py-1 font-medium text-[#b87c00]">
            {pending} pending
          </span>
          <span className="rounded-full bg-red-100 px-3 py-1 font-medium text-red-700">
            {highUrgency} high urgency
          </span>
        </div>
      </header>

      {records.length === 0 ? (
        <p className="rounded-lg bg-[#F2E2C1]/60 px-4 py-4 text-sm text-[#4D2C0A]">
          No feedback submissions yet.
        </p>
      ) : (
        <div className="overflow-auto rounded-lg border border-[#F2E2C1]">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#F2E2C1] bg-[#F2E2C1]/30 text-xs uppercase tracking-wide text-[#4D2C0A]/70">
                <th className="py-2 px-3">Topic &amp; Description</th>
                <th className="py-2 px-3">Urgency</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Contact</th>
                <th className="py-2 px-3">Related Article</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const f = record.fields;
                return (
                  <tr key={record.id} className="border-b border-[#F2E2C1]/60 align-top hover:bg-[#F2E2C1]/20">
                    <td className="py-3 px-3 text-[#4D2C0A] max-w-xs">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">{f.Topic ?? "—"}</span>
                        {f.Description && (
                          <p className="text-xs text-[#4D2C0A]/70 line-clamp-3">{f.Description}</p>
                        )}
                        {f["Suggested Change"] && (
                          <p className="mt-1 text-[11px] text-[#4D2C0A]/60 italic">
                            <span className="not-italic font-semibold">Suggested:</span>{" "}
                            {f["Suggested Change"]}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {f.Urgency ? (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${URGENCY_COLORS[f.Urgency] ?? ""}`}
                        >
                          {f.Urgency}
                        </span>
                      ) : (
                        <span className="text-xs text-[#4D2C0A]/50">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <FeedbackStatusSelect
                        recordId={record.id}
                        initialStatus={(f.Status as "Pending" | "In Review" | "Resolved" | "Rejected") ?? "Pending"}
                      />
                    </td>
                    <td className="py-3 px-3 text-xs text-[#4D2C0A]/80">
                      {f["Contact Info"] ? (
                        <span className="font-medium">{f["Contact Info"]}</span>
                      ) : (
                        <span className="text-[#4D2C0A]/40">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-xs">
                      {f["Article Slug"] ? (
                        <Link
                          href={`/articles/${f["Article Slug"]}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 rounded-full bg-[#00A651]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00A651] hover:bg-[#00A651]/20"
                        >
                          View article ↗
                        </Link>
                      ) : f["Related Article"] && f["Related Article"].length > 0 ? (
                        <span className="rounded-full bg-[#E6F2E6] px-2 py-0.5 text-[10px] text-[#4D2C0A]/70">
                          Linked (no slug)
                        </span>
                      ) : (
                        <span className="text-[#4D2C0A]/40">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

