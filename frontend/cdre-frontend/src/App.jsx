import { useState } from "react";
import HomePage from "./components/HomePage";
import ReconciliationTab from "./components/ReconciliationTab";
import DataQualityTab from "./components/DataQualityTab";

const tabs = [
  { id: "home", label: "Home" },
  { id: "reconciliation", label: "Medication Reconciliation" },
  { id: "dataQuality", label: "Data Quality Validation" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen grid-bg">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-8 py-5 flex items-center gap-4">
          <button
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "var(--navy)" }}>
              <div className="w-3 h-3 rounded-sm" style={{ background: "var(--teal)" }} />
            </div>
            <div className="text-left">
              <h1 className="font-display text-xl font-semibold leading-tight"
                style={{ color: "var(--navy)" }}>
                Clinical Data Reconciliation Engine
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--slate)" }}>
                AI-powered medication reconciliation &amp; data quality validation
              </p>
            </div>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-5xl mx-auto px-8">
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id ? "tab-active" : "hover:text-slate-700"
                }`}
                style={{
                  color: activeTab === tab.id ? "var(--teal)" : "var(--slate)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 py-10">
        {activeTab === "home" && (
          <HomePage onNavigate={setActiveTab} />
        )}
        {activeTab === "reconciliation" && (
          <ReconciliationTab />
        )}
        {activeTab === "dataQuality" && (
          <DataQualityTab />
        )}
      </main>
    </div>
  );
}
