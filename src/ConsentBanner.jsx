import { useEffect, useState } from 'react'
import { isProductionHost, readConsent, setConsent } from './analytics'
import './consent.css'

const copy = {
  ru: {
    text: 'Мы используем Google Analytics, чтобы понимать, как посетители находят сайт. Без согласия аналитика не запускается — сайт и форма работают как обычно.',
    accept: 'Принять',
    decline: 'Отклонить',
  },
  en: {
    text: 'We use Google Analytics to understand how visitors find this site. Without consent no analytics runs — the site and the form work exactly the same.',
    accept: 'Accept',
    decline: 'Decline',
  },
  de: {
    text: 'Wir nutzen Google Analytics, um zu verstehen, wie Besucher diese Seite finden. Ohne Zustimmung läuft keine Analyse — Seite und Formular funktionieren unverändert.',
    accept: 'Akzeptieren',
    decline: 'Ablehnen',
  },
  uk: {
    text: 'Ми використовуємо Google Analytics, щоб розуміти, як відвідувачі знаходять сайт. Без згоди аналітика не працює — сайт і форма працюють як зазвичай.',
    accept: 'Прийняти',
    decline: 'Відхилити',
  },
}

export default function ConsentBanner({ lang }) {
  const [visible, setVisible] = useState(false)

  // Mounted after paint so the prerendered document never ships the banner.
  useEffect(() => {
    if (isProductionHost() && !readConsent()) setVisible(true)
  }, [])

  if (!visible) return null
  const t = copy[lang] || copy.en

  const choose = (choice) => {
    setConsent(choice)
    setVisible(false)
  }

  return (
    <div className="consent-bar" role="dialog" aria-live="polite" aria-label="Analytics">
      <p>{t.text}</p>
      <div className="consent-actions">
        <button type="button" className="consent-decline" onClick={() => choose('denied')}>{t.decline}</button>
        <button type="button" className="consent-accept" onClick={() => choose('granted')}>{t.accept}</button>
      </div>
    </div>
  )
}
