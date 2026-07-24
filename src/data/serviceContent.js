export const serviceContent = {
  ru: {
    common: {
      home: 'Главная',
      services: 'Услуги',
      cases: 'Кейсы',
      about: 'О нас',
      pricing: 'Цены',
      contact: 'Контакты',
      discuss: 'Обсудить проект',
      explore: 'Открыть направление',
      allServices: 'Все услуги',
      next: 'Следующее направление',
      menu: 'Меню',
      close: 'Закрыть',
      system: ['Привлечь', 'Принять', 'Обработать', 'Автоматизировать', 'Управлять', 'Анализировать', 'Оптимизировать'],
    },
    meta: {
      services: ['Услуги OSNOVA — автоматизация, разработка и реклама', 'Три связанных направления для всей digital-системы бизнеса.'],
      automation: ['Автоматизация бизнеса — OSNOVA', 'AI-операторы, AI-ассистенты, CRM, интеграции и индивидуальная автоматизация процессов.'],
      development: ['Разработка digital-продуктов — OSNOVA', 'Landing pages, корпоративные сайты, web-приложения, internal tools, MVP и custom software.'],
      performance: ['Реклама и продвижение — OSNOVA', 'Google Ads, Meta Ads, TikTok Ads, аналитика и корректный tracking как единая performance-система.'],
    },
    servicesPage: {
      label: 'УСЛУГИ / 01—03',
      title: 'Три мира.',
      titleAccent: 'Одна система.',
      intro: 'Выберите точку входа. Каждое направление работает самостоятельно, но максимальный эффект появляется, когда они связаны.',
      hint: 'Наведи, чтобы исследовать · нажми, чтобы войти',
    },
    directions: [
      {
        id: 'automation',
        number: '01',
        name: 'Автоматизация бизнеса',
        short: 'Процессы, сигналы, данные и интеллект.',
        statement: 'Убираем повторяющуюся работу и проектируем связанный операционный контур.',
        items: ['AI-оператор', 'AI-ассистенты', 'CRM-автоматизация', 'Интеграции', 'Индивидуальная автоматизация'],
      },
      {
        id: 'development',
        number: '02',
        name: 'Разработка',
        short: 'Структура, интерфейсы, логика и продукт.',
        statement: 'Создаём инструмент, который должен решить конкретную задачу бизнеса.',
        items: ['Landing Pages', 'Корпоративные сайты', 'Web Applications', 'Internal Tools', 'MVP Development', 'Custom Software'],
      },
      {
        id: 'performance',
        number: '03',
        name: 'Реклама и продвижение',
        short: 'Внимание, спрос, конверсия и измерение.',
        statement: 'Приводим спрос и строим измерение до того, как масштабируем кампании.',
        items: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Аналитика и tracking'],
      },
    ],
    automation: {
      label: '01 / АВТОМАТИЗАЦИЯ БИЗНЕСА',
      title: 'Проектируем работу,',
      titleAccent: 'а не набор AI-функций.',
      intro: 'Изучаем существующую работу компании, находим повторяющиеся действия и узкие места, затем создаём систему под конкретный бизнес.',
      signal: 'Процесс активен',
      heroFlow: ['Вход', 'Контекст', 'Решение', 'Действие'],
      propositionLabel: 'OS / ПРИНЦИП СИСТЕМЫ',
      proposition: 'Если внутри компании есть повторяющийся процесс, его можно разобрать, измерить и определить, где автоматизация даст реальный эффект.',
      voice: {
        label: 'AI-ОПЕРАТОР / LIVE SYSTEM',
        title: 'Разговор, который заканчивается действием.',
        text: 'Голосовой AI понимает намерение, работает с расписанием и CRM, фиксирует результат и передаёт сложный разговор сотруднику.',
        start: 'Запустить сценарий',
        replay: 'Повторить звонок',
        incoming: 'Входящий звонок',
        client: 'Клиент',
        operator: 'AI-оператор',
        transcript: [
          'Хочу записаться в пятницу после шести.',
          'Нашёл свободные слоты: 18:30 и 19:15.',
          'Записываю на 18:30. Подтверждение отправлено.',
        ],
        steps: ['Понимает намерение', 'Проверяет расписание', 'Отвечает клиенту', 'Создаёт запись', 'Обновляет CRM'],
        mobileFlow: ['Входящий звонок', 'Язык клиента', 'AI отвечает', 'Knowledge', 'Запись / консультация / услуга', 'Telegram control', 'CRM'],
        capabilities: ['Входящие и исходящие звонки', 'Цены и типовые вопросы', 'Запись, перенос и отмена', 'Квалификация лида', 'Работа с CRM', 'Передача сотруднику'],
        useCases: 'Клиники · стоматологии · автосервисы · рестораны · салоны · сервисный бизнес · call-центры',
        intentLabel: 'НАМЕРЕНИЕ / ЗАПИСЬ',
      },
      assistants: {
        label: 'AI-АССИСТЕНТЫ',
        title: 'Рабочий инструмент внутри процесса.',
        text: 'Не отдельный чат-бот, а контролируемый слой между запросом, корпоративными знаниями и действием в системе.',
        roles: [
          ['Продажи', 'Квалификация, контекст лида и следующий шаг.'],
          ['Поддержка', 'Точные ответы и передача сложных обращений.'],
          ['Сотрудники', 'Поиск корпоративной информации и внутренних правил.'],
          ['Операции', 'Документы, заявки, отчёты и API-действия.'],
        ],
        flow: ['Запрос', 'Контекст', 'Решение', 'Действие'],
      },
      crm: {
        label: 'CRM-АВТОМАТИЗАЦИЯ',
        title: 'Лид не должен теряться между инструментами.',
        text: 'Связываем сайт, телефонию, AI, Telegram, email и CRM в управляемый поток с прозрачной ответственностью.',
        items: ['Создание и распределение лидов', 'Стадии, задачи и reminders', 'Follow-up и lead scoring', 'Телефония и AI-оператор', 'Документы и синхронизация', 'Отчётность и dashboards'],
        stages: ['Новый запрос', 'Квалификация', 'Ответственный', 'Follow-up', 'Сделка', 'Аналитика'],
      },
      integrations: {
        label: 'ИНТЕГРАЦИИ',
        title: 'Данные движутся. Система сохраняет контекст.',
        nodes: ['Сайт', 'CRM', 'AI', 'Мессенджеры', 'Email', 'Аналитика'],
      },
      custom: {
        label: 'ИНДИВИДУАЛЬНАЯ АВТОМАТИЗАЦИЯ',
        title: 'Список продуктов — не граница наших возможностей.',
        text: 'Начинаем с процесса, а не с готового пакета. Архитектура решения следует реальной работе компании.',
        steps: [['01', 'Анализ'], ['02', 'Архитектура'], ['03', 'Реализация'], ['04', 'Интеграция'], ['05', 'Оптимизация']],
      },
    },
    development: {
      label: '02 / РАЗРАБОТКА',
      title: 'Софт с конкретной',
      titleAccent: 'причиной существовать.',
      intro: 'Мы не продаём стек технологий. Мы создаём инструмент, который должен решить конкретную задачу бизнеса.',
      visual: ['ИНТЕРФЕЙС', 'ЛОГИКА', 'ДАННЫЕ'],
      principle: 'От публичного сайта до внутренней операционной системы — одна дисциплина: ясная задача, сильный интерфейс, надёжная логика.',
      products: [
        ['01', 'Landing Pages', 'Одностраничные сайты с ясной аргументацией и точным conversion path.', 'от €120'],
        ['02', 'Корпоративные сайты', 'Полноценные сайты компаний, брендов, сервисов и продуктов.', 'от €250'],
        ['03', 'Web Applications', 'Web-приложения с индивидуальной бизнес-логикой.', 'Индивидуально'],
        ['04', 'Internal Tools', 'Dashboards, admin panels, management systems и reporting interfaces.', 'Индивидуально'],
        ['05', 'MVP Development', 'Первая полноценная рабочая версия продукта для проверки реального сценария.', 'Индивидуально'],
        ['06', 'Custom Software', 'Решение под задачу, для которой нет подходящего готового инструмента.', 'Индивидуально'],
      ],
      landing: {
        label: 'ТОЧКА ВХОДА / LANDING PAGE',
        title: 'Малый формат. Полная дизайнерская дисциплина.',
        text: '€120 — минимальная точка входа для простого landing page, а не обещание шаблонного сайта. Сложность, контент, motion и интеграции оцениваются отдельно.',
        price: 'от €120',
        cta: 'Обсудить сайт',
        art: ['СЛОЖНОЕ', 'СТАНОВИТСЯ', 'НЕИЗБЕЖНЫМ.'],
      },
      build: {
        label: 'КАК СТРОИТСЯ ПРОДУКТ',
        steps: ['Задача', 'Сценарий', 'Архитектура', 'Интерфейс', 'Разработка', 'Запуск'],
      },
    },
    performance: {
      label: '03 / РЕКЛАМА И ПРОДВИЖЕНИЕ',
      title: 'Спрос становится',
      titleAccent: 'управляемой системой.',
      intro: 'Канал выбирает задача, зрелость спроса и экономика продукта. Корректное измерение проектируется до масштабирования.',
      selector: 'ВЫБЕРИТЕ СИГНАЛ',
      capabilitiesLabel: 'ЧТО МАСШТАБИРУЕМ',
      axis: ['ВНИМАНИЕ', 'НАМЕРЕНИЕ', 'КОНВЕРСИЯ'],
      channels: [
        {
          id: 'google', name: 'Google', label: 'СФОРМИРОВАННЫЙ СПРОС', verb: 'Перехватываем намерение.',
          text: 'Google особенно полезен, когда человек уже ищет решение прямо сейчас — услугу рядом, конкретный продукт или исполнителя.',
          items: ['Search Ads', 'Performance Max', 'Shopping', 'Remarketing', 'Lead Generation', 'Conversion Tracking'],
          formula: ['Поиск', 'Намерение', 'Клик', 'Конверсия'],
          examples: ['стоматология рядом', 'ремонт автомобиля', 'купить продукт'],
        },
        {
          id: 'meta', name: 'Meta', label: 'ПОТЕНЦИАЛЬНАЯ АУДИТОРИЯ', verb: 'Находим до активного поиска.',
          text: 'Facebook и Instagram помогают сформировать интерес через точную аудиторию, сильное предложение, креатив и аналитику.',
          items: ['Lead Generation', 'E-commerce', 'Retargeting', 'Prospecting', 'Local Business', 'Conversion Campaigns'],
          formula: ['Аудитория', 'Предложение', 'Креатив', 'Аналитика'],
        },
        {
          id: 'tiktok', name: 'TikTok', label: 'SHORT-FORM / НОВЫЙ СПРОС', verb: 'Превращаем показ в движение.',
          text: 'TikTok силён для продуктов и услуг, которые можно убедительно показать через short-form content. Он подходит не каждому бизнесу.',
          items: ['Привлечение', 'Тестирование креативов', 'E-commerce', 'Потребительские услуги', 'Узнаваемость', 'Формирование спроса'],
          formula: ['Хук', 'Ритм', 'Доказательство', 'Действие'],
          formulaDescriptions: ['Останавливаем скролл.', 'Удерживаем внимание.', 'Создаём доверие.', 'Переводим внимание в следующий шаг.'],
        },
      ],
      analytics: {
        label: 'ANALYTICS & TRACKING',
        title: 'Реклама без измерения — только расход.',
        text: 'Связываем каналы с единым слоем данных, чтобы решения опирались на качество сигнала, а не на интерфейс рекламного кабинета.',
        items: ['Конверсии', 'События', 'Pixels', 'Атрибуция', 'Dashboards', 'Качество данных'],
        flow: ['Google · Meta · TikTok', 'Tracking', 'Analytics', 'Decisions'],
      },
    },
  },
}

