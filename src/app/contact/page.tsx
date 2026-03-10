export default function ContactSupportPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-[--color-text-primary]">
      <div className="space-y-2">
        <p className="kb-eyebrow text-[--color-support-teal]">Contact support</p>
        <h1 className="text-3xl font-semibold">Need help from the knowledge team?</h1>
        <p className="text-[--color-text-muted]">
          Use this page to reach the governance team when an article needs hands-on assistance.
        </p>
      </div>
      <div className="rounded-2xl border border-[--color-border] bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Ways to reach us</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
          <li>Email <strong>kb@villageenterprise.org</strong> for general questions.</li>
          <li>Use the in-article feedback form for page-specific updates.</li>
          <li>Ping the <strong>#knowledge-base</strong> Slack channel for urgent issues.</li>
          <li>For access or login problems, email <strong>it@villageenterprise.org</strong>.</li>
        </ul>
      </div>
      <div className="rounded-2xl border border-[--color-border] bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Need a new article?</h2>
        <p className="mt-2 text-sm text-[--color-text-muted]">
          Submit the feedback form with context, audience, and urgency. The request auto-routes to content owners and shows up in the admin queue.
        </p>
      </div>
    </section>
  );
}
