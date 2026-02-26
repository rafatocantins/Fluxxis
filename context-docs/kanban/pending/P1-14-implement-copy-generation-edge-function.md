# Task: Implement Copy Generation via Edge Function

**ID:** P1-14
**Status:** 📋 Pending
**Created:** 2026-02-26
**Priority:** 🔴 High
**Week:** 3-4 (SmartCTA Component)

## Description
Build Edge Function for LLM-powered copy generation with privacy filters and fallback.

## Acceptance Criteria
- [ ] Create Edge Function (Vercel/Cloudflare)
- [ ] Implement Claude API integration
- [ ] Build PrivacyFilter for PII removal
- [ ] Create prompt templates for BrandVoice
- [ ] Add error handling and retries
- [ ] Implement rate limiting
- [ ] Write integration tests

## Implementation Notes
- Use Anthropic Claude Sonnet for copy generation
- Filter all PII before sending to API
- Cache responses to reduce latency/cost
- Include system prompt for BrandVoice alignment
- Log all requests for audit trail

## API Contract
```typescript
interface CopyGenerationRequest {
  goal: 'convert' | 'inform' | 'engage';
  pageContext: string;
  brandVoice: BrandVoiceConfig;
  defaultCopy: string;
}

interface CopyGenerationResponse {
  copy: string;
  confidence: number;
  fallback: boolean;
}
```

## Dependencies
- P1-10: Create SmartCTA skeleton
- P1-15: BrandVoice configuration (parallel)

## Subagent
`ai-integration-specialist`

## Skill
`ai-integration`

## MCP Integration
- `filesystem` - Edge Function creation
- `context7` - Edge Function best practices
- `github` - Secret management

## Related Files
- `src/api/copyGeneration.ts`
- `src/api/PrivacyFilter.ts`
- `src/prompts/copyPrompts.ts`
- `edge-functions/generate-copy.ts`

## Estimated Effort
4-5 hours

---
**Move to:** `kanban/in-progress/` when starting, `kanban/completed/` when done
