'use client';

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 rounded-[2rem] border border-[--color-soft-beige] bg-white/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur">
        <label className="text-sm font-semibold uppercase tracking-wide text-[--color-support-teal]">
          Search the knowledge base
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by keyword, tag, or issue"
            className="flex-1 rounded-full border border-transparent bg-[--color-primary-green-light]/50 px-5 py-3 text-base text-[--color-text-primary] shadow-inner placeholder:text-[--color-text-muted] focus:border-[--color-primary-green] focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="inline-flex items-center justify-center rounded-full bg-[--color-primary-green] p-3 text-white shadow-lg shadow-[--color-primary-green]/40 transition hover:-translate-y-0.5 hover:bg-[--color-primary-green-dark]"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.65" y1="16.65" x2="21" y2="21" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
