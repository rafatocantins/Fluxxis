/** MorphStage intent types */
export type Intent = 'browse' | 'buy' | 'compare' | 'learn'

/** Product feature flags */
export interface ProductFeatures {
  bluetooth: boolean
  noiseCancelling: boolean
  waterproof: boolean
  wireless: boolean
  rgb: boolean
  '4k': boolean
}

/** A single learn step */
export interface LearnStep {
  title: string
  body: string
}

/** Product data shape */
export interface Product {
  id: number
  name: string
  price: number
  currency: string
  description: string
  category: string
  rating: number
  colors: string[]
  imageGradient: string
  imageIcon: string
  features: ProductFeatures
  learnSteps: LearnStep[]
}

/** Feature label mapping for compare table */
export const FEATURE_LABELS: Record<keyof ProductFeatures, string> = {
  bluetooth: 'Bluetooth',
  noiseCancelling: 'Noise Cancelling',
  waterproof: 'Waterproof',
  wireless: 'Wireless',
  rgb: 'RGB Lighting',
  '4k': '4K Resolution',
}

/** Intent → display name mapping */
export const INTENT_NAMES: Record<Intent, string> = {
  browse: 'Browse',
  buy: 'Buy',
  compare: 'Compare',
  learn: 'Learn',
}

/** Intent → emoji icon */
export const INTENT_ICONS: Record<Intent, string> = {
  browse: '🔍',
  buy: '🛒',
  compare: '⚖️',
  learn: '📖',
}

/** Intent → theme color (matching mockup spec — WCAG AA verified) */
export const INTENT_THEME: Record<Intent, string> = {
  browse: 'var(--flux-cyan, #1FA89E)',
  buy: 'var(--flux-pink, #C84074)',
  compare: 'var(--flux-amber, #D4912E)',
  learn: 'var(--flux-violet, #6D4FE0)',
}

/** Intent → CSS class suffix for theming */
export const INTENT_CLASS: Record<Intent, string> = {
  browse: 'browse-theme',
  buy: 'buy-theme',
  compare: 'compare-theme',
  learn: 'learn-theme',
}

/** All possible product categories for filter chips */
export const ALL_CATEGORIES = [
  'Audio',
  'Wearables',
  'Displays',
  'Peripherals',
  'Streaming',
] as const
