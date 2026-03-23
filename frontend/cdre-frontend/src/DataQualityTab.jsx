import { useState } from "react";
import DataQualityResult from "./DataQualityResult";
import { validateDataQuality } from "../api";

const inputClass = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-white transition-all placeholder:text-slate-300";
const labelClass = "block text-xs font-medium mb-1.5";

export default function DataQualityTab() {
  const [form, setForm] = useState({
    name: "", dob: "", gender: "",
    medications: "", allergies: "", conditions: "",
    blood_pressure: "", heart_rate: "", last_updated: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const payload = {
        demographics: { name: form.name, dob: form.dob, gender: form.gender },
        medications: form.medications ? form.medications.split(",").map((m) => m.trim()) : [],
        allergies: form.allergies ? form.allergies.split(",").map((a) => a.trim()) : [],
        conditions: form.conditions ? form.conditions.split(",").map((c) => c.trim()) : [],
        vital_signs: {
          blood_pressure: form.blood_pressure || null,
          heart_rate: form.heart_rate ? parseInt(form.heart_rate) : null,
        },
        last_updated: form.last_updated || null,
      };
      const data = await validateDataQuality(payload);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ title }) => (
    <div className="flex items-center gap-2 mb-4 mt-2">
      <div className="w-1 h-4 rounded-full" style={{ background: "var(--teal)" }} />
      <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--navy)" }}>
        {title}
      </h3>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold" style={{ color: "var(--navy)" }}>
          Data Quality Validation
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>
          Submit a patient record to evaluate its quality across completeness, accuracy, timeliness, and clinical plausibility.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 card-lift space-y-2">

        <Section title="Demographics" />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelClass} style={{ color: "var(--slate)" }}>Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              className={inputClass} placeholder="John Doe" />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--slate)" }}>Date of Birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange}
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--slate)" }}>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
        </div>

        <Section title="Clinical Information" />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass} style={{ color: "var(--slate)" }}>
              Medications <span className="font-normal opacity-60">(comma separated)</span>
            </label>
            <input type="text" name="medications" value={form.medications} onChange={handleChange}
              className={inputClass} placeholder="Metformin 500mg, Lisinopril 10mg" />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--slate)" }}>
              Allergies <span className="font-normal opacity-60">(comma separated)</span>
            </label>
            <input type="text" name="allergies" value={form.allergies} onChange={handleChange}
              className={inputClass} placeholder="Penicillin, Sulfa" />
          </div>
          <div className="col-span-2">
            <label className={labelClass} style={{ color: "var(--slate)" }}>
              Conditions <span className="font-normal opacity-60">(comma separated)</span>
            </label>
            <input type="text" name="conditions" value={form.conditions} onChange={handleChange}
              className={inputClass} placeholder="Type 2 Diabetes, Hypertension" />
          </div>
        </div>

        <Section title="Vital Signs" />
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass} style={{ color: "var(--slate)" }}>Blood Pressure</label>
            <input type="text" name="blood_pressure" value={form.blood_pressure} onChange={handleChange}
              className={inputClass} placeholder="120/80" />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--slate)" }}>Heart Rate (bpm)</label>
            <input type="number" name="heart_rate" value={form.heart_rate} onChange={handleChange}
              className={inputClass} placeholder="72" />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--slate)" }}>Last Updated</label>
            <input type="date" name="last_updated" value={form.last_updated} onChange={handleChange}
              className={inputClass} />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex gap-2 items-start">
          <span className="mt-0.5">⚠</span>
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full text-white font-medium py-3 rounded-xl text-sm transition-all"
        style={{
          background: loading ? "var(--slate)" : "var(--navy)",
          boxShadow: loading ? "none" : "0 4px 14px rgba(11,31,58,0.25)",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Validating...
          </span>
        ) : (
          "Validate Data Quality"
        )}
      </button>

      {result && <DataQualityResult result={result} />}
    </div>
  );
}
