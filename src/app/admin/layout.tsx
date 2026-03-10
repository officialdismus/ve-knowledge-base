import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/AdminSidebar";

const adminInter = Inter({ subsets: ["latin"], variable: "--font-admin-inter" });

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${adminInter.className} min-h-screen bg-[radial-gradient(circle_at_top,#fdf7ec,transparent_60%),linear-gradient(180deg,#f5ede0_0%,#f7fbf7_55%,#e9f3ea_100%)] text-[--color-text-primary]`}>
      <AdminHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 lg:flex-row">
        <AdminSidebar />
        <div className="flex flex-1 flex-col gap-6">
          <AdminMobileNav />
          <main className="flex-1 rounded-[32px] border border-white/50 bg-white/95 p-8 shadow-[0_25px_80px_rgba(20,63,34,0.15)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

