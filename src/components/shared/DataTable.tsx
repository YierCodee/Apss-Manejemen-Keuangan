interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
  }[];
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
}: DataTableProps<T>) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t border-border">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm">
                  {col.render
                    ? col.render(item)
                    : String(item[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
