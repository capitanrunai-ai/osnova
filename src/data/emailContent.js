// Authentication terminology checked against Google’s email sender guidelines:
// https://support.google.com/a/answer/81126
export const emailContent = {
  ru: {
    meta: ['Email Deliverability — доставка писем во входящие | OSNOVA', 'Помогаем письмам компании доходить до клиентов. Находим причины попадания в спам, исправляем настройки и проверяем результат.'],
    label: '06 / EMAIL DELIVERABILITY', title: 'Ваши письма.', titleAccent: 'Ближе к клиенту.',
    scopeTitle: 'С какими письмами работаем',
    intro: 'Помогаем сделать так, чтобы письма компании доходили до клиентов и не попадали в спам. Проверяем, что мешает доставке, и исправляем настройки — для рассылок, счетов, подтверждений заказов и других важных писем.',
    visual: { label: 'ПУТЬ ПИСЬМА', steps: ['Письмо компании', 'Проверка отправителя', 'Почта клиента', 'Входящие'], note: 'От компании — к клиенту' },
    situations: { label: 'ЗАЧЕМ ЭТО БИЗНЕСУ', title: 'Отправлено — ещё не значит получено.', intro: 'Клиент ждёт счёт, подтверждение заказа или ссылку для входа. Если письмо не приходит, он не может оплатить, проверить заказ или войти в аккаунт. Мы помогаем наладить доставку таких писем и ваших рассылок.', items: [
      ['Письма уходят в спам', 'Клиенты пропускают предложения, подтверждения и напоминания.'],
      ['Письма не приходят', 'Клиенты жалуются на задержки, а вы получаете сообщения об ошибках.'],
      ['Вы меняете способ отправки', 'Подключаете новый почтовый сервис или планируете отправлять больше писем.'],
    ] },
    deliverables: { label: 'ЧТО ДЕЛАЕТ OSNOVA', title: 'Приводим отправку в порядок.', intro: 'Разбираемся с доставляемостью, репутацией отправителя и домена, причинами попадания в спам и всей email-инфраструктурой. Объясняем без технической перегрузки, что мешало письмам и что мы изменили.', items: [
      ['01', 'Находим причину', 'Проверяем письма, ошибки и отказы. Выясняем, почему сообщения попадают в спам, задерживаются или не принимаются.'],
      ['02', 'Проверяем домен и отправителя', 'Смотрим состояние домена и репутацию отправителя. Исправляем настройки, которые подтверждают, что письмо действительно отправила ваша компания.'],
      ['03', 'Настраиваем инфраструктуру', 'Связываем домен, почтовый сервис, сайт, CRM и автоматические сообщения так, чтобы разные виды писем отправлялись предсказуемо.'],
      ['04', 'Стабилизируем отправку', 'Проверяем адреса, частоту и объёмы, проводим тесты и настраиваем контроль ошибок — особенно перед ростом количества писем.'],
    ] },
    process: { label: 'КАК РАБОТАЕМ', title: 'Разбираемся. Исправляем. Проверяем.', steps: [
      ['01', 'Вы показываете проблему', 'Рассказываете, как отправляете письма и что не работает. Показываете пример.'],
      ['02', 'Мы исправляем настройки', 'Объясняем, что нужно сделать, согласуем работу и вносим изменения.'],
      ['03', 'Проверяем вместе', 'Смотрим, что изменилось, и оставляем вашей команде понятные инструкции.'],
    ] },
    outcome: { label: 'ЧТО ВЫ ПОЛУЧАЕТЕ', title: 'Вы знаете, что происходит с письмами.', items: ['Объяснение, почему письма не доходили.', 'Исправленные настройки и результаты проверки.', 'Инструкции: как отправлять письма и что делать при сбоях.'], note: 'Нельзя обещать, что каждое письмо попадёт во «Входящие»: почта клиента тоже решает, что считать спамом. Мы исправляем то, на что можем повлиять, и показываем результат проверки.' },
    cta: { label: 'EMAIL / СТАРТ', title: 'Разберёмся, где теряются письма.', text: 'Расскажите, какие письма не доходят, и покажите пример. Мы предложим, с чего начать.', button: 'Обсудить доставку писем' },
  },
  en: {
    meta: ['Email Deliverability — OSNOVA', 'Help your company emails reach customers. We find out why messages land in spam, fix settings and check the results.'],
    label: '06 / EMAIL DELIVERABILITY', title: 'Your emails.', titleAccent: 'Closer to customers.',
    scopeTitle: 'The emails we help with',
    intro: 'We help your company’s emails reach customers and stay out of spam. We find what is getting in the way and fix the settings — for newsletters, invoices, order confirmations and other important emails.',
    visual: { label: 'THE EMAIL JOURNEY', steps: ['Your company email', 'Sender check', 'Customer’s email service', 'Inbox'], note: 'From your company to your customer' },
    situations: { label: 'WHY IT MATTERS TO YOUR BUSINESS', title: 'Sent does not always mean received.', intro: 'A customer is waiting for an invoice, order confirmation or login link. Without the email, they cannot pay, check their order or sign in. We help these messages and your newsletters reach customers.', items: [
      ['Emails land in spam', 'Customers miss offers, confirmations and reminders.'],
      ['Emails do not arrive', 'Customers report delays, and you receive error messages.'],
      ['You change how you send', 'You switch email services or plan to send more emails.'],
    ] },
    deliverables: { label: 'WHAT OSNOVA DOES', title: 'Get your email setup in order.', intro: 'We look at deliverability, sender and domain reputation, reasons for spam placement and the full email setup. We explain what blocked your emails and what we changed without burying you in technical detail.', items: [
      ['01', 'Find the cause', 'Check emails, errors and rejections to learn why messages land in spam, arrive late or are not accepted.'],
      ['02', 'Check the domain and sender', 'Review the condition of your domain and sender reputation. Fix the settings that show email services the message really comes from your company.'],
      ['03', 'Set up the infrastructure', 'Connect the domain, email service, website, CRM and automated messages so each type of email sends predictably.'],
      ['04', 'Make sending reliable', 'Review addresses, frequency and volume, run tests and monitor errors — especially before you increase the number of emails.'],
    ] },
    process: { label: 'HOW WE WORK', title: 'Understand. Fix. Check.', steps: [
      ['01', 'Show us the problem', 'Tell us how you send emails, what is not working and show us an example.'],
      ['02', 'We fix the settings', 'Explain what needs doing, agree on the work and make the changes.'],
      ['03', 'Check together', 'Review what changed and give your team clear instructions.'],
    ] },
    outcome: { label: 'WHAT YOU RECEIVE', title: 'Know what happens to your emails.', items: ['An explanation of why emails were not arriving.', 'Fixed settings and the results of our checks.', 'Instructions on sending emails and handling problems.'], note: 'Nobody can promise that every email will reach the inbox: your customer’s email service also decides what counts as spam. We fix what we can control and show you the test results.' },
    cta: { label: 'EMAIL / START', title: 'Find where your emails get lost.', text: 'Tell us which emails are not arriving and show us an example. We will suggest where to start.', button: 'Discuss email delivery' },
  },
  de: {
    meta: ['Email Deliverability — OSNOVA', 'Damit Ihre E-Mails Kunden erreichen. Wir finden Ursachen für Spam-Probleme, korrigieren Einstellungen und prüfen das Ergebnis.'],
    label: '06 / EMAIL DELIVERABILITY', title: 'Ihre E-Mails.', titleAccent: 'Näher am Kunden.',
    scopeTitle: 'Bei diesen E-Mails helfen wir',
    intro: 'Wir helfen, dass die E-Mails Ihres Unternehmens bei Kunden ankommen und nicht im Spam landen. Wir finden heraus, was die Zustellung verhindert, und korrigieren die Einstellungen — für Newsletter, Rechnungen, Bestellbestätigungen und andere wichtige Nachrichten.',
    visual: { label: 'DER WEG EINER E-MAIL', steps: ['Ihre Nachricht', 'Absenderprüfung', 'E-Mail-Dienst des Kunden', 'Posteingang'], note: 'Von Ihrem Unternehmen zum Kunden' },
    situations: { label: 'WARUM DAS FÜR IHR UNTERNEHMEN ZÄHLT', title: 'Versendet heißt noch nicht angekommen.', intro: 'Ein Kunde wartet auf eine Rechnung, Bestellbestätigung oder einen Anmeldelink. Fehlt die E-Mail, kann er nicht bezahlen, seine Bestellung prüfen oder sich anmelden. Wir helfen, dass diese Nachrichten und Ihre Newsletter ankommen.', items: [
      ['E-Mails landen im Spam', 'Kunden übersehen Angebote, Bestätigungen und Erinnerungen.'],
      ['E-Mails kommen nicht an', 'Kunden berichten von Verzögerungen und Sie erhalten Fehlermeldungen.'],
      ['Sie ändern den Versand', 'Sie wechseln den E-Mail-Dienst oder möchten mehr Nachrichten versenden.'],
    ] },
    deliverables: { label: 'WAS OSNOVA TUT', title: 'Ordnung in den E-Mail-Versand bringen.', intro: 'Wir prüfen Zustellbarkeit, Absender- und Domainreputation, Ursachen für Spam sowie die gesamte E-Mail-Infrastruktur. Wir erklären verständlich, was die Zustellung verhindert hat und was wir geändert haben.', items: [
      ['01', 'Die Ursache finden', 'E-Mails, Fehler und Ablehnungen prüfen. Herausfinden, warum Nachrichten im Spam landen, verspätet ankommen oder nicht angenommen werden.'],
      ['02', 'Domain und Absender prüfen', 'Zustand der Domain und Absenderreputation prüfen. Einstellungen korrigieren, die zeigen, dass die E-Mail wirklich von Ihrem Unternehmen stammt.'],
      ['03', 'Infrastruktur einrichten', 'Domain, E-Mail-Dienst, Website, CRM und automatische Nachrichten so verbinden, dass jede Art von E-Mail planbar versendet wird.'],
      ['04', 'Versand stabilisieren', 'Adressen, Häufigkeit und Volumen prüfen, Tests durchführen und Fehler überwachen — besonders bevor die Versandmenge wächst.'],
    ] },
    process: { label: 'SO ARBEITEN WIR', title: 'Verstehen. Beheben. Prüfen.', steps: [
      ['01', 'Sie zeigen das Problem', 'Sie erklären, wie Sie E-Mails versenden, was nicht klappt, und zeigen ein Beispiel.'],
      ['02', 'Wir ändern die Einstellungen', 'Wir erklären die nötigen Schritte, stimmen die Arbeit ab und setzen sie um.'],
      ['03', 'Gemeinsam prüfen', 'Wir prüfen die Änderungen und geben Ihrem Team verständliche Anleitungen.'],
    ] },
    outcome: { label: 'IHR ERGEBNIS', title: 'Sie wissen, was mit Ihren E-Mails passiert.', items: ['Eine Erklärung, warum E-Mails nicht ankamen.', 'Korrigierte Einstellungen und Prüfergebnisse.', 'Anleitungen zum Versand und zum Umgang mit Fehlern.'], note: 'Niemand kann versprechen, dass jede E-Mail im Posteingang landet: Auch der E-Mail-Dienst Ihres Kunden entscheidet, was Spam ist. Wir beheben, was wir beeinflussen können, und zeigen die Prüfergebnisse.' },
    cta: { label: 'EMAIL / START', title: 'Wo gehen Ihre E-Mails verloren?', text: 'Sagen Sie uns, welche E-Mails nicht ankommen, und zeigen Sie ein Beispiel. Wir schlagen den ersten Schritt vor.', button: 'E-Mail-Zustellung besprechen' },
  },
  uk: {
    meta: ['Email Deliverability — доставка листів | OSNOVA', 'Допомагаємо листам компанії доходити до клієнтів. Знаходимо причини потрапляння в спам, виправляємо налаштування й перевіряємо результат.'],
    label: '06 / EMAIL DELIVERABILITY', title: 'Ваші листи.', titleAccent: 'Ближче до клієнта.',
    scopeTitle: 'З якими листами працюємо',
    intro: 'Допомагаємо зробити так, щоб листи компанії доходили до клієнтів і не потрапляли в спам. Перевіряємо, що заважає доставці, і виправляємо налаштування — для розсилок, рахунків, підтверджень замовлень та інших важливих листів.',
    visual: { label: 'ШЛЯХ ЛИСТА', steps: ['Лист компанії', 'Перевірка відправника', 'Пошта клієнта', 'Вхідні'], note: 'Від компанії — до клієнта' },
    situations: { label: 'НАВІЩО ЦЕ БІЗНЕСУ', title: 'Надіслано — ще не означає отримано.', intro: 'Клієнт чекає на рахунок, підтвердження замовлення чи посилання для входу. Якщо лист не приходить, він не може оплатити, перевірити замовлення або увійти в акаунт. Ми допомагаємо налагодити доставку таких листів і ваших розсилок.', items: [
      ['Листи потрапляють у спам', 'Клієнти пропускають пропозиції, підтвердження та нагадування.'],
      ['Листи не приходять', 'Клієнти скаржаться на затримки, а ви отримуєте повідомлення про помилки.'],
      ['Ви змінюєте спосіб надсилання', 'Підключаєте новий поштовий сервіс або плануєте надсилати більше листів.'],
    ] },
    deliverables: { label: 'ЩО РОБИТЬ OSNOVA', title: 'Упорядковуємо відправлення.', intro: 'Розбираємося з доставлюваністю, репутацією відправника й домену, причинами потрапляння в спам та всією email-інфраструктурою. Без технічного перевантаження пояснюємо, що заважало листам і що ми змінили.', items: [
      ['01', 'Знаходимо причину', 'Перевіряємо листи, помилки та відмови. З’ясовуємо, чому повідомлення потрапляють у спам, затримуються або не приймаються.'],
      ['02', 'Перевіряємо домен і відправника', 'Дивимося на стан домену та репутацію відправника. Виправляємо налаштування, які підтверджують, що лист справді надіслала ваша компанія.'],
      ['03', 'Налаштовуємо інфраструктуру', 'Поєднуємо домен, поштовий сервіс, сайт, CRM й автоматичні повідомлення так, щоб різні типи листів надсилалися передбачувано.'],
      ['04', 'Стабілізуємо надсилання', 'Перевіряємо адреси, частоту й обсяги, проводимо тести та контролюємо помилки — особливо перед збільшенням кількості листів.'],
    ] },
    process: { label: 'ЯК ПРАЦЮЄМО', title: 'З’ясовуємо. Виправляємо. Перевіряємо.', steps: [
      ['01', 'Ви показуєте проблему', 'Розповідаєте, як надсилаєте листи й що не працює. Показуєте приклад.'],
      ['02', 'Ми виправляємо налаштування', 'Пояснюємо, що потрібно зробити, узгоджуємо роботу та вносимо зміни.'],
      ['03', 'Перевіряємо разом', 'Дивимося, що змінилося, і залишаємо вашій команді зрозумілі інструкції.'],
    ] },
    outcome: { label: 'ЩО ВИ ОТРИМУЄТЕ', title: 'Ви знаєте, що відбувається з листами.', items: ['Пояснення, чому листи не доходили.', 'Виправлені налаштування й результати перевірки.', 'Інструкції: як надсилати листи й що робити при збоях.'], note: 'Не можна обіцяти, що кожен лист потрапить у «Вхідні»: пошта клієнта теж вирішує, що вважати спамом. Ми виправляємо те, на що можемо вплинути, і показуємо результат перевірки.' },
    cta: { label: 'EMAIL / СТАРТ', title: 'З’ясуємо, де губляться листи.', text: 'Розкажіть, які листи не доходять, і покажіть приклад. Ми запропонуємо, з чого почати.', button: 'Обговорити доставку листів' },
  },
}
