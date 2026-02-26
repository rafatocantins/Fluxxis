# Task: Setup Zustand Store Architecture

**ID:** P1-06
**Status:** 📋 Pending
**Created:** 2026-02-26
**Priority:** 🔴 High
**Week:** 1-2 (Foundation)

## Description
Create the Zustand store architecture for managing global state (UserProfile, NodeRegistry, SessionData).

## Acceptance Criteria
- [ ] Create base store setup with Zustand
- [ ] Implement UserProfile store (signals, preferences)
- [ ] Implement NodeRegistry store (registered nodes, goals)
- [ ] Implement SessionData store (behavior metrics, dwell times)
- [ ] Add persistence middleware for cross-session memory
- [ ] Write unit tests for all stores

## Implementation Notes
- Use Zustand middleware for persistence
- Separate stores by domain (user, nodes, session)
- Include TypeScript types for all state shapes
- Add devtools middleware for debugging
- Implement selectors for performance optimization

## Dependencies
- P1-04: Setup repository structure
- P1-05: Configure TypeScript

## Subagent
`orchestrator-engineer`

## Skill
`orchestrator`

## MCP Integration
- `filesystem` - Store file creation
- `context7` - Latest Zustand patterns

## Related Files
- `src/stores/userProfileStore.ts`
- `src/stores/nodeRegistryStore.ts`
- `src/stores/sessionDataStore.ts`
- `src/stores/index.ts`
- `src/types/store.ts`

## Estimated Effort
3-4 hours

---
**Move to:** `kanban/in-progress/` when starting, `kanban/completed/` when done
