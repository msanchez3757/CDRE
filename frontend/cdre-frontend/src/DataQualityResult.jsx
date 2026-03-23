const getScoreConfig = (score) => {
  if (score >= 75) return { color: "#22C55E", bg: "#F0FDF4", text: "#15803D", label: "Good" };
  if (score >= 50) return { color: "#F59E0B", bg: "#FFFBEB", text: "#B45309", label: "Fair" };
  return { color: "#EF4444", bg: "#FEF2F2", text: "#B91C1C", label: "Poor" };
};

const severityConfig = {
  high: { bg: "#FEF2F2", border: "#FECACA", text: "#B91C1C", dot: "#EF4444" },
  medium: { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309", dot: "#F59E0B" },
  low: { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8", dot: "#3B82F6" },
};

const dimensionLabels = {
  completeness: "Completeness",
  accuracy: "Accuracy",
  timeliness: "Timeliness",
  clinical_plausibility: "Clinical Plausibility",
};

export default function DataQualityResult({ result }) {
  const overall = getScoreConfig(result.overall_score);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden card-lift">

      {/* Overall score header */}
      <div className="px-6 py-5 border-b border-slate-100"
        style={{ background: overall.bg }}>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-1"
              style={{ color: overall.text, opacity: 0.7 }}>
              Overall Quality Score
            </p>
            <div className="flex items-end gap-1.5">
              <span className="font-display text-4xl font-semibold leading-none"
                style={{ color: overall.text }}>
                {result.overall_score}
              </span>
              <span className="text-sm mb-1" style={{ color: overall.text, opacity: 0.6 }}>/100</span>
            </div>
          </div>
          <span className="text-sm font-semibold px-4 py-1.5 rounded-full text-white"
            style={{ background: overall.color }}>
            {overall.label}
          </span>
        </div>
        <div className="w-full rounded-full h-2" style={{ background: "rgba(0,0,0,0.08)" }}>
          <div
            className="score-bar h-2 rounded-full"
            style={{
              "--target-width": `${result.overall_score}%`,
              background: overall.color,
              "--delay": "100ms",
            }}
          />
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* Score Breakdown */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide mb-4" style={{ color: "var(--slate)" }}>
            Score Breakdown
          </p>
          <div className="space-y-4">
            {Object.entries(result.breakdown).map(([key, score], i) => {
              const config = getScoreConfig(score);
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium" style={{ color: "var(--navy)" }}>
                      {dimensionLabels[key] || key}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md"
                        style={{ background: config.bg, color: config.text }}>
                        {config.label}
                      </span>
                      <span className="text-sm font-semibold w-8 text-right"
                        style={{ color: config.text }}>
                        {score}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="score-bar h-1.5 rounded-full"
                      style={{
                        "--target-width": `${score}%`,
                        background: config.color,
                        "--delay": `${(i + 1) * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Issues Detected */}
        {result.issues_detected?.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: "var(--slate)" }}>
              Issues Detected
              <span className="ml-2 px-1.5 py-0.5 rounded text-xs font-semibold"
                style={{ background: "var(--surface)", color: "var(--slate)" }}>
                {result.issues_detected.length}
              </span>
            </p>
            <div className="space-y-2">
              {result.issues_detected.map((issue, i) => {
                const sev = severityConfig[issue.severity] || severityConfig.low;
                return (
                  <div key={i} className="flex gap-3 items-start rounded-xl p-3.5 border"
                    style={{ background: sev.bg, borderColor: sev.border }}>
                    <span className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                      style={{ background: sev.dot }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color: sev.text }}>
                          {issue.field}
                        </p>
                        <span className="text-xs font-medium capitalize shrink-0"
                          style={{ color: sev.text }}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: "var(--navy)" }}>
                        {issue.issue}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
