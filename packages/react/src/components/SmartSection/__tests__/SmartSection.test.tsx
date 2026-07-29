/**
 * SmartSection Component Tests
 *
 * Tests for the intent-driven SmartSection component covering:
 * - Intent propagation via data-goal attribute
 * - Goal-driven rendering with different goals
 * - Children rendering
 * - Custom element type (as prop)
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

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
  BehaviorMetrics: {} as any,
}));

// Mock @fluxxis/core
vi.mock('@fluxxis/core', () => ({
  nodeRegistry: {
    register: vi.fn(() => ({ id: 'test-section', goal: 'inform', pageContext: '' })),
    deregister: vi.fn(),
    updateMetrics: vi.fn(),
  },
  eventBus: {
    publish: vi.fn(() => Promise.resolve()),
  },
}));

import { SmartSection } from '../SmartSection';

describe('SmartSection', () => {
  describe('Intent propagation', () => {
    it('renders with correct data-goal attribute for "inform" goal', () => {
      render(
        <SmartSection goal="inform" pageContext="features">
          <p>Content</p>
        </SmartSection>
      );

      const section = screen.getByText('Content').closest('section');
      expect(section).toBeDefined();
      expect(section!.getAttribute('data-goal')).toBe('inform');
      expect(section!.getAttribute('data-page-context')).toBe('features');
    });

    it('renders with correct data-goal attribute for "convert" goal', () => {
      render(
        <SmartSection goal="convert" pageContext="pricing">
          <p>Pricing content</p>
        </SmartSection>
      );

      const section = screen.getByText('Pricing content').closest('section');
      expect(section).toBeDefined();
      expect(section!.getAttribute('data-goal')).toBe('convert');
    });

    it('renders with correct data-goal attribute for "engage" goal', () => {
      render(
        <SmartSection goal="engage" pageContext="community">
          <p>Community content</p>
        </SmartSection>
      );

      const section = screen.getByText('Community content').closest('section');
      expect(section).toBeDefined();
      expect(section!.getAttribute('data-goal')).toBe('engage');
    });
  });

  describe('Children rendering', () => {
    it('renders children correctly', () => {
      render(
        <SmartSection goal="inform" pageContext="docs">
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </SmartSection>
      );

      expect(screen.getByTestId('child-1')).toBeDefined();
      expect(screen.getByTestId('child-2')).toBeDefined();
      expect(screen.getByText('Child 1')).toBeDefined();
      expect(screen.getByText('Child 2')).toBeDefined();
    });

    it('renders without children', () => {
      render(
        <SmartSection goal="inform" pageContext="empty" />
      );

      const section = document.querySelector('[data-goal="inform"]');
      expect(section).toBeDefined();
    });
  });

  describe('Custom element type', () => {
    it('renders as a div when as="div"', () => {
      render(
        <SmartSection goal="inform" pageContext="test" as="div">
          <p>Div content</p>
        </SmartSection>
      );

      const element = screen.getByText('Div content').closest('div');
      expect(element).toBeDefined();
      expect(element!.tagName).toBe('DIV');
      expect(element!.getAttribute('data-goal')).toBe('inform');
    });

    it('renders as an article when as="article"', () => {
      render(
        <SmartSection goal="inform" pageContext="test" as="article">
          <p>Article content</p>
        </SmartSection>
      );

      const element = screen.getByText('Article content').closest('article');
      expect(element).toBeDefined();
      expect(element!.tagName).toBe('ARTICLE');
    });
  });

  describe('Class names', () => {
    it('applies smart-section class and goal-specific class', () => {
      render(
        <SmartSection goal="convert" pageContext="test">
          <p>Content</p>
        </SmartSection>
      );

      const section = screen.getByText('Content').closest('section');
      expect(section!.className).toContain('smart-section');
      expect(section!.className).toContain('smart-section--convert');
    });

    it('appends custom className', () => {
      render(
        <SmartSection
          goal="inform"
          pageContext="test"
          className="custom-class another-class"
        >
          <p>Content</p>
        </SmartSection>
      );

      const section = screen.getByText('Content').closest('section');
      expect(section!.className).toContain('custom-class');
      expect(section!.className).toContain('another-class');
    });
  });
});
