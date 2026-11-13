import { describe, expect, it } from "vitest"

import { buildGoogleDork, buildGoogleSearchUrl } from "./google-dork"

describe("buildGoogleDork", () => {
  it("returns only the site operator when no options given", () => {
    expect(buildGoogleDork()).toBe("site:linkedin.com/in/")
    expect(buildGoogleDork({})).toBe("site:linkedin.com/in/")
  })

  it("quotes job title and keywords", () => {
    expect(buildGoogleDork({ jobTitle: "Software Engineer", keywords: ["hiring"] })).toBe(
      'site:linkedin.com/in/ "Software Engineer" "hiring"'
    )
  })

  it("keeps field order: title, company, school, location, keywords", () => {
    expect(
      buildGoogleDork({
        keywords: ["python"],
        location: "Delhi",
        school: "IIT Delhi",
        company: "Google",
        jobTitle: "University Recruiter"
      })
    ).toBe(
      'site:linkedin.com/in/ "University Recruiter" "Google" "IIT Delhi" "Delhi" "python"'
    )
  })

  it("skips empty and whitespace-only terms", () => {
    expect(
      buildGoogleDork({ jobTitle: "   ", company: "", keywords: ["", "  ", "ml"] })
    ).toBe('site:linkedin.com/in/ "ml"')
  })

  it("trims and collapses inner whitespace", () => {
    expect(buildGoogleDork({ jobTitle: "  Data    Scientist  " })).toBe(
      'site:linkedin.com/in/ "Data Scientist"'
    )
  })

  it("strips double quotes inside terms so output stays valid", () => {
    expect(buildGoogleDork({ jobTitle: 'Senior "Staff" Engineer' })).toBe(
      'site:linkedin.com/in/ "Senior Staff Engineer"'
    )
  })

  it("adds excluded terms with minus prefix", () => {
    expect(
      buildGoogleDork({ jobTitle: "Recruiter", excludeKeywords: ["agency", " "] })
    ).toBe('site:linkedin.com/in/ "Recruiter" -"agency"')
  })

  it("does not mutate input arrays", () => {
    const keywords = [" a ", "b"]
    buildGoogleDork({ keywords })
    expect(keywords).toEqual([" a ", "b"])
  })
})

describe("buildGoogleSearchUrl", () => {
  it("url-encodes the dork", () => {
    const url = buildGoogleSearchUrl('site:linkedin.com/in/ "Data Scientist"')
    expect(url).toBe(
      "https://www.google.com/search?q=site%3Alinkedin.com%2Fin%2F%20%22Data%20Scientist%22"
    )
  })
})
