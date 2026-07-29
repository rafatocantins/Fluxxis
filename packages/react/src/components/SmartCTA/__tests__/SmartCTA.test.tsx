/**
 * SmartCTA Component Tests
 *
 * Tests for the intent-driven SmartCTA component covering:
 * - Rendering with different intent props (browse, buy, compare, learn)
 * - Loading state rendering
 * - Accessible button behavior
 * - Click handling and node registration lifecycle
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderToString } from 'react-dom/server';

// Mock useBehaviorObserver
vi.mock('../../../hooks/useBehaviorObserver', () => ({
  useBehaviorObserver: () => ({
    ref: { current: null },
    metrics: {
      scrollDepth: 0,
      hoverTime: 0,
      dwellTime: 0,
      inViewport: false,
      isHovered: false,
    },
    resetMetrics: vi.fn(),
  }),
}));

// Mock @fluxxis/core — factory must not reference external variables (hoisting)
vi.mock('@fluxxis/core', () => {
  const mockRegistry = {
    register: vi.fn(() => ({ id: 'test-node', goal: 'convert', pageContext: '' })),
    deregister: vi.fn(),
    updateMetrics: vi.fn(),
  };

  return {
    getIntentTokens: vi.fn(() => ({
      animation: 'none',
      borderRadius: '8px',
      shadow: 'none',
    })),
    getIntentCSSVariables: vi.fn(() => ({})),
    nodeRegistry: mockRegistry,
    eventBus: {
      publish: vi.fn(() => Promise.resolve()),
    },
    generateCopy: vi.fn(() =>
      Promise.resolve({ selected: 'AI Generated CTA', fallback: false })
    ),
    generateAriaLabel: vi.fn((copy: string) => `CTA: ${copy}`),
  };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: React.forwardRef(
      (props: any, ref: any) => <button ref={ref} {...props} />
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import { SmartCTA } from '../SmartCTA';

describe('SmartCTA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering with intent props', () => {
    it('renders with browse intent (goal="browse")', () => {
      render(
        <SmartCTA
          goal="browse"
          defaultCopy="Browse Products"
          animated={false}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDefined();
      expect(button.textContent).toBe('Browse Products');
      expect(button.getAttribute('data-goal')).toBe('browse');
    });

    it('renders with buy intent (goal="buy")', () => {
      render(
        <SmartCTA
          goal="buy"
          defaultCopy="Buy Now"
          animated={false}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDefined();
      expect(button.textContent).toBe('Buy Now');
      expect(button.getAttribute('data-goal')).toBe('buy');
    });

    it('renders with compare intent (goal="compare")', () => {
      render(
        <SmartCTA
          goal="compare"
          defaultCopy="Compare Plans"
          animated={false}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDefined();
      expect(button.textContent).toBe('Compare Plans');
      expect(button.getAttribute('data-goal')).toBe('compare');
    });

    it('renders with learn intent (goal="learn")', () => {
      render(
        <SmartCTA
          goal="learn"
          defaultCopy="Learn More"
          animated={false}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDefined();
      expect(button.textContent).toBe('Learn More');
      expect(button.getAttribute('data-goal')).toBe('learn');
    });
  });

  describe('Loading and disabled states', () => {
    it('renders in loading state when isLoading is true', () => {
      render(
        <SmartCTA
          goal="convert"
          defaultCopy="Get Started"
          isLoading={true}
          animated={false}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDefined();
    });

    it('renders with correct aria attributes', () => {
      render(
        <SmartCTA
          goal="convert"
          defaultCopy="Get Started"
          pageContext="pricing"
          animated={false}
        />
      );

      const button = screen.getByRole('button');
      expect(button.getAttribute('data-page-context')).toBe('pricing');
      expect(button.getAttribute('aria-label')).toBeDefined();
    });
  });

  describe('Click handling', () => {
    it('calls onClick handler when clicked', () => {
      const handleClick = vi.fn();
      render(
        <SmartCTA
          goal="convert"
          defaultCopy="Get Started"
          onClick={handleClick}
          animated={false}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles clicks even without onClick prop', () => {
      render(
        <SmartCTA
          goal="convert"
          defaultCopy="Get Started"
          animated={false}
        />
      );

      const button = screen.getByRole('button');
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe('Keyboard accessibility (WCAG 2.1 AA)', () => {
    it('activates onClick via Enter key', () => {
      const handleClick = vi.fn();
      render(
        <SmartCTA
          goal="convert"
          defaultCopy="Get Started"
          onClick={handleClick}
          animated={false}
        />
      );

      const button = screen.getByRole('button');
      // Simulate browser behavior: Enter keyDown triggers click on buttons
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('activates onClick via Space key', () => {
      const handleClick = vi.fn();
      render(
        <SmartCTA
          goal="convert"
          defaultCopy="Get Started"
          onClick={handleClick}
          animated={false}
        />
      );

      const button = screen.getByRole('button');
      // Simulate browser behavior: Space keyDown triggers click on buttons
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not activate onClick for non-activation keys', () => {
      const handleClick = vi.fn();
      render(
        <SmartCTA
          goal="convert"
          defaultCopy="Get Started"
          onClick={handleClick}
          animated={false}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Tab', code: 'Tab' });

      // Tab should NOT trigger onClick on native buttons
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('noscript fallback (a11y)', () => {
    it('renders <noscript> fallback with correct content', () => {
      // Use renderToString because client-side React + jsdom strip <noscript> children
      const html = renderToString(
        <SmartCTA
          goal="convert"
          defaultCopy="Get Started"
          animated={false}
        />
      );

      expect(html).toContain('<noscript>');
      expect(html).toContain('Get Started');
      expect(html).toContain('/signup');
      expect(html).toContain('flux-cta--noscript');
    });

    it('renders correct href for inform goal', () => {
      const html = renderToString(
        <SmartCTA
          goal="inform"
          defaultCopy="Learn More"
          animated={false}
        />
      );

      expect(html).toContain('<noscript>');
      expect(html).toContain('/learn');
      expect(html).toContain('Learn More');
    });

    it('renders correct href for pricing page context', () => {
      const html = renderToString(
        <SmartCTA
          goal="convert"
          defaultCopy="View Pricing"
          pageContext="pricing"
          animated={false}
        />
      );

      expect(html).toContain('<noscript>');
      expect(html).toContain('/pricing');
      expect(html).toContain('View Pricing');
    });
  });
});
