# Task: Build Fallback to Static Copy When API Fails

**ID:** P1-16
**Status:** 📋 Pending
**Created:** 2026-02-26
**Priority:** 🔴 High
**Week:** 3-4 (SmartCTA Component)

## Description
Implement robust fallback mechanisms for when LLM API is unavailable or fails.

## Acceptance Criteria
- [ ] Create fallback copy storage
- [ ] Implement API failure detection
- [ ] Add retry logic with exponential backoff
- [ ] Cache last successful response
- [ ] Log all failures for monitoring
- [ ] Test offline functionality

## Implementation Notes
- Always have defaultCopy as ultimate fallback
- Cache successful API responses locally
- Implement circuit breaker pattern
- Track failure rates per endpoint
- Ensure component works without JavaScript

## Fallback Chain
1. Cached API response (if <24h old)
2. Pre-generated variant library
3. defaultCopy prop
4. Hardcoded system default

## Dependencies
- P1-14: Copy generation Edge Function

## Subagent
`ai-integration-specialist`

## Skill
`ai-integration`

## MCP Integration
- `filesystem` - Fallback implementation
- `context7` - Circuit breaker patterns

## Related Files
- `src/api/fallbackCopy.ts`
- `src/api/circuitBreaker.ts`
- `src/utils/cache.ts`

## Estimated Effort
2-3 hours

---
**Move to:** `kanban/in-progress/` when starting, `kanban/completed/` when done
