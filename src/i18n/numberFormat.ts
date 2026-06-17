import type { Locale } from './translations'

/** BCP 47 tags for Intl — da: 7,1 / 673.438 · en: 7.1 / 673,438 */
export function getNumberLocale(locale: Locale): string {
  return locale === 'da' ? 'da-DK' : 'en-US'
}

export interface NumberFormatters {
  formatNumber: (value: number) => string
  formatCompact: (value: number) => string
}

export function createNumberFormatters(numberLocale: string): NumberFormatters {
  const standard = new Intl.NumberFormat(numberLocale, {
    maximumFractionDigits: 1,
  })

  const compact = new Intl.NumberFormat(numberLocale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  })

  return {
    formatNumber: (value: number) => standard.format(value),
    formatCompact: (value: number) => compact.format(value),
  }
}
