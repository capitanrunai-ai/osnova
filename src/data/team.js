const roles = [
  ['leadership', 'CEO'],
  ['design', 'PRODUCT DESIGNER'],
  ['development', 'WEB DEVELOPER'],
  ['ai', 'AI & AUTOMATION SPECIALIST'],
  ['marketing', 'DIGITAL MARKETING SPECIALIST'],
  ['email', 'EMAIL DELIVERABILITY SPECIALIST'],
]

export const teamContent = {
  ru: {
    label: 'КОМАНДА / НАПРАВЛЕНИЯ',
    intro: 'OSNOVA объединяет дизайн, разработку, AI, автоматизацию, маркетинг и email-инфраструктуру. Каждый специалист отвечает за свою часть общей системы бизнеса.',
    items: [
      ['Стратегия и развитие', 'Связывает задачи бизнеса с работой команды. Определяет приоритеты и отвечает за общее направление проекта.'],
      ['Понятный цифровой опыт', 'Превращает задачи бизнеса в удобные сайты и интерфейсы. Помогает клиенту быстро понять предложение и сделать следующий шаг.'],
      ['От дизайна к рабочему продукту', 'Разрабатывает сайты и web-приложения. Отвечает за функциональность, адаптацию под разные устройства и связь с сервисами бизнеса.'],
      ['Меньше ручной работы', 'Настраивает AI-ассистентов и автоматические процессы. Соединяет инструменты, чтобы команда меньше занималась повторяющимися задачами.'],
      ['Связь с вашей аудиторией', 'Работает с рекламой и цифровыми каналами привлечения. Помогает бизнесу находить клиентов и понимать, какие обращения приходят из каждого канала.'],
      ['Письма доходят до клиентов', 'Помогает письмам компании попадать во «Входящие», а не в спам или под блокировку. Настраивает отправку с домена компании, следит за репутацией отправителя и причинами сбоев — чтобы рассылки, уведомления и автоматические сообщения доставлялись стабильно, в том числе при больших объёмах.'],
    ],
  },
  en: {
    label: 'TEAM / EXPERTISE',
    intro: 'OSNOVA brings design, development, AI, automation, marketing and email infrastructure together. Each specialist takes care of one part of the wider business system.',
    items: [
      ['Strategy and direction', 'Connects business goals with the team’s work. Sets priorities and takes responsibility for the overall direction of the project.'],
      ['A clear digital experience', 'Turns business needs into intuitive websites and interfaces. Helps customers understand the offer and take the next step.'],
      ['From design to a working product', 'Builds websites and web applications. Takes care of functionality, different screen sizes and connections with business tools.'],
      ['Less manual work', 'Builds AI assistants and automated workflows. Connects tools so the team spends less time on repetitive tasks.'],
      ['Connecting with your audience', 'Works with advertising and digital acquisition channels. Helps businesses reach customers and understand where enquiries come from.'],
      ['Company emails reach customers', 'Helps company emails reach the inbox instead of landing in spam or being blocked. Sets up sending from the company domain, monitors sender reputation and investigates delivery issues — keeping campaigns, notifications and automated messages reliable, even at high volumes.'],
    ],
  },
  de: {
    label: 'TEAM / KOMPETENZEN',
    intro: 'OSNOVA verbindet Design, Entwicklung, KI, Automatisierung, Marketing und E-Mail-Infrastruktur. Jede Fachkraft betreut einen Teil des gemeinsamen Geschäftssystems.',
    items: [
      ['Strategie und Ausrichtung', 'Verbindet die Unternehmensziele mit der Arbeit des Teams. Setzt Prioritäten und verantwortet die Gesamtausrichtung des Projekts.'],
      ['Ein verständliches digitales Erlebnis', 'Entwickelt aus geschäftlichen Anforderungen intuitive Websites und Oberflächen. Hilft Kunden, das Angebot zu verstehen und den nächsten Schritt zu gehen.'],
      ['Vom Design zum fertigen Produkt', 'Entwickelt Websites und Webanwendungen. Kümmert sich um Funktionen, verschiedene Bildschirmgrößen und die Anbindung an Geschäftsanwendungen.'],
      ['Weniger manuelle Arbeit', 'Richtet KI-Assistenten und automatisierte Abläufe ein. Verbindet Werkzeuge, damit das Team weniger Zeit mit wiederkehrenden Aufgaben verbringt.'],
      ['Kontakt zu Ihrer Zielgruppe', 'Betreut Werbung und digitale Kanäle zur Kundengewinnung. Hilft Unternehmen, Kunden zu erreichen und die Herkunft ihrer Anfragen nachzuvollziehen.'],
      ['E-Mails erreichen Ihre Kunden', 'Hilft, dass Unternehmensmails im Posteingang ankommen, statt im Spam zu landen oder blockiert zu werden. Richtet den Versand über die Unternehmensdomain ein, überwacht die Absenderreputation und untersucht Zustellprobleme — für zuverlässige Newsletter, Benachrichtigungen und automatische Nachrichten, auch bei großen Versandmengen.'],
    ],
  },
  uk: {
    label: 'КОМАНДА / НАПРЯМИ',
    intro: 'OSNOVA поєднує дизайн, розробку, AI, автоматизацію, маркетинг та email-інфраструктуру. Кожен спеціаліст відповідає за свою частину спільної системи бізнесу.',
    items: [
      ['Стратегія та розвиток', 'Поєднує завдання бізнесу з роботою команди. Визначає пріоритети та відповідає за загальний напрям проєкту.'],
      ['Зрозумілий цифровий досвід', 'Перетворює завдання бізнесу на зручні сайти та інтерфейси. Допомагає клієнту швидко зрозуміти пропозицію та зробити наступний крок.'],
      ['Від дизайну до робочого продукту', 'Розробляє сайти та web-застосунки. Відповідає за функціональність, адаптацію до різних пристроїв і зв’язок із сервісами бізнесу.'],
      ['Менше ручної роботи', 'Налаштовує AI-асистентів та автоматичні процеси. Поєднує інструменти, щоб команда менше займалася повторюваними завданнями.'],
      ['Зв’язок із вашою аудиторією', 'Працює з рекламою та цифровими каналами залучення. Допомагає бізнесу знаходити клієнтів і розуміти, звідки надходять звернення.'],
      ['Листи доходять до клієнтів', 'Допомагає листам компанії потрапляти до «Вхідних», а не в спам чи під блокування. Налаштовує надсилання з домену компанії, стежить за репутацією відправника та причинами збоїв — щоб розсилки, сповіщення й автоматичні повідомлення доставлялися стабільно, зокрема у великих обсягах.'],
    ],
  },
}

export function getTeam(lang) {
  const copy = teamContent[lang] || teamContent.en
  return { ...copy, roles: roles.map(([id, title], index) => ({ id, title, focus: copy.items[index][0], description: copy.items[index][1] })) }
}
