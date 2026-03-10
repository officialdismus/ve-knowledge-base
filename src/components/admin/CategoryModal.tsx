'use client';

import { useEffect, useMemo, useState } from "react";
import type { CategoryWithMeta } from "@/lib/airtable/categories";

export type CategoryPayload = {
  id?: string;
  name: string;
  description?: string;
  status?: CategoryWithMeta["Status"];
  order?: number;
};

type CategoryModalProps = {
  open: boolean;
  loading?: boolean;
  mode: "add" | "edit";
  category?: CategoryWithMeta | null;
  onClose: () => void;
  onSubmit: (payload: CategoryPayload) => Promise<void> | void;
};

export function CategoryModal({ open, loading = false, mode, category, onClose, onSubmit }: CategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<CategoryWithMeta["Status"]>("Active");
  const [order, setOrder] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && category) {
      setName(category.Name ?? "");
      setDescription(category.Description ?? "");
      setStatus(category.Status ?? "Active");
      setOrder(
        typeof category["Display Order"] === "number" && !Number.isNaN(category["Display Order"])
          ? String(category["Display Order"])
          : "",
      );
    } else {
      setName("");
      setDescription("");
      setStatus("Active");
      setOrder("");
    }
    setError(null);
  }, [mode, category]);

  const isOpen = open;
  const submitLabel = mode === "add" ? "Create category" : "Save changes";

  const isValid = useMemo(() => name.trim().length > 0, [name]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid || loading) return;

    try {
      await onSubmit({
        id: category?.id,
        name: name.trim(),
        description: description.trim() || undefined,
        status,
        order: order ? Number(order) : undefined,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save category";
      setError(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[--color-support-teal]">
              {mode === "add" ? "New category" : "Edit category"}
            </p>
            <h2 className="text-xl font-semibold text-[--color-text-primary]">
              {mode === "add" ? "Add a new category" : category?.Name ?? "Update category"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[--color-border] p-1 text-[--color-text-muted] hover:text-[--color-text-primary]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error && <p className="mb-3 rounded-2xl bg-red-50 px-3 py-2 text-xs text-red-800">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="kb-eyebrow block text-[--color-text-muted]">Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-[--color-border] px-4 py-2 text-sm text-[--color-text-primary] focus:border-[--color-primary-green] focus:outline-none"
              placeholder="Category name"
            />
          </div>
          <div>
            <label className="kb-eyebrow block text-[--color-text-muted]">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-[--color-border] px-4 py-2 text-sm text-[--color-text-primary] focus:border-[--color-primary-green] focus:outline-none"
              rows={3}
              placeholder="Short summary for admins"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="kb-eyebrow block text-[--color-text-muted]">Status</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as CategoryWithMeta["Status"])}
                className="mt-1 w-full rounded-2xl border border-[--color-border] px-4 py-2 text-sm text-[--color-text-primary] focus:border-[--color-primary-green] focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="kb-eyebrow block text-[--color-text-muted]">Display order</label>
              <input
                type="number"
                inputMode="numeric"
                value={order}
                onChange={(event) => setOrder(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-[--color-border] px-4 py-2 text-sm text-[--color-text-primary] focus:border-[--color-primary-green] focus:outline-none"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[--color-border] px-4 py-2 text-sm font-semibold text-[--color-text-muted] hover:border-[--color-primary-green] hover:text-[--color-primary-green]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className="rounded-full bg-[var(--color-primary-green)] px-5 py-2 text-sm font-semibold text-white shadow disabled:opacity-60"
            >
              {loading ? "Saving…" : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
