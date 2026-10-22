import { getLocalizedCases } from './cases.js'

// Curated showcases share one order. The complete case catalogue stays intact.
export const featuredDevelopmentSlugs = ['dds-service', 'ds-repair-solutions', 'comfort-lab']
export const moreDevelopmentSlugs = ['slavabud', 'comfort-home', 'bala-group']

export function getDevelopmentShowcase(lang) {
  const web = getLocalizedCases(lang).filter(item => item.category === 'development')
  const bySlug = new Map(web.map(item => [item.slug, item]))
  return {
    featured: featuredDevelopmentSlugs.map(slug => bySlug.get(slug)),
    more: moreDevelopmentSlugs.map(slug => bySlug.get(slug)),
    total: web.length,
  }
}
