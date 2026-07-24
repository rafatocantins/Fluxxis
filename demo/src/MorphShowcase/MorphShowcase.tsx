import React, { useCallback, useEffect, useRef, useState } from 'react'
import './MorphShowcase.css'

// ── Types ──────────────────────────────────────────────────────────────────────

type Scenario = 'browsing' | 'hesitating' | 'ready'

interface ScenarioConfig {
  badgeText: string
  badgeClass: string
  urgency: boolean
  urgencyText: string
  priceCurrent: string
  priceOriginal: string
  showOriginal: boolean
  showDiscount: boolean
  discountText: string
  ratingCount: string
  ctaText: string
  ctaClass: string
  ctaAria: string
  confidence: string
  confidenceClass: string
  scenarioLabel: string
}

const SCENARIOS: Scenario[] = ['browsing', 'hesitating', 'ready']

const SCENARIO_CONFIG: Record<Scenario, ScenarioConfig> = {
  browsing: {
    badgeText: 'New Release',
    badgeClass: 'browsing',
    urgency: false,
    urgencyText: '',
    priceCurrent: '$299.99',
    priceOriginal: '$349.99',
    showOriginal: false,
    showDiscount: false,
    discountText: '',
    ratingCount: '(1,247 reviews)',
    ctaText: 'Learn More →',
    ctaClass: 'cta-subtle',
    ctaAria: 'Learn more about FluxSound Pro',
    confidence: '45%',
    confidenceClass: '',
    scenarioLabel: 'Inform',
  },
  hesitating: {
    badgeText: '🔥 Popular',
    badgeClass: 'hesitating',
    urgency: false,
    urgencyText: '',
    priceCurrent: '$299.99',
    priceOriginal: '$349.99',
    showOriginal: false,
    showDiscount: false,
    discountText: '',
    ratingCount: '(1,247 reviews)',
    ctaText: 'See Why People Love This →',
    ctaClass: 'cta-medium',
    ctaAria: 'See why people love FluxSound Pro',
    confidence: '68%',
    confidenceClass: '',
    scenarioLabel: 'Engage',
  },
  ready: {
    badgeText: 'Best Seller',
    badgeClass: 'ready',
    urgency: true,
    urgencyText: '⚡ Only 3 left in stock — order soon!',
    priceCurrent: '$199.99',
    priceOriginal: '$299.99',
    showOriginal: true,
    showDiscount: true,
    discountText: 'Save 33%',
    ratingCount: '(2,891 reviews)',
    ctaText: 'Buy Now — $199.99 →',
    ctaClass: 'cta-convert',
    ctaAria: 'Buy FluxSound Pro now for $199.99',
    confidence: '94%',
    confidenceClass: 'confidence-high',
    scenarioLabel: 'Convert',
  },
}

const SCENARIO_ICONS: Record<Scenario, string> = {
  browsing: '🔍',
  hesitating: '🤔',
  ready: '💳',
}

const SCENARIO_NAMES: Record<Scenario, string> = {
  browsing: 'Browsing',
  hesitating: 'Hesitating',
  ready: 'Ready to Buy',
}

// ── Morph Zone Content Renders ────────────────────────────────────────────────

const BrowsingContent: React.FC = () => (
  <ul className="morph-showcase-features">
    <li>
      <span className="morph-showcase-feat-icon" aria-hidden="true">
        ✓
      </span>
      <span>Active Noise Cancellation with 3 adjustable levels</span>
    </li>
    <li>
      <span className="morph-showcase-feat-icon" aria-hidden="true">
        ✓
      </span>
      <span>40-hour battery life with quick-charge (10min = 3hrs)</span>
    </li>
    <li>
      <span className="morph-showcase-feat-icon" aria-hidden="true">
        ✓
      </span>
      <span>Premium 40mm neodymium drivers for studio-grade sound</span>
    </li>
    <li>
      <span className="morph-showcase-feat-icon" aria-hidden="true">
        ✓
      </span>
      <span>Bluetooth 5.3 + multipoint connection (2 devices)</span>
    </li>
    <li>
      <span className="morph-showcase-feat-icon" aria-hidden="true">
        ✓
      </span>
      <span>Memory foam ear cushions with breathable mesh</span>
    </li>
  </ul>
)

