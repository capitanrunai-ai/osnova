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
  Pause,
  Play,
  Send,
  X,
} from 'lucide-react'
import { content, languages } from './data/content'
import { caseCategories, caseUi, getLocalizedCases } from './data/cases'
import { serviceContent } from './data/serviceContent'
import './services.css'
import './cases.css'

const languageCodes = Object.keys(languages)
const serviceRoutes = ['automation', 'development', 'performance']

function parseLocation() {
  const parts = window.location.pathname.split('/').filter(Boolean)
  const lang = languageCodes.includes(parts[0]) ? parts[0] : null
  const route = parts.slice(lang ? 1 : 0).join('/')
  return { lang, route, hash: window.location.hash }
}

function getInitialLanguage() {
  const { lang } = parseLocation()
  if (lang) return lang
  const saved = localStorage.getItem('osnova-language')
  if (languageCodes.includes(saved)) return saved
  const browser = navigator.language?.slice(0, 2)
  return browser === 'uk' ? 'uk' : languageCodes.includes(browser) ? browser : 'en'
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
      { threshold: 0.06 },
    )
    observer.observe(node)
    return () => observer.disconnect()
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
      <svg className="map-lines" viewBox="0 0 660 440" aria-hidden="true">
        <path d="M65 92 C190 80 195 210 330 220 S500 155 602 92" />
        <path d="M65 350 C180 350 195 238 330 220 S505 302 605 350" />
        <path d="M140 40 C170 145 270 133 330 220 S383 347 458 402" />
        <path d="M330 220 C400 205 453 72 553 62" className="signal-line" />
        <circle cx="330" cy="220" r="4" className="map-pulse pulse-one" />
        <circle cx="330" cy="220" r="4" className="map-pulse pulse-two" />
      </svg>
      <div className="system-core"><span className="core-orbit" /><span className="core-dot" /><small>{signal}</small></div>
      {nodes.map((label, index) => <div className={`map-node node-${String.fromCharCode(97 + index)}`} key={label}><span>0{index + 1}</span>{label}</div>)}
    </div>
  )
}

function HomeHero({ t, s, lang, navigate }) {
  return (
    <main id="top">
      <section className="hero home-hero">
        <div className="hero-image" aria-hidden="true" /><div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <Reveal className="hero-copy">
            <div className="eyebrow light"><span className="live-dot" />{t.hero.eyebrow}</div>
            <h1><span>{t.hero.titleA}</span><em>{t.hero.titleB}</em></h1>
            <p>{t.hero.text}</p>
            <div className="hero-actions">
              <RouteLink className="button button-primary" href={`/${lang}/#contact`} navigate={navigate}>{t.hero.primary}<ArrowUpRight size={18} /></RouteLink>
              <RouteLink className="button button-ghost" href={`/${lang}/services`} navigate={navigate}>{t.hero.secondary}<ArrowRight size={18} /></RouteLink>
            </div>
          </Reveal>
          <Reveal className="hero-map-wrap" delay={160}><SystemMap nodes={t.hero.nodes} signal={t.hero.signal} /></Reveal>
        </div>
        <div className="hero-index"><span>OS / 01</span><span>PARIS · REMOTE</span><span>SYSTEMS, CONNECTED</span></div>
      </section>
    </main>
  )
}

function SystemContinuum({ s }) {
  return (
    <section className="continuum">
      <div className="continuum-track">
        {s.common.system.map((item, index) => <span key={item}><i>0{index + 1}</i>{item}{index < s.common.system.length - 1 && <ArrowRight />}</span>)}
      </div>
    </section>
  )
}

function ServiceWorlds({ s, lang, navigate, compact = false }) {
  const [active, setActive] = useState(-1)
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
          <h2>{s.servicesPage.title}<em>{s.servicesPage.titleAccent}</em></h2>
        </Reveal>
        <Reveal delay={80}><p>{s.servicesPage.intro}</p><small>{s.servicesPage.hint}</small></Reveal>
      </div>
      <div className="world-list" onMouseLeave={() => setActive(-1)}>
        {s.directions.map((direction, index) => (
          <RouteLink
            key={direction.id}
            href={`/${lang}/services/${direction.id}`}
            navigate={navigate}
            world={direction.id}
            className={`world-entry world-${direction.id} ${active === index ? 'is-active' : ''} ${active >= 0 && active !== index ? 'is-muted' : ''}`}
            onMouseEnter={() => setActive(index)}
            onMouseMove={move}
          >
            <span className="world-number">{direction.number}</span>
            <div className="world-copy"><h3>{direction.name}</h3><p>{direction.short}</p></div>
            <div className="world-signal" aria-hidden="true"><i /><i /><i /><b /></div>
            <div className="world-items">{direction.items.slice(0, compact ? 4 : 6).map((item) => <span key={item}>{item}</span>)}</div>
            <span className="world-enter">{s.common.explore}<ArrowUpRight /></span>
          </RouteLink>
        ))}
      </div>
    </section>
  )
}

