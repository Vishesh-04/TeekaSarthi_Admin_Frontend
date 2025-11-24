export function toCSV(rows = [], headers = []) {
  const cols = headers.length ? headers : Object.keys(rows[0] || {})
  const lines = [cols.join(',')]
  rows.forEach((r) => {
    lines.push(cols.map((c) => `"${(r[c] ?? '').toString().replace(/"/g, '""')}"`).join(','))
  })
  return lines.join('\n')
}
