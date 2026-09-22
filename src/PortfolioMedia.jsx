import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Play, Pause, Phone, Check, Volume2 } from 'lucide-react'
import { caseUi, getLocalizedCases } from './data/cases'
import { track } from './analytics'
import waveform from './data/voiceWaveform.json'
import './portfolio.css'

export function CaseVisual({ item, priority = false }) {
  if (item.visual === 'voice') return (
    <div className="portfolio-visual visual-voice real-voice" aria-hidden="true">
      <div className="portfolio-grid" />
      <span className="voice-visual-label">{item.visualLabel}</span>
      <div className="voice-orbit"><i /><i /><i /></div>
      <div className="voice-wave">{waveform.filter((_, i) => i % 3 === 0).map((value, i) => <i key={i} style={{ '--bar': i, height: `${12 + value * 90}px` }} />)}</div>
      <div className="voice-visual-caption"><Phone size={15} /><span>HUMAN × AI</span><span>04:09</span></div>
    </div>
  )
  return (
    <div className="portfolio-visual real-website" style={{ '--project-accent': item.accent }}>
      <div className="project-browser">
        <div className="project-browser-bar" aria-hidden="true"><i /><i /><i /><span>{new URL(item.url).hostname.replace('www.', '')}</span><ArrowUpRight size={12} /></div>
        <img src={item.desktop} alt={item.title} width="1440" height="960" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} draggable="false" />
      </div>
      <div className="project-phone" aria-hidden="true"><img src={item.mobile} alt="" width="390" height="844" loading="lazy" draggable="false" /></div>
    </div>
  )
}

const time = value => `${Math.floor(value / 60).toString().padStart(2, '0')}:${Math.floor(value % 60).toString().padStart(2, '0')}`

export function VoicePlayer({ item, ui, lang }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRate] = useState(1)
  const [error, setError] = useState(false)
  const [ended, setEnded] = useState(false)
  const progress = duration ? position / duration : 0
  // Milestones already reported, so seeking back and forth cannot inflate them.
  const reportedRef = useRef(new Set())

  const reportOnce = (name, params) => {
    if (reportedRef.current.has(name)) return
    reportedRef.current.add(name)
    track(name, { site_language: lang, case_slug: item.slug, ...params })
  }

  const reportProgress = (audio) => {
    if (!audio.duration) return
    const percent = (audio.currentTime / audio.duration) * 100
    for (const milestone of [25, 50, 75]) {
      if (percent >= milestone) reportOnce(`voice_demo_${milestone}`, { percent: milestone })
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio?.readyState >= 1 && Number.isFinite(audio.duration)) setDuration(audio.duration)
    return () => { audio?.pause() }
  }, [])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused) { audio.pause(); return }
    try { await audio.play(); setError(false) } catch { setError(true) }
  }

  return (
    <div className={`voice-player ${playing ? 'is-playing' : ''}`}>
      <audio ref={audioRef} src={item.audio} preload="metadata"
        onLoadedMetadata={event => setDuration(event.currentTarget.duration)}
        onTimeUpdate={event => { setPosition(event.currentTarget.currentTime); reportProgress(event.currentTarget) }}
        onPlay={() => { setPlaying(true); setEnded(false); reportOnce('voice_demo_play') }} onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setEnded(true); reportOnce('voice_demo_complete') }} onError={() => setError(true)} />
      <div className="voice-player-heading"><span><i />{ui.audioLabel}</span><Volume2 size={18} /></div>
      <h2>{ui.audioTitle}</h2>
      <div className="audio-waveform" aria-hidden="true">
        {waveform.map((value, index) => <i key={index} className={index / waveform.length <= progress ? 'is-heard' : ''} style={{ height: `${8 + value * 92}%` }} />)}
      </div>
      <input className="audio-seek" type="range" min="0" max={duration || 1} step="0.1" value={position}
        aria-label={ui.seek} aria-valuetext={`${time(position)} / ${time(duration)}`}
        disabled={!duration} style={{ '--progress': `${progress * 100}%` }}
        onChange={event => { const value = Number(event.target.value); audioRef.current.currentTime = value; setPosition(value) }} />
      <div className="audio-time"><span>{time(position)}</span><span>{duration ? time(duration) : '—:—'}</span></div>
      <div className="audio-controls">
        <button className="audio-play" onClick={toggle} aria-label={playing ? ui.pause : ended ? ui.replay : ui.listen}>
          {playing ? <Pause fill="currentColor" size={19} /> : <Play fill="currentColor" size={19} />}<span>{playing ? ui.pause : ended ? ui.replay : ui.listen}</span>
        </button>
        <button className="audio-rate" aria-label={`${ui.speed}: ${rate}×`} onClick={() => {
          const next = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : 1
          audioRef.current.playbackRate = next; setRate(next)
        }}>{rate}×</button>
      </div>
      <p className="audio-note">{ui.audioNote}</p>
      {error && <p className="audio-error" role="alert">{ui.audioError} <a href={item.audio} target="_blank" rel="noopener noreferrer">{ui.audioDownload}<ArrowUpRight size={14} /></a></p>}
    </div>
  )
}

