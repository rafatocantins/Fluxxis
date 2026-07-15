import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './env'

// ── Fluxxis Design Tokens v2.0 ──
// CSS custom properties (var(--flux-*))
import '@fluxxis/ui/tokens.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
