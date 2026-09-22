# Automation cases handoff — 2026-09-22

## Что сделано

- Добавлены реальные кейсы **AI News Automation** и **Retail Stock & Availability Monitor** в существующий массив портфолио и его detail-шаблон.
- Сделаны компактные карточки портфолио, галереи с сохранением пропорций, мобильной горизонтальной прокруткой и увеличением изображения. Изображения ниже первого экрана загружаются лениво.
- Добавлены краткие блоки задачи, решения, workflow, возможностей, роли AI, роли человека и каналов. В текстах нет метрик, вымышленных клиентов и партнёрств.
- Количества в audit-скриптах теперь рассчитываются из массива кейсов.

## Изменённые файлы

- `src/App.jsx` — ссылки на кейсы со страницы Automation и корректная подпись карточек.
- `src/PortfolioMedia.jsx` — превью, detail-блок и просмотр скриншотов.
- `src/data/cases.js` — подключение новых кейсов и подписи интерфейса на четырёх языках.
- `src/data/automationCases.js` — данные и локализации обоих кейсов.
- `src/portfolio.css` — desktop/mobile стили карточек, кейсов, галерей и связанного блока Automation.
- `scripts/portfolio-audit.mjs` — проверки количества из источника данных.
- `scripts/cases-navigation-audit.mjs` — проверка automation-фильтра из источника данных.
- `docs/handoff/2026-09-22-automation-cases-handoff.md` — этот файл.

## Новые assets и исходные скриншоты

| Кейс | Исходник в корне | Production asset |
| --- | --- | --- |
| AI News Automation | `Screenshot_1.png` | `public/assets/cases/ai-news-review-1.webp` |
| AI News Automation | `Screenshot_2.png` | `public/assets/cases/ai-news-review-2.webp` |
| AI News Automation | `Screenshot_3.png` | `public/assets/cases/ai-news-review-3.webp` |
| Retail Stock & Availability Monitor | `h.png` | `public/assets/cases/retail-stock-alerts-1.webp` |
| Retail Stock & Availability Monitor | `hh.png` | `public/assets/cases/retail-stock-alerts-2.webp` |

WebP-копии сделаны без увеличения исходных размеров. Файлы из корня не используются сайтом напрямую.

## Тексты и локализации

- **RU / EN / DE / UK:** одинаковые факты в summary, задаче, решении, шагах, возможностях, ролях AI и человека, интеграциях, подписях скриншотов и пояснениях об источниках.
- News: мониторинг заданных источников, разбор и AI-анализ, тема и важность, выжимка и адаптированный текст, возможные дубли, настройка формата и изображения, решение редактора в Telegram.
- Retail: выбранные товары и размеры, проверка наличия, Telegram-уведомление с магазином, товаром, размером, ссылкой и временем. AI в показанном сценарии не используется.
- Публикации в новостном кейсе указаны только как источники. Zara Spain и Bershka Spain указаны только как отслеживаемые магазины.

## Portfolio, routes и internal linking

- Портфолио содержит **9 кейсов** вместо 7; automation-фильтр показывает **3 кейса**. Главная, страница `/cases`, счётчики, prev/next и мобильный swipe используют существующий источник данных.
- Добавлены маршруты `/[lang]/cases/ai-news-automation` и `/[lang]/cases/retail-stock-monitor` для RU/EN/DE/UK. Prerender и sitemap получили по 8 новых локализованных URL без отдельного списка маршрутов.
- Страница `/[lang]/services/automation` ссылается на AI Voice, AI News Automation и Retail Stock & Availability Monitor. Оба новых кейса ссылаются обратно на Automation.

## Проверки

- `SITE_URL=https://osnovaai.com npm run build` — **PASS**: 80 prerendered documents и `dist/404.html`, 76 URL в sitemap.
- `SITE_URL=https://osnovaai.com npm run verify:seo` — **PASS**: 76 индексируемых страниц и 4 страницы 404.
- `npm run verify:analytics` — **PASS**: 9 service slugs, 4 языка; в событиях нет полей формы или секретов.
- `npm run audit:cases` — **PASS**: 48 route/layout checks, нет ошибок браузера; проверены старые кейсы и AI Voice.
- `npm run audit:cases-navigation` — **PASS**: drag, trackpad, mobile swipe, back, переключение языка.
- Браузерная проверка новых detail-страниц на 1440 и 390 px для RU/EN/DE/UK — **PASS**: картинки загружены после прокрутки, нет горизонтального переполнения, lightbox открывается и закрывается, ссылки на Automation и prev/next есть. Также проверены главная и три ссылки Automation во всех языках. Отчёт и локальные скриншоты находятся в игнорируемой `.visual-audit/`.
- Consent и отправка analytics на production host не проверялись локально: код включает их только на `osnovaai.com`. Реальные формы не отправлялись.

## Перед production

- Просмотреть новые кейсы и скриншоты на реальном домене после публикации, включая мобильный viewport и работу consent/analytics на production host.
- Убедиться, что production pipeline выставляет `SITE_URL=https://osnovaai.com`.

## Local commit и рабочее дерево

- Родительский commit: `334cfbdf96a6a27ecfa90b8e06563ec6693d035a`.
- Точный hash нового commit: `git rev-parse HEAD` после создания commit. Сам hash нельзя записать в содержимое этого же commit: изменение файла меняет hash. Точное значение также будет в финальном отчёте.
- Существующие untracked не включены: `docs/seo/`, `Screenshot_1.png`, `Screenshot_2.png`, `Screenshot_3.png`, `Screenshot_4.png`, `h.png`, `hh.png`.
- Push и deploy не выполнялись.
