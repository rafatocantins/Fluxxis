# Behavior Tracking Skill

## Purpose
Implement client-side behavior observation systems with privacy-first design.

## Capabilities
- IntersectionObserver for scroll tracking
- Hover/dwell time measurement
- Scroll velocity calculation
- Reading pattern detection
- Session data management
- Privacy-first tracking (no PII)

## When to Use
- Adding behavior observers to components
- Implementing new tracking signals
- Debugging tracking issues
- Optimizing tracking performance

## MCP Integration
- `appcontext` — Real-time visual debugging
- `context7` — Latest Observer API documentation

## Tracking Signals
| Signal | Purpose | Threshold |
|--------|---------|-----------|
| Scroll Depth | Content engagement | 25%, 50%, 75%, 90% |
| Hover Time | Interest detection | >1s meaningful |
| Dwell Time | Page engagement | >30s high intent |
| Scroll Velocity | Reading vs scanning | Fast = scanning |

## Output
- TypeScript hooks for behavior tracking
- Session storage management
- Privacy-compliant data structures
- Performance-optimized observers
