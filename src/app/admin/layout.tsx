import Link from "next/link";
import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#E6F2E6] font-sans text-[#4D2C0A]">
      <AdminHeader />
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <aside className="w-56 rounded-lg bg-white p-4 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#00A651]">
            Admin
          </p>
          <nav className="space-y-1 text-sm">
            <Link href="/admin" className="block rounded px-2 py-1 hover:bg-[#E6F2E6]">
              Dashboard
            </Link>
            <Link href="/admin/articles" className="block rounded px-2 py-1 hover:bg-[#E6F2E6]">
              Articles
            </Link>
            <Link href="/admin/feedback" className="block rounded px-2 py-1 hover:bg-[#E6F2E6]">
              Feedback
            </Link>
            <Link href="/admin/taxonomy" className="block rounded px-2 py-1 hover:bg-[#E6F2E6]">
              Taxonomy
            </Link>
            <Link href="/admin/analytics" className="block rounded px-2 py-1 hover:bg-[#E6F2E6]">
              Analytics
            </Link>
          </nav>
        </aside>
        <main className="flex-1 space-y-6 rounded-lg bg-white p-6 shadow-sm">{children}</main>
      </div>
    </div>
  );
}

