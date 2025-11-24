import React from 'react'

export default function DataTable({ columns = [], data = [], actions }) {
  return (
    <div className="rounded-xl overflow-auto bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-2 text-left text-xs text-gray-500">
                {c.title}
              </th>
            ))}
            {actions && <th className="px-4 py-2 text-left text-xs text-gray-500">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx} className="border-t last:border-b">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-sm text-gray-700">
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
              {actions && <td className="px-4 py-3">{actions(row)}</td>}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-8 text-center text-gray-400">
                No records
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
