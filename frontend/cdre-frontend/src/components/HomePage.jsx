const features = [
  {
    title: "Medication Reconciliation",
    description:
      "Resolve conflicting medication records across hospital EHRs, primary care systems, and pharmacy records. Claude analyzes source reliability, recency, and clinical context to determine the most accurate medication with a confidence score and safety check.",
    tab: "reconciliation",
    stats: [
      { label: "Sources supported", value: "Unlimited" },
      { label: "Safety check", value: "Automatic" },
      { label: "Confidence scoring", value: "0 – 100%" },
    ],
    accent: "#0EA5A0",
    accentLight: "#E6F7F7",
  },
  {
    title: "Data Quality Validation",
    description:
      "Evaluate any patient record across four clinical dimensions — completeness, accuracy, timeliness, and clinical plausibility. Receive a scored report with detected issues flagged by severity so clinicians know exactly where to focus.",
    tab: "dataQuality",
    stats: [
      { label: "Dimensions scored", value: "4" },
      { label: "Issue detection", value: "AI-powered" },
      { label: "Severity levels", value: "Low / Med / High" },
    ],
    accent: "#1A3557",
    accentLight: "#EEF3F9",
  },
];

export default function HomePage({ onNavigate }) {
  return (
    <div className="space-y-16">

      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium mb-6"
          style={{ color: "var(--teal)" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--teal)" }} />
          Powered by Anthropic Claude
        </div>

        <h1 className="font-display text-5xl font-semibold leading-tight mb-4"
          style={{ color: "var(--navy)" }}>
          Clinical data you can
          <span className="italic" style={{ color: "var(--teal)" }}> trust.</span>
        </h1>

        <p className="text-base leading-relaxed mb-8" style={{ color: "var(--slate)" }}>
          CDRE uses AI to reconcile conflicting medication records and validate
          patient data quality across healthcare systems — giving clinicians
          accurate, explainable decisions they can act on.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => onNavigate("reconciliation")}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: "var(--navy)",
              boxShadow: "0 4px 14px rgba(11,31,58,0.25)",
            }}
          >
            Try Reconciliation
          </button>
          <button
            onClick={() => onNavigate("dataQuality")}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white transition-all hover:border-slate-300"
            style={{ color: "var(--navy)" }}
          >
            Validate Data Quality
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--slate)" }}>
          Features
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 gap-6">
        {features.map((feature) => (
          <div
            key={feature.tab}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-lift"
          >
            {/* Card accent bar */}
            <div className="h-1 w-full" style={{ background: feature.accent }} />

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: feature.accentLight }}>
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: feature.accent }} />
                </div>
                <h3 className="font-display text-lg font-semibold" style={{ color: "var(--navy)" }}>
                  {feature.title}
                </h3>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--slate)" }}>
                {feature.description}
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {feature.stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl p-3 text-center border border-slate-100"
                    style={{ background: feature.accentLight }}>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: feature.accent }}>
                      {stat.value}
                    </p>
                    <p className="text-xs leading-tight" style={{ color: "var(--slate)" }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate(feature.tab)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold border transition-all"
                style={{
                  borderColor: feature.accent,
                  color: feature.accent,
                  background: feature.accentLight,
                }}
              >
                Open {feature.title} →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-1 h-4 rounded-full" style={{ background: "var(--teal)" }} />
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--navy)" }}>
            How it works
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Submit records",
              description: "Provide conflicting medication records or a patient record from any number of healthcare systems.",
            },
            {
              step: "02",
              title: "AI analysis",
              description: "Claude evaluates source reliability, recency, clinical context, and plausibility to reason through the data.",
            },
            {
              step: "03",
              title: "Review & act",
              description: "Receive a scored result with clinical reasoning, recommended actions, and a safety check to approve or reject.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 card-lift">
              <span className="font-display text-3xl font-semibold block mb-3"
                style={{ color: "var(--teal)", opacity: 0.4 }}>
                {item.step}
              </span>
              <h4 className="text-sm font-semibold mb-1.5" style={{ color: "var(--navy)" }}>
                {item.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "var(--slate)" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center pb-4">
        <p className="text-xs" style={{ color: "var(--slate)" }}>
          Built with Spring Boot, React, MySQL, and Anthropic Claude ·{" "}
          <a
            href="https://github.com/msanchez3757/CDRE"
            target="_blank"
            rel="noreferrer"
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: "var(--teal)" }}
          >
            View on GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