function HomeStatement({ t }) {
  return (
    <section className="statement section-pad">
      <div className="container statement-grid">
        <Reveal className="section-label"><Asterisk size={16} />{t.statement.label}</Reveal>
        <Reveal className="statement-copy" delay={80}><h2>{t.statement.text}</h2><p>{t.statement.sub}</p></Reveal>
      </div>
    </section>
  )
}

function CaseVisual({ item, detail = false }) {
  return (
    <div className={`portfolio-visual visual-${item.visual} ${detail ? 'is-detail' : ''}`} aria-hidden="true">
      <div className="portfolio-grid" />
      {item.visual === 'voice' && (
        <>
          <div className="voice-orbit"><i /><i /><i /></div>
          <div className="voice-wave">{Array.from({ length: 23 }, (_, index) => <i key={index} style={{ '--bar': index }} />)}</div>
          <div className="voice-call"><span>AI / VOICE</span><b>00:42</b><small>CALL → CRM</small></div>
        </>
      )}
      {item.visual === 'flow' && (
        <div className="flow-preview">
          {item.system.slice(0, 5).map((node, index) => <span key={node} style={{ '--node': index }}><i>0{index + 1}</i>{node}</span>)}
          <svg viewBox="0 0 720 420"><path d="M78 95C210 95 190 210 360 210S510 95 645 95" /><path d="M78 330C215 330 205 210 360 210S520 330 645 330" /></svg>
          <b className="flow-core">CRM</b>
        </div>
      )}
      {item.visual === 'dashboard' && (
        <div className="dashboard-preview">
          <div className="dash-top"><i /><i /><i /><span>OPERATIONS / LIVE</span></div>
          <div className="dash-side">{[1, 2, 3, 4, 5].map((value) => <i key={value} />)}</div>
          <div className="dash-chart"><span /><span /><span /><span /><span /><svg viewBox="0 0 400 150"><path d="M0 125C50 125 65 92 110 96S175 35 220 58 290 20 400 16" /></svg></div>
          <div className="dash-table">{[1, 2, 3, 4].map((value) => <i key={value} />)}</div>
        </div>
      )}
      {item.visual === 'website' && (
        <div className="website-preview-case">
          <div className="browser-back"><i /><i /><i /></div>
          <div className="browser-front">
            <span className="browser-ui"><i /><i /><i /></span>
            <div className="browser-hero"><small>DIGITAL / SYSTEM</small><b>Built around<br />the decision.</b><i /></div>
            <div className="browser-columns"><span /><span /><span /></div>
          </div>
        </div>
      )}
      {item.visual === 'performance' && (
        <div className="performance-preview">
          <div className="performance-ring"><i /><i /><b>DATA</b></div>
          <div className="performance-path"><span>ADS</span><i /><span>LANDING</span><i /><span>CRM</span></div>
          <svg viewBox="0 0 700 420"><path d="M40 335C145 335 155 260 245 275S360 155 440 190 555 75 670 75" /></svg>
          <small>METRICS / PENDING VERIFICATION</small>
        </div>
      )}
      {item.visual === 'creative' && (
        <div className="creative-preview">
          {[1, 2, 3].map((value) => <span key={value} className={`creative-frame frame-${value}`}><i>0{value}</i><b>HOOK<br />TEST</b><small>9:16</small></span>)}
          <div className="creative-axis"><i /><i /><i /><i /><i /></div>
        </div>
      )}
    </div>
  )
}

