"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Login failed");
      }

      window.location.href = "/admin";
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setStatus((prev) => (prev === "submitting" ? "idle" : prev));
    }
  }

  return (
    <div className="min-h-screen bg-[#E6F2E6] px-4 py-10 font-sans text-[#4D2C0A]">
      <main className="mx-auto flex max-w-md flex-col rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-[#4D2C0A]">Admin access</h1>
        <p className="mt-2 text-sm text-[#4D2C0A]/80">
          Restricted to knowledge base administrators. Use your shared admin password.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#4D2C0A]">
              Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-[#F2E2C1] bg-white px-2 py-1.5 text-sm text-[#4D2C0A] placeholder:text-[#4D2C0A]/50 focus:outline-none focus:ring-1 focus:ring-[#00A651]"
              placeholder="Enter admin password"
            />
          </div>

          {status === "error" && error && (
            <p className="text-xs text-red-700">Login failed: {error}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-[#00A651] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#008b44] disabled:cursor-not-allowed disabled:bg-[#00A651]/60"
          >
            {status === "submitting" ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </main>
    </div>
  );
}

