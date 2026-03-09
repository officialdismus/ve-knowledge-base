import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveCategories } from "@/lib/airtable/categories";
import { airtableSelect } from "@/lib/airtable/client";
import type { ArticleRecord } from "@/lib/airtable/articles";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageContext } from "@/components/shell/PageContext";
import { CategoryArticlesList } from "@/components/category/CategoryArticlesList";

type Props = { params: Promise<{ slug: string }> };

function nameToSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;

  const categories = await getActiveCategories();
  const category = categories.find((c) => nameToSlug(c.Name ?? "") === slug);

  if (!category) notFound();

  const articlesRes = await airtableSelect<ArticleRecord>(process.env.AIRTABLE_TABLE_ARTICLES || "Articles", {
    maxRecords: 100,
    view: "Articles (Published)",
    filterByFormula: `FIND('${(category.Name ?? "").replace(/'/g, "\\'")}', ARRAYJOIN({Category}, ','))`,
    fields: ["Title", "Slug", "Overview", "Primary Audience", "Tags", "Total Views", "Subcategory", "Content Type"],
  });

  const articles = articlesRes.records.map((r) => r.fields);

  const categoryLabel = category.Name ?? "Category";
  const requestParams = new URLSearchParams({
    type: "request_article",
    source: "category",
    category: categoryLabel,
  });
  const requestUrl = `/feedback?${requestParams.toString()}`;

  const mappedArticles = articles.map((article) => ({
    slug: article.Slug,
    title: article.Title,
    overview: article.Overview,
    primaryAudience: article["Primary Audience"],
    contentType: article["Content Type"],
    tags: article.Tags,
    totalViews: article["Total Views"],
  }));

  return (
    <div className="min-h-screen bg-[--color-page-background] px-4 py-10 font-sans text-[--color-text-primary]">
      <PageContext nav="categories" />
      <main className="mx-auto max-w-5xl space-y-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: category.Name ?? "Category" },
          ]}
        />

        <header className="space-y-2">
          <p className="inline rounded-full bg-[#00A651] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Category
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[#4D2C0A]">
            {category.Name}
          </h1>
          {category.Description && (
            <p className="max-w-2xl text-sm text-[#4D2C0A]/70">{category.Description}</p>
          )}
        </header>

        {/* Articles */}
        <section aria-label="Articles in this category" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="kb-eyebrow">Articles</p>
              <h2 className="text-lg font-semibold text-[#4D2C0A]">
                {mappedArticles.length} result{mappedArticles.length === 1 ? "" : "s"}
              </h2>
            </div>
            <Link
              href={requestUrl}
              className="rounded-full border border-[--color-primary-green] px-3 py-1.5 text-sm font-semibold text-[--color-primary-green] hover:bg-[--color-primary-green-light]"
            >
              Request content
            </Link>
          </div>

          <CategoryArticlesList
            articles={mappedArticles}
            contextLabel={categoryLabel}
            requestUrl={requestUrl}
          />
        </section>

        <Link
          href="/categories"
          className="inline-flex items-center gap-1 text-xs text-[#4D2C0A]/60 hover:text-[#00A651] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
          Back to categories
        </Link>
      </main>
    </div>
  );
}
