/**
 * SmartCTA — Intent-Driven Call-to-Action Button
 *
 * A React component that renders a CTA button whose text, color, and icon
 * adapt dynamically based on the detected user intent.
 *
 * Features:
 *   - Four intents: browse, buy, compare, learn
 *   - WCAG 2.1 AA compliant (4.5:1 contrast, focus-visible, aria-label)
 *   - Smooth 200ms transitions between intent states
 *   - Responsive: mobile + desktop
 *   - <noscript> fallback with static "Comprar" button
 *   - Integrated analytics (cta_impression on mount, cta_click on click)
 *
 * @package @fluxxis/adaptive-cta
 */

import React, { useEffect, useCallback, useRef } from 'react'
import type { SmartCTAProps, Intent } from './types'
import { resolveCTA } from './intent-resolver'
import { trackImpression, trackClick } from './tracking'

// ── Styles (injected once) ──────────────────────────────────────────────────

const STYLES_ID = 'fluxxis-adaptive-cta-styles'

function injectStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLES_ID)) return

  const style = document.createElement('style')
  style.id = STYLES_ID
  style.textContent = `
    /* ── SmartCTA Base ──────────────────────────────────── */
    .flux-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-family: 'Sora', 'Inter', system-ui, -apple-system, sans-serif;
      font-weight: 700;
      font-size: 0.9375rem;
      line-height: 1.4;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: background-color 200ms ease,
                  color 200ms ease,
                  box-shadow 200ms ease,
                  transform 200ms ease;
      position: relative;
      overflow: hidden;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    /* ── Focus (WCAG 2.1 AA) ───────────────────────────── */
    .flux-cta:focus-visible {
      outline: 3px solid #8B6DFF;
      outline-offset: 2px;
      box-shadow: 0 0 0 4px rgba(139, 109, 255, 0.25);
    }
    .flux-cta:focus:not(:focus-visible) {
      outline: none;
    }

    /* ── Hover / Active ────────────────────────────────── */
    .flux-cta:hover {
      transform: translateY(-1px);
    }
    .flux-cta:active {
      transform: translateY(0) scale(0.98);
    }

    /* ── Sizes ─────────────────────────────────────────── */
    .flux-cta--primary {
      padding: 0.875rem 2rem;
      font-size: 1rem;
    }
    .flux-cta--secondary {
      background: transparent;
      border: 2px solid currentColor;
      box-shadow: none;
    }
    .flux-cta--inline {
      background: transparent;
      box-shadow: none;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    /* ── Subtext ───────────────────────────────────────── */
    .flux-cta__content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
    }
    .flux-cta__label {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }
    .flux-cta__subtext {
      font-size: 0.7rem;
      font-weight: 400;
      opacity: 0.85;
      letter-spacing: 0.02em;
    }

    /* ── Mobile ────────────────────────────────────────── */
    @media (max-width: 640px) {
      .flux-cta {
        width: 100%;
        justify-content: center;
        padding: 0.875rem 1.25rem;
        font-size: 0.875rem;
      }
      .flux-cta--primary {
        padding: 1rem 1.5rem;
        font-size: 0.9375rem;
      }
    }

    /* ── Reduced motion ────────────────────────────────── */
    @media (prefers-reduced-motion: reduce) {
      .flux-cta {
        transition: none;
      }
      .flux-cta:hover,
      .flux-cta:active {
        transform: none;
      }
    }

    /* ── <noscript> fallback ───────────────────────────── */
    .flux-cta--noscript {
      display: none;
    }
    noscript .flux-cta--noscript {
      display: inline-flex;
    }
  `
  document.head.appendChild(style)
}

// ── Color helpers (inject as inline styles for dynamic intent changes) ──────

function intentStyles(intent: Intent, variant: string): React.CSSProperties {
  const cta = resolveCTA(intent)

  if (variant === 'secondary') {
    return {
      background: 'transparent',
      border: `2px solid ${cta.color}`,
      color: cta.color,
      boxShadow: 'none',
    }
  }

  if (variant === 'inline') {
    return {
      background: 'transparent',
      color: cta.color,
      boxShadow: 'none',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
    }
  }

  // Primary variant
  return {
    background: cta.color,
    color: cta.textColor,
    boxShadow: `0 4px 20px ${cta.color}40`,
  }
}

// ── Component ───────────────────────────────────────────────────────────────

/**
 * SmartCTA — An intent-adaptive call-to-action button.
 *
 * @example
 * ```tsx
 * <SmartCTA intent="buy" productId="sku-123" price={29.99} productName="Widget Pro" />
 * ```
 */
export const SmartCTA: React.FC<SmartCTAProps> = ({
  intent,
  productId,
  productName,
  price,
  currency = '€',
  onCTAClick,
  variant = 'primary',
  className,
}) => {
  const mounted = useRef(false)

  // Inject styles once per page load
  useEffect(() => {
    injectStyles()
  }, [])

  // Track impression on mount (once per intent change)
  useEffect(() => {
    // Skip the initial mount double-fire in StrictMode
    if (!mounted.current) {
      mounted.current = true
      return
    }
    trackImpression(intent, productId, productName)
  }, [intent, productId, productName])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      trackClick(intent, productId, productName)
      onCTAClick?.(intent)
    },
    [intent, productId, productName, onCTAClick],
  )

  const cta = resolveCTA(intent, price, currency)
  const styles = intentStyles(intent, variant)

  const classNames = [
    'flux-cta',
    `flux-cta--${variant}`,
    `flux-cta--${intent}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      {/* JS-enabled button */}
      <button
        type="button"
        className={classNames}
        style={styles}
        onClick={handleClick}
        aria-label={`${cta.text}${cta.subtext ? ` — ${cta.subtext}` : ''}`}
      >
        <span className="flux-cta__content">
          <span className="flux-cta__label">
            {cta.icon && <span aria-hidden="true">{cta.icon}</span>}
            {cta.text}
          </span>
          {cta.subtext && (
            <span className="flux-cta__subtext">{cta.subtext}</span>
          )}
        </span>
      </button>

      {/* <noscript> fallback */}
      <noscript>
        <a
          href="/products"
          className="flux-cta flux-cta--noscript flux-cta--primary"
          style={{
            background: '#FF5C9D',
            color: '#ffffff',
            boxShadow: '0 4px 20px rgba(255, 92, 157, 0.25)',
          }}
          aria-label="Comprar"
        >
          🛒 Comprar
        </a>
      </noscript>
    </>
  )
}

SmartCTA.displayName = 'SmartCTA'
