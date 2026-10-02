# OSNOVA: Trust и публичный контакт — следующий общий release

Дата: 2026-10-02. Исходная версия: `aba512db9b94ded628d6c41d4c2c77a2567c2d74`.
Source of truth: local/GitHub main. Production не используется для оценки актуальной подачи и не публикуется этой задачей.

## Что реализовано, а что предложено

Реализовано только изменение публичного email на `capitanrun@osnova.ai` для RU / EN / DE / UK и обновление ожидаемого адреса в существующем payment audit. Рекомендации Trust ниже не добавлены в публичные компоненты. Они готовы для review владельцем; новый дизайн, маршруты и новый раздел сайта не нужны.

## Модель доверия

Основа: конкретные работы → понятная ответственность → письменные условия → передача результата → прямой контакт. Development остаётся первым предложением, Automation — вторым. SEO, Performance, AI Visibility и Email Deliverability остаются четырьмя полноценными дополнительными направлениями.

Не строить доверие на выдуманных цифрах, количестве сотрудников, отзывах, офисе, юридическом лице, опыте в годах, сертификатах или обещаниях дохода. Бренд OSNOVA не следует выдавать за зарегистрированную компанию. Нельзя заменять отсутствующие сведения о людях шестью безымянными «сотрудниками» по числу услуг.

## Подтверждённые факты и границы

| Факт / предложение | Основание | Корректное публичное применение |
| --- | --- | --- |
| OSNOVA ориентирована на бизнес в ЕС | Контекст владельца; актуальный `src/data/designContent.js` | «Для бизнеса в ЕС». Это целевая география, а не подтверждение офиса, регистрации или количества клиентов из стран ЕС. |
| Development — основное направление, Automation — второе; всего шесть услуг | Актуальный `HomePage` в `src/App.jsx`, `src/data/commercialContent.js` | Сохранить существующую иерархию и карточки дополнительных услуг. |
| DDS SERVICE, BALA GROUP, COMFORT HOME, COMFORT LAB — подтверждённые web-работы | Контекст владельца; `src/data/cases.js` | Показывать страницы, интерфейсы, собственный объём работы и существующие ссылки. Не приписывать этим работам SEO, ROAS или рост продаж. |
| Остальные уже публичные web-кейсы, включая оба RETATRUTIDE | `src/data/cases.js` | Сохранять их существующие данные и навигацию; использовать только как доказательство web-работы, не рекламировать результаты продукта клиента. В этой задаче не менялись. |
| Dentistry — реальный кейс AI Voice для стоматологической клиники | Подтверждение владельца; `src/data/dentistryCase.js`, `src/data/cases.js` | Название Dentistry сохраняется. Запись — proof голосового сценария, не доказательство записи пациента, дохода или количества обработанных звонков. |
| AI News Automation; Retail Stock & Availability Monitor | Контекст владельца; `src/data/automationCases.js` | Объяснять сценарий и реализованный процесс через существующие workflow и материалы. Не добавлять экономию времени или финансовые результаты без данных. |
| RU / EN / DE / UK версии сайта | `src/data/routes.js`, локализованные данные | Четыре языка интерфейса подтверждены. Четыре языка переговоров или поддержки ещё нужно подтвердить отдельно. |
| Письменный scope, цена и срок; 30% / 70%; передача после оплаты; 45 дней fixes | Коммерческая модель владельца; `src/data/commercialContent.js` | Это предлагаемые условия сотрудничества, а не доказательство ранее выполненных обязательств. Сложные проекты имеют поэтапную оплату. Fixes относятся к собственной согласованной реализации, не к новым функциям. |
| Нет зарегистрированного юрлица и публичного юридического адреса | Контекст владельца | Не добавлять юридическое название, регистрационный номер, VAT ID, офисный адрес или «штаб-квартиру». Контактный email не подменяет сведения о стороне конкретного соглашения. |

## Что уже хорошо представлено

- `HomePage` показывает Development первым, Automation вторым; дополнительные услуги описаны отдельными карточками.
- Существуют реальные detail pages, изображения web-проектов, ссылки между кейсами и услугами; Dentistry имеет запись разговора и описание сценария.
- Активный `CommercialTrust` на главной и Development использует EU-позиционирование из `designContent` и четыре конкретных условия из `commercialContent`.
- Процесс описывает письменное согласование объёма, цены и срока, рабочую версию, утверждение, финальную оплату и передачу.
- На сайте есть прямые контакты, форма и страница способов оплаты. Важно сохранять email наравне с Telegram для международной аудитории.

## Чего действительно не хватает

