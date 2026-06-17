import { museumCategoryColors } from '../theme/colors'
import { BOOKWORM_YEARS } from './dstTableConfig'

export { BOOKWORM_YEARS }

/** MUS01-style category definitions for chart rendering. */
export const MUSEUM_CATEGORIES = [
  {
    id: 'KUNST',
    label: 'Kunstmuseer (Art)',
    color: museumCategoryColors.KUNST,
  },
  {
    id: 'KULTUR',
    label: 'Kulturhistoriske (Cultural History)',
    color: museumCategoryColors.KULTUR,
  },
  {
    id: 'NATUR',
    label: 'Naturhistoriske/Videnskab (Science & Planetariums)',
    color: museumCategoryColors.NATUR,
  },
]

/**
 * Kommuner where regional scaling yields no meaningful science-museum signal.
 * @type {Set<string>}
 */
export const NO_SCIENCE_MUSEUM_KOMMUNER = new Set([
  'Læsø',
  'Fanø',
  'Samsø',
  'Ærø',
  'Dragør',
  'Vallensbæk',
  'Hørsholm',
  'Brøndby',
  'Albertslund',
  'Glostrup',
  'Herlev',
  'Rødovre',
  'Ishøj',
  'Halsnæs',
  'Langeland',
  'Lejre',
  'Odsherred',
  'Stevns',
  'Solrød',
  'Faxe',
])

export const SCIENCE_FALLBACK_MESSAGE =
  'No registered public science data for this region.'

export const SEASONAL_QUARTERS = [
  {
    id: 'Q1',
    label: 'Q1',
    shortLabel: 'Q1 (Winter)',
    season: 'winter',
    digitalMult: 1.15,
    physicalMult: 1.08,
    museumMult: 1.06,
  },
  {
    id: 'Q2',
    label: 'Q2',
    shortLabel: 'Q2 (Summer)',
    season: 'summer',
    digitalMult: 0.78,
    physicalMult: 0.85,
    museumMult: 0.86,
  },
  {
    id: 'Q3',
    label: 'Q3',
    shortLabel: 'Q3 (Summer)',
    season: 'summer',
    digitalMult: 0.8,
    physicalMult: 0.87,
    museumMult: 0.88,
  },
  {
    id: 'Q4',
    label: 'Q4',
    shortLabel: 'Q4 (Winter)',
    season: 'winter',
    digitalMult: 1.22,
    physicalMult: 1.12,
    museumMult: 1.1,
  },
]
