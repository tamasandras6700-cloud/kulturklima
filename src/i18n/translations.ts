export type Locale = 'da' | 'en'

export const DEFAULT_LOCALE: Locale = 'da'

const da = {
  meta: {
    title: 'KulturKlima — Danmarks kulturelle puls',
    description:
      'Udforsk biblioteksudlån, museumsbesøg og kulturindeks for alle 98 danske kommuner. Live data fra Danmarks Statistik (BIB1, MUS3, FOLK1A).',
  },
  header: {
    subtitle: 'Kulturdata og kommunal indsigt på tværs af Danmark.',
    audienceCultural: 'Kulturaktører',
    audienceMunicipal: 'Kommunal indsigt',
    audienceGroupAria: 'Målgrupper',
  },
  language: {
    switchToEn: 'English',
    switchToDa: 'Dansk',
    label: 'Sprog',
  },
  footer: {
    attribution:
      'Kilde: Egne beregninger og visualiseringer baseret på API-data fra Danmarks Statistik (Tabeller: BIB1, MUS3, FOLK1A). Udgivet under Creative Commons Attribution 4.0 International-licensen (CC BY 4.0).',
    dataSource:
      'Data: Danmarks Statistik (BIB1, MUS3, FOLK1A) — Udgivet under CC BY 4.0.',
    liveApi: 'Live Statbank API',
    audienceNote:
      'Bygget til kulturinstitutioner, kreative aktører og kommunale planlæggere.',
  },
  data: {
    loading: 'Henter live data fra Danmarks Statistik…',
    fetchError:
      'Kunne ikke hente live data fra Danmarks Statistik. Tjek dit netværk, eller prøv igen.',
    retry: 'Prøv igen',
  },
  export: {
    csv: 'Eksporter CSV',
  },
  sidebar: {
    title: 'Kommuner',
    count: '{count} kommuner · rangordnet',
    searchPlaceholder: 'Søg kommune…',
    searchAria: 'Søg kommune',
    listAria: 'Kommuneliste',
    pinned: 'Hurtigvalg',
    all: 'Alle kommuner',
    noResults: 'Ingen kommuner matcher "{query}"',
    mobileClose: 'Luk kommuneliste',
    mobileFab: 'Vælg kommune — {municipality}',
  },
  regions: {
    Hovedstaden: 'Hovedstaden',
    Midtjylland: 'Midtjylland',
    Nordjylland: 'Nordjylland',
    Syddanmark: 'Syddanmark',
    Sjælland: 'Sjælland',
  },
  main: {
    noData: 'Ingen data tilgængelig for {municipality}.',
    residents: 'indbyggere',
    statbankLive: 'Live Statbank',
    statbankRegional: 'MUS3 regional skala',
    seasonalActive: 'Regnvejrs-overlay aktiv · kvartalsvis BIB1-puls (model)',
    perCapita: 'pr. indbygger',
    perResident: 'Pr. indbygger',
  },
  stats: {
    libraryLoans: 'Biblioteksudlån',
    museumVisits: 'Museumsbesøg',
    population: 'Befolkning',
    populationSub: 'FOLK1A · kvartalsvis',
    cultureIndex: 'Kulturindeks',
    cultureIndexSub: 'Udlån + besøg pr. indbygger',
    cultureIndexSubWeighted:
      'Vægtet indeks · biblioteksudlån + justerede musebesøg',
    hubMuseumNote:
      'Bemærk: Museumsbesøg omfatter regionale og internationale turister, hvilket kan oppuste det lokale tal pr. indbygger.',
    commuterMuseumNote:
      'Bemærk: Kommunen har færre registrerede museer. Borgere benytter typisk kulturinstitutioner i hele {region}.',
    notAvailable: 'N/A',
    museumDataUnavailable: 'MUS3-data utilgængelig',
    metricInfoLabel: 'Metode note',
  },
  bookworm: {
    title: 'Bookworm-indeks',
    descAnnual: 'Fysisk vs. digital læsning — 5-årig udvikling pr. borger',
    descSeasonal: 'Kvartalsvis fysisk vs. digital læsning — sæsonpuls',
    physical: 'Fysiske bøger / medier',
    digital: 'Digitale udlån (eReolen / lyd)',
    noSeasonalData: 'Ingen sæsondata for {municipality}.',
    noData: 'Ingen Bookworm-data for {municipality}.',
    footnoteAnnual:
      '5-årig trend · BIB1 · stigende digital andel viser migrationsmønster',
    footnoteSeasonal:
      'Kvartalsvis BIB1-puls · Q1/Q4 (vinter) vs Q2/Q3 (sommer) · digitale udlån stiger i mørke kvartaler',
    yAxis: 'Udlån pr. indbygger',
    tooltipTotal: 'Total',
    perCapitaShort: 'indb.',
    kpiTitle: 'Bookworm-indeks · {year}',
    booksPerCitizen: 'bøger / borger',
    totalLoans: 'Total udlån',
    population: 'Befolkning',
    avgLoans: 'Gennemsnitligt antal biblioteksudlån pr. indbygger i {year}',
    seasonalKpiTitle: 'Sæsonpuls · {year}',
    digitalSpike: 'Digital stigning Q4 vs Q2',
    q4Digital: 'Q4 digital',
    q2Digital: 'Q2 digital',
    coldQuartersNote:
      'Kolde kvartaler (Q1/Q4) driver indendørs medier — {population} indbyggere',
    q4Winter: 'Q4 (vinter)',
    q2Summer: 'Q2 (sommer)',
    peakCultureLift: 'Højdepunkt vs. laveste kvartal',
    peakQuarter: 'Topkvartal',
    lowQuarter: 'Laveste kvartal',
    xAxisSeasonal: 'Kvartal · {year}',
  },
  bib1: {
    title: 'BIB1 — Biblioteksudlån',
    description: 'Fysiske materialer vs. e-bøger',
    physical: 'Fysiske materialer (bøger m.m.)',
    digital: 'E-bøger og digitale udlån',
  },
  museum: {
    title: 'Kulturprofil — museumsmix',
    descAnnual: 'MUS3 · fordeling af museumsbesøg efter type (regional skala)',
    descSeasonal: 'MUS3 · kvartalsvis museumsbesøg efter type (regional skala)',
    noData: 'Ingen museumsdata for {municipality}.',
    emptyTitle: 'Ingen museumsbesøgsdata for {municipality}',
    emptyDesc: 'MUS3 returnerede ingen registrerede poster for denne region.',
    noCategoryData: 'Ingen data',
    visits: 'besøg',
    ofTotal: 'af total',
    dominant: 'Primær profil',
    ofVisits: 'af besøg',
    footnoteSeasonal: 'Kvartalsvis MUS3 · højere besøg i Q1/Q4 (vinter)',
    noScience: 'Ingen registreret offentlig videnskabsdata for denne region.',
    categories: {
      KUNST: 'Kunstmuseer (kunst)',
      KULTUR: 'Kulturhistoriske museer',
      NATUR: 'Naturhistoriske / videnskab (planetarium m.m.)',
    },
  },
  viewMode: {
    aria: 'Dashboard-visning',
    annual: 'Årlig visning',
    seasonal: 'Sæsonpuls',
  },
  quarters: {
    Q1: { short: 'Q1 (vinter)' },
    Q2: { short: 'Q2 (sommer)' },
    Q3: { short: 'Q3 (sommer)' },
    Q4: { short: 'Q4 (vinter)' },
  },
  seasonal: {
    analysisTitle: 'Regnvejrsanalyse · {year}',
    insightDigital:
      'Digitalt forbrug i {municipality} stiger med {pct} i Q4 (vinter) sammenlignet med Q2 (sommer).',
    insightCold:
      'Biblioteks- og medieforbrug i {municipality} er {pct} højere i kolde kvartaler (Q1/Q4) end i varme kvartaler (Q2/Q3).',
    insightMuseum:
      'Indendørs museumstrafik i Q1 overstiger Q3 med {pct} — et klassisk regnvejrs-mønster.',
    insightPhysical:
      'Fysiske bogudlån topper på {q4} pr. borger i Q4 mod {q2} i Q2.',
    insightPeak:
      'Kulturforbrug i {municipality} topper i {quarter} ({season}) med {pct}% højere end {lowQuarter}.',
    cardTitle: 'Sæsonindsigt',
  },
  seasons: {
    winter: 'vinter',
    summer: 'sommer',
  },
}

