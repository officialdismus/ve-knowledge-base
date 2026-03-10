"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: { href: string; label: string }[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/feedback", label: "Feedback" },
  { href: "/admin/taxonomy", label: "Taxonomy" },
  { href: "/admin/analytics", label: "Analytics" },
];

const basePillClasses = "rounded-full border border-white/30 px-4 py-1.5 text-sm font-semibold backdrop-blur";

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <div className="no-scrollbar flex gap-3 overflow-x-auto rounded-2xl border border-white/40 bg-white/85 p-3 shadow-[0_15px_40px_rgba(20,63,34,0.08)] backdrop-blur">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${basePillClasses} ${
                active
                  ? "bg-[--color-primary-green] text-white border-[--color-primary-green] shadow-[0_12px_30px_rgba(0,166,81,0.25)]"
                  : "text-[--color-text-muted] hover:text-[--color-text-primary]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:block lg:w-72">
      <div className="sticky top-28 space-y-4">
        <div className="rounded-[28px] border border-white/40 bg-white/90 p-6 shadow-[0_30px_80px_rgba(20,63,34,0.15)] backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--color-support-teal]">
              Workspace
            </p>
            <p className="text-sm text-[--color-text-muted]">Village Enterprise KB</p>
          </div>
          <nav className="mt-6 space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    active
                      ? "bg-[rgba(0,166,81,0.12)] text-[--color-primary-green] shadow-[inset_0_0_0_1px_rgba(0,166,81,0.2)]"
                      : "text-[--color-text-muted] hover:bg-white hover:text-[--color-text-primary]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${active ? "bg-[--color-primary-green]" : "bg-[--color-soft-beige]"}`} />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
