function DataTable({ columns = [], rows = [], emptyLabel = "No records found." }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--accent-pink)]/10 bg-[var(--surface)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface)] text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-16 text-center text-[var(--text-muted)]">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="text-3xl" role="img" aria-label="No data">📭</span>
                    <p className="max-w-md mx-auto text-sm leading-relaxed">{emptyLabel}</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={row._id || index}
                  className="border-t border-[var(--accent-pink)]/10 transition-all duration-200 hover:bg-[var(--accent-pink)]/[0.04]"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-5 py-3.5 align-top text-[var(--text-secondary)]">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
