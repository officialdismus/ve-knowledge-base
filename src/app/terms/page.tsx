export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-[--color-text-primary]">
      <div className="space-y-2">
        <p className="kb-eyebrow text-[--color-support-teal]">Terms of use</p>
        <h1 className="text-3xl font-semibold">Using the Village Enterprise knowledge base</h1>
        <p className="text-[--color-text-muted]">
          Access to this site is limited to Village Enterprise staff and authorized partners. Content is for internal use only.
        </p>
      </div>
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          Articles describe internal policies, processes, and tools. Do not share outside the organization unless an article is
          explicitly marked as external facing. Screenshots may contain sensitive data; scrub before forwarding and report any
          exposures to security@villageenterprise.org.
        </p>
        <p>
          Admins reserve the right to archive or modify articles to keep the knowledge base accurate. Feedback of any kind is
          welcome and becomes part of our content governance workflow.
        </p>
      </div>
      <div className="rounded-2xl border border-[--color-border] bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Key policies</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          <li>Use content responsibly and follow local privacy/HR policies.</li>
          <li>Do not copy policy text into external tools without approvals.</li>
          <li>Report outdated or inaccurate content using the built-in forms.</li>
          <li>Respect article ownership and review cadences.</li>
        </ul>
      </div>
    </section>
  );
}
