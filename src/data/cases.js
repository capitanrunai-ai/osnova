import { automationCases } from './automationCases.js'
import { dentistryCase } from './dentistryCase.js'
import { slavabudCase } from './slavabudCase.js'
import { dsRepairCase } from './dsRepairCase.js'

const localized = (ru, en, de, uk) => ({ ru, en, de, uk })

export const caseCategories = { development: [], automation: [] }

export const caseUi = {
  ru: {
    pageLabel: 'OSNOVA / НАШИ РАБОТЫ', pageTitle: 'Сделано. Работает.',
    pageIntro: 'Сайты, лендинги и AI. Реальные проекты — от первого экрана до работающего решения.',
    featuredLabel: 'ИЗБРАННЫЕ РАБОТЫ', featuredTitle: 'Идеи, которые работают.',
    featuredIntro: 'Разные задачи. Наш дизайн, разработка и автоматизация. Листайте и смотрите результат.',
    allCases: 'Все работы', openCase: 'Смотреть проект', viewAll: 'Все работы',
    dragHint: 'ЛИСТАЙТЕ / СВАЙП', wheelHint: '← → / SHIFT + WHEEL', navigationLabel: 'Навигация по работам',
    previous: 'Назад', next: 'Далее', start: 'Первая работа', end: 'Последняя работа', index: 'Проект',
    filters: { all: 'Все', development: 'Сайты / Разработка', automation: 'AI / Автоматизация' },
    empty: 'В этой категории пока нет работ.', nextCase: 'Следующая работа', backToCases: 'К портфолио',
    projects: 'ВЫПОЛНЕННЫХ ПРОЕКТОВ', visit: 'Открыть сайт', preview: 'Дизайн в деталях',
    desktop: 'Desktop', mobile: 'Mobile', screenshot: 'Снимок сайта', restored: 'Восстановление сайта',
    original: 'Предыдущий сайт', listen: 'Слушать звонок', pause: 'Пауза', replay: 'Слушать снова',
    audioTitle: 'Как звучит AI Voice в Dentistry', audioLabel: 'DENTISTRY / AI VOICE',
    audioNote: 'Запись стоматологического сценария Dentistry на русском языке. Показывает диалог с AI, ответы на вопросы и обсуждение консультации.',
    audioError: 'Не удалось загрузить запись. Откройте аудиофайл по ссылке ниже.',
    audioDownload: 'Открыть аудио', seek: 'Позиция воспроизведения', speed: 'Скорость воспроизведения',
    steps: ['Входящий звонок', 'Диалог с AI', 'Ответы на вопросы', 'Запрос на консультацию'],
    study: { task: 'Задача', solution: 'Решение', workflow: 'Сценарий', capabilities: 'Что умеет система', ai: 'Роль AI', human: 'Роль человека', channels: 'Каналы и интеграции', evidence: 'Реальные экраны системы', enlarge: 'Увеличить скриншот', close: 'Закрыть', service: 'Об автоматизации' },
    webStudy: { challenge: 'Задача', work: 'Что сделали', delivery: 'Срок', result: 'Результат', service: 'О разработке', googleAdsTracking: 'Google Ads tracking / Google tag подключён.' },
  },
  en: {
    pageLabel: 'OSNOVA / SELECTED WORK', pageTitle: 'Built. And live.',
    pageIntro: 'Websites, landing pages and AI. Real projects, from the first screen to a working solution.',
    featuredLabel: 'FEATURED WORK', featuredTitle: 'Ideas put to work.',
    featuredIntro: 'Different challenges. Our design, development and automation. Browse the results.',
    allCases: 'All work', openCase: 'View project', viewAll: 'Explore all work',
    dragHint: 'DRAG / SWIPE', wheelHint: '← → / SHIFT + WHEEL', navigationLabel: 'Project navigation',
    previous: 'Previous', next: 'Next', start: 'First project', end: 'Last project', index: 'Project',
    filters: { all: 'All', development: 'Websites / Development', automation: 'AI / Automation' },
    empty: 'No projects in this category yet.', nextCase: 'Next project', backToCases: 'Back to work',
    projects: 'COMPLETED PROJECTS', visit: 'Visit website', preview: 'A closer look',
    desktop: 'Desktop', mobile: 'Mobile', screenshot: 'Website screenshot', restored: 'Website recovery',
    original: 'Previous website', listen: 'Listen to the call', pause: 'Pause', replay: 'Play again',
    audioTitle: 'Hear AI Voice for Dentistry', audioLabel: 'DENTISTRY / AI VOICE',
    audioNote: 'A recording of the Dentistry dental call scenario in Russian. Hear the AI conversation, answers to questions and discussion of a consultation.',
    audioError: 'The recording could not load. Open the audio file using the link below.',
    audioDownload: 'Open audio', seek: 'Playback position', speed: 'Playback speed',
    steps: ['Incoming call', 'AI conversation', 'Questions answered', 'Consultation request'],
    study: { task: 'Task', solution: 'Solution', workflow: 'Workflow', capabilities: 'What the system does', ai: 'AI role', human: 'Human role', channels: 'Channels and integrations', evidence: 'Real system screens', enlarge: 'Enlarge screenshot', close: 'Close', service: 'Explore Automation' },
    webStudy: { challenge: 'Challenge', work: 'What we built', delivery: 'Delivery', result: 'Result', service: 'Explore Development', googleAdsTracking: 'Google Ads tracking / Google tag installed.' },
  },
  de: {
    pageLabel: 'OSNOVA / UNSERE ARBEITEN', pageTitle: 'Entwickelt. Und live.',
    pageIntro: 'Websites, Landingpages und KI. Reale Projekte — vom ersten Bildschirm zur fertigen Lösung.',
    featuredLabel: 'AUSGEWÄHLTE ARBEITEN', featuredTitle: 'Ideen, die funktionieren.',
    featuredIntro: 'Verschiedene Aufgaben. Unser Design, unsere Entwicklung und Automatisierung. Entdecken Sie die Ergebnisse.',
    allCases: 'Alle Arbeiten', openCase: 'Projekt ansehen', viewAll: 'Alle Arbeiten ansehen',
    dragHint: 'ZIEHEN / WISCHEN', wheelHint: '← → / SHIFT + MAUSRAD', navigationLabel: 'Projektnavigation',
    previous: 'Zurück', next: 'Weiter', start: 'Erstes Projekt', end: 'Letztes Projekt', index: 'Projekt',
    filters: { all: 'Alle', development: 'Websites / Entwicklung', automation: 'KI / Automatisierung' },
    empty: 'Noch keine Arbeiten in dieser Kategorie.', nextCase: 'Nächstes Projekt', backToCases: 'Zum Portfolio',
    projects: 'REALISIERTE PROJEKTE', visit: 'Website öffnen', preview: 'Ein genauerer Blick',
    desktop: 'Desktop', mobile: 'Mobil', screenshot: 'Website-Aufnahme', restored: 'Wiederherstellung',
    original: 'Vorherige Website', listen: 'Anruf anhören', pause: 'Pause', replay: 'Erneut anhören',
    audioTitle: 'AI Voice für Dentistry anhören', audioLabel: 'DENTISTRY / AI VOICE',
    audioNote: 'Aufzeichnung des Gesprächsszenarios für Dentistry auf Russisch. Zu hören sind der Dialog mit der KI, Antworten auf Fragen und die Besprechung einer Beratung.',
    audioError: 'Die Aufnahme konnte nicht geladen werden. Öffnen Sie die Audiodatei über den Link unten.',
    audioDownload: 'Audio öffnen', seek: 'Wiedergabeposition', speed: 'Wiedergabegeschwindigkeit',
    steps: ['Eingehender Anruf', 'Dialog mit KI', 'Fragen beantwortet', 'Beratungsanfrage'],
    study: { task: 'Aufgabe', solution: 'Lösung', workflow: 'Ablauf', capabilities: 'Funktionen', ai: 'Rolle der KI', human: 'Rolle des Menschen', channels: 'Kanäle und Integrationen', evidence: 'Echte Systemansichten', enlarge: 'Screenshot vergrößern', close: 'Schließen', service: 'Automatisierung entdecken' },
    webStudy: { challenge: 'Aufgabe', work: 'Umsetzung', delivery: 'Projektdauer', result: 'Ergebnis', service: 'Entwicklung entdecken', googleAdsTracking: 'Google Ads Tracking / Google tag eingerichtet.' },
  },
  uk: {
    pageLabel: 'OSNOVA / НАШІ РОБОТИ', pageTitle: 'Зроблено. Працює.',
    pageIntro: 'Сайти, лендинги та AI. Реальні проєкти — від першого екрана до робочого рішення.',
    featuredLabel: 'ВИБРАНІ РОБОТИ', featuredTitle: 'Ідеї, що працюють.',
    featuredIntro: 'Різні завдання. Наш дизайн, розробка й автоматизація. Гортайте та дивіться результат.',
    allCases: 'Усі роботи', openCase: 'Дивитися проєкт', viewAll: 'Усі роботи',
    dragHint: 'ГОРТАЙТЕ / СВАЙП', wheelHint: '← → / SHIFT + WHEEL', navigationLabel: 'Навігація роботами',
    previous: 'Назад', next: 'Далі', start: 'Перша робота', end: 'Остання робота', index: 'Проєкт',
    filters: { all: 'Усі', development: 'Сайти / Розробка', automation: 'AI / Автоматизація' },
    empty: 'У цій категорії поки немає робіт.', nextCase: 'Наступна робота', backToCases: 'До портфоліо',
    projects: 'ВИКОНАНИХ ПРОЄКТІВ', visit: 'Відкрити сайт', preview: 'Дизайн у деталях',
    desktop: 'Desktop', mobile: 'Mobile', screenshot: 'Знімок сайту', restored: 'Відновлення сайту',
    original: 'Попередній сайт', listen: 'Слухати дзвінок', pause: 'Пауза', replay: 'Слухати знову',
    audioTitle: 'Як звучить AI Voice у Dentistry', audioLabel: 'DENTISTRY / AI VOICE',
    audioNote: 'Запис стоматологічного сценарію Dentistry російською мовою. Показує діалог з AI, відповіді на запитання та обговорення консультації.',
    audioError: 'Не вдалося завантажити запис. Відкрийте аудіофайл за посиланням нижче.',
    audioDownload: 'Відкрити аудіо', seek: 'Позиція відтворення', speed: 'Швидкість відтворення',
    steps: ['Вхідний дзвінок', 'Діалог з AI', 'Відповіді на запитання', 'Запит на консультацію'],
    study: { task: 'Завдання', solution: 'Рішення', workflow: 'Сценарій', capabilities: 'Що вміє система', ai: 'Роль AI', human: 'Роль людини', channels: 'Канали та інтеграції', evidence: 'Реальні екрани системи', enlarge: 'Збільшити скриншот', close: 'Закрити', service: 'Про автоматизацію' },
    webStudy: { challenge: 'Завдання', work: 'Що зробили', delivery: 'Термін', result: 'Результат', service: 'Про розробку', googleAdsTracking: 'Google Ads tracking / Google tag підключено.' },
  },
}

