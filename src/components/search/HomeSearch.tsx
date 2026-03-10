'use client';

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="rounded-[2.5rem] p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-[--color-support-teal]">
          Search the knowledge base
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by keyword, tag, or issue"
            className="flex-1 rounded-[2rem] border border-transparent bg-[--color-primary-green-light]/60 px-5 py-4 text-base text-[--color-text-primary] shadow-lg shadow-[rgba(0,95,50,0.18)] placeholder:text-[--color-text-muted] focus:border-[--color-primary-green] focus:bg-white focus:outline-none"
          />
          <button
            type="button"
            aria-label="Search"
            onClick={handleSearch}
            className="inline-flex h-14 w-full items-center justify-center rounded-[2rem] bg-[#005f32] text-white shadow-lg shadow-[rgba(0,95,50,0.4)] transition hover:-translate-y-0.5 focus-visible:outline-offset-4 sm:h-14 sm:w-14"
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
            <span className="sr-only">Submit search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
