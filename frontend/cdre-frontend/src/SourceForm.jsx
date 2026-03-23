const inputClass = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-white transition-all placeholder:text-slate-300";

export default function SourceForm({ index, source, onChange, onRemove, canRemove }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 card-lift">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md text-xs font-semibold flex items-center justify-center"
            style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
            {index + 1}
          </span>
          <span className="text-sm font-medium" style={{ color: "var(--navy)" }}>
            Source {index + 1}
          </span>
        </div>
        {canRemove && (
          <button
            onClick={() => onRemove(index)}
            className="text-xs font-medium px-2.5 py-1 rounded-md border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--slate)" }}>System</label>
          <input
            type="text"
            value={source.system}
            onChange={(e) => onChange(index, "system", e.target.value)}
            className={inputClass}
            placeholder="Hospital EHR"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--slate)" }}>Reliability</label>
          <select
            value={source.source_reliability}
            onChange={(e) => onChange(index, "source_reliability", e.target.value)}
            className={inputClass}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--slate)" }}>Medication</label>
          <input
            type="text"
            value={source.medication}
            onChange={(e) => onChange(index, "medication", e.target.value)}
            className={inputClass}
            placeholder="Metformin 500mg twice daily"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--slate)" }}>Last Updated</label>
          <input
            type="date"
            value={source.last_updated}
            onChange={(e) => onChange(index, "last_updated", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--slate)" }}>
            Last Filled <span className="font-normal opacity-60">(pharmacy)</span>
          </label>
          <input
            type="date"
            value={source.last_filled}
            onChange={(e) => onChange(index, "last_filled", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
