import { useState } from "react";
import DataQualityResult from "./DataQualityResult";
import { validateDataQuality } from "../api";

export default function DataQualityTab() {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    medications: "",
    allergies: "",
    conditions: "",
    blood_pressure: "",
    heart_rate: "",
    last_updated: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const payload = {
        demographics: {
          name: form.name,
          dob: form.dob,
          gender: form.gender,
        },
        medications: form.medications
          ? form.medications.split(",").map((m) => m.trim())
          : [],
        allergies: form.allergies
          ? form.allergies.split(",").map((a) => a.trim())
          : [],
        conditions: form.conditions
          ? form.conditions.split(",").map((c) => c.trim())
          : [],
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Data Quality Validation
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Submit a patient record to evaluate its data quality across multiple dimensions.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">

        {/* Demographics */}
        <h3 className="font-medium text-gray-700">Demographics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
        </div>

        {/* Clinical Info */}
        <h3 className="font-medium text-gray-700 pt-2">Clinical Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Medications (comma separated)
            </label>
            <input
              type="text"
              name="medications"
              value={form.medications}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Metformin 500mg, Lisinopril 10mg"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Allergies (comma separated)
            </label>
            <input
              type="text"
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Penicillin, Sulfa"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-gray-500 mb-1">
              Conditions (comma separated)
            </label>
            <input
              type="text"
              name="conditions"
              value={form.conditions}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type 2 Diabetes, Hypertension"
            />
          </div>
        </div>

        {/* Vital Signs */}
        <h3 className="font-medium text-gray-700 pt-2">Vital Signs</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Blood Pressure (e.g. 120/80)
            </label>
            <input
              type="text"
              name="blood_pressure"
              value={form.blood_pressure}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="120/80"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Heart Rate (bpm)</label>
            <input
              type="number"
              name="heart_rate"
              value={form.heart_rate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="72"
            />
          </div>
        </div>

        {/* Last Updated */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Last Updated</label>
          <input
            type="date"
            name="last_updated"
            value={form.last_updated}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
        {loading ? "Validating..." : "Validate Data Quality"}
      </button>

      {/* Result */}
      {result && <DataQualityResult result={result} />}
    </div>
  );
}
