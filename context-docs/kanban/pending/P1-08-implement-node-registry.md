# Task: Implement Node Registry System

**ID:** P1-08
**Status:** 📋 Pending
**Created:** 2026-02-26
**Priority:** 🔴 High
**Week:** 1-2 (Foundation)

## Description
Build the Node Registry system to track all registered smart components and their goals.

## Acceptance Criteria
- [ ] Create NodeRegistry class with register/deregister methods
- [ ] Implement goal declaration contract interface
- [ ] Add node metadata storage (id, goal, context, metrics)
- [ ] Create node query methods (byGoal, bySection, byPerformance)
- [ ] Integrate with EventBus for lifecycle events
- [ ] Write unit tests for registry operations
- [ ] Document node contract interface

## Implementation Notes
- Each node must declare: id, goal, pageContext, brandVoice
- Track performance metrics per node (baseline, current)
- Support node grouping by section/page
- Include protection flags (nodes >20% above baseline)
- Emit events on register/deregister

## Node Contract Interface
```typescript
interface NodeContract {
  id: string;
  goal: 'convert' | 'inform' | 'engage';
  pageContext: string;
  brandVoice?: BrandVoiceConfig;
  metrics: NodeMetrics;
  protectionLevel: number; // 1-8
}
```

## Dependencies
- P1-07: Create EventBus

## Subagent
`orchestrator-engineer`

## Skill
`orchestrator`

## MCP Integration
- `filesystem` - Registry implementation
- `context7` - Registry pattern documentation

## Related Files
- `src/registry/NodeRegistry.ts`
- `src/registry/types.ts`
- `src/registry/nodeContract.ts`
- `src/registry/index.ts`

## Estimated Effort
3-4 hours

---
**Move to:** `kanban/in-progress/` when starting, `kanban/completed/` when done
