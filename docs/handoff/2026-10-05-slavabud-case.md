# SLAVABUD / BK SLAVA — local release package

Base OSNOVA HEAD: `f921d4179b6f0d0bba7fba969d52482a39071f6d`.
No OSNOVA push or production deployment is part of this task.

## Delivery facts confirmed by the owner

Business website for a construction and renovation company, created from
scratch after a referral. Initial input: company information, services and a
colour preference. OSNOVA delivered the information architecture, all copy,
design and visual concept, logo intro, frontend and responsive implementation,
domain and hosting setup, enquiry forms with Telegram delivery, Google Ads
tracking / Google tag and preparation for advertising traffic. Project and
GitHub were set up under the client's email; code and all access were handed
over. Approximately two days from brief to a published working version.
SEO was outside scope. No advertising, revenue, lead-volume or SEO metrics
are claimed.

## Screenshot provenance

Captured directly from the public live site on 2026-10-05, without submitting
forms. `scripts/capture-slavabud.mjs` skips the repeat intro and blocks ad and
analytics requests during capture. No local Slavabud images were copied.

| Asset | Source | Size | SHA-256 |
| --- | --- | --- | --- |
| slavabud-desktop.webp | https://slavabud.com.ua/ | 1440 × 960 | 0c18ecefd0ac59139010893c94fa2057d8f577827bed25793bec8ad1898a5fa8 |
| slavabud-mobile.webp | https://slavabud.com.ua/ | 390 × 844 | 3c80c5bed458ff46cb1eb8adb84f5a86404e1aa66bf9e73be83cffe673c04f5e |
| slavabud-detail.webp | https://slavabud.com.ua/portfolio/ | 1440 × 960 | 642c3163f9c1e0334a24a5a970f7eea626e20354e394836aaaf0039250c61172 |

These are evidence of the website interface at capture time. They are not
standalone photographs proving the client's construction work. The latest
owner instruction explicitly accepts live website screenshots as web proof;
local demo images are not used as separate construction evidence.

## Integration

- `/ru/cases/slavabud`, `/en/cases/slavabud`, `/de/cases/slavabud`,
  `/uk/cases/slavabud`; routes, canonical, hreflang, prerender and sitemap
  derive from the existing case collection.
- Portfolio card, home web portfolio and Development links use that same
  collection. The detail page has one backlink to Development.
- Google Ads installation is a technical scope fact on SLAVABUD, BALA GROUP,
  COMFORT HOME and both RETATRUTIDE projects. DDS SERVICE and COMFORT LAB
  have no tracking claim. The shared detail component localizes this fact.
- Existing layouts, services, Trust, automation cases, audio, forms, backend,
  consent and analytics remain in place.

## Release checks

Build/prerender, SEO, analytics, built case/service audit (including tracking
exceptions and SLAVABUD scope), portfolio/audio/navigation and production
performance audit are the validation gates for this package. Local reports
and screenshots are under ignored `.visual-audit/`.

Completed checks:

- Build PASS: 84 localized prerender documents plus generic 404; entry JS
  442.07 kB / 134.07 kB gzip, no >500 kB warning.
- SEO PASS: 80 indexable pages, 4 localized 404 pages and 80 sitemap URLs;
  canonical and hreflang verified.
- Built case/service audit PASS: 216 layouts and 1396 internal links, tracking
  flags/exceptions, new case scope and media, four languages, 320–1440px,
  delivery label visibility, no browser errors or failures.
- Portfolio/audio PASS: 52 route/layout checks; filters, keyboard, returning
  to the portfolio, playback/pause/seek/speed and 249.754s duration.
- Navigation PASS: pointer/drag, trackpad, native touch swipe/open, history,
  reduced motion and language switching with the case preserved.
- Analytics and performance audits PASS: localized service IDs, consent,
  cached SPA navigation and four intercepted form submissions; no live leads.
- Screenshot SHA-256 provenance and exact five tracking cases verified.

The next general production release must include this commit and its parent
Trust/performance commits. After publication, smoke-check the new routes,
screenshots and links. No separate production release is authorized here.
