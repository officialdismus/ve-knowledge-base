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
    <header className="sticky top-0 z-30 border-b border-[--color-border] bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-sm text-[--color-text-primary]">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[--color-primary-green] px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Admin
          </span>
          <span className="text-xs text-[--color-text-muted]">Governance suite</span>
        </div>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-2 md:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    active
                      ? "bg-[--color-primary-green]/10 text-[--color-primary-green]"
                      : "text-[--color-text-muted] hover:text-[--color-text-primary]"
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
            className="inline-flex items-center rounded-full border border-[--color-border] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[--color-text-muted] hover:border-[--color-primary-green] hover:text-[--color-primary-green] disabled:opacity-60"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </header>
  );
}
