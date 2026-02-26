# Task: Implement Goal Prop and Intent Tokens

**ID:** P1-11
**Status:** 📋 Pending
**Created:** 2026-02-26
**Priority:** 🔴 High
**Week:** 3-4 (SmartCTA Component)

## Description
Implement the goal prop system and intent tokens that drive SmartCTA behavior and styling.

## Acceptance Criteria
- [ ] Create intent token system (CSS variables or Tailwind config)
- [ ] Map goals to visual treatments
- [ ] Implement dynamic styling based on goal
- [ ] Add emphasis levels (subtle, normal, strong)
- [ ] Support theme customization
- [ ] Document intent token usage

## Implementation Notes
- Use CSS custom properties for runtime updates
- Map goals to color, animation, and layout tokens
- Include emphasis map for visual hierarchy
- Support dark mode variants
- Ensure tokens are accessible (contrast ratios)

## Intent Tokens
| Token | convert | inform | engage |
|-------|---------|--------|--------|
| Color | Primary brand | Neutral | Accent |
| Animation | Direct | Subtle | Playful |
| Emphasis | High | Medium | Variable |

## Dependencies
- P1-10: Create SmartCTA skeleton
- P1-09: Goal declaration contract

## Subagent
`component-architect`

## Skill
`component-builder`

## MCP Integration
- `filesystem` - Token implementation
- `magicuidesign-mcp` - Visual effects
- `figma` - Design token sync (if available)

## Related Files
- `src/tokens/intentTokens.ts`
- `src/tokens/goalStyles.ts`
- `src/components/SmartCTA/styles.ts`

## Estimated Effort
2-3 hours

---
**Move to:** `kanban/in-progress/` when starting, `kanban/completed/` when done