export function PortfolioDetail({ item, lang, navigate, Link }) {
  const ui = caseUi[lang]
  const allItems = getLocalizedCases(lang)
  const index = allItems.findIndex(candidate => candidate.slug === item.slug)
  const next = allItems[(index + 1) % allItems.length]
  const previous = allItems[(index + allItems.length - 1) % allItems.length]
  const [device, setDevice] = useState(() => window.matchMedia('(max-width: 700px)').matches ? 'mobile' : 'desktop')
  const isVoice = item.visual === 'voice'

  return (
    <main className={`portfolio-detail ${isVoice ? 'portfolio-detail-voice' : ''}`} id="top" style={{ '--project-accent': item.accent }}>
      <div className="container">
        <nav className="portfolio-breadcrumb" aria-label={ui.navigationLabel}>
          <Link href={`/${lang}/cases`} navigate={navigate}><ArrowLeft size={17} />{ui.backToCases}</Link>
          <span>{String(index + 1).padStart(2, '0')} / {String(allItems.length).padStart(2, '0')}</span>
        </nav>
        <header className="portfolio-detail-heading">
          <div><span className="portfolio-category">{item.recovery ? ui.restored : item.categoryLabel}</span><h1>{item.title.split(' — ').map((part, i) => <span key={part} className={i ? 'project-subtitle' : ''}>{part}</span>)}</h1></div>
          <div className="portfolio-detail-intro">
            <p>{item.summary}</p>
            {!isVoice && <a className="portfolio-visit" href={item.url} target="_blank" rel="noopener noreferrer">{ui.visit}<ArrowUpRight size={19} /></a>}
            {item.originalUrl && <a className="portfolio-original" href={item.originalUrl} target="_blank" rel="noopener noreferrer">{ui.original}<ArrowUpRight size={14} /></a>}
          </div>
        </header>
        {isVoice ? (
          <section className="portfolio-voice-demo">
            <VoicePlayer item={item} ui={ui} lang={lang} />
            <ol className="voice-scenario">{ui.steps.map((step, i) => <li key={step}><span>{String(i + 1).padStart(2, '0')}</span><p>{step}</p>{i === 3 ? <Check size={21} /> : <ArrowDownIcon />}</li>)}</ol>
          </section>
        ) : (
          <section className="portfolio-site-demo" aria-label={ui.preview}>
            <div className="portfolio-preview-toolbar"><span>{new URL(item.url).hostname.replace('www.', '')}</span>
              <div role="group" aria-label={ui.preview}>{['desktop', 'mobile'].map(mode => <button key={mode} aria-pressed={device === mode} onClick={() => setDevice(mode)}>{ui[mode]}</button>)}</div>
            </div>
            <div className={`portfolio-screen mode-${device}`}>
              <img key={`${item.slug}-${device}`} src={item[device]} alt={`${item.title} — ${ui.screenshot}, ${ui[device]}`} width={device === 'desktop' ? 1440 : 390} height={device === 'desktop' ? 960 : 844} fetchPriority="high" />
            </div>
            <div className="portfolio-secondary"><span>{ui.preview}<ArrowDownIcon /></span><img src={item.detail} alt={`${item.title} — ${ui.preview}`} width="1440" height="960" loading="lazy" /></div>
          </section>
        )}
        <nav className="portfolio-detail-nav" aria-label={ui.navigationLabel}>
          <Link className="portfolio-prev" href={`/${lang}/cases/${previous.slug}`} navigate={navigate} world={previous.category}><ArrowLeft size={18} /><span>{ui.previous}</span></Link>
          <Link className="portfolio-next" href={`/${lang}/cases/${next.slug}`} navigate={navigate} world={next.category}>
            <div><span>{ui.nextCase}</span><h2>{next.title}</h2></div><ArrowRight />
          </Link>
        </nav>
      </div>
    </main>
  )
}

function ArrowDownIcon() { return <ArrowRight className="portfolio-arrow-down" size={17} /> }
