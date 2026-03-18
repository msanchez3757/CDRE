export default function SourceForm({ index, source, onChange, onRemove, canRemove }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">
          Source {index + 1}
        </span>
        {canRemove && (
          <button
            onClick={() => onRemove(index)}
            className="text-xs text-red-500 hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">System</label>
          <input
            type="text"
            value={source.system}
            onChange={(e) => onChange(index, "system", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Hospital EHR"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Reliability</label>
          <select
            value={source.source_reliability}
            onChange={(e) => onChange(index, "source_reliability", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Medication</label>
          <input
            type="text"
            value={source.medication}
            onChange={(e) => onChange(index, "medication", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Metformin 500mg twice daily"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Last Updated</label>
          <input
            type="date"
            value={source.last_updated}
            onChange={(e) => onChange(index, "last_updated", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Last Filled (pharmacy only)
          </label>
          <input
            type="date"
            value={source.last_filled}
            onChange={(e) => onChange(index, "last_filled", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
