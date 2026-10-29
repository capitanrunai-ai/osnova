# Local review: SEO mobile UX and BALA GROUP

HEAD before: `140beb31b4f3061549ca2922e9ff90a7fb9f900d`.

SEO interactive flow: a single selected explanation replaces the decorative query/result stack. Five real buttons select query, results, business listing, visit and enquiry. The indicator follows selection. Buttons support Tab, Enter, Space, arrows, Home and End, expose `aria-pressed` and `aria-controls`, and have visible keyboard focus and 48px height. Inactive panels are hidden visually and from accessibility APIs. Panels share one grid cell, reserving the tallest explanation's height. Reduced motion follows the existing global OSNOVA rule. Selection does not change the URL.

SEO mobile: the four explanatory stages are vertical below 640px, use two columns on tablet and retain four on desktop. No horizontal scrolling is needed for those stages. The interactive explanation uses the viewport width with all five controls visible.

Copy updated in RU / EN / DE / UK. Ukrainian examples:

- Journey: «Як клієнт знаходить вашу компанію».
- SEO process: «З’ясуємо, що заважає сайту в пошуку.» The steps explain inspection, priority fixes and continuing work based on data.
- SEO + AI: «Як компанію знаходять у Google та AI». The introduction distinguishes page results from generated answers and sources; the closing text explains accurate information, structure and verifiable facts.
- AI process: «Почнемо з того, що про компанію вже можна дізнатися.»
- Email process: «Знайдемо причину проблем із доставкою листів.» Steps cover the example, diagnosis, configuration changes and a new delivery test.
- Adjacent Automation process: «З’ясовуємо, яку роботу потрібно автоматизувати.»
- Shared commercial process: «Як працюватимемо над вашим проєктом». The existing contractual steps and payment terms are unchanged.

BALA GROUP keeps its existing entry, order and `/LANG/cases/bala-group` routes. Correct live project: https://balagroup.com.ua. Summary in Ukrainian: «Адаптивний сайт BALA GROUP, створений OSNOVA приблизно за 24 години, з базовою SEO-структурою.»

Facts: the client needed a working business website; OSNOVA assembled the initial structure with basic SEO logic, built the responsive website and handled technical launch in approximately 24 hours. The result is a published commercial website where visitors can explore services and contact the company. There are no traffic, ranking, lead, conversion, ROI or advertising-performance claims.

Tracking was checked against the correct project. Its public Google Tag Manager container `GTM-WCH7P5PC` contains Google tag `G-JCJSG6ZJ4E`. The case therefore says only that Google tag is connected through Google Tag Manager. The previous Google Ads attribution is removed from BALA GROUP. No OSNOVA analytics configuration changed.

All three existing WebP assets were replaced with fresh desktop, mobile and detail captures from the correct live domain. The capture script now uses the correct URL. Superseded case records, outbound links, old page text and asset observations were removed from historical evidence; they were not rewritten as historical measurements. Other case facts and the Development order remain unchanged.

Validation completed locally:

- Production build with `SITE_URL=https://osnovaai.com`: 92 prerendered documents, plus fallback 404; 88 sitemap URLs.
- `scripts/seo-verify.mjs`: 88 indexable pages, four 404 pages, canonical / hreflang / metadata / sitemap checks passed.
- `scripts/analytics-verify.mjs`: passed.
- `scripts/seo-mobile-case-audit.mjs`: 112 page/language/viewport combinations at 320, 375, 390, 430, 768, 1280 and 1440px; 88 internal links and the live project URL passed. No console, runtime or resource errors. Tap, keyboard, focus, ARIA, touch targets, indicator position, stable height and reduced motion passed.
- After refining the tracking label, BALA GROUP was rechecked across all seven widths and four languages: 28 additional combinations passed, including images, tracking text, listing/showcase links, canonical and hreflang.
- `scripts/design-qa.mjs`: all four languages at desktop and mobile passed, including visuals, evidence, prices, service/case links, hero and Automation CTA.
- Visual inspection of generated mobile, tablet and desktop screenshots confirmed readable steps and consistent OSNOVA presentation. Fresh BALA desktop, mobile and detail captures were also inspected.
- `git diff --check`: passed. Search of current source, generated output and local audit files found no obsolete external BALA domain after cleanup.

Local screenshots and machine reports: `.visual-audit/seo-mobile-case/` and `.visual-audit/design-local/` (ignored generated artifacts).

No GitHub push. No Netlify deploy. Status: READY FOR REVIEW.