function CaseFilters({ ui, group, subfilter, onGroup, onSubfilter, compact = false }) {
  const groups = ['all', 'automation', 'development', 'performance']
  const subfilters = group === 'all' ? [] : caseCategories[group] || []
  return (
    <div className={`case-filter-shell ${compact ? 'is-compact' : ''}`}>
      <div className="case-filter-main" role="tablist" aria-label={ui.allCases}>
        {groups.map((id) => (
          <button
            key={id}
            className={group === id ? 'active' : ''}
            onClick={() => onGroup(id)}
            role="tab"
            aria-selected={group === id}
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

function SpatialCaseGallery({ items, lang, navigate, ui }) {
  const stageRef = useRef(null)
  const gestureRef = useRef({ active: false, startX: 0, lastX: 0, lastTime: 0, velocity: 0, drag: 0, moved: false })
  const [active, setActive] = useState(0)
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [stageWidth, setStageWidth] = useState(1200)
  const itemKey = items.map((item) => item.slug).join('|')

  useEffect(() => {
    setActive(0)
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
  const go = (next) => setActive(Math.max(0, Math.min(items.length - 1, next)))
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
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (event.pointerType === 'touch') return
    moveGesture(event.clientX)
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

  const onWheel = (event) => {
    const horizontalIntent = Math.abs(event.deltaX) > 8 || event.shiftKey
    if (!horizontalIntent) return
    event.preventDefault()
    go(active + (event.deltaX + event.deltaY > 0 ? 1 : -1))
  }

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
        onWheel={onWheel}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') go(active - 1)
          if (event.key === 'ArrowRight') go(active + 1)
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
              aria-hidden={distance > 1.6}
            >
              <RouteLink
                href={`/${lang}/cases/${item.slug}`}
                navigate={navigate}
                world={item.category}
                draggable="false"
                onDragStart={(event) => event.preventDefault()}
                onClick={(event) => {
                  if (gestureRef.current.moved && event.detail !== 0) event.preventDefault()
                }}
                tabIndex={distance > 1.6 ? -1 : 0}
              >
                <div className="spatial-card-visual">
                  <CaseVisual item={item} />
                  <span className="case-draft-badge">{ui.draft}</span>
                  <span className="case-card-index">{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
                </div>
                <div className="spatial-card-copy">
                  <div>
                    <small>{ui.filters[item.category]} / {ui.filters[item.subcategories[0]]}</small>
                    <h3>{item.title}</h3>
                  </div>
                  <div className="case-preview-fact">
                    <span>{ui.draftFact}</span>
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
    </div>
  )
}

function FeaturedCases({ lang, navigate }) {
  const ui = caseUi[lang]
  const allItems = useMemo(() => getLocalizedCases(lang).filter((item) => item.featured), [lang])
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
      <SpatialCaseGallery items={items} lang={lang} navigate={navigate} ui={ui} />
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
  const [group, setGroup] = useState('all')
  const [subfilter, setSubfilter] = useState('all')
  const items = useMemo(() => filterCases(allItems, group, subfilter), [allItems, group, subfilter])
  const filterKey = `${group}-${subfilter}`

  return (
    <main className="cases-archive-page" id="top">
      <section className="cases-archive-hero">
        <div className="cases-archive-grid" aria-hidden="true" />
        <div className="container">
          <Reveal><span className="eyebrow light">{ui.pageLabel}</span><h1>{ui.pageTitle}</h1></Reveal>
          <Reveal delay={90}><p>{ui.pageIntro}</p><span className="archive-count">{String(allItems.length).padStart(2, '0')} / DRAFT RECORDS</span></Reveal>
        </div>
      </section>
      <section className="cases-archive-list section-pad">
        <div className="container">
          <CaseFilters
            ui={ui}
            group={group}
            subfilter={subfilter}
            onGroup={(value) => { setGroup(value); setSubfilter('all') }}
            onSubfilter={setSubfilter}
          />
          <div className="archive-result-meta"><span>{ui.allCases}</span><b>{String(items.length).padStart(2, '0')}</b></div>
          {items.length ? (
            <div className="archive-grid" key={filterKey}>
              {items.map((item, index) => (
                <article className={`archive-card archive-${item.visual}`} key={item.id} style={{ '--archive-delay': `${index * 45}ms` }}>
                  <RouteLink href={`/${lang}/cases/${item.slug}`} navigate={navigate} world={item.category}>
                    <div className="archive-card-visual">
                      <CaseVisual item={item} />
                      <span className="case-draft-badge">{ui.draft}</span>
                      <span className="case-card-index">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="archive-card-copy">
                      <small>{ui.filters[item.category]} / {ui.filters[item.subcategories[0]]}</small>
                      <h2>{item.title}</h2>
                      <p>{item.summary}</p>
                      <span>{ui.openCase}<ArrowUpRight /></span>
                    </div>
                  </RouteLink>
                </article>
              ))}
            </div>
          ) : <div className="case-empty">{ui.empty}</div>}
        </div>
      </section>
    </main>
  )
}

function CaseSystem({ nodes }) {
  return (
    <div className="case-system-map">
      <svg viewBox="0 0 1000 420" aria-hidden="true">
        <path d="M80 210C190 210 205 110 330 110S420 210 500 210 575 310 680 310 790 210 920 210" />
        <path className="case-system-signal" d="M80 210C190 210 205 110 330 110S420 210 500 210 575 310 680 310 790 210 920 210" />
      </svg>
      {nodes.map((node, index) => <span key={node} style={{ '--system-index': index }}><i>0{index + 1}</i>{node}</span>)}
    </div>
  )
}

function CaseDetail({ item, lang, navigate }) {
  const ui = caseUi[lang]
  const allItems = useMemo(() => getLocalizedCases(lang), [lang])
  const index = allItems.findIndex((candidate) => candidate.slug === item.slug)
  const next = allItems[(index + 1) % allItems.length]
  const facts = [
    [ui.client, item.client || ui.pending],
    [ui.country, item.country || ui.pending],
    [ui.industry, item.industry || ui.pending],
    [ui.year, item.year || ui.pending],
  ]

  return (
    <main className={`case-detail-page detail-${item.visual}`} id="top">
      <section className="case-detail-hero">
        <div className="case-detail-backdrop" aria-hidden="true" />
        <div className="container case-detail-hero-grid">
          <Reveal className="case-detail-breadcrumb">
            <RouteLink href={`/${lang}/cases`} navigate={navigate}><ArrowLeft />{ui.backToCases}</RouteLink>
            <span>{String(index + 1).padStart(2, '0')} / {String(allItems.length).padStart(2, '0')}</span>
          </Reveal>
          <Reveal className="case-detail-title" delay={50}>
            <span>{ui.filters[item.category]} / {ui.filters[item.subcategories[0]]}</span>
            <h1>{item.title}</h1>
            <p>{item.summary}</p>
          </Reveal>
          <Reveal className="case-detail-visual" delay={120}>
            <CaseVisual item={item} detail />
            <span className="case-draft-badge">{ui.draft}</span>
          </Reveal>
        </div>
      </section>

      <section className="case-draft-notice">
        <div className="container"><span>{ui.draft}</span><p>{ui.draftNotice}</p></div>
      </section>

      <section className="case-facts">
        <div className="container case-facts-grid">
          {facts.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
          <div className="case-fact-services"><span>{ui.services}</span><strong>{item.services.join(' · ')}</strong></div>
        </div>
      </section>

      <section className="case-story section-pad">
        <div className="container">
          {[
            ['01', ui.challenge, item.challenge],
            ['02', ui.approach, item.approach],
            ['03', ui.solution, item.solution],
          ].map(([number, label, textValue], storyIndex) => (
            <Reveal className="case-story-row" key={number} delay={storyIndex * 45}>
              <span>{number}</span><h2>{label}</h2><p>{textValue}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="case-system-section section-pad">
        <div className="container">
          <Reveal className="case-section-heading"><span>04 / {ui.system}</span><h2>{item.project}</h2></Reveal>
          <Reveal delay={80}><CaseSystem nodes={item.system} /></Reveal>
        </div>
      </section>

      <section className="case-result-section section-pad">
        <div className="container">
          <Reveal className="case-result-heading"><span>05 / {ui.result}</span><p>{ui.draftNotice}</p></Reveal>
          <Reveal className="case-pending-metric" delay={80}>
            <span>—</span><strong>{ui.metricPending}</strong><small>NO UNVERIFIED NUMBERS</small>
          </Reveal>
        </div>
      </section>

      <section className="case-visuals-section section-pad">
        <div className="container">
          <Reveal className="case-section-heading"><span>06 / {ui.visuals}</span><h2>{ui.visualPending}</h2></Reveal>
          <Reveal className="case-large-visual" delay={80}><CaseVisual item={item} detail /></Reveal>
        </div>
      </section>

      <section className="next-case">
        <RouteLink href={`/${lang}/cases/${next.slug}`} navigate={navigate} world={next.category}>
          <div><span>{ui.nextCase} / {String((index + 1) % allItems.length + 1).padStart(2, '0')}</span><h2>{next.title}</h2><p>{next.summary}</p></div>
          <div className="next-case-visual"><CaseVisual item={next} /><ArrowUpRight /></div>
        </RouteLink>
      </section>
    </main>
  )
}

function About({ t }) {
  return (
    <section className="about section-pad" id="about">
      <div className="container">
        <Reveal className="about-intro"><div className="eyebrow">{t.about.label}</div><h2>{t.about.title}</h2><p>{t.about.text}</p></Reveal>
        <Reveal className="about-system">
          <div className="about-system-core">OSNOVA<span>WHOLE SYSTEM VIEW</span></div>
          {['DESIGN', 'AI', 'CODE', 'DATA', 'MEDIA'].map((item, index) => <span key={item} style={{ '--i': index }}>{item}</span>)}
        </Reveal>
      </div>
    </section>
  )
}

function Pricing({ t }) {
  return (
    <section className="pricing section-pad" id="pricing">
      <div className="container pricing-layout">
        <Reveal className="pricing-intro"><div className="eyebrow light">{t.pricing.label}</div><h2>{t.pricing.title}</h2><p>{t.pricing.text}</p><span className="pricing-big">{t.pricing.from}</span></Reveal>
        <div className="pricing-list">{t.pricing.items.map(([service, price], index) => <Reveal className="price-row" key={service} delay={index * 35}><span>0{index + 1}</span><strong>{service}</strong><em>{price}</em><ArrowUpRight size={18} /></Reveal>)}</div>
      </div>
    </section>
  )
}

function Contact({ t }) {
  const [sent, setSent] = useState(false)
  return (
    <section className="contact section-pad" id="contact">
      <div className="contact-orb" aria-hidden="true" />
      <div className="container contact-layout">
        <Reveal className="contact-copy">
          <div className="eyebrow light">{t.contact.label}</div><h2>{t.contact.title}</h2><p>{t.contact.text}</p>
          <div className="direct-contact"><small>{t.contact.or}</small><a href={`mailto:${t.contact.email}`}>{t.contact.email}<ArrowUpRight size={15} /></a><a href="https://t.me/your_agency" target="_blank" rel="noreferrer">{t.contact.telegram}<ArrowUpRight size={15} /></a></div>
        </Reveal>
        <Reveal className="contact-form-wrap" delay={120}>
          {sent ? <div className="form-success"><Check size={30} /><p>{t.contact.sent}</p><button onClick={() => setSent(false)}>OK</button></div> : (
            <form onSubmit={(event) => { event.preventDefault(); setSent(true) }}>
              <div className="form-row">
                <label><span>{t.contact.fields.name}</span><input name="name" required autoComplete="name" /></label>
                <label><span>{t.contact.fields.contact}</span><input name="contact" required autoComplete="email" /></label>
              </div>
              <label><span>{t.contact.fields.company}</span><input name="company" autoComplete="organization" /></label>
              <label><span>{t.contact.fields.help}</span><select name="service" defaultValue=""><option value="" disabled>—</option>{t.contact.options.map((option) => <option key={option}>{option}</option>)}</select></label>
              <label><span>{t.contact.fields.message}</span><textarea name="message" rows="3" required /></label>
              <button className="form-submit" type="submit">{t.contact.submit}<Send size={17} /></button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function DirectionHero({ direction, data, children }) {
  return (
    <section className={`direction-hero direction-${direction}`}>
      <div className="direction-grid" aria-hidden="true" />
      <div className="direction-orbit" aria-hidden="true"><i /><i /><i /></div>
      <div className="container direction-hero-inner">
        <Reveal className="direction-breadcrumb"><span>OSNOVA</span><ArrowRight />{data.label}</Reveal>
        <Reveal className="direction-title" delay={60}><h1>{data.title}<em>{data.titleAccent}</em></h1><p>{data.intro}</p></Reveal>
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
  const running = step >= 0 && step < data.steps.length
  useEffect(() => {
    if (!running) return undefined
    const timer = window.setTimeout(() => setStep((value) => value + 1), 1100)
    return () => window.clearTimeout(timer)
  }, [running, step, data.steps.length])
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
          <button onClick={() => setStep(0)} disabled={running}>{running ? <Pause /> : <Play fill="currentColor" />}{step >= data.steps.length ? data.replay : data.start}</button>
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
  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % crm.stages.length), 1500)
    return () => window.clearInterval(timer)
  }, [crm.stages.length])
  return (
    <>
      <section className="crm-system section-pad">
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
            <svg viewBox="0 0 760 520" aria-hidden="true">
              <path d="M90 90C250 90 220 260 380 260S520 95 675 95" /><path d="M85 425C220 425 240 260 380 260S540 425 680 425" />
              <path d="M180 25C200 160 310 145 380 260S470 390 560 500" /><circle cx="380" cy="260" r="7" />
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
          {data.products.map(([number, title, text, price], index) => (
            <Reveal key={title} delay={index * 35}>
              <button className={active === index ? 'active' : ''} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}>
                <span>{number}</span><h2>{title}</h2><p>{text}</p><small>{price}</small><ArrowUpRight />
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

function LandingFeature({ data, lang, navigate }) {
  return (
    <section className="landing-feature-new section-pad">
      <div className="container landing-new-grid">
        <Reveal className="landing-art">
          <span>OS / WEB</span><h3>{data.art[0]}<br />{data.art[1]}<br /><em>{data.art[2]}</em></h3><div className="landing-cursor" /><div className="landing-grid-lines" />
        </Reveal>
        <Reveal className="landing-new-copy" delay={90}>
          <span className="eyebrow light">{data.label}</span><h2>{data.title}</h2><p>{data.text}</p><strong>{data.price}</strong>
          <RouteLink className="button button-primary" href={`/${lang}/#contact`} navigate={navigate}>{data.cta}<ArrowUpRight /></RouteLink>
        </Reveal>
      </div>
    </section>
  )
}

function BuildSequence({ data }) {
  return (
    <section className="build-sequence section-pad"><div className="container"><span className="eyebrow">{data.label}</span><div>{data.steps.map((item, index) => <Reveal key={item} delay={index * 50}><i>0{index + 1}</i><strong>{item}</strong><span style={{ '--progress': `${(index + 1) * 16.6}%` }} /></Reveal>)}</div></div></section>
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

function Footer({ t, s, lang, navigate }) {
  return (
    <footer>
      <div className="footer-marquee"><span>{s.common.system.join(' · ')} <Asterisk /> {s.common.system.join(' · ')}</span></div>
      <div className="container footer-bottom">
        <RouteLink className="brand footer-brand" href={`/${lang}/`} navigate={navigate}><span className="brand-mark">O</span><span>OSNOVA</span></RouteLink>
        <p>{t.footer.rights}</p>
        <RouteLink href={`/${lang}/services`} navigate={navigate}>{s.common.services}<ArrowUpRight size={14} /></RouteLink>
      </div>
    </footer>
  )
}

function HomePage({ t, s, lang, navigate }) {
  return <><HomeHero t={t} s={s} lang={lang} navigate={navigate} /><SystemContinuum s={s} /><HomeStatement t={t} /><ServiceWorlds s={s} lang={lang} navigate={navigate} compact /><FeaturedCases lang={lang} navigate={navigate} /><About t={t} /><Pricing t={t} /><Contact t={t} /></>
}

function ServicesPage({ s, lang, navigate }) {
  return <main className="services-page"><ServiceWorlds s={s} lang={lang} navigate={navigate} /></main>
}

function AutomationPage({ s, lang, navigate }) {
  const data = s.automation
  return (
    <main className="direction-page automation-page">
      <DirectionHero direction="automation" data={data}><AutomationHeroVisual label={data.signal} flow={data.heroFlow} /></DirectionHero>
      <section className="direction-proposition"><div className="container"><Reveal><span>{data.propositionLabel}</span><h2>{data.proposition}</h2></Reveal></div></section>
      <VoiceOperator data={data.voice} /><AssistantsSection data={data.assistants} /><CrmIntegrations crm={data.crm} integrations={data.integrations} /><CustomAutomation data={data.custom} />
      <DirectionFooter s={s} lang={lang} current="automation" navigate={navigate} />
    </main>
  )
}

function DevelopmentPage({ s, lang, navigate }) {
  const data = s.development
  return (
    <main className="direction-page development-page">
      <DirectionHero direction="development" data={data}><DevelopmentVisual labels={data.visual} /></DirectionHero>
      <DevelopmentCatalogue data={data} /><LandingFeature data={data.landing} lang={lang} navigate={navigate} /><BuildSequence data={data.build} />
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
  const s = useMemo(() => serviceContent[lang], [lang])

  const navigate = (href, world = 'neutral', replace = false) => {
    const target = new URL(href, window.location.origin)
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
        window.setTimeout(() => setTransition({ phase: '', world }), 720)
      }, 40)
    }, 520)
  }

  const setLang = (nextLang) => {
    const currentRoute = location.route ? `/${location.route}` : '/'
    setLangState(nextLang)
    localStorage.setItem('osnova-language', nextLang)
    navigate(`/${nextLang}${currentRoute}${location.hash}`, 'neutral', true)
  }

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
    const canonicalRoute = location.route
    if (!location.lang) {
      window.history.replaceState({}, '', `/${lang}/${canonicalRoute}${location.hash}`)
      setLocation(parseLocation())
      return
    }
    document.documentElement.lang = lang
    localStorage.setItem('osnova-language', lang)
    const caseSlug = location.route.startsWith('cases/') ? location.route.split('/')[1] : null
    const caseItem = caseSlug ? getLocalizedCases(lang).find((item) => item.slug === caseSlug) : null
    const pageKey = location.route === 'services' ? 'services' : location.route.split('/')[1]
    const meta = location.route === 'cases'
      ? [`${caseUi[lang].pageTitle} — OSNOVA`, caseUi[lang].pageIntro]
      : caseItem
        ? [`${caseItem.title} — OSNOVA`, caseItem.summary]
        : s.meta[pageKey] || [t.meta.title, t.meta.description]
    document.title = meta[0]
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta[1])
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta[0])
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta[1])
    document.querySelector('meta[property="og:type"]')?.setAttribute('content', caseItem ? 'article' : 'website')
    const localizedPath = `/${lang}/${location.route}${location.route ? '' : ''}`
    const absoluteUrl = new URL(localizedPath, window.location.origin).href
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', absoluteUrl)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', absoluteUrl)
    document.querySelector('meta[name="robots"]')?.setAttribute('content', caseItem?.status === 'draft' ? 'noindex, follow' : 'index, follow')
    for (const code of languageCodes) {
      const alternate = document.querySelector(`link[rel="alternate"][hreflang="${code}"]`)
      alternate?.setAttribute('href', new URL(`/${code}/${location.route}`, window.location.origin).href)
    }
    document.querySelector('link[rel="alternate"][hreflang="x-default"]')
      ?.setAttribute('href', new URL(`/en/${location.route}`, window.location.origin).href)
  }, [lang, location, s, t])

  let page
  if (location.route === 'services') page = <ServicesPage s={s} lang={lang} navigate={navigate} />
  else if (location.route === 'services/automation') page = <AutomationPage s={s} lang={lang} navigate={navigate} />
  else if (location.route === 'services/development') page = <DevelopmentPage s={s} lang={lang} navigate={navigate} />
  else if (location.route === 'services/performance') page = <PerformancePage s={s} lang={lang} navigate={navigate} />
  else if (location.route === 'cases') page = <CasesArchive lang={lang} navigate={navigate} />
  else if (location.route.startsWith('cases/')) {
    const slug = location.route.split('/')[1]
    const item = getLocalizedCases(lang).find((candidate) => candidate.slug === slug)
    page = item ? <CaseDetail item={item} lang={lang} navigate={navigate} /> : <CasesArchive lang={lang} navigate={navigate} />
  }
  else page = <HomePage t={t} s={s} lang={lang} navigate={navigate} />

  return (
    <>
      <Header t={t} s={s} lang={lang} route={location.route} setLang={setLang} navigate={navigate} />
      {page}
      <Footer t={t} s={s} lang={lang} navigate={navigate} />
      <PageTransition state={transition} />
    </>
  )
}
