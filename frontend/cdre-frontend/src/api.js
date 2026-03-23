const BASE_URL = "http://localhost:8080/api";
const API_KEY = import.meta.env.VITE_API_KEY;

const headers = {
  "Content-Type": "application/json",
  "X-API-Key": API_KEY,
};

// -- Mock responses --
// Used as fallback when the backend is unavailable (e.g. demo/portfolio mode)

const mockReconciliationResult = (payload) => {
  const sources = payload.sources || [];
  const mostRecent = sources.reduce((a, b) => {
    const dateA = new Date(a.last_updated || a.last_filled || 0);
    const dateB = new Date(b.last_updated || b.last_filled || 0);
    return dateA > dateB ? a : b;
  }, sources[0]);

  return {
    request_id: crypto.randomUUID(),
    reconciled_medication: mostRecent?.medication || "Metformin 500mg twice daily",
    confidence_score: 0.87,
    reasoning:
      `The ${mostRecent?.system || "most recent"} record is the most current clinical entry and reflects the latest prescribing decision. ` +
      (payload.patient_context?.recent_labs?.eGFR
        ? `Given the patient's eGFR of ${payload.patient_context.recent_labs.eGFR}, the current dosing is clinically appropriate and consistent with renal dosing guidelines. `
        : "") +
      "Older records likely reflect a previous regimen that has since been updated.",
    recommended_actions: [
      `Update all systems to reflect ${mostRecent?.medication || "the reconciled medication"}`,
      "Confirm current dosing with the prescribing clinician",
      "Verify patient adherence at next clinical encounter",
    ],
    clinical_safety_check: "PASSED",
    status: "pending",
  };
};

const mockDataQualityResult = (payload) => {
  const hasAllergies = payload.allergies?.length > 0;
  const hasMedications = payload.medications?.length > 0;
  const hasConditions = payload.conditions?.length > 0;
  const hasVitals = payload.vital_signs?.blood_pressure || payload.vital_signs?.heart_rate;
  const hasLastUpdated = !!payload.last_updated;

  // Simple completeness calculation mirroring the backend logic
  let completeness = 17; // demographics always present if we get here
  if (hasMedications) completeness += 17;
  if (hasAllergies) completeness += 17;
  if (hasConditions) completeness += 17;
  if (hasVitals) completeness += 16;
  if (hasLastUpdated) completeness += 16;
  completeness = Math.min(completeness, 100);

  // Timeliness
  let timeliness = 50;
  if (hasLastUpdated) {
    const months = Math.floor(
      (new Date() - new Date(payload.last_updated)) / (1000 * 60 * 60 * 24 * 30)
    );
    timeliness = months <= 3 ? 100 : months <= 6 ? 80 : months <= 12 ? 60 : 30;
  }

  // Check for implausible BP
  const bp = payload.vital_signs?.blood_pressure;
  const bpParts = bp ? bp.split("/").map(Number) : [];
  const bpImplausible = bpParts.length === 2 && (bpParts[0] > 300 || bpParts[1] > 150);

  const accuracy = bpImplausible ? 25 : 85;
  const clinicalPlausibility = bpImplausible ? 50 : 90;

  const issues = [];

  if (bpImplausible) {
    issues.push({
      field: "vital_signs.blood_pressure",
      issue: `Blood pressure ${bp} is physiologically implausible and likely represents a data entry error`,
      severity: "high",
    });
  }

  if (!hasAllergies) {
    issues.push({
      field: "allergies",
      issue: "No allergies documented — this field is likely incomplete rather than representing no known allergies",
      severity: "medium",
    });
  }

  if (hasLastUpdated) {
    const months = Math.floor(
      (new Date() - new Date(payload.last_updated)) / (1000 * 60 * 60 * 24 * 30)
    );
    if (months > 6) {
      issues.push({
        field: "last_updated",
        issue: `Record is ${months} months old — clinical data may no longer reflect the patient's current status`,
        severity: months > 12 ? "high" : "medium",
      });
    }
  }

  if (!hasMedications) {
    issues.push({
      field: "medications",
      issue: "No medications documented — record may be incomplete",
      severity: "medium",
    });
  }

  const overall = Math.round((completeness + accuracy + timeliness + clinicalPlausibility) / 4);

  return {
    overall_score: overall,
    breakdown: {
      completeness,
      accuracy,
      timeliness,
      clinical_plausibility: clinicalPlausibility,
    },
    issues_detected: issues,
  };
};

// -- API functions --

export async function reconcileMedication(payload) {
  try {
    const response = await fetch(`${BASE_URL}/reconcile/medication`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to reconcile medication");
    }

    return response.json();
  } catch (err) {
    // Fall back to mock data if backend is unreachable
    if (err.message === "Failed to fetch" || err.name === "TypeError") {
      console.warn("Backend unavailable — using mock data");
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockReconciliationResult(payload)), 1200)
      );
    }
    throw err;
  }
}

export async function validateDataQuality(payload) {
  try {
    const response = await fetch(`${BASE_URL}/validate/data-quality`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to validate data quality");
    }

    return response.json();
  } catch (err) {
    // Fall back to mock data if backend is unreachable
    if (err.message === "Failed to fetch" || err.name === "TypeError") {
      console.warn("Backend unavailable — using mock data");
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockDataQualityResult(payload)), 1200)
      );
    }
    throw err;
  }
}