1. **Люди и ответственность.** В активном Trust нет подтверждённых имён, портретов или профессиональных профилей. `src/data/team.js` содержит только роли, включая CEO; старый компонент `About` не подключён к актуальному `HomePage`. Это не публичное доказательство существования шести отдельных специалистов. Не возвращать этот блок без проверки состава.
2. **Роль OSNOVA в каждом кейсе.** Существующий scope уже помогает; при дальнейшем уточнении показывать, какая часть работы выполнена OSNOVA, что остаётся на стороне клиента и что требует отдельной интеграции. Сроки, отзывы и результаты добавлять только с подтверждением и разрешением.
3. **Идентификация при начале сотрудничества.** До оплаты клиент должен получить реальные сведения о стороне соглашения и получателе оплаты. Владелец должен определить эти сведения; сайт не должен придумывать их.
4. **Языки общения.** Сайт локализован, но доступные языки переговоров, документации и human support не подтверждены. Не обещать их по количеству локализаций.
5. **Готовность нового ящика.** MX домена настроены на Google, но DNS не доказывает существование конкретного ящика, владение доменом, приём писем или возможность отвечать с него. Владелец подтверждает доступ, входящее письмо и ответ перед общим production release.

## Точечные изменения, рекомендуемые для следующего этапа

Без редизайна: уточнить вводный абзац существующего `CommercialTrust`; сохранить четыре условия; рядом с существующими кейсами пояснить, что они подтверждают; после решения владельца добавить реальную контактную персону в текущую контактную область. Не создавать отдельный повторяющийся набор CTA.

Портфолио проектов из Украины не противоречит работе с бизнесом в ЕС. Не скрывать их домены и не переименовывать кейсы в «европейские». География предложения и география конкретного проекта — разные факты. Не называть OSNOVA «агентством для русскоязычных», не перечислять Россию как рынок. Русскоязычную аудиозапись Dentistry честно оставить обозначенной как запись на русском; она не устанавливает язык всех будущих voice-сценариев.

Форма работы: бренд и проектная работа с письменно согласованным объёмом и персональной ответственностью после подтверждения конкретного человека. Не использовать «ООО», «Ltd», «GmbH», «зарегистрированная европейская компания» или офисный адрес. Не писать «freelancer collective», «распределённая команда», «офис в ЕС» или «работаем полностью удалённо», пока владелец это не подтвердит.

## PUBLIC COPY — готовые рекомендации, ещё не опубликованы

### RU

**О нас / география:** OSNOVA разрабатывает сайты и системы автоматизации для бизнеса в ЕС. Основные направления — Development и Automation. Также предлагаем SEO, Performance, AI Visibility и Email Deliverability.

**Proof:** Посмотрите конкретные работы: DDS SERVICE, BALA GROUP, COMFORT HOME и COMFORT LAB — web-проекты; Dentistry — AI Voice, AI News Automation и Retail Stock & Availability Monitor — автоматизация. В кейсах показываем задачи, реализацию и доступные материалы проекта.

**Dentistry:** Dentistry — реальный проект OSNOVA для стоматологической клиники. AI Voice система обрабатывает входящие и исходящие звонки по заданным сценариям, использует базу знаний и передаёт контекст сотрудникам через Telegram. Вопросы, требующие человека, передаются персоналу. Послушайте запись стоматологического сценария на русском языке.

**Условия:** До старта письменно согласуем объём, стоимость и срок. Обычно оплата составляет 30% перед началом и 70% после утверждения результата, до финальной передачи; для сложных проектов согласуем этапы оплаты. После полной оплаты передаём код и необходимые доступы. В течение 45 дней после запуска исправляем ошибки собственной согласованной реализации; новые функции оцениваем отдельно.

**Контакт:** Обсудить задачу: capitanrun@osnova.ai. Можно также написать в Telegram или отправить форму на сайте.

### EN

**About / geography:** OSNOVA builds websites and automation systems for businesses in the EU. Development and Automation are our core services. We also offer SEO, Performance, AI Visibility and Email Deliverability.

**Proof:** Explore our work: DDS SERVICE, BALA GROUP, COMFORT HOME and COMFORT LAB are web projects; Dentistry — AI Voice, AI News Automation and Retail Stock & Availability Monitor are automation projects. Each case presents the task, implementation and available project evidence.

**Dentistry:** Dentistry is a real OSNOVA project for a dental clinic. The AI Voice system handles incoming and outbound calls using defined scripts, draws on a knowledge base and passes conversation context to staff through Telegram. Questions requiring a person are handed over to the clinic team. Listen to the dental call scenario recorded in Russian.

