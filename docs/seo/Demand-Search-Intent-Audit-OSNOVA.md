# Demand & Search Intent Audit — OSNOVA

<mention-date start="2026-09-25"/> · @Roman

Аудит спроса и поискового интента перед финальным выбором ICP, позиционирования и офферов сайта OSNOVA. Конкурентный аудит уже проведён отдельно и здесь не повторяется — задача этого документа узкая: реальный поисковый и коммерческий спрос вокруг уже сформированных продуктов OSNOVA (**Development**: Landing Page, Business Site; **Automation / Managed Automation**: Custom Bot, Bot + Integration, AI Assistant, AI Voice, Telegram Web App, Business Automation, retainer-тарифы).

## Методология и ограничения

**Что сделано.** Реальные поисковые формулировки, коммерческий интент, SERP-окружение (кто в топе, что показывают, по каким ценам и с какими trust-факторами и CTA) исследованы через веб-поиск и прямой фетч 15+ реальных открытых конкурентных страниц, агентств и обзоров цен в DE/ES/RU/EN — с указанием URL в разделе «Источники». Конкурентный аудит OSNOVA не дублировался.

**Явные ограничения (не выдуманные цифры):**

- Нет доступа к Google Keyword Planner, Search Console заявленного сайта, платным SEO-инструментам (Ahrefs/Semrush с точным объёмом) и к реальному аукциону Google Ads (Auction Insights) — точных цифр объёма поиска и точного CPC по DE/ES/RU нет и не может быть в этом отчёте.
- Показатели CPC ниже — это **публичные отраслевые бенчмарки** (WordStream, отраслевые блоги), а не данные по конкретным ключевым словам в SERP-окружении OSNOVA.
- Четыре исходных Notion-документа брифа (коммерческая модель, конкурентный аудит, аудит активов, стратегическая задача) технически недоступны — приватные страницы app.notion.com без интеграции. Аудит опирается на полное описание продуктов и цен OSNOVA, данное непосредственно в задаче.
- Google Trends и динамика спроса во времени не проверялись.
- Глубоко проверены кластеры DE и ES; другие страны ЕС (Нидерланды, Франция, Польша, Португалия) не исследовались отдельно — в зачёте общий EN-бенчмарк по странам из вторичного источника.
- Не проверялась реальная выдача платных объявлений Google Ads Preview — наличие рекламной конкуренции оценивалось косвенно, через плотность и однородность органических коммерческих SERP.

Везде далее факт и источник даны отдельно от интерпретации; интерпретации помечены как «Вывод» или «Гипотеза».

## Development — спрос и SERP

### Кластеры покупательских запросов

<table header-row="true" header-column="false">
	<tr>
		<td>Рынок</td>
		<td>Коммерческие формулировки</td>
		<td>Информационные (не путать с покупательскими)</td>
	</tr>
	<tr>
		<td>DE</td>
		<td>«Website/Landingpage erstellen lassen Kosten/Festpreis», «Homepage für Unternehmen Festpreis», «Website in 24 Stunden»</td>
		<td>«Website selbst erstellen», «Wix vs WordPress»</td>
	</tr>
	<tr>
		<td>ES</td>
		<td>«crear página web para negocio/empresa precio», «diseño de landing page precio», «página web para empresa llave en mano»</td>
		<td>«cómo hacer una página web gratis»</td>
	</tr>
	<tr>
		<td>RU</td>
		<td>«заказать лендинг/сайт для бизнеса цена под ключ», «сайт для бизнеса под ключ»</td>
		<td>«как сделать сайт самому», «конструкторы сайтов»</td>
	</tr>
	<tr>
		<td>EN</td>
		<td>«small business website design cost», «business website design price Europe»</td>
		<td>«best website builder 2026»</td>
	</tr>
</table>

Факт. Во всех 4 языках коммерческая лексика («Kosten/Preis/erstellen lassen», «precio/coste/llave en mano», «цена/под ключ», «price/cost») ведёт в SERP исключительно на страницы агентств/студий с прайсингом, а не на конструкторы/DIY-гайды — эти два сегмента в выдаче не пересекаются.

### Цены и офферы конкурентов по рынкам

**Германия (DE)**

