# Task: Add Scroll-Based Floating Behavior

**ID:** P1-12
**Status:** 📋 Pending
**Created:** 2026-02-26
**Priority:** 🟠 Medium
**Week:** 3-4 (SmartCTA Component)

## Description
Implement scroll-based floating behavior for SmartCTA to follow user as they scroll.

## Acceptance Criteria
- [ ] Add IntersectionObserver for scroll tracking
- [ ] Implement floating state management
- [ ] Create smooth transition animations
- [ ] Add configurable scroll threshold
- [ ] Support disable floating option
- [ ] Test performance (no jank)

## Implementation Notes
- Use requestAnimationFrame for smooth updates
- Debounce scroll events for performance
- Add CSS transforms for hardware acceleration
- Include escape hatch for users who prefer reduced motion
- Track scroll velocity for adaptation decisions

## Scroll Behavior
| Scroll Depth | CTA Position | Visibility |
|--------------|--------------|------------|
| 0-25% | Inline | Full |
| 25-75% | Floating (bottom-right) | Full |
| 75-90% | Floating (center) | Emphasized |
| 90%+ | Inline (near end) | Full |

## Dependencies
- P1-10: Create SmartCTA skeleton

## Subagent
`component-architect`

## Skill
`behavior-tracking`

## MCP Integration
- `filesystem` - Component implementation
- `appcontext` - Visual debugging of scroll behavior

## Related Files
- `src/components/SmartCTA/useScrollBehavior.ts`
- `src/components/SmartCTA/floatingStyles.ts`
- `src/hooks/useIntersectionObserver.ts`

## Estimated Effort
3-4 hours

---
**Move to:** `kanban/in-progress/` when starting, `kanban/completed/` when done
