"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/feedback", label: "Feedback" },
  { href: "/admin/taxonomy", label: "Taxonomy" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin-login");
    } catch (error) {
      console.error("Failed to sign out", error);
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/30 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-sm text-[--color-text-primary]">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[--color-support-teal]">
              Admin Control Center
            </span>
            <p className="text-xs text-[--color-text-muted]">Monitor taxonomy, content, and governance signals</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-2 lg:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-[--color-primary-green] text-white shadow-[0_10px_25px_rgba(0,166,81,0.3)]"
                      : "bg-white/80 text-[--color-text-primary] shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:bg-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[--color-text-primary] shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition hover:border-[--color-primary-green]/50 hover:text-[--color-primary-green] disabled:opacity-60"
          >
            <span>{signingOut ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
