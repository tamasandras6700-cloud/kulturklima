import { fetchDstData, fetchMunicipalityData } from '../utils/dstApi.js'
import { filterRecords, findValue, jsonStatToRecords } from '../utils/jsonStatAdapter.js'
import { MUNICIPALITIES } from './municipalities.ts'
import {
  BIB1_METRICS,
  BIB1_TABLE,
  BOOKWORM_YEARS,
  FOLK1A_TABLE,
  MUS3_ACTIVITY,
  MUS3_CATEGORIES,
  MUS3_CODE_TO_CATEGORY,
  MUS3_DEPARTMENT,
  MUS3_TABLE,
  REGION_TO_DST_CODE,
} from './dstTableConfig.js'
import {
  MUSEUM_CATEGORIES,
  NO_SCIENCE_MUSEUM_KOMMUNER,
  SCIENCE_FALLBACK_MESSAGE,
  SEASONAL_QUARTERS,
} from './culturalConstants.js'
import {
  computeCultureIndex,
  computeMuseumMetricContext,
  isMuseumDataAvailable,
} from './cultureIndex.ts'

const MUNICIPALITY_CODES = new Set(MUNICIPALITIES.map((m) => m.code))
const AREA_VAR = 'OMRÅDE'
const BIB_METRIC_VAR = 'BNØGLE'
const TIME_VAR = 'Tid'

/**
 * @param {number} total
 * @param {number} population
 */
function perCapita(total, population) {
  if (!population) return 0
  return Math.round((total / population) * 10) / 10
}

/**
 * @param {string} lang
 * @returns {Promise<import('../utils/jsonStatAdapter.js').StatRecord[]>}
 */
async function fetchBib1Records(komCode, years, lang) {
  const response = await fetchDstData(
    BIB1_TABLE,
    [
      { code: AREA_VAR, values: [komCode] },
      {
        code: BIB_METRIC_VAR,
        values: [BIB1_METRICS.PHYSICAL_BOOKS, BIB1_METRICS.DIGITAL],
      },
      { code: TIME_VAR, values: years },
    ],
    { lang },
  )
  return jsonStatToRecords(response)
}

/**
 * @param {string} komCode
 * @param {string} lang
 */
async function fetchPopulation(komCode, lang) {
  const response = await fetchDstData(
    FOLK1A_TABLE,
    [
      { code: AREA_VAR, values: [komCode] },
      { code: 'KØN', values: ['TOT'] },
      { code: 'ALDER', values: ['IALT'] },
      { code: 'CIVILSTAND', values: ['TOT'] },
      { code: TIME_VAR, values: ['(1)'] },
    ],
    { lang },
  )

  const records = jsonStatToRecords(response)
  const row = records[0]
  const population = row?.value != null ? Number(row.value) : null
  const yearLabel = row?.[TIME_VAR] ? String(row[TIME_VAR]).slice(0, 4) : BOOKWORM_YEARS.at(-1)

  return { population, yearLabel, records }
}

/**
 * @param {string} regionCode
 * @param {string} year
 * @param {string} lang
 */
async function fetchRegionalMuseumRecords(regionCode, year, lang) {
  const response = await fetchDstData(
    MUS3_TABLE,
    [
      { code: AREA_VAR, values: [regionCode] },
      {
        code: 'MUSEER',
        values: [
          MUS3_CATEGORIES.KULTUR,
          MUS3_CATEGORIES.KUNST,
          MUS3_CATEGORIES.NATUR,
        ],
      },
      { code: 'AFDLING', values: [MUS3_DEPARTMENT.ALL] },
      { code: 'AKTIVI', values: [MUS3_ACTIVITY.EXHIBITION_VISITS] },
      { code: TIME_VAR, values: [year] },
    ],
    { lang },
  )
  return jsonStatToRecords(response)
}

/**
 * @param {string} regionCode
 * @param {string} lang
 */
async function fetchRegionPopulation(regionCode, lang) {
  const response = await fetchDstData(
    FOLK1A_TABLE,
    [
      { code: AREA_VAR, values: [regionCode] },
      { code: 'KØN', values: ['TOT'] },
      { code: 'ALDER', values: ['IALT'] },
      { code: 'CIVILSTAND', values: ['TOT'] },
      { code: TIME_VAR, values: ['(1)'] },
    ],
    { lang },
  )
  const records = jsonStatToRecords(response)
  const val = records[0]?.value
  return val != null ? Number(val) : null
}

/**
 * @param {import('../utils/jsonStatAdapter.js').StatRecord[]} bibRecords
 * @param {string} year
 */
