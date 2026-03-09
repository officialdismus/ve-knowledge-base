'use client';

import Link from 'next/link';
import { useFiltersStore } from '@/state/filtersStore';

export type CategoryArticle = {
  slug?: string;
  title?: string;
  overview?: string;
  primaryAudience?: string;
  contentType?: string;
  tags?: string[];
  totalViews?: number;
};

interface CategoryArticlesListProps {
  articles: CategoryArticle[];
  contextLabel: string;
  requestUrl: string;
}

const audienceOptions = ['All Staff', 'Program Ops', 'Finance', 'IT', 'Field'];
const contentTypeOptions = ['Guide', 'Quick Fix', 'Checklist', 'Policy', 'FAQ'];

export function CategoryArticlesList({ articles, contextLabel, requestUrl }: CategoryArticlesListProps) {
  const { role, contentTypes, setRole, toggleContentType, reset } = useFiltersStore();

  const filtered = articles.filter((article) => {
    const matchesRole = role ? article.primaryAudience === role : true;
    const matchesContent = contentTypes.length ? contentTypes.includes(article.contentType ?? '') : true;
    return matchesRole && matchesContent;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[--color-border] bg-white p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[--color-text-muted]">
          <span>Filters:</span>
          <div className="flex flex-wrap gap-2">
            {audienceOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRole(role === option ? null : option)}
                className={`rounded-full border px-3 py-1 ${
                  role === option ? 'border-[--color-primary-green] text-[--color-primary-green]' : 'border-gray-200 text-[--color-text-primary]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {contentTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleContentType(type)}
                className={`rounded-full border px-3 py-1 ${
                  contentTypes.includes(type)
                    ? 'border-[--color-primary-green] text-[--color-primary-green]'
                    : 'border-gray-200 text-[--color-text-primary]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => reset()}
            className="ml-auto rounded-full border border-gray-200 px-3 py-1 text-[--color-text-muted] hover:border-[--color-primary-green]"
          >
            Clear
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[--color-warning-border] bg-[--color-warning-bg] p-6 text-center">
          <p className="text-sm text-[--color-warning-text]">
            No articles available in {contextLabel}. Request the content you need and we&rsquo;ll add it.
          </p>
          <Link
            href={requestUrl}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-[--color-action-orange] px-5 py-2 text-sm font-semibold text-white hover:bg-[--color-action-orange-dark]"
          >
            Request this article
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((article) => (
            <Link
              key={article.slug ?? article.title}
              href={article.slug ? `/articles/${article.slug}` : '#'}
              className="flex h-full flex-col justify-between rounded-xl border border-[--color-border] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {article.contentType && (
                    <span className="rounded-full bg-[--color-support-teal]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[--color-support-teal]">
                      {article.contentType}
                    </span>
                  )}
                  {article.primaryAudience && (
                    <span className="rounded-full bg-[--color-soft-beige] px-2 py-0.5 text-[10px] font-medium text-[--color-text-primary]/70">
                      {article.primaryAudience}
                    </span>
                  )}
                </div>
                <h3 className="line-clamp-2 text-sm font-semibold text-[--color-text-primary]">
                  {article.title ?? 'Untitled article'}
                </h3>
                {article.overview && (
                  <p className="line-clamp-2 text-xs text-[--color-text-muted]">{article.overview}</p>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {article.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[--color-light-green] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[--color-text-primary]/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {typeof article.totalViews === 'number' && (
                  <span className="text-[10px] text-[--color-text-muted]">{article.totalViews} views</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
