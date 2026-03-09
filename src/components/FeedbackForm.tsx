"use client";

import { useState } from "react";

type Props = {
  relatedArticleSlug?: string;
  defaultTopic?: string;
};

export function FeedbackForm({ relatedArticleSlug, defaultTopic }: Props) {
  const [topic, setTopic] = useState(defaultTopic ?? "");
  const [description, setDescription] = useState("");
  const [suggestedChange, setSuggestedChange] = useState("");
  const [urgency, setUrgency] = useState<"Low" | "Medium" | "High" | "">("");
  const [contactInfo, setContactInfo] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          relatedArticleSlug,
          topic,
          description,
          suggestedChange,
          urgency: urgency || undefined,
          contactInfo: contactInfo || undefined,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Failed to submit feedback");
      }

      setStatus("success");
      setTopic(defaultTopic ?? "");
      setDescription("");
      setSuggestedChange("");
      setUrgency("");
      setContactInfo("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-[#F2E2C1]/40 p-4">
      <h2 className="text-sm font-semibold text-[#4D2C0A]">Help us improve this knowledge base</h2>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-[#4D2C0A]">
          Topic <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          required
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          className="w-full rounded-md border border-[#F2E2C1] bg-white px-2 py-1.5 text-sm text-[#4D2C0A] placeholder:text-[#4D2C0A]/50 focus:outline-none focus:ring-1 focus:ring-[#00A651]"
          placeholder="What is this about?"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-[#4D2C0A]">
          Description <span className="text-red-600">*</span>
        </label>
        <textarea
          required
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="w-full rounded-md border border-[#F2E2C1] bg-white px-2 py-1.5 text-sm text-[#4D2C0A] placeholder:text-[#4D2C0A]/50 focus:outline-none focus:ring-1 focus:ring-[#00A651]"
          placeholder="What needs to be clarified, improved, or added?"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-[#4D2C0A]">Suggested change</label>
        <textarea
          value={suggestedChange}
          onChange={(event) => setSuggestedChange(event.target.value)}
          rows={3}
          className="w-full rounded-md border border-[#F2E2C1] bg-white px-2 py-1.5 text-sm text-[#4D2C0A] placeholder:text-[#4D2C0A]/50 focus:outline-none focus:ring-1 focus:ring-[#00A651]"
          placeholder="Optional: propose wording or steps."
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-[#4D2C0A]">Urgency</label>
          <select
            value={urgency}
            onChange={(event) => setUrgency(event.target.value as typeof urgency)}
            className="w-full rounded-md border border-[#F2E2C1] bg-white px-2 py-1.5 text-sm text-[#4D2C0A] focus:outline-none focus:ring-1 focus:ring-[#00A651]"
          >
            <option value="">Not specified</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-[#4D2C0A]">Contact info</label>
          <input
            type="text"
            value={contactInfo}
            onChange={(event) => setContactInfo(event.target.value)}
            className="w-full rounded-md border border-[#F2E2C1] bg-white px-2 py-1.5 text-sm text-[#4D2C0A] placeholder:text-[#4D2C0A]/50 focus:outline-none focus:ring-1 focus:ring-[#00A651]"
            placeholder="Optional: email or Slack handle."
          />
        </div>
      </div>

      {status === "error" && errorMessage && (
        <p className="text-xs text-red-700">Could not submit feedback: {errorMessage}</p>
      )}
      {status === "success" && (
        <p className="text-xs text-[#00A651]">Thank you. Your feedback has been received.</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center rounded-full bg-[#00A651] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#008b44] disabled:cursor-not-allowed disabled:bg-[#00A651]/60"
      >
        {status === "submitting" ? "Sending..." : "Submit feedback"}
      </button>
    </form>
  );
}

