import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { Intent } from './types'
import { INTENT_CLASS, INTENT_ICONS, INTENT_NAMES, INTENT_THEME } from './types'
import { PRODUCTS } from './products'
import BrowseTemplate from './templates/BrowseTemplate'
import BuyTemplate from './templates/BuyTemplate'
import CompareTemplate from './templates/CompareTemplate'
import LearnTemplate from './templates/LearnTemplate'
import './MorphStage.css'

/** Ordered intent list for keyboard nav */
const INTENTS: Intent[] = ['browse', 'buy', 'compare', 'learn']

// ── Helpers ──

interface NoscriptFallbackProps {
  themeColor: string
}

/** Static fallback shown when JavaScript is disabled */
const NoscriptFallback: React.FC<NoscriptFallbackProps> = ({ themeColor }) => (
  <noscript>
    <div className="noscript-fallback" style={{ display: 'block' }}>
      <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8, color: themeColor }}>
        ⚡ JavaScript is disabled
      </p>
      <p>Fluxxis Morph Stage requires JavaScript for dynamic template morphing.</p>
      <p style={{ marginTop: 12 }}>Browse our products below:</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
          marginTop: 16,
          textAlign: 'left' as const,
        }}
      >
        {PRODUCTS.map((p) => (
          <div
            key={p.id}
            style={{
              background: 'var(--flux-bg-elevated, #1a1a3e)',
              borderRadius: 10,
              padding: 16,
            }}
          >
            <strong>{p.name}</strong>
            <br />
            {p.price}
            {p.currency} — {p.category}
          </div>
        ))}
      </div>
    </div>
  </noscript>
)

// ── Component ──

const MorphStage: React.FC = () => {
  const [intent, setIntent] = useState<Intent>('browse')
  const [fading, setFading] = useState(false)
  const [pulseKey, setPulseKey] = useState(0)
  const pillRefs = useRef<Map<Intent, HTMLButtonElement>>(new Map())
  const switcherRef = useRef<HTMLDivElement>(null)

  const themeColor = INTENT_THEME[intent]
  const themeClass = INTENT_CLASS[intent]

  // ── Morph transition (FLIP: fade out → render swap → fade in) ──
  const morphTo = useCallback(
    (next: Intent) => {
      if (next === intent) return
      // Trigger fade out
      setFading(true)
      // After 180ms, swap + fade in
      setTimeout(() => {
        setIntent(next)
        setFading(false)
        setPulseKey((k) => k + 1)
      }, 180)
    },
    [intent],
  )

  // ── Pill click ──
  const handlePillClick = useCallback(
    (next: Intent) => {
      morphTo(next)
      // Move focus to clicked pill
      const el = pillRefs.current.get(next)
      el?.focus()
    },
    [morphTo],
  )

  // ── Keyboard navigation (tablist pattern) ──
  const handleSwitcherKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIdx = INTENTS.indexOf(intent)
      if (currentIdx === -1) return

      let nextIdx: number | undefined

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextIdx = (currentIdx + 1) % INTENTS.length
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        nextIdx = (currentIdx - 1 + INTENTS.length) % INTENTS.length
      }

      if (nextIdx !== undefined) {
        const nextIntent = INTENTS[nextIdx]
        setIntent(nextIntent)
        setPulseKey((k) => k + 1)
        // Move focus
        const el = pillRefs.current.get(nextIntent)
        el?.focus()
      }
    },
    [intent],
  )

  // ── Pulse the signal dot when intent changes ──
  useEffect(() => {
    // No-op — the pulse is handled by key change on the dot element
  }, [pulseKey])

  // ── Render active template ──
  const renderTemplate = () => {
    switch (intent) {
      case 'browse':
        return <BrowseTemplate themeColor={themeColor} />
      case 'buy':
        return <BuyTemplate themeColor={themeColor} />
      case 'compare':
        return <CompareTemplate themeColor={themeColor} />
      case 'learn':
        return <LearnTemplate themeColor={themeColor} />
    }
  }

  return (
    <section className="morph-stage-wrapper" aria-labelledby="morph-heading">
      {/* Section heading */}
      <h2 id="morph-heading" className="morph-section-title">
        Intent-Driven Interface
      </h2>
      <p className="morph-section-sub">
        The interface morphs its structure based on what you want to do — browse,
        buy, compare, or learn. Same products, four completely different
        experiences.
      </p>

      {/* Skip link for keyboard users */}
      <a href="#morph-stage-content" className="morph-skip-link">
        Skip to Morph Stage content
      </a>

      {/* Signal Indicator */}
      <div className="morph-signal" aria-live="polite" aria-atomic="true">
        <span
          key={`dot-${pulseKey}`}
          className={`morph-signal-dot ${intent}${pulseKey > 0 ? ' morph-signal-pulse' : ''}`}
          aria-hidden="true"
        />
        <span id="morph-signal-text">
          Intent detected: {INTENT_NAMES[intent]}
        </span>
      </div>

      {/* Intent Switcher (tablist) */}
      <div
        ref={switcherRef}
        className="morph-switcher"
        role="tablist"
        aria-label="User intent selector"
        onKeyDown={handleSwitcherKeyDown}
      >
        {INTENTS.map((i) => (
          <button
            key={i}
            ref={(el) => {
              if (el) pillRefs.current.set(i, el)
            }}
            className="morph-pill"
            role="tab"
            data-intent={i}
            aria-selected={intent === i}
            aria-controls="morph-stage-content"
            tabIndex={intent === i ? 0 : -1}
            onClick={() => handlePillClick(i)}
          >
            {INTENT_ICONS[i]} {INTENT_NAMES[i]}
          </button>
        ))}
      </div>

      {/* Morph Stage (tabpanel) */}
      <div
        id="morph-stage"
        className={`morph-stage ${themeClass}`}
        role="tabpanel"
        aria-label={`${INTENT_NAMES[intent]} view`}
      >
        <div
          id="morph-stage-content"
          className={`morph-template-view${fading ? ' fading-out' : ''}`}
        >
          {renderTemplate()}
        </div>
      </div>

      {/* noscript fallback */}
      <NoscriptFallback themeColor={themeColor} />
    </section>
  )
}

export default React.memo(MorphStage)
