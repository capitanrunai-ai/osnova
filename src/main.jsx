import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App, { getInitialLanguage } from './App.jsx'
import { loadServiceContent } from './data/serviceContentLoader.js'
import './styles.css'
import './closing.css'
import './commercial.css'

async function start() {
  const initialLanguage = getInitialLanguage()
  // Leave the prerendered page visible while its matching language loads.
  // Hydration starts with complete data, without a fallback or layout shift.
  await loadServiceContent(initialLanguage)
  const root = document.getElementById('root')
  const app = <StrictMode><App initialLanguage={initialLanguage} /></StrictMode>
  if (root.hasChildNodes()) hydrateRoot(root, app)
  else createRoot(root).render(app)
}

void start()
