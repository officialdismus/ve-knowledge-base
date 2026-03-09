"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type SearchResult = {
  slug?: string;
  title?: string;
  overview?: string;
  primaryAudience?: string;
  tags: string[];
};

type Props = {
  className?: string;
  variant?: 'default' | 'header' | 'mobile';
};

export function SearchBar({ className, variant = 'default' }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [requestContact, setRequestContact] = useState("");
  const [requestStatus, setRequestStatus] = useState<"idle" | "submitting" | "done">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getSearchStyles = () => {
    switch (variant) {
      case 'header':
        return 'w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent';
      case 'mobile':
        return 'w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent';
      default:
        return 'w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent';
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      setActiveIndex(null);
      return;
    }

    setIsLoading(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = (await res.json()) as { results: SearchResult[] };
        setResults(data.results);
        setShowResults(true);
        setActiveIndex(data.results.length ? 0 : null);

        fetch("/api/analytics/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, resultsCount: data.results.length }),
        }).catch(() => {});
      } catch {
        setResults([]);
        setShowResults(false);
        setActiveIndex(null);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showResults || !results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => {
        if (prev == null) return 0;
        return prev === results.length - 1 ? 0 : prev + 1;
      });
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => {
        if (prev == null) return results.length - 1;
        return prev === 0 ? results.length - 1 : prev - 1;
      });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  const handleArticleClick = (article: SearchResult) => {
    router.push(`/articles/${article.slug}`);
    setShowResults(false);
    setQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className={`relative ${className ?? ''}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={variant === 'header' ? 'Search knowledge base...' : 'How can we help you today?'}
          className={getSearchStyles()}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00A651] transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {query.trim() && !results.length && !isLoading ? (
            <div className="space-y-3 px-4 py-4 text-xs text-[#4D2C0A]/80">
              <p className="font-semibold text-[#4D2C0A]">No results for &ldquo;{query}&rdquo;</p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li>Check spelling or try a broader term</li>
                <li>Try synonyms (e.g. &ldquo;payment&rdquo; instead of &ldquo;disbursement&rdquo;)</li>
              </ul>
              {requestStatus === "done" ? (
                <p className="rounded bg-[#E6F2E6] px-3 py-2 font-medium text-[#00A651]">
                  Request submitted. We&apos;ll add this topic soon.
                </p>
              ) : (
                <div className="space-y-2 border-t border-[#F2E2C1] pt-3">
                  <p className="font-semibold text-[#4D2C0A]">Request this topic</p>
                  <p className="text-[#4D2C0A]/70">
                    Can&apos;t find what you need? Submit a content request:
                  </p>
                  <input
                    type="text"
                    value={requestContact}
                    onChange={(e) => setRequestContact(e.target.value)}
                    placeholder="Your email or Slack handle (optional)"
                    className="w-full rounded border border-[#F2E2C1] bg-white px-2 py-1.5 text-xs text-[#4D2C0A] placeholder:text-[#4D2C0A]/40 focus:outline-none focus:ring-1 focus:ring-[#00A651]"
                  />
                  <button
                    disabled={requestStatus === "submitting"}
                    onClick={async () => {
                      setRequestStatus("submitting");
                      await fetch("/api/feedback", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          topic: `Content request: ${query}`,
                          description: `A user searched for "${query}" and found no results. They are requesting this topic be added to the knowledge base.`,
                          urgency: "Medium",
                          contactInfo: requestContact || undefined,
                        }),
                      }).catch(() => {});
                      setRequestStatus("done");
                    }}
                    className="inline-flex items-center rounded-full bg-[#F5A623] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white transition hover:bg-[#d48a0e] disabled:opacity-60"
                  >
                    {requestStatus === "submitting" ? "Sending..." : "Request this topic"}
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {!!results.length && (
            <ul className="max-h-72 divide-y divide-[#F2E2C1] overflow-auto text-sm">
              {results.map((result, index) => (
                <li
                  key={result.slug ?? result.title ?? index}
                  className={
                    (activeIndex === index ? "bg-[#E6F2E6]" : "bg-white") +
                    " hover:bg-[#E6F2E6] transition-colors"
                  }
                >
                  <button
                    onClick={() => handleArticleClick(result)}
                    className="w-full px-4 py-3 text-left hover:bg-[#E6F2E6] transition-colors"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-[#00A5A5]">
                      {result.primaryAudience || "All Staff"}
                    </p>
                    <p className="line-clamp-2 text-sm font-semibold text-[#4D2C0A]">
                      {result.title ?? "Untitled article"}
                    </p>
                    {result.overview && (
                      <p className="mt-1 line-clamp-2 text-xs text-[#4D2C0A]/80">
                        {result.overview}
                      </p>
                    )}
                    {result.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {result.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#E6F2E6] px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-[#4D2C0A]/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

