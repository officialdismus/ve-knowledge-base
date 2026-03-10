export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-[--color-text-primary]">
      <div className="space-y-2">
        <p className="kb-eyebrow text-[--color-support-teal]">Privacy notice</p>
        <h1 className="text-3xl font-semibold">How we handle knowledge base data</h1>
        <p className="text-[--color-text-muted]">
          The knowledge base stores operational content and light telemetry about usage to keep guidance accurate and fresh.
        </p>
      </div>
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          We log search queries, article views, and feedback submissions to guide content investments. The data is stored in
          Airtable and governed by Village Enterprise policy. We do not store personal data in analytics beyond optional
          contact info provided when requesting support; that info is used only to follow-up on the request.
        </p>
        <p>
          If you believe any article contains sensitive data, or you would like us to remove optional contact information you
          previously shared, email privacy@villageenterprise.org with the article link or feedback reference ID.
        </p>
      </div>
      <div className="rounded-2xl border border-[--color-border] bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Data we collect</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          <li>Search keywords (plus role/content filters) to find gaps.</li>
          <li>Article view counts + helpful votes to track usefulness.</li>
          <li>Feedback submissions, including optional contact info.</li>
          <li>Timestamped audit logs for taxonomy updates.</li>
        </ul>
      </div>
    </section>
  );
}
