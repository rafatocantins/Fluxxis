# Task: Create EventBus (Minimal Viable Pub/Sub)

**ID:** P1-07
**Status:** 📋 Pending
**Created:** 2026-02-26
**Priority:** 🔴 High
**Week:** 1-2 (Foundation)

## Description
Implement a minimal viable event bus system for component communication using pub/sub pattern.

## Acceptance Criteria
- [ ] Create EventBus class with subscribe/publish methods
- [ ] Implement event typing for type safety
- [ ] Add event validation and error handling
- [ ] Support wildcard subscriptions (* events)
- [ ] Add unsubscribe functionality
- [ ] Write unit tests for event flow
- [ ] Document event types and payloads

## Implementation Notes
- Use TypeScript generics for event typing
- Include event metadata (timestamp, source)
- Implement debouncing for high-frequency events
- Add event batching for performance
- Log all events in development mode

## Event Types
| Event | Payload | Frequency |
|-------|---------|-----------|
| NODE_REGISTER | Node metadata | Low |
| NODE_DEREGISTER | Node ID | Low |
| BEHAVIOR_SIGNAL | Signal type, value | High |
| INTERVENTION_REQUEST | Level, rationale | Medium |
| INTERVENTION_APPLY | Changes applied | Medium |

## Dependencies
- P1-04: Setup repository structure
- P1-05: Configure TypeScript

## Subagent
`orchestrator-engineer`

## Skill
`orchestrator`

## MCP Integration
- `filesystem` - EventBus implementation
- `context7` - Latest pub/sub patterns

## Related Files
- `src/events/EventBus.ts`
- `src/events/events.ts` (event definitions)
- `src/events/types.ts` (event types)
- `src/events/index.ts`

## Estimated Effort
2-3 hours

---
**Move to:** `kanban/in-progress/` when starting, `kanban/completed/` when done