<table header-row="true" header-column="false">
	<tr>
		<td>Игрок</td>
		<td>Цена</td>
		<td>Срок</td>
		<td>Ключевые заявления</td>
	</tr>
	<tr>
		<td>[festpreis-webseite.de](https://www.festpreis-webseite.de/)</td>
		<td>Landingpage €399, Starter €599, Professional €799, Business €999 (без VAT)</td>
		<td>5–7 дней дизайн / 4–6 недель реализация, есть ускоренные 7/14 дней</td>
		<td>«ohne versteckte Kosten», –25% стартапам, responsive+SEO+формы+GA включены</td>
	</tr>
	<tr>
		<td>[required.com (блог)](https://required.com/de/blog/website-erstellen-lassen-kosten-agentur-ablauf/)</td>
		<td>one-pager €1500–2500, SME-сайт €3000–6000, корп. €5000–15000, крупный до €25000</td>
		<td>—</td>
		<td>аргумент — «Planungssicherheit» (предсказуемость)</td>
	</tr>
	<tr>
		<td>[webstart24.at](https://webstart24.at/), [onedaysite.at](https://onedaysite.at/), [kreativschock.de](https://www.kreativschock.de/homepage-erstellen-lassen/)</td>
		<td>от €399–499</td>
		<td>24 часа</td>
		<td>индивидуальный дизайн, «kein Template, kein Copy-Paste»</td>
	</tr>
	<tr>
		<td>website-erstellen.org</td>
		<td>от €399</td>
		<td>72 часа</td>
		<td>—</td>
	</tr>
	<tr>
		<td>page-kraft.de</td>
		<td>от €169/мес</td>
		<td>—</td>
		<td>подписочная модель, выбивается из ряда</td>
	</tr>
</table>

**Испания (ES)**

<table header-row="true" header-column="false">
	<tr>
		<td>Игрок</td>
		<td>Цена</td>
		<td>Срок</td>
		<td>Ключевые заявления</td>
	</tr>
	<tr>
		<td>[start-platform.com](https://start-platform.com/crear-sitio-web/costos)</td>
		<td>Web S €699+€39/мес, Web M €1999+€49/мес («Most Popular»), Web L €1999+€149/мес</td>
		<td>14 дней</td>
		<td>«Montos fijos, sin sorpresas», прямое противопоставление custom-разработке (€5000–10000+), «4.7/5, 500+ clients», CTA «Comprar»/«Solicitar costos»</td>
	</tr>
	<tr>
		<td>[raiolanetworks.com/blog](https://raiolanetworks.com/blog/precio-pagina-web/), abstractbranding.com</td>
		<td>corporate €1500–3500, ecommerce €3000–8000</td>
		<td>—</td>
		<td>—</td>
	</tr>
</table>

**Россия (RU, для масштаба цен)**

<table header-row="true" header-column="false">
	<tr>
		<td>Игрок</td>
		<td>Цена</td>
	</tr>
	<tr>
		<td>grampus-studio.ru</td>
		<td>от 12 900₽ (≈€125)</td>
	</tr>
	<tr>
		<td>korzilla.ru</td>
		<td>от 47 900₽ (≈€465)</td>
	</tr>
	<tr>
		<td>veonix.ru</td>
		<td>от 95 000₽ (≈€920)</td>
	</tr>
	<tr>
		<td>studiobit.ru</td>
		<td>от 130 000₽ (≈€1260)</td>
	</tr>
	<tr>
		<td>Средний рынок (yak-studio.ru)</td>
		<td>150 000–200 000₽ (≈€1450–1940) за сайт 10–12 страниц</td>
	</tr>
</table>

Факт. RU-рынок не стандартизован фикс-пакетами так, как DE/ES — разброс на порядок, многие студии считают «индивидуально», цены не публикуются.

**Общеевропейский EN-бенчмарк** (справочно, вторичный источник, не основной канал для ЦА OSNOVA): €800–8000, типично €1000–5000; UK £1500–5000, Франция €1000–4000, Германия (усреднённо по блогам) €1500–4500; Восточная Европа \$40–80/час против \$70–100/час в Западной.

### Trust-факторы и CTA у лидеров SERP

Факт. Главный повторяющийся trust-фактор в DE и ES — явное обещание фикс-цены без доплат: «ohne versteckte Kosten» (festpreis-webseite.de), «montos fijos, sin sorpresas» (start-platform.com). Далее — отзывы/стаж («4.7/5, 500+ clients»), индивидуальный дизайн («kein Template»), включённые без доплат SEO/аналитика. CTA везде преимущественно прямые: «Jetzt Anfragen», «Comprar», «Solicitar costos» — то есть есть сегмент покупателей, который покупает без отдельного звонка/брифа.

Факт. Суб-ниша «сайт за 24 часа» уже существует в DE/AT как устоявшаяся (webstart24.at, onedaysite.at, kreativschock.de, website-erstellen.org) с ценами €399–499 — это не голубой океан, что OSNOVA тоже заявляет. OSNOVA (€250) всё ещё дешевле даже этих игроков.

### Сопоставление цен OSNOVA (Development)

<table header-row="true" header-column="false">
	<tr>
		<td>Продукт OSNOVA</td>
		<td>Цена OSNOVA</td>
		<td>Нижняя точка рынка DE/ES</td>
		<td>Нижняя точка рынка RU</td>
	</tr>
	<tr>
		<td>Landing Page</td>
		<td>от €250</td>
		<td>DE €399+, ES €699+</td>
		<td>≈€125–465</td>
	</tr>
	<tr>
		<td>Business Site</td>
		<td>от €500</td>
		<td>DE €1500–3000+, ES €1500–1999+</td>
		<td>≈€1450+</td>
	</tr>
</table>

Факт. OSNOVA стартует на уровне нижней границы рынка или ниже её почти везде, кроме отдельных самых дешёвых RU-студий.

### Синтез силы спроса (Development)

Гипотеза на основе фактов выше: спрос СИЛЬНЫЙ и коммерчески зрелый во всех 4 языковых кластерах. Категория уже продаётся фикс-пакетами без консультации (в отличие от Automation, где это скорее исключение) — это снижает трение при покупке и облегчает прямую продажу через лендинг без звонка/брифа.

## Automation — спрос и SERP

### Telegram-бот для бизнеса

Формулировки: RU «телеграм бот для бизнеса цена под ключ»; DE «Telegram Bot erstellen lassen Preis Unternehmen»; ES «bot de Telegram para negocio precio»; EN «custom Telegram bot development price». Интент преимущественно коммерческий — топ выдачи во всех 4 языках это price-guide статьи агентств и прямые service-страницы.

<table header-row="true" header-column="false">
	<tr>
		<td>Рынок</td>
		<td>Цены (факт)</td>
		<td>Источник</td>
	</tr>
	<tr>
		<td>RU</td>
		<td>80 000–250 000₽ (≈€800–2500) под ключ + поддержка 10 000–20 000₽/мес; средний чек ≈294 184₽ (≈€2900)</td>
		<td>BotHelp, Cossa, sostav.ru</td>
	</tr>
	<tr>
		<td>DE</td>
		<td>[lomageek.de](https://lomageek.de/en/telegram-bots/) — Mini от €790 (1 неделя), Business от €1990 (2 языка, 2 недели), Enterprise от €3990 (AI на Claude, 3–4 недели)</td>
		<td>lomageek.de</td>
	</tr>
	<tr>
		<td>ES</td>
		<td>от \$100 (Fiverr) до — подписка для специализированных ботов €150–400/мес</td>
		<td>Fiverr, SendPulse LatAm</td>
	</tr>
	<tr>
		<td>EN</td>
		<td>\$290–15 000+ разово; простой бот \$500–1500, сложный \$5000–10000; no-code подписка \$9–100/мес</td>
		<td>Botract, Nexarocode</td>
	</tr>
</table>

Гипотеза. Цена OSNOVA Custom Bot от €149 заметно ниже немецкого конкурента (Lomageek Mini €790) и среднего RU-чека (€800–2900), сопоставима с нижним ES/EN-сегментом (\$100–500). В DE такая цена может читаться как «слишком дёшево для серьёзного B2B-инструмента» — доверие тут решают trust-факторы (ownership, отсутствие lock-in), а не только цена.

### WhatsApp-автоматизация

Интент смешанный — верхние коммерческие позиции это в основном **SaaS-платформы** (Wati, ManyChat, Superchat, Userlike, AiSensy), а не агентства/фрилансеры под заказ.

- DE: [Superchat](https://www.superchat.de/blog/ki-chatbot-fuer-unternehmen) от €450/мес (Essential), GPT-4-уровень только Business от €1200/мес; Userlike от €470/мес
- ES: моно-канальные платформы от \$49/мес, «Standard» от \$149/мес
- EN: инструменты автоматизации в целом \$5–99/мес; крупные игроки (Wati, AiSensy, ManyChat) \$0–139/мес

Гипотеза. Покупатель в этой категории по умолчанию сравнивает OSNOVA не с агентством, а с готовой SaaS-подпиской (€15–150/мес). Продавать WhatsApp именно как «разработку бота с нуля» рискованно; более защитимая позиция — «настроим и внедрим готовую WhatsApp-автоматизацию под ваш процесс» (интеграция поверх Meta API), а не «разработка с нуля».

### AI Assistant / AI Receptionist / чат-бот

Сильно коммерческий интент, но рынок чётко бифурцирован: дешёвые SaaS-подписки (\$9–150/мес) против дорогих кастомных agency-проектов (€3000–150 000).

**RU:** [itmagic.spb.ru](https://itmagic.spb.ru/blog/ai-asistent-dlya-biznesa.html) — Basic от 20 000₽ (2–4 нед, FAQ-бот), Standard от 60 000₽ (4–6 нед, мультиканал+CRM), Premium от 120 000–250 000₽ (6–10 нед); поддержка 5 000–25 000₽/мес + токены API 3 000–15 000₽/мес; trust — «80+ внедрений», ROI-кейсы с окупаемостью 1.7 мес.

**DE:** [byte-werk.de](https://www.byte-werk.de/preise/ki.html) — входной чат-бот от €1450; [ki-automatix.de](https://ki-automatix.de/) (соседняя ниша) — **фикс-пакетов нет вообще**, только «Kostenlose Beratung»; общая process automation в DE: малые проекты €3000–8000, средние €15 000–30 000, сложные €40 000–90 000, средний чек ≈€25 000; подписочные KI-агенты от €1490/мес.

**ES:** [Javadex](https://www.javadex.es/blog/coste-implementar-agentes-ia-empresa-presupuesto-roi-2026) — €8000–150 000 на внедрение, 4–24 недели; [Aimoova](https://www.aimoova.com/blog/cuanto-cuesta-automatizar-procesos-pyme-2026) — никаких фикс-пакетов, только диапазон «€250–10 000 без NDS» как ориентир, целиком consultation-driven.

**EN, AI receptionist — зрелая подписочная категория:** \$49–899/мес в зависимости от объёма звонков; бюджетные от \$18–49/мес, средний сегмент \$99–249/мес, премиум (AI+человек, Smith.ai) \$300–2100/мес — позиционируется через сравнение с наймом человека (\$2900–5000/мес vs AI \$199–299/мес).

**EN, custom AI chatbot с нуля:** \$15 000–80 000 разово для серьёзного кастома; простые rule-based боты \$1000–5000; подписка для малого бизнеса \$9–150/мес.

Гипотеза (важно). Категория «AI assistant» жёстко раздвоена на **самостоятельную SaaS-подписку** и **кастомный agency-проект** без фикс-цены. AI Assistant OSNOVA (€350–500) не совпадает напрямую ни с одним сегментом — это «дыра» в структуре рынка: дороже подписки, но на порядок дешевле типичного кастома в DE/ES. Потенциальное преимущество позиционирования, но требует явного trust-сообщения, чтобы не читаться «слишком дешёво для serious custom work». **AI Receptionist** в EN-рынке — отдельная, зрелая подписочная категория — кандидат на отдельный месседж через Managed Automation, а не часть общего AI Assistant.

### Общая бизнес-автоматизация

Коммерческий интент, но почти везде воронка на консультацию, не self-serve покупка: RU 17 400–39 400₽ базовые решения до «рассчитывается индивидуально»; DE — см. выше (€3000–90 000); ES PyME — простая автоматизация €1500–4000, с AI-агентами €6000–15 000; EN small business — типичный проект \$3000–15 000 + \$200–600/мес подписок. Гипотеза: отсутствие фикс-цены у OSNOVA Business Automation/Custom System — норма категории, не недостаток; это чистый upsell, не входной продукт.

### Managed Automation — ретейнер-модель

Типовая структура рынка: setup \$500–5000 разово + \$200–1000/мес maintenance; тарифная сетка агентств: Starter \$299/мес, Growth \$599/мес, Scale \$1499/мес; малый бизнес-ретейнер \$500–2000/мес, mid-market \$3000–8000/мес; RU Telegram-бот поддержка от 5 000₽/мес (≈€50).

Факт. Манагед Automation OSNOVA (€150/300/700–800+/мес) сидит прямо внутри наблюдаемого коридора. Верхний тир (€700–800+) не выглядит завышенным даже относительно EN-потолка малого бизнеса (\$2000/мес) — есть запас роста тарифа. Почти все конкуренты во всех 4 языках продают именно подписку, а не разовый проект — рынок сам приучил покупателя к recurring-модели.

### Сопоставление цен OSNOVA (Automation)

<table header-row="true" header-column="false">
	<tr>
		<td>Продукт OSNOVA</td>
		<td>Цена OSNOVA</td>
		<td>Рыночное окружение (факт)</td>
	</tr>
	<tr>
		<td>Custom Bot</td>
		<td>от €149</td>
		<td>DE €790+, RU ≈€800–2900, ES/EN нижний сегмент \$100–1500</td>
	</tr>
	<tr>
		<td>AI Assistant</td>
		<td>от €350–500</td>
		<td>DE/ES €3000–6000 (внедрение), €1500–4000 (агент с RAG); RU Standard-пакет ≈€600 — близкая точка</td>
	</tr>
	<tr>
		<td>Managed Automation</td>
		<td>€150/300/700–800+/мес</td>
		<td>DE/EN SaaS+ретейнер €150–1500/мес, EN-ретейнер \$500–3500/мес</td>
	</tr>
	<tr>
		<td>Telegram Web App</td>
		<td>индивидуально</td>
		<td>\$4000–80 000+</td>
	</tr>
	<tr>
		<td>Business Automation / Custom System</td>
		<td>индивидуально</td>
		<td>\$1500–15 000+ (ES/EN), без фикс-цен у конкурентов — норма</td>
	</tr>
	<tr>
		<td>AI Voice</td>
		<td>индивидуально</td>
		<td>\$29–400+/мес готовый SaaS (ES), \$25–899/мес (EN AI receptionist)</td>
	</tr>
</table>

### Синтез силы спроса по кластерам

<table header-row="true" header-column="false">
	<tr>
		<td>Кластер</td>
		<td>Коммерческий интент</td>
		<td>Конкуренция/цена</td>
		<td>Entry или upsell</td>
		<td>Сила спроса</td>
	</tr>
	<tr>
		<td>Telegram-бот</td>
		<td>Высокий</td>
		<td>Средняя, OSNOVA заметно дешевле DE-агентств</td>
		<td>Хороший entry</td>
		<td>Сильный</td>
	</tr>
	<tr>
		<td>WhatsApp-автоматизация</td>
		<td>Средний/высокий, конкурирует с SaaS</td>
		<td>Высокая (много готовых SaaS)</td>
		<td>Спорный entry, лучше как upsell/интеграция</td>
		<td>Средний, структурно сложный</td>
	</tr>
	<tr>
		<td>AI Assistant (общий)</td>
		<td>Высокий, рынок бифурцирован</td>
		<td>OSNOVA в ценовой «дыре» между SaaS и agency</td>
		<td>И entry, и upsell — требует доверия</td>
		<td>Сильный, но требует trust</td>
	</tr>
	<tr>
		<td>AI Receptionist (отдельно)</td>
		<td>Высокий, зрелая EN-категория, почти всегда подписка</td>
		<td>SaaS-конкуренты \$49–899/мес</td>
		<td>Кандидат на Managed Automation upsell</td>
		<td>Сильный как отдельный оффер</td>
	</tr>
	<tr>
		<td>Business Automation/Custom System</td>
		<td>Высокий, но всегда consultation-only</td>
		<td>Фикс-цен нет ни у кого — норма категории</td>
		<td>Чистый upsell</td>
		<td>Средний (редко ищут напрямую)</td>
	</tr>
	<tr>
		<td>Managed Automation (подписка)</td>
		<td>Высокий, рынок приучен к recurring</td>
		<td>OSNOVA в рыночном коридоре, есть запас роста</td>
		<td>Retention/recurring, не entry</td>
		<td>Сильный, стратегически ценный</td>
	</tr>
</table>

## Сводное сопоставление цен OSNOVA с рынком

Собрано из таблиц выше; колонка «Вердикт» — интерпретация, не факт.

<table header-row="true" header-column="false">
	<tr>
		<td>Продукт</td>
		<td>Цена OSNOVA</td>
		<td>Рынок (факт)</td>
		<td>Вердикт</td>
	</tr>
	<tr>
		<td>Landing Page</td>
		<td>от €250</td>
		<td>DE от €399, ES от €699, RU ≈€125–465</td>
		<td>Ниже или на уровне нижней границы почти везде — цена помогает продаже, запас для роста есть</td>
	</tr>
	<tr>
		<td>Business Site</td>
		<td>от €500</td>
		<td>DE €1500–3000+, ES €1500–1999+, RU ≈€1450+</td>
		<td>Заметно ниже рынка — сильный аргумент продажи, но и самый большой запас для повышения цены или upsell-опций</td>
	</tr>
	<tr>
		<td>Custom Bot</td>
		<td>от €149</td>
		<td>DE €790+, RU ≈€800–2900, ES/EN \$100–1500</td>
		<td>Заметно ниже рынка — хороший entry, но в DE рискует читаться «слишком дешёво» без trust-сигналов</td>
	</tr>
	<tr>
		<td>AI Assistant</td>
		<td>от €350–500</td>
		<td>DE/ES €1500–6000 (внедрение), RU Standard-пакет ≈€600</td>
		<td>В ценовой «дыре» между SaaS (\$9–150/мес) и кастомом (€3000+) — ни завышена, ни занижена, но требует чёткого позиционирования</td>
	</tr>
	<tr>
		<td>Managed Automation</td>
		<td>€150/300/700–800+/мес</td>
		<td>DE/EN €150–1500/мес, EN-ретейнер \$500–3500/мес</td>
		<td>В рыночном коридоре, верхний тир можно растить без потери конкурентоспособности</td>
	</tr>
	<tr>
		<td>WhatsApp-автоматизация (внутри Automation)</td>
		<td>не выделена отдельно</td>
		<td>SaaS-конкуренты €15–450+/мес</td>
		<td>Риск позиционирования — покупатель сравнивает с готовым SaaS, а не с агентством</td>
	</tr>
</table>

Вывод. Для продуктов с публичной стартовой ценой (Development, Custom Bot, AI Assistant) OSNOVA систематически позиционируется ниже рынка DE/ES — это факт, а не гипотеза. Далее вопрос уже стратегический — гипотеза, что это надо сохранять для старта воронки (низкий порог входа), а рост чека получать через upsell/более дорогие пакеты и Managed Automation, а не через повышение входной цены.

## Данные для стратегического решения

Этот раздел — доказательная база для выбора ICP, позиционирования и офферов — не готовое решение. Решение остаётся за владельцем.

**PRIMARY DEMAND**

Development (Landing Page / Business Site) — как входной продукт и главный двигатель трафика. Не потому, что у него больше search volume (этого мы не измеряли), а по совокупности факторов: коммерческий интент чётко выражен во всех 4 языковых кластерах, категория уже продаётся фикс-пакетами без консультации (низкое трение покупки), цена/скорость OSNOVA бьют по главным покупательским критериям этой категории (фикс-цена без сюрпризов, быстрая поставка), и цена/скорость OSNOVA напрямую бьют по этим критериям: «сайт за 24 часа» уже есть как ниша в DE/AT с ценами €399–499, и OSNOVA в ней дешевле. Самый низкий порог входа в воронку OSNOVA.

**SECONDARY DEMAND**

Automation — как двигатель recurring revenue и апселла, не как основной вход. Спрос реален и коммерческий (особенно Telegram-боты и AI receptionist в DE/ES), но требует больше доверия и объяснения перед покупкой, чем Development. Managed Automation — лучшая точка для повторной выручки, который рынок уже приучил покупателя. Внутри Automation чёткая внутренняя иерархия: простой Telegram/WhatsApp-бот и AI-рецепшн/голосовой агент — поставщики трафика; более сложные продукты (AI Assistant, Business Automation, Telegram Web App) остаются consultation-driven и вторичны по видимости на главной.

**HIGH-COMMERCIAL-INTENT QUERIES**

- DE: «Website/Landingpage erstellen lassen Kosten/Festpreis», «Chatbot für Unternehmen erstellen lassen Kosten», «KI-Telefonassistent/KI-Rezeptionist», «WhatsApp Business Automatisierung Agentur»
- ES: «crear página web para negocio/empresa precio», «chatbot para empresa precio», «recepcionista virtual IA precio», «automatización WhatsApp Business precio»
- RU: «заказать лендинг/сайт цена», «телеграм бот для бизнеса заказать/цена», «автоматизация бизнеса под ключ»
- EN: «small business website design cost/price», «AI chatbot for business pricing», «AI receptionist pricing», «business process automation agency pricing»

Все четыре группы объединяет одно: в запросе есть маркер цены/заказа — это чётко отделяет их от информационного трафика.

**WEAK / INFORMATIONAL DEMAND**

- «как сделать сайт самом», «Website selbst erstellen», «cómo hacer una página web gratis», «best website builder» — DIY/конструкторы, чужой сегмент, не целевой трафик для OSNOVA
- «что такое чат-бот/AI assistant/AI agent» — без уточнения «for business» — смешивается с потребительским/enterprise-темами, низкая конверсия в малый бизнес
- «бизнес-автоматизация в ЕС», «бизнес для эмигрантов» — реальный информационный спрос, но не коммерческий кластер для Development/Automation — это аудитория для ICP, но не отдельный поисковый кластер
- «24-часовая сайт» как «уникальное преимущество» — корректно для конверсии (ниша работает), но не для позиционирования как «единственного на рынке», так как есть прямые конкуренты на этом же позиционировании

**OSNOVA ADVANTAGES SUPPORTED BY DATA**

- Ценовой разрыв в пользу OSNOVA по чти всем продуктам с публичной ценой — подтверждено реальными ценами конкурентов в коммерческом SERP DE/ES.
- Скорость доставки (24ч/2–5 дней) — реальный и уже конкурентный рыночный аргумент (подтверждённый спросом в DE-нише «сайт за 24 часа»), но не уникальный.
- Managed Automation по ценам вписывается в рыночный диапазон ретейнеров — можно продавать с уверенностью, без «выглядит дешёво ради дешёвизны».
- GDPR/DSGVO и европейская юрисдикция — реальный, активно используемый конкурентный trust-фактор в автоматизации — если OSNOVA работает из ЕС с европейским хостингом, это стоит явно заявлять.

**UNPROVEN ADVANTAGES**

- «Полный ownership клиента» — у одного из проверенных конкурентов это тоже заявлено как аргумент, покупательский спрос на это в выдаче не ищёт.
- «45 дней исправлений» — аналогов в SERP не найдено, нельзя подтвердить или опровергнуть ценность этого для покупателя.
- «До 2 языков для стартового landing» — конкуренты встречаются с разным числом языков как аргументом для более дорогого пакета, не ценность для входного.
- Отзывы/портфолио/«лет на рынке» — в профиле не упомянуты, а в сильных SERP-конкурентов это ведущий trust-аргумент — без проверенных кейсов/отзывов OSNOVA будет сложнее конкурировать выше входного сегмента.

**PAGES OSNOVA LIKELY NEEDS**

- Отдельные коммерческие страницы Landing Page и Business Site с фикс-ценой, сроками и примерами работ — это то, что ведёт в топе коммерческого SERP.
- Отдельная страница под чат-боты/Telegram/WhatsApp («Chatbot für Unternehmen», «chatbot para empresa») — отдельно от AI Assistant.
- Отдельная страница AI Assistant с чётко таргетированной фразой типа «for business/für Unternehmen/para empresa», чтобы не конкурировать с потребительскими ассистентами.
- Отдельная страница/таблица тарифов Managed Automation — бенчмарк-ориентированная, так как у SaaS-конкурентов.
- Страница/блок про trust, отзывы, заявления о GDPR/хостинге в ЕС — это несущая конструкция для относительно нового бренда.

**DATA GAPS**

- Нет точных цифр объёма поиска и CPC по DE/ES/RU (нет доступа к Google Keyword Planner и Auction Insights) — использованы только общие/отраслевые открытые бенчмарки (WordStream, средний CPC по Search ≈\$5.42, диапазон \$1.63–\$8.6 по отраслям) — не привязаны к конкретным ключевым словам или рынкам.
- Недоступны 4 исходных Notion-документа брифа — приватные страницы app.notion.com без интеграции в этой сессии.
- Google Trends и динамика спроса во времени не проверялись.
- Глубоко проверены только DE и ES; другие страны ЕС с значимым RU-сообществом (Нидерланды, Кипр, Португалия) не исследовались отдельно.
- Не проверялась реальная выдача платных объявлений (Google Ads Preview) — рекламная конкуренция оценена только косвенно, через плотность органического коммерческого SERP.
- Цены конкурентов — их собственные заявления на сайтах, не независимо подтверждённые данные о реальных сделках; реальная CAC конкурентов не проверялась.
- RU-цены в € переведены по приблизительному курсу ≈100₽/€ для сопоставимости порядка, не точный биржевой курс на дату отчёта.

## Источники

**Development, цены и офферы:**

- [festpreis-webseite.de](https://www.festpreis-webseite.de/) — DE, тарифы €399–999
- [required.com/de/blog](https://required.com/de/blog/website-erstellen-lassen-kosten-agentur-ablauf/) — DE, ценовые диапазоны
- [webstart24.at](https://webstart24.at/), [onedaysite.at](https://onedaysite.at/), [kreativschock.de](https://www.kreativschock.de/homepage-erstellen-lassen/) — DE/AT, ниша «сайт за 24 часа»
- [start-platform.com/crear-sitio-web/costos](https://start-platform.com/crear-sitio-web/costos) — ES, тарифы €699–1999+
- [raiolanetworks.com/blog/precio-pagina-web](https://raiolanetworks.com/blog/precio-pagina-web/) — ES, ценовые диапазоны
- korzilla.ru, grampus-studio.ru, veonix.ru, studiobit.ru, yak-studio.ru, profi.ru — RU, цены студий/фрилансеров
- easifytechnologies.com, gruffygoat.com, webars.at — EN/EU, общий ценовой бенчмарк по странам

**Automation, цены и офферы:**

- [lomageek.de/en/telegram-bots](https://lomageek.de/en/telegram-bots/) — DE, Telegram-боты €790–3990
- BotHelp, Cossa, sostav.ru — RU, цены Telegram-ботов
- Fiverr, SendPulse LatAm — ES/глобально, нижний сегмент ботов
- Botract, Nexarocode — EN, ценовые гайды Telegram-ботов
- [superchat.de/blog/ki-chatbot-fuer-unternehmen](https://www.superchat.de/blog/ki-chatbot-fuer-unternehmen), Userlike — DE, WhatsApp-автоматизация
- Zixflow — EN, WhatsApp automation tools обзор
- [itmagic.spb.ru/blog/ai-asistent-dlya-biznesa](https://itmagic.spb.ru/blog/ai-asistent-dlya-biznesa.html), Kwork, Freelance.ru — RU, AI-ассистенты
- [byte-werk.de/preise/ki.html](https://www.byte-werk.de/preise/ki.html), [ki-automatix.de](https://ki-automatix.de/), flowagentur.de, smartbetrieb.de — DE, AI/process automation
- [javadex.es/blog](https://www.javadex.es/blog/coste-implementar-agentes-ia-empresa-presupuesto-roi-2026), [aimoova.com/blog](https://www.aimoova.com/blog/cuanto-cuesta-automatizar-procesos-pyme-2026), ia4pymes.tech, stepwise.es — ES, AI-агенты и автоматизация
- guptadeepak.com, getnextphone.com/blog/ai-receptionist-pricing-guide, myaifrontdesk.com/pricing — EN, AI receptionist
- Crescendo, aiflowreview.com — EN, цены custom AI chatbot
- Chipp.ai, Taskip.net, hummingagent.ai, builts.ai, qbsglobal.blog — EN, managed automation/retainer-цены

**CPC-бенчмарки:**

- WordStream, «Google Ads Benchmarks 2026» — средний CPC по Search ≈\$5.42/≈\$5.87, диапазон ≈\$1.6–\$8.6 по отраслям — общий (В США) прокси, не специфичный для категорий или рынка.
