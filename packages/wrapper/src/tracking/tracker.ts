// Fluxxis Tracker — Client-side behavior signal capture
// Eventos: page_view, scroll, click, dwell, hover, exit_intent

export type SignalType = 'page_view' | 'scroll' | 'click' | 'dwell' | 'hover' | 'exit_intent'

export interface SignalPayload {
  url: string
  timestamp: string
  scroll_depth?: number       // 0-100
  dwell_ms?: number           // tempo na pagina
  element_id?: string         // elemento clicado/hovered
  element_type?: string       // button, link, input, card
  element_text?: string       // texto do elemento (truncado a 100 chars)
  page_title?: string
  referrer?: string
}

export interface TrackerConfig {
  endpoint: string             // URL do backend de sinais
  sessionToken: string         // token anonimo da sessao
  clientId: string             // identificador do site
  consentGiven: boolean        // so envia se true
  throttleMs?: number          // min interval between signals (default: 200ms)
}

export class Tracker {
  private config: TrackerConfig
  private lastSignalTime = 0
  private dwellTimer: ReturnType<typeof setTimeout> | null = null
  private dwellStart = 0
  private scrollDepth = 0

  constructor(config: TrackerConfig) {
    this.config = { throttleMs: 200, ...config }
    if (config.consentGiven) {
      this.attach()
    }
  }

  // ── Public API ──

  /** Call when consent changes */
  setConsent(given: boolean): void {
    this.config.consentGiven = given
    if (given) {
      this.attach()
      this.trackPageView()
    } else {
      this.detach()
    }
  }

  /** Manual signal */
  async track(type: SignalType, payload: Partial<SignalPayload> = {}): Promise<void> {
    if (!this.config.consentGiven) return

    const now = Date.now()
    if (now - this.lastSignalTime < (this.config.throttleMs || 200)) return
    this.lastSignalTime = now

    const signal: SignalPayload = {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      page_title: document.title,
      referrer: document.referrer || undefined,
      ...payload
    }

    try {
      // Fire-and-forget — não bloqueia a UI
      navigator.sendBeacon(
        this.config.endpoint,
        JSON.stringify({
          session_token: this.config.sessionToken,
          client_id: this.config.clientId,
          signal_type: type,
          payload: signal
        })
      )
    } catch {
      // Fallback: fetch (pode bloquear no unload)
      fetch(this.config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_token: this.config.sessionToken,
          client_id: this.config.clientId,
          signal_type: type,
          payload: signal
        }),
        keepalive: true
      }).catch(() => { /* silent */ })
    }
  }

  // ── Private ──

  private attach(): void {
    // Page view — fire immediately
    this.trackPageView()

    // Scroll depth
    window.addEventListener('scroll', this.onScroll, { passive: true })

    // Clicks
    document.addEventListener('click', this.onClick)

    // Dwell (tempo na pagina)
    window.addEventListener('focus', this.onFocus)
    window.addEventListener('blur', this.onBlur)
    window.addEventListener('beforeunload', this.onUnload)

    // Hover em elementos interativos (delegacao)
    document.addEventListener('mouseover', this.onHover)
  }

  private detach(): void {
    window.removeEventListener('scroll', this.onScroll)
    document.removeEventListener('click', this.onClick)
    window.removeEventListener('focus', this.onFocus)
    window.removeEventListener('blur', this.onBlur)
    window.removeEventListener('beforeunload', this.onUnload)
    document.removeEventListener('mouseover', this.onHover)
  }

  private trackPageView = (): void => {
    this.track('page_view', {})
  }

  private onScroll = (): void => {
    const docEl = document.documentElement
    if (!docEl) return
    const total = docEl.scrollHeight - docEl.clientHeight
    if (total <= 0) return
    const depth = Math.round((window.scrollY / total) * 100)
    if (depth > this.scrollDepth + 5) {
      this.scrollDepth = depth
      this.track('scroll', { scroll_depth: depth })
    }
  }

  private onClick = (e: MouseEvent): void => {
    const el = e.target as HTMLElement | null
    if (!el) return
    const interactive = el.closest('button, a, input, [role="button"], [data-fluxxis-track]')
    if (!interactive) return

    const text = (interactive.textContent || '').trim().slice(0, 100)
    this.track('click', {
      element_id: interactive.id || undefined,
      element_type: interactive.tagName.toLowerCase(),
      element_text: text || undefined
    })
  }

  private onFocus = (): void => {
    this.dwellStart = Date.now()
  }

  private onBlur = (): void => {
    if (this.dwellStart > 0) {
      const dwell = Date.now() - this.dwellStart
      this.dwellStart = 0
      if (dwell > 2000) {
        this.track('dwell', { dwell_ms: dwell })
      }
    }
  }

  private onUnload = (): void => {
    this.onBlur()
    this.track('exit_intent', {
      dwell_ms: this.dwellStart > 0 ? Date.now() - this.dwellStart : undefined,
      scroll_depth: this.scrollDepth
    })
  }

  private onHover = (e: MouseEvent): void => {
    const el = e.target as HTMLElement | null
    if (!el) return
    const interactive = el.closest('[data-fluxxis-track]')
    if (!interactive) return

    const text = (interactive.textContent || '').trim().slice(0, 100)
    // Debounced: so envia se hover durar >1s
    let hovered = false
    const timer = setTimeout(() => {
      hovered = true
      this.track('hover', {
        element_id: interactive.id || undefined,
        element_type: interactive.tagName.toLowerCase(),
        element_text: text || undefined
      })
    }, 1000)

    interactive.addEventListener('mouseleave', () => {
      clearTimeout(timer)
    }, { once: true })
  }
}

// Singleton
let instance: Tracker | null = null

export function initTracker(config: TrackerConfig): Tracker {
  if (!instance) {
    instance = new Tracker(config)
  }
  return instance
}

export function getTracker(): Tracker | null {
  return instance
}
