// Fluxxis IntentProvider — Exposes current user intent to children
// Uses local signals (via Tracker) + lightweight heuristics before ML models

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { IntentSchema, IntentType, GoalType, EmphasisLevel, HierarchyLevel } from '../intent-schema'
import { createIntent } from '../SmartCTA'
import { getTracker } from './tracker'

// ── Signal buffer (in-memory, client-side) ──

interface SignalSummary {
  pageViews: number
  totalDwellMs: number
  scrollDepths: number[]
  clicksOnPricing: number
  clicksOnDocs: number
  clicksOnDemo: number
  clicksOnCTA: number
  returnVisits: number
  lastUrl: string
}

let signalBuffer: SignalSummary = {
  pageViews: 0,
  totalDwellMs: 0,
  scrollDepths: [],
  clicksOnPricing: 0,
  clicksOnDocs: 0,
  clicksOnDemo: 0,
  clicksOnCTA: 0,
  returnVisits: 0,
  lastUrl: ''
}

// Track return visits via sessionStorage
function trackReturnVisit(): number {
  try {
    const visits = parseInt(sessionStorage.getItem('fluxxis_visits') || '0', 10) + 1
    sessionStorage.setItem('fluxxis_visits', String(visits))
    return visits
  } catch { return 1 }
}

// ── Heuristic Intent Predictor (antes do ML) ──

interface IntentPrediction {
  intent: IntentType
  goal: GoalType
  confidence: number
  emphasis: EmphasisLevel
  hierarchy: HierarchyLevel
  copy: string
}

function predictIntentFromSignals(signals: SignalSummary): IntentPrediction {
  const avgScroll = signals.scrollDepths.length > 0
    ? signals.scrollDepths.reduce((a, b) => a + b, 0) / signals.scrollDepths.length
    : 0

  const avgDwell = signals.totalDwellMs / Math.max(signals.pageViews, 1)

  // Heuristic 1: High engagement + pricing clicks → BUY
  if (signals.clicksOnPricing >= 2 && avgScroll > 50 && avgDwell > 15000) {
    return {
      intent: 'buy',
      goal: 'convert',
      confidence: 0.85,
      emphasis: 'high',
      hierarchy: 'primary',
      copy: signals.returnVisits >= 3 ? 'Get Started Now' : 'See Pricing'
    }
  }

  // Heuristic 2: Docs clicks + long dwell → LEARN
  if (signals.clicksOnDocs >= 2 && avgDwell > 20000) {
    return {
      intent: 'learn',
      goal: 'inform',
      confidence: 0.8,
      emphasis: 'medium',
      hierarchy: 'secondary',
      copy: 'Read the Docs'
    }
  }

  // Heuristic 3: Demo clicks → ENGAGE
  if (signals.clicksOnDemo >= 2 || signals.clicksOnCTA >= 3) {
    return {
      intent: 'browse',
      goal: 'engage',
      confidence: 0.75,
      emphasis: 'low',
      hierarchy: 'tertiary',
      copy: 'Try Demo'
    }
  }

  // Heuristic 4: First visit, low scroll → BROWSE (default)
  return {
    intent: 'browse',
    goal: 'engage',
    confidence: 0.6,
    emphasis: 'medium',
    hierarchy: 'secondary',
    copy: 'Learn More'
  }
}

// ── Context ──

interface IntentContextValue {
  intent: IntentSchema
  confidence: number
  signals: SignalSummary
  refreshIntent: () => void
}

const IntentContext = createContext<IntentContextValue>({
  intent: createIntent('browse', 'engage', 'Learn More', 'medium', 'secondary', 'none'),
  confidence: 0.5,
  signals: signalBuffer,
  refreshIntent: () => {}
})

export function useFluxxisIntent(): IntentContextValue {
  return useContext(IntentContext)
}

// ── Provider ──

interface IntentProviderProps {
  children: React.ReactNode
  /** Intervalo de refresh (ms). Default: 5000 (5 segundos) */
  refreshIntervalMs?: number
}

export const IntentProvider: React.FC<IntentProviderProps> = ({
  children,
  refreshIntervalMs = 5000
}) => {
  const [prediction, setPrediction] = useState<IntentPrediction>(() =>
    predictIntentFromSignals(signalBuffer)
  )

  const refreshIntent = useCallback(() => {
    signalBuffer.returnVisits = trackReturnVisit()

    // Update clicks from DOM (lightweight, no backend needed for PoC)
    // In production: fetch from /api/fluxxis/signals
    signalBuffer.lastUrl = window.location.href

    const pred = predictIntentFromSignals(signalBuffer)
    setPrediction(pred)
  }, [])

  // Periodic refresh
  useEffect(() => {
    const timer = setInterval(refreshIntent, refreshIntervalMs)
    return () => clearInterval(timer)
  }, [refreshIntent, refreshIntervalMs])

  const intent = createIntent(
    prediction.intent,
    prediction.goal,
    prediction.copy,
    prediction.emphasis,
    prediction.hierarchy,
    prediction.intent === 'buy' ? 'subtle_pulse' : 'none'
  )

  return (
    <IntentContext.Provider
      value={{
        intent,
        confidence: prediction.confidence,
        signals: signalBuffer,
        refreshIntent
      }}
    >
      {children}
    </IntentContext.Provider>
  )
}

// ── Export signal buffer for external mutation (Tracker calls this) ──

export function recordSignal(type: string, payload: Record<string, unknown> = {}): void {
  switch (type) {
    case 'page_view':
      signalBuffer.pageViews++
      break
    case 'dwell':
      signalBuffer.totalDwellMs += (payload.dwell_ms as number) || 0
      break
    case 'scroll': {
      const depth = payload.scroll_depth as number
      if (typeof depth === 'number') signalBuffer.scrollDepths.push(depth)
      break
    }
    case 'click': {
      const text = (payload.element_text as string || '').toLowerCase()
      const id = (payload.element_id as string || '').toLowerCase()
      if (text.includes('pric') || text.includes('buy') || id.includes('pric')) {
        signalBuffer.clicksOnPricing++
      } else if (text.includes('doc') || text.includes('guide') || id.includes('doc')) {
        signalBuffer.clicksOnDocs++
      } else if (text.includes('demo') || text.includes('try') || id.includes('demo')) {
        signalBuffer.clicksOnDemo++
      } else if (payload.element_type === 'button' || payload.element_type === 'a') {
        signalBuffer.clicksOnCTA++
      }
      break
    }
  }
}
