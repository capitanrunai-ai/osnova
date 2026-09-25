import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  Check,
  ChevronDown,
  Menu,
  MailCheck,
  BriefcaseBusiness,
  PenTool,
  Code2,
  Bot,
  Megaphone,
  Pause,
  Play,
  X,
  Send,
  Cable,
  Radar,
  Sparkles,
  AudioLines,
  Workflow,
  ServerCog,
} from 'lucide-react'
import { content, languages } from './data/content'
import { commercialContent } from './data/commercialContent'
import { designContent } from './data/designContent'
import { paymentContent } from './data/paymentContent'
import { caseCategories, caseUi, getLocalizedCases } from './data/cases'
import { serviceContent } from './data/serviceContent'
import { extendServiceContent } from './data/visibilityContent'
import { closingContent } from './data/closingContent'
import { defaultLanguage, serviceRoutes } from './data/routes'
import './services.css'
import './cases.css'
import { CaseVisual, PortfolioDetail } from './PortfolioMedia'
import { initAnalytics, serviceSlug, track, trackLead, trackPageView } from './analytics'
import ConsentBanner from './ConsentBanner'
import { getTeam } from './data/team'
import './team.css'
import './email.css'
import './payment.css'

const portfolioMemory = { featured: {}, archive: {} }

const languageCodes = Object.keys(languages)

function parseLocation() {
  const parts = window.location.pathname.split('/').filter(Boolean)
  const lang = languageCodes.includes(parts[0]) ? parts[0] : null
  const route = parts.slice(lang ? 1 : 0).join('/')
  return { lang, route, hash: window.location.hash }
}

// Single resolver for "what is this URL?", used both to pick the page component
// and to build the head metadata, so the two can never disagree.
function resolveRoute(route, lang) {
  if (!route) return { kind: 'home' }
  if (route === 'services') return { kind: 'services' }
  if (route === 'cases') return { kind: 'cases' }
  if (route === 'payment') return { kind: 'payment' }
  if (route.startsWith('services/')) {
    const id = route.slice('services/'.length)
    return serviceRoutes.includes(id) ? { kind: 'service', id } : { kind: 'notFound' }
  }
  if (route.startsWith('cases/')) {
    const slug = route.slice('cases/'.length)
    const item = getLocalizedCases(lang).find((candidate) => candidate.slug === slug)
    return item ? { kind: 'case', item } : { kind: 'notFound' }
  }
  return { kind: 'notFound' }
}

function headTag(selector, create) {
  let node = document.head.querySelector(selector)
  if (!node) { node = create(); document.head.appendChild(node) }
  return node
}

function setMetaTag(attribute, key, value) {
  headTag(`meta[${attribute}="${key}"]`, () => {
    const node = document.createElement('meta')
    node.setAttribute(attribute, key)
    return node
  }).setAttribute('content', value)
}

