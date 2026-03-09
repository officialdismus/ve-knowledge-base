'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useUIStore } from "@/state/uiStore";
const navLinks = [
  { id: "home", label: "Home", href: "/" },
  { id: "feedback", label: "Feedback", href: "/feedback" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeNav = useUIStore((state) => state.activeNav);
  const headerActions = useUIStore((state) => state.headerActions);

  const defaultActionHandlers: Partial<Record<string, () => void>> = {
    copy_link: () => {
      if (typeof window === "undefined") return;
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    },
    print: () => {
      if (typeof window === "undefined") return;
      window.print();
    },
  };

  const handleAction = (actionId: string, onClick?: () => void) => {
    if (onClick) {
      onClick();
      return;
    }
    const handler = defaultActionHandlers[actionId];
    handler?.();
  };

  const actionButtonClasses = (variant: string | undefined) => {
    switch (variant) {
      case "primary":
        return "bg-[--color-primary-green] text-white hover:bg-[--color-primary-green-dark]";
      case "destructive":
        return "bg-[--color-action-orange] text-white hover:bg-[--color-action-orange-dark]";
      default:
        return "border border-gray-200 text-[--color-text-primary] hover:border-[--color-primary-green]";
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[--color-border] bg-[--color-base-white]/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between py-2">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-[--color-primary-green] hover:text-[--color-primary-green-dark]">
              <Image
                src="/logo.svg"
                alt="Village Enterprise"
                width={170}
                height={48}
                priority
              />
            </Link>
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[--color-text-muted]">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 transition-all ${
                    activeNav === link.id
                      ? "bg-[--color-primary-green-light] text-[--color-primary-green]"
                      : "text-[--color-text-muted] hover:text-[--color-primary-green] hover:bg-[--color-soft-beige]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {headerActions.map((action) => (
              action.href ? (
                <Link
                  key={action.id}
                  href={action.href}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${actionButtonClasses(action.variant)}`}
                >
                  {action.label}
                </Link>
              ) : (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleAction(action.id, action.onClick)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${actionButtonClasses(action.variant)}`}
                >
                  {action.label}
                </button>
              )
            ))}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-[--color-text-muted] hover:text-[--color-primary-green]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle navigation</span>
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-4">
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold ${
                  activeNav === link.id ? "bg-[--color-primary-green-light] text-[--color-primary-green]" : "text-[--color-text-primary]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2">
            {headerActions.map((action) => (
              action.href ? (
                <Link
                  key={action.id}
                  href={action.href}
                  className={`text-center rounded-full px-3 py-2 text-sm font-semibold ${actionButtonClasses(action.variant)}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {action.label}
                </Link>
              ) : (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => {
                    action.onClick?.();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-center rounded-full px-3 py-2 text-sm font-semibold ${actionButtonClasses(action.variant)}`}
                >
                  {action.label}
                </button>
              )
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
