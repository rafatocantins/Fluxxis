/**
 * Agent Detection Module
 * 
 * Detects if user interaction is from a human or AI agent
 * Uses behavioral heuristics and pattern analysis
 */

import type { Signal } from './types';

/**
 * Agent detection result
 */
export interface AgentDetectionResult {
  /** Detected actor type */
  actorType: 'human' | 'agent' | 'unknown';
  /** Confidence score (0-1) */
  confidence: number;
  /** Reasons for detection */
  reasons: string[];
  /** Timestamp of detection */
  timestamp: number;
}

/**
 * Navigation pattern types
 */
export type NavigationPattern = 'human' | 'systematic' | 'random' | 'optimized';

/**
 * Calculate click rate (clicks per second)
 */
export function calculateClickRate(signals: Signal[]): number {
  const clickSignals = signals.filter(s => s.type === 'click');
  
  if (clickSignals.length < 2) {
    return 0;
  }

  const firstClick = clickSignals[0].timestamp;
  const lastClick = clickSignals[clickSignals.length - 1].timestamp;
  const duration = (lastClick - firstClick) / 1000; // Convert to seconds

  if (duration === 0) {
    return 0;
  }

  return clickSignals.length / duration;
}

/**
 * Analyze navigation pattern
 */
export function analyzeNavigationPattern(signals: Signal[]): NavigationPattern {
  if (signals.length < 3) {
    return 'human';
  }

  // Check for systematic patterns (agents often navigate in predictable sequences)
  const pageViews = signals.filter(s => s.type === 'viewport');
  
  if (pageViews.length < 2) {
    return 'human';
  }

  // Calculate variance in timing between page views
  const intervals: number[] = [];
  for (let i = 1; i < pageViews.length; i++) {
    intervals.push(pageViews[i].timestamp - pageViews[i - 1].timestamp);
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / avgInterval;

  // Low variance = systematic (agent)
  // High variance = human
  if (coefficientOfVariation < 0.1) {
    return 'systematic';
  } else if (coefficientOfVariation > 0.5) {
    return 'random';
  } else {
    return 'human';
  }
}

/**
 * Check if user accepts structured data (agents typically do)
 */
export function checkStructuredDataAcceptance(signals: Signal[]): boolean {
  // Look for Accept headers or API usage patterns
  const apiSignals = signals.filter(s => 
    s.type === 'click' && 
    s.context?.endpoint?.includes('/api/')
  );

  return apiSignals.length > 0;
}

/**
 * Check for API usage patterns
 */
export function checkAPIUsage(signals: Signal[]): boolean {
  const apiSignals = signals.filter(s => 
    s.context?.source === 'api' ||
    s.context?.endpoint?.includes('/api/')
  );

  return apiSignals.length > 0;
}

/**
 * Detect scroll patterns (humans have natural variation, agents are often uniform)
 */
export function analyzeScrollPattern(signals: Signal[]): 'human' | 'agent' {
  const scrollSignals = signals.filter(s => s.type === 'scroll');
  
  if (scrollSignals.length < 3) {
    return 'human';
  }

  // Analyze scroll velocity variance
  const velocities = scrollSignals.map(s => s.context?.scrollVelocity || 0);
  const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
  const variance = velocities.reduce((a, b) => a + Math.pow(b - avgVelocity, 2), 0) / velocities.length;

  // Humans have varied scroll speeds, agents often have uniform speeds
  if (variance < 10) {
    return 'agent';
  }

  return 'human';
}

/**
 * Detect hover patterns (humans have natural micro-movements)
 */
export function analyzeHoverPattern(signals: Signal[]): 'human' | 'agent' {
  const hoverSignals = signals.filter(s => s.type === 'hover');
  
  if (hoverSignals.length < 3) {
    return 'human';
  }

  // Check for micro-movements (humans have natural hand tremor)
  const positions = hoverSignals.map(s => ({
    x: s.context?.position?.x || 0,
    y: s.context?.position?.y || 0,
  }));

  let totalMovement = 0;
  for (let i = 1; i < positions.length; i++) {
    const dx = positions[i].x - positions[i - 1].x;
    const dy = positions[i].y - positions[i - 1].y;
    totalMovement += Math.sqrt(dx * dx + dy * dy);
  }

  const avgMovement = totalMovement / positions.length;

  // Agents often have perfectly still hovers, humans have micro-movements
  if (avgMovement < 0.5) {
    return 'agent';
  }

  return 'human';
}

/**
 * Main detection function
 */
export function detectActorType(signals: Signal[]): AgentDetectionResult {
  const reasons: string[] = [];
  let agentScore = 0;
  let humanScore = 0;

  // Heuristic 1: Click rate >100/s = agent (+0.4)
  const clickRate = calculateClickRate(signals);
  if (clickRate > 100) {
    agentScore += 0.4;
    reasons.push(`High click rate: ${clickRate.toFixed(1)}/s (threshold: 100/s)`);
  } else if (clickRate > 0 && clickRate <= 10) {
    humanScore += 0.2;
    reasons.push(`Normal click rate: ${clickRate.toFixed(1)}/s`);
  }

  // Heuristic 2: Systematic navigation = agent (+0.3)
  const navigationPattern = analyzeNavigationPattern(signals);
  if (navigationPattern === 'systematic') {
    agentScore += 0.3;
    reasons.push('Systematic navigation pattern detected');
  } else if (navigationPattern === 'human') {
    humanScore += 0.2;
    reasons.push('Natural navigation pattern');
  }

  // Heuristic 3: Accepts structured data = agent (+0.2)
  const acceptsStructuredData = checkStructuredDataAcceptance(signals);
  if (acceptsStructuredData) {
    agentScore += 0.2;
    reasons.push('Accepts structured data/API responses');
  }

  // Heuristic 4: Uses APIs = agent (+0.3)
  const usesAPIs = checkAPIUsage(signals);
  if (usesAPIs) {
    agentScore += 0.3;
    reasons.push('Direct API usage detected');
  }

  // Heuristic 5: Scroll pattern analysis (+0.2)
  const scrollPattern = analyzeScrollPattern(signals);
  if (scrollPattern === 'agent') {
    agentScore += 0.2;
    reasons.push('Uniform scroll pattern (no natural variation)');
  } else {
    humanScore += 0.1;
    reasons.push('Natural scroll variation');
  }

  // Heuristic 6: Hover pattern analysis (+0.2)
  const hoverPattern = analyzeHoverPattern(signals);
  if (hoverPattern === 'agent') {
    agentScore += 0.2;
    reasons.push('Perfectly still hover (no micro-movements)');
  } else {
    humanScore += 0.1;
    reasons.push('Natural hover micro-movements');
  }

  // Normalize scores
  const totalScore = agentScore + humanScore;
  const finalAgentScore = totalScore > 0 ? agentScore / totalScore : 0;

  // Determine actor type
  let actorType: 'human' | 'agent' | 'unknown';
  if (finalAgentScore >= 0.6) {
    actorType = 'agent';
  } else if (finalAgentScore >= 0.3) {
    actorType = 'unknown';
  } else {
    actorType = 'human';
  }

  return {
    actorType,
    confidence: Math.round(finalAgentScore * 100) / 100,
    reasons,
    timestamp: Date.now(),
  };
}

/**
 * Batch detection for multiple signal streams
 */
export function detectActorTypes(signalStreams: Signal[][]): AgentDetectionResult[] {
  return signalStreams.map(signals => detectActorType(signals));
}

/**
 * Real-time detection (updates as new signals arrive)
 */
export class RealTimeAgentDetector {
  private signals: Signal[] = [];
  private lastDetection: AgentDetectionResult | null = null;
  private readonly threshold: number;

  constructor(threshold: number = 0.6) {
    this.threshold = threshold;
  }

  /**
   * Add new signal and re-evaluate
   */
  addSignal(signal: Signal): AgentDetectionResult {
    this.signals.push(signal);
    
    // Re-detect every 10 signals (performance optimization)
    if (this.signals.length % 10 === 0) {
      this.lastDetection = detectActorType(this.signals);
    }
    
    return this.lastDetection || {
      actorType: 'unknown',
      confidence: 0,
      reasons: ['Insufficient data'],
      timestamp: Date.now(),
    };
  }

  /**
   * Get current detection result
   */
  getCurrentDetection(): AgentDetectionResult {
    return this.lastDetection || {
      actorType: 'unknown',
      confidence: 0,
      reasons: ['No signals yet'],
      timestamp: Date.now(),
    };
  }

  /**
   * Reset detector
   */
  reset(): void {
    this.signals = [];
    this.lastDetection = null;
  }

  /**
   * Check if detected as agent
   */
  isAgent(): boolean {
    return this.lastDetection?.actorType === 'agent';
  }

  /**
   * Check if detected as human
   */
  isHuman(): boolean {
    return this.lastDetection?.actorType === 'human';
  }
}
