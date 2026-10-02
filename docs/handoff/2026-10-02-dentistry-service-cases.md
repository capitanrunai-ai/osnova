# Dentistry / service cases — пакет для следующего общего release

## Изменения

- Существующий маршрут `/[lang]/cases/ai-voice-operator` теперь представляет **Dentistry — AI Voice**, реальный проект стоматологической клиники. Название сохранено во всех четырёх языках. Новых case routes нет.
- Добавлены задача, реализация, возможности, роли AI и сотрудника, API-интеграции, транскрипция и доставка контекста в Telegram. Дальнейшие подключения к бизнес-процессам описаны как отдельно согласуемые расширения.
- Существующая запись `/assets/cases/primer.mp3` и плеер сохранены. Текст описывает запись стоматологического сценария Dentistry и язык аудио. Запись не используется как доказательство реальных записей пациентов или коммерческих результатов. ROI, выручка, число звонков и другие неподтверждённые показатели не добавлены.
- Dentistry использует существующие audio layout и блоки automation case study; добавлена одна ссылка обратно на Automation. Существующие analytics event IDs плеера сохранены.
- Automation по-прежнему ведёт на Dentistry, AI News Automation и Retail Stock & Availability Monitor; каждый кейс ведёт обратно на Automation.
- Development сохраняет основные DDS SERVICE, BALA GROUP и COMFORT HOME. В существующем компактном формате добавлены остальные web-проекты портфолио: RETATRUTIDE — SILVER SIGNAL, COMFORT LAB и RETATRUTIDE — LANDING PAGE. Все шесть detail pages имеют одну обратную ссылку на Development.
- Web-кейсы не представлены как результаты SEO, ROAS, рекламы или роста бизнеса. Существующий контекст разработки BALA GROUP для Google Ads сохранён без утверждений о результативности рекламы.
- CSS, существующие hero/cards/case layouts, приоритет Development и структура шести услуг сохранены.

## Automation offer

Существующие цены сохранены: простой бот €149; интеграция/мониторинг €250–300; AI-ассистент €350–500; Telegram Web App, custom business automation и AI Voice — индивидуально. Стартовый scope до трёх основных сценариев, оплата 30%/70% или по этапам, передача после полной оплаты и 45 дней исправлений собственной реализации уже соответствовали модели.

Добавлены отсутствовавшие сроки: простая автоматизация до 24 часов при готовых материалах и согласованном объёме; средняя 2–5 дней; сложная — индивидуально. Уточнены 2–3 небольших изменения в стартовой поддержке, отдельная оплата внешних API/сервисов/ресурсов клиентом и отличие поддержки €49–99/мес. от Managed €150/€300/€700–800+/мес. Подпись общего блока теперь включает Support и Managed Automation.

Мониторинг может быть 24/7; человеческая поддержка ежедневно примерно 09:00–23:00. European time интерпретировано как центральноевропейское CET/CEST (для DE: MEZ/MESZ). До 24 часов для критического инцидента обозначено как целевой срок исправления. Тарифы и лимиты зависят от решения и нагрузки. Существующий CTA нестандартной задачи сохранён.

Немецкое название продукта Business Automation уточнено до «Individuelle Automatisierung»: прежнее длинное слово оставляло одну букву на последней строке desktop-карточки. Новый QA gate проверяет такой перенос заголовков продуктов во всех языках и размерах.

## QA

Все публичные изменения проверены для RU / EN / DE / UK.

| Проверка | Результат |
| --- | --- |
| `SITE_URL=https://osnovaai.com npm run build` | PASS: 80 HTML documents + общий 404, 76 sitemap URLs |
| `npm run verify:seo` с тем же SITE_URL | PASS: 76 индексируемых страниц, 4 локализованных 404; canonical/hreflang/sitemap/robots |
| `npm run verify:analytics` | PASS: 9 service slugs, 4 языка, production host и consent guards, отсутствие полей формы/секретов в событиях |
| `npm run audit:cases` | PASS: 48 layout/route checks; play/pause/seek/speed, длительность записи 249.754 s; browser errors отсутствуют |
| `npm run audit:cases-navigation` | PASS: drag, trackpad, native mobile swipe/open, browser back, reduced motion, переключение языка с сохранением кейса |
| `npm run audit:typography` | PASS: 160 страниц/размеров; существующие требования не ослаблялись |
| `npm run audit:mobile` | PASS: 312 вариантов; 320/360/375/390/412/430 px, меню и landscape; нет overflow, tiny body или small target failures |
| Новый `npm run audit:case-services` | PASS: 200 вариантов готовой prerendered сборки, 1260 внутренних ссылок, включая якоря; все 9 кейсов и обе услуги; доказательства/изображения, audio metadata, цены и условия; browser errors отсутствуют |
| Дополнительная браузерная проверка | PASS: 72 реальных перехода service → case → service, 4 языка × mobile/desktop, все связанные кейсы |
| `node scripts/closing-check.mjs` | PASS: 24 layouts, 24 перехваченные отправки формы и directory links |
| Visual QA | Dentistry, Automation offer и связанные проекты: mobile/desktop, все языки; локальные PNG в игнорируемой `.visual-audit/` |
| `git diff --check` | PASS |

Vite сообщает предупреждение о JS chunk больше 500 kB. Build проходит; порог предупреждения не изменён. Разделение bundle можно рассмотреть отдельно, без изменения объёма этого пакета.

Формы тестировались с перехватом `/api/contact`: реальные Telegram-сообщения не отправлялись. Production-only GA/consent delivery и фактическая доставка live-заявки требуют smoke check при следующем release. Код форм, Telegram integration, analytics и consent не менялся.

## GitHub и production

Пакет подготовлен поверх `3276d6a90b4f9a14d1f7b9267a66bf076d51811d` для commit/push в `main`. Commit содержит `[skip netlify]`, чтобы Git push не запустил автоматическую публикацию. Точный hash следует получать через `git rev-parse HEAD`; после push он должен совпадать с `origin/main`.

Production deploy не выполняется. Новый Netlify site не создаётся. `.env.local`, дополнительные env-файлы, credentials, `.netlify` и локальные QA-файлы исключены из commit.

## Следующий общий production release

1. Выпустить этот пакет: Dentistry, двусторонние связи кейсов, уточнённые условия Automation и новый QA gate.
2. Повторить на production mobile/desktop переходы и воспроизведение Dentistry audio во всех языках.
3. Проверить consent, GA events и доставку согласованной тестовой заявки в Telegram на production host.
4. Сохранить `SITE_URL=https://osnovaai.com` в production build и повторить SEO verification.