function bibValuesForYear(bibRecords, year) {
  const physical =
    findValue(bibRecords, {
      [BIB_METRIC_VAR]: BIB1_METRICS.PHYSICAL_BOOKS,
      [TIME_VAR]: year,
    }) ?? 0
  const digital =
    findValue(bibRecords, {
      [BIB_METRIC_VAR]: BIB1_METRICS.DIGITAL,
      [TIME_VAR]: year,
    }) ?? 0
  return { physical, digital }
}

/**
 * @param {import('../utils/jsonStatAdapter.js').StatRecord[]} musRecords
 * @param {number} municipalityPopulation
 * @param {number} regionPopulation
 */
function scaleMuseumByPopulation(musRecords, municipalityPopulation, regionPopulation) {
  if (
    !Array.isArray(musRecords) ||
    musRecords.length === 0 ||
    !regionPopulation ||
    regionPopulation <= 0 ||
    !municipalityPopulation ||
    municipalityPopulation <= 0
  ) {
    return { KUNST: 0, KULTUR: 0, NATUR: 0 }
  }

  const share = municipalityPopulation / regionPopulation

  /** @type {Record<'KUNST' | 'KULTUR' | 'NATUR', number>} */
  const scaled = { KUNST: 0, KULTUR: 0, NATUR: 0 }

  for (const record of musRecords) {
    const musCode = String(record.MUSEER)
    const category = MUS3_CODE_TO_CATEGORY[musCode]
    if (!category || record.value == null) continue
    const numeric = Number(record.value)
    if (!Number.isFinite(numeric)) continue
    scaled[category] += Math.round(numeric * share)
  }

  return scaled
}

/**
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.code
 * @param {string} params.region
 * @param {string} params.lang
 * @param {{ bypassCache?: boolean }} [options]
 */
export async function fetchMunicipalityBundle(params, options = {}) {
  const { name, code, region, lang } = params

  return fetchMunicipalityData(
    code,
    lang,
    () => fetchMunicipalityBundleFromNetwork({ name, code, region, lang }),
    options,
  )
}

/**
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.code
 * @param {string} params.region
 * @param {string} params.lang
 */
