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

const inputClass = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-white transition-all placeholder:text-slate-300";
const labelClass = "block text-xs font-medium mb-1.5" ;

export { inputClass, labelClass };

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

  const handlePatientChange = (e) =>
    setPatientContext({ ...patientContext, [e.target.name]: e.target.value });

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

      {/* Page title */}
      <div>
        <h2 className="font-display text-2xl font-semibold" style={{ color: "var(--navy)" }}>
          Medication Reconciliation
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>
          Enter conflicting medication records from multiple sources to receive an AI-powered reconciliation.
        </p>
      </div>

      {/* Patient Context Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 card-lift">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-4 rounded-full" style={{ background: "var(--teal)" }} />
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--navy)" }}>
            Patient Context
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ color: "var(--slate)" }}>Age</label>
            <input
              type="number"
              name="age"
              value={patientContext.age}
              onChange={handlePatientChange}
              className={inputClass}
              placeholder="67"
            />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--slate)" }}>
              Conditions <span className="font-normal opacity-60">(comma separated)</span>
            </label>
            <input
              type="text"
              name="conditions"
              value={patientContext.conditions}
              onChange={handlePatientChange}
              className={inputClass}
              placeholder="Type 2 Diabetes, Hypertension"
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass} style={{ color: "var(--slate)" }}>
              Recent Labs <span className="font-normal opacity-60">(e.g. eGFR: 45, HbA1c: 7.2)</span>
            </label>
            <input
              type="text"
              name="recent_labs"
              value={patientContext.recent_labs}
              onChange={handlePatientChange}
              className={inputClass}
              placeholder="eGFR: 45, HbA1c: 7.2"
            />
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ background: "var(--teal)" }} />
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--navy)" }}>
            Medication Sources
          </h3>
        </div>
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
          className="text-sm font-medium flex items-center gap-1.5 px-4 py-2 rounded-lg border border-dashed border-slate-300 hover:border-teal-400 transition-colors w-full justify-center"
          style={{ color: "var(--slate)" }}
        >
          <span className="text-lg leading-none">+</span> Add another source
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex gap-2 items-start">
          <span className="mt-0.5">⚠</span>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full text-white font-medium py-3 rounded-xl text-sm transition-all relative overflow-hidden"
        style={{
          background: loading ? "var(--slate)" : "var(--navy)",
          boxShadow: loading ? "none" : "0 4px 14px rgba(11,31,58,0.25)",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Reconciling...
          </span>
        ) : (
          "Reconcile Medication"
        )}
      </button>

      {result && <ReconciliationResult result={result} />}
    </div>
  );
}
