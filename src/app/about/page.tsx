export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-[--color-text-primary]">
      <div className="space-y-2">
        <p className="kb-eyebrow text-[--color-support-teal]">About this knowledge base</p>
        <h1 className="text-3xl font-semibold">Why the Village Enterprise KB exists</h1>
        <p className="text-[--color-text-muted]">
          We curate practical guidance for program, finance, people, and technology teams so field work stays unblocked.
        </p>
      </div>
      <div className="space-y-4">
        <p>
          Village Enterprise staff run lean field programs across multiple countries. When someone needs to submit a payment,
          onboard a team member, troubleshoot a device, or run a training, they need answers fast. This knowledge base makes
          that know-how accessible in one place, backed by governance so everything stays accurate and current.
        </p>
        <p>
          Every article has a clear owner, review cadence, and helpful-vote metrics. Feedback loops are built in: readers can
          flag outdated guidance, request new content, and see when updates go live. Admins get analytics to monitor adoption
          and freshness.
        </p>
      </div>
      <div className="rounded-2xl border border-[--color-border] bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-semibold">What you can expect</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          <li>Searchable policies, guides, checklists, troubleshooting flows, and FAQs.</li>
          <li>Role-aware filters so each team sees the content most relevant to their work.</li>
          <li>Print-ready articles and quick copy links for sharing updates in the field.</li>
          <li>Dedicated feedback forms that go straight to content owners for fast iteration.</li>
        </ul>
      </div>
    </section>
  );
}
