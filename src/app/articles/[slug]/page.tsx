import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, estimateReadingTime } from "@/lib/airtable/articles";
import { FeedbackForm } from "@/components/FeedbackForm";
import ArticleActions from "@/components/ArticleActions";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { PrintButton } from "@/components/PrintButton";
import { ArticleAnalyticsTracker } from "@/components/ArticleAnalyticsTracker";
import { ArticleQuickActions } from "@/components/ArticleQuickActions";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage(props: ArticlePageProps) {
  const params = await props.params;
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const readingTime = estimateReadingTime(article);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(article.Category && article.Category.length > 0
      ? [{ label: article.Category[0], href: "/categories" }]
      : []),
    ...(article.Subcategory && article.Subcategory.length > 0
      ? [{ label: article.Subcategory[0] }]
      : []),
    { label: article.Title ?? "Article" },
  ];

  return (
    <div className="min-h-screen bg-[--color-page-background] px-4 py-10 text-[--color-text-primary]">
      <main className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row">
        <div className="w-full space-y-6 lg:w-3/4">
          <Breadcrumb items={breadcrumbItems} />

          <article className="rounded-3xl bg-white/95 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.08)]">
            <ArticleAnalyticsTracker slug={article.Slug} />
            <header className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                {article["Content Type"] && (
                  <span className="rounded-full bg-[--color-support-teal]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[--color-support-teal]">
                    {article["Content Type"]}
                  </span>
                )}
                {article["Primary Audience"] && (
                  <span className="rounded-full bg-[--color-soft-beige] px-3 py-1 text-[11px] font-medium text-[--color-text-primary]/70">
                    {article["Primary Audience"]}
                  </span>
                )}
                <span className="rounded-full bg-[--color-primary-green-light] px-3 py-1 text-[11px] font-semibold text-[--color-primary-green]">
                  ~{readingTime} min read
                </span>
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-[--color-text-primary]">
                  {article.Title ?? "Untitled article"}
                </h1>
                {article.Overview && (
                  <p className="text-base text-[--color-text-muted]">{article.Overview}</p>
                )}
                {article.Tags && article.Tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {article.Tags.map((tag) => (
                      <span key={tag} className="kb-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </header>

            <section className="mt-6 grid gap-4 rounded-2xl bg-[--color-primary-green-light]/60 p-4 text-sm text-[--color-text-primary] sm:grid-cols-2">
              {article.Author && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[--color-text-muted]">Author</p>
                  <p className="text-base">{article.Author}</p>
                </div>
              )}
              {article["Last Updated"] && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[--color-text-muted]">Last updated</p>
                  <p className="text-base">{article["Last Updated"]}</p>
                </div>
              )}
              {article.Version && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[--color-text-muted]">Version</p>
                  <p className="text-base">{article.Version}</p>
                </div>
              )}
              {article.Category && article.Category.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[--color-text-muted]">Category</p>
                  <p className="text-base">{article.Category[0]}</p>
                </div>
              )}
              {article.Subcategory && article.Subcategory.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[--color-text-muted]">Subcategory</p>
                  <p className="text-base">{article.Subcategory[0]}</p>
                </div>
              )}
            </section>

            <div className="mt-6 flex flex-wrap gap-2">
              <CopyLinkButton />
              <PrintButton />
            </div>

            <div className="mt-8 space-y-8">
              <ArticleSection title="Overview" body={article.Overview} fallback="Overview coming soon." />
              <ArticleSection title="When to use this guide" body={article["When to Use"]} fallback="Usage guidance coming soon." />
              <ArticleSection title="Step-by-step instructions" body={article.Steps} fallback="Steps will be added here." rich />
              <ArticleSection title="Troubleshooting" body={article.Troubleshooting} fallback="Troubleshooting guidance will appear here." />

              {article["Related Articles"] && article["Related Articles"].length > 0 && (
                <div className="space-y-3">
                  <h2 className="kb-section-heading text-lg">Related articles</h2>
                  <ul className="space-y-2">
                    {article["Related Articles"].map((relatedTitle, index) => (
                      <li key={index} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                        <span className="text-[--color-primary-green]">↗</span>
                        <span className="text-sm font-medium text-[--color-text-primary]">{relatedTitle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {article["External Resources"] && (
                <div className="space-y-3">
                  <h2 className="kb-section-heading text-lg">External resources</h2>
                  <p className="rounded-2xl bg-[--color-soft-beige]/60 p-4 text-sm text-[--color-text-primary]">
                    {article["External Resources"]}
                  </p>
                </div>
              )}

              <div className="space-y-4 rounded-2xl border border-[--color-border] p-4">
                <ArticleActions
                  slug={article.Slug}
                  initialHelpful={article["Helpful Count"] ?? 0}
                  initialNotHelpful={article["Not Helpful Count"] ?? 0}
                />
              </div>

              <div className="rounded-2xl border border-[--color-border] p-4">
                <FeedbackForm
                  relatedArticleSlug={article.Slug}
                  defaultTopic={article.Title ? `Feedback on: ${article.Title}` : "Article feedback"}
                />
              </div>
            </div>
          </article>

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-[--color-text-muted] hover:text-[--color-primary-green]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
            Back to knowledge base
          </Link>
        </div>

        <aside className="h-max rounded-3xl bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] lg:w-1/4">
          <h3 className="kb-eyebrow text-[--color-support-teal]">Need quick actions?</h3>
          <p className="mt-2 text-sm text-[--color-text-muted]">
            Print or copy this article link, then share feedback directly with the knowledge team.
          </p>
          <ArticleQuickActions />
        </aside>
      </main>
    </div>
  );
}

function ArticleSection({
  title,
  body,
  fallback,
  rich = false,
}: {
  title: string;
  body?: string | null;
  fallback: string;
  rich?: boolean;
}) {
  const content = body && body.trim().length > 0 ? body : fallback;

  return (
    <section className="space-y-3">
      <h2 className="kb-section-heading text-lg">{title}</h2>
      {rich ? (
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-[--color-text-primary]">
          {content}
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[--color-text-primary]/90">{content}</p>
      )}
    </section>
  );
}

