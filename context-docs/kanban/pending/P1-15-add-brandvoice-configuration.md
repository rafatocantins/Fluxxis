# Task: Add BrandVoice Configuration Schema

**ID:** P1-15
**Status:** 📋 Pending
**Created:** 2026-02-26
**Priority:** 🟠 Medium
**Week:** 3-4 (SmartCTA Component)

## Description
Create the BrandVoice configuration schema for customizing tone, audience, and style.

## Acceptance Criteria
- [ ] Define BrandVoiceConfig TypeScript interface
- [ ] Create tone options (confident, warm, playful, etc.)
- [ ] Add audience targeting options
- [ ] Include CTA style preferences
- [ ] Build validation utilities
- [ ] Document BrandVoice usage

## Implementation Notes
- Support multiple tone dimensions
- Allow audience array for targeting
- Include examples for each option
- Validate against known values
- Support partial configs (defaults for missing)

## BrandVoice Schema
```typescript
interface BrandVoiceConfig {
  tone: 'confident-but-warm' | 'playful' | 'professional' | 'minimal';
  audience: string[];
  ctaStyle: 'direct' | 'soft' | 'urgent' | 'curious';
  vocabulary?: 'simple' | 'technical' | 'aspirational';
}
```

## Dependencies
- P1-09: Goal declaration contract

## Subagent
`ai-integration-specialist`

## Skill
`ai-integration`

## MCP Integration
- `filesystem` - Schema definition
- `context7` - TypeScript schema patterns

## Related Files
- `src/types/brandVoice.ts`
- `src/utils/brandVoiceValidation.ts`
- `src/prompts/brandVoicePrompts.ts`

## Estimated Effort
1-2 hours

---
**Move to:** `kanban/in-progress/` when starting, `kanban/completed/` when done
