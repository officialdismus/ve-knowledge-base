export default function AccessibilityPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-[--color-text-primary]">
      <div className="space-y-2">
        <p className="kb-eyebrow text-[--color-support-teal]">Accessibility commitment</p>
        <h1 className="text-3xl font-semibold">How we support every Village Enterprise teammate</h1>
        <p className="text-[--color-text-muted]">
          The knowledge base is designed to be accessible on low bandwidth, small screens, and with assistive technologies.
        </p>
      </div>
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          We follow WCAG 2.1 AA guidelines across color contrast, keyboard operability, focus states, and screen reader
          semantics. Articles keep paragraphs short, headings nested, and navigation predictable so content can be consumed in
          the field or in an office setting. Print styles ensure braille embossers and black-and-white printers retain
          structure.
        </p>
        <p>
          If you encounter any accessibility issues, reach out via the feedback form or email accessibility@villageenterprise.org
          with a screenshot, device info, and the page URL. The governance team triages accessibility reports with the same
          urgency as content accuracy.
        </p>
      </div>
      <div className="rounded-2xl border border-[--color-border] bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Accessibility features</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          <li>High-contrast themes using the Village Enterprise palette.</li>
          <li>Keyboard-friendly navigation (skip links, focus indicators, semantic landmarks).</li>
          <li>Responsive layout for mobile, tablet, and desktop, plus print-friendly styles.</li>
          <li>Screen-reader labels for all interactive controls and data tables.</li>
        </ul>
      </div>
    </section>
  );
}
