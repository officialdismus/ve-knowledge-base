"use client";

import { useEffect, useState } from "react";

export default function ArticleActions({
  slug,
  initialHelpful = 0,
  initialNotHelpful = 0,
}: {
  slug: string | undefined;
  initialHelpful?: number;
  initialNotHelpful?: number;
}) {
  const [helpfulCount, setHelpfulCount] = useState(initialHelpful);
  const [notHelpfulCount, setNotHelpfulCount] = useState(initialNotHelpful);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // increment view on mount
    if (!slug) return;

    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {
      // ignore errors
    });
  }, [slug]);

  async function vote(helpful: boolean) {
    if (!slug) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/analytics/helpful", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, helpful }),
      });

      if (res.ok) {
        if (helpful) setHelpfulCount((c) => c + 1);
        else setNotHelpfulCount((c) => c + 1);
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[#4D2C0A]/80">Was this article helpful?</span>
      <button
        onClick={() => vote(true)}
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded px-3 py-1 text-sm font-semibold bg-[#00A651] text-white hover:bg-[#008b44]"
      >
        Yes
        <span className="inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs">{helpfulCount}</span>
      </button>

      <button
        onClick={() => vote(false)}
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded px-3 py-1 text-sm font-semibold border border-[#F2E2C1] text-[#4D2C0A] hover:bg-[#F2E2C1]"
      >
        Not helpful
        <span className="inline-block rounded-full bg-[#F2E2C1] px-2 py-0.5 text-xs">{notHelpfulCount}</span>
      </button>
    </div>
  );
}
