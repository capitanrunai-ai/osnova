# Web cases handoff — 2026-09-22

## Что изменено

Усилены три существующих web-кейса: DDS SERVICE, BALA GROUP и COMFORT HOME. В общем detail-шаблоне только для них добавлен компактный блок «задача / работа / срок / результат» перед текущими скриншотами и ссылка на услугу Development. Карточки, live-ссылки, скриншоты и остальные кейсы сохранены.

## Опубликованные факты

| Кейс | Задача | Работа и результат | Срок |
| --- | --- | --- | --- |
| DDS SERVICE | Понятно показать автосервис, направления ремонта и обслуживания, дать путь к нужной услуге или контакту. | Структура информации, представление услуг, путь пользователя, адаптивная разработка; рабочий сайт опубликован. | 2–3 дня. |
| BALA GROUP | Клиент пришёл по рекомендации за коммерческим сайтом специально для трафика Google Ads. | Структура страницы, адаптивная разработка под ключ, подготовка проекта, домен и хостинг; сайт запущен. | Примерно 1 день. |
| COMFORT HOME | После потери доступа к исходному сайту осталась только публичная live-ссылка. | Доступные элементы воспроизведены по публичной версии; недостающие восстановлены и доработаны. Рабочая версия подготовлена к публикации и доступна по live-ссылке. | Примерно 1 день. |

Сроки относятся только к этим проектам. Бизнес-метрики, отзывы и результаты Google Ads не добавлены. COMFORT HOME описан как восстановление, без утверждения о дизайне исходного сайта с нуля.

## Файлы

- `src/data/cases.js` — факты и локализации трёх кейсов, а также флаг связи с Development.
- `src/PortfolioMedia.jsx` — фактический блок и обратная ссылка в общем detail-шаблоне.
- `src/portfolio.css` — стили блока на desktop/mobile и общий стиль связанных кейсов для Automation и Development.
- `src/App.jsx` — три ссылки на кейсы со страницы Development; ссылки берутся из `getLocalizedCases` по флагу кейса.
- `docs/handoff/2026-09-22-web-cases-handoff.md` — этот handoff.

Новых assets и новых case routes нет.

## Локализация и ссылки

- RU, EN, DE, UK: одинаковые факты в summary, задаче, работе, сроке и результате. Подписи нового блока и CTA переведены для каждого языка.
- `/[lang]/services/development` → DDS SERVICE, BALA GROUP, COMFORT HOME.
- Каждый из трёх case detail → `/[lang]/services/development`.
- Существующий блок ссылок Automation сохранён; его CSS-класс обобщён для обеих услуг без изменения вида.

## Проверки

- `SITE_URL=https://osnovaai.com npm run build` — **PASS**: 80 prerendered documents, 76 sitemap URL.
- `SITE_URL=https://osnovaai.com npm run verify:seo` — **PASS**: 76 индексируемых страниц, 4 страницы 404.
- `npm run verify:analytics` — **PASS**: 9 service slugs, 4 языка.
- `npm run audit:cases` — **PASS**: 48 проверок страниц/layout, без browser errors.
- `npm run audit:cases-navigation` — **PASS**: desktop drag/trackpad, mobile swipe, browser back, переключение языка.
- Отдельная браузерная проверка трёх кейсов на 1440 и 390 px в RU/EN/DE/UK — **PASS**: 24 detail-варианта, сроки и блоки, изображения, live-ссылки, prev/next, обратные ссылки и отсутствие horizontal overflow. Проверены 8 вариантов страницы Development (4 языка × 2 viewport). Локальные отчёт и снимки — в игнорируемой `.visual-audit/`.
- Regression-проверка Automation — **PASS**: ссылки на три automation-кейса и их detail-страницы в RU/EN/DE/UK на обоих viewport.
- Все три существующие live-ссылки на момент проверки отвечали HTTP 200. Реальные формы не отправлялись.

## Перед production

- Проверить визуальное отображение и переходы после публикации на реальном домене, включая mobile.
- Убедиться, что production pipeline задаёт `SITE_URL=https://osnovaai.com`.
- Проверить consent и analytics на production host; локальный host намеренно не активирует их отправку.

## Commit chain и состояние

Новый отдельный commit создаётся поверх текущего `4d17b13cc28547905b257b74db4fce9f9d1111b2`. Предыдущая последовательность:

1. `4d17b13cc28547905b257b74db4fce9f9d1111b2` — automation case studies.
2. `334cfbdf96a6a27ecfa90b8e06563ec6693d035a` — mobile performance and hydration.
3. `77a730c25f7d6f72c100fd12605c4c28417b9450` — consent-gated GA4.
4. `adec4a36730ebda60e00cd2f101b09e67ffb7799` — root URL fallback.

Hash нового commit: `git rev-parse HEAD` после его создания; точное значение приведено в финальном отчёте. Его нельзя записать в содержимое того же commit, поскольку это изменит hash.

Существующие untracked оставлены вне commit: `docs/seo/`, `Screenshot_1.png`, `Screenshot_2.png`, `Screenshot_3.png`, `Screenshot_4.png`, `h.png`, `hh.png`. Push и deploy не выполнялись.
