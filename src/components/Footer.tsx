import Link from "next/link";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact Support", href: "/contact" },
  { label: "Admin", href: "/admin" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-[--color-soft-beige] text-[--color-text-primary]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-[--color-text-primary] uppercase">
              Village Enterprise Knowledge Base
            </p>
            <p className="mt-1 text-sm text-[--color-text-muted]">© {year} Village Enterprise</p>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm text-[--color-text-primary]">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[--color-primary-green]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/feedback?source=footer"
            className="inline-flex items-center justify-center rounded-full border border-[--color-primary-green] px-4 py-2 text-sm font-semibold text-[--color-primary-green] hover:bg-[--color-primary-green-light]"
          >
            Suggest an improvement
          </Link>
        </div>
      </div>
    </footer>
  );
}
