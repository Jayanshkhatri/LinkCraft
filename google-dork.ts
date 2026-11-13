/**
 * Google dork builder for LinkedIn public profile search.
 *
 * Pure TypeScript: no DOM, no network, no extension APIs.
 * Builds a search string only. It does not run the search.
 */

export interface DorkOptions {
  jobTitle?: string
  company?: string
  school?: string
  location?: string
  /** Extra phrases that must appear. */
  keywords?: string[]
  /** Phrases that must not appear. */
  excludeKeywords?: string[]
}

const PROFILE_SITE = "site:linkedin.com/in/"

/** Trim, collapse inner whitespace, strip double quotes. Returns "" if nothing left. */
function clean(term: string | undefined): string {
  if (!term) return ""
  return term.replace(/"/g, "").replace(/\s+/g, " ").trim()
}

function quote(term: string): string {
  return `"${term}"`
}

/**
 * Build a Google dork string for LinkedIn profiles.
 *
 * Every term is wrapped in quotes so Google matches it as an exact phrase.
 * Empty or whitespace-only terms are skipped. With no usable terms,
 * only the `site:` operator is returned.
 *
 * @example
 * buildGoogleDork({ jobTitle: "Software Engineer", keywords: ["hiring"] })
 * // 'site:linkedin.com/in/ "Software Engineer" "hiring"'
 */
export function buildGoogleDork(options: DorkOptions = {}): string {
  const { jobTitle, company, school, location, keywords = [], excludeKeywords = [] } = options

  const include = [jobTitle, company, school, location, ...keywords]
    .map(clean)
    .filter(Boolean)
    .map(quote)

  const exclude = excludeKeywords
    .map(clean)
    .filter(Boolean)
    .map((term) => `-${quote(term)}`)

  return [PROFILE_SITE, ...include, ...exclude].join(" ")
}

/** Turn a dork string into a Google search URL. */
export function buildGoogleSearchUrl(dork: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(dork)}`
}
