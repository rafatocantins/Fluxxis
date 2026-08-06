import React, { useState, useEffect, useRef } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

interface KPI {
  label: string
  value: string
  changePercent: number
  changeLabel: string
}

interface Variant {
  name: string
  id: string
  status: 'Active' | 'Inactive' | 'A/B Testing'
  impressions: number
  ctr: string
  conversion: string
  revenue: string
}

// ── SVG Icons ────────────────────────────────────────────────────────────────

const DashboardIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
)

const VariantsIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

const AnalyticsIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const SettingsIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const EyeIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const PulseIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

const TrendingUpIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const DollarIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const ChevronLeftIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const MenuIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
)

// ── Data ─────────────────────────────────────────────────────────────────────

const kpis: KPI[] = [
  { label: 'Total Impressions', value: '124,583', changePercent: 12, changeLabel: 'vs last month' },
  { label: 'CTR', value: '4.7%', changePercent: 12, changeLabel: 'vs last month' },
  { label: 'Conversion Rate', value: '2.3%', changePercent: 8, changeLabel: 'vs last month' },
  { label: 'Revenue Lift', value: '€4,230', changePercent: 18, changeLabel: 'vs last month' },
]

const kpiIcons: React.FC[] = [EyeIcon, PulseIcon, TrendingUpIcon, DollarIcon]

const variants: Variant[] = [
  { name: 'Browse Intent', id: 'VAR-001', status: 'Active', impressions: 42891, ctr: '5.1%', conversion: '2.8%', revenue: '€1,847' },
  { name: 'Buy Intent', id: 'VAR-002', status: 'Active', impressions: 35210, ctr: '4.3%', conversion: '2.1%', revenue: '€1,236' },
  { name: 'Compare Intent', id: 'VAR-003', status: 'A/B Testing', impressions: 28445, ctr: '6.2%', conversion: '3.4%', revenue: '€892' },
  { name: 'Informational Intent', id: 'VAR-004', status: 'A/B Testing', impressions: 12784, ctr: '3.8%', conversion: '1.9%', revenue: '€210' },
  { name: 'Checkout — Trust Badge', id: 'VAR-005', status: 'Inactive', impressions: 5253, ctr: '2.1%', conversion: '1.2%', revenue: '€45' },
]

const navItems: { label: string; icon: React.FC; active?: boolean }[] = [
  { label: 'Dashboard', icon: DashboardIcon, active: true },
  { label: 'Variants', icon: VariantsIcon },
  { label: 'Analytics', icon: AnalyticsIcon },
  { label: 'Settings', icon: SettingsIcon },
]

// ── Status Badge ─────────────────────────────────────────────────────────────

const statusStyles: Record<Variant['status'], { bg: string; color: string; dot: string }> = {
  Active: {
    bg: 'var(--flux-accent-soft, rgba(0,212,170,0.10))',
    color: 'var(--flux-accent-primary, #00d4aa)',
    dot: 'var(--flux-accent-primary, #00d4aa)',
  },
  Inactive: {
    bg: 'var(--flux-bg-secondary, #0e0e18)',
    color: 'var(--flux-text-tertiary, #787890)',
    dot: 'var(--flux-text-tertiary, #787890)',
  },
  'A/B Testing': {
    bg: 'rgba(34, 211, 238, 0.12)',
    color: 'var(--flux-accent-secondary, #22d3ee)',
    dot: 'var(--flux-accent-secondary, #22d3ee)',
  },
}

// ── DashboardSection ─────────────────────────────────────────────────────────

