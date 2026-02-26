# Task: Add Reading Pattern Detection

**ID:** P1-20
**Status:** 📋 Pending
**Created:** 2026-02-26
**Priority:** 🟠 Medium
**Week:** 5-6 (SmartSection & SmartLayout)

## Description
Implement reading pattern detection to understand how users consume section content.

## Acceptance Criteria
- [ ] Track scroll speed through sections
- [ ] Detect reading vs scanning behavior
- [ ] Measure time per content block
- [ ] Emit reading pattern signals
- [ ] Store patterns in SessionData

## Implementation Notes
- Fast scroll = scanning
- Slow scroll with pauses = reading
- Track mouse movement patterns
- Respect privacy (no content tracking)

## Dependencies
- P1-13: Hover/dwell observers (pattern reference)
- P1-07: EventBus

## Subagent
`behavior-tracker`

## Skill
`behavior-tracking`

## Estimated Effort
3-4 hours

---
**Move to:** `kanban/in-progress/` when starting, `kanban/completed/` when done
