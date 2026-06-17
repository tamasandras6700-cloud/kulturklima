type Translate = (key: string) => string

const JSON_LD_ID = 'kulturklima-jsonld'

function siteUrl(): string {
  const configured = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')
  if (configured) return configured
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string,
): void {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string, hreflang?: string): void {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`

  let el = document.querySelector(selector) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    if (hreflang) el.hreflang = hreflang
    document.head.appendChild(el)
  }
  el.href = href
}

function upsertJsonLd(url: string, locale: 'da' | 'en', t: Translate): void {
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'KulturKlima',
    description: t('meta.description'),
    url,
    inLanguage: locale === 'da' ? 'da-DK' : 'en',
    applicationCategory: 'DataApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    isBasedOn: {
      '@type': 'Dataset',
      name: 'Danmarks Statistik Statbank',
      url: 'https://www.dst.dk/',
      description: 'BIB1, MUS3, and FOLK1A municipal statistics',
    },
  }

  let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = JSON_LD_ID
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(payload)
}

/** Sync document title, social previews, canonical URL, and JSON-LD. */
export function applyPageSeo(locale: 'da' | 'en', t: Translate): void {
  const title = t('meta.title')
  const description = t('meta.description')
  const url = siteUrl() || '/'
  const canonical = url.endsWith('/') ? url : `${url}/`
  const image = `${canonical.replace(/\/$/, '')}/favicon.svg`

  document.title = title

  upsertMeta('name', 'description', description)
  upsertMeta('name', 'robots', 'index, follow, max-image-preview:large')

  upsertLink('canonical', canonical)

  upsertLink('alternate', canonical, 'da')
  upsertLink('alternate', canonical, 'en')
  upsertLink('alternate', canonical, 'x-default')

  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:site_name', 'KulturKlima')
  upsertMeta('property', 'og:locale', locale === 'da' ? 'da_DK' : 'en_US')
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', canonical)
  upsertMeta('property', 'og:image', image)

  upsertMeta('name', 'twitter:card', 'summary')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', image)

  if (siteUrl()) {
    upsertJsonLd(canonical.replace(/\/$/, ''), locale, t)
  }
}