**Working terms:** Before work starts, we agree the scope, price and deadline in writing. Our usual payment terms are 30% upfront and 70% after approval, before final handover; complex projects use an agreed payment schedule. After full payment, we hand over the code and required access. For 45 days after launch, we fix errors in our agreed implementation; new features are quoted separately.

**Contact:** Tell us about your project: capitanrun@osnova.ai. You can also contact us on Telegram or use the website form.

### DE

**Über uns / Zielmarkt:** OSNOVA entwickelt Websites und Automatisierungslösungen für Unternehmen in der EU. Unsere Schwerpunkte sind Development und Automation. Ergänzend bieten wir SEO, Performance, AI Visibility und Email Deliverability an.

**Projekte:** Entdecken Sie unsere Arbeit: DDS SERVICE, BALA GROUP, COMFORT HOME und COMFORT LAB sind Webprojekte; Dentistry — AI Voice, AI News Automation und Retail Stock & Availability Monitor sind Automatisierungsprojekte. Die Projektseiten zeigen die Aufgabe, die Umsetzung und vorhandene Einblicke in das Projekt.

**Dentistry:** Dentistry ist ein reales OSNOVA-Projekt für eine Zahnarztpraxis. Das AI-Voice-System bearbeitet eingehende und ausgehende Anrufe nach festgelegten Abläufen, nutzt eine Wissensbasis und gibt den Gesprächskontext über Telegram an Mitarbeitende weiter. Fragen, die einen Menschen erfordern, übernimmt das Praxisteam. Hören Sie sich das auf Russisch aufgezeichnete Gesprächsszenario an.

**Zusammenarbeit:** Vor Beginn halten wir Umfang, Preis und Termin schriftlich fest. Üblicherweise werden 30 % vor Beginn und 70 % nach Freigabe, vor der finalen Übergabe, bezahlt; für komplexe Projekte vereinbaren wir einen Zahlungsplan nach Projektphasen. Nach vollständiger Zahlung übergeben wir Code und notwendige Zugänge. Innerhalb von 45 Tagen nach dem Start beheben wir Fehler in unserer vereinbarten Umsetzung; neue Funktionen werden separat kalkuliert.

**Kontakt:** Besprechen Sie Ihr Projekt mit uns: capitanrun@osnova.ai. Sie erreichen uns auch über Telegram oder das Kontaktformular.

### UK

**Про нас / географія:** OSNOVA розробляє сайти та системи автоматизації для бізнесу в ЄС. Основні напрями — Development і Automation. Також пропонуємо SEO, Performance, AI Visibility та Email Deliverability.

**Проєкти:** Перегляньте конкретні роботи: DDS SERVICE, BALA GROUP, COMFORT HOME і COMFORT LAB — web-проєкти; Dentistry — AI Voice, AI News Automation та Retail Stock & Availability Monitor — автоматизація. У кейсах показуємо завдання, реалізацію та наявні матеріали проєкту.

**Dentistry:** Dentistry — реальний проєкт OSNOVA для стоматологічної клініки. AI Voice система обробляє вхідні й вихідні дзвінки за заданими сценаріями, використовує базу знань і передає контекст співробітникам через Telegram. Питання, які потребують людини, передаються персоналу. Послухайте запис стоматологічного сценарію російською мовою.

**Умови:** До початку письмово погоджуємо обсяг, вартість і строк. Зазвичай оплата становить 30% перед початком і 70% після затвердження результату, до остаточної передачі; для складних проєктів погоджуємо етапи оплати. Після повної оплати передаємо код і потрібні доступи. Протягом 45 днів після запуску виправляємо помилки власної узгодженої реалізації; нові функції оцінюємо окремо.

**Контакт:** Обговорити завдання: capitanrun@osnova.ai. Також можна написати в Telegram або скористатися формою на сайті.

## Команда: решение владельца до публикации

Рекомендуемый формат после подтверждения: реальное имя → реальная роль / ответственность → портрет с разрешением или профессиональный профиль. Публиковать только фактический состав. Допустимо показать одного ответственного человека, если именно это соответствует реальности; не обещать штат по одному специалисту на каждую услугу. До подтверждения людей достаточно описывать направления и процесс.

Шаблон, не публичный текст: «[Подтверждённое имя] — [реальная роль]. Отвечает за [подтверждённая зона ответственности]. [Проверенный профессиональный профиль]». EN: “[Confirmed name] — [actual role]. Responsible for [confirmed area]. [Verified professional profile].” DE: „[Bestätigter Name] — [tatsächliche Rolle]. Verantwortlich für [bestätigter Aufgabenbereich]. [Verifiziertes berufliches Profil].“ UK: «[Підтверджене ім’я] — [реальна роль]. Відповідає за [підтверджена зона відповідальності]. [Перевірений професійний профіль]».

