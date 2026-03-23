import { useState } from "react";

const safetyConfig = {
  PASSED: { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", dot: "#22C55E", label: "Passed" },
  WARNING: { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309", dot: "#F59E0B", label: "Warning" },
  FAILED: { bg: "#FEF2F2", border: "#FECACA", text: "#B91C1C", dot: "#EF4444", label: "Failed" },
};

const statusConfig = {
  approved: { bg: "#F0FDF4", text: "#15803D", label: "Approved" },
  rejected: { bg: "#FEF2F2", text: "#B91C1C", label: "Rejected" },
  pending: { bg: "#F8FAFC", text: "#64748B", label: "Pending Review" },
};

export default function ReconciliationResult({ result }) {
  const [reviewStatus, setReviewStatus] = useState(result.status);
  const confidencePercent = Math.round(result.confidence_score * 100);
  const safety = safetyConfig[result.clinical_safety_check] || safetyConfig.WARNING;
  const status = statusConfig[reviewStatus] || statusConfig.pending;

  const barColor =
    confidencePercent >= 80 ? "#22C55E" :
    confidencePercent >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden card-lift">

      {/* Result header */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center"
        style={{ background: "var(--navy)" }}>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest opacity-60 text-white mb-1">
            Reconciled Medication
          </p>
          <p className="font-display text-xl font-semibold text-white">
            {result.reconciled_medication}
          </p>
        </div>
        <span className="text-xs font-medium px-3 py-1.5 rounded-full"
          style={{ background: status.bg, color: status.text }}>
          {status.label}
        </span>
      </div>

      <div className="p-6 space-y-6">

        {/* Confidence + Safety row */}
        <div className="grid grid-cols-2 gap-4">

          {/* Confidence Score */}
          <div className="rounded-xl p-4 border border-slate-100" style={{ background: "var(--surface)" }}>
            <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: "var(--slate)" }}>
              Confidence Score
            </p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-semibold font-display leading-none" style={{ color: "var(--navy)" }}>
                {confidencePercent}
              </span>
              <span className="text-sm mb-0.5" style={{ color: "var(--slate)" }}>/ 100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${confidencePercent}%`, background: barColor }}
              />
            </div>
          </div>

          {/* Safety Check */}
          <div className="rounded-xl p-4 border"
            style={{ background: safety.bg, borderColor: safety.border }}>
            <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: safety.text, opacity: 0.7 }}>
              Clinical Safety
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: safety.dot }} />
              <span className="text-lg font-semibold font-display" style={{ color: safety.text }}>
                {safety.label}
              </span>
            </div>
          </div>
        </div>

        {/* Reasoning */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "var(--slate)" }}>
            Clinical Reasoning
          </p>
          <p className="text-sm leading-relaxed rounded-xl px-4 py-3.5 border border-slate-100"
            style={{ background: "var(--surface)", color: "var(--navy)" }}>
            {result.reasoning}
          </p>
        </div>

        {/* Recommended Actions */}
        {result.recommended_actions?.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: "var(--slate)" }}>
              Recommended Actions
            </p>
            <ul className="space-y-2">
              {result.recommended_actions.map((action, i) => (
                <li key={i} className="flex gap-3 text-sm items-start">
                  <span className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold"
                    style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
                    {i + 1}
                  </span>
                  <span style={{ color: "var(--navy)" }}>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Approve / Reject */}
        {reviewStatus === "pending" && (
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => setReviewStatus("approved")}
              className="flex-1 text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
              style={{
                background: "#15803D",
                boxShadow: "0 2px 8px rgba(21,128,61,0.25)",
              }}
            >
              Approve
            </button>
            <button
              onClick={() => setReviewStatus("rejected")}
              className="flex-1 text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
              style={{
                background: "#B91C1C",
                boxShadow: "0 2px 8px rgba(185,28,28,0.25)",
              }}
            >
              Reject
            </button>
          </div>
        )}

        {/* Post-review state */}
        {reviewStatus !== "pending" && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--slate)" }}>
              Review decision recorded
            </p>
            <button
              onClick={() => setReviewStatus("pending")}
              className="text-xs font-medium underline"
              style={{ color: "var(--slate)" }}
            >
              Undo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
