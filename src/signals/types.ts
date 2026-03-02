/**
 * Signal Types
 * 
 * Defines the structure for behavioral signals
 */

/**
 * Signal types
 */
export type SignalType = 
  | 'hover'
  | 'click'
  | 'scroll'
  | 'dwell'
  | 'viewport'
  | 'focus'
  | 'blur'
  | 'api-call';

/**
 * Actor type (human or agent)
 */
export type ActorType = 'human' | 'agent' | 'unknown';

/**
 * Signal context
 */
export interface SignalContext {
  /** Component ID where signal originated */
  componentId?: string;
  /** Page/URL where signal occurred */
  page?: string;
  /** Device type */
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  /** User type (if known) */
  userType?: 'new' | 'returning' | 'power';
  /** Position (for hover/click) */
  position?: {
    x: number;
    y: number;
  };
  /** Scroll velocity (pixels/second) */
  scrollVelocity?: number;
  /** Scroll depth (0-100%) */
  scrollDepth?: number;
  /** API endpoint (for api-call signals) */
  endpoint?: string;
  /** Source of signal */
  source?: 'ui' | 'api' | 'system';
  /** Additional context */
  [key: string]: any;
}

/**
 * Signal interface
 */
export interface Signal {
  /** Signal type */
  type: SignalType;
  /** Signal value (duration, count, etc.) */
  value: number;
  /** Unix timestamp */
  timestamp: number;
  /** Detected actor type */
  actorType?: ActorType;
  /** Detection confidence (0-1) */
  detectionConfidence?: number;
  /** Signal context */
  context?: SignalContext;
  /** Session ID (anonymized) */
  sessionId?: string;
  /** Component intent */
  intent?: {
    goal: 'convert' | 'inform' | 'engage';
    priority: 'low' | 'normal' | 'high';
  };
}

/**
 * Aggregated signal metrics
 */
export interface SignalAggregates {
  /** Total signals */
  total: number;
  /** Average hover time (ms) */
  avgHoverTime: number;
  /** Total clicks */
  clickCount: number;
  /** Average scroll depth (%) */
  avgScrollDepth: number;
  /** Total dwell time (ms) */
  totalDwellTime: number;
  /** First signal timestamp */
  firstSignal: number;
  /** Last signal timestamp */
  lastSignal: number;
  /** Detected actor type */
  actorType: ActorType;
  /** Detection confidence */
  confidence: number;
}

/**
 * Signal processor interface
 */
export interface SignalProcessor {
  /** Capture a new signal */
  capture(signal: Signal): void;
  /** Get signal history for component */
  getHistory(componentId: string): Signal[];
  /** Get aggregated metrics */
  getAggregates(componentId: string): SignalAggregates;
  /** Clear signals */
  clear(componentId?: string): void;
}
