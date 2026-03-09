'use client';

import { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PageContext } from '@/components/shell/PageContext';
import { useFiltersStore } from '@/state/filtersStore';

interface Article {
  slug?: string;
  title?: string;
  overview?: string;
  primaryAudience?: string;
  contentType?: string | null;
  category?: string | null;
  tags: string[];
  totalViews?: number;
}

interface FilterMetadata {
  categories: { id: string; name: string }[];
  audiences: string[];
  contentTypes: string[];
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterMeta, setFilterMeta] = useState<FilterMetadata>({ categories: [], audiences: [], contentTypes: [] });
  const [filtersLoading, setFiltersLoading] = useState(true);
  const { role, contentTypes, setRole, toggleContentType, reset } = useFiltersStore();

  const fetchSearchResults = useCallback(async () => {
    if (!query) return;
    setLoading(true);
    let resultsCount = 0;
    try {
      const params = new URLSearchParams({ q: query });

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      const nextArticles = (data.results ?? data.articles ?? []) as Article[];
      resultsCount = Array.isArray(nextArticles) ? nextArticles.length : 0;
      setArticles(nextArticles);
    } catch (error) {
      console.error('Search error:', error);
      setArticles([]);
    } finally {
      setLoading(false);

      fetch("/api/analytics/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, resultsCount, role, contentTypes, category: selectedCategory }),
      }).catch((err) => console.error("search analytics failed", err));
    }
  }, [contentTypes, query, role, selectedCategory]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  useEffect(() => {
    const loadFilters = async () => {
      setFiltersLoading(true);
      try {
        const response = await fetch('/api/filters');
        if (!response.ok) throw new Error('Failed to fetch filters');
        const data = (await response.json()) as FilterMetadata;
        setFilterMeta({
          categories: data.categories ?? [],
          audiences: data.audiences ?? [],
          contentTypes: data.contentTypes ?? [],
        });
      } catch (error) {
        console.error('Failed to load filters', error);
        setFilterMeta({ categories: [], audiences: [], contentTypes: [] });
      } finally {
        setFiltersLoading(false);
      }
    };

    loadFilters();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
      const matchesRole = role ? article.primaryAudience === role : true;
      const matchesContent = contentTypes.length ? contentTypes.includes(article.contentType ?? '') : true;
      return matchesCategory && matchesRole && matchesContent;
    });
  }, [articles, selectedCategory, role, contentTypes]);

  const buildRequestUrl = () => {
    const params = new URLSearchParams({
      type: 'request_article',
      source: 'search',
      query,
    });
    if (selectedCategory) params.set('category_guess', selectedCategory);
    if (role) params.set('role_filter', role);
    return `/feedback?${params.toString()}`;
  };

  return (
    <>
      <PageContext nav={null} />
      <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Search', href: '/search' },
          ]}
        />

        {/* Search Header */}
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold text-[#4D2C0A]">Search Results</h1>
          <p className="mt-2 text-[#333333]">
            {query ? (
              <>
                Results for &ldquo;{query}&rdquo;
              </>
            ) : (
              'Search our knowledge base'
            )}
          </p>
          <div className="mt-6 max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>

        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#4D2C0A] mb-4">Filters</h2>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#4D2C0A] mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2 text-[#00A651] focus:ring-[#00A651]"
                    />
                    <span className="text-sm text-[#333333]">All Categories</span>
                  </label>
                  {filtersLoading && (
                    <p className="text-xs text-gray-500">Loading categories…</p>
                  )}
                  {!filtersLoading &&
                    filterMeta.categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.name}
                          checked={selectedCategory === category.name}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="mr-2 text-[#00A651] focus:ring-[#00A651]"
                        />
                        <span className="text-sm text-[#333333]">{category.name}</span>
                      </label>
                    ))}
                </div>
              </div>

              {/* Audience Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#4D2C0A] mb-3">Audience</h3>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setRole(null)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                      !role ? 'border-[#00A651] text-[#00A651]' : 'border-gray-200 text-[#333333]'
                    }`}
                  >
                    All Audiences
                  </button>
                  {filtersLoading && (
                    <p className="text-xs text-gray-500">Loading audiences…</p>
                  )}
                  {!filtersLoading &&
                    filterMeta.audiences.map((audience) => (
                      <button
                        key={audience}
                        type="button"
                        onClick={() => setRole(audience)}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                          role === audience ? 'border-[#00A651] text-[#00A651]' : 'border-gray-200 text-[#333333]'
                        }`}
                      >
                        {audience}
                      </button>
                    ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#4D2C0A] mb-3">Content type</h3>
                <div className="flex flex-wrap gap-2">
                  {filtersLoading && <p className="text-xs text-gray-500">Loading content types…</p>}
                  {!filtersLoading &&
                    filterMeta.contentTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleContentType(type)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          contentTypes.includes(type)
                            ? 'border-[#00A651] text-[#00A651]'
                            : 'border-gray-200 text-[#333333]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('');
                  reset();
                }}
                className="w-full px-4 py-2 text-sm font-medium text-[#333333] bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A651]"></div>
                <p className="mt-2 text-[#333333]">Searching...</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-[#FEF3E2] border border-[#F5A623] rounded-lg p-8 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-[#92400E]">No results found</h3>
                    <p className="mt-2 text-[#92400E]">
                      {query ? (
                        <>
                          No articles found for &ldquo;{query}&rdquo;. Try different keywords or adjust your filters.
                        </>
                      ) : (
                        'Enter a search term to find articles.'
                      )}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm text-[#92400E]">
                    <p>Suggestions:</p>
                    <ul className="list-disc list-inside">
                      <li>Check spelling or try a broader term</li>
                      <li>Try synonyms (e.g. &ldquo;payment&rdquo; instead of &ldquo;disbursement&rdquo;)</li>
                      <li>Use fewer filters to see more results</li>
                    </ul>
                  </div>
                  {query && (
                    <Link
                      href={buildRequestUrl()}
                      className="inline-flex items-center justify-center rounded-full bg-[#F5A623] px-5 py-2 text-sm font-semibold text-white hover:bg-[#d48a0e]"
                    >
                      Request this article
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-[#333333]">
                    Found {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <Link
                      key={article.slug ?? article.title}
                      href={article.slug ? `/articles/${article.slug}` : '#'}
                      className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-[#00A651] transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-medium text-[#00A5A5] uppercase tracking-wide">
                              {article.primaryAudience || 'All Staff'}
                            </span>
                            {article.category && (
                              <span className="text-sm text-[#333333]">
                                in {article.category}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-[#4D2C0A] hover:text-[#00A651] line-clamp-2 mb-2 transition-colors">
                            {article.title}
                          </h3>
                          {article.overview && (
                            <p className="text-sm text-[#333333] line-clamp-3 mb-3">
                              {article.overview}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            {article.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {article.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center rounded-full bg-[#E6F2E6] px-2 py-1 text-xs font-medium text-[#4D2C0A]"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            {typeof article.totalViews === 'number' && (
                              <span className="text-sm text-[#333333]">
                                {article.totalViews} views
                              </span>
                            )}
                          </div>
                        </div>
                        <svg className="ml-4 h-5 w-5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A651]"></div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
