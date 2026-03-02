# Orchestrator Skill

## Purpose
Build and maintain the EventBus and Node Registry systems for component communication.

## Capabilities
- Pub/sub event system implementation
- Node registration/deregistration lifecycle
- State management with Zustand
- Event typing and validation
- Performance optimization (debouncing, batching)

## When to Use
- Setting up event infrastructure
- Debugging event flow issues
- Implementing node contracts
- Optimizing event performance

## MCP Integration
- `context7` — Latest Zustand and React patterns
- `filesystem` — Event schema management

## Event Types
| Event | Purpose | Payload |
|-------|---------|---------|
| NODE_REGISTER | Node joins system | Node metadata, goals |
| NODE_DEREGISTER | Node leaves system | Node ID, reason |
| BEHAVIOR_SIGNAL | User interaction detected | Signal type, value |
| INTERVENTION_REQUEST | Adaptation proposed | Level, rationale |
| INTERVENTION_APPLY | Adaptation executed | Changes applied |

## Output
- EventBus TypeScript implementation
- Node Registry schemas
- Zustand stores
- Performance-optimized event handlers
