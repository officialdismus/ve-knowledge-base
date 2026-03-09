'use client';

import { useEffect } from "react";

interface ArticleAnalyticsTrackerProps {
  slug?: string;
  recordId?: string;
}

export function ArticleAnalyticsTracker({ slug, recordId }: ArticleAnalyticsTrackerProps) {
  useEffect(() => {
    if (!slug && !recordId) return;

    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, recordId }),
    }).catch((error) => {
      if (process.env.NODE_ENV !== "production") {
        console.error("view analytics failed", error);
      }
    });
  }, [slug, recordId]);

  return null;
}
