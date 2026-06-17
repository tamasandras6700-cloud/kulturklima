const DEFAULT_TIMEOUT_MS = 30_000
export const MUNICIPALITY_CACHE_TTL_MS = 24 * 60 * 60 * 1000
const MUNICIPALITY_CACHE_PREFIX = 'kulturklima:dst:municipality:v2:'

/** @typedef {'da' | 'en'} DstLang */

/**
 * @param {string} code — KOM code
 * @param {DstLang} lang
 */
export function municipalityCacheKey(code, lang) {
  return `${MUNICIPALITY_CACHE_PREFIX}${code}:${lang}`
}

/**
 * Reject stale or malformed municipality cache entries.
 * @param {unknown} data
 */
function isValidMunicipalityBundle(data) {
  if (!data || typeof data !== 'object') return false

  const bundle = /** @type {Record<string, unknown>} */ (data)
  const metrics = bundle.metrics
  if (!metrics || typeof metrics !== 'object') return false

  const m = /** @type {Record<string, unknown>} */ (metrics)
  const trend = bundle.bookwormTrend
  const pulse = bundle.seasonalPulse

  return (
    typeof m.municipality === 'string' &&
    m.bib1 != null &&
    m.museumContext != null &&
    m.cultureIndex != null &&
    trend != null &&
    typeof trend === 'object' &&
    Array.isArray(/** @type {{ timeline?: unknown }} */ (trend).timeline) &&
    pulse != null &&
    typeof pulse === 'object' &&
    Array.isArray(/** @type {{ quarters?: unknown }} */ (pulse).quarters) &&
    /** @type {{ quarters: unknown[] }} */ (pulse).quarters.length === 4
  )
}

/**
 * @param {string} code
 * @param {DstLang} lang
 * @returns {{ timestamp: number, data: object } | null}
 */
export function readMunicipalityCache(code, lang) {
  if (typeof localStorage === 'undefined') return null

  try {
    const raw = localStorage.getItem(municipalityCacheKey(code, lang))
    if (!raw) return null

    const entry = JSON.parse(raw)
    if (!entry?.timestamp || entry.data == null) return null

    if (Date.now() - entry.timestamp > MUNICIPALITY_CACHE_TTL_MS) {
      localStorage.removeItem(municipalityCacheKey(code, lang))
      return null
    }

    if (!isValidMunicipalityBundle(entry.data)) {
      localStorage.removeItem(municipalityCacheKey(code, lang))
      return null
    }

    return entry
  } catch {
    return null
  }
}

/**
 * @param {string} code
 * @param {DstLang} lang
 * @param {object} data
 */
export function writeMunicipalityCache(code, lang, data) {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem(
      municipalityCacheKey(code, lang),
      JSON.stringify({
        timestamp: Date.now(),
        data,
      }),
    )
  } catch {
    // Quota exceeded or storage blocked — continue without persisting.
  }
}

/**
 * Fetch municipality data with a 24-hour localStorage cache.
 *
 * @template T
 * @param {string} code — KOM code
 * @param {DstLang} lang
 * @param {() => Promise<T>} fetchFn — network fetch when cache misses
 * @param {{ bypassCache?: boolean }} [options]
 * @returns {Promise<T>}
 */
export async function fetchMunicipalityData(code, lang, fetchFn, options = {}) {
  const { bypassCache = false } = options

  if (!bypassCache) {
    const cached = readMunicipalityCache(code, lang)
    if (cached) return cached.data
  }

  const data = await fetchFn()
  writeMunicipalityCache(code, lang, data)
  return data
}


/**
 * Base URL for Statbank API calls. Uses Vite proxy in dev/preview to avoid CORS.
 * @type {string}
 */
export const DST_API_BASE =
  import.meta.env.VITE_DST_API_BASE ?? '/api/statbank/v1'

/**
 * POST to Danmarks Statistik Statbank DATA endpoint.
 *
 * @param {string} tableId — e.g. "bib1", "FOLK1A", "MUS3"
 * @param {Array<{ code: string, values: string[] }>} variables
 * @param {object} [options]
 * @param {'JSONSTAT' | 'JSON'} [options.format='JSONSTAT']
 * @param {DstLang} [options.lang='da']
 * @param {number} [options.timeoutMs=30000]
 * @returns {Promise<object>}
 */
export async function fetchDstData(tableId, variables, options = {}) {
  const {
    format = 'JSONSTAT',
    lang = 'da',
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options

  const payload = {
    table: tableId,
    format,
    lang,
    valueCodes: [],
    variables,
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${DST_API_BASE}/data`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    const body = await response.json().catch(() => null)

    if (!response.ok || body?.errorTypeCode) {
      const message =
        body?.message ??
        `Statbank request failed (${response.status} ${response.statusText})`
      throw new Error(message)
    }

    return body
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Statbank request timed out', { cause: error })
    }
    if (error instanceof TypeError) {
      throw new Error('Network error while contacting Danmarks Statistik', {
        cause: error,
      })
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}
