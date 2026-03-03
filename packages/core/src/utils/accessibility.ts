/**
 * Accessibility Utilities
 * 
 * WCAG 2.1 AA compliance helpers for components
 */

/**
 * Check if color contrast meets WCAG requirements
 * Returns contrast ratio and compliance level
 */
export function checkColorContrast(
  foreground: string,
  background: string
): {
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
} {
  // Parse colors to RGB
  const fgRGB = parseColor(foreground);
  const bgRGB = parseColor(background);

  if (!fgRGB || !bgRGB) {
    return { ratio: 0, wcagAA: false, wcagAAA: false };
  }

  // Calculate relative luminance
  const fgLuminance = getLuminance(fgRGB);
  const bgLuminance = getLuminance(bgRGB);

  // Calculate contrast ratio
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  // WCAG compliance
  // AA: 4.5:1 for normal text, 3:1 for large text
  // AAA: 7:1 for normal text, 4.5:1 for large text
  return {
    ratio: Math.round(ratio * 100) / 100,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
  };
}

/**
 * Parse color string to RGB
 */
function parseColor(color: string): { r: number; g: number; b: number } | null {
  // Handle rgb() format
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]!),
      g: parseInt(rgbMatch[2]!),
      b: parseInt(rgbMatch[3]!),
    };
  }

  // Handle hex format
  const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1]!, 16),
      g: parseInt(hexMatch[2]!, 16),
      b: parseInt(hexMatch[3]!, 16),
    };
  }

  return null;
}

/**
 * Calculate relative luminance per WCAG 2.1
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const rgbValues = [rgb.r, rgb.g, rgb.b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  const [rs, gs, bs] = rgbValues;
  return 0.2126 * rs! + 0.7152 * gs! + 0.0722 * bs!;
}

/**
 * Generate accessible aria-label for button
 */
export function generateAriaLabel(
  copy: string,
  goal: string,
  pageContext?: string
): string {
  const goalDescriptions: Record<string, string> = {
    convert: 'Call to action',
    inform: 'Learn more',
    engage: 'Interactive',
  };

  const context = pageContext ? ` on ${pageContext}` : '';
  return `${goalDescriptions[goal] || 'Button'}: ${copy}${context}`;
}

/**
 * Check if element is keyboard accessible
 */
export function isKeyboardAccessible(element: HTMLElement): boolean {
  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute('role');
  const tabIndex = element.getAttribute('tabindex');

  // Naturally focusable elements
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
  if (focusableTags.includes(tagName)) {
    return !element.hasAttribute('disabled') && tabIndex !== '-1';
  }

  // Elements with interactive roles
  const interactiveRoles = [
    'button',
    'link',
    'checkbox',
    'radio',
    'tab',
    'menuitem',
  ];
  if (role && interactiveRoles.includes(role)) {
    return tabIndex !== '-1';
  }

  return false;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors));
}

/**
 * Trap focus within a container (for modals, dialogs)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);
  firstElement?.focus();

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof document === 'undefined') {
    return;
  }

  const existing = document.getElementById('sr-announcer');
  if (existing) {
    existing.remove();
  }

  const announcer = document.createElement('div');
  announcer.id = 'sr-announcer';
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.textContent = message;

  document.body.appendChild(announcer);

  // Clean up after announcement
  setTimeout(() => {
    announcer.remove();
  }, 1000);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get accessible name for component
 */
export function getAccessibleName(
  label?: string,
  ariaLabel?: string,
  children?: string
): string | undefined {
  return ariaLabel || label || children;
}

/**
 * Validate accessibility props
 */
export function validateAccessibilityProps(props: {
  ariaLabel?: string;
  role?: string;
  tabIndex?: number;
  children?: React.ReactNode;
}): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Check for accessible name
  if (!props.ariaLabel && !props.children) {
    warnings.push('Component should have aria-label or children for screen readers');
  }

  // Check role with tabIndex
  if (props.role && props.tabIndex === undefined) {
    warnings.push('Component with role should have tabIndex for keyboard access');
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

/**
 * WCAG 2.1 AA Compliance Checklist
 */
export const WCAG_CHECKLIST = {
  // Perceivable
  perceivable: {
    textAlternatives: 'Provide text alternatives for non-text content',
    captions: 'Provide captions for multimedia',
    adaptable: 'Create content that can be presented in different ways',
    distinguishable: 'Make it easier for users to see and hear content',
  },

  // Operable
  operable: {
    keyboardAccessible: 'Make all functionality available from keyboard',
    enoughTime: 'Give users enough time to read and use content',
    seizures: 'Do not design content in a way that causes seizures',
    navigable: 'Provide ways to help users navigate and find content',
  },

  // Understandable
  understandable: {
    readable: 'Make text readable and understandable',
    predictable: 'Make web pages appear and operate in predictable ways',
    inputHelp: 'Help users avoid and correct input mistakes',
  },

  // Robust
  robust: {
    compatible: 'Maximize compatibility with current and future tools',
  },
};

/**
 * Generate accessibility report for component
 */
export function generateAccessibilityReport(component: {
  name: string;
  hasAriaLabel: boolean;
  hasKeyboardSupport: boolean;
  hasFocusIndicator: boolean;
  colorContrast?: { ratio: number; wcagAA: boolean };
  supportsReducedMotion: boolean;
}): {
  score: number;
  passed: string[];
  failed: string[];
  recommendations: string[];
} {
  const passed: string[] = [];
  const failed: string[] = [];
  const recommendations: string[] = [];

  // Check ARIA label
  if (component.hasAriaLabel) {
    passed.push('Has ARIA label for screen readers');
  } else {
    failed.push('Missing ARIA label');
    recommendations.push('Add aria-label or aria-labelledby attribute');
  }

  // Check keyboard support
  if (component.hasKeyboardSupport) {
    passed.push('Keyboard accessible');
  } else {
    failed.push('Not keyboard accessible');
    recommendations.push('Add keyboard event handlers (Enter, Space, Arrow keys)');
  }

  // Check focus indicator
  if (component.hasFocusIndicator) {
    passed.push('Has visible focus indicator');
  } else {
    failed.push('Missing focus indicator');
    recommendations.push('Add :focus-visible styles with clear outline');
  }

  // Check color contrast
  if (component.colorContrast) {
    if (component.colorContrast.wcagAA) {
      passed.push(`Color contrast meets WCAG AA (${component.colorContrast.ratio}:1)`);
    } else {
      failed.push(`Color contrast fails WCAG AA (${component.colorContrast.ratio}:1, needs 4.5:1)`);
      recommendations.push('Increase color contrast to at least 4.5:1');
    }
  }

  // Check reduced motion support
  if (component.supportsReducedMotion) {
    passed.push('Supports reduced motion preference');
  } else {
    failed.push('Does not support reduced motion');
    recommendations.push('Add @media (prefers-reduced-motion: reduce) support');
  }

  // Calculate score
  const totalChecks = 5;
  const passedChecks = passed.length;
  const score = Math.round((passedChecks / totalChecks) * 100);

  return {
    score,
    passed,
    failed,
    recommendations,
  };
}
