import Card from "./Card";

// Cycled by column index so a row's bars don't line up into a uniform grid.
const BAR_WIDTHS = ["w-3/4", "w-1/2", "w-5/6", "w-2/3", "w-1/3", "w-4/5"];

const SkeletonTable = ({ columns, rows = 6, actionsColumn = false }) => {
  const dataColumns = actionsColumn ? columns - 1 : columns;

  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-brand-blue border-b border-brand-blue-pale">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="py-3 px-2">
                <div
                  className={`h-3 rounded bg-brand-blue-pale animate-pulse ${BAR_WIDTHS[i % BAR_WIDTHS.length]}`}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b border-brand-blue-pale/60">
              {Array.from({ length: dataColumns }).map((_, c) => (
                <td key={c} className="py-3 px-2">
                  <div
                    className={`h-3 rounded bg-brand-blue-pale animate-pulse ${BAR_WIDTHS[(r + c) % BAR_WIDTHS.length]}`}
                  />
                </td>
              ))}
              {actionsColumn && (
                <td className="py-3 px-2">
                  <div className="h-6 w-16 rounded-full bg-brand-blue-pale animate-pulse" />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default SkeletonTable;
