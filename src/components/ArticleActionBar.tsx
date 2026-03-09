'use client';

import { useEffect } from "react";
import { useUIStore } from "@/state/uiStore";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { PrintButton } from "@/components/PrintButton";

interface ArticleActionBarProps {
  helpfulSectionId: string;
  feedbackSectionId: string;
}

export function ArticleActionBar({ helpfulSectionId, feedbackSectionId }: ArticleActionBarProps) {
  const setMobileActionBarVisible = useUIStore((state) => state.setMobileActionBarVisible);

  useEffect(() => {
    setMobileActionBarVisible(true);
    return () => setMobileActionBarVisible(false);
  }, [setMobileActionBarVisible]);

  return (
    <div className="sticky bottom-0 z-40 flex items-center justify-between gap-2 border-t border-gray-200 bg-white px-4 py-3 shadow-2xl md:hidden">
      <CopyLinkButton />
      <PrintButton />
      <button
        type="button"
        onClick={() => document.getElementById(helpfulSectionId)?.scrollIntoView({ behavior: "smooth" })}
        className="flex flex-col items-center text-xs font-semibold text-[--color-primary-green]"
      >
        👍
        <span>Helpful</span>
      </button>
      <button
        type="button"
        onClick={() => document.getElementById(helpfulSectionId)?.scrollIntoView({ behavior: "smooth" })}
        className="flex flex-col items-center text-xs font-semibold text-[--color-text-muted]"
      >
        👎
        <span>Not Helpful</span>
      </button>
      <button
        type="button"
        onClick={() => document.getElementById(feedbackSectionId)?.scrollIntoView({ behavior: "smooth" })}
        className="flex flex-col items-center text-xs font-semibold text-[--color-support-teal]"
      >
        💡
        <span>Suggest</span>
      </button>
      <button
        type="button"
        onClick={() => document.getElementById(feedbackSectionId)?.scrollIntoView({ behavior: "smooth" })}
        className="flex flex-col items-center text-xs font-semibold text-[--color-action-orange]"
      >
        ⚠️
        <span>Outdated</span>
      </button>
    </div>
  );
}
