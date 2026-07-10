// Fluxxis Intent Schema — Design System-agnostic intermediate representation
// Based on SPEC (SpecifyUI) + A2UI Protocol (Macaron)

export type IntentType = 'browse' | 'buy' | 'compare' | 'learn'
export type GoalType = 'convert' | 'inform' | 'engage'
export type PriorityType = 'low' | 'normal' | 'high'
export type ActorType = 'human' | 'agent'
export type EmphasisLevel = 'low' | 'medium' | 'high'
export type AnimationStyle = 'none' | 'subtle_pulse' | 'shimmer' | 'rainbow' | 'blur_fade'
export type HierarchyLevel = 'primary' | 'secondary' | 'tertiary'

export interface CopyVariants {
  primary: string        // Main CTA text (e.g., "Buy Now")
  secondary?: string     // Alternative text (e.g., "Add to Cart")
  microcopy?: string     // Helper text (e.g., "Free shipping over $50")
}

export interface ComponentState {
  default: string        // e.g., "visible", "enabled"
  hover: string          // e.g., "elevate+glow", "color_shift"
  active: string         // e.g., "depress", "scale_down"
  focus: string          // e.g., "ring", "outline"
  disabled: string       // e.g., "muted", "greyed_out"
}

export interface IntentVisual {
  emphasis: EmphasisLevel
  animation: AnimationStyle
  hierarchy: HierarchyLevel
}

export interface IntentComponent {
  type: string           // e.g., "cta", "card", "input", "nav"
  copy: CopyVariants
  visual: IntentVisual
  state: ComponentState
}

export interface IntentSchema {
  intent: IntentType
  goal: GoalType
  priority: PriorityType
  actor: ActorType
  component: IntentComponent
  context?: Record<string, string>  // Additional context (page, user segment, etc.)
}

// Resolved tokens — concrete values after DS Adapter
export interface ResolvedTokens {
  backgroundColor: string
  textColor: string
  borderColor: string
  borderRadius: string
  padding: string
  fontFamily: string
  fontSize: string
  fontWeight: string
  lineHeight: string
  boxShadow: string
  transition: string
  hoverBackgroundColor: string
  hoverBoxShadow: string
  hoverTransform: string
  activeBackgroundColor: string
  activeTransform: string
  focusOutline: string
  disabledOpacity: number
  copy: CopyVariants
}
