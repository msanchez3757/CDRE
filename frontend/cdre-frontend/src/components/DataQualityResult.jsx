const getScoreColor = (score) => {
  if (score >= 75) return { bar: "bg-green-500", text: "text-green-700", bg: "bg-green-50 border-green-200" };
  if (score >= 50) return { bar: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" };
  return { bar: "bg-red-500", text: "text-red-700", bg: "bg-red-50 border-red-200" };
};

const severityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
};

const dimensionLabels = {
  completeness: "Completeness",
  accuracy: "Accuracy",
  timeliness: "Timeliness",
  clinical_plausibility: "Clinical Plausibility",
};

export default function DataQualityResult({ result }) {
  const overallColor = getScoreColor(result.overall_score);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-5">
      <h3 className="font-semibold text-gray-800">Data Quality Report</h3>

      {/* Overall Score */}
      <div className={`rounded-md border px-4 py-3 ${overallColor.bg}`}>
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${overallColor.text}`}>
            Overall Score
          </span>
          <span className={`text-2xl font-bold ${overallColor.text}`}>
            {result.overall_score}
            <span className="text-sm font-normal">/100</span>
          </span>
        </div>
        <div className="w-full bg-white bg-opacity-60 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${overallColor.bar} transition-all`}
            style={{ width: `${result.overall_score}%` }}
          />
        </div>
      </div>

      {/* Dimension Breakdown */}
      <div>
        <p className="text-sm text-gray-600 mb-3">Score Breakdown</p>
        <div className="space-y-3">
          {Object.entries(result.breakdown).map(([key, score]) => {
            const color = getScoreColor(score);
            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{dimensionLabels[key] || key}</span>
                  <span className={`font-medium ${color.text}`}>{score}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${color.bar} transition-all`}
                    style={{ width: `${score}%` }}
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
          <p className="text-sm text-gray-600 mb-3">
            Issues Detected ({result.issues_detected.length})
          </p>
          <div className="space-y-2">
            {result.issues_detected.map((issue, i) => (
              <div
                key={i}
                className="flex gap-3 items-start bg-gray-50 rounded-md px-3 py-2.5"
              >
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded border capitalize shrink-0 mt-0.5 ${
                    severityColors[issue.severity] || severityColors.low
                  }`}
                >
                  {issue.severity}
                </span>
                <div>
                  <p className="text-xs font-medium text-gray-500">{issue.field}</p>
                  <p className="text-sm text-gray-700">{issue.issue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
