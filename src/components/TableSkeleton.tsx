export default function TableSkeleton({
  rowSize = 1,
  columnSize = 1,
}: {
  rowSize: number;
  columnSize: number;
}) {
  return (
    <>
      {[...Array(rowSize)].map((r, ri) => (
        <tr key={ri}>
          {[...Array(columnSize)].map((c, ci) => (
            <td
              key={ci}
              className="whitespace-nowrap p-4 text-sm text-gray-900"
            >
              <div role="status" className="max-w-sm animate-pulse">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
