/**
 * SmartCTA Component — Unit Tests
 *
 * Tests for the intent-driven CTA button:
 * - Renders with correct text/color per intent
 * - Fires tracking events
 * - Handles all four intents
 * - Renders <noscript> fallback
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { SmartCTA } from '../src/SmartCTA'

// Mock tracking module
vi.mock('../src/tracking', () => ({
  trackImpression: vi.fn(),
  trackClick: vi.fn(),
  trackConversion: vi.fn(),
  setTrackingEndpoint: vi.fn(),
}))

import { trackImpression, trackClick } from '../src/tracking'

describe('SmartCTA', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Render Tests ────────────────────────────────────────────────────

  it('renders with browse intent', () => {
    render(<SmartCTA intent="browse" />)
    const button = screen.getByRole('button', { name: /explorar produtos/i })
    expect(button).toBeDefined()
    expect(button.textContent).toContain('Explorar Produtos')
    expect(button.textContent).toContain('🔍')
  })

  it('renders with buy intent and price', () => {
    render(<SmartCTA intent="buy" price={29.99} currency="€" />)
    const button = screen.getByRole('button', { name: /comprar agora/i })
    expect(button).toBeDefined()
    expect(button.textContent).toContain('🛒')
    expect(button.textContent).toContain('Frete Grátis')
  })

  it('renders with compare intent', () => {
    render(<SmartCTA intent="compare" />)
    const button = screen.getByRole('button', { name: /comparar modelos/i })
    expect(button).toBeDefined()
    expect(button.textContent).toContain('⚖️')
  })

  it('renders with learn intent', () => {
    render(<SmartCTA intent="learn" />)
    const button = screen.getByRole('button', { name: /saber mais/i })
    expect(button).toBeDefined()
    expect(button.textContent).toContain('📚')
  })

  // ── Accessibility Tests ─────────────────────────────────────────────

  it('has accessible aria-label', () => {
    render(<SmartCTA intent="buy" />)
    const button = screen.getByRole('button')
    expect(button.getAttribute('aria-label')).toContain('Comprar Agora')
  })

  it('renders <noscript> element for JS-disabled fallback', () => {
    const { container } = render(<SmartCTA intent="buy" />)
    const noscript = container.querySelector('noscript')
    // noscript element exists — its children render only when JS is disabled
    // jsdom (with JS enabled) strips children, which is correct behavior
    expect(noscript).toBeDefined()
    // Verify the element is a proper <noscript> tag
    expect(noscript!.tagName).toBe('NOSCRIPT')
  })

  // ── Variant Tests ───────────────────────────────────────────────────

  it('applies primary variant by default', () => {
    render(<SmartCTA intent="browse" />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('flux-cta--primary')
  })

  it('applies secondary variant class', () => {
    render(<SmartCTA intent="learn" variant="secondary" />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('flux-cta--secondary')
  })

  it('applies inline variant class', () => {
    render(<SmartCTA intent="compare" variant="inline" />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('flux-cta--inline')
  })

  it('accepts custom className', () => {
    render(<SmartCTA intent="browse" className="my-custom-class" />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('my-custom-class')
  })

  // ── Click Handler Tests ─────────────────────────────────────────────

  it('calls onCTAClick with intent on click', () => {
    const handleClick = vi.fn()
    render(<SmartCTA intent="buy" onCTAClick={handleClick} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledWith('buy')
  })

  it('fires trackClick on button click', () => {
    render(<SmartCTA intent="browse" />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(trackClick).toHaveBeenCalledWith('browse', undefined, undefined)
  })

  it('fires trackClick with product info', () => {
    render(
      <SmartCTA intent="buy" productId="sku-123" productName="Widget Pro" />
    )
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(trackClick).toHaveBeenCalledWith('buy', 'sku-123', 'Widget Pro')
  })

  // ── Color / Style Tests ─────────────────────────────────────────────

  it('sets background color for browse intent', () => {
    render(<SmartCTA intent="browse" />)
    const button = screen.getByRole('button')
    expect(button.style.background).toBe('rgb(46, 230, 214)')
  })

  it('sets background color for buy intent', () => {
    render(<SmartCTA intent="buy" />)
    const button = screen.getByRole('button')
    expect(button.style.background).toBe('rgb(255, 92, 157)')
  })

  it('secondary variant has transparent background', () => {
    render(<SmartCTA intent="buy" variant="secondary" />)
    const button = screen.getByRole('button')
    expect(button.style.background).toBe('transparent')
  })
})