const en = {
  common: {
    home: 'Home', services: 'Services', cases: 'Cases', about: 'About', pricing: 'Pricing', contact: 'Contact',
    discuss: 'Discuss a project', explore: 'Enter capability', allServices: 'All services', next: 'Next capability',
    menu: 'Menu', close: 'Close',
    system: ['Attract', 'Capture', 'Process', 'Automate', 'Manage', 'Analyze', 'Optimize'],
  },
  meta: {
    services: ['OSNOVA services — automation, development and marketing', 'Three connected capabilities for the complete digital business system.'],
    automation: ['Business Automation — OSNOVA', 'AI voice operators, AI assistants, CRM, integrations and custom process automation.'],
    development: ['Digital Product Development — OSNOVA', 'Landing pages, corporate websites, web applications, internal tools, MVPs and custom software.'],
    performance: ['Performance Marketing — OSNOVA', 'Google Ads, Meta Ads, TikTok Ads, analytics and accurate tracking as one performance system.'],
  },
  servicesPage: {
    label: 'SERVICES / 01—03', title: 'Three worlds.', titleAccent: 'One system.',
    intro: 'Choose a point of entry. Each capability works independently; the greatest effect comes when they connect.',
    hint: 'Hover to explore · click to enter',
  },
  directions: [
    { id: 'automation', number: '01', name: 'Business Automation', short: 'Processes, signals, data and intelligence.', statement: 'We remove repetitive work and design a connected operating layer.', items: ['AI Voice Operator', 'AI Assistants', 'CRM Automation', 'Integrations', 'Custom Automation'] },
    { id: 'development', number: '02', name: 'Development', short: 'Structure, interfaces, logic and product.', statement: 'We create tools built to solve a concrete business problem.', items: ['Landing Pages', 'Corporate Websites', 'Web Applications', 'Internal Tools', 'MVP Development', 'Custom Software'] },
    { id: 'performance', number: '03', name: 'Performance Marketing', short: 'Attention, demand, conversion and measurement.', statement: 'We acquire demand and build measurement before campaigns scale.', items: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Analytics & Tracking'] },
  ],
  automation: {
    label: '01 / BUSINESS AUTOMATION', title: 'We design the work,', titleAccent: 'not a bundle of AI features.',
    intro: 'We study how the company works today, find repetitive actions and bottlenecks, then build a system around that specific business.',
    signal: 'Process online',
    heroFlow: ['Input', 'Context', 'Decision', 'Action'],
    propositionLabel: 'OS / SYSTEM PRINCIPLE',
    proposition: 'If a process repeats inside the company, it can be mapped, measured and assessed for meaningful automation.',
    voice: {
      label: 'AI VOICE OPERATOR / LIVE SYSTEM', title: 'A conversation that ends in action.',
      text: 'Voice AI understands intent, works with scheduling and CRM, records the outcome and hands complex conversations to a person.',
      start: 'Run scenario', replay: 'Replay call', incoming: 'Incoming call', client: 'Customer', operator: 'AI operator',
      transcript: ['I would like Friday after six.', 'Found open times: 18:30 and 19:15.', 'Booked for 18:30. Confirmation sent.'],
      steps: ['Understands intent', 'Checks schedule', 'Answers customer', 'Creates booking', 'Updates CRM'],
      mobileFlow: ['Incoming call', 'Customer language', 'AI answers', 'Knowledge', 'Booking / consultation / service', 'Telegram control', 'CRM'],
      capabilities: ['Inbound & outbound calls', 'Pricing and common questions', 'Book, move and cancel', 'Lead qualification', 'CRM actions', 'Human handoff'],
      useCases: 'Clinics · dentists · garages · restaurants · salons · service businesses · call centers',
      intentLabel: 'INTENT / BOOKING',
    },
    assistants: {
      label: 'AI ASSISTANTS', title: 'A working tool inside the process.',
      text: 'Not a detached chatbot, but a controlled layer between the request, company knowledge and an action in the system.',
      roles: [['Sales', 'Qualification, lead context and next action.'], ['Support', 'Accurate answers and escalation of edge cases.'], ['Employees', 'Company information and internal policies.'], ['Operations', 'Documents, requests, reports and API actions.']],
      flow: ['Request', 'Context', 'Decision', 'Action'],
    },
    crm: {
      label: 'CRM AUTOMATION', title: 'A lead should not disappear between tools.',
      text: 'We connect the website, phone, AI, Telegram, email and CRM into a controlled flow with clear ownership.',
      items: ['Lead creation and routing', 'Stages, tasks and reminders', 'Follow-up and lead scoring', 'Phone and AI operator', 'Documents and sync', 'Reporting and dashboards'],
      stages: ['New request', 'Qualification', 'Owner', 'Follow-up', 'Won', 'Analytics'],
    },
    integrations: { label: 'INTEGRATIONS', title: 'Data moves. The system retains context.', nodes: ['Website', 'CRM', 'AI', 'Messengers', 'Email', 'Analytics'] },
    custom: {
      label: 'CUSTOM AUTOMATION', title: 'The product list does not define our limit.',
      text: 'We start with the process, not a package. The solution architecture follows the company’s real work.',
      steps: [['01', 'Analysis'], ['02', 'Architecture'], ['03', 'Implementation'], ['04', 'Integration'], ['05', 'Optimization']],
    },
  },
  development: {
    label: '02 / DEVELOPMENT', title: 'Software with a clear', titleAccent: 'reason to exist.',
    intro: 'We do not sell a technology stack. We create a tool built to solve a concrete business problem.',
    visual: ['INTERFACE', 'LOGIC', 'DATA'],
    principle: 'From a public website to an internal operating system, the discipline is the same: a clear job, strong interface and reliable logic.',
    products: [
      ['01', 'Landing Pages', 'Single-page websites with a clear argument and precise conversion path.', 'from €120'],
      ['02', 'Corporate Websites', 'Complete websites for companies, brands, services and products.', 'from €250'],
      ['03', 'Web Applications', 'Web products with bespoke business logic.', 'Custom'],
      ['04', 'Internal Tools', 'Dashboards, admin panels, management systems and reporting interfaces.', 'Custom'],
      ['05', 'MVP Development', 'The first complete working version of a product for a real-world test.', 'Custom'],
      ['06', 'Custom Software', 'A solution for a job without a suitable off-the-shelf tool.', 'Custom'],
    ],
    landing: {
      label: 'ENTRY POINT / LANDING PAGE', title: 'Small format. Full design discipline.',
      text: '€120 is the minimum entry point for a simple landing page, not a promise of a template site. Complexity, content, motion and integrations are scoped separately.',
      price: 'from €120', cta: 'Discuss a website',
      art: ['MAKE THE', 'COMPLEX', 'INEVITABLE.'],
    },
    build: { label: 'HOW A PRODUCT IS BUILT', steps: ['Problem', 'Scenario', 'Architecture', 'Interface', 'Development', 'Launch'] },
  },
  performance: {
    label: '03 / PERFORMANCE MARKETING', title: 'Demand becomes', titleAccent: 'a manageable system.',
    intro: 'The channel follows the problem, demand maturity and product economics. Accurate measurement is designed before scale.',
    selector: 'SELECT A SIGNAL',
    capabilitiesLabel: 'WHAT WE SCALE',
    axis: ['ATTENTION', 'INTENT', 'CONVERSION'],
    channels: [
      { id: 'google', name: 'Google', label: 'EXISTING DEMAND', verb: 'Capture active intent.', text: 'Google is particularly useful when someone is already looking for a solution — a nearby service, a specific product or a provider.', items: ['Search Ads', 'Performance Max', 'Shopping', 'Remarketing', 'Lead Generation', 'Conversion Tracking'], formula: ['Search', 'Intent', 'Click', 'Conversion'], examples: ['dentist near me', 'repair service', 'buy product'] },
      { id: 'meta', name: 'Meta', label: 'POTENTIAL AUDIENCE', verb: 'Find them before the search.', text: 'Facebook and Instagram create interest through precise audiences, a strong offer, creative and analytics.', items: ['Lead Generation', 'E-commerce', 'Retargeting', 'Prospecting', 'Local Business', 'Conversion Campaigns'], formula: ['Audience', 'Offer', 'Creative', 'Analytics'] },
      { id: 'tiktok', name: 'TikTok', label: 'SHORT-FORM / NEW DEMAND', verb: 'Turn attention into motion.', text: 'TikTok is powerful for products and services that short-form content can demonstrate convincingly. It is not for every business.', items: ['Acquisition', 'Creative Testing', 'E-commerce', 'Consumer Services', 'Awareness', 'Demand Generation'], formula: ['Hook', 'Rhythm', 'Proof', 'Action'], formulaDescriptions: ['Stop the scroll.', 'Hold attention.', 'Build trust.', 'Turn attention into the next step.'] },
    ],
    analytics: {
      label: 'ANALYTICS & TRACKING', title: 'Advertising without measurement is only spend.',
      text: 'We connect channels to one data layer, so decisions reflect signal quality rather than the ad platform interface.',
      items: ['Conversions', 'Events', 'Pixels', 'Attribution', 'Dashboards', 'Data quality'],
      flow: ['Google · Meta · TikTok', 'Tracking', 'Analytics', 'Decisions'],
    },
  },
}

serviceContent.en = en

const replaceDeep = (value, pairs) => {
  if (typeof value === 'string') return pairs.reduce((text, [from, to]) => text.replaceAll(from, to), value)
  if (Array.isArray(value)) return value.map((item) => replaceDeep(item, pairs))
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceDeep(item, pairs)]))
  return value
}

