interface ComparisonRow {
  feature: string;
  left: string;
  right: string;
}

interface ComparisonTableProps {
  rows: ComparisonRow[];
  leftLabel?: string;
  rightLabel?: string;
  featureLabel?: string;
}

export function ComparisonTable({
  rows,
  leftLabel = "",
  rightLabel = "",
  featureLabel = "Característica",
}: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
              {featureLabel}
            </th>
            <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
              {leftLabel}
            </th>
            <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
              {rightLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                {row.feature}
              </td>
              <td className="px-4 py-3 text-gray-700">{row.left}</td>
              <td className="px-4 py-3 text-gray-700">{row.right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
