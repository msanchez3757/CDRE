import { useState } from "react";

const safetyColors = {
  PASSED: "bg-green-100 text-green-700 border-green-200",
  WARNING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  FAILED: "bg-red-100 text-red-700 border-red-200",
};

const statusColors = {
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  pending: "bg-gray-100 text-gray-600",
};

export default function ReconciliationResult({ result }) {
  const [reviewStatus, setReviewStatus] = useState(result.status);

  const confidencePercent = Math.round(result.confidence_score * 100);

  const confidenceColor =
    confidencePercent >= 80
      ? "bg-green-500"
      : confidencePercent >= 60
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-5">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-800">Reconciliation Result</h3>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[reviewStatus]}`}
        >
          {reviewStatus}
        </span>
      </div>

      {/* Reconciled Medication */}
      <div className="bg-blue-50 border border-blue-100 rounded-md px-4 py-3">
        <p className="text-xs text-blue-500 font-medium uppercase tracking-wide mb-1">
          Reconciled Medication
        </p>
        <p className="text-lg font-semibold text-blue-800">
          {result.reconciled_medication}
        </p>
      </div>

      {/* Confidence Score */}
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-600">Confidence Score</span>
          <span className="font-medium text-gray-800">{confidencePercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${confidenceColor} transition-all`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Safety Check */}
      <div>
        <p className="text-sm text-gray-600 mb-1.5">Clinical Safety Check</p>
        <span
          className={`inline-block text-sm font-medium px-3 py-1 rounded-md border ${
            safetyColors[result.clinical_safety_check]
          }`}
        >
          {result.clinical_safety_check}
        </span>
      </div>

      {/* Reasoning */}
      <div>
        <p className="text-sm text-gray-600 mb-1.5">Reasoning</p>
        <p className="text-sm text-gray-700 bg-gray-50 rounded-md px-4 py-3 leading-relaxed">
          {result.reasoning}
        </p>
      </div>

      {/* Recommended Actions */}
      {result.recommended_actions?.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-1.5">Recommended Actions</p>
          <ul className="space-y-1.5">
            {result.recommended_actions.map((action, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-blue-500 mt-0.5">•</span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Approve / Reject */}
      {reviewStatus === "pending" && (
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button
            onClick={() => setReviewStatus("approved")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => setReviewStatus("rejected")}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
