/**
 * @typedef {Record<string, string | number | null>} StatRecord
 */

/**
 * Ordered dimension codes for a JSON-stat dataset dimension.
 * @param {{ category: { index: Record<string, number> } }} dimension
 * @returns {string[]}
 */
function orderedCodes(dimension) {
  return Object.entries(dimension.category.index)
    .sort(([, a], [, b]) => a - b)
    .map(([code]) => code)
}

/**
 * Flattens a JSON-stat 2.0 dataset into row objects keyed by dimension id.
 *
 * @param {object} jsonStatResponse — full API response ({ dataset: ... } or dataset root)
 * @returns {StatRecord[]}
 */
export function jsonStatToRecords(jsonStatResponse) {
  const dataset = jsonStatResponse?.dataset ?? jsonStatResponse
  if (!dataset?.dimension?.id || !Array.isArray(dataset.value)) {
    return []
  }

  const dimIds = dataset.dimension.id
  /** @type {{ id: string, codes: string[] }[]} */
  const dims = dimIds.map((id) => ({
    id,
    codes: orderedCodes(dataset.dimension[id]),
  }))

  /** @type {StatRecord[]} */
  const records = []
  let valueIndex = 0

  /**
   * @param {number} depth
   * @param {StatRecord} partial
   */
  function walk(depth, partial) {
    if (depth === dims.length) {
      const raw = dataset.value[valueIndex]
      records.push({
        ...partial,
        value: raw === undefined || raw === null ? null : raw,
      })
      valueIndex += 1
      return
    }

    const { id, codes } = dims[depth]
    for (const code of codes) {
      walk(depth + 1, { ...partial, [id]: code })
    }
  }

  walk(0, {})
  return records
}

/**
 * @param {StatRecord[]} records
 * @param {Record<string, string>} filters
 * @returns {number | null}
 */
export function findValue(records, filters) {
  const row = records.find((record) =>
    Object.entries(filters).every(([key, value]) => String(record[key]) === value),
  )
  const val = row?.value
  return typeof val === 'number' ? val : val != null ? Number(val) : null
}

/**
 * @param {StatRecord[]} records
 * @param {Record<string, string>} filters
 * @returns {StatRecord[]}
 */
export function filterRecords(records, filters) {
  return records.filter((record) =>
    Object.entries(filters).every(([key, value]) => String(record[key]) === value),
  )
}
