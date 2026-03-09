"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      aria-label="Print this article"
      className="inline-flex items-center gap-1.5 rounded-full border border-[#F2E2C1] bg-white px-3 py-1 text-xs font-medium text-[#4D2C0A] transition hover:bg-[#F2E2C1] print:hidden"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      Print
    </button>
  );
}
