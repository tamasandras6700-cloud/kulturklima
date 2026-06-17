/**
 * Escape a cell value for RFC 4180-style CSV (UTF-8 with BOM for Excel).
 */
export function escapeCsvCell(value: unknown): string {
  if (value == null) return ''
  const str = String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function rowsToCsv(
  headers: string[],
  rows: Record<string, string | number | null | undefined>[],
): string {
  const headerLine = headers.map(escapeCsvCell).join(',')
  const dataLines = rows.map((row) =>
    headers.map((key) => escapeCsvCell(row[key])).join(','),
  )
  return [headerLine, ...dataLines].join('\r\n')
}

export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob(['\uFEFF', csvContent], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function slugifyFilename(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}
