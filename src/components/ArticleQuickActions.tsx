'use client';

export function ArticleQuickActions() {
  const handleCopyLink = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
  };

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    window.print();
  };

  return (
    <div className="mt-4 space-y-2 text-sm">
      <button
        type="button"
        onClick={handleCopyLink}
        className="w-full rounded-full border border-[--color-border] px-4 py-2 font-semibold text-[--color-text-primary] hover:border-[--color-primary-green]"
      >
        Copy article link
      </button>
      <button
        type="button"
        onClick={handlePrint}
        className="w-full rounded-full border border-[--color-border] px-4 py-2 font-semibold text-[--color-text-primary] hover:border-[--color-primary-green]"
      >
        Print article
      </button>
    </div>
  );
}
