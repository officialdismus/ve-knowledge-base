'use client';

import { PropsWithChildren } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useUIStore } from "@/state/uiStore";

export function Shell({ children }: PropsWithChildren) {
  const toasts = useUIStore((state) => state.toasts);
  const dismissToast = useUIStore((state) => state.dismissToast);

  return (
    <div className="min-h-screen flex flex-col bg-[--color-base-white]">
      <Header />
      <main className="flex-1" role="main">
        {children}
      </main>
      <Footer />

      {/* Toast stack */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="kb-card shadow-lg border border-gray-200 bg-white px-4 py-3 rounded-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#4D2C0A]">{toast.title}</p>
                {toast.description && (
                  <p className="mt-1 text-sm text-[#333333]">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="text-[#666666] hover:text-[#00A651]"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