const DashboardSection: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mobileOpen) {
      overlayRef.current?.focus()
    }
  }, [mobileOpen])

  const sidebarWidth = collapsed ? 64 : 250

  return (
    <section
      role="region"
      aria-label="Dashboard"
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--flux-bg-primary, #08080f)',
        color: 'var(--flux-text-primary, #f0f0f5)',
        fontFamily: 'var(--flux-font-sans, Inter, sans-serif)',
        position: 'relative',
      }}
    >
      {/* Responsive media queries injected as <style> */}
      <style>{`
        .fluxxis-dash-sidebar { transition: width var(--flux-transition-base, 200ms ease); }
        .fluxxis-dash-sidebar-text { transition: opacity var(--flux-transition-fast, 120ms ease); }
        .fluxxis-dash-collapsed .fluxxis-dash-sidebar-text { opacity: 0; pointer-events: none; }
        .fluxxis-dash-collapsed .fluxxis-dash-nav-link { justify-content: center; padding: 0.625rem; }
        .fluxxis-dash-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }
        .fluxxis-dash-table-wrap { overflow-x: auto; }
        @media (max-width: 1024px) {
          .fluxxis-dash-kpi-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        }
        @media (max-width: 768px) {
          .fluxxis-dash-sidebar { transform: translateX(-100%); width: 260px; position: fixed; z-index: 50; }
          .fluxxis-dash-sidebar.fluxxis-dash-mobile-open { transform: translateX(0); }
          .fluxxis-dash-overlay { display: none; }
          .fluxxis-dash-overlay.fluxxis-dash-overlay-active { display: block; }
          .fluxxis-dash-mobile-btn { display: flex !important; }
          .fluxxis-dash-sidebar-toggle { display: none; }
          .fluxxis-dash-kpi-grid { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; }
        }
        @media (max-width: 480px) {
          .fluxxis-dash-kpi-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* Mobile overlay */}
      <div
        ref={overlayRef}
        tabIndex={-1}
        className={`fluxxis-dash-overlay${mobileOpen ? ' fluxxis-dash-overlay-active' : ''}`}
        onClick={() => setMobileOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setMobileOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 45,
          display: mobileOpen ? 'block' : 'none',
        }}
        aria-hidden="true"
      />

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        id="fluxxis-sidebar"
        className={`fluxxis-dash-sidebar${collapsed ? ' fluxxis-dash-collapsed' : ''}${mobileOpen ? ' fluxxis-dash-mobile-open' : ''}`}
        aria-label="Main navigation"
        style={{
          width: sidebarWidth,
          minWidth: collapsed ? 64 : 250,
          background: 'var(--flux-bg-secondary, #0e0e18)',
          borderRight: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          overflow: 'hidden',
          transition: 'width var(--flux-transition-base, 200ms ease)',
        }}
      >
        {/* Brand + Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '1rem 1.25rem',
            height: 60,
            borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
            flexShrink: 0,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 34,
              height: 34,
              background: 'linear-gradient(135deg, var(--flux-accent-primary, #00d4aa) 0%, var(--flux-accent-secondary, #22d3ee) 100%)',
              borderRadius: 'var(--flux-radius-sm, 6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--flux-text-inverse, #08080f)',
              fontWeight: 800,
              fontSize: '1.1rem',
              flexShrink: 0,
            }}
          >
            F
          </span>
          <span
            className="fluxxis-dash-sidebar-text"
            style={{
              fontWeight: 800,
              fontSize: 'var(--flux-font-size-xl, 1.25rem)',
              color: 'var(--flux-text-primary, #f0f0f5)',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.02em',
            }}
          >
            Fluxxis
          </span>
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          type="button"
          className="fluxxis-dash-sidebar-toggle"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            position: 'absolute',
            right: -12,
            top: 74,
            width: 24,
            height: 24,
            background: 'var(--flux-bg-elevated, #1a1a2e)',
            border: '1px solid var(--flux-border-strong, rgba(255,255,255,0.14))',
            borderRadius: 'var(--flux-radius-full, 9999px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--flux-text-secondary, #b0b0c0)',
            zIndex: 51,
            padding: 0,
            transform: collapsed ? 'rotate(180deg)' : 'none',
            transition: 'transform var(--flux-transition-fast, 120ms ease)',
          }}
        >
          <ChevronLeftIcon />
        </button>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            padding: '1rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            overflowY: 'auto',
          }}
        >
          <span
            className="fluxxis-dash-sidebar-text"
            style={{
              fontSize: 'var(--flux-font-size-xs, 0.75rem)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--flux-text-tertiary, #787890)',
              padding: '0.75rem 0.5rem 0.375rem',
              whiteSpace: 'nowrap',
            }}
          >
            Main
          </span>
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className="fluxxis-dash-nav-link"
              aria-current={item.active ? 'page' : undefined}
              onClick={(e) => e.preventDefault()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--flux-radius-sm, 6px)',
                color: item.active
                  ? 'var(--flux-accent-primary, #00d4aa)'
                  : 'var(--flux-text-secondary, #b0b0c0)',
                textDecoration: 'none',
                fontSize: 'var(--flux-font-size-sm, 0.875rem)',
                fontWeight: item.active ? 600 : 500,
                whiteSpace: 'nowrap',
                background: item.active ? 'var(--flux-accent-soft, rgba(0,212,170,0.10))' : 'transparent',
                transition: 'all var(--flux-transition-fast, 120ms ease)',
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.background = 'var(--flux-bg-elevated, #1a1a2e)'
                  e.currentTarget.style.color = 'var(--flux-text-primary, #f0f0f5)'
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--flux-text-secondary, #b0b0c0)'
                }
              }}
            >
              <span style={{ display: 'flex', flexShrink: 0, opacity: item.active ? 1 : 0.7 }}>
                <item.icon />
              </span>
              <span className="fluxxis-dash-sidebar-text">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Sidebar footer — Upgrade to Pro */}
        <div
          style={{
            padding: '0.75rem',
            borderTop: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '0.625rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--flux-radius-sm, 6px)',
              background: 'var(--flux-accent-primary, #00d4aa)',
              color: 'var(--flux-text-inverse, #08080f)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--flux-font-sans, Inter, sans-serif)',
              fontSize: 'var(--flux-font-size-xs, 0.75rem)',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              transition: 'box-shadow var(--flux-transition-fast, 120ms ease)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--flux-shadow-glow, 0 0 40px rgba(0,212,170,0.28))'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <span style={{ flexShrink: 0, fontSize: '0.875rem' }} aria-hidden="true">⚡</span>
            <span className="fluxxis-dash-sidebar-text">Upgrade to Pro</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          marginLeft: sidebarWidth,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left var(--flux-transition-base, 200ms ease)',
        }}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header
          role="banner"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--flux-space-6, 1.5rem)',
            height: 60,
            borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
            background: 'var(--flux-bg-primary, #08080f)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Mobile menu button */}
            <button
              type="button"
              className="fluxxis-dash-mobile-btn"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="fluxxis-sidebar"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                color: 'var(--flux-text-primary, #f0f0f5)',
                cursor: 'pointer',
                padding: '0.375rem',
              }}
            >
              <MenuIcon />
            </button>

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb">
              <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
                <li>
                  <span style={{ fontSize: 'var(--flux-font-size-sm, 0.875rem)', color: 'var(--flux-text-tertiary, #787890)' }}>
                    Dashboard
                  </span>
                </li>
                <li aria-hidden="true" style={{ color: 'var(--flux-text-tertiary, #787890)', opacity: 0.5 }}>/</li>
                <li>
                  <span style={{ fontSize: 'var(--flux-font-size-sm, 0.875rem)', color: 'var(--flux-text-primary, #f0f0f5)', fontWeight: 600 }}>
                    Overview
                  </span>
                </li>
              </ol>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* User avatar */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 'var(--flux-radius-full, 9999px)',
                background: 'linear-gradient(135deg, var(--flux-accent-primary, #00d4aa) 0%, var(--flux-accent-secondary, #22d3ee) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--flux-text-inverse, #08080f)',
                fontWeight: 700,
                fontSize: 'var(--flux-font-size-xs, 0.75rem)',
                flexShrink: 0,
              }}
              aria-label="User avatar"
            >
              LS
            </div>
            {/* Admin badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.125rem 0.5rem',
                borderRadius: 'var(--flux-radius-full, 9999px)',
                fontSize: 'var(--flux-font-size-xs, 0.75rem)',
                fontWeight: 600,
                background: 'var(--flux-accent-soft, rgba(0,212,170,0.10))',
                color: 'var(--flux-accent-primary, #00d4aa)',
                border: '1px solid var(--flux-border-accent, rgba(0,212,170,0.35))',
              }}
            >
              Admin
            </span>
          </div>
        </header>

        {/* ── Main ───────────────────────────────────────────────────────── */}
        <main
          style={{
            flex: 1,
            padding: 'var(--flux-space-6, 1.5rem)',
            maxWidth: 1400,
          }}
        >
          {/* Page title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--flux-space-6, 1.5rem)',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <h1
              style={{
                fontSize: 'var(--flux-font-size-2xl, 1.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              Dashboard Overview
            </h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--flux-radius-sm, 6px)',
                  background: 'transparent',
                  color: 'var(--flux-text-secondary, #b0b0c0)',
                  border: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                  cursor: 'pointer',
                  fontFamily: 'var(--flux-font-sans, Inter, sans-serif)',
                  fontSize: 'var(--flux-font-size-xs, 0.75rem)',
                  fontWeight: 600,
                  transition: 'all var(--flux-transition-fast, 120ms ease)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--flux-border-strong, rgba(255,255,255,0.14))'
                  e.currentTarget.style.color = 'var(--flux-text-primary, #f0f0f5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--flux-border-default, rgba(255,255,255,0.08))'
                  e.currentTarget.style.color = 'var(--flux-text-secondary, #b0b0c0)'
                }}
              >
                Export CSV
              </button>
              <button
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--flux-radius-sm, 6px)',
                  background: 'transparent',
                  color: 'var(--flux-text-secondary, #b0b0c0)',
                  border: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                  cursor: 'pointer',
                  fontFamily: 'var(--flux-font-sans, Inter, sans-serif)',
                  fontSize: 'var(--flux-font-size-xs, 0.75rem)',
                  fontWeight: 600,
                  transition: 'all var(--flux-transition-fast, 120ms ease)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--flux-border-strong, rgba(255,255,255,0.14))'
                  e.currentTarget.style.color = 'var(--flux-text-primary, #f0f0f5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--flux-border-default, rgba(255,255,255,0.08))'
                  e.currentTarget.style.color = 'var(--flux-text-secondary, #b0b0c0)'
                }}
              >
                Last 30 days
              </button>
            </div>
          </div>

          {/* ── KPI Cards ─────────────────────────────────────────────── */}
          <div className="fluxxis-dash-kpi-grid" style={{ marginBottom: 'var(--flux-space-6, 1.5rem)' }}>
            {kpis.map((kpi, i) => {
              const KpiIcon = kpiIcons[i]
              return (
                <div
                  key={kpi.label}
                  style={{
                    background: 'var(--flux-bg-elevated, #1a1a2e)',
                    border: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                    borderRadius: 'var(--flux-radius-md, 10px)',
                    padding: 'var(--flux-space-5, 1.25rem) var(--flux-space-6, 1.5rem)',
                    transition: 'all var(--flux-transition-fast, 120ms ease)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--flux-border-strong, rgba(255,255,255,0.14))'
                    e.currentTarget.style.background = 'var(--flux-bg-tertiary, #14141f)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--flux-border-default, rgba(255,255,255,0.08))'
                    e.currentTarget.style.background = 'var(--flux-bg-elevated, #1a1a2e)'
                  }}
                >
                  {/* Header row: label + icon */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--flux-font-size-xs, 0.75rem)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--flux-text-tertiary, #787890)',
                      }}
                    >
                      {kpi.label}
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--flux-radius-sm, 6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--flux-accent-soft, rgba(0,212,170,0.10))',
                        color: 'var(--flux-accent-primary, #00d4aa)',
                      }}
                    >
                      <KpiIcon />
                    </span>
                  </div>
                  {/* Value */}
                  <div
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.2,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {kpi.value}
                  </div>
                  {/* Change */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: 'var(--flux-font-size-xs, 0.75rem)',
                      fontWeight: 600,
                      marginTop: '0.375rem',
                      color: 'var(--flux-accent-primary, #00d4aa)',
                    }}
                  >
                    <span aria-hidden="true">↑</span> {kpi.changePercent}% {kpi.changeLabel}
                  </span>
                </div>
              )
            })}
          </div>

          {/* ── Variants Table ─────────────────────────────────────────── */}
          <div
            style={{
              background: 'var(--flux-bg-elevated, #1a1a2e)',
              border: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
              borderRadius: 'var(--flux-radius-md, 10px)',
              overflow: 'hidden',
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--flux-space-4, 1rem) var(--flux-space-6, 1.5rem)',
                borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <h3 style={{ fontSize: 'var(--flux-font-size-base, 1rem)', fontWeight: 700, margin: 0 }}>
                Active Variants
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.375rem 0.75rem',
                    borderRadius: 'var(--flux-radius-sm, 6px)',
                    background: 'transparent',
                    color: 'var(--flux-text-secondary, #b0b0c0)',
                    border: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                    cursor: 'pointer',
                    fontFamily: 'var(--flux-font-sans, Inter, sans-serif)',
                    fontSize: 'var(--flux-font-size-xs, 0.75rem)',
                    fontWeight: 600,
                  }}
                >
                  All Status
                </button>
                <button
                  type="button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.375rem 0.75rem',
                    borderRadius: 'var(--flux-radius-sm, 6px)',
                    background: 'transparent',
                    color: 'var(--flux-text-secondary, #b0b0c0)',
                    border: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                    cursor: 'pointer',
                    fontFamily: 'var(--flux-font-sans, Inter, sans-serif)',
                    fontSize: 'var(--flux-font-size-xs, 0.75rem)',
                    fontWeight: 600,
                  }}
                >
                  All Types
                </button>
              </div>
            </div>

            {/* Scrollable table */}
            <div className="fluxxis-dash-table-wrap">
              <table
                aria-label="Variants table"
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 'var(--flux-font-size-sm, 0.875rem)',
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--flux-text-tertiary, #787890)',
                        background: 'var(--flux-bg-secondary, #0e0e18)',
                        borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Variant Name
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--flux-text-tertiary, #787890)',
                        background: 'var(--flux-bg-secondary, #0e0e18)',
                        borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        textAlign: 'right',
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--flux-text-tertiary, #787890)',
                        background: 'var(--flux-bg-secondary, #0e0e18)',
                        borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Impressions
                    </th>
                    <th
                      className="fluxxis-dash-col-ctr"
                      style={{
                        textAlign: 'right',
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--flux-text-tertiary, #787890)',
                        background: 'var(--flux-bg-secondary, #0e0e18)',
                        borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      CTR
                    </th>
                    <th
                      className="fluxxis-dash-col-conv"
                      style={{
                        textAlign: 'right',
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--flux-text-tertiary, #787890)',
                        background: 'var(--flux-bg-secondary, #0e0e18)',
                        borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Conversion
                    </th>
                    <th
                      className="fluxxis-dash-col-rev"
                      style={{
                        textAlign: 'right',
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--flux-text-tertiary, #787890)',
                        background: 'var(--flux-bg-secondary, #0e0e18)',
                        borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => {
                    const st = statusStyles[variant.status]
                    return (
                      <tr
                        key={variant.id}
                        style={{ transition: 'background var(--flux-transition-fast, 120ms ease)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--flux-bg-secondary, #0e0e18)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <td
                          style={{
                            padding: '0.75rem 1.5rem',
                            borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                            verticalAlign: 'middle',
                          }}
                        >
                          <span style={{ fontWeight: 600, color: 'var(--flux-text-primary, #f0f0f5)' }}>
                            {variant.name}
                          </span>
                          <br />
                          <span style={{ fontSize: 'var(--flux-font-size-xs, 0.75rem)', color: 'var(--flux-text-tertiary, #787890)' }}>
                            {variant.id}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '0.75rem 1.5rem',
                            borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                            verticalAlign: 'middle',
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.375rem',
                              padding: '0.25rem 0.625rem',
                              borderRadius: 'var(--flux-radius-full, 9999px)',
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              whiteSpace: 'nowrap',
                              background: st.bg,
                              color: st.color,
                            }}
                          >
                            <span
                              aria-hidden="true"
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: 'var(--flux-radius-full, 9999px)',
                                background: st.dot,
                              }}
                            />
                            {variant.status}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '0.75rem 1.5rem',
                            borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                            verticalAlign: 'middle',
                            textAlign: 'right',
                            fontVariantNumeric: 'tabular-nums',
                            fontWeight: 500,
                          }}
                        >
                          {variant.impressions.toLocaleString()}
                        </td>
                        <td
                          className="fluxxis-dash-col-ctr"
                          style={{
                            padding: '0.75rem 1.5rem',
                            borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                            verticalAlign: 'middle',
                            textAlign: 'right',
                            fontVariantNumeric: 'tabular-nums',
                            fontWeight: 500,
                          }}
                        >
                          {variant.ctr}
                        </td>
                        <td
                          className="fluxxis-dash-col-conv"
                          style={{
                            padding: '0.75rem 1.5rem',
                            borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                            verticalAlign: 'middle',
                            textAlign: 'right',
                            fontVariantNumeric: 'tabular-nums',
                            fontWeight: 500,
                          }}
                        >
                          {variant.conversion}
                        </td>
                        <td
                          className="fluxxis-dash-col-rev"
                          style={{
                            padding: '0.75rem 1.5rem',
                            borderBottom: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                            verticalAlign: 'middle',
                            textAlign: 'right',
                            fontVariantNumeric: 'tabular-nums',
                            fontWeight: 500,
                          }}
                        >
                          {variant.revenue}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </section>
  )
}

export default DashboardSection
