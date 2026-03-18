import { useState } from "react";
import SourceForm from "./SourceForm";
import ReconciliationResult from "./ReconciliationResult";
import { reconcileMedication } from "../api";

const defaultSource = () => ({
  system: "",
  medication: "",
  last_updated: "",
  last_filled: "",
  source_reliability: "high",
});

export default function ReconciliationTab() {
  const [patientContext, setPatientContext] = useState({
    age: "",
    conditions: "",
    recent_labs: "",
  });
  const [sources, setSources] = useState([defaultSource(), defaultSource()]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePatientChange = (e) => {
    setPatientContext({ ...patientContext, [e.target.name]: e.target.value });
  };

  const handleSourceChange = (index, field, value) => {
    const updated = [...sources];
    updated[index] = { ...updated[index], [field]: value };
    setSources(updated);
  };

  const addSource = () => setSources([...sources, defaultSource()]);

  const removeSource = (index) => {
    if (sources.length <= 2) return;
    setSources(sources.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      // Parse recent_labs from "eGFR: 45, HbA1c: 7.2" string into object
      const recentLabs = patientContext.recent_labs
        ? Object.fromEntries(
            patientContext.recent_labs.split(",").map((entry) => {
              const [key, value] = entry.split(":").map((s) => s.trim());
              return [key, isNaN(value) ? value : Number(value)];
            })
          )
        : {};

      const payload = {
        patient_context: {
          age: parseInt(patientContext.age),
          conditions: patientContext.conditions
            ? patientContext.conditions.split(",").map((c) => c.trim())
            : [],
          recent_labs: recentLabs,
        },
        sources: sources.map((s) => ({
          system: s.system,
          medication: s.medication,
          source_reliability: s.source_reliability,
          ...(s.last_updated && { last_updated: s.last_updated }),
          ...(s.last_filled && { last_filled: s.last_filled }),
        })),
      };

      const data = await reconcileMedication(payload);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Medication Reconciliation
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter conflicting medication records to get an AI-powered reconciliation.
        </p>
      </div>

      {/* Patient Context */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
        <h3 className="font-medium text-gray-700">Patient Context</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={patientContext.age}
              onChange={handlePatientChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="67"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Conditions (comma separated)
            </label>
            <input
              type="text"
              name="conditions"
              value={patientContext.conditions}
              onChange={handlePatientChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type 2 Diabetes, Hypertension"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-1">
              Recent Labs (e.g. eGFR: 45, HbA1c: 7.2)
            </label>
            <input
              type="text"
              name="recent_labs"
              value={patientContext.recent_labs}
              onChange={handlePatientChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="eGFR: 45, HbA1c: 7.2"
            />
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-700">Medication Sources</h3>
        {sources.map((source, index) => (
          <SourceForm
            key={index}
            index={index}
            source={source}
            onChange={handleSourceChange}
            onRemove={removeSource}
            canRemove={sources.length > 2}
          />
        ))}
        <button
          onClick={addSource}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Add another source
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 rounded-md text-sm transition-colors"
      >
        {loading ? "Reconciling..." : "Reconcile Medication"}
      </button>

      {/* Result */}
      {result && <ReconciliationResult result={result} />}
    </div>
  );
}
