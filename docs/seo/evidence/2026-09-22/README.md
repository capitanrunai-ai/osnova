# Evidence — OSNOVA SEO baseline 2026-09-22

Это read-only измерения production; они не участвуют в сборке сайта.

- crawl.json — HTTP GET 68 URL sitemap + 11 вариантов, с timestamp UTC, status, redirects, headers, title/description, canonical/hreflang, headings, links и текстом. Снято 2026-09-21 22:13 UTC / 2026-09-22 00:13 Europe/Paris.
- url-inventory.csv — производная таблица всех 68 sitemap URL, UTF-8 BOM для Excel.
- robots.txt / sitemap.xml — копии ответов production, не production-конфигурация.
- assets.json — HEAD 24 ресурсов из HTML и MP3; неполный список CSS background resources.
- browser.json — 7 Chromium-сценариев, viewport 390×844. Метрики из этого файла без throttling и с возможным общим кешем: не использовать как field CWV и не сравнивать с Lighthouse.
- lighthouse-home-mobile.json / lighthouse-automation-mobile.json — Lighthouse 13.5.0, simulated mobile throttling, по одному прогону. runtimeError отсутствует. Windows cleanup EPERM после записи одного отчёта не изменил результаты.
- search-discovery.json — 34 сохранённых поисковых запроса и найденные URL (часть общего исследования); порядок результатов не является подтверждённым ranking Google. Дополнительные запросы и первичные источники указаны в основном отчёте.
- tasks-snapshot.json — все 26 задач с полями и критериями на момент аудита.
- verification.json — итог проверки структуры Notion и сохранённых измерений.

Репозиторий: https://github.com/capitanrunai-ai/osnova
HEAD и GitHub main: ffdbecab14ad44eef0f73fc2d8361d3fb84616b0.
Соответствие конкретному Netlify deploy SHA не установлено.

Notion:
- OSNOVA: https://app.notion.com/p/3e23f22d3563812788e7f3031c2a92e2
- SEO: https://app.notion.com/p/3e23f22d356381ca82a5c2558de3d71a
- Roadmap: https://app.notion.com/p/3e0d8424774946258e5abb1911b1850e

Повторный срез:
1. Использовать тот же набор canonical URL; изменения набора отметить отдельно.
2. Сохранить исходные HTTP-результаты и даты, затем проверить status/robots/canonical/alternate/внутренние ссылки.
3. Повторить Lighthouse той же версией и профилем на /en/ и /en/services/automation; для надёжного сравнения применять медиану нескольких прогонов, не смешивая её с единичным D0.
4. Дополнить фактическими GSC/analytics/backlinks/AI данными с датами окон. Н/Д не заменять нулём.
5. Обновлять рабочую страницу SEO, а D0-файл сохранять как неизменный исторический snapshot.

Ограничения доступа: прямой Google — CAPTCHA; PSI API — 429 quota; GSC/GA4/CRM/полный backlink index не доступны. Формы, звонки, внешние сообщения и deployment не выполнялись.