serviceContent.de = replaceDeep(en, [
  ['Home', 'Startseite'], ['Services', 'Leistungen'], ['Cases', 'Projekte'], ['About', 'Über uns'], ['Pricing', 'Preise'], ['Contact', 'Kontakt'],
  ['Discuss a project', 'Projekt besprechen'], ['Enter capability', 'Bereich öffnen'], ['All services', 'Alle Leistungen'], ['Next capability', 'Nächster Bereich'],
  ['Three worlds.', 'Drei Welten.'], ['One system.', 'Ein System.'], ['Business Automation', 'Geschäfts­automatisierung'],
  ['Development', 'Entwicklung'], ['Performance Marketing', 'Online-Marketing'], ['BUSINESS AUTOMATION', 'GESCHÄFTS­AUTOMATISIERUNG'],
  ['Software with a clear', 'Software mit einem klaren'], ['reason to exist.', 'Grund zu existieren.'],
  ['Demand becomes', 'Nachfrage wird'], ['a manageable system.', 'zu einem steuerbaren System.'],
  ['from €250', 'ab €250'], ['Custom', 'Individuell'], ['Customer', 'Kunde'], ['Request', 'Anfrage'],
])
serviceContent.de.servicesPage.intro = 'Wählen Sie den Einstiegspunkt. Jeder Bereich funktioniert eigenständig; die größte Wirkung entsteht im Zusammenspiel.'
serviceContent.de.servicesPage.hint = 'Fokus zum Erkunden · klicken zum Öffnen'
serviceContent.de.servicesPage.label = 'LEISTUNGEN / 01—03'
serviceContent.de.common.menu = 'Menü'
serviceContent.de.common.close = 'Schließen'
serviceContent.de.common.system = ['Gewinnen', 'Erfassen', 'Verarbeiten', 'Automatisieren', 'Steuern', 'Analysieren', 'Optimieren']
serviceContent.de.directions = [
  { id: 'automation', number: '01', name: 'Geschäfts­automatisierung', short: 'Prozesse, Signale, Daten und Intelligenz.', statement: 'Wir reduzieren wiederkehrende Arbeit und entwickeln eine verbundene operative Ebene.', items: ['AI-Telefonassistent', 'AI-Assistenten', 'CRM-Automatisierung', 'Integrationen', 'Individuelle Automatisierung'] },
  { id: 'development', number: '02', name: 'Entwicklung', short: 'Struktur, Interfaces, Logik und Produkt.', statement: 'Wir entwickeln Werkzeuge für eine konkrete geschäftliche Aufgabe.', items: ['Landingpages', 'Unternehmens­websites', 'Web-Applikationen', 'Interne Tools', 'MVP-Entwicklung', 'Individuelle Software'] },
  { id: 'performance', number: '03', name: 'Online-Marketing', short: 'Aufmerksamkeit, Nachfrage, Conversion und Messung.', statement: 'Wir gewinnen Nachfrage und entwickeln Messbarkeit, bevor Kampagnen skalieren.', items: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Analytics & Tracking'] },
]
serviceContent.de.automation.intro = 'Wir analysieren die bestehende Arbeit, finden wiederkehrende Schritte und Engpässe und bauen daraus ein System für das konkrete Unternehmen.'
serviceContent.de.development.intro = 'Wir verkaufen keinen Technologie-Stack. Wir entwickeln ein Werkzeug, das eine konkrete geschäftliche Aufgabe löst.'
serviceContent.de.performance.intro = 'Der Kanal folgt der Aufgabe, dem Reifegrad der Nachfrage und der Produktökonomie. Messbarkeit wird vor der Skalierung entwickelt.'
serviceContent.de.meta = {
  services: ['OSNOVA Leistungen — Automatisierung, Entwicklung und Marketing', 'Drei verbundene Bereiche für das vollständige digitale Geschäftssystem.'],
  automation: ['Geschäftsautomatisierung — OSNOVA', 'AI-Telefonie, AI-Assistenten, CRM, Integrationen und individuelle Prozessautomatisierung.'],
  development: ['Digitale Produktentwicklung — OSNOVA', 'Landingpages, Unternehmenswebsites, Web-Applikationen, interne Tools, MVPs und individuelle Software.'],
  performance: ['Online-Marketing — OSNOVA', 'Google Ads, Meta Ads, TikTok Ads, Analytics und präzises Tracking als ein Performance-System.'],
}
Object.assign(serviceContent.de.automation, {
  label: '01 / GESCHÄFTSAUTOMATISIERUNG',
  title: 'Wir gestalten die Arbeit,',
  titleAccent: 'nicht ein Bündel von AI-Funktionen.',
  intro: 'Wir analysieren die bestehende Arbeit, finden wiederkehrende Schritte und Engpässe und bauen daraus ein System für das konkrete Unternehmen.',
  signal: 'Prozess aktiv',
  heroFlow: ['Eingang', 'Kontext', 'Entscheidung', 'Aktion'],
  propositionLabel: 'OS / SYSTEMPRINZIP',
  proposition: 'Wenn sich ein Prozess im Unternehmen wiederholt, kann er abgebildet, gemessen und auf sinnvolle Automatisierung geprüft werden.',
  voice: {
    label: 'AI-TELEFONASSISTENT / LIVE-SYSTEM',
    title: 'Ein Gespräch, das mit einer Handlung endet.',
    text: 'Die Sprach-AI versteht die Absicht, arbeitet mit Terminplan und CRM, dokumentiert das Ergebnis und übergibt komplexe Gespräche an Mitarbeitende.',
    start: 'Szenario starten', replay: 'Anruf wiederholen', incoming: 'Eingehender Anruf', client: 'Kunde', operator: 'AI-Assistent',
    transcript: ['Ich möchte am Freitag nach sechs einen Termin.', 'Freie Zeiten gefunden: 18:30 und 19:15.', 'Für 18:30 gebucht. Bestätigung wurde gesendet.'],
    steps: ['Versteht die Absicht', 'Prüft den Terminplan', 'Antwortet dem Kunden', 'Erstellt den Termin', 'Aktualisiert das CRM'],
    mobileFlow: ['Eingehender Anruf', 'Sprache des Kunden', 'AI antwortet', 'Wissensbasis', 'Termin / Beratung / Leistung', 'Telegram-Steuerung', 'CRM'],
    capabilities: ['Ein- und ausgehende Anrufe', 'Preise und häufige Fragen', 'Buchen, verschieben, stornieren', 'Lead-Qualifizierung', 'CRM-Aktionen', 'Übergabe an Mitarbeitende'],
    useCases: 'Kliniken · Zahnärzte · Werkstätten · Restaurants · Salons · Dienstleister · Callcenter',
    intentLabel: 'ABSICHT / TERMIN',
  },
  assistants: {
    label: 'AI-ASSISTENTEN', title: 'Ein Arbeitswerkzeug mitten im Prozess.',
    text: 'Kein losgelöster Chatbot, sondern eine kontrollierte Ebene zwischen Anfrage, Unternehmenswissen und Aktion im System.',
    roles: [['Vertrieb', 'Qualifizierung, Lead-Kontext und nächste Aktion.'], ['Support', 'Präzise Antworten und Übergabe schwieriger Fälle.'], ['Mitarbeitende', 'Unternehmenswissen und interne Regeln.'], ['Betrieb', 'Dokumente, Anfragen, Berichte und API-Aktionen.']],
    flow: ['Anfrage', 'Kontext', 'Entscheidung', 'Aktion'],
  },
  crm: {
    label: 'CRM-AUTOMATISIERUNG', title: 'Ein Lead darf nicht zwischen Werkzeugen verschwinden.',
    text: 'Wir verbinden Website, Telefonie, AI, Telegram, E-Mail und CRM zu einem steuerbaren Ablauf mit klarer Verantwortung.',
    items: ['Lead-Erstellung und Verteilung', 'Phasen, Aufgaben und Erinnerungen', 'Follow-up und Lead Scoring', 'Telefonie und AI-Assistent', 'Dokumente und Synchronisierung', 'Berichte und Dashboards'],
    stages: ['Neue Anfrage', 'Qualifizierung', 'Verantwortlich', 'Follow-up', 'Abschluss', 'Analyse'],
  },
  integrations: { label: 'INTEGRATIONEN', title: 'Daten bewegen sich. Das System bewahrt den Kontext.', nodes: ['Website', 'CRM', 'AI', 'Messenger', 'E-Mail', 'Analytics'] },
  custom: {
    label: 'INDIVIDUELLE AUTOMATISIERUNG', title: 'Die Produktliste ist nicht unsere Grenze.',
    text: 'Wir beginnen mit dem Prozess, nicht mit einem Paket. Die Lösungsarchitektur folgt der realen Arbeit im Unternehmen.',
    steps: [['01', 'Analyse'], ['02', 'Architektur'], ['03', 'Umsetzung'], ['04', 'Integration'], ['05', 'Optimierung']],
  },
})
Object.assign(serviceContent.de.development, {
  label: '02 / ENTWICKLUNG',
  title: 'Software mit einem klaren',
  titleAccent: 'Grund zu existieren.',
  intro: 'Wir verkaufen keinen Technologie-Stack. Wir entwickeln ein Werkzeug, das eine konkrete geschäftliche Aufgabe löst.',
  visual: ['INTERFACE', 'LOGIK', 'DATEN'],
  principle: 'Von der öffentlichen Website bis zum internen Betriebssystem gilt dieselbe Disziplin: klare Aufgabe, starkes Interface und zuverlässige Logik.',
  products: [
    ['01', 'Landingpages', 'Einseitige Websites mit klarer Argumentation und präzisem Conversion-Pfad.', 'ab €120'],
    ['02', 'Unternehmens­websites', 'Vollständige Websites für Unternehmen, Marken, Services und Produkte.', 'ab €250'],
    ['03', 'Web-Applikationen', 'Web-Produkte mit individueller Geschäftslogik.', 'Individuell'],
    ['04', 'Interne Tools', 'Dashboards, Admin-Panels, Managementsysteme und Reporting-Interfaces.', 'Individuell'],
    ['05', 'MVP-Entwicklung', 'Die erste vollständige Arbeitsversion eines Produkts für den realen Test.', 'Individuell'],
    ['06', 'Individuelle Software', 'Eine Lösung für eine Aufgabe ohne passendes Standardwerkzeug.', 'Individuell'],
  ],
  landing: {
    label: 'EINSTIEG / LANDINGPAGE', title: 'Kleines Format. Volle Designdisziplin.',
    text: '€120 ist der Mindesteinstieg für eine einfache Landingpage, kein Versprechen für eine Template-Website. Komplexität, Inhalt, Motion und Integrationen werden separat bewertet.',
    price: 'ab €120', cta: 'Website besprechen', art: ['KOMPLEXES', 'WIRD', 'KLAR.'],
  },
  build: { label: 'SO ENTSTEHT EIN PRODUKT', steps: ['Aufgabe', 'Szenario', 'Architektur', 'Interface', 'Entwicklung', 'Launch'] },
})
Object.assign(serviceContent.de.performance, {
  label: '03 / ONLINE-MARKETING',
  title: 'Nachfrage wird',
  titleAccent: 'zu einem steuerbaren System.',
  intro: 'Der Kanal folgt der Aufgabe, dem Reifegrad der Nachfrage und der Produktökonomie. Messbarkeit wird vor der Skalierung entwickelt.',
  selector: 'SIGNAL AUSWÄHLEN',
  capabilitiesLabel: 'WAS WIR SKALIEREN',
  axis: ['AUFMERKSAMKEIT', 'ABSICHT', 'CONVERSION'],
  channels: [
    { id: 'google', name: 'Google', label: 'BESTEHENDE NACHFRAGE', verb: 'Aktive Absicht erfassen.', text: 'Google ist besonders nützlich, wenn jemand bereits nach einer Lösung sucht — nach einem Dienstleister in der Nähe, einem konkreten Produkt oder einem Anbieter.', items: ['Search Ads', 'Performance Max', 'Shopping', 'Remarketing', 'Lead Generation', 'Conversion Tracking'], formula: ['Suche', 'Absicht', 'Klick', 'Conversion'], examples: ['Zahnarzt in der Nähe', 'Autoreparatur', 'Produkt kaufen'] },
    { id: 'meta', name: 'Meta', label: 'POTENZIELLE ZIELGRUPPE', verb: 'Finden, bevor die Suche beginnt.', text: 'Facebook und Instagram erzeugen Interesse durch präzise Zielgruppen, ein starkes Angebot, Creative und Analytics.', items: ['Lead Generation', 'E-Commerce', 'Retargeting', 'Prospecting', 'Lokales Geschäft', 'Conversion-Kampagnen'], formula: ['Zielgruppe', 'Angebot', 'Creative', 'Analytics'] },
    { id: 'tiktok', name: 'TikTok', label: 'SHORT-FORM / NEUE NACHFRAGE', verb: 'Aufmerksamkeit in Bewegung verwandeln.', text: 'TikTok ist stark für Produkte und Services, die Short-Form-Content überzeugend zeigen kann. Der Kanal passt nicht zu jedem Unternehmen.', items: ['Akquisition', 'Creative Testing', 'E-Commerce', 'Consumer Services', 'Awareness', 'Demand Generation'], formula: ['Hook', 'Rhythmus', 'Beweis', 'Aktion'], formulaDescriptions: ['Stoppt den Scroll.', 'Hält Aufmerksamkeit.', 'Schafft Vertrauen.', 'Führt zum nächsten Schritt.'] },
  ],
  analytics: {
    label: 'ANALYTICS & TRACKING', title: 'Werbung ohne Messung ist nur Ausgabe.',
    text: 'Wir verbinden die Kanäle mit einer gemeinsamen Datenebene, damit Entscheidungen auf Signalqualität statt auf der Oberfläche des Werbekontos basieren.',
    items: ['Conversions', 'Events', 'Pixels', 'Attribution', 'Dashboards', 'Datenqualität'],
    flow: ['Google · Meta · TikTok', 'Tracking', 'Analytics', 'Entscheidungen'],
  },
})

serviceContent.uk = replaceDeep(serviceContent.ru, [
  ['Главная', 'Головна'], ['Услуги', 'Послуги'], ['Кейсы', 'Кейси'], ['О нас', 'Про нас'], ['Цены', 'Ціни'], ['Контакты', 'Контакти'],
  ['Обсудить проект', 'Обговорити проєкт'], ['Открыть направление', 'Відкрити напрям'], ['Все услуги', 'Усі послуги'], ['Следующее направление', 'Наступний напрям'],
  ['Автоматизация бизнеса', 'Автоматизація бізнесу'], ['Разработка', 'Розробка'], ['Реклама и продвижение', 'Реклама та просування'],
  ['Индивидуально', 'Індивідуально'], ['от €250', 'від €250'], ['Клиент', 'Клієнт'], ['Анализ', 'Аналіз'],
])
serviceContent.uk.servicesPage.title = 'Три світи.'
serviceContent.uk.servicesPage.titleAccent = 'Одна система.'
serviceContent.uk.servicesPage.intro = 'Оберіть точку входу. Кожен напрям працює самостійно, але найбільший ефект виникає, коли вони пов’язані.'
serviceContent.uk.servicesPage.hint = 'Наведіть, щоб дослідити · натисніть, щоб увійти'
serviceContent.uk.servicesPage.label = 'ПОСЛУГИ / 01—03'
serviceContent.uk.common.close = 'Закрити'
serviceContent.uk.common.system = ['Залучити', 'Прийняти', 'Обробити', 'Автоматизувати', 'Керувати', 'Аналізувати', 'Оптимізувати']
serviceContent.uk.directions = [
  { id: 'automation', number: '01', name: 'Автоматизація бізнесу', short: 'Процеси, сигнали, дані та інтелект.', statement: 'Прибираємо повторювану роботу й проєктуємо пов’язаний операційний контур.', items: ['AI-оператор', 'AI-асистенти', 'CRM-автоматизація', 'Інтеграції', 'Індивідуальна автоматизація'] },
  { id: 'development', number: '02', name: 'Розробка', short: 'Структура, інтерфейси, логіка та продукт.', statement: 'Створюємо інструмент, який має вирішити конкретне завдання бізнесу.', items: ['Landing Pages', 'Корпоративні сайти', 'Web Applications', 'Внутрішні інструменти', 'MVP Development', 'Custom Software'] },
  { id: 'performance', number: '03', name: 'Реклама та просування', short: 'Увага, попит, конверсія та вимірювання.', statement: 'Залучаємо попит і будуємо вимірювання до масштабування кампаній.', items: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Аналітика й tracking'] },
]
serviceContent.uk.automation.intro = 'Вивчаємо роботу компанії, знаходимо повторювані дії та вузькі місця, а потім створюємо систему під конкретний бізнес.'
serviceContent.uk.development.intro = 'Ми не продаємо стек технологій. Ми створюємо інструмент, який має вирішити конкретне завдання бізнесу.'
serviceContent.uk.performance.intro = 'Канал визначають завдання, зрілість попиту та економіка продукту. Коректне вимірювання проєктується до масштабування.'
serviceContent.uk.meta = {
  services: ['Послуги OSNOVA — автоматизація, розробка та реклама', 'Три пов’язані напрями для всієї digital-системи бізнесу.'],
  automation: ['Автоматизація бізнесу — OSNOVA', 'AI-оператори, AI-асистенти, CRM, інтеграції та індивідуальна автоматизація процесів.'],
  development: ['Розробка digital-продуктів — OSNOVA', 'Landing pages, корпоративні сайти, web-застосунки, внутрішні інструменти, MVP та custom software.'],
  performance: ['Реклама та просування — OSNOVA', 'Google Ads, Meta Ads, TikTok Ads, аналітика й коректний tracking як єдина performance-система.'],
}
Object.assign(serviceContent.uk.automation, {
  label: '01 / АВТОМАТИЗАЦІЯ БІЗНЕСУ',
  title: 'Проєктуємо роботу,',
  titleAccent: 'а не набір AI-функцій.',
  intro: 'Вивчаємо роботу компанії, знаходимо повторювані дії та вузькі місця, а потім створюємо систему під конкретний бізнес.',
  signal: 'Процес активний',
  heroFlow: ['Вхід', 'Контекст', 'Рішення', 'Дія'],
  propositionLabel: 'OS / ПРИНЦИП СИСТЕМИ',
  proposition: 'Якщо всередині компанії є повторюваний процес, його можна розібрати, виміряти й визначити, де автоматизація дасть реальний ефект.',
  voice: {
    label: 'AI-ОПЕРАТОР / LIVE SYSTEM', title: 'Розмова, що завершується дією.',
    text: 'Голосовий AI розуміє намір, працює з розкладом і CRM, фіксує результат та передає складну розмову співробітнику.',
    start: 'Запустити сценарій', replay: 'Повторити дзвінок', incoming: 'Вхідний дзвінок', client: 'Клієнт', operator: 'AI-оператор',
    transcript: ['Хочу записатися в п’ятницю після шостої.', 'Знайдено вільні слоти: 18:30 та 19:15.', 'Записую на 18:30. Підтвердження надіслано.'],
    steps: ['Розуміє намір', 'Перевіряє розклад', 'Відповідає клієнту', 'Створює запис', 'Оновлює CRM'],
    mobileFlow: ['Вхідний дзвінок', 'Мова клієнта', 'AI відповідає', 'Knowledge', 'Запис / консультація / послуга', 'Telegram control', 'CRM'],
    capabilities: ['Вхідні та вихідні дзвінки', 'Ціни й типові питання', 'Запис, перенесення та скасування', 'Кваліфікація ліда', 'Робота з CRM', 'Передача співробітнику'],
    useCases: 'Клініки · стоматології · автосервіси · ресторани · салони · сервісний бізнес · call-центри',
    intentLabel: 'НАМІР / ЗАПИС',
  },
  assistants: {
    label: 'AI-АСИСТЕНТИ', title: 'Робочий інструмент усередині процесу.',
    text: 'Не окремий чат-бот, а контрольований шар між запитом, корпоративними знаннями та дією в системі.',
    roles: [['Продажі', 'Кваліфікація, контекст ліда та наступний крок.'], ['Підтримка', 'Точні відповіді й передача складних звернень.'], ['Співробітники', 'Пошук корпоративної інформації та внутрішніх правил.'], ['Операції', 'Документи, заявки, звіти й API-дії.']],
    flow: ['Запит', 'Контекст', 'Рішення', 'Дія'],
  },
  crm: {
    label: 'CRM-АВТОМАТИЗАЦІЯ', title: 'Лід не повинен губитися між інструментами.',
    text: 'Поєднуємо сайт, телефонію, AI, Telegram, email і CRM у керований потік із прозорою відповідальністю.',
    items: ['Створення та розподіл лідів', 'Стадії, завдання й нагадування', 'Follow-up і lead scoring', 'Телефонія та AI-оператор', 'Документи й синхронізація', 'Звітність і dashboards'],
    stages: ['Новий запит', 'Кваліфікація', 'Відповідальний', 'Follow-up', 'Угода', 'Аналітика'],
  },
  integrations: { label: 'ІНТЕГРАЦІЇ', title: 'Дані рухаються. Система зберігає контекст.', nodes: ['Сайт', 'CRM', 'AI', 'Месенджери', 'Email', 'Аналітика'] },
  custom: {
    label: 'ІНДИВІДУАЛЬНА АВТОМАТИЗАЦІЯ', title: 'Список продуктів — не межа наших можливостей.',
    text: 'Починаємо з процесу, а не з готового пакета. Архітектура рішення відповідає реальній роботі компанії.',
    steps: [['01', 'Аналіз'], ['02', 'Архітектура'], ['03', 'Реалізація'], ['04', 'Інтеграція'], ['05', 'Оптимізація']],
  },
})
Object.assign(serviceContent.uk.development, {
  label: '02 / РОЗРОБКА',
  title: 'Софт із конкретною',
  titleAccent: 'причиною існування.',
  intro: 'Ми не продаємо стек технологій. Ми створюємо інструмент, який має вирішити конкретне завдання бізнесу.',
  visual: ['ІНТЕРФЕЙС', 'ЛОГІКА', 'ДАНІ'],
  principle: 'Від публічного сайту до внутрішньої операційної системи — одна дисципліна: чітке завдання, сильний інтерфейс і надійна логіка.',
  products: [
    ['01', 'Landing Pages', 'Односторінкові сайти з чіткою аргументацією та точним conversion path.', 'від €120'],
    ['02', 'Корпоративні сайти', 'Повноцінні сайти компаній, брендів, сервісів і продуктів.', 'від €250'],
    ['03', 'Web Applications', 'Web-застосунки з індивідуальною бізнес-логікою.', 'Індивідуально'],
    ['04', 'Внутрішні інструменти', 'Dashboards, admin panels, management systems і reporting interfaces.', 'Індивідуально'],
    ['05', 'MVP Development', 'Перша повноцінна робоча версія продукту для перевірки реального сценарію.', 'Індивідуально'],
    ['06', 'Custom Software', 'Рішення під завдання, для якого немає відповідного готового інструмента.', 'Індивідуально'],
  ],
  landing: {
    label: 'ТОЧКА ВХОДУ / LANDING PAGE', title: 'Малий формат. Повна дизайнерська дисципліна.',
    text: '€120 — мінімальна точка входу для простого landing page, а не обіцянка шаблонного сайту. Складність, контент, motion та інтеграції оцінюються окремо.',
    price: 'від €120', cta: 'Обговорити сайт', art: ['СКЛАДНЕ', 'СТАЄ', 'НЕМИНУЧИМ.'],
  },
  build: { label: 'ЯК СТВОРЮЄТЬСЯ ПРОДУКТ', steps: ['Завдання', 'Сценарій', 'Архітектура', 'Інтерфейс', 'Розробка', 'Запуск'] },
})
Object.assign(serviceContent.uk.performance, {
  label: '03 / РЕКЛАМА ТА ПРОСУВАННЯ',
  title: 'Попит стає',
  titleAccent: 'керованою системою.',
  intro: 'Канал визначають завдання, зрілість попиту та економіка продукту. Коректне вимірювання проєктується до масштабування.',
  selector: 'ОБЕРІТЬ СИГНАЛ',
  capabilitiesLabel: 'ЩО МАСШТАБУЄМО',
  axis: ['УВАГА', 'НАМІР', 'КОНВЕРСІЯ'],
  channels: [
    { id: 'google', name: 'Google', label: 'СФОРМОВАНИЙ ПОПИТ', verb: 'Перехоплюємо намір.', text: 'Google особливо корисний, коли людина вже шукає рішення — послугу поруч, конкретний продукт або виконавця.', items: ['Search Ads', 'Performance Max', 'Shopping', 'Remarketing', 'Lead Generation', 'Conversion Tracking'], formula: ['Пошук', 'Намір', 'Клік', 'Конверсія'], examples: ['стоматологія поруч', 'ремонт автомобіля', 'купити продукт'] },
    { id: 'meta', name: 'Meta', label: 'ПОТЕНЦІЙНА АУДИТОРІЯ', verb: 'Знаходимо до активного пошуку.', text: 'Facebook та Instagram допомагають сформувати інтерес через точну аудиторію, сильну пропозицію, креатив і аналітику.', items: ['Lead Generation', 'E-commerce', 'Retargeting', 'Prospecting', 'Локальний бізнес', 'Conversion Campaigns'], formula: ['Аудиторія', 'Пропозиція', 'Креатив', 'Аналітика'] },
    { id: 'tiktok', name: 'TikTok', label: 'SHORT-FORM / НОВИЙ ПОПИТ', verb: 'Перетворюємо увагу на рух.', text: 'TikTok сильний для продуктів і послуг, які можна переконливо показати через short-form content. Він підходить не кожному бізнесу.', items: ['Залучення', 'Тестування креативів', 'E-commerce', 'Споживчі послуги', 'Впізнаваність', 'Формування попиту'], formula: ['Хук', 'Ритм', 'Доказ', 'Дія'], formulaDescriptions: ['Зупиняємо скрол.', 'Утримуємо увагу.', 'Створюємо довіру.', 'Переводимо увагу в наступний крок.'] },
  ],
  analytics: {
    label: 'АНАЛІТИКА & TRACKING', title: 'Реклама без вимірювання — лише витрати.',
    text: 'Поєднуємо канали з єдиним шаром даних, щоб рішення спиралися на якість сигналу, а не на інтерфейс рекламного кабінету.',
    items: ['Конверсії', 'Події', 'Pixels', 'Атрибуція', 'Dashboards', 'Якість даних'],
    flow: ['Google · Meta · TikTok', 'Tracking', 'Аналітика', 'Рішення'],
  },
})
