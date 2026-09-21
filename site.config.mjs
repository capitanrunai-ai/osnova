// Production origin for canonical URLs, Open Graph, sitemap and robots.txt.
// Production builds set SITE_URL explicitly. The localhost fallback exists only
// so a developer can build and inspect the project without publishing stale
// production metadata from a previous deployment.
export const siteUrl = (process.env.SITE_URL || 'http://localhost:5173')
  .trim()
  .replace(/\/+$/, '')
