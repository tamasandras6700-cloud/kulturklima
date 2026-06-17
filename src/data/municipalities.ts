/**
 * All 98 Danish municipalities (kommuner) with Statbank KOM codes.
 * Names follow Danmarks Statistik nomenclature.
 */
export const PINNED_MUNICIPALITIES = [
  'København',
  'Aarhus',
  'Odense',
  'Aalborg',
] as const

export const DEFAULT_MUNICIPALITY = 'København'

export interface Municipality {
  code: string
  name: string
  region: string
}

export const MUNICIPALITIES: Municipality[] = [
  { code: '101', name: 'København', region: 'Hovedstaden' },
  { code: '751', name: 'Aarhus', region: 'Midtjylland' },
  { code: '851', name: 'Aalborg', region: 'Nordjylland' },
  { code: '461', name: 'Odense', region: 'Syddanmark' },
  { code: '561', name: 'Esbjerg', region: 'Syddanmark' },
  { code: '630', name: 'Vejle', region: 'Syddanmark' },
  { code: '147', name: 'Frederiksberg', region: 'Hovedstaden' },
  { code: '730', name: 'Randers', region: 'Midtjylland' },
  { code: '791', name: 'Viborg', region: 'Midtjylland' },
  { code: '621', name: 'Kolding', region: 'Syddanmark' },
  { code: '740', name: 'Silkeborg', region: 'Midtjylland' },
  { code: '657', name: 'Herning', region: 'Midtjylland' },
  { code: '615', name: 'Horsens', region: 'Midtjylland' },
  { code: '265', name: 'Roskilde', region: 'Sjælland' },
  { code: '370', name: 'Næstved', region: 'Sjælland' },
  { code: '330', name: 'Slagelse', region: 'Sjælland' },
  { code: '540', name: 'Sønderborg', region: 'Syddanmark' },
  { code: '157', name: 'Gentofte', region: 'Hovedstaden' },
  { code: '316', name: 'Holbæk', region: 'Sjælland' },
  { code: '860', name: 'Hjørring', region: 'Nordjylland' },
  { code: '159', name: 'Gladsaxe', region: 'Hovedstaden' },
  { code: '376', name: 'Guldborgsund', region: 'Sjælland' },
  { code: '217', name: 'Helsingør', region: 'Hovedstaden' },
  { code: '813', name: 'Frederikshavn', region: 'Nordjylland' },
  { code: '580', name: 'Aabenraa', region: 'Syddanmark' },
  { code: '479', name: 'Svendborg', region: 'Syddanmark' },
  { code: '746', name: 'Skanderborg', region: 'Midtjylland' },
  { code: '760', name: 'Ringkøbing-Skjern', region: 'Midtjylland' },
  { code: '259', name: 'Køge', region: 'Sjælland' },
  { code: '661', name: 'Holstebro', region: 'Midtjylland' },
  { code: '510', name: 'Haderslev', region: 'Syddanmark' },
  { code: '230', name: 'Rudersdal', region: 'Hovedstaden' },
  { code: '173', name: 'Lyngby-Taarbæk', region: 'Hovedstaden' },
  { code: '430', name: 'Faaborg-Midtfyn', region: 'Syddanmark' },
  { code: '167', name: 'Hvidovre', region: 'Hovedstaden' },
  { code: '573', name: 'Varde', region: 'Syddanmark' },
  { code: '607', name: 'Fredericia', region: 'Syddanmark' },
  { code: '326', name: 'Kalundborg', region: 'Sjælland' },
  { code: '219', name: 'Hillerød', region: 'Hovedstaden' },
  { code: '169', name: 'Høje-Taastrup', region: 'Hovedstaden' },
  { code: '151', name: 'Ballerup', region: 'Hovedstaden' },
  { code: '253', name: 'Greve', region: 'Sjælland' },
  { code: '779', name: 'Skive', region: 'Midtjylland' },
  { code: '710', name: 'Favrskov', region: 'Midtjylland' },
  { code: '766', name: 'Hedensted', region: 'Midtjylland' },
  { code: '390', name: 'Vordingborg', region: 'Sjælland' },
  { code: '360', name: 'Lolland', region: 'Sjælland' },
  { code: '787', name: 'Thisted', region: 'Nordjylland' },
  { code: '250', name: 'Frederikssund', region: 'Hovedstaden' },
  { code: '575', name: 'Vejen', region: 'Syddanmark' },
  { code: '846', name: 'Mariagerfjord', region: 'Nordjylland' },
  { code: '240', name: 'Egedal', region: 'Hovedstaden' },
  { code: '706', name: 'Syddjurs', region: 'Midtjylland' },
  { code: '420', name: 'Assens', region: 'Syddanmark' },
  { code: '400', name: 'Bornholm', region: 'Hovedstaden' },
  { code: '185', name: 'Tårnby', region: 'Hovedstaden' },
  { code: '756', name: 'Ikast-Brande', region: 'Midtjylland' },
  { code: '270', name: 'Gribskov', region: 'Hovedstaden' },
  { code: '210', name: 'Fredensborg', region: 'Hovedstaden' },
  { code: '550', name: 'Tønder', region: 'Syddanmark' },
  { code: '849', name: 'Jammerbugt', region: 'Nordjylland' },
  { code: '190', name: 'Furesø', region: 'Hovedstaden' },
  { code: '707', name: 'Norddjurs', region: 'Midtjylland' },
  { code: '410', name: 'Middelfart', region: 'Syddanmark' },
  { code: '820', name: 'Vesthimmerlands', region: 'Nordjylland' },
  { code: '175', name: 'Rødovre', region: 'Hovedstaden' },
  { code: '810', name: 'Brønderslev', region: 'Nordjylland' },
  { code: '320', name: 'Faxe', region: 'Sjælland' },
  { code: '153', name: 'Brøndby', region: 'Hovedstaden' },
  { code: '329', name: 'Ringsted', region: 'Sjælland' },
  { code: '306', name: 'Odsherred', region: 'Sjælland' },
  { code: '450', name: 'Nyborg', region: 'Syddanmark' },
  { code: '260', name: 'Halsnæs', region: 'Hovedstaden' },
  { code: '340', name: 'Sorø', region: 'Sjælland' },
  { code: '480', name: 'Nordfyns', region: 'Syddanmark' },
  { code: '840', name: 'Rebild', region: 'Nordjylland' },
  { code: '165', name: 'Albertslund', region: 'Hovedstaden' },
  { code: '350', name: 'Lejre', region: 'Sjælland' },
  { code: '163', name: 'Herlev', region: 'Hovedstaden' },
  { code: '530', name: 'Billund', region: 'Syddanmark' },
  { code: '223', name: 'Hørsholm', region: 'Hovedstaden' },
  { code: '201', name: 'Allerød', region: 'Hovedstaden' },
  { code: '440', name: 'Kerteminde', region: 'Syddanmark' },
  { code: '671', name: 'Struer', region: 'Midtjylland' },
  { code: '336', name: 'Stevns', region: 'Sjælland' },
  { code: '727', name: 'Odder', region: 'Midtjylland' },
  { code: '161', name: 'Glostrup', region: 'Hovedstaden' },
  { code: '773', name: 'Morsø', region: 'Nordjylland' },
  { code: '665', name: 'Lemvig', region: 'Midtjylland' },
  { code: '269', name: 'Solrød', region: 'Sjælland' },
  { code: '183', name: 'Ishøj', region: 'Hovedstaden' },
  { code: '187', name: 'Vallensbæk', region: 'Hovedstaden' },
  { code: '155', name: 'Dragør', region: 'Hovedstaden' },
  { code: '482', name: 'Langeland', region: 'Syddanmark' },
  { code: '492', name: 'Ærø', region: 'Syddanmark' },
  { code: '741', name: 'Samsø', region: 'Midtjylland' },
  { code: '563', name: 'Fanø', region: 'Syddanmark' },
  { code: '825', name: 'Læsø', region: 'Nordjylland' },
]

export function getMunicipalityByName(name: string): Municipality | undefined {
  return MUNICIPALITIES.find(
    (m) => m.name.toLowerCase() === name.toLowerCase(),
  )
}

export function sortMunicipalitiesForSidebar(
  municipalities: Municipality[],
  query: string,
): { pinned: Municipality[]; rest: Municipality[] } {
  const normalizedQuery = query.trim().toLowerCase()

  const matches = (m: Municipality) =>
    !normalizedQuery || m.name.toLowerCase().includes(normalizedQuery)

  const pinned = PINNED_MUNICIPALITIES.map((name) =>
    municipalities.find((m) => m.name === name),
  ).filter((m): m is Municipality => !!m && matches(m))

  const pinnedNames = new Set(PINNED_MUNICIPALITIES)
  const rest = municipalities
    .filter((m) => !pinnedNames.has(m.name as (typeof PINNED_MUNICIPALITIES)[number]))
    .filter(matches)
    .sort((a, b) => a.name.localeCompare(b.name, 'da'))

  return { pinned, rest }
}
