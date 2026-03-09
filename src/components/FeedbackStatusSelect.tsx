"use client";

import { useState } from "react";

type Status = "Pending" | "In Review" | "Resolved" | "Rejected";

const STATUS_COLORS: Record<Status, string> = {
  Pending: "bg-[#F5A623]/20 text-[#b87c00]",
  "In Review": "bg-[#00A5A5]/20 text-[#007a7a]",
  Resolved: "bg-[#00A651]/20 text-[#007a3d]",
  Rejected: "bg-red-100 text-red-700",
};

export function FeedbackStatusSelect({
  recordId,
  initialStatus,
}: {
  recordId: string;
  initialStatus: Status;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: Status) {
    setSaving(true);
    setStatus(newStatus);
    await fetch(`/api/admin/feedback/${recordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});
    setSaving(false);
  }

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_COLORS[status] ?? "bg-[#F2E2C1] text-[#4D2C0A]"}`}
      >
        {status}
      </span>
      <select
        value={status}
        disabled={saving}
        onChange={(e) => handleChange(e.target.value as Status)}
        className="rounded border border-[#F2E2C1] bg-white px-1.5 py-0.5 text-[11px] text-[#4D2C0A] focus:outline-none focus:ring-1 focus:ring-[#00A651] disabled:opacity-60"
        aria-label="Update feedback status"
      >
        <option value="Pending">Pending</option>
        <option value="In Review">In Review</option>
        <option value="Resolved">Resolved</option>
        <option value="Rejected">Rejected</option>
      </select>
      {saving && <span className="text-[10px] text-[#4D2C0A]/50">Saving…</span>}
    </div>
  );
}
