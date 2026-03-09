"use client";

import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin-login");
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-4 block w-full text-left rounded px-2 py-1 text-sm text-red-600 hover:bg-[#E6F2E6]"
    >
      Logout
    </button>
  );
}
