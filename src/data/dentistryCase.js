// Dentistry is a real OSNOVA project. The recording illustrates its dental
// conversation scenario; it is not evidence of bookings or business results.
export const dentistryCase = {
  id: 'ai-voice-operator', slug: 'ai-voice-operator', title: 'Dentistry — AI Voice',
  category: 'automation', subcategories: ['ai-voice'], categoryLabel: 'Dentistry / AI Voice / Automation',
  visual: 'voice', status: 'published', featured: true, accent: '#a394ff',
  audio: '/assets/cases/primer.mp3',
  copy: {
    ru: {
      summary: 'AI Voice система для стоматологической клиники Dentistry. Входящие и исходящие звонки по заданным сценариям, база знаний и передача контекста сотрудникам.',
      task: 'Реализовать голосовую систему для Dentistry: принимать входящие обращения, вести исходящие разговоры по согласованным сценариям и передавать вопросы, требующие человека, сотрудникам клиники.',
      solution: 'Настроили AI-голос, базу знаний и логику разговора для стоматологического сценария. Система работает по заданным правилам, отвечает на типовые вопросы и возражения, транскрибирует разговор и передаёт информацию и контекст в Telegram.',
      capabilities: 'Входящие звонки и исходящие звонки по сценариям; AI-голос; база знаний; настройка логики разговора; обработка типовых вопросов и возражений; API-интеграции; транскрипция разговора и передача контекста в Telegram.',
      aiRole: 'Ведёт диалог по заданному сценарию и базе знаний клиники, отвечает на типовые вопросы и сохраняет контекст обращения для дальнейшей обработки.',
      humanRole: 'Сотрудник подключается к вопросам, которые требуют человека. AI передаёт контекст разговора; правила эскалации задаются в логике системы.',
      channels: 'Телефония → AI Voice → транскрипция → Telegram / сотрудник. API-интеграции позволяют дальше связать решение с бизнес-процессами клиента; состав таких расширений согласуется отдельно.',
    },
    en: {
      summary: 'An AI Voice system built for the Dentistry dental clinic. Incoming calls, scripted outbound calls, a knowledge base and conversation context passed to staff.',
      task: 'Build a voice system for Dentistry that handles incoming enquiries, makes outbound calls using agreed scripts and passes questions requiring a person to clinic staff.',
      solution: 'We configured the AI voice, knowledge base and conversation logic for the dental clinic scenario. The system follows defined rules, handles common questions and objections, transcribes calls and sends information and context to Telegram.',
      capabilities: 'Incoming calls and scripted outbound calls; AI voice; a knowledge base; configurable conversation logic; common questions and objections; API integrations; call transcription and context delivery to Telegram.',
      aiRole: 'Follows the agreed call flow and clinic knowledge base, answers common questions and preserves enquiry context for follow-up.',
      humanRole: 'Staff handle questions that need a person. AI passes on the conversation context, with escalation rules defined in the system logic.',
      channels: 'Telephony → AI Voice → transcription → Telegram / staff. API integrations allow further connections to the client’s business processes; the scope of those extensions is agreed separately.',
    },
    de: {
      summary: 'Ein AI-Voice-System für die Zahnarztpraxis Dentistry. Eingehende Anrufe, ausgehende Anrufe nach festgelegten Abläufen, eine Wissensbasis und die Weitergabe des Gesprächskontexts an Mitarbeitende.',
      task: 'Ein Sprachsystem für Dentistry umsetzen, das eingehende Anfragen bearbeitet, ausgehende Gespräche nach vereinbarten Abläufen führt und Fragen an das Praxisteam weitergibt, die einen Menschen erfordern.',
      solution: 'Wir haben KI-Stimme, Wissensbasis und Gesprächslogik für den zahnmedizinischen Anwendungsfall eingerichtet. Das System folgt festgelegten Regeln, behandelt häufige Fragen und Einwände, transkribiert Gespräche und übermittelt Informationen und Kontext an Telegram.',
      capabilities: 'Eingehende und ausgehende Anrufe nach festgelegten Abläufen; KI-Stimme; Wissensbasis; anpassbare Gesprächslogik; häufige Fragen und Einwände; API-Anbindungen; Gesprächstranskription und Kontextübergabe an Telegram.',
      aiRole: 'Führt den Dialog anhand des vereinbarten Ablaufs und der Wissensbasis der Praxis, beantwortet häufige Fragen und hält den Kontext für die weitere Bearbeitung fest.',
      humanRole: 'Mitarbeitende übernehmen Fragen, die einen Menschen erfordern. Die KI gibt den Gesprächskontext weiter; die Regeln für die Übergabe sind in der Systemlogik hinterlegt.',
      channels: 'Telefonie → AI Voice → Transkription → Telegram / Praxisteam. Über APIs lässt sich das System weiter in die Geschäftsprozesse des Kunden einbinden; solche Erweiterungen werden separat vereinbart.',
    },
    uk: {
      summary: 'AI Voice система для стоматологічної клініки Dentistry. Вхідні й вихідні дзвінки за заданими сценаріями, база знань і передача контексту співробітникам.',
      task: 'Реалізувати голосову систему для Dentistry: приймати вхідні звернення, вести вихідні розмови за погодженими сценаріями та передавати працівникам клініки питання, які потребують людини.',
      solution: 'Налаштували AI-голос, базу знань і логіку розмови для стоматологічного сценарію. Система працює за заданими правилами, відповідає на типові запитання й заперечення, транскрибує розмову та передає інформацію й контекст у Telegram.',
      capabilities: 'Вхідні дзвінки й вихідні дзвінки за сценаріями; AI-голос; база знань; налаштування логіки розмови; типові запитання й заперечення; API-інтеграції; транскрипція розмови та передача контексту в Telegram.',
      aiRole: 'Веде діалог за погодженим сценарієм і базою знань клініки, відповідає на типові запитання та зберігає контекст звернення для подальшої обробки.',
      humanRole: 'Працівник долучається до питань, які потребують людини. AI передає контекст розмови; правила ескалації задаються в логіці системи.',
      channels: 'Телефонія → AI Voice → транскрипція → Telegram / працівник. API-інтеграції дають змогу надалі пов’язати рішення з бізнес-процесами клієнта; обсяг таких розширень узгоджується окремо.',
    },
  },
}
