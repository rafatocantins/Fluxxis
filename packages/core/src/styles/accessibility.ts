/**
 * Accessibility Styles
 * 
 * WCAG 2.1 AA compliant styles for components
 */

export const ACCESSIBILITY_STYLES = `
/* Screen Reader Only - Visually hidden but accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus Styles - Visible focus indicators */
.smart-cta:focus {
  outline: 2px solid var(--intent-color, currentColor);
  outline-offset: 2px;
}

.smart-cta:focus:not(:focus-visible) {
  outline: none;
}

.smart-cta:focus-visible {
  outline: 2px solid var(--intent-color, currentColor);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(var(--intent-color, 0, 0, 0), 0.2);
}

/* High Contrast Mode Support */
@media (forced-colors: active) {
  .smart-cta {
    border: 2px solid currentColor;
  }
  
  .smart-cta:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .smart-cta,
  .smart-cta * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .smart-cta:hover,
  .smart-cta:active {
    transform: none !important;
  }
  
  /* Disable shimmer, rainbow, and other decorative animations */
  .smart-cta::before,
  .smart-cta::after {
    animation: none !important;
  }
}

/* Skip Link - For keyboard navigation */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--intent-color, #3b82f6);
  color: white;
  padding: 8px 16px;
  z-index: 100;
  text-decoration: none;
  font-weight: 600;
}

.skip-link:focus {
  top: 0;
}

/* Loading State - Accessible */
.smart-cta[aria-busy="true"] {
  cursor: wait;
}

.smart-cta[aria-busy="true"]::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Disabled State - Accessible */
.smart-cta[aria-disabled="true"],
.smart-cta:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* Error State - Accessible */
.smart-cta[aria-invalid="true"] {
  border: 2px solid #dc2626;
}

/* Live Region Announcements */
[role="status"],
[aria-live] {
  /* Visually hidden but announced to screen readers */
}

/* Touch Target Size - Minimum 44x44px for mobile */
.smart-cta {
  min-height: 44px;
  min-width: 44px;
}

/* Text Size - Respect user preferences */
@media (prefers-contrast: more) {
  .smart-cta {
    border: 2px solid currentColor;
  }
}

/* Print Styles */
@media print {
  .smart-cta {
    background: none !important;
    color: black !important;
    border: 1px solid black;
  }
  
  .smart-cta::before,
  .smart-cta::after {
    display: none !important;
  }
}
`;

/**
 * Inject accessibility styles into document head
 */
export function injectAccessibilityStyles(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const existingStyle = document.getElementById('accessibility-styles');
  if (existingStyle) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'accessibility-styles';
  style.textContent = ACCESSIBILITY_STYLES;
  document.head.appendChild(style);
}

/**
 * Check if element meets minimum touch target size
 */
export function checkTouchTargetSize(element: HTMLElement): {
  meets: boolean;
  width: number;
  height: number;
} {
  const rect = element.getBoundingClientRect();
  const minWidth = 44;
  const minHeight = 44;

  return {
    meets: rect.width >= minWidth && rect.height >= minHeight,
    width: rect.width,
    height: rect.height,
  };
}

/**
 * Add skip link to page
 */
export function addSkipLink(targetId: string = 'main-content'): void {
  if (typeof document === 'undefined') {
    return;
  }

  const existing = document.querySelector('.skip-link');
  if (existing) {
    return;
  }

  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  
  document.body.insertBefore(skipLink, document.body.firstChild);
}
