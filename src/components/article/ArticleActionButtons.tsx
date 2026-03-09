'use client';

import { CopyLinkButton } from "@/components/CopyLinkButton";
import { PrintButton } from "@/components/PrintButton";

interface ArticleActionButtonsProps {
  helpfulSectionId: string;
  feedbackSectionId: string;
}

export function ArticleActionButtons({ helpfulSectionId, feedbackSectionId }: ArticleActionButtonsProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <CopyLinkButton />
      <PrintButton />
      <button
        type="button"
        onClick={() => scrollTo(helpfulSectionId)}
        className="rounded-full border border-[--color-primary-green] px-3 py-1.5 text-xs font-semibold text-[--color-primary-green] hover:bg-[--color-primary-green-light]"
      >
        Was this helpful?
      </button>
      <button
        type="button"
        onClick={() => scrollTo(feedbackSectionId)}
        className="rounded-full border border-[--color-action-orange] px-3 py-1.5 text-xs font-semibold text-[--color-action-orange] hover:bg-[--color-warning-bg]"
      >
        Report outdated
      </button>
    </div>
  );
}