const website = (slug, title, url, options = {}) => ({
  id: slug, slug, title, url, category: 'development', subcategories: ['websites'],
  categoryLabel: 'Website / Development', visual: 'website', status: 'published',
  desktop: `/assets/cases/${slug}-desktop.webp`, mobile: `/assets/cases/${slug}-mobile.webp`,
  detail: `/assets/cases/${slug}-detail.webp`, ...options,
})

export const cases = [
  website('dds-service', 'DDS SERVICE', 'https://ddsservice.com.ua/', {
    featured: true, serviceCase: 'development', accent: '#f25b40',
    copy: localized(
      { summary: 'Сайт автосервиса с понятной структурой услуг, направлений ремонта и путём к контакту.', webCase: {
        challenge: 'Понятно представить бизнес, ремонт и обслуживание, чтобы посетитель быстро находил нужную услугу или контакт.',
        work: 'Выстроили структуру информации и путь пользователя, представили услуги, реализовали адаптивный сайт.',
        delivery: '2–3 дня', result: 'Рабочий сайт опубликован: услуги и контакты доступны посетителям.',
      } },
      { summary: 'An auto service website with clear services, repair areas and a path to contact.', webCase: {
        challenge: 'Present the business, repair and maintenance services clearly so visitors can find the right service or contact.',
        work: 'Structured the information and user flow, presented the services and developed a responsive website.',
        delivery: '2–3 days', result: 'The live website presents the services and contact options.',
      } },
      { summary: 'Website einer Autowerkstatt mit klaren Leistungen, Reparaturbereichen und Kontaktwegen.', webCase: {
        challenge: 'Betrieb, Reparatur und Wartung verständlich darstellen, damit Besucher Leistungen und Kontakt schnell finden.',
        work: 'Informationsstruktur und Nutzerführung aufgebaut, Leistungen dargestellt und die responsive Website entwickelt.',
        delivery: '2–3 Tage', result: 'Die veröffentlichte Website zeigt Leistungen und Kontaktmöglichkeiten.',
      } },
      { summary: 'Сайт автосервісу зі зрозумілими послугами, напрямами ремонту та шляхом до контакту.', webCase: {
        challenge: 'Зрозуміло представити бізнес, ремонт і обслуговування, щоб відвідувач швидко знаходив потрібну послугу або контакт.',
        work: 'Побудували структуру інформації та шлях користувача, представили послуги й розробили адаптивний сайт.',
        delivery: '2–3 дні', result: 'Робочий сайт опубліковано: послуги й контакти доступні відвідувачам.',
      } },
    ),
  }),
  dsRepairCase,
  website('comfort-lab', 'COMFORT LAB', 'https://comfortlabkiev.com.ua/', {
    featured: true, serviceCase: 'development', accent: '#b8bcce',
    copy: localized(
      { summary: 'Сайт студии автомобильного комфорта: шумоизоляция, защита, звук и CarPlay. Дизайн и разработка с нуля.' },
      { summary: 'A website for an automotive comfort studio: soundproofing, protection, audio and CarPlay. Designed and built from scratch.' },
      { summary: 'Website für ein Studio für Fahrzeugkomfort: Dämmung, Schutz, Audio und CarPlay. Von Grund auf gestaltet und entwickelt.' },
      { summary: 'Сайт студії автомобільного комфорту: шумоізоляція, захист, звук і CarPlay. Дизайн та розробка з нуля.' },
    ),
  }),
  website('bala-group', 'BALA GROUP', 'https://balagroup.com.ua', {
    googleTagTracking: true,
    serviceCase: 'development', accent: '#e4b887',
    copy: localized(
      {
        "summary": "Адаптивный сайт BALA GROUP, созданный OSNOVA примерно за 24 часа, с базовой SEO-структурой.",
        "webCase": {
          "challenge": "Клиенту нужен был готовый сайт для бизнеса без долгого запуска.",
          "work": "Собрали структуру с учётом базовой SEO-логики, разработали адаптивный сайт и выполнили технический запуск.",
          "delivery": "≈ 24 часа",
          "result": "Готовый коммерческий сайт опубликован: посетители могут изучить услуги и связаться с компанией."
        }
      },
      {
        "summary": "A responsive BALA GROUP website built by OSNOVA in around 24 hours, with a basic SEO structure.",
        "webCase": {
          "challenge": "The client needed a working business website without a lengthy launch.",
          "work": "Planned the initial structure with basic SEO in mind, built a responsive website and handled the technical launch.",
          "delivery": "≈ 24 hours",
          "result": "The commercial website is live: visitors can explore the services and contact the company."
        }
      },
      {
        "summary": "Responsive Website für BALA GROUP, von OSNOVA in rund 24 Stunden mit grundlegender SEO-Struktur erstellt.",
        "webCase": {
          "challenge": "Der Kunde brauchte eine einsatzfähige Unternehmenswebsite ohne lange Wartezeit.",
          "work": "Die erste Seitenstruktur nach grundlegenden SEO-Kriterien geplant, die responsive Website entwickelt und technisch veröffentlicht.",
          "delivery": "ca. 24 Stunden",
          "result": "Die fertige Unternehmenswebsite ist online. Besucher können Leistungen ansehen und Kontakt aufnehmen."
        }
      },
      {
        "summary": "Адаптивний сайт BALA GROUP, створений OSNOVA приблизно за 24 години, з базовою SEO-структурою.",
        "webCase": {
          "challenge": "Клієнту потрібен був готовий сайт для бізнесу без тривалого запуску.",
          "work": "Зібрали структуру з урахуванням базової SEO-логіки, розробили адаптивний сайт і виконали технічний запуск.",
          "delivery": "≈ 24 години",
          "result": "Готовий комерційний сайт опубліковано: відвідувачі можуть переглянути послуги та зв’язатися з компанією."
        }
      },
    ),
  }),
  website('retatrutide-silver-signal', 'RETATRUTIDE — SILVER SIGNAL', 'https://shalomesp11-creator.github.io/retatrutide-silver-signal/', {
    googleAdsTracking: true,
    featured: true, categoryLabel: 'Landing Page / Development', accent: '#b0bec5',
    copy: localized(
      { summary: 'Лендинг с серебристой визуальной системой. Дизайн и web-разработка полностью с нуля.' },
      { summary: 'A landing page with a silver visual identity. Original design and web development from scratch.' },
      { summary: 'Landingpage mit einer silbernen Bildsprache. Eigenständiges Design und Webentwicklung von Grund auf.' },
      { summary: 'Лендинг зі сріблястою візуальною системою. Дизайн і web-розробка повністю з нуля.' },
    ),
  }),
  slavabudCase,
  dentistryCase,
  ...automationCases,
  website('comfort-home', 'COMFORT HOME', 'https://comforthomekiev.com.ua/', {
    googleAdsTracking: true,
    recovery: true, serviceCase: 'development', originalUrl: 'https://www.comforthome.kyiv.ua/', categoryLabel: 'Website / Recovery', accent: '#aa927a',
    copy: localized(
      { summary: 'Восстановили сайт после потери доступа к исходному проекту, используя его публичную версию как единственный референс.', webCase: {
        challenge: 'Владелец потерял доступ к исходному сайту; осталась только публичная live-ссылка.',
        work: 'Воссоздали доступные элементы по публичной версии, недостающие восстановили и доработали самостоятельно.',
        delivery: '≈ 1 день', result: 'Рабочая версия восстановлена, подготовлена к публикации и доступна по действующей ссылке.',
      } },
      { summary: 'Rebuilt a website after access to the original project was lost, using its public version as the sole reference.', webCase: {
        challenge: 'The owner lost access to the original website; only its public live URL remained.',
        work: 'Recreated the available elements from the public version and rebuilt or completed the missing parts.',
        delivery: '≈ 1 day', result: 'A working version was restored, prepared for publication and is available at its live URL.',
      } },
      { summary: 'Website nach Verlust des Zugangs zum ursprünglichen Projekt anhand der öffentlichen Version rekonstruiert.', webCase: {
        challenge: 'Der Eigentümer verlor den Zugang zur ursprünglichen Website; als Referenz blieb nur die öffentliche URL.',
        work: 'Sichtbare Elemente anhand der öffentlichen Version rekonstruiert und fehlende Teile eigenständig ergänzt.',
        delivery: 'ca. 1 Tag', result: 'Eine funktionsfähige Version wurde wiederhergestellt, zur Veröffentlichung vorbereitet und ist online erreichbar.',
      } },
      { summary: 'Відновили сайт після втрати доступу до вихідного проєкту, використавши публічну версію як єдиний референс.', webCase: {
        challenge: 'Власник утратив доступ до вихідного сайту; залишилося лише публічне live-посилання.',
        work: 'Відтворили доступні елементи за публічною версією, а відсутні частини самостійно відновили й доробили.',
        delivery: '≈ 1 день', result: 'Робочу версію відновлено, підготовлено до публікації; вона доступна за чинним посиланням.',
      } },
    ),
  }),
  website('retatrutide-landing', 'RETATRUTIDE — LANDING PAGE', 'https://shalomesp11-creator.github.io/retatrutide-landing-preview/', {
    googleAdsTracking: true,
    categoryLabel: 'Landing Page / Development', accent: '#baccb9',
    copy: localized(
      { summary: 'Отдельный лендинг RETATRUTIDE. Собственная визуальная концепция и полная web-разработка с нуля.' },
      { summary: 'A separate RETATRUTIDE landing page. Its own visual concept and complete web development from scratch.' },
      { summary: 'Eine eigenständige RETATRUTIDE-Landingpage. Eigenes visuelles Konzept und vollständige Webentwicklung von Grund auf.' },
      { summary: 'Окремий лендинг RETATRUTIDE. Власна візуальна концепція та повна web-розробка з нуля.' },
    ),
  }),
]

export function getLocalizedCases(lang) {
  return cases.map(item => ({ ...item, ...(item.copy[lang] || item.copy.en), visualLabel: (caseUi[lang] || caseUi.en).audioLabel }))
}
