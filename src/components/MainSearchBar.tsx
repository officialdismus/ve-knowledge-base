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
  placeholder?: string;
};

export function MainSearchBar({ className, placeholder = "Search for help..." }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search function
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300); // 300ms debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const fetchSuggestions = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.results || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => {
          if (prev === null || prev >= suggestions.length - 1) return 0;
          return prev + 1;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => {
          if (prev === null || prev <= 0) return suggestions.length - 1;
          return prev - 1;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex !== null && suggestions[activeIndex]) {
          handleSuggestionClick(suggestions[activeIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setActiveIndex(null);
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
    setShowSuggestions(false);
    setQuery(suggestion.title || "");
    if (suggestion.slug) {
      router.push(`/articles/${suggestion.slug}`);
    }
  };

  const handleRequestTopic = () => {
    setShowSuggestions(false);
    router.push(`/feedback?topic=${encodeURIComponent(query)}`);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setActiveIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className={`relative w-full max-w-3xl mx-auto ${className}`}>
      {/* Main Search Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim().length >= 2 && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#00A651] transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {isLoading ? (
            <div className="px-6 py-4 text-center text-sm text-[#333333]">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-[#00A651] mr-2"></div>
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.slug ?? suggestion.title ?? index}
                  className={`${
                    activeIndex === index ? "bg-[#E6F2E6]" : "bg-white"
                  } hover:bg-[#E6F2E6] transition-colors`}
                >
                  <button
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-6 py-3 text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#00A5A5] uppercase tracking-wide truncate">
                          {suggestion.primaryAudience || "All Staff"}
                        </p>
                        <p className="text-base font-semibold text-[#4D2C0A] truncate">
                          {suggestion.title ?? "Untitled article"}
                        </p>
                        {suggestion.overview && (
                          <p className="mt-1 text-sm text-[#333333] line-clamp-2">
                            {suggestion.overview}
                          </p>
                        )}
                      </div>
                      <svg className="ml-3 h-5 w-5 text-gray-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.trim().length >= 2 ? (
            <div className="px-6 py-4 text-center">
              <p className="text-sm text-[#4D2C0A] font-medium mb-2">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[#333333] mb-3">
                Can&rsquo;t find what you need?
              </p>
              <button
                onClick={handleRequestTopic}
                className="inline-flex items-center px-4 py-2 bg-[#F5A623] text-white text-sm font-medium rounded-lg hover:bg-[#d48a0e] transition-colors"
              >
                Request this topic
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
