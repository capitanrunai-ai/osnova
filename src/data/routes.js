// Single source of truth for the site's route shape.
// Imported both by the app (src/App.jsx) and by the build scripts
// (scripts/site-routes.mjs), so routing, prerendering and the sitemap
// can never drift apart.

export const defaultLanguage = 'en'

export const serviceRoutes = [
  'automation',
  'development',
  'performance',
  'seo',
  'ai-visibility',
  'email-deliverability',
]

export const notFoundRoute = '404'

// Static routes that exist in every language, in crawl-priority order.
// Case routes are appended from src/data/cases.js.
export const staticRoutes = ['', 'services', ...serviceRoutes.map(id => `services/${id}`), 'cases', 'payment']