async function fetchMunicipalityBundleFromNetwork({ name, code, region, lang }) {
  const regionCode = REGION_TO_DST_CODE[region]
  if (!regionCode) {
    throw new Error(`Unknown region mapping for ${region}`)
  }

  const [bibRecords, populationResult] = await Promise.all([
    fetchBib1Records(code, BOOKWORM_YEARS, lang),
    fetchPopulation(code, lang),
  ])

  let musRecords
  let regionPopulation

  try {
    ;[musRecords, regionPopulation] = await Promise.all([
      fetchRegionalMuseumRecords(regionCode, BOOKWORM_YEARS.at(-1), lang),
      fetchRegionPopulation(regionCode, lang),
    ])
  } catch {
    musRecords = []
    regionPopulation = null
  }

  const museumDataAvailable = isMuseumDataAvailable(
    musRecords,
    regionPopulation,
  )

  const { population, yearLabel } = populationResult
  if (!population) {
    throw new Error(`Population data unavailable for ${name}`)
  }

  const metricsYear = BOOKWORM_YEARS.at(-1)
  const { physical, digital } = bibValuesForYear(bibRecords, metricsYear)
  const totalLoans = physical + digital

  const museumScaled = scaleMuseumByPopulation(
    musRecords,
    population,
    regionPopulation ?? 0,
  )

  const hasScienceData = !NO_SCIENCE_MUSEUM_KOMMUNER.has(name)
  const artMuseums = museumScaled.KUNST ?? 0
  const culturalHistory = museumScaled.KULTUR ?? 0
  const naturalHistory = hasScienceData ? (museumScaled.NATUR ?? 0) : 0
  const totalVisits = artMuseums + culturalHistory + naturalHistory

  const museumPerCapitaTotal = museumDataAvailable
    ? perCapita(totalVisits, population)
    : 0

  const museumContext = computeMuseumMetricContext(
    name,
    totalVisits,
    museumPerCapitaTotal,
    museumDataAvailable,
  )

  const cultureIndex = computeCultureIndex(
    perCapita(totalLoans, population),
    museumPerCapitaTotal,
    name,
    totalVisits,
  )

  const metrics = {
    municipality: name,
    code,
    region,
    year: metricsYear ?? yearLabel,
    population,
    dataSource: 'statbank',
    bib1: {
      physicalBooks: physical,
      ebooks: digital,
      totalLoans,
      perCapita: {
        physicalBooks: perCapita(physical, population),
        ebooks: perCapita(digital, population),
        total: perCapita(totalLoans, population),
      },
    },
    mus01: {
      artMuseums,
      culturalHistory,
      naturalHistory,
      totalVisits,
      perCapita: {
        artMuseums: perCapita(artMuseums, population),
        culturalHistory: perCapita(culturalHistory, population),
        naturalHistory: perCapita(naturalHistory, population),
        total: museumPerCapitaTotal,
      },
    },
    museumContext,
    cultureIndex,
    statbank: {
      BIB1: filterRecords(bibRecords, { [TIME_VAR]: metricsYear }),
      MUS01: musRecords,
      FOLK1A: populationResult.records,
    },
    museumNote: 'regional-scaled',
  }

  const timeline = BOOKWORM_YEARS.map((year) => {
    const yearValues = bibValuesForYear(bibRecords, year)
    const physicalTotal = yearValues.physical
    const digitalTotal = yearValues.digital
    const physicalPc = perCapita(physicalTotal, population)
    const digitalPc = perCapita(digitalTotal, population)

    return {
      year,
      physical: physicalPc,
      digital: digitalPc,
      physicalTotal,
      digitalTotal,
      totalPerCapita: perCapita(physicalTotal + digitalTotal, population),
      totalLoans: physicalTotal + digitalTotal,
    }
  })

  const currentYear = metricsYear
  const current =
    timeline.find((row) => row.year === currentYear) ?? timeline.at(-1)

  const bookwormTrend = {
    municipality: name,
    code,
    population,
    currentYear,
    timeline,
    kpi: {
      totalLoans: current?.totalLoans ?? 0,
      population,
      booksPerCitizen: perCapita(current?.totalLoans ?? 0, population),
      physicalPerCitizen: current?.physical ?? 0,
      digitalPerCitizen: current?.digital ?? 0,
    },
  }

  const valuesByType = {
    KUNST: artMuseums,
    KULTUR: culturalHistory,
    NATUR: hasScienceData ? naturalHistory : null,
  }

  const categories = MUSEUM_CATEGORIES.map((cat) => {
    const rawValue = valuesByType[cat.id]
    const hasData = rawValue !== null && rawValue > 0
    return { ...cat, value: rawValue, hasData }
  })

  const chartSlices = categories.filter((cat) => cat.hasData)
  const chartSlicesWithShare = chartSlices.map((cat) => ({
    ...cat,
    percentage:
      totalVisits > 0
        ? Math.round((cat.value / totalVisits) * 1000) / 10
        : 0,
  }))

  const dominant =
    chartSlicesWithShare.length > 0
      ? chartSlicesWithShare.reduce((top, cat) =>
          cat.value > top.value ? cat : top,
        )
      : null

  const museumProfile = {
    municipality: name,
    code,
    year: metrics.year,
    population,
    dataSource: 'statbank',
    categories,
    chartSlices: chartSlicesWithShare,
    totalVisits,
    hasScienceData,
    missingScience: !hasScienceData,
    scienceFallbackMessage: SCIENCE_FALLBACK_MESSAGE,
    dominantCategory: dominant,
    statbankRows: musRecords,
    museumNote: 'regional-scaled',
  }

  const seasonalPulse = buildSeasonalPulse(metrics, museumProfile)

  return { metrics, bookwormTrend, museumProfile, seasonalPulse }
}

/**
 * @param {ReturnType<typeof fetchMunicipalityBundle> extends Promise<infer T> ? T['metrics'] : never} metrics
 * @param {ReturnType<typeof fetchMunicipalityBundle> extends Promise<infer T> ? T['museumProfile'] : never} profile
 */
