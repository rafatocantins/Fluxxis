# Task: Create Integration Tests for Event Flow

**ID:** P1-24
**Status:** 📋 Pending
**Created:** 2026-02-26
**Priority:** 🟠 Medium
**Week:** 7-8 (Testing & Documentation)

## Description
Build integration tests to verify event flow between components and systems.

## Acceptance Criteria
- [ ] Test NODE_REGISTER flow
- [ ] Test BEHAVIOR_SIGNAL flow
- [ ] Test INTERVENTION_REQUEST flow
- [ ] Test store updates from events
- [ ] Test cross-component communication
- [ ] All integration tests passing

## Implementation Notes
- Use React Testing Library
- Mock network requests
- Verify EventBus subscriptions
- Test async event handling

## Dependencies
- P1-23: Unit tests (pattern reference)
- P1-07: EventBus
- P1-08: NodeRegistry

## Subagent
`testing-validator`

## Skill
`testing-validation`

## Estimated Effort
4-5 hours

---
**Move to:** `kanban/in-progress/` when starting, `kanban/completed/` when done
