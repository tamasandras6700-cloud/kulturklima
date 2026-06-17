/** BIB1 — Folkebibliotekernes nøgletal (variable: BNØGLE, not MATERIALE). */
export const BIB1_TABLE = 'bib1'

export const BIB1_METRICS = {
  /** Udlån. Bøger */
  PHYSICAL_BOOKS: '15120',
  /** Brug af elektroniske ressourcer (downloads) */
  DIGITAL: '15250',
  /** Udlån i alt */
  TOTAL_LOANS: '15110',
}

/** Five most recent annual BIB1 periods (table updated through 2024). */
export const BOOKWORM_YEARS = ['2020', '2021', '2022', '2023', '2024']

export const FOLK1A_TABLE = 'FOLK1A'

/** MUS3 — regional museum activity (no kommune-level MUS01 in Statbank). */
export const MUS3_TABLE = 'MUS3'

export const MUS3_CATEGORIES = {
  KULTUR: '00335',
  KUNST: '00350',
  NATUR: '00360',
}

export const MUS3_ACTIVITY = {
  EXHIBITION_VISITS: '00420',
}

export const MUS3_DEPARTMENT = {
  ALL: 'TOT',
}

/** @type {Record<string, string>} App region label → DST OMRÅDE region code */
export const REGION_TO_DST_CODE = {
  Hovedstaden: '084',
  Sjælland: '085',
  Syddanmark: '083',
  Midtjylland: '082',
  Nordjylland: '081',
}

/** @type {Record<string, 'KUNST' | 'KULTUR' | 'NATUR'>} */
export const MUS3_CODE_TO_CATEGORY = {
  [MUS3_CATEGORIES.KUNST]: 'KUNST',
  [MUS3_CATEGORIES.KULTUR]: 'KULTUR',
  [MUS3_CATEGORIES.NATUR]: 'NATUR',
}