Owner decisions:

- Кто входит в команду, кто лично отвечает за проект; реальные имена, роль основателя, допустимые фотографии и ссылки на профессиональные профили. CEO не использовать как доказательство юрлица.
- Реальные языки общения и поддержки; при необходимости — фактическое местоположение людей, без объявления офиса или регистрации.
- Кто выступает стороной соглашения и получателем оплаты; какие подтверждённые сведения можно раскрыть публично и какие предоставляются клиенту до оплаты.
- Разрешения клиентов на отзывы, цитаты, логотипы и дополнительные материалы; даты и собственный scope, если их предстоит добавить. Существующие утверждённые кейсы сохраняются.
- Контроль домена osnova.ai и работоспособность capitanrun@osnova.ai: получение тестового письма и ответ с нового адреса перед release. Домен email отличается от домена сайта osnovaai.com намеренно, по заданию владельца.

## EMAIL / технические зависимости

Активный публичный источник старого адреса был один: `shared.email` в `src/data/content.js`. Все четыре `content[lang].contact` используют это общее значение. `Contact` в `src/App.jsx` выводит адрес и формирует `mailto`; событие `email_click` не содержит адреса или содержимого письма.

`/api/contact` отправляет данные через `netlify/functions/contact.mjs` → `server/telegram.mjs` → Telegram Bot API, используя `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`. Публичный email не участвует в доставке формы. Backend, форма, Telegram, SMTP, Netlify config, API, аналитика и авторизация не изменены. SMTP отправки в этом пути нет. `.env.local` и `.env.local.env.local` не содержат старого адреса; значения секретов не читались в отчёт и не публикуются.

Проверка DNS 2026-10-02: osnova.ai имеет MX `aspmx.l.google.com`, `alt1`–`alt4.aspmx.l.google.com`. DNS не является тестом конкретного ящика; письма в рамках задачи не отправлялись.

Старый Gmail остаётся только в исторических SEO/browser evidence в `docs/seo/evidence/`. Это снимки прежнего сайта, а не активная публичная страница и не технический адрес. Историю не переписываем. Внешние владельцы аккаунтов GitHub / Google / Netlify и их login emails не перенастраивались: смена публичного `mailto` этого не требует.

## Проверки и release

Выполненные проверки:

- `SITE_URL=https://osnovaai.com npm run build` — PASS, 80 prerender documents + общий 404, sitemap 76 URL.
- `verify:seo` — PASS: 76 indexable pages, четыре utility 404, canonical / hreflang / sitemap на production origin.
- `verify:analytics` — PASS: девять service slugs во всех четырёх языках; данные формы и секреты не попадают в события.
- `audit:payment` — PASS: четыре языка × пять viewport, новый точный mailto, Telegram и ссылка на способы оплаты.
- `node scripts/closing-check.mjs` — PASS: 24 layouts (320, 390, 430, 768, 1280, 1440px × четыре языка), 24 перехваченные отправки формы, ссылки дополнительных услуг. Реальные Telegram-заявки не отправлялись.
- Проверка built HTML — PASS: 76 страниц, 1260 внутренних ссылок и fragments, четыре новых mailto; старого Gmail в актуальных страницах нет.
- Visual review: контактные блоки всех четырёх языков при 320px, RU при 430px и EN desktop; новый адрес помещается, форма и дизайн сохранены.
- Diff / secrets check — PASS: только два изменения строк кода и этот handoff; конфигурация инфраструктуры, backend, analytics, App и routes совпадают с исходным HEAD с учётом Windows line endings. Из `.env*` отслеживается только `.env.example`.

Build сохраняет существовавшее на исходном `aba512d` предупреждение Vite о главном JS bundle >500 kB: новый `index-BiAucThG.js` — 534.01 kB (gzip 162.92 kB), размер такой же, как в предыдущей подтверждённой сборке. Лимит не повышался, QA не ослаблялся. Работоспособность конкретного почтового ящика остаётся отдельной проверкой владельца перед release. Git SHA сообщается отдельно после commit/push.

В следующий общий production release входит новый публичный email. Trust-тексты и сведения о команде внедряются после review и решений владельца; документ сам по себе не публикуется на сайте. Commit/push этой задачи должен использовать `[skip netlify]`; production deploy не выполнять.
