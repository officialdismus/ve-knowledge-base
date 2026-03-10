"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HomeSearch } from "@/components/search/HomeSearch";
import { PageContext } from "@/components/shell/PageContext";
import { getPublishedArticlesForHome, ArticleRecord } from "@/lib/airtable/articles";
import { useFiltersStore } from "@/state/filtersStore";

type CategorySummary = {
  id: string;
  Name?: string;
  Description?: string;
  articleCount?: number;
};

export default function Home() {
  const [articles, setArticles] = useState<ArticleRecord[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const { role, contentTypes } = useFiltersStore();

  useEffect(() => {
    const fetchArticles = async () => {
      const data = await getPublishedArticlesForHome(24);
      setArticles(data);
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories?limit=6");
        if (!response.ok) return;
        const result = await response.json();
        setCategories(result.categories ?? []);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchCategories();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesRole = role ? article["Primary Audience"] === role : true;
      const matchesContentType = contentTypes.length
        ? contentTypes.includes(article["Content Type"] ?? "")
        : true;
      return matchesRole && matchesContentType;
    });
  }, [articles, role, contentTypes]);

  const mostViewed = useMemo(() => filteredArticles.slice(0, 6), [filteredArticles]);
  const recentlyUpdated = useMemo(() => filteredArticles.slice(0, 5), [filteredArticles]);
  const trending = useMemo(() => filteredArticles.slice(0, 4), [filteredArticles]);

  return (
    <>
      <PageContext nav="home" actions={[]} />

      <div className="bg-gradient-to-b from-[--color-soft-beige] via-white to-[--color-primary-green-light]">
        <section className="mx-auto max-w-5xl px-4 py-16 text-center">
          <p className="kb-eyebrow">Village Enterprise Knowledge Base</p>
          <h1 className="text-4xl font-bold text-[--color-text-primary] sm:text-5xl">
            How can we help you today?
          </h1>
          <p className="mt-3 text-lg text-[--color-text-muted]">
            Search across policies, guides, checklists, and troubleshooting playbooks.
          </p>
          <div className="mt-10">
            <HomeSearch />
          </div>
          <div className="mt-10" />

          <section className="mt-10 space-y-4">
            <div className="flex flex-col gap-2 text-center">
              <p className="kb-eyebrow">Browse categories</p>
              <h2 className="kb-section-heading">Jump into common topics</h2>
              <p className="text-sm text-[--color-text-muted]">
                Choose a space to see subtopics, role filters, and featured workflows.
              </p>
            </div>
            {categories.length === 0 ? (
              <p className="text-center text-sm text-[--color-text-muted]">
                Categories will appear here as soon as they are published.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => {
                  const slug = (category.Name ?? "")
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");
                  return (
                    <Link
                      key={category.id}
                      href={`/categories/${encodeURIComponent(slug)}`}
                      className="group rounded-2xl border border-[--color-border] bg-white/90 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[--color-primary-green]"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-[--color-support-teal]">
                        {category.articleCount ?? 0} article{(category.articleCount ?? 0) === 1 ? "" : "s"}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-[--color-text-primary] group-hover:text-[--color-primary-green]">
                        {category.Name ?? "Untitled"}
                      </h3>
                      {category.Description && (
                        <p className="mt-1 text-sm text-[--color-text-muted] line-clamp-2">{category.Description}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </section>

        <div className="mx-auto max-w-6xl space-y-12 px-4 pb-16">
          {trending.length > 0 && (
            <section className="space-y-6">
              <div className="text-center">
                <p className="kb-eyebrow">Popular & Trending</p>
                <h2 className="kb-section-heading">What teams are searching for</h2>
                <p className="text-sm text-[--color-text-muted]">
                  Last 7 days of search demand and article views.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {trending.map((article, index) => (
                  <Link
                    key={article.Slug ?? `${article.Title ?? "article"}-${index}`}
                    href={article.Slug ? `/articles/${article.Slug}` : "#"}
                    className="group flex flex-col rounded-2xl border border-[--color-border] bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[--color-primary-green]"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[--color-text-muted]">
                      <span className="rounded-full bg-[--color-primary-green-light] px-3 py-1 text-[--color-primary-green]">#{index + 1}</span>
                      {typeof article["Total Views"] === "number" && (
                        <span>{article["Total Views"]} views</span>
                      )}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[--color-text-primary] group-hover:text-[--color-primary-green] line-clamp-2">
                      {article.Title ?? "Untitled article"}
                    </h3>
                    {article.Overview && (
                      <p className="mt-2 text-sm text-[--color-text-neutral] line-clamp-3">{article.Overview}</p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[--color-support-teal]">
                      <span>{article["Primary Audience"] || "All Staff"}</span>
                      {article["Content Type"] && (
                        <span className="rounded-full bg-[--color-soft-beige] px-2 py-0.5 text-[--color-text-primary]">
                          {article["Content Type"]}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {mostViewed.length > 0 && (
            <section className="space-y-6">
              <div className="text-center">
                <p className="kb-eyebrow">Insights</p>
                <h2 className="kb-section-heading">Most viewed this month</h2>
                <p className="text-sm text-[--color-text-muted]">
                  High-signal guides your peers rely on the most.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mostViewed.map((article) => (
                  <Link
                    key={article.Slug}
                    href={article.Slug ? `/articles/${article.Slug}` : "#"}
                    className="group block rounded-2xl border border-[--color-border] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[--color-primary-green]"
                  >
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-[--color-support-teal] uppercase tracking-wide">
                        {article["Primary Audience"] || "All Staff"}
                      </p>
                      <h3 className="text-lg font-semibold text-[--color-text-primary] line-clamp-2 transition-colors group-hover:text-[--color-primary-green]">
                        {article.Title ?? "Untitled article"}
                      </h3>
                      {article.Overview && (
                        <p className="text-sm text-[--color-text-neutral] line-clamp-3">{article.Overview}</p>
                      )}
                      <div className="flex items-center justify-between">
                        {typeof article["Total Views"] === "number" && (
                          <span className="rounded-full bg-[--color-primary-green-light] px-2 py-1 text-sm text-[--color-text-primary]">
                            {article["Total Views"]} views
                          </span>
                        )}
                        <span className="text-sm font-medium text-[--color-primary-green]">
                          Read more →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {recentlyUpdated.length > 0 && (
            <section className="space-y-4">
              <div className="flex flex-col gap-2 text-center">
                <p className="kb-eyebrow">Freshness matters</p>
                <h2 className="kb-section-heading">Recently updated</h2>
                <p className="text-sm text-[--color-text-muted]">
                  Latest edits and approvals from the knowledge team.
                </p>
              </div>
              <div className="rounded-2xl border border-[--color-border] bg-white">
                <div className="divide-y divide-[--color-soft-beige]">
                  {recentlyUpdated.map((article) => (
                    <Link
                      key={article.Slug}
                      href={article.Slug ? `/articles/${article.Slug}` : "#"}
                      className="block p-6 transition-colors hover:bg-[--color-primary-green-light]/60"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-[--color-text-primary] transition-colors hover:text-[--color-primary-green]">
                              {article.Title ?? "Untitled article"}
                            </h3>
                            <span className="inline-flex items-center rounded-full bg-[--color-accent-orange] px-2 py-1 text-xs font-medium text-white">
                              Updated
                            </span>
                          </div>
                          {article.Overview && (
                            <p className="mb-2 text-sm text-[--color-text-neutral] line-clamp-2">{article.Overview}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-[--color-text-muted]">
                            <span className="font-medium text-[--color-support-teal]">
                              {article["Primary Audience"] || "All Staff"}
                            </span>
                            {typeof article["Total Views"] === "number" && (
                              <span className="text-[--color-text-neutral]">
                                {article["Total Views"]} views
                              </span>
                            )}
                          </div>
                        </div>
                        <svg className="ml-4 h-5 w-5 flex-shrink-0 text-[--color-text-muted]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-[--color-border] bg-white/90 px-8 py-10 text-center shadow-[0_25px_70px_rgba(0,0,0,0.07)]">
            <h2 className="text-2xl font-semibold text-[--color-text-primary]">
              Can&rsquo;t find what you need?
            </h2>
            <p className="mt-2 text-[--color-text-muted]">
              Tell us which article would help you unblock work—we&rsquo;ll route it to the knowledge team.
            </p>
            <Link
              href="/feedback?type=request_article&source=home"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#005f32] px-8 py-3 text-base font-semibold text-white shadow-lg shadow-[rgba(0,95,50,0.4)]"
            >
              Request an article
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