type TranslationTree = typeof da

const en: TranslationTree = {
  meta: {
    title: 'KulturKlima — The Cultural Pulse of Denmark',
    description:
      'Explore library loans, museum visits, and culture metrics for all 98 Danish municipalities. Live data from Statistics Denmark (BIB1, MUS3, FOLK1A).',
  },
  header: {
    subtitle: 'Cultural data and municipal insight across Denmark.',
    audienceCultural: 'Culture sector',
    audienceMunicipal: 'Municipal insight',
    audienceGroupAria: 'Audience tags',
  },
  language: {
    switchToEn: 'English',
    switchToDa: 'Dansk',
    label: 'Language',
  },
  footer: {
    attribution:
      'Source: Own calculations and visualizations based on API data from Statistics Denmark (Tables: BIB1, MUS3, FOLK1A). Distributed under the Creative Commons Attribution 4.0 International license (CC BY 4.0).',
    dataSource:
      'Data: Danmarks Statistik (BIB1, MUS3, FOLK1A) — Distributed under CC BY 4.0.',
    liveApi: 'Live Statbank API',
    audienceNote:
      'Built for cultural institutions, creative professionals, and municipal planners.',
  },
  export: {
    csv: 'Export CSV',
  },
  data: {
    loading: 'Fetching live data from Statistics Denmark…',
    fetchError:
      'Could not fetch live data from Danmarks Statistik. Check your network or try again.',
    retry: 'Try again',
  },
  sidebar: {
    title: 'Municipalities',
    count: '{count} municipalities · ranked',
    searchPlaceholder: 'Search municipality…',
    searchAria: 'Search municipality',
    listAria: 'Municipality list',
    pinned: 'Quick links',
    all: 'All municipalities',
    noResults: 'No municipalities match "{query}"',
    mobileClose: 'Close municipality list',
    mobileFab: 'Choose municipality — {municipality}',
  },
  regions: {
    Hovedstaden: 'Capital Region',
    Midtjylland: 'Central Denmark',
    Nordjylland: 'North Denmark',
    Syddanmark: 'Southern Denmark',
    Sjælland: 'Zealand',
  },
  main: {
    noData: 'No data available for {municipality}.',
    residents: 'residents',
    statbankLive: 'Live Statbank',
    statbankRegional: 'MUS3 regional scale',
    seasonalActive: 'Rainy day overlay active · quarterly BIB1 pulse (modelled)',
    perCapita: 'per resident',
    perResident: 'Per resident',
  },
  stats: {
    libraryLoans: 'Library loans',
    museumVisits: 'Museum visits',
    population: 'Population',
    populationSub: 'FOLK1A · quarterly',
    cultureIndex: 'Culture index',
    cultureIndexSub: 'Loans + visits per resident',
    cultureIndexSubWeighted:
      'Weighted index · library loans + adjusted museum visits',
    hubMuseumNote:
      'Note: Museum attendance includes regional and international tourists, which inflates local per-capita tracking.',
    commuterMuseumNote:
      'Note: This municipality has fewer physical museum registries. Residents typically utilize cultural institutions across the wider {region}.',
    notAvailable: 'N/A',
    museumDataUnavailable: 'MUS3 data unavailable',
    metricInfoLabel: 'Methodology note',
  },
  bookworm: {
    title: 'Bookworm Index',
    descAnnual: 'Physical vs digital reading — 5-year trend per resident',
    descSeasonal: 'Quarterly physical vs digital reading — seasonal pulse',
    physical: 'Physical books / media',
    digital: 'Digital loans (eReolen / audio)',
    noSeasonalData: 'No seasonal data for {municipality}.',
    noData: 'No Bookworm data for {municipality}.',
    footnoteAnnual:
      '5-year trend · BIB1 · rising digital share shows migration pattern',
    footnoteSeasonal:
      'Quarterly BIB1 pulse · Q1/Q4 (winter) vs Q2/Q3 (summer) · digital loans rise in dark quarters',
    yAxis: 'Loans per resident',
    tooltipTotal: 'Total',
    perCapitaShort: 'res.',
    kpiTitle: 'Bookworm Index · {year}',
    booksPerCitizen: 'books / resident',
    totalLoans: 'Total loans',
    population: 'Population',
    avgLoans: 'Average library loans per resident in {year}',
    seasonalKpiTitle: 'Seasonal Pulse · {year}',
    digitalSpike: 'Digital spike Q4 vs Q2',
    q4Digital: 'Q4 digital',
    q2Digital: 'Q2 digital',
    coldQuartersNote:
      'Cold quarters (Q1/Q4) drive indoor media — {population} residents',
    q4Winter: 'Q4 (Winter)',
    q2Summer: 'Q2 (Summer)',
    peakCultureLift: 'Peak vs lowest quarter',
    peakQuarter: 'Peak quarter',
    lowQuarter: 'Lowest quarter',
    xAxisSeasonal: 'Quarter · {year}',
  },
  bib1: {
    title: 'BIB1 — Library loans',
    description: 'Physical materials vs e-books',
    physical: 'Physical materials (books etc.)',
    digital: 'E-books and digital loans',
  },
  museum: {
    title: 'Cultural Profile — Museum Mix',
    descAnnual: 'MUS3 · distribution of museum visits by type (regional scale)',
    descSeasonal: 'MUS3 · quarterly museum visits by type (regional scale)',
    noData: 'No museum data for {municipality}.',
    emptyTitle: 'No museum visit data for {municipality}',
    emptyDesc: 'MUS3 returned no registered entries for this region.',
    noCategoryData: 'No data',
    visits: 'visits',
    ofTotal: 'of total',
    dominant: 'Primary profile',
    ofVisits: 'of visits',
    footnoteSeasonal: 'Quarterly MUS3 · higher visits in Q1/Q4 (winter)',
    noScience: 'No registered public science data for this region.',
    categories: {
      KUNST: 'Art museums (art)',
      KULTUR: 'Cultural history museums',
      NATUR: 'Natural history / science (planetariums etc.)',
    },
  },
  viewMode: {
    aria: 'Dashboard view mode',
    annual: 'Annual View',
    seasonal: 'Seasonal Pulse',
  },
  quarters: {
    Q1: { short: 'Q1 (Winter)' },
    Q2: { short: 'Q2 (Summer)' },
    Q3: { short: 'Q3 (Summer)' },
    Q4: { short: 'Q4 (Winter)' },
  },
  seasonal: {
    analysisTitle: 'Rainy Day Analysis · {year}',
    insightDigital:
      'Digital consumption in {municipality} spikes by {pct} during Q4 (Winter) compared to Q2 (Summer).',
    insightCold:
      'Library and media consumption in {municipality} runs {pct} higher across cold quarters (Q1/Q4) than warm quarters (Q2/Q3).',
    insightMuseum:
      'Indoor museum traffic in Q1 exceeds Q3 by {pct} — a classic rainy day pattern.',
    insightPhysical:
      'Physical book loans peak at {q4} per resident in Q4 versus {q2} in Q2.',
    insightPeak:
      'Culture consumption in {municipality} peaks during {quarter} ({season}) by {pct}% compared to {lowQuarter}.',
    cardTitle: 'Seasonal Insights',
  },
  seasons: {
    winter: 'Winter',
    summer: 'Summer',
  },
}

export const translations: Record<Locale, TranslationTree> = { da, en }
