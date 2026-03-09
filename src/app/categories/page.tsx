import Link from "next/link";
import { getActiveCategories } from "@/lib/airtable/categories";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageContext } from "@/components/shell/PageContext";

export default async function CategoriesPage() {
  const categories = await getActiveCategories();

  return (
    <div className="min-h-screen bg-[--color-page-background] px-4 py-10 font-sans text-[--color-text-primary]">
      <PageContext nav="categories" />
      <main className="mx-auto max-w-5xl space-y-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Browse categories" }]} />

        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-[#4D2C0A]">
            Browse categories
          </h1>
          <p className="text-sm text-[#4D2C0A]/70">
            Explore the knowledge base by topic area. Select a category to see all related articles.
          </p>
          <div>
            <Link
              href="/feedback?type=request_article&source=categories"
              className="inline-flex items-center rounded-full border border-[--color-primary-green] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[--color-primary-green] hover:bg-[--color-primary-green-light]"
            >
              Request a new category
            </Link>
          </div>
        </header>

        {categories.length === 0 ? (
          <div className="rounded-lg bg-[#F2E2C1]/60 px-4 py-6 text-sm text-[#4D2C0A]">
            No categories available yet. Add categories in Airtable with <strong>Status = Active</strong>.
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const slug = (category.Name ?? "")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

              return (
                <li key={category.id}>
                  <Link
                    href={`/categories/${encodeURIComponent(slug)}`}
                    className="flex h-full flex-col justify-between rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-sm font-semibold text-[#4D2C0A]">
                          {category.Name ?? "Unnamed category"}
                        </h2>
                        {category.articleCount > 0 && (
                          <span className="shrink-0 rounded-full bg-[#00A651]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00A651]">
                            {category.articleCount} article{category.articleCount !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      {category.Description && (
                        <p className="line-clamp-2 text-xs text-[#4D2C0A]/70">
                          {category.Description}
                        </p>
                      )}
                    </div>

                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <div className="pt-2">
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-[#4D2C0A]/60 hover:text-[#00A651] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
