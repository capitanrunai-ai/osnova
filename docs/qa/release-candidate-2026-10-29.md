# Local release candidate — 29 October 2026

## Git inventory

Production baseline: `5ddc547177ec1f71f9266f0a43925032d59c4899`.
Initial local HEAD: `847cead8d52e4f1b45a1e9b075d4b6a1794105b1`.
Initial worktree was clean. The baseline is an ancestor of HEAD.
Inventory comes from local Git, not the historical Production backlog.

Commits after the baseline, in order:

1. `140beb31b4f3061549ca2922e9ff90a7fb9f900d` — localized service copy, responsive headlines, separation of heroes and product sections, removal of duplicate trust case lists, updated audits.
2. `4bff3aee43fabaf941d900d8a3e29d9271404784` — SEO service mobile flow and CTA fixes; verified BALA GROUP case copy/screenshots and service attribution; corresponding evidence and regression checks.
3. `847cead8d52e4f1b45a1e9b075d4b6a1794105b1` — Email Deliverability aligned with confirmed diagnostic/remediation scope across RU / EN / DE / UK.
4. The accompanying Terms commit — implements the missing public Terms, adds contextual links and aligns approved support conditions.

## Terms decision and scope

No public Terms route existed at initial HEAD. Implemented `/ru/terms`, `/en/terms`, `/de/terms`, `/uk/terms` using the existing route/prerender/sitemap architecture.

Source: [approved Service Terms brief](https://app.notion.com/p/4013f22d356381b3bbb4f1297d3b7fb4), especially section 22, final cancellation model dated 22 October 2026.

- Written scope, price, timing, external costs and deliverables before starting.
- 30% advance toward total price / 70% after approval and before handover; staged complex Automation by proposal.
- Itemised B2B settlement; no automatic forfeiture of all 30%.
- B2C withdrawal, separate early-start request, proportional payment, crediting the advance, refund timing and conditions for loss of withdrawal after full performance.
- Pause after more than seven days without contact; workload-dependent 48-hour restart target, not SLA.
- Development: 45-day fixes in approved scope. Automation: 45-day own-bug fixes and 2–3 initial small changes.
- Support / Monitoring and Managed Automation remain distinct. Universal support hours removed; critical own-fault repair timing is a target, not SLA or first-response commitment.
- Links in enquiry form context, payment context and every footer. No checkout, order UI or mandatory enquiry checkbox added.
- No legal entity, address, registration/VAT number or jurisdiction invented. Provider identity, applicable charges and order-specific information are supplied in the written offer before confirmation. Unresolved legal/tax decisions from the brief are not treated as established facts.
- No new Privacy Policy created; Terms are explicitly separate from privacy information.

## Verification

All checks are local. Form deliveries and production-host analytics requests were intercepted; no real lead or analytics was transmitted.

- Build with `SITE_URL=https://osnovaai.com`: PASS; 96 prerendered localized documents plus generic fallback.
- `verify:seo`: PASS; 92 indexable URLs and four localized 404 pages. The four new Terms URLs use the existing canonical/hreflang/sitemap mechanism. No schema or SEO strategy changes.
- `verify:analytics`: PASS.
- `audit:predeploy`: PASS; 368 page layouts at 320/390/768/1440px, 184 URL variants, 1,736 internal links, 92 language switches, no errors/findings/external requests.
- `audit:case-services`: PASS; 232 layouts, 1,676 internal links, no errors.
- `audit:performance`: PASS; localized preloads, hydration, cached navigation, analytics blocked before consent and after decline, acceptance, four intercepted form submissions and delivery retry.
- `audit:contact`: PASS; 66 handler checks with local stubs.
- `audit:contact-form`: PASS; 28 layouts, all nine directions, validation and optional fields, 280 local stub deliveries, no external requests.
- `audit:terms`: PASS on final build; 16 layouts, 24 context links/history checks, no split H1 words, overflow or required enquiry checkbox.
- Email Deliverability: PASS on final build; RU / EN / DE / UK at 1440/390/320px, CTA selects the service, no overflow or browser errors.
- Visual review of desktop/mobile Terms; corrected German H1 wrapping at 320px.

Raw local screenshots and JSON reports are under ignored `.visual-audit/` directories.

## Hold and remaining work

The Email Deliverability commit remains in the release chain. Its locale files, shared email summaries and CSS are unchanged by this task. Terms do not extend its scope to recurring monitoring or guarantee inbox placement.

Compared with initial HEAD, all prices, commercial metadata, Development copy and Automation titles remain unchanged. Automation changes are limited to approved support conditions. No new SEO work before D60. No further unfinished approved site implementation was identified within the checked Git/brief package.

No push. No deploy. This is a local release candidate, not a publication record.