const HesitatingContent: React.FC = () => (
  <>
    <div className="morph-showcase-testimonial">
      <blockquote>
        &ldquo;The FluxSound Pro completely changed my workflow. The ANC is
        incredible, and I can wear them for hours without fatigue. Best
        purchase this year.&rdquo;
      </blockquote>
      <cite>
        — Sarah Chen, <span>★★★★★</span> Verified Buyer
      </cite>
    </div>
    <table className="morph-showcase-comparison" aria-label="Product comparison">
      <thead>
        <tr>
          <th>Feature</th>
          <th>FluxSound Pro</th>
          <th>Competitor Avg</th>
        </tr>
      </thead>
      <tbody>
        <tr className="highlight-row">
          <td>Battery Life</td>
          <td className="check">40 hrs ✓</td>
          <td>25 hrs</td>
        </tr>
        <tr>
          <td>Noise Cancellation</td>
          <td className="check">Adaptive ANC ✓</td>
          <td>Standard ANC</td>
        </tr>
        <tr className="highlight-row">
          <td>Driver Size</td>
          <td className="check">40mm ✓</td>
          <td>35mm</td>
        </tr>
        <tr>
          <td>Warranty</td>
          <td className="check">3 Years ✓</td>
          <td>1 Year</td>
        </tr>
        <tr className="highlight-row">
          <td>Rating</td>
          <td className="check">4.8 ★</td>
          <td>4.1 ★</td>
        </tr>
      </tbody>
    </table>
  </>
)

const ReadyContent: React.FC = () => (
  <>
    <div className="morph-showcase-social-proof">
      <div className="morph-showcase-avatar-stack" aria-hidden="true">
        <span>JD</span>
        <span>ML</span>
        <span>AK</span>
        <span>+12</span>
      </div>
      <div className="morph-showcase-proof-text">
        <strong>15 people</strong>&nbsp;bought this in the last 24 hours
      </div>
    </div>
    <ul className="morph-showcase-features">
      <li>
        <span className="morph-showcase-feat-icon" aria-hidden="true">
          ✓
        </span>
        <span>Free 2-day shipping + 30-day risk-free trial</span>
      </li>
      <li>
        <span className="morph-showcase-feat-icon" aria-hidden="true">
          ✓
        </span>
        <span>3-year warranty included at no extra cost</span>
      </li>
      <li>
        <span className="morph-showcase-feat-icon" aria-hidden="true">
          ✓
        </span>
        <span>Lifetime customer support — rated 4.9/5</span>
      </li>
    </ul>
  </>
)

// ── Main Component ────────────────────────────────────────────────────────────

