import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  Check,
  ChevronDown,
  CircleDot,
  Menu,
  Mic2,
  Pause,
  Play,
  Plus,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import { content, languages } from './data/content'

const languageCodes = Object.keys(languages)

function getInitialLanguage() {
  const pathLanguage = window.location.pathname.split('/').filter(Boolean)[0]
  if (languageCodes.includes(pathLanguage)) return pathLanguage
  const saved = localStorage.getItem('osnova-language')
  if (languageCodes.includes(saved)) return saved
  const browser = navigator.language?.slice(0, 2)
  return languageCodes.includes(browser) ? browser : 'en'
}

function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible')
          observer.unobserve(node)
        }
      },
      { threshold: 0.08 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>
      {children}
    </Tag>
  )
}

function Header({ t, lang, setLang }) {
  const [open, setOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navigate = () => setOpen(false)

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="brand" href="#top" aria-label="OSNOVA home" onClick={navigate}>
        <span className="brand-mark">O</span>
        <span>OSNOVA</span>
      </a>

      <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
        <a href="#services" onClick={navigate}>{t.nav.services}</a>
        <a href="#approach" onClick={navigate}>{t.nav.approach}</a>
        <a href="#cases" onClick={navigate}>{t.nav.cases}</a>
        <a href="#pricing" onClick={navigate}>{t.nav.pricing}</a>
        <a className="nav-cta" href="#contact" onClick={navigate}>{t.nav.contact}<ArrowUpRight size={15} /></a>
      </nav>

      <div className="header-actions">
        <div className="language-control">
          <button className="language-current" onClick={() => setLanguageOpen(!languageOpen)} aria-expanded={languageOpen}>
            {languages[lang].label}<ChevronDown size={13} />
          </button>
          {languageOpen && (
            <div className="language-menu">
              {Object.entries(languages).map(([code, item]) => (
                <button
                  className={code === lang ? 'active' : ''}
                  key={code}
                  onClick={() => {
                    setLang(code)
                    setLanguageOpen(false)
                    setOpen(false)
                  }}
                >
                  <span>{item.label}</span>{item.name}{code === lang && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label={t.nav.menu} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}

function SystemMap({ nodes, signal }) {
  const positions = [
    ['node-a', nodes[0]],
    ['node-b', nodes[1]],
    ['node-c', nodes[2]],
    ['node-d', nodes[3]],
    ['node-e', nodes[4]],
    ['node-f', nodes[5]],
  ]
  return (
    <div className="system-map" aria-label={signal}>
      <svg className="map-lines" viewBox="0 0 660 440" aria-hidden="true">
        <path d="M65 92 C190 80 195 210 330 220 S500 155 602 92" />
        <path d="M65 350 C180 350 195 238 330 220 S505 302 605 350" />
        <path d="M140 40 C170 145 270 133 330 220 S383 347 458 402" />
        <path d="M330 220 C400 205 453 72 553 62" className="signal-line" />
        <circle cx="330" cy="220" r="4" className="map-pulse pulse-one" />
        <circle cx="330" cy="220" r="4" className="map-pulse pulse-two" />
      </svg>
      <div className="system-core">
        <span className="core-orbit" />
        <span className="core-dot" />
        <small>{signal}</small>
      </div>
      {positions.map(([className, label], index) => (
        <div className={`map-node ${className}`} key={label}>
          <span>{index === 1 ? <Sparkles size={13} /> : <CircleDot size={12} />}</span>
          {label}
        </div>
      ))}
    </div>
  )
}

function Hero({ t }) {
  return (
    <main id="top">
      <section className="hero">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <Reveal className="hero-copy">
            <div className="eyebrow light"><span className="live-dot" />{t.hero.eyebrow}</div>
            <h1>
              <span>{t.hero.titleA}</span>
              <em>{t.hero.titleB}</em>
            </h1>
            <p>{t.hero.text}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact">{t.hero.primary}<ArrowUpRight size={18} /></a>
              <a className="button button-ghost" href="#services">{t.hero.secondary}<ArrowDown size={18} /></a>
            </div>
          </Reveal>
          <Reveal className="hero-map-wrap" delay={160}>
            <SystemMap nodes={t.hero.nodes} signal={t.hero.signal} />
          </Reveal>
        </div>
        <div className="hero-index">
          <span>OS / 01</span>
          <span>PARIS · REMOTE</span>
          <span>SCROLL TO DECODE</span>
        </div>
      </section>
    </main>
  )
}

function Statement({ t }) {
  return (
    <section className="statement section-pad">
      <div className="container statement-grid">
        <Reveal className="section-label"><Asterisk size={16} />{t.statement.label}</Reveal>
        <Reveal className="statement-copy" delay={80}>
          <h2>{t.statement.text}</h2>
          <p>{t.statement.sub}</p>
        </Reveal>
      </div>
    </section>
  )
}

function ServiceExplorer({ t }) {
  const [active, setActive] = useState(0)
  const current = t.explorer.categories[active]
  return (
    <section className="services section-pad" id="services">
      <div className="container">
        <Reveal className="section-heading">
          <div>
            <span className="section-number">00 — 04</span>
            <div className="eyebrow">{t.explorer.label}</div>
          </div>
          <div>
            <h2>{t.explorer.title}</h2>
            <p>{t.explorer.intro}</p>
          </div>
        </Reveal>

        <Reveal className="service-explorer" delay={100}>
          <div className="service-tabs" role="tablist">
            {t.explorer.categories.map((category, index) => (
              <button
                key={category.id}
                className={active === index ? 'active' : ''}
                onClick={() => setActive(index)}
                role="tab"
                aria-selected={active === index}
              >
                <span>0{index + 1}</span>
                <strong>{category.label}</strong>
                <Plus size={18} />
              </button>
            ))}
          </div>
          <div className={`service-stage stage-${current.id}`} role="tabpanel" key={current.id}>
            <div className="stage-meta">
              <span>{current.kicker}</span>
              <span className="stage-icon"><Asterisk /></span>
            </div>
            <div className="stage-copy">
              <h3>{current.title}</h3>
              <p>{current.text}</p>
              <a href={current.id === 'automation' ? '#automation' : current.id === 'development' ? '#development' : '#marketing'}>
                {t.explorer.explore}<ArrowRight size={18} />
              </a>
            </div>
            <ol className="stage-list">
              {current.items.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}
            </ol>
            <div className="stage-visual" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function AutomationIntro({ t }) {
  return (
    <section className="automation section-pad" id="automation">
      <div className="container">
        <Reveal className="split-heading">
          <div className="eyebrow light">{t.automation.label}</div>
          <h2>{t.automation.title}</h2>
          <p>{t.automation.intro}</p>
        </Reveal>
        <div className="value-grid">
          {t.automation.values.map(([title, text], index) => (
            <Reveal className="value-item" key={title} delay={index * 80}>
              <span className="value-index">0{index + 1}</span>
              <div className="value-glyph"><span /><span /><span /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function VoiceDemo({ voice }) {
  const [step, setStep] = useState(-1)
  const running = step >= 0 && step < voice.transcript.length

  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => setStep((value) => value + 1), 1450)
    return () => clearTimeout(timer)
  }, [step, running])

  const start = () => setStep(0)
  const visible = step < 0 ? [] : voice.transcript.slice(0, Math.min(step + 1, voice.transcript.length))

  return (
    <div className="voice-console">
      <div className="voice-topbar">
        <div><span className={`call-status ${running ? 'active' : ''}`} /><div><small>{voice.live}</small><strong>{voice.business}</strong></div></div>
        <span>AI / CRM</span>
      </div>
      <div className="voice-wave" aria-hidden="true">
        {Array.from({ length: 34 }).map((_, index) => <i key={index} style={{ '--bar': (index * 17) % 38 + 8, '--i': index }} />)}
      </div>
      <div className="transcript">
        {visible.length === 0 ? (
          <div className="transcript-idle"><Mic2 size={30} /><span>{voice.demo}</span></div>
        ) : visible.map(([speaker, line], index) => (
          <div className={`message message-${index}`} key={`${speaker}-${index}`}>
            <small>{speaker}</small>
            <p>{line}</p>
          </div>
        ))}
      </div>
      <button className="call-button" onClick={start} disabled={running}>
        {running ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
        {step >= voice.transcript.length ? voice.restart : voice.start}
      </button>
    </div>
  )
}

function VoiceSection({ t }) {
  return (
    <section className="voice-section section-pad">
      <div className="container voice-layout">
        <Reveal className="voice-copy">
          <div className="eyebrow">{t.voice.label}</div>
          <h2>{t.voice.title}</h2>
          <p>{t.voice.text}</p>
          <div className="feature-chips">
            {t.voice.features.map((feature) => <span key={feature}><Check size={14} />{feature}</span>)}
          </div>
          <small className="voice-note">{t.voice.note}</small>
        </Reveal>
        <Reveal delay={120}><VoiceDemo voice={t.voice} /></Reveal>
      </div>
    </section>
  )
}

function Assistants({ t }) {
  return (
    <section className="assistants section-pad">
      <div className="container">
        <Reveal className="assistants-heading">
          <div className="eyebrow">{t.assistants.label}</div>
          <h2>{t.assistants.title}</h2>
          <p>{t.assistants.text}</p>
        </Reveal>
        <Reveal className="assistant-flow" delay={80}>
          {t.assistants.flow.map((item, index) => (
            <div key={item}><span>0{index + 1}</span><strong>{item}</strong>{index < 3 && <ArrowRight />}</div>
          ))}
        </Reveal>
        <div className="role-grid">
          {t.assistants.roles.map(([name, text], index) => (
            <Reveal className="role-card" key={name} delay={index * 60}>
              <span>{index + 1}</span><h3>{name}</h3><p>{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CrmSection({ t }) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setActive((value) => (value + 1) % t.crm.flow.length), 1600)
    return () => clearInterval(timer)
  }, [t.crm.flow.length])

  return (
    <section className="crm section-pad" id="crm">
      <div className="container crm-layout">
        <Reveal className="crm-copy">
          <div className="eyebrow light">{t.crm.label}</div>
          <h2>{t.crm.title}</h2>
          <p>{t.crm.text}</p>
          <ul>{t.crm.automations.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
        </Reveal>
        <Reveal className="crm-board" delay={100}>
          <div className="board-header">
            <span><i />{t.crm.status}</span>
            <span>FLOW / 001</span>
          </div>
          <div className="crm-flow">
            {t.crm.flow.map((item, index) => (
              <button className={active === index ? 'active' : active > index ? 'passed' : ''} key={item} onClick={() => setActive(index)}>
                <span>{index + 1}</span><strong>{item}</strong>
              </button>
            ))}
          </div>
          <div className="board-log">
            <span>EVENT</span>
            <p><b>→</b> {t.crm.flow[active]}</p>
            <small>{new Date(2026, 6, 23, 14, 28, active * 7).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</small>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Process({ t }) {
  return (
    <section className="process section-pad" id="approach">
      <div className="container process-layout">
        <Reveal className="process-intro">
          <div className="eyebrow">{t.process.label}</div>
          <h2>{t.process.title}</h2>
          <div className="process-graphic" aria-hidden="true">
            <div /><div /><div />
          </div>
        </Reveal>
        <div className="process-steps">
          {t.process.steps.map(([number, title, text], index) => (
            <Reveal className="process-step" key={number} delay={index * 40}>
              <span>{number}</span><h3>{title}</h3><p>{text}</p><ArrowDown size={18} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Development({ t }) {
  return (
    <section className="development section-pad" id="development">
      <div className="container">
        <Reveal className="development-head">
          <div className="eyebrow">{t.development.label}</div>
          <h2>{t.development.title}</h2>
          <p>{t.development.text}</p>
        </Reveal>
        <Reveal className="product-marquee" delay={80}>
          {t.development.products.map((item, index) => <span key={item}><i>0{index + 1}</i>{item}</span>)}
        </Reveal>
        <Reveal className="website-feature" delay={120}>
          <div className="website-preview" aria-hidden="true">
            <div className="browser-bar"><i /><i /><i /></div>
            <div className="preview-copy"><span>MAKE THE COMPLEX</span><strong>FEEL<br />INEVITABLE.</strong></div>
            <div className="preview-orbit"><span /><span /><span /></div>
          </div>
          <div className="website-copy">
            <div className="eyebrow light">{t.development.websites.label}</div>
            <h3>{t.development.websites.title}</h3>
            <p>{t.development.websites.text}</p>
            <div className="website-price"><strong>{t.development.websites.price}</strong><span>{t.development.websites.priceNote}</span></div>
            <a className="button button-light" href="#contact">{t.development.websites.cta}<ArrowUpRight size={17} /></a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Marketing({ t }) {
  const [active, setActive] = useState(0)
  const channel = t.marketing.channels[active]
  return (
    <section className="marketing section-pad" id="marketing">
      <div className="container">
        <Reveal className="marketing-head">
          <div className="eyebrow">{t.marketing.label}</div>
          <h2>{t.marketing.title}</h2>
          <p>{t.marketing.intro}</p>
        </Reveal>
        <Reveal className="channel-selector" delay={80}>
          <div className="channel-tabs">
            {t.marketing.channels.map((item, index) => (
              <button className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={item.id}>
                <span>0{index + 1}</span>{item.name}
              </button>
            ))}
          </div>
          <div className={`channel-stage channel-${channel.id}`} key={channel.id}>
            <div className="channel-radar" aria-hidden="true">
              <span /><span /><span /><i />
              <b>{channel.name.slice(0, 1)}</b>
            </div>
            <div className="channel-copy">
              <small>{channel.name} / STRATEGY</small>
              <h3>{channel.verb}</h3>
              <p>{channel.text}</p>
              <div>{channel.fit.map((item) => <span key={item}>{item}</span>)}</div>
            </div>
          </div>
          <div className="channel-formula">
            {t.marketing.formula.map((item, index) => <span key={item}>{item}{index < t.marketing.formula.length - 1 && <b>×</b>}</span>)}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Cases({ t }) {
  return (
    <section className="cases section-pad" id="cases">
      <div className="container">
        <Reveal className="cases-head">
          <div><div className="eyebrow light">{t.cases.label}</div><h2>{t.cases.title}</h2></div>
          <p>{t.cases.intro}</p>
        </Reveal>
        <div className="case-grid">
          {t.cases.cards.map((item, index) => (
            <Reveal className={`case-card case-${index + 1}`} key={item.tag} delay={index * 70}>
              <div className="case-visual">
                {index === 0 && <img src="/assets/system-convergence.jpg" alt="" loading="lazy" />}
                {index === 1 && <div className="case-dashboard"><span /><span /><span /><span /></div>}
                {index === 2 && <div className="case-next"><Plus size={52} /></div>}
                <span className="case-tag">{item.tag}</span>
              </div>
              <div className="case-body">
                <small>{item.type}</small>
                <h3>{item.title}</h3>
                <p>{item.note}</p>
                <span className="case-link">{t.cases.view}<ArrowUpRight size={16} /></span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function About({ t }) {
  return (
    <section className="about section-pad">
      <div className="container">
        <Reveal className="about-intro">
          <div className="eyebrow">{t.about.label}</div>
          <h2>{t.about.title}</h2>
          <p>{t.about.text}</p>
        </Reveal>
        <div className="about-grid">
          <div className="team-placeholder">
            {t.about.team.map((item, index) => (
              <Reveal className="team-card" key={`${item}-${index}`} delay={index * 70}>
                <div className="portrait-placeholder"><span>0{index + 1}</span></div>
                <strong>{item}</strong><small>PROFILE PLACEHOLDER</small>
              </Reveal>
            ))}
          </div>
          <Reveal className="numbers-panel" delay={100}>
            {t.about.placeholders.map((item, index) => <div key={item}><span>—</span><p>{item}</p><small>DATA / {index + 1}</small></div>)}
          </Reveal>
        </div>
        <Reveal className="testimonial-placeholder">
          <span>{t.about.demo}</span>
          <blockquote>“{t.about.testimonials}”</blockquote>
          <div><i /><strong>CLIENT NAME / COMPANY</strong></div>
        </Reveal>
      </div>
    </section>
  )
}

function Pricing({ t }) {
  return (
    <section className="pricing section-pad" id="pricing">
      <div className="container pricing-layout">
        <Reveal className="pricing-intro">
          <div className="eyebrow light">{t.pricing.label}</div>
          <h2>{t.pricing.title}</h2>
          <p>{t.pricing.text}</p>
          <span className="pricing-big">{t.pricing.from}</span>
        </Reveal>
        <div className="pricing-list">
          {t.pricing.items.map(([service, price], index) => (
            <Reveal className="price-row" key={service} delay={index * 35}>
              <span>0{index + 1}</span><strong>{service}</strong><em>{price}</em><ArrowUpRight size={18} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact({ t }) {
  const [sent, setSent] = useState(false)
  const submit = (event) => {
    event.preventDefault()
    setSent(true)
  }
  return (
    <section className="contact section-pad" id="contact">
      <div className="contact-orb" aria-hidden="true" />
      <div className="container contact-layout">
        <Reveal className="contact-copy">
          <div className="eyebrow light">{t.contact.label}</div>
          <h2>{t.contact.title}</h2>
          <p>{t.contact.text}</p>
          <div className="direct-contact">
            <small>{t.contact.or}</small>
            <a href={`mailto:${t.contact.email}`}>{t.contact.email}<ArrowUpRight size={15} /></a>
            <a href="https://t.me/your_agency" target="_blank" rel="noreferrer">{t.contact.telegram}<ArrowUpRight size={15} /></a>
          </div>
        </Reveal>
        <Reveal className="contact-form-wrap" delay={120}>
          {sent ? (
            <div className="form-success"><Check size={30} /><p>{t.contact.sent}</p><button onClick={() => setSent(false)}>OK</button></div>
          ) : (
            <form onSubmit={submit}>
              <div className="form-row">
                <label><span>{t.contact.fields.name}</span><input name="name" required autoComplete="name" /></label>
                <label><span>{t.contact.fields.contact}</span><input name="contact" required autoComplete="email" /></label>
              </div>
              <label><span>{t.contact.fields.company}</span><input name="company" autoComplete="organization" /></label>
              <label>
                <span>{t.contact.fields.help}</span>
                <select name="service" defaultValue="">
                  <option value="" disabled>—</option>
                  {t.contact.options.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label><span>{t.contact.fields.message}</span><textarea name="message" rows="3" required /></label>
              <button className="form-submit" type="submit">{t.contact.submit}<Send size={17} /></button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function Footer({ t }) {
  return (
    <footer>
      <div className="footer-marquee"><span>{t.footer.line} <Asterisk /> {t.footer.line} <Asterisk /> {t.footer.line}</span></div>
      <div className="container footer-bottom">
        <a className="brand footer-brand" href="#top"><span className="brand-mark">O</span><span>OSNOVA</span></a>
        <p>{t.footer.rights}</p>
        <a href="#top">{t.footer.top}<ArrowUpRight size={14} /></a>
      </div>
    </footer>
  )
}

export default function App() {
  const [lang, setLang] = useState(getInitialLanguage)
  const t = useMemo(() => content[lang], [lang])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', t.meta.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.meta.description)
    localStorage.setItem('osnova-language', lang)
    const nextPath = `/${lang}/${window.location.hash || ''}`
    window.history.replaceState({}, '', nextPath)
  }, [lang, t])

  useEffect(() => {
    if (!window.location.hash) return
    const timer = window.setTimeout(() => {
      document.querySelector(window.location.hash)?.scrollIntoView({ block: 'start' })
    }, 80)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <Header t={t} lang={lang} setLang={setLang} />
      <Hero t={t} />
      <Statement t={t} />
      <ServiceExplorer t={t} />
      <AutomationIntro t={t} />
      <VoiceSection t={t} />
      <Assistants t={t} />
      <CrmSection t={t} />
      <Process t={t} />
      <Development t={t} />
      <Marketing t={t} />
      <Cases t={t} />
      <About t={t} />
      <Pricing t={t} />
      <Contact t={t} />
      <Footer t={t} />
    </>
  )
}
