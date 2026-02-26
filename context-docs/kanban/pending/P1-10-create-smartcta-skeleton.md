# Task: Create SmartCTA Component Skeleton

**ID:** P1-10
**Status:** 📋 Pending
**Created:** 2026-02-26
**Priority:** 🔴 High
**Week:** 3-4 (SmartCTA Component)

## Description
Create the base SmartCTA React component with proper TypeScript typing and structure.

## Acceptance Criteria
- [ ] Create SmartCTA functional component
- [ ] Define SmartCTAProps interface with all required props
- [ ] Implement goal prop validation
- [ ] Add basic rendering structure
- [ ] Include accessibility attributes (ARIA)
- [ ] Write Storybook stories (if using)
- [ ] Document component API

## Implementation Notes
- Use forwardRef for DOM access
- Include displayName for debugging
- Support all button variants (primary, secondary, text)
- Ensure keyboard navigation works
- Add loading and disabled states

## Component API
```typescript
interface SmartCTAProps {
  goal: 'convert' | 'inform' | 'engage';
  defaultCopy: string;
  pageContext?: string;
  brandVoice?: BrandVoiceConfig;
  variant?: 'primary' | 'secondary' | 'text';
  onClick?: () => void;
  className?: string;
}
```

## Dependencies
- P1-09: Create goal declaration contract
- P1-04: Setup repository structure

## Subagent
`component-architect`

## Skill
`component-builder`

## MCP Integration
- `filesystem` - Component creation
- `magicuidesign-mcp` - Button variants
- `reactbits` - Animated button options

## Related Files
- `src/components/SmartCTA/SmartCTA.tsx`
- `src/components/SmartCTA/types.ts`
- `src/components/SmartCTA/index.ts`
- `src/components/SmartCTA/SmartCTA.stories.tsx`

## Estimated Effort
2-3 hours

---
**Move to:** `kanban/in-progress/` when starting, `kanban/completed/` when done