function buildSeasonalPulse(metrics, profile) {
  const population = metrics.population
  const annualDigital = metrics.bib1.ebooks
  const annualPhysical = metrics.bib1.physicalBooks
  const annualMuseum = metrics.mus01.totalVisits

  const quarters = SEASONAL_QUARTERS.map((q) => {
    const digital = Math.round((annualDigital / 4) * q.digitalMult)
    const physical = Math.round((annualPhysical / 4) * q.physicalMult)
    const museumVisits = Math.round((annualMuseum / 4) * q.museumMult)

    const artMuseums = profile?.hasScienceData
      ? Math.round(
          (metrics.mus01.artMuseums / 4) *
            q.museumMult *
            (0.95 + (q.season === 'winter' ? 0.08 : -0.05)),
        )
      : Math.round((metrics.mus01.artMuseums / 4) * q.museumMult)

    const culturalHistory = Math.round(
      (metrics.mus01.culturalHistory / 4) * q.museumMult,
    )

    const naturalHistory = profile?.hasScienceData
      ? Math.round((metrics.mus01.naturalHistory / 4) * q.museumMult)
      : 0

    return {
      ...q,
      digital,
      physical,
      digitalPerCapita: perCapita(digital, population),
      physicalPerCapita: perCapita(physical, population),
      totalLoansPerCapita: perCapita(digital + physical, population),
      museumVisits,
      museumPerCapita: perCapita(museumVisits, population),
      artMuseums,
      culturalHistory,
      naturalHistory,
      isColdQuarter: q.season === 'winter',
    }
  })

  const q4 = quarters.find((q) => q.id === 'Q4')
  const q2 = quarters.find((q) => q.id === 'Q2')
  const q1 = quarters.find((q) => q.id === 'Q1')
  const q3 = quarters.find((q) => q.id === 'Q3')

  const coldDigitalAvg = (q1.digitalPerCapita + q4.digitalPerCapita) / 2
  const warmDigitalAvg = (q2.digitalPerCapita + q3.digitalPerCapita) / 2

  const digitalSpikeQ4vsQ2 =
    q2.digitalPerCapita > 0
      ? Math.round(
          ((q4.digitalPerCapita - q2.digitalPerCapita) / q2.digitalPerCapita) *
            100,
        )
      : 0

  const coldVsWarmCulture =
    warmDigitalAvg > 0
      ? Math.round(((coldDigitalAvg - warmDigitalAvg) / warmDigitalAvg) * 100)
      : 0

  const museumSpikeQ1vsQ3 =
    q3.museumPerCapita > 0
      ? Math.round(
          ((q1.museumPerCapita - q3.museumPerCapita) / q3.museumPerCapita) *
            100,
        )
      : 0

  return {
    municipality: metrics.municipality,
    year: metrics.year,
    population,
    quarters,
    insight: {
      digitalSpikeQ4vsQ2,
      coldVsWarmCulture,
      museumSpikeQ1vsQ3,
      highlightQuarter: q4,
      baselineQuarter: q2,
    },
  }
}

/**
 * Sidebar ranking — BIB1 totals for all kommuner (latest year).
 * @param {string} lang
 * @returns {Promise<Record<string, number>>}
 */
export async function fetchCulturalIndexMap(lang) {
  const latestYear = BOOKWORM_YEARS.at(-1)
  const response = await fetchDstData(
    BIB1_TABLE,
    [
      { code: AREA_VAR, values: ['*'] },
      {
        code: BIB_METRIC_VAR,
        values: [BIB1_METRICS.PHYSICAL_BOOKS, BIB1_METRICS.DIGITAL],
      },
      { code: TIME_VAR, values: [latestYear] },
    ],
    { lang },
  )

  const bibRecords = jsonStatToRecords(response)

  const popResponse = await fetchDstData(
    FOLK1A_TABLE,
    [
      { code: AREA_VAR, values: ['*'] },
      { code: 'KØN', values: ['TOT'] },
      { code: 'ALDER', values: ['IALT'] },
      { code: 'CIVILSTAND', values: ['TOT'] },
      { code: TIME_VAR, values: ['(1)'] },
    ],
    { lang },
  )

  const popRecords = jsonStatToRecords(popResponse)
  const popByCode = new Map(
    popRecords
      .filter((row) => MUNICIPALITY_CODES.has(String(row[AREA_VAR])))
      .map((row) => [String(row[AREA_VAR]), Number(row.value)]),
  )

  /** @type {Record<string, { physical: number, digital: number }>} */
  const bibByCode = {}

  for (const row of bibRecords) {
    const kom = String(row[AREA_VAR])
    if (!MUNICIPALITY_CODES.has(kom)) continue

    if (!bibByCode[kom]) bibByCode[kom] = { physical: 0, digital: 0 }
    const metric = String(row[BIB_METRIC_VAR])
    if (metric === BIB1_METRICS.PHYSICAL_BOOKS) {
      bibByCode[kom].physical = Number(row.value) || 0
    } else if (metric === BIB1_METRICS.DIGITAL) {
      bibByCode[kom].digital = Number(row.value) || 0
    }
  }

  const nameByCode = new Map(MUNICIPALITIES.map((m) => [m.code, m.name]))
  /** @type {Record<string, number>} */
  const indexByName = {}

  for (const [kom, totals] of Object.entries(bibByCode)) {
    const population = popByCode.get(kom)
    const municipalityName = nameByCode.get(kom)
    if (!population || !municipalityName) continue

    const libraryIndex = perCapita(totals.physical + totals.digital, population)
    indexByName[municipalityName] = libraryIndex
  }

  return indexByName
}

/**
 * @param {string} name
 * @param {Record<string, number>} indexMap
 */
export function getCulturalIndexFromMap(name, indexMap) {
  return indexMap[name] ?? 0
}

/**
 * @param {string} name
 */
export function resolveMunicipality(name) {
  return MUNICIPALITIES.find(
    (m) => m.name.toLowerCase() === name.toLowerCase(),
  )
}
