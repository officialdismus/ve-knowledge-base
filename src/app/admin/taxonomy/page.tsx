"use client";

import { useEffect, useMemo, useState } from "react";
import type { CategoryWithMeta } from "@/lib/airtable/categories";
import { CategoryModal, type CategoryPayload } from "@/components/admin/CategoryModal";

export default function AdminTaxonomyPage() {
  const [categories, setCategories] = useState<CategoryWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithMeta | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.categories ?? []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category: CategoryWithMeta) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleSubmit = async (payload: CategoryPayload) => {
    setSaving(true);
    setError(null);
    try {
      const endpoint = payload.id ? `/api/admin/categories/${payload.id}` : "/api/admin/categories";
      const method = payload.id ? "PATCH" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save category");
      }

      await refresh();
      setModalOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save category";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const rows = useMemo(() => categories ?? [], [categories]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#4D2C0A]">Taxonomy</h1>
          <p className="mt-1 text-sm text-[#4D2C0A]/80">
            Manage live categories used across the knowledge base.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-full bg-[--color-primary-green] px-4 py-2 text-sm font-semibold text-white shadow"
        >
          + Add category
        </button>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#00A5A5]">
          Categories {loading ? "(loading…)" : `(${rows.length})`}
        </h2>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {loading ? (
          <p className="text-xs text-[#4D2C0A]/60">Loading categories…</p>
        ) : rows.length === 0 ? (
          <p className="text-xs text-[#4D2C0A]/60">No categories yet.</p>
        ) : (
          <div className="overflow-auto rounded-2xl border border-[#F2E2C1]">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#F2E2C1] bg-[#F2E2C1]/30 text-xs uppercase tracking-wide text-[#4D2C0A]/70">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Articles</th>
                  <th className="py-2 px-3">Order</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((cat) => (
                  <tr key={cat.id} className="border-b border-[#F2E2C1]/60">
                    <td className="py-3 px-3 font-medium text-[#4D2C0A]">{cat.Name}</td>
                    <td className="py-3 px-3 text-xs text-[#4D2C0A]/70 max-w-xs line-clamp-1">{cat.Description ?? "—"}</td>
                    <td className="py-3 px-3">
                      <span className="rounded-full bg-[#00A651]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00A651]">
                        {cat.Status ?? "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-[#4D2C0A]/70">{cat.articleCount}</td>
                    <td className="py-3 px-3 text-xs text-[#4D2C0A]/70">{cat["Display Order"] ?? "—"}</td>
                    <td className="py-3 px-3 text-xs">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="rounded-full border border-[--color-border] px-3 py-1 text-[--color-text-muted] hover:border-[--color-primary-green]"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-xs text-[#4D2C0A]/50">
        Edits sync directly with Airtable. Archiving a category hides it from filters across the site.
      </p>

      <CategoryModal
        open={modalOpen}
        mode={modalMode}
        category={selectedCategory}
        loading={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