const MorphShowcase: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>('browsing')
  const [morphState, setMorphState] = useState<'enter' | 'exit' | 'idle'>('enter')
  const [morphing, setMorphing] = useState(false)
  const tabRefs = useRef<Map<Scenario, HTMLButtonElement>>(new Map())
  const timeoutRefs = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const liveRegionRef = useRef<HTMLDivElement>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRefs.current.length > 0) {
        timeoutRefs.current.forEach(clearTimeout)
        timeoutRefs.current = []
      }
    }
  }, [])

  const config = SCENARIO_CONFIG[scenario]

  // ── Morph transition (<100ms via CSS, no JS blocking) ──
  const morphTo = useCallback(
    (next: Scenario) => {
      if (next === scenario) return

      // Exit animation
      setMorphState('exit')
      setMorphing(true)

      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      const exitDelay = prefersReduced ? 0 : 80

      timeoutRefs.current.push(setTimeout(() => {
        setScenario(next)
        setMorphState('enter')
      }, exitDelay))

      timeoutRefs.current.push(setTimeout(() => {
        setMorphing(false)
      }, exitDelay + 120))
    },
    [scenario],
  )

  // ── Tab click ──
  const handleTabClick = useCallback(
    (next: Scenario) => {
      morphTo(next)
      const el = tabRefs.current.get(next)
      el?.focus()
    },
    [morphTo],
  )

  // ── Keyboard navigation ──
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIdx = SCENARIOS.indexOf(scenario)
      if (currentIdx === -1) return

      let nextIdx: number | undefined

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        nextIdx = (currentIdx + 1) % SCENARIOS.length
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        nextIdx =
          (currentIdx - 1 + SCENARIOS.length) % SCENARIOS.length
      } else if (e.key === 'Home') {
        e.preventDefault()
        nextIdx = 0
      } else if (e.key === 'End') {
        e.preventDefault()
        nextIdx = SCENARIOS.length - 1
      }

      if (nextIdx !== undefined) {
        const nextScenario = SCENARIOS[nextIdx]
        morphTo(nextScenario)
        const el = tabRefs.current.get(nextScenario)
        el?.focus()
      }
    },
    [scenario, morphTo],
  )

  // Announce scenario change to screen readers
  useEffect(() => {
    if (liveRegionRef.current) {
      const labels: Record<Scenario, string> = {
        browsing: 'Browsing mode — Inform',
        hesitating: 'Hesitating mode — Engage',
        ready: 'Ready to Buy mode — Convert',
      }
      liveRegionRef.current.textContent = labels[scenario] || ''
    }
  }, [scenario])

  // ── Render morph zone content ──
  const renderMorphContent = () => {
    switch (scenario) {
      case 'browsing':
        return <BrowsingContent />
      case 'hesitating':
        return <HesitatingContent />
      case 'ready':
        return <ReadyContent />
    }
  }

  return (
    <section
      className="morph-showcase-wrapper"
      aria-labelledby="morph-showcase-heading"
    >
      {/* Screen reader live region */}
      <div
        ref={liveRegionRef}
        className="morph-showcase-sr-only"
        aria-live="assertive"
        aria-atomic="true"
      />

      {/* Section Header */}
      <header className="morph-showcase-header">
        <span className="morph-showcase-badge">Fluxxis Demo</span>
        <h2 id="morph-showcase-heading" className="morph-showcase-title">
          Real-World Demo: E-commerce Product Page
        </h2>
        <p className="morph-showcase-subtitle">
          Watch how Fluxxis adapts the same product page for different user
          intents — morphing seamlessly between{' '}
          <strong>Inform</strong>, <strong>Engage</strong>, and{' '}
          <strong>Convert</strong>.
        </p>
      </header>

      {/* Skip link */}
      <a href="#morph-showcase-card" className="morph-showcase-skip">
        Skip to product
      </a>

      {/* Scenario Tabs (tablist) */}
      <div
        className="morph-showcase-tabs"
        role="tablist"
        aria-label="Product scenarios"
        onKeyDown={handleTabKeyDown}
      >
        {SCENARIOS.map((s) => (
          <button
            key={s}
            ref={(el) => {
              if (el) tabRefs.current.set(s, el)
            }}
            type="button"
            className={`morph-showcase-tab${scenario === s ? ' active' : ''}`}
            role="tab"
            id={`morph-tab-${s}`}
            aria-selected={scenario === s}
            aria-controls="morph-showcase-card"
            tabIndex={scenario === s ? 0 : -1}
            onClick={() => handleTabClick(s)}
          >
            <span className="morph-showcase-tab-icon" aria-hidden="true">
              {SCENARIO_ICONS[s]}
            </span>
            {SCENARIO_NAMES[s]}
          </button>
        ))}
      </div>

      {/* Product Card */}
      <main
        className="morph-showcase-product-container"
        id="morph-showcase-card"
        aria-label="Product: FluxSound Pro"
      >
        <article
          className={`morph-showcase-card${morphing ? ' morphing' : ''}`}
          role="tabpanel"
          aria-labelledby={`morph-tab-${scenario}`}
        >
          {/* Product Image */}
          <div className="morph-showcase-image-area">
            <div
              className="morph-showcase-image-placeholder"
              aria-hidden="true"
            >
              🎧
            </div>
            <div
              className={`morph-showcase-scenario-badge ${config.badgeClass}`}
            >
              {config.badgeText}
            </div>
            {config.urgency && (
              <div className="morph-showcase-urgency">
                <span
                  className="morph-showcase-urgency-dot"
                  aria-hidden="true"
                />
                <span>{config.urgencyText}</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="morph-showcase-info">
            <div className="morph-showcase-category">Premium Audio</div>
            <h3 className="morph-showcase-product-name">FluxSound Pro</h3>
            <div className="morph-showcase-rating">
              <span
                className="morph-showcase-stars"
                aria-label="4.8 out of 5 stars"
              >
                ★★★★★
              </span>
              <span className="morph-showcase-rating-count">
                {config.ratingCount}
              </span>
            </div>

            {/* Price */}
            <div className="morph-showcase-price-block">
              <span className="morph-showcase-price-current">
                {config.priceCurrent}
              </span>
              {config.showOriginal && (
                <span className="morph-showcase-price-original">
                  {config.priceOriginal}
                </span>
              )}
              {config.showDiscount && (
                <span className="morph-showcase-discount-badge">
                  {config.discountText}
                </span>
              )}
            </div>

            {/* Morph Zone */}
            <div
              className={`morph-showcase-zone ${morphState}`}
              key={scenario}
            >
              {renderMorphContent()}
            </div>

            {/* CTA Button */}
            <button
              className={`morph-showcase-cta ${config.ctaClass}`}
              aria-label={config.ctaAria}
            >
              {config.ctaText}
            </button>
          </div>
        </article>

        {/* Metrics Bar */}
        <div className="morph-showcase-metrics">
          <div className="morph-showcase-metric">
            <div className="morph-showcase-metric-label">
              Intent Confidence
            </div>
            <div
              className={`morph-showcase-metric-value ${config.confidenceClass}`}
            >
              {config.confidence}
            </div>
          </div>
          <div className="morph-showcase-metric">
            <div className="morph-showcase-metric-label">Morph Duration</div>
            <div className="morph-showcase-metric-value">~150ms</div>
          </div>
          <div className="morph-showcase-metric">
            <div className="morph-showcase-metric-label">Scenario</div>
            <div
              className="morph-showcase-metric-value"
              style={{ fontSize: '1.2rem' }}
            >
              {config.scenarioLabel}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="morph-showcase-footer">
        <p>
          Built with{' '}
          <a
            href="https://rafatocantins.github.io/Fluxxis/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fluxxis
          </a>{' '}
          — Adaptive UI, Real-Time Intent Morphing. © 2026 Fluxxis Demo
        </p>
      </footer>

      {/* no-JS fallback is in index.html */}
    </section>
  )
}

export default React.memo(MorphShowcase)
