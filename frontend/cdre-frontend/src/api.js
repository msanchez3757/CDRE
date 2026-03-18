const BASE_URL = "http://localhost:8080/api";
const API_KEY = import.meta.env.VITE_API_KEY;

const headers = {
  "Content-Type": "application/json",
  "X-API-Key": API_KEY,
};

export async function reconcileMedication(payload) {
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
}

export async function validateDataQuality(payload) {
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
}