function setLinkTag(rel, hreflang, href) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`
  headTag(selector, () => {
    const node = document.createElement('link')
    node.setAttribute('rel', rel)
    if (hreflang) node.setAttribute('hreflang', hreflang)
    return node
  }).setAttribute('href', href)
}

function getInitialLanguage() {
  const { lang } = parseLocation()
  if (lang) return lang
  const saved = localStorage.getItem('osnova-language')
  if (languageCodes.includes(saved)) return saved
  const browser = navigator.language?.slice(0, 2)
  return browser === 'uk' ? 'uk' : languageCodes.includes(browser) ? browser : 'en'
}

let revealObserver

function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    revealObserver ||= new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      }
    }, { threshold: 0.06 })
    revealObserver.observe(node)
    return () => revealObserver.unobserve(node)
  }, [])
  return <Tag ref={ref} className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>{children}</Tag>
}

function BrandMark({ brand }) {
  if (brand === 'google') {
    return (
      <svg className="brand-svg google-mark" viewBox="0 0 24 24" role="img" aria-label="Google">
        <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.89h5.38a4.6 4.6 0 0 1-2 3.01v2.52h3.24c1.9-1.75 2.98-4.32 2.98-7.36Z" />
        <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.41l-3.24-2.52c-.9.6-2.04.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.6A10 10 0 0 0 12 22Z" />
        <path fill="#FBBC05" d="M6.39 13.9A6 6 0 0 1 6.08 12c0-.66.11-1.3.31-1.9V7.5H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.5l3.35-2.6Z" />
        <path fill="#EA4335" d="M12 5.97c1.47 0 2.79.5 3.82 1.5l2.87-2.86A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.96 5.5l3.35 2.6C7.18 7.73 9.39 5.97 12 5.97Z" />
      </svg>
    )
  }
  if (brand === 'meta') {
    return <img className="brand-svg meta-mark" src="/assets/meta-symbol.svg" alt="Meta" />
  }
  return (
    <svg className="brand-svg tiktok-mark" viewBox="0 0 24 24" role="img" aria-label="TikTok">
      <path className="tik-shadow-cyan" d="M13.53 1.02h3.83c.1 1.42.64 2.82 1.69 3.8A7.5 7.5 0 0 0 23 6.83v3.7a11.2 11.2 0 0 1-5.58-1.65v7.02a7.1 7.1 0 1 1-6.1-7.03v3.77a3.43 3.43 0 1 0 2.18 3.2Z" />
      <path className="tik-shadow-pink" d="M12.5 1.02h3.83c.1 1.42.64 2.82 1.69 3.8a7.5 7.5 0 0 0 3.95 2.01v3.7a11.2 11.2 0 0 1-5.58-1.65v7.02a7.1 7.1 0 1 1-6.1-7.03v3.77a3.43 3.43 0 1 0 2.18 3.2Z" />
      <path className="tik-main" d="M13.02 1.02h3.83c.1 1.42.64 2.82 1.69 3.8a7.5 7.5 0 0 0 3.95 2.01v3.7a11.2 11.2 0 0 1-5.58-1.65v7.02a7.1 7.1 0 1 1-6.1-7.03v3.77a3.43 3.43 0 1 0 2.18 3.2Z" />
    </svg>
  )
}

function RouteLink({ href, navigate, world = 'neutral', className = '', children, onClick, ...props }) {
  return (
    <a
      href={href}
      className={className}
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        navigate(href, world)
      }}
    >
      {children}
    </a>
  )
}

function Header({ t, s, lang, route, setLang, navigate }) {
  const [open, setOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)
  const home = `/${lang}/`
  return (
    <header className={`site-header route-header ${scrolled ? 'is-scrolled' : ''}`}>
      <RouteLink className="brand" href={home} navigate={navigate} onClick={close} aria-label="OSNOVA home">
        <span className="brand-mark">O</span><span>OSNOVA</span>
      </RouteLink>
      <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label={s.common.menu}>
        <RouteLink href={`/${lang}/services/development`} navigate={navigate} onClick={close}>{designContent[lang].nav.development}</RouteLink>
        <RouteLink href={`/${lang}/services/automation`} navigate={navigate} onClick={close}>{designContent[lang].nav.automation}</RouteLink>
        <RouteLink href={`/${lang}/services`} navigate={navigate} onClick={close}>{s.common.services}</RouteLink>
        <RouteLink href={`/${lang}/cases`} navigate={navigate} onClick={close}>{s.common.cases}</RouteLink>
        <RouteLink href={`${home}#about`} navigate={navigate} onClick={close}>{s.common.about}</RouteLink>
        <RouteLink href={`${home}#pricing`} navigate={navigate} onClick={close}>{s.common.pricing}</RouteLink>
        <RouteLink className="nav-cta" href={`${home}#contact`} navigate={navigate} onClick={close}>
          {s.common.discuss}<ArrowUpRight size={15} />
        </RouteLink>
      </nav>
      <div className="header-actions">
        <div className="language-control">
          <button className="language-current" onClick={() => setLanguageOpen(!languageOpen)} aria-expanded={languageOpen}>
            {languages[lang].label}<ChevronDown size={13} />
          </button>
          {languageOpen && (
            <div className="language-menu">
              {Object.entries(languages).map(([code, item]) => (
                <button className={code === lang ? 'active' : ''} key={code} onClick={() => {
                  setLang(code)
                  setLanguageOpen(false)
                  setOpen(false)
                }}>
                  <span>{item.label}</span>{item.name}{code === lang && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? s.common.close : s.common.menu} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {(route.startsWith('services/') || route.startsWith('cases')) && <span className="header-route-code">{route.split('/')[0]?.toUpperCase()}</span>}
    </header>
  )
}

function SystemMap({ nodes, signal }) {
  return (
    <div className="system-map" aria-label={signal}>
      <svg className="map-lines map-lines-desktop" viewBox="0 0 660 440" aria-hidden="true">
        <path d="M65 92 C190 80 195 210 330 220 S500 155 602 92" />
        <path d="M65 350 C180 350 195 238 330 220 S505 302 605 350" />
        <path d="M140 40 C170 145 270 133 330 220 S383 347 458 402" />
        <path d="M330 220 C400 205 453 72 553 62" className="signal-line" />
        <circle cx="330" cy="220" r="4" className="map-pulse pulse-one" />
        <circle cx="330" cy="220" r="4" className="map-pulse pulse-two" />
      </svg>
      <svg className="map-lines map-lines-mobile" viewBox="0 0 320 250" aria-hidden="true">
        <path d="M58 38C104 38 112 125 160 125" />
        <path d="M262 38C216 38 208 125 160 125" />
        <path d="M58 212C104 212 112 125 160 125" />
        <path d="M262 212C216 212 208 125 160 125" />
        <circle cx="160" cy="125" r="3" />
      </svg>
      <div className="system-core"><span className="core-orbit" /><span className="core-dot" /><small>{signal}</small></div>
      {nodes.map((label, index) => <div className={`map-node node-${String.fromCharCode(97 + index)}`} key={label}><span>0{index + 1}</span>{label}</div>)}
    </div>
  )
}

function HomeHero({ t, s, lang, navigate }) {
  const c = commercialContent[lang]
  return (
    <main id="top">
      <section className="hero home-hero">
        <div className="hero-image" aria-hidden="true" /><div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <Reveal className="hero-copy">
            <div className="eyebrow light"><span className="live-dot" />{designContent[lang].heroLabel}</div>
            <h1><span>{c.hero.a}</span><em>{c.hero.b}</em></h1>
            <p>{c.hero.text}</p>
            <div className="hero-actions">
              <RouteLink className="button button-primary" href={`/${lang}/services/development`} navigate={navigate} world="development">{c.hero.primary}<ArrowUpRight size={18} /></RouteLink>
              <RouteLink className="button button-ghost" href={`/${lang}/#cases`} navigate={navigate} world="development">{designContent[lang].heroWork}<ArrowRight size={18} /></RouteLink>
            </div>
          </Reveal>
          <Reveal className="hero-offer-wrap" delay={160}>
            <RouteLink className="hero-offer-card" href={`/${lang}/services/development#packages`} navigate={navigate} world="development">
              <span className="offer-card-top"><span>01 / DEVELOPMENT</span><i className="offer-card-arrow"><ArrowUpRight size={20} /></i></span>
              <div className="offer-wireframe" aria-hidden="true">
                <div className="wf-bar"><b /><i /><i /><i /></div>
                <div className="wf-hero"><i /><i /><i /><b /></div>
                <div className="wf-cols"><i /><i /><i /></div>
                <div className="wf-toast"><Send size={12} /><span>Telegram</span><em>+1</em></div>
              </div>
              <div className="offer-card-bottom"><small>{c.offers.items[0].title}</small><strong>{c.offers.items[0].price}</strong><span>{designContent[lang].included}</span></div>
              <div className="offer-card-alt"><span>{c.offers.items[1].title}</span><b>{c.offers.items[1].price}</b></div>
              <span className="offer-card-action">{designContent[lang].offerAction}<ArrowRight size={16} /></span>
            </RouteLink>
          </Reveal>
        </div>
        <div className="hero-index"><span>OS / 01</span><span>PARIS · REMOTE</span><span>SYSTEMS, CONNECTED</span></div>
      </section>
    </main>
  )
}

function SystemContinuum({ s }) {
  return (
    <section className="continuum" aria-label={s.common.system.join(' — ')}>
      <div className="continuum-track">
        {[0, 1].map((group) => (
          <div className="continuum-group" key={group} aria-hidden={group === 1 ? 'true' : undefined}>
            {s.common.system.map((item, index) => (
              <span key={`${group}-${item}`}><i>0{index + 1}</i><b>{item}</b><ArrowRight /></span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function ServiceWorlds({ s, lang, navigate, compact = false }) {
  const [active, setActive] = useState(-1)
  const Heading = compact ? 'h2' : 'h1'
  const move = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--px', `${((event.clientX - bounds.left) / bounds.width) * 100}%`)
    event.currentTarget.style.setProperty('--py', `${((event.clientY - bounds.top) / bounds.height) * 100}%`)
  }
  return (
    <section className={`service-worlds ${compact ? 'is-compact' : ''}`} id="services">
      <div className="worlds-grid" aria-hidden="true" />
      <div className="container worlds-heading">
        <Reveal>
          <span className="eyebrow light">{s.servicesPage.label}</span>
          <Heading>{s.servicesPage.title}<em>{s.servicesPage.titleAccent}</em></Heading>
        </Reveal>
        <Reveal delay={80}><p>{s.servicesPage.intro}</p><small>{s.servicesPage.hint}</small></Reveal>
      </div>
      <div className="world-list" onMouseLeave={() => setActive(-1)}>
        {s.directions.map((direction, index) => (
          <RouteLink
            key={direction.id}
            href={direction.href || `/${lang}/services/${direction.id}`}
            navigate={navigate}
            world={direction.id}
            className={`world-entry world-${direction.id} ${active === index ? 'is-active' : ''} ${active >= 0 && active !== index ? 'is-muted' : ''}`}
            onMouseEnter={() => setActive(index)}
            onMouseMove={move}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(-1)}
          >
            <span className="world-number">{direction.number}</span>
            <div className="world-copy"><h3>{direction.name}</h3><p>{direction.short}</p></div>
            <div className="world-signal" aria-hidden="true"><i /><i /><i /><b /></div>
            <div className="world-items">{direction.items.map((item) => <span key={item}>{item}</span>)}</div>
            <span className="world-enter">{direction.action || s.common.explore}<ArrowUpRight /></span>
          </RouteLink>
        ))}
      </div>
    </section>
  )
}

function CaseFilters({ ui, group, subfilter, onGroup, onSubfilter, compact = false }) {
  const groups = ['all', 'development', 'automation']
  const subfilters = group === 'all' ? [] : caseCategories[group] || []
  return (
    <div className={`case-filter-shell ${compact ? 'is-compact' : ''}`}>
      <div className="case-filter-main" role="group" aria-label={ui.allCases}>
        {groups.map((id) => (
          <button
            key={id}
            className={group === id ? 'active' : ''}
            onClick={() => onGroup(id)}
            aria-pressed={group === id}
          >
            {ui.filters[id]}<i />
          </button>
        ))}
      </div>
      <div className={`case-subfilters ${subfilters.length ? 'is-visible' : ''}`}>
        {subfilters.length > 0 && (
          <>
            <button className={subfilter === 'all' ? 'active' : ''} onClick={() => onSubfilter('all')}>{ui.filters.all}</button>
            {subfilters.map((id) => <button className={subfilter === id ? 'active' : ''} onClick={() => onSubfilter(id)} key={id}>{ui.filters[id]}</button>)}
          </>
        )}
      </div>
    </div>
  )
}

function filterCases(items, group, subfilter) {
  return items.filter((item) => {
    if (group !== 'all' && item.category !== group) return false
    return subfilter === 'all' || item.subcategories.includes(subfilter)
  })
}

function SpatialCaseGallery({ items, lang, navigate, ui, memoryKey = 'featured', showIndex = false, prioritizeActive = true }) {
  const stageRef = useRef(null)
  const wheelTimeRef = useRef(0)
  const gestureRef = useRef({ active: false, startX: 0, lastX: 0, lastTime: 0, velocity: 0, drag: 0, moved: false })
  const [active, setActive] = useState(() => Math.max(0, items.findIndex(item => item.slug === portfolioMemory[memoryKey].slug)))
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [stageWidth, setStageWidth] = useState(1200)
  const itemKey = items.map((item) => item.slug).join('|')

  useEffect(() => {
    setActive(Math.max(0, items.findIndex(item => item.slug === portfolioMemory[memoryKey].slug)))
    setDrag(0)
  }, [itemKey])

  useEffect(() => {
    const node = stageRef.current
    if (!node) return undefined
    const observer = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const spacing = stageWidth < 680 ? stageWidth * .84 : Math.min(stageWidth * .6, 690)
  const go = (next) => {
    const index = Math.max(0, Math.min(items.length - 1, next))
    setActive(index)
    portfolioMemory[memoryKey].slug = items[index]?.slug
  }
  const activeNumber = String(active + 1).padStart(2, '0')
  const totalNumber = String(items.length).padStart(2, '0')
  const atStart = active === 0
  const atEnd = active === items.length - 1

  const beginGesture = (clientX) => {
    gestureRef.current = { active: true, startX: clientX, lastX: clientX, lastTime: performance.now(), velocity: 0, drag: 0, moved: false }
    setDragging(true)
  }

  const moveGesture = (clientX) => {
    if (!gestureRef.current.active) return
    const now = performance.now()
    const gesture = gestureRef.current
    const delta = clientX - gesture.startX
    const elapsed = Math.max(8, now - gesture.lastTime)
    gesture.velocity = (clientX - gesture.lastX) / elapsed
    gesture.lastX = clientX
    gesture.lastTime = now
    gesture.moved = gesture.moved || Math.abs(delta) > 6
    const pullingStart = active === 0 && delta > 0
    const pullingEnd = active === items.length - 1 && delta < 0
    gesture.drag = (pullingStart || pullingEnd) ? delta * .28 : delta
    setDrag(gesture.drag)
  }

  const onPointerDown = (event) => {
    if (event.pointerType === 'touch' || event.button !== 0) return
    beginGesture(event.clientX)
  }

  const onPointerMove = (event) => {
    if (event.pointerType === 'touch') return
    moveGesture(event.clientX)
    if (gestureRef.current.active && gestureRef.current.moved) event.currentTarget.setPointerCapture(event.pointerId)
  }

  const finishGesture = () => {
    if (!gestureRef.current.active) return
    const gesture = gestureRef.current
    gesture.active = false
    const projected = gesture.drag + gesture.velocity * 150
    let shift = Math.round(-projected / spacing)
    if (!shift && Math.abs(gesture.drag) > Math.min(90, spacing * .16)) shift = gesture.drag < 0 ? 1 : -1
    setDragging(false)
    setDrag(0)
    go(active + shift)
  }

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    const onWheel = event => {
      if (!(Math.abs(event.deltaX) > 8 || event.shiftKey)) return
      event.preventDefault()
      const now = performance.now()
      if (now - wheelTimeRef.current < 500) return
      wheelTimeRef.current = now
      const delta = Math.abs(event.deltaX) > 8 ? event.deltaX : event.deltaY
      go(active + (delta > 0 ? 1 : -1))
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [active, itemKey])

  if (!items.length) return <div className="case-empty">{ui.empty}</div>

  return (
    <div className="spatial-gallery">
      <div
        className={`spatial-stage ${dragging ? 'is-dragging' : ''}`}
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishGesture}
        onPointerCancel={finishGesture}
        onTouchStart={(event) => {
          if (event.touches.length === 1) beginGesture(event.touches[0].clientX)
        }}
        onTouchMove={(event) => {
          if (event.touches.length === 1) moveGesture(event.touches[0].clientX)
        }}
        onTouchEnd={finishGesture}
        onTouchCancel={finishGesture}
        onKeyDown={(event) => {
          if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) event.preventDefault()
          if (event.key === 'ArrowLeft') go(active - 1)
          if (event.key === 'ArrowRight') go(active + 1)
          if (event.key === 'Home') go(0)
          if (event.key === 'End') go(items.length - 1)
        }}
        tabIndex="0"
        role="region"
        aria-roledescription="carousel"
        aria-label={ui.featuredLabel}
      >
        {items.map((item, index) => {
          const offset = index - active + drag / spacing
          const distance = Math.abs(offset)
          const x = offset * spacing
          const z = -Math.min(distance, 3) * 150
          const scale = 1 - Math.min(distance * .115, .28)
          const rotate = offset * -6
          return (
            <article
              key={item.id}
              className={`spatial-card ${index === active ? 'is-active' : ''}`}
              style={{
                '--case-x': `${x}px`,
                '--case-z': `${z}px`,
                '--case-scale': scale,
                '--case-rotate': `${rotate}deg`,
                '--case-opacity': Math.max(.18, 1 - distance * .28),
                zIndex: 20 - Math.round(distance),
              }}
              aria-hidden={index !== active}
            >
              <RouteLink
                href={`/${lang}/cases/${item.slug}`}
                navigate={navigate}
                world={item.category}
                draggable="false"
                onDragStart={(event) => event.preventDefault()}
                onClick={(event) => {
                  if (gestureRef.current.moved && event.detail !== 0) { event.preventDefault(); return }
                  if (index !== active) { event.preventDefault(); go(index) }
                }}
                tabIndex={index === active ? 0 : -1}
              >
                <div className="spatial-card-visual">
                  <CaseVisual item={item} priority={prioritizeActive && index === active} />
                  <span className="case-card-index">{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
                </div>
                <div className="spatial-card-copy">
                  <div>
                    <small>{item.recovery ? ui.restored : item.categoryLabel}</small>
                    <h3>{item.title.split(' — ').map((part, i) => <span className={i ? 'card-subtitle' : ''} key={part}>{part}</span>)}</h3>
                  </div>
                  <div className="case-preview-fact">
                    <span>{item.audio ? ui.listen : item.recovery ? ui.restored : item.category === 'automation' ? item.categoryLabel : 'DESIGN / DEVELOPMENT'}</span>
                    <p>{item.summary}</p>
                  </div>
                  <span className="case-open-action">
                    <span>{ui.openCase}</span>
                    <i className="case-open-icon"><ArrowUpRight /></i>
                  </span>
                </div>
              </RouteLink>
            </article>
          )
        })}
      </div>
      <nav className="spatial-navigation" aria-label={ui.navigationLabel}>
        <button className="spatial-nav-button is-previous" onClick={() => go(active - 1)} disabled={atStart}>
          <span className="spatial-nav-icon"><ArrowLeft /></span>
          <span className="spatial-nav-copy">
            <small>{atStart ? ui.start : ui.previous}</small>
            <b>{atStart ? activeNumber : String(active).padStart(2, '0')}</b>
          </span>
        </button>
        <button className="spatial-nav-button is-next" onClick={() => go(active + 1)} disabled={atEnd}>
          <span className="spatial-nav-copy">
            <small>{atEnd ? ui.end : ui.next}</small>
            <b>{atEnd ? activeNumber : String(active + 2).padStart(2, '0')}</b>
          </span>
          <span className="spatial-nav-icon"><ArrowRight /></span>
        </button>
      </nav>
      <div className="spatial-controls">
        <span className="spatial-guidance">{ui.dragHint}<i /><span>{ui.wheelHint}</span></span>
        <div className="spatial-status" aria-live="polite" aria-atomic="true">
          <small>{ui.index}</small><strong>{activeNumber}</strong><i>/</i><b>{totalNumber}</b>
        </div>
        <div className="spatial-progress">{items.map((item, index) => <button key={item.id} className={index === active ? 'active' : ''} onClick={() => go(index)} aria-label={`${ui.index} ${index + 1} / ${items.length}`} aria-current={index === active ? 'true' : undefined}><i /></button>)}</div>
      </div>
      {showIndex && <div className="container portfolio-index" aria-label={ui.allCases}>
        {items.map((item, index) => <button key={item.id} className={index === active ? 'active' : ''} aria-current={index === active ? 'true' : undefined} onClick={() => {
          go(index)
          stageRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' })
        }}><span>{String(index + 1).padStart(2, '0')}</span><b>{item.title}</b><ArrowUpRight size={15} /></button>)}
      </div>}
    </div>
  )
}

function FeaturedCases({ lang, navigate }) {
  const ui = caseUi[lang]
  const allItems = useMemo(() => getLocalizedCases(lang), [lang])
  const [group, setGroup] = useState('all')
  const [subfilter, setSubfilter] = useState('all')
  const items = useMemo(() => filterCases(allItems, group, subfilter), [allItems, group, subfilter])

  return (
    <section className="cases-showcase" id="cases">
      <div className="container">
        <Reveal className="cases-showcase-head">
          <div><div className="eyebrow light">{ui.featuredLabel}</div><h2>{ui.featuredTitle}</h2></div>
          <p>{ui.featuredIntro}</p>
        </Reveal>
        <Reveal delay={80}>
          <CaseFilters
            ui={ui}
            group={group}
            subfilter={subfilter}
            compact
            onGroup={(value) => { setGroup(value); setSubfilter('all') }}
            onSubfilter={setSubfilter}
          />
        </Reveal>
      </div>
      <SpatialCaseGallery items={items} lang={lang} navigate={navigate} ui={ui} prioritizeActive={false} />
      <div className="container cases-showcase-foot">
        <RouteLink className="cases-view-all" href={`/${lang}/cases`} navigate={navigate}>
          <span>{ui.viewAll}</span><ArrowRight />
        </RouteLink>
      </div>
    </section>
  )
}

function CasesArchive({ lang, navigate }) {
  const ui = caseUi[lang]
  const allItems = useMemo(() => getLocalizedCases(lang), [lang])
  const [group, setGroup] = useState(portfolioMemory.archive.group || 'all')
  const items = useMemo(() => filterCases(allItems, group, 'all'), [allItems, group])
  return (
    <main className="cases-archive-page real-archive" id="top">
      <section className="cases-archive-hero">
        <div className="cases-archive-grid" aria-hidden="true" />
        <div className="container">
          <Reveal><span className="eyebrow light">{ui.pageLabel}</span><h1>{ui.pageTitle}</h1></Reveal>
          <Reveal delay={90}><p>{ui.pageIntro}</p><span className="archive-count">{String(allItems.length).padStart(2, '0')} / {ui.projects}</span></Reveal>
        </div>
      </section>
      <section className="portfolio-archive-gallery">
        <div className="container"><CaseFilters ui={ui} group={group} subfilter="all" onGroup={value => { setGroup(value); portfolioMemory.archive.group = value }} /></div>
        <SpatialCaseGallery items={items} lang={lang} navigate={navigate} ui={ui} memoryKey="archive" showIndex />
      </section>
    </main>
  )
}

function About({ t, lang }) {
  const team = getTeam(lang)
  const icons = { leadership: BriefcaseBusiness, design: PenTool, development: Code2, ai: Bot, marketing: Megaphone, email: MailCheck }
  return (
    <section className="about section-pad" id="about">
      <div className="container">
        <Reveal className="about-intro"><div className="eyebrow">{t.about.label}</div><h2>{t.about.title}</h2><p>{team.intro}</p></Reveal>
        <div className="about-team" role="group" aria-label={team.label}>
          <div className="about-team-header"><span>{team.label}</span><i aria-hidden="true" /></div>
          <div className="about-team-roles">
            {team.roles.map((role, index) => {
              const Icon = icons[role.id]
              return <Reveal as="article" className={`about-team-role${role.id === 'leadership' ? ' is-lead' : ''}`} key={role.id}>
                <div className="about-team-role-top" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span><Icon size={23} strokeWidth={1.4} /></div>
                <h3>{role.title}</h3>
                <div className="about-team-role-description"><h4>{role.focus}</h4><p>{role.description}</p></div>
              </Reveal>
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function selectContactService(service) {
  sessionStorage.setItem('osnova:contact-service', service)
  window.dispatchEvent(new CustomEvent('osnova:contact-service', { detail: service }))
}

function Pricing({ t, lang, navigate }) {
  return (
    <section className="pricing section-pad" id="pricing">
      <div className="container pricing-layout">
        <Reveal className="pricing-intro"><div className="eyebrow light">{t.pricing.label}</div><h2>{t.pricing.title}</h2><p>{t.pricing.text}</p><span className="pricing-signal" aria-hidden="true"><i /><i /><i /></span></Reveal>
        <div className="pricing-list">
          {t.pricing.items.map((service, index) => (
            <Reveal className="price-row" key={service} delay={index * 35}>
              <span>0{index + 1}</span>
              <strong>{service}</strong>
              <RouteLink
                className="price-action"
                href={`/${lang}/#contact-form`}
                navigate={navigate}
                onClick={() => {
                  selectContactService(service)
                  track('pricing_cta_click', { site_language: lang, service: serviceSlug(service, t.contact.options) })
                }}
                aria-label={`${t.pricing.action}: ${service}`}
              >
                {t.pricing.action}<ArrowUpRight size={16} />
              </RouteLink>
            </Reveal>
          ))}
          <Reveal className="pricing-budget-note"><i />{t.pricing.budgetNote}</Reveal>
        </div>
      </div>
    </section>
  )
}

function Contact({ t, p, lang, navigate }) {
  const [status, setStatus] = useState('idle')
  const [service, setService] = useState(() => sessionStorage.getItem('osnova:contact-service') || '')
  const startedAtRef = useRef(Date.now())
  const c = closingContent[lang]
  useEffect(() => {
    sessionStorage.removeItem('osnova:contact-service')
    const selectService = (event) => {
      setService(event.detail)
      setStatus('idle')
      sessionStorage.removeItem('osnova:contact-service')
    }
    window.addEventListener('osnova:contact-service', selectService)
    return () => window.removeEventListener('osnova:contact-service', selectService)
  }, [])
  const serviceOptions = t.contact.options
  const selectedService = serviceOptions.includes(service) ? service : serviceOptions.at(-1)
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return
    const data = new FormData(event.currentTarget)
    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          contact: data.get('contact'),
          company: data.get('company'),
          service: selectedService,
          message: data.get('message'),
          hp: data.get('hp'),
          startedAt: startedAtRef.current,
          lang,
          page: `${window.location.pathname}${window.location.hash}`,
        }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.ok) throw new Error('failed')
      setStatus('success')
      // Counted only once the backend confirms it actually delivered the lead.
      // A submission the honeypot swallowed answers ok:true to the sender but
      // reports delivered:false, and must not show up as a conversion.
      if (payload.delivered) {
        trackLead({ language: lang, service: serviceSlug(selectedService, serviceOptions) })
      }
    } catch (error) {
      setStatus('error')
      track('contact_submit_failed', { site_language: lang, page_path: window.location.pathname })
    }
  }
  return (
    <section className="contact contact-finale section-pad" id="contact" aria-labelledby="contact-title">
      <div className="container contact-topline"><span className="eyebrow light"><i />{c.label}</span><span aria-hidden="true">OS / NEXT</span></div>
      <div className="container contact-layout">
        <Reveal className="contact-copy">
          <h2 id="contact-title">{c.title}<em>{c.accent}</em></h2><p>{c.text}</p>
          <ol className="contact-steps">{c.steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol>
          <div className="direct-contact"><small>{t.contact.or}</small><a href={`mailto:${t.contact.email}`} onClick={() => track('email_click', { site_language: lang, page_path: window.location.pathname, link_location: 'contact' })}><span><small>Email</small>{t.contact.email}</span><ArrowUpRight size={20} /></a><a href="https://t.me/capitanrun" target="_blank" rel="noreferrer" onClick={() => track('telegram_click', { site_language: lang, page_path: window.location.pathname, link_location: 'contact' })}><span><small>Telegram</small>{t.contact.telegram}</span><ArrowUpRight size={20} /></a><RouteLink className="contact-payment-link" href={`/${lang}/payment`} navigate={navigate}><span><small>{p.navLabel}</small>{p.contactLink}</span><ArrowUpRight size={20} /></RouteLink></div>
        </Reveal>
        <Reveal className="contact-form-wrap" delay={120}>
          <span className="contact-form-anchor" id="contact-form" aria-hidden="true" />
          <div className="contact-form-heading"><span aria-hidden="true"><ArrowUpRight size={20} strokeWidth={1.75} /></span><div><h3>{c.formTitle}</h3><p>{c.formNote}</p></div></div>
          {status === 'success' ? <div className="form-success" role="status"><Check size={24} /><p>{c.sent}</p><button type="button" onClick={() => setStatus('idle')}>{c.back}</button></div> : (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label><span>{t.contact.fields.name}</span><input name="name" required autoComplete="name" /></label>
                <label><span>{t.contact.fields.contact}</span><input name="contact" required autoComplete="email" /></label>
              </div>
              <div className="form-row">
                <label><span>{t.contact.fields.company} <i>({c.optional})</i></span><input name="company" autoComplete="organization" /></label>
                <label><span>{t.contact.fields.help}</span><select name="service" value={selectedService} onChange={(event) => setService(event.target.value)}><option value={serviceOptions.at(-1)}>{serviceOptions.at(-1)}</option>{serviceOptions.slice(0, -1).map((option) => <option key={option}>{option}</option>)}</select></label>
              </div>
              <label><span>{t.contact.fields.message}</span><textarea name="message" rows="4" placeholder={c.messageHint} required /></label>
              <input type="text" name="hp" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              {status === 'error' && <p className="form-error" role="alert">{c.error}</p>}
              <button className="form-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? c.sending : c.submit}<ArrowUpRight size={20} /></button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function DirectionHero({ direction, data, children, action }) {
  return (
    <section className={`direction-hero direction-${direction}`}>
      <div className="direction-grid" aria-hidden="true" />
      <div className="direction-orbit" aria-hidden="true"><i /><i /><i /></div>
      <div className="container direction-hero-inner">
        <Reveal className="direction-breadcrumb"><span>OSNOVA</span><ArrowRight />{data.label}</Reveal>
        <Reveal className="direction-title" delay={60}><h1>{data.title}<em>{data.titleAccent}</em></h1><p>{data.intro}</p>{action}</Reveal>
        <Reveal className="direction-visual" delay={140}>{children}</Reveal>
      </div>
      <div className="direction-scroll"><ArrowDown /> SCROLL / DECODE</div>
    </section>
  )
}

function AutomationHeroVisual({ label, flow }) {
  return (
    <div className="automation-hero-visual" aria-label={label}>
      {flow.map((item, index) => <span key={item} className={`ah-node ah-node-${index + 1}`}><i>0{index + 1}</i>{item}</span>)}
      <svg viewBox="0 0 650 330" aria-hidden="true"><path d="M80 70C180 70 165 165 325 165S470 75 570 75" /><path d="M80 260C180 260 180 165 325 165S470 260 570 260" /><circle cx="325" cy="165" r="5" /></svg>
      <div className="ah-core"><b>AI</b><small>{label}</small></div>
    </div>
  )
}

function VoiceOperator({ data }) {
  const [step, setStep] = useState(-1)
  const sequenceLength = Math.max(data.steps.length, data.mobileFlow?.length || 0)
  const running = step >= 0 && step < sequenceLength
  useEffect(() => {
    if (!running) return undefined
    const timer = window.setTimeout(() => setStep((value) => value + 1), 1100)
    return () => window.clearTimeout(timer)
  }, [running, step, sequenceLength])
  return (
    <section className="voice-product section-pad">
      <div className="container voice-product-grid">
        <Reveal className="voice-product-copy">
          <span className="eyebrow">{data.label}</span><h2>{data.title}</h2><p>{data.text}</p>
          <div className="capability-list">{data.capabilities.map((item) => <span key={item}><Check />{item}</span>)}</div>
          <small>{data.useCases}</small>
        </Reveal>
        <Reveal className="call-system" delay={100}>
          <div className="call-head"><span><i className={running ? 'live' : ''} />{data.incoming}</span><b>00:{String(Math.max(step + 1, 0) * 7).padStart(2, '0')}</b></div>
          <div className="call-intent" data-intent={data.intentLabel}>
            <span>{data.client}</span><p>{data.transcript[0]}</p>
            {step >= 1 && <div className="operator-reply"><span>{data.operator}</span><p>{data.transcript[Math.min(step, 2)]}</p></div>}
          </div>
          <div className="call-pipeline">
            {data.steps.map((item, index) => <div className={step === index ? 'active' : step > index ? 'passed' : ''} key={item}><span>0{index + 1}</span><strong>{item}</strong><i /></div>)}
          </div>
          <button onClick={() => setStep(0)} disabled={running}>{running ? <Pause /> : <Play fill="currentColor" />}{step >= sequenceLength ? data.replay : data.start}</button>
        </Reveal>
        <Reveal className="voice-mobile-story" delay={100}>
          <div className="voice-mobile-head"><span><i className={running ? 'live' : ''} />{data.incoming}</span><b>AI / LIVE SYSTEM</b></div>
          <div className="voice-mobile-flow">
            {(data.mobileFlow || data.steps).map((item, index) => (
              <div className={step === index ? 'active' : step > index ? 'passed' : ''} key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong><i />
              </div>
            ))}
          </div>
          <button onClick={() => setStep(0)} disabled={running}>{running ? <Pause /> : <Play fill="currentColor" />}{step >= sequenceLength ? data.replay : data.start}</button>
        </Reveal>
      </div>
    </section>
  )
}

function AssistantsSection({ data }) {
  return (
    <section className="assistant-system section-pad">
      <div className="container">
        <Reveal className="wide-heading"><span className="eyebrow">{data.label}</span><h2>{data.title}</h2><p>{data.text}</p></Reveal>
        <Reveal className="assistant-context-flow">
          {data.flow.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong>{index < data.flow.length - 1 && <ArrowRight />}</div>)}
        </Reveal>
        <div className="assistant-role-list">
          {data.roles.map(([title, text], index) => <Reveal key={title} delay={index * 55}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p><ArrowUpRight /></Reveal>)}
        </div>
      </div>
    </section>
  )
}

function CrmIntegrations({ crm, integrations }) {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!visible) return undefined
    const timer = window.setInterval(() => setActive((value) => (value + 1) % crm.stages.length), 1500)
    return () => window.clearInterval(timer)
  }, [visible, crm.stages.length])
  return (
    <>
      <section ref={sectionRef} className="crm-system section-pad">
        <div className="container crm-system-grid">
          <Reveal><span className="eyebrow light">{crm.label}</span><h2>{crm.title}</h2><p>{crm.text}</p><div className="crm-items">{crm.items.map((item) => <span key={item}><Check />{item}</span>)}</div></Reveal>
          <Reveal className="crm-sequence" delay={100}>
            <div className="crm-sequence-head"><span>LIVE / PIPELINE</span><i /></div>
            {crm.stages.map((item, index) => <button className={active === index ? 'active' : active > index ? 'passed' : ''} onClick={() => setActive(index)} key={item}><span>0{index + 1}</span><strong>{item}</strong><i /></button>)}
          </Reveal>
        </div>
      </section>
      <section className="integration-system section-pad">
        <div className="container integration-grid">
          <Reveal className="integration-copy"><span className="eyebrow">{integrations.label}</span><h2>{integrations.title}</h2></Reveal>
          <Reveal className="integration-field" delay={100}>
            <svg className="integration-lines-desktop" viewBox="0 0 760 520" aria-hidden="true">
              <path d="M90 90C250 90 220 260 380 260S520 95 675 95" /><path d="M85 425C220 425 240 260 380 260S540 425 680 425" />
              <path d="M180 25C200 160 310 145 380 260S470 390 560 500" /><circle cx="380" cy="260" r="7" />
            </svg>
            <svg className="integration-lines-mobile" viewBox="0 0 320 360" aria-hidden="true">
              <path d="M48 36C90 64 118 125 160 180" />
              <path d="M272 36C230 64 202 125 160 180" />
              <path d="M160 66V180" />
              <path d="M48 324C90 296 118 235 160 180" />
              <path d="M272 324C230 296 202 235 160 180" />
              <path d="M160 294V180" />
              <circle cx="160" cy="180" r="5" />
            </svg>
            <div className="integration-core">OS<span>CONTEXT</span></div>
            {integrations.nodes.map((node, index) => <span className={`integration-node in-${index + 1}`} key={node}><i />{node}</span>)}
          </Reveal>
        </div>
      </section>
    </>
  )
}

function CustomAutomation({ data }) {
  return (
    <section className="custom-automation section-pad">
      <div className="container">
        <Reveal className="custom-head"><span className="eyebrow light">{data.label}</span><h2>{data.title}</h2><p>{data.text}</p></Reveal>
        <div className="custom-path">{data.steps.map(([number, title], index) => <Reveal key={title} delay={index * 60}><span>{number}</span><strong>{title}</strong><i /></Reveal>)}</div>
      </div>
    </section>
  )
}

function DevelopmentCatalogue({ data }) {
  const [active, setActive] = useState(0)
  return (
    <section className="development-catalogue section-pad">
      <div className="container">
        <Reveal className="dev-principle"><span className="eyebrow">{data.label}</span><p>{data.principle}</p></Reveal>
        <div className="product-index">
          {data.products.map(([number, title, text, fit], index) => (
            <Reveal key={title} delay={index * 35}>
              <button className={active === index ? 'active' : ''} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}>
                <span>{number}</span><h2>{title}</h2><p>{text}</p><small>{fit}</small><ArrowUpRight />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function DevelopmentVisual({ labels }) {
  return (
    <div className="build-visual" aria-hidden="true">
      <div className="build-window"><span /><span /><span /><b>{labels[0]} / 01</b><i /><i /><i /></div>
      <div className="build-layer layer-one">{labels[1]}</div><div className="build-layer layer-two">{labels[2]}</div>
    </div>
  )
}

function DevelopmentQuoteLink({ t, lang, navigate, className = '' }) {
  const service = t.pricing.items[1]
  return <RouteLink className={className} href={`/${lang}/#contact-form`} navigate={navigate} onClick={() => {
    selectContactService(service)
    track('pricing_cta_click', { site_language: lang, service: serviceSlug(service, t.contact.options) })
  }} aria-label={`${t.pricing.action}: ${service}`}>{t.pricing.action}<ArrowUpRight size={18} /></RouteLink>
}

function LandingFeature({ data, t, lang, navigate }) {
  return (
    <section className="landing-feature-new section-pad">
      <div className="container landing-new-grid">
        <Reveal className="landing-art">
          <span>OS / WEB</span><h3>{data.art[0]}<br />{data.art[1]}<br /><em>{data.art[2]}</em></h3><div className="landing-cursor" /><div className="landing-grid-lines" />
        </Reveal>
        <Reveal className="landing-new-copy" delay={90}>
          <span className="eyebrow light">{data.label}</span><h2>{data.title}</h2><p>{data.text}</p>
          <div className="landing-offer-scope"><span>{data.scopeLabel}</span><p>{data.scope}</p><small>{data.team}</small></div>
          <DevelopmentQuoteLink className="button button-primary" t={t} lang={lang} navigate={navigate} />
        </Reveal>
      </div>
    </section>
  )
}

function BuildSequence({ data }) {
  return (
    <section className="build-sequence section-pad"><div className="container"><span className="eyebrow">{data.label}</span><div>{data.steps.map(([title, description], index) => <Reveal key={title} delay={index * 50}><i>0{index + 1}</i><strong>{title}</strong><p>{description}</p><span style={{ '--progress': `${(index + 1) * 25}%` }} /></Reveal>)}</div></div></section>
  )
}

function PerformanceHeroVisual({ axis }) {
  return (
    <div className="performance-hero-visual" aria-hidden="true">
      <div className="attention-field"><span /><span /><span /><span /><i /></div>
      <div className="conversion-axis"><span>{axis[0]}</span><i /><span>{axis[1]}</span><i /><span>{axis[2]}</span></div>
    </div>
  )
}

function ChannelExperience({ data }) {
  const [active, setActive] = useState(0)
  const channel = data.channels[active]
  return (
    <section className="channel-experience section-pad">
      <div className="container">
        <Reveal className="channel-experience-head"><span className="eyebrow">{data.selector}</span></Reveal>
        <Reveal className="channel-navigation">
          {data.channels.map((item, index) => <button className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={item.id}><span>0{index + 1}</span><BrandMark brand={item.id} /><strong>{item.name}</strong><i /></button>)}
        </Reveal>
        <div className={`brand-world brand-world-${channel.id}`} key={channel.id}>
          <div className="brand-composition">
            <div className="brand-grid" />
            <div className="brand-orbits"><span /><span /><span /><i /><i /></div>
            {channel.id === 'tiktok' && (
              <div className="rhythm-field">
                {Array.from({ length: 11 }, (_, index) => (
                  <i
                    key={index}
                    style={{
                      '--rhythm': index,
                      '--rhythm-height': `${38 + (index % 5) * 21}px`,
                      '--rhythm-y': `${(index % 3 - 1) * 20}px`,
                    }}
                  />
                ))}
              </div>
            )}
            {channel.id === 'google' && <div className="search-intents">{channel.examples.map((item) => <span key={item}>{item}</span>)}</div>}
            {channel.id === 'meta' && <div className="audience-network"><span /><span /><span />{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>}
            <div className="brand-object"><BrandMark brand={channel.id} /></div>
          </div>
          <div className="brand-copy">
            <span>{channel.label}</span><h2>{channel.verb}</h2><p>{channel.text}</p>
            <div className="channel-capabilities">
              <span>{data.capabilitiesLabel}</span>
              <div>
                {channel.items.map((item, index) => (
                  <span className="channel-capability" key={item}>
                    <i>{String(index + 1).padStart(2, '0')}</i><strong>{item}</strong><ArrowRight />
                  </span>
                ))}
              </div>
            </div>
            <div className={`channel-logic ${channel.formulaDescriptions ? 'is-story' : ''}`}>
              {channel.formula.map((item, index) => (
                <span key={item}>
                  <i>{String(index + 1).padStart(2, '0')}</i>
                  <strong>{item}</strong>
                  {channel.formulaDescriptions && <small>{channel.formulaDescriptions[index]}</small>}
                  {index < channel.formula.length - 1 && <ArrowRight />}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AnalyticsSystem({ data }) {
  return (
    <section className="analytics-system section-pad">
      <div className="container analytics-grid">
        <Reveal className="analytics-copy"><span className="eyebrow light">{data.label}</span><h2>{data.title}</h2><p>{data.text}</p><div>{data.items.map((item) => <span key={item}>{item}</span>)}</div></Reveal>
        <Reveal className="analytics-board" delay={100}>
          <div className="analytics-flow">{data.flow.map((item, index) => <span key={item} className={`af-${index + 1}`}><i>0{index + 1}</i>{item}</span>)}</div>
          <svg viewBox="0 0 680 450" aria-hidden="true"><path d="M75 90C230 90 185 225 340 225S490 90 610 90" /><path d="M75 360C220 360 200 225 340 225S490 360 610 360" /><circle cx="340" cy="225" r="5" /></svg>
          <div className="data-pulse" />
        </Reveal>
      </div>
    </section>
  )
}

function SearchJourneyVisual({ data }) {
  return (
    <div className="search-journey-visual" aria-label={`${data.heroLabel}: ${data.heroSteps.join(' — ')}`}>
      <div className="search-query-line"><span>⌕</span><b>{data.heroSteps[0]}</b><i /></div>
      <div className="search-result-stack" aria-hidden="true"><span /><span className="is-relevant"><i>01</i><b>{data.heroSteps[2]}</b></span><span /></div>
      <div className="search-route-line" aria-hidden="true">
        {data.heroSteps.map((item, index) => <span key={item}><i>{String(index + 1).padStart(2, '0')}</i><b>{item}</b></span>)}
      </div>
      <small>{data.heroLabel} / LIVE PATH</small>
    </div>
  )
}

function AiVisibilityVisual({ data }) {
  return (
    <div className="ai-visibility-visual" aria-label={`${data.heroLabel}: ${data.heroSteps.join(' — ')}`}>
      <div className="ai-question"><span>Q / 01</span><p>{data.question}</p><i /></div>
      <div className="ai-source-field" aria-hidden="true">
        <span className="source source-a">01</span><span className="source source-b">02</span><span className="source source-c">03</span>
        <div className="ai-core">AI<small>CONTEXT</small></div>
        <svg viewBox="0 0 620 280"><path d="M64 55C150 55 195 140 310 140S465 55 555 55" /><path d="M64 226C155 226 195 140 310 140S465 226 555 226" /><circle cx="310" cy="140" r="5" /></svg>
      </div>
      <div className="ai-answer-line"><i /><span>{data.heroSteps[3]}</span><b>{data.heroSteps[4]}</b></div>
    </div>
  )
}

function VisibilityDefinition({ data, tone = 'light' }) {
  return (
    <section className={`visibility-definition visibility-${tone} section-pad`}>
      <div className="container visibility-definition-grid">
        <Reveal><span className={`eyebrow ${tone === 'dark' ? 'light' : ''}`}>{data.label}</span><h2>{data.title}</h2></Reveal>
        <Reveal delay={90}><p>{data.text}</p><small><Asterisk />{data.note}</small></Reveal>
      </div>
    </section>
  )
}

function JourneySequence({ data, variant = 'seo' }) {
  return (
    <section className={`journey-sequence journey-${variant} section-pad`}>
      <div className="container">
        <Reveal className="journey-heading"><span className="eyebrow light">{data.label}</span><h2>{data.title}</h2></Reveal>
        <div className="journey-track">
          {data.steps.map(([number, title, text], index) => (
            <Reveal className="journey-step" key={title} delay={index * 55}>
              <span>{number}</span><i /><h3>{title}</h3><p>{text}</p>{index < data.steps.length - 1 && <ArrowRight />}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function VisibilityCapabilities({ data, variant = 'seo' }) {
  return (
    <section className={`visibility-capabilities capabilities-${variant} section-pad`}>
      <div className="container">
        <Reveal className="visibility-capabilities-head"><span className="eyebrow">{data.label}</span><h2>{data.title}</h2><p>{data.intro}</p></Reveal>
        <div className="visibility-capability-list">
          {data.items.map(([number, title, text], index) => (
            <Reveal key={title} delay={(index % 5) * 35}>
              <article><span>{number}</span><h3>{title}</h3><p>{text}</p><ArrowUpRight /></article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function VisibilityUseCases({ data, variant = 'seo' }) {
  return (
    <section className={`visibility-useful useful-${variant} section-pad`}>
      <div className="container visibility-useful-grid">
        <Reveal><span className="eyebrow light">{data.label}</span><h2>{data.title}</h2></Reveal>
        <div className="visibility-useful-list">
          {data.items.map((item, index) => <Reveal key={item} delay={index * 45}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p><Check /></Reveal>)}
        </div>
      </div>
    </section>
  )
}

function SearchShift({ data }) {
  return (
    <section className="search-shift section-pad">
      <div className="container">
        <Reveal className="search-shift-head"><span className="eyebrow">{data.label}</span><h2>{data.title}</h2><p>{data.text}</p></Reveal>
        <div className="search-shift-stage">
          {[data.before, data.now].map((item, index) => (
            <Reveal className={`search-era era-${index + 1}`} key={item.tag} delay={index * 90}>
              <span>{item.tag}</span><h3>{item.title}</h3><blockquote>{item.example}</blockquote><p>{item.result}</p>
              <div aria-hidden="true">{index === 0 ? <><i /><i /><i /></> : <><i /><i /><i /><i /><i /></>}</div>
            </Reveal>
          ))}
          <ArrowRight className="shift-arrow" />
        </div>
      </div>
    </section>
  )
}

function VisibilityComparison({ data, variant = 'seo' }) {
  const columns = [data.left, data.right]
  return (
    <section className={`visibility-comparison comparison-${variant} section-pad`}>
      <div className="container">
        <Reveal className="comparison-head"><span className="eyebrow">{data.label}</span><h2>{data.title}</h2><p>{data.intro}</p></Reveal>
        <div className="comparison-grid">
          {columns.map((column, index) => (
            <Reveal className={`comparison-column comparison-column-${index + 1}`} key={column.code} delay={index * 85}>
              <span>{column.code}</span><h3>{column.title}</h3><p>{column.text}</p>
              <div>{column.points.map((point, pointIndex) => <strong key={point}><i>0{pointIndex + 1}</i>{point}</strong>)}</div>
            </Reveal>
          ))}
        </div>
        <Reveal className="comparison-together"><Asterisk /><p>{data.together}</p></Reveal>
      </div>
    </section>
  )
}

function VisibilityProcess({ data, variant = 'seo' }) {
  return (
    <section className={`visibility-process process-${variant} section-pad`}>
      <div className="container">
        <Reveal className="visibility-process-head"><span className="eyebrow light">{data.label}</span><h2>{data.title}</h2></Reveal>
        <div className="visibility-process-grid">
          {data.steps.map(([number, title, text], index) => <Reveal key={title} delay={index * 55}><span>{number}</span><i /><h3>{title}</h3><p>{text}</p></Reveal>)}
        </div>
      </div>
    </section>
  )
}

function VisibilityCta({ data, lang, navigate, variant = 'seo', service }) {
  return (
    <section className={`visibility-cta cta-${variant}`}>
      <div className="container visibility-cta-grid">
        <Reveal><span className="eyebrow light">{data.label}</span><h2>{data.title}</h2></Reveal>
        <Reveal delay={90}><p>{data.text}</p><RouteLink className="button button-primary" href={`/${lang}/#contact`} navigate={navigate} onClick={() => {
          if (service) sessionStorage.setItem('osnova:contact-service', service)
        }}>{data.button}<ArrowUpRight /></RouteLink></Reveal>
      </div>
    </section>
  )
}

function DirectionFooter({ s, lang, current, navigate }) {
  const index = serviceRoutes.indexOf(current)
  const next = serviceRoutes[(index + 1) % serviceRoutes.length]
  const direction = s.directions.find((item) => item.id === next)
  return (
    <section className={`next-direction next-${next}`}>
      <RouteLink href={`/${lang}/services/${next}`} navigate={navigate} world={next}>
        <span>{s.common.next} / {direction.number}</span><h2>{direction.name}</h2><p>{direction.statement}</p><ArrowUpRight />
      </RouteLink>
    </section>
  )
}

function Footer({ t, s, p, lang, navigate }) {
  return (
    <footer>
      <div className="footer-marquee"><span>{s.common.system.join(' · ')} <Asterisk /> {s.common.system.join(' · ')}</span></div>
      <div className="container footer-bottom">
        <RouteLink className="brand footer-brand" href={`/${lang}/`} navigate={navigate}><span className="brand-mark">O</span><span>OSNOVA</span></RouteLink>
        <p>{t.footer.rights}</p>
        <div className="footer-links">
          <RouteLink href={`/${lang}/services`} navigate={navigate}>{s.common.services}<ArrowUpRight size={14} /></RouteLink>
          <RouteLink href={`/${lang}/payment`} navigate={navigate}>{p.navLabel}<ArrowUpRight size={14} /></RouteLink>
        </div>
      </div>
    </footer>
  )
}

function CommercialOffers({ lang, navigate, asTitle = false }) {
  const data = commercialContent[lang].offers
  const Heading = asTitle ? 'h1' : 'h2'
  return <section className="commercial-section commercial-offers" id="pricing"><div className="container">
    <Reveal className="commercial-offers-head"><span className="eyebrow">{data.label}</span><Heading>{data.title}</Heading><p className="commercial-lead">{data.note}</p></Reveal>
    <div className="commercial-card-grid">{data.items.map((item, index) => <Reveal as="article" className="commercial-card" key={item.title} delay={index * 70}><span className="commercial-number">0{index + 1} / {index < 2 ? 'DEVELOPMENT' : 'AUTOMATION'}</span><div className="commercial-price">{item.price}</div><h3>{item.title}</h3><p>{item.text}</p><RouteLink href={`/${lang}/services/${item.route}`} navigate={navigate} world={item.route}>{item.cta}<ArrowUpRight size={17} /></RouteLink></Reveal>)}</div>
  </div></section>
}

function WorkCard({ item, lang, navigate }) {
  return <RouteLink className="home-work-card" href={`/${lang}/cases/${item.slug}`} navigate={navigate} world={item.serviceCase || 'automation'}>
    <CaseVisual item={item} />
    <div className="home-work-copy"><small>{item.recovery ? caseUi[lang].restored : item.webCase?.delivery || item.categoryLabel}</small><h3>{item.title}</h3><p>{item.summary}</p><span>{caseUi[lang].openCase}<ArrowUpRight size={20} /></span></div>
  </RouteLink>
}

function MoreWorkCard({ item, lang, navigate }) {
  return <RouteLink className="home-more-card" href={`/${lang}/cases/${item.slug}`} navigate={navigate} world="development">
    <div className="home-more-shot" style={{ '--project-accent': item.accent }}><img src={item.desktop} alt="" width="1440" height="960" loading="lazy" draggable="false" /></div>
    <div><small>{item.categoryLabel}</small><h3>{item.title}</h3></div>
    <ArrowUpRight size={18} aria-hidden="true" />
  </RouteLink>
}

function CommercialWebCases({ lang, navigate }) {
  const data = commercialContent[lang].web
  const web = getLocalizedCases(lang).filter(item => item.category === 'development')
  const featured = web.filter(item => item.serviceCase === 'development').slice(0, 3)
  const more = web.filter(item => !featured.includes(item))
  return <section className="commercial-section commercial-cases" id="cases"><div className="container"><Reveal className="home-work-head"><span className="eyebrow light">{data.label}</span><h2>{data.title}</h2><span className="home-work-count">{String(web.length).padStart(2, '0')} / WEB</span></Reveal><div className="home-work-grid">{featured.map(item => <WorkCard key={item.slug} item={item} lang={lang} navigate={navigate} />)}</div>{more.length > 0 && <div className="home-more-work"><span className="home-more-label">{designContent[lang].moreWork}</span><div className="home-more-grid">{more.map(item => <MoreWorkCard key={item.slug} item={item} lang={lang} navigate={navigate} />)}</div></div>}<RouteLink className="commercial-text-link" href={`/${lang}/cases`} navigate={navigate}>{data.cta}<ArrowRight size={17} /></RouteLink></div></section>
}

function CommercialProcess({ lang }) {
  const data = commercialContent[lang].process
  return <section className="commercial-section commercial-process" id="process"><div className="container"><Reveal><span className="eyebrow">{data.label}</span><h2>{data.title}</h2></Reveal><ol>{data.steps.map((step, index) => <Reveal as="li" key={step} delay={(index % 4) * 45}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></Reveal>)}</ol></div></section>
}

const automationUseCaseIcons = [Bot, Cable, Radar, Sparkles, AudioLines, Workflow]

function CommercialBridge({ lang, navigate }) {
  const d = designContent[lang]
  const c = commercialContent[lang]
  const managed = c.automation.managed.rows[0]
  return <section className="commercial-section commercial-bridge" id="automation"><div className="container">
    <div className="automation-heading"><Reveal><span className="eyebrow light">02 / AUTOMATION</span><h2>{d.automationTitle}</h2></Reveal><Reveal><p>{d.automationText}</p><RouteLink className="button button-primary" href={`/${lang}/#contact-form`} navigate={navigate} onClick={() => selectContactService(content[lang].contact.options[0])}>{c.custom.cta}<ArrowUpRight size={18} /></RouteLink></Reveal></div>
    <Reveal className="automation-circuit"><div className="circuit-stamp" aria-hidden="true">OS<span> / AUTOMATION</span></div><ol>{d.flow.map((label, i) => <li key={label}><span className="circuit-node">0{i + 1}</span><div><h3>{label}</h3><p>{d.flowDetail[i]}</p></div>{i < 2 && <ArrowRight className="circuit-arrow" aria-hidden="true" />}</li>)}</ol>
      <div className="automation-usecases"><span className="automation-usecases-label">{d.useCasesLabel}</span><ul>{d.useCases.map(([title, text], i) => { const Icon = automationUseCaseIcons[i]; return <li key={title}><Icon size={22} strokeWidth={1.5} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></li> })}</ul></div>
    </Reveal>
    <div className="automation-entry-prices">{c.automation.items.slice(0, 3).map(([title, price]) => <RouteLink key={title} href={`/${lang}/services/automation#products`} navigate={navigate} world="automation"><span>{title}</span><strong>{price}</strong><ArrowUpRight size={18} /></RouteLink>)}</div>
    <RouteLink className="automation-managed" href={`/${lang}/services/automation#managed`} navigate={navigate} world="automation"><ServerCog size={22} strokeWidth={1.5} aria-hidden="true" /><span><b>Managed Automation</b><small>{d.managed}</small></span><strong>{managed[1]}</strong><ArrowUpRight size={18} aria-hidden="true" /></RouteLink>
    <RouteLink className="commercial-text-link" href={`/${lang}/services/automation`} navigate={navigate} world="automation">{d.automationMore}<ArrowRight size={18} /></RouteLink>
  </div></section>
}

function CommercialAutomationCases({ lang, navigate }) {
  const work = automationWorkLabels[lang]
  const related = getLocalizedCases(lang).filter(item => ['ai-news-automation', 'retail-stock-monitor'].includes(item.slug))
  return <section className="commercial-section commercial-cases commercial-automation-cases"><div className="container"><Reveal><span className="eyebrow light">{work.label}</span><h2>{work.title}</h2></Reveal><div className="home-work-grid automation-work-grid">{related.map(item => <WorkCard key={item.slug} item={item} lang={lang} navigate={navigate} />)}</div></div></section>
}

function CommercialTrust({ lang }) {
  const data = commercialContent[lang].trust
  return <section className="commercial-section commercial-trust" id="about"><div className="container"><Reveal><span className="eyebrow">{data.label}</span><h2>{data.title}</h2><p className="commercial-lead">{designContent[lang].about}</p></Reveal><div className="commercial-trust-grid">{data.items.map((item, index) => <Reveal key={item} as="p" delay={index * 50}><Check size={20} /><span>{item}</span></Reveal>)}</div><p className="commercial-footnote">{data.note}</p></div></section>
}

function CommercialCustom({ lang, navigate }) {
  const data = commercialContent[lang].custom
  return <section className="commercial-section commercial-custom"><div className="container"><Reveal><h2>{data.title}</h2><p>{data.text}</p><RouteLink className="button button-primary" href={`/${lang}/#contact-form`} navigate={navigate} onClick={() => selectContactService('')}>{data.cta}<ArrowUpRight size={18} /></RouteLink></Reveal></div></section>
}

const specialistSlugs = ['seo', 'performance', 'ai-visibility', 'email-deliverability']
const specialistCodes = { seo: 'SEO', performance: 'PERFORMANCE', 'ai-visibility': 'AI VISIBILITY', 'email-deliverability': 'EMAIL' }

function CommercialSecondary({ s, lang, navigate }) {
  const data = commercialContent[lang].secondary
  const d = designContent[lang]
  return <section className="commercial-secondary" id="specializations"><div className="container"><Reveal className="specialist-head"><div><span className="eyebrow">03–06 / {data.label}</span><h2>{d.specializationTitle}</h2></div><p>{d.specializationLead}</p></Reveal><div className="specialist-grid">{specialistSlugs.map((slug, i) => {
    const direction = s.directions.find(item => item.id === slug)
    return <RouteLink className={`specialist-card specialist-${slug}`} key={slug} href={`/${lang}/services/${slug}`} navigate={navigate} world={slug}><div className="specialist-art" aria-hidden="true"><span>0{i + 3} / {specialistCodes[slug]}</span><div><i /><i /><i /><i /></div></div><h3>{direction.name}</h3><p>{d.services[i]}</p><ul className="specialist-tags">{direction.items.slice(0, 3).map(item => <li key={item}>{item}</li>)}</ul><span className="specialist-link">{d.explore}<ArrowUpRight size={19} /></span></RouteLink>
  })}</div></div></section>
}

function HomePage({ t, s, p, lang, navigate }) {
  return <><HomeHero t={t} s={s} lang={lang} navigate={navigate} /><CommercialOffers lang={lang} navigate={navigate} /><CommercialWebCases lang={lang} navigate={navigate} /><CommercialBridge lang={lang} navigate={navigate} /><CommercialAutomationCases lang={lang} navigate={navigate} /><CommercialSecondary s={s} lang={lang} navigate={navigate} /><CommercialProcess lang={lang} /><CommercialTrust lang={lang} /><CommercialCustom lang={lang} navigate={navigate} /><Contact t={t} p={p} lang={lang} navigate={navigate} /></>
}

function ServicesPage({ s, lang, navigate }) {
  return <main className="services-page"><CommercialOffers lang={lang} navigate={navigate} asTitle /><CommercialBridge lang={lang} navigate={navigate} /><CommercialSecondary s={s} lang={lang} navigate={navigate} /></main>
}

const automationWorkLabels = {
  ru: { label: 'РЕАЛЬНЫЕ СИСТЕМЫ', title: 'Автоматизация в работе', open: 'Смотреть кейс' },
  en: { label: 'REAL SYSTEMS', title: 'Automation in practice', open: 'View case' },
  de: { label: 'REALE SYSTEME', title: 'Automatisierung in der Praxis', open: 'Projekt ansehen' },
  uk: { label: 'РЕАЛЬНІ СИСТЕМИ', title: 'Автоматизація в роботі', open: 'Дивитися кейс' },
}

function DevelopmentHandoff({ data }) {
  return (
    <section className="development-handoff section-pad" aria-labelledby="development-handoff-title">
      <div className="container">
        <Reveal className="development-handoff-head"><span className="eyebrow">{data.label}</span><h2 id="development-handoff-title">{data.title}</h2></Reveal>
        <div className="development-handoff-grid">
          {data.items.map(([title, description], index) => <Reveal className="development-handoff-item" key={title} delay={index * 50}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></Reveal>)}
        </div>
      </div>
    </section>
  )
}

const developmentWorkLabels = {
  ru: { label: 'WEB-КЕЙСЫ', title: 'Разработка в работе', open: 'Смотреть кейс' },
  en: { label: 'WEB CASES', title: 'Development in practice', open: 'View case' },
  de: { label: 'WEB-PROJEKTE', title: 'Entwicklung in der Praxis', open: 'Projekt ansehen' },
  uk: { label: 'WEB-КЕЙСИ', title: 'Розробка в роботі', open: 'Дивитися кейс' },
}

function CommercialDevelopmentProducts({ lang }) {
  const data = commercialContent[lang].development
  return <section className="commercial-section commercial-product-section" id="packages"><div className="container"><Reveal><span className="eyebrow">{data.label}</span><h2>{data.title}</h2></Reveal><div className="commercial-card-grid two-col">{data.items.map((item, index) => <Reveal className="commercial-card" as="article" key={item.title} delay={index * 70}><div className="commercial-price">{item.price}</div><h3>{item.title}</h3><strong className="commercial-time">{item.time}</strong><ul>{item.details.map(detail => <li key={detail}><Check size={16} />{detail}</li>)}</ul></Reveal>)}</div><p className="commercial-scope-note">{data.scope}</p><p className="commercial-scope-note">{data.launch}</p></div></section>
}

function CommercialAutomationProducts({ lang, navigate }) {
  const data = commercialContent[lang].automation
  return <><section className="commercial-section commercial-product-section" id="products"><div className="container"><Reveal><span className="eyebrow">{data.label}</span><h2>{data.title}</h2><p className="commercial-lead">{data.intro}</p></Reveal><div className="commercial-card-grid">{data.items.map(([title, price, detail], index) => <Reveal className="commercial-card" as="article" key={title} delay={(index % 3) * 60}><span className="commercial-number">{String(index + 1).padStart(2, '0')}</span><div className="commercial-price">{price}</div><h3>{title}</h3><p>{detail}</p></Reveal>)}</div><p className="commercial-scope-note">{data.terms}</p></div></section><section className="commercial-section commercial-managed" id="managed"><div className="container"><Reveal><span className="eyebrow">MANAGED AUTOMATION</span><h2>{data.managed.title}</h2></Reveal><div className="commercial-managed-grid">{data.managed.rows.map(([title, price, detail]) => <Reveal className="commercial-managed-row" key={title}><h3>{title}</h3><strong>{price}</strong><p>{detail}</p></Reveal>)}</div><p className="commercial-footnote">{data.managed.note}</p></div></section><CommercialProcess lang={lang} /><CommercialCustom lang={lang} navigate={navigate} /></>
}

function AutomationPage({ s, lang, navigate }) {
  const data = s.automation
  const commercial = commercialContent[lang].automation
  const work = automationWorkLabels[lang]
  const related = getLocalizedCases(lang).filter(item => ['ai-voice-operator', 'ai-news-automation', 'retail-stock-monitor'].includes(item.slug))
  return (
    <main className="direction-page automation-page">
      <DirectionHero direction="automation" data={{ ...data, title: commercial.title, titleAccent: '', intro: commercial.intro }}><AutomationHeroVisual label={data.signal} flow={data.heroFlow} /></DirectionHero>
      <CommercialAutomationProducts lang={lang} navigate={navigate} />
      <section className="service-related section-pad" aria-label={work.label}>
        <div className="container"><span className="eyebrow light">{work.label}</span><h2>{work.title}</h2>
          <div className="home-work-grid service-work-grid automation-work-grid automation-work-grid-three">{related.map(item => <WorkCard key={item.slug} item={item} lang={lang} navigate={navigate} />)}</div>
        </div>
      </section>
      <DirectionFooter s={s} lang={lang} current="automation" navigate={navigate} />
    </main>
  )
}

function CryptoMark({ currency }) {
  if (currency === 'USDT') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="32" fill="#26A17B" />
        <path fill="#fff" d="M35.7 34.8v-.1c-.2 0-1.5.1-4.5.1-2.4 0-4.1-.1-4.7-.1v.1c-9.2-.4-16-2-16-3.9s6.8-3.5 16-3.9v6.1c.6 0 2.4.1 4.7.1 2.8 0 4.2-.1 4.5-.1V27c9.2.4 16 2 16 3.9s-6.8 3.5-16 3.9Zm0-8.4V21h12.8v-8.2H13.8V21h12.8v5.4c-10.4.5-18.2 2.6-18.2 5.1s7.8 4.6 18.2 5.1V53h9.1V36.6c10.4-.5 18.2-2.6 18.2-5.1s-7.8-4.6-18.2-5.1Z" />
      </svg>
    )
  }
  if (currency === 'BTC') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="32" fill="#F7931A" />
        <path fill="#fff" d="M46.1 27.6c1-6.8-4.1-10.4-11.1-12.8l2.3-8.9-5.5-1.4-2.2 8.7-4.4-1.1 2.2-8.7L22 2.1l-2.3 9c-1.2-.3-2.3-.6-3.4-.8l-7.5-1.9-1.5 5.9s4 .9 4 1c2.2.6 2.6 2 2.5 3.3l-2.6 10.2.6.2-.6-.2-3.6 14.3c-.3.7-1 1.7-2.5 1.4l-4-1-2.7 6.2 7.1 1.8 4 1-2.3 9.1 5.5 1.4 2.2-9c1.5.4 3 .8 4.4 1.1l-2.3 8.9 5.5 1.4 2.3-9.1c9.3 1.8 16.2 1.1 19.1-7.3 2.4-6.7-.1-10.6-5-13.1 3.6-.8 6.3-3.2 7.1-8.2ZM33.4 44.5c-1.7 6.7-13.1 3.1-16.8 2.2l3-12c3.7.9 15.5 2.8 13.8 9.8Zm1.7-17.6c-1.5 6.1-11 3-14.1 2.2l2.7-10.8c3.1.8 12.9 2.3 11.4 8.6Z" transform="scale(.8) translate(9 6)" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="#F4F4F7" />
      <path fill="#627EEA" d="m32 5-1.7 5.8v29.7L32 42l13.8-8.1L32 5Z" />
      <path fill="#8998F6" d="m32 5-13.8 28.9L32 42V5Z" />
      <path fill="#454A75" d="m32 44.6-1 1.2v10.6L32 59l13.8-19.4L32 47.8v-3.2Z" />
      <path fill="#8A92B2" d="M32 59V47.8l-13.8-8.2L32 59Z" />
      <path fill="#454A75" d="M32 42V28.9l13.8 5L32 42Z" />
      <path fill="#C1CCF7" d="m18.2 33.9 13.8-5V42l-13.8-8.1Z" />
    </svg>
  )
}

function PaymentPage({ p }) {
  const currencies = [['USDT', 'Tether'], ['BTC', 'Bitcoin'], ['ETH', 'Ethereum']]
  return (
    <main className="payment-page" id="top">
      <section className="payment-hero">
        <div className="container payment-hero-grid">
          <Reveal className="payment-heading">
            <span className="eyebrow light"><i />{p.eyebrow}</span>
            <h1>{p.title}<em>{p.accent}</em></h1>
          </Reveal>
          <Reveal className="payment-intro" delay={90}>
            <p>{p.intro}</p>
            <div className="payment-rail" aria-label={p.accepted}>
              <span>Bank</span><i /><span>IBAN</span><i /><span>USDT · BTC · ETH</span>
            </div>
          </Reveal>
        </div>
        <div className="payment-orbit" aria-hidden="true"><i /><i /><b>03</b></div>
      </section>

      <section className="payment-methods" aria-label={p.accepted}>
        <div className="container">
          {p.methods.map((method, index) => (
            <Reveal as="article" className={`payment-method${index === 2 ? ' is-crypto' : ''}`} key={method.number}>
              <div className="payment-method-index"><span>{method.number}</span><i /></div>
              <div className="payment-method-copy"><small>{method.label}</small><h2>{method.title}</h2><p>{method.text}</p></div>
              <div className="payment-method-detail">
                {index === 2 && <div className="crypto-assets">{currencies.map(([code, name]) => <div className="crypto-asset" key={code}><CryptoMark currency={code} /><span><strong>{code}</strong><small>{name}</small></span></div>)}</div>}
                <div className="payment-detail-slot"><span>{method.detailLabel}</span><strong>{method.detail}</strong></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}

function DevelopmentPage({ s, t, lang, navigate }) {
  const data = s.development
  const commercial = commercialContent[lang].development
  const work = developmentWorkLabels[lang]
  const related = getLocalizedCases(lang).filter(item => item.serviceCase === 'development')
  return (
    <main className="direction-page development-page">
      <DirectionHero direction="development" data={{ ...data, title: commercial.title, titleAccent: '', intro: commercial.scope }} action={<DevelopmentQuoteLink className="button button-primary development-hero-cta" t={t} lang={lang} navigate={navigate} />}><DevelopmentVisual labels={data.visual} /></DirectionHero>
      <CommercialDevelopmentProducts lang={lang} /><CommercialProcess lang={lang} /><CommercialTrust lang={lang} />
      <section className="service-related section-pad" aria-label={work.label}>
        <div className="container"><span className="eyebrow light">{work.label}</span><h2>{work.title}</h2>
          <div className="home-work-grid service-work-grid">{related.map(item => <WorkCard key={item.slug} item={item} lang={lang} navigate={navigate} />)}</div>
          <div className="development-proof-cta"><DevelopmentQuoteLink className="button button-primary" t={t} lang={lang} navigate={navigate} /></div>
        </div>
      </section>
      <DirectionFooter s={s} lang={lang} current="development" navigate={navigate} />
    </main>
  )
}

function PerformancePage({ s, lang, navigate }) {
  const data = s.performance
  return (
    <main className="direction-page performance-page">
      <DirectionHero direction="performance" data={data}><PerformanceHeroVisual axis={data.axis} /></DirectionHero>
      <ChannelExperience data={data} /><AnalyticsSystem data={data.analytics} />
      <DirectionFooter s={s} lang={lang} current="performance" navigate={navigate} />
    </main>
  )
}

function SeoPage({ s, lang, navigate }) {
  const data = s.seo
  return (
    <main className="direction-page seo-page">
      <DirectionHero direction="seo" data={data}><SearchJourneyVisual data={data} /></DirectionHero>
      <JourneySequence data={data.journey} />
      <VisibilityCapabilities data={data.deliverables} />
      <VisibilityComparison data={data.comparison} />
      <VisibilityProcess data={data.process} />
      <VisibilityCta data={data.cta} lang={lang} navigate={navigate} />
      <DirectionFooter s={s} lang={lang} current="seo" navigate={navigate} />
    </main>
  )
}

function AiVisibilityPage({ s, lang, navigate }) {
  const data = s.aiVisibility
  return (
    <main className="direction-page ai-visibility-page">
      <DirectionHero direction="ai-visibility" data={data}><AiVisibilityVisual data={data} /></DirectionHero>
      <SearchShift data={data.shift} />
      <VisibilityCapabilities data={data.deliverables} variant="ai" />
      <VisibilityComparison data={data.comparison} variant="ai" />
      <VisibilityProcess data={data.process} variant="ai" />
      <VisibilityCta data={data.cta} lang={lang} navigate={navigate} variant="ai" />
      <DirectionFooter s={s} lang={lang} current="ai-visibility" navigate={navigate} />
    </main>
  )
}

function EmailDeliverabilityPage({ s, lang, navigate }) {
  const data = s.email
  const direction = s.directions.find(item => item.id === 'email-deliverability')
  return (
    <main className="direction-page email-page">
      <DirectionHero direction="email-deliverability" data={data}>
        <div className="email-journey">
          <div className="email-journey-label"><MailCheck size={24} aria-hidden="true" /><span>{data.visual.label}</span></div>
          <ol>{data.visual.steps.map((step, index) => <li key={step}><span aria-hidden="true">0{index + 1}</span><strong>{step}</strong>{index === 3 && <MailCheck size={23} aria-hidden="true" />}</li>)}</ol>
          <p>{data.visual.note}</p>
        </div>
      </DirectionHero>
      <section className="email-situations section-pad">
        <div className="container">
          <Reveal className="email-section-heading"><span className="eyebrow">{data.situations.label}</span><h2>{data.situations.title}</h2><p>{data.situations.intro}</p></Reveal>
          <div className="email-situation-list">{data.situations.items.map(([title, text], index) => <Reveal as="article" key={title}><span aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{text}</p></Reveal>)}</div>
          <Reveal className="email-scope"><h3>{data.scopeTitle}</h3><ul>{direction.items.map(item => <li key={item}><Check size={17} aria-hidden="true" /><span>{item}</span></li>)}</ul></Reveal>
        </div>
      </section>
      <VisibilityCapabilities data={data.deliverables} variant="email" />
      <VisibilityProcess data={data.process} variant="email" />
      <section className="email-outcome section-pad">
        <div className="container email-outcome-layout">
          <Reveal className="email-section-heading"><span className="eyebrow">{data.outcome.label}</span><h2>{data.outcome.title}</h2></Reveal>
          <Reveal><ul>{data.outcome.items.map(item => <li key={item}><Check size={20} aria-hidden="true" /><span>{item}</span></li>)}</ul><p className="email-outcome-note">{data.outcome.note}</p></Reveal>
        </div>
      </section>
      <VisibilityCta data={data.cta} lang={lang} navigate={navigate} variant="email" service="Email Deliverability" />
      <DirectionFooter s={s} lang={lang} current="email-deliverability" navigate={navigate} />
    </main>
  )
}

function NotFoundPage({ t, lang, navigate }) {
  const data = t.notFound
  return (
    <main className="not-found-page" id="top">
      <div className="container not-found-layout">
        <Reveal className="not-found-copy">
          <span className="eyebrow">{data.label}</span>
          <h1>{data.title}<em>{data.accent}</em></h1>
          <p>{data.text}</p>
          <div className="not-found-actions">
            <RouteLink className="button button-primary" href={`/${lang}/`} navigate={navigate}>{data.primary}<ArrowUpRight size={18} /></RouteLink>
            <RouteLink className="button button-ghost" href={`/${lang}/services`} navigate={navigate}>{data.secondary}<ArrowRight size={18} /></RouteLink>
          </div>
        </Reveal>
      </div>
    </main>
  )
}

const servicePages = {
  automation: AutomationPage,
  development: DevelopmentPage,
  performance: PerformancePage,
  seo: SeoPage,
  'ai-visibility': AiVisibilityPage,
  'email-deliverability': EmailDeliverabilityPage,
}

function PageTransition({ state }) {
  return (
    <div className={`page-transition transition-${state.world} ${state.phase ? `is-${state.phase}` : ''}`} aria-hidden="true">
      <div className="transition-lines" /><span>OSNOVA / {state.world?.toUpperCase()}</span><i /><i /><i />
    </div>
  )
}

export default function App() {
  const [lang, setLangState] = useState(getInitialLanguage)
  const [location, setLocation] = useState(parseLocation)
  const [transition, setTransition] = useState({ phase: '', world: 'neutral' })
  const t = useMemo(() => content[lang], [lang])
  const s = useMemo(() => extendServiceContent(serviceContent[lang], lang), [lang])
  const p = useMemo(() => paymentContent[lang], [lang])
  const resolved = useMemo(() => resolveRoute(location.route, lang), [location.route, lang])

  const navigate = (href, world = 'neutral', replace = false) => {
    const target = new URL(href, window.location.origin)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (target.pathname === window.location.pathname && target.hash === window.location.hash) {
      document.querySelector(target.hash || '#top')?.scrollIntoView({ block: 'start' })
      return
    }
    setTransition({ phase: 'cover', world })
    window.setTimeout(() => {
      window.history[replace ? 'replaceState' : 'pushState']({}, '', `${target.pathname}${target.hash}`)
      setLocation(parseLocation())
      window.scrollTo(0, 0)
      window.setTimeout(() => {
        if (target.hash) document.querySelector(target.hash)?.scrollIntoView({ block: 'start' })
        setTransition({ phase: 'reveal', world })
        window.setTimeout(() => setTransition({ phase: '', world }), reducedMotion ? 0 : 720)
      }, 40)
    }, reducedMotion ? 0 : 520)
  }

  const setLang = (nextLang) => {
    const currentRoute = location.route ? `/${location.route}` : '/'
    setLangState(nextLang)
    localStorage.setItem('osnova-language', nextLang)
    navigate(`/${nextLang}${currentRoute}${location.hash}`, 'neutral', true)
  }

  // A prerendered document paints its real content immediately, thanks to an
  // inline style override. Before dropping that override, mark everything
  // currently on screen as revealed, so visible content stays visible while
  // anything further down keeps its normal entrance animation.
  useEffect(() => {
    const override = document.getElementById('prerender-reveal')
    if (!override) return
    const frame = requestAnimationFrame(() => {
      const visible = []
      for (const node of document.querySelectorAll('.reveal')) {
        const box = node.getBoundingClientRect()
        if (box.top < window.innerHeight && box.bottom > 0) visible.push(node)
      }
      for (const node of visible) node.classList.add('is-visible')
      override.remove()
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => { initAnalytics() }, [])

  useEffect(() => {
    const onPopState = () => {
      const next = parseLocation()
      if (next.lang) setLangState(next.lang)
      setLocation(next)
      window.scrollTo(0, 0)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (!location.lang) {
      window.history.replaceState({}, '', `/${lang}/${location.route}${location.hash}`)
      setLocation(parseLocation())
      return
    }
    document.documentElement.lang = lang
    localStorage.setItem('osnova-language', lang)

    const isNotFound = resolved.kind === 'notFound'
    const caseItem = resolved.kind === 'case' ? resolved.item : null
    const isDraft = caseItem?.status === 'draft'
    const meta = isNotFound
      ? t.notFound.meta
      : resolved.kind === 'payment'
      ? [p.metaTitle, p.metaDescription]
      : resolved.kind === 'cases'
      ? [`${caseUi[lang].pageTitle} — OSNOVA`, caseUi[lang].pageIntro]
      : caseItem
        ? [`${caseItem.title} — OSNOVA`, caseItem.summary]
        : resolved.kind === 'services'
          ? [`${commercialContent[lang].offers.title} — OSNOVA`, commercialContent[lang].offers.note]
          : resolved.kind === 'service'
            ? commercialContent[lang].meta[resolved.id] || s.meta[resolved.id]
            : commercialContent[lang].meta.home

    const origin = window.location.origin
    const pathFor = (code) => (location.route ? `/${code}/${location.route}` : `/${code}/`)
    const absoluteUrl = new URL(isNotFound ? `/${lang}/` : pathFor(lang), origin).href

    document.title = meta[0]
    setMetaTag('name', 'description', meta[1])
    setMetaTag('name', 'robots', isNotFound || isDraft ? 'noindex, follow' : 'index, follow')
    setMetaTag('property', 'og:title', meta[0])
    setMetaTag('property', 'og:description', meta[1])
    setMetaTag('property', 'og:type', caseItem ? 'article' : 'website')
    setMetaTag('property', 'og:url', absoluteUrl)
    setMetaTag('property', 'og:locale', languages[lang].locale.replace('-', '_'))
    setMetaTag('property', 'og:image', new URL('/assets/system-convergence.jpg', origin).href)

    // A 404 is a variant of no real page: it carries neither a canonical nor
    // language alternates.
    if (isNotFound) {
      for (const node of document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]')) node.remove()
    } else {
      setLinkTag('canonical', null, absoluteUrl)
      for (const code of languageCodes) setLinkTag('alternate', code, new URL(pathFor(code), origin).href)
      setLinkTag('alternate', 'x-default', new URL(pathFor(defaultLanguage), origin).href)
    }
  }, [lang, location, p, resolved, s, t])

  // One page_view per resolved route. Declared after the metadata effect so
  // document.title is already the new page's title when this runs.
  useEffect(() => {
    if (!location.lang) return
    trackPageView({ language: lang, contentGroup: resolved.kind })
  }, [lang, location.lang, location.route, resolved.kind])

  let page
  if (resolved.kind === 'services') page = <ServicesPage s={s} lang={lang} navigate={navigate} />
  else if (resolved.kind === 'service') {
    const ServicePage = servicePages[resolved.id]
    page = <ServicePage s={s} t={t} lang={lang} navigate={navigate} />
  }
  else if (resolved.kind === 'payment') page = <PaymentPage p={p} />
  else if (resolved.kind === 'cases') page = <CasesArchive lang={lang} navigate={navigate} />
  else if (resolved.kind === 'case') page = <PortfolioDetail key={resolved.item.slug} item={resolved.item} lang={lang} navigate={navigate} Link={RouteLink} />
  else if (resolved.kind === 'notFound') page = <NotFoundPage t={t} lang={lang} navigate={navigate} />
  else page = <HomePage t={t} s={s} p={p} lang={lang} navigate={navigate} />

  return (
    <>
      <Header t={t} s={s} lang={lang} route={location.route} setLang={setLang} navigate={navigate} />
      {page}
      <Footer t={t} s={s} p={p} lang={lang} navigate={navigate} />
      <PageTransition state={transition} />
      <ConsentBanner lang={lang} />
    </>
  )
}
