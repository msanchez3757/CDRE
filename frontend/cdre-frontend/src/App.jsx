import { useState } from "react";
import ReconciliationTab from "./components/ReconciliationTab";
import DataQualityTab from "./components/DataQualityTab";

export default function App() {
  const [activeTab, setActiveTab] = useState("reconciliation");

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Clinical Data Reconciliation Engine
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          AI-powered medication reconciliation and data quality validation
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab("reconciliation")}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "reconciliation"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Medication Reconciliation
          </button>
          <button
            onClick={() => setActiveTab("dataQuality")}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "dataQuality"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Data Quality Validation
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {activeTab === "reconciliation" ? (
          <ReconciliationTab />
        ) : (
          <DataQualityTab />
        )}
      </main>
    </div>
  );
}
