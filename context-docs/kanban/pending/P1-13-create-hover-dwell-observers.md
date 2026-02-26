# Task: Create Hover and Dwell Time Observers

**ID:** P1-13
**Status:** 📋 Pending
**Created:** 2026-02-26
**Priority:** 🟠 Medium
**Week:** 3-4 (SmartCTA Component)

## Description
Implement behavior observers to track hover time and dwell time on SmartCTA components.

## Acceptance Criteria
- [ ] Create useHoverObserver hook for hover tracking
- [ ] Implement dwell time measurement
- [ ] Add behavior signal emission to EventBus
- [ ] Store metrics in SessionData store
- [ ] Include privacy filters (no PII)
- [ ] Write unit tests for observers

## Implementation Notes
- Use onMouseEnter/onMouseLeave for hover
- Track cumulative hover time across sessions
- Dwell time = time component in viewport
- Emit BEHAVIOR_SIGNAL events on thresholds
- Respect user privacy (no personal data)

## Behavior Signals
| Signal | Threshold | Purpose |
|--------|-----------|---------|
| HOVER_START | 0ms | User showed interest |
| HOVER_MEANINGFUL | 1000ms | Significant engagement |
| DWELL_START | 0ms | Component visible |
| DWELL_HIGH_INTENT | 30000ms | Strong interest signal |

## Dependencies
- P1-07: Create EventBus
- P1-10: Create SmartCTA skeleton

## Subagent
`behavior-tracker`

## Skill
`behavior-tracking`

## MCP Integration
- `filesystem` - Hook implementation
- `appcontext` - Real-time behavior visualization

## Related Files
- `src/hooks/useHoverObserver.ts`
- `src/hooks/useDwellTime.ts`
- `src/tracking/behaviorSignals.ts`

## Estimated Effort
2-3 hours

---
**Move to:** `kanban/in-progress/` when starting, `kanban/completed/` when done
