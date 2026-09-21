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
    audioTitle: 'Один звонок. Запись на приём.', audioLabel: 'ДЕМОНСТРАЦИЯ / СТОМАТОЛОГИЯ',
    audioNote: 'Запись демонстрационного разговора на русском языке.',
    audioError: 'Не удалось загрузить запись. Откройте аудиофайл по ссылке ниже.',
    audioDownload: 'Открыть аудио', seek: 'Позиция воспроизведения', speed: 'Скорость воспроизведения',
    steps: ['Входящий звонок', 'Диалог с AI', 'Ответы на вопросы', 'Запись на консультацию'],
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
    audioTitle: 'One call. A booked appointment.', audioLabel: 'DEMONSTRATION / DENTAL CLINIC',
    audioNote: 'Demonstration call recorded in Russian.',
    audioError: 'The recording could not load. Open the audio file using the link below.',
    audioDownload: 'Open audio', seek: 'Playback position', speed: 'Playback speed',
    steps: ['Incoming call', 'AI conversation', 'Questions answered', 'Consultation booked'],
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
    audioTitle: 'Ein Anruf. Ein vereinbarter Termin.', audioLabel: 'DEMONSTRATION / ZAHNARZTPRAXIS',
    audioNote: 'Aufzeichnung eines Demonstrationsgesprächs auf Russisch.',
    audioError: 'Die Aufnahme konnte nicht geladen werden. Öffnen Sie die Audiodatei über den Link unten.',
    audioDownload: 'Audio öffnen', seek: 'Wiedergabeposition', speed: 'Wiedergabegeschwindigkeit',
    steps: ['Eingehender Anruf', 'Dialog mit KI', 'Fragen beantwortet', 'Beratungstermin vereinbart'],
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
    audioTitle: 'Один дзвінок. Запис на прийом.', audioLabel: 'ДЕМОНСТРАЦІЯ / СТОМАТОЛОГІЯ',
    audioNote: 'Запис демонстраційної розмови російською мовою.',
    audioError: 'Не вдалося завантажити запис. Відкрийте аудіофайл за посиланням нижче.',
    audioDownload: 'Відкрити аудіо', seek: 'Позиція відтворення', speed: 'Швидкість відтворення',
    steps: ['Вхідний дзвінок', 'Діалог з AI', 'Відповіді на запитання', 'Запис на консультацію'],
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
    featured: true, accent: '#f25b40',
    copy: localized(
      { summary: 'Сайт автосервиса: услуги, информация для клиентов и контакты. Полностью разработан с нуля.' },
      { summary: 'An auto service website with services, customer information and contacts. Built entirely from scratch.' },
      { summary: 'Website einer Autowerkstatt mit Leistungen, Kundeninformationen und Kontakt. Komplett neu entwickelt.' },
      { summary: 'Сайт автосервісу: послуги, інформація для клієнтів і контакти. Повністю розроблений з нуля.' },
    ),
  }),
  website('bala-group', 'BALA GROUP', 'https://www.bala-group.com.ua/', {
    featured: true, accent: '#e4b887',
    copy: localized(
      { summary: 'Сайт строительных и ремонтных услуг. Дизайн и разработка полностью с нуля.' },
      { summary: 'A website for construction and renovation services. Designed and developed from scratch.' },
      { summary: 'Website für Bau- und Renovierungsleistungen. Von Grund auf gestaltet und entwickelt.' },
      { summary: 'Сайт будівельних і ремонтних послуг. Дизайн та розробка повністю з нуля.' },
    ),
  }),
  website('retatrutide-silver-signal', 'RETATRUTIDE — SILVER SIGNAL', 'https://shalomesp11-creator.github.io/retatrutide-silver-signal/', {
    featured: true, categoryLabel: 'Landing Page / Development', accent: '#b0bec5',
    copy: localized(
      { summary: 'Лендинг с серебристой визуальной системой. Дизайн и web-разработка полностью с нуля.' },
      { summary: 'A landing page with a silver visual identity. Original design and web development from scratch.' },
      { summary: 'Landingpage mit einer silbernen Bildsprache. Eigenständiges Design und Webentwicklung von Grund auf.' },
      { summary: 'Лендинг зі сріблястою візуальною системою. Дизайн і web-розробка повністю з нуля.' },
    ),
  }),
  {
    id: 'ai-voice-operator', slug: 'ai-voice-operator', title: 'AI VOICE OPERATOR',
    category: 'automation', subcategories: ['ai-voice'], categoryLabel: 'AI / Automation / AI Voice',
    visual: 'voice', status: 'published', featured: true, accent: '#a394ff',
    audio: '/assets/cases/primer.mp3',
    copy: localized(
      { summary: 'AI-оператор стоматологической клиники. Принимает звонок, отвечает на вопросы и записывает на консультацию.' },
      { summary: 'An AI voice operator for a dental clinic. Takes the call, answers questions and books a consultation.' },
      { summary: 'Ein KI-Telefonassistent für eine Zahnarztpraxis. Nimmt den Anruf an, beantwortet Fragen und vereinbart einen Beratungstermin.' },
      { summary: 'AI-оператор стоматологічної клініки. Приймає дзвінок, відповідає на запитання та записує на консультацію.' },
    ),
  },
  website('comfort-lab', 'COMFORT LAB', 'https://comfortlabkiev.com.ua/', {
    accent: '#b8bcce',
    copy: localized(
      { summary: 'Сайт студии автомобильного комфорта: шумоизоляция, защита, звук и CarPlay. Дизайн и разработка с нуля.' },
      { summary: 'A website for an automotive comfort studio: soundproofing, protection, audio and CarPlay. Designed and built from scratch.' },
      { summary: 'Website für ein Studio für Fahrzeugkomfort: Dämmung, Schutz, Audio und CarPlay. Von Grund auf gestaltet und entwickelt.' },
      { summary: 'Сайт студії автомобільного комфорту: шумоізоляція, захист, звук і CarPlay. Дизайн та розробка з нуля.' },
    ),
  }),
  website('comfort-home', 'COMFORT HOME', 'https://comforthomekiev.com.ua/', {
    recovery: true, originalUrl: 'https://www.comforthome.kyiv.ua/', categoryLabel: 'Website / Recovery', accent: '#aa927a',
    copy: localized(
      { summary: 'После потери доступа к прежнему сайту восстановили рабочую версию на его основе. Клиент снова получил собственный функционирующий ресурс.' },
      { summary: 'After the client lost access to the previous website, we rebuilt a working version based on it, giving the client their own functioning website again.' },
      { summary: 'Nach dem Verlust des Zugangs zur bisherigen Website haben wir auf deren Grundlage eine funktionsfähige Version wiederhergestellt.' },
      { summary: 'Після втрати доступу до попереднього сайту відновили робочу версію на його основі. Клієнт знову отримав власний функціональний ресурс.' },
    ),
  }),
  website('retatrutide-landing', 'RETATRUTIDE — LANDING PAGE', 'https://shalomesp11-creator.github.io/retatrutide-landing-preview/', {
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
