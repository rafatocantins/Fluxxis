# Skills — AI Design System

Skills provide specialized capabilities for building the AI-driven design system. Each skill focuses on a specific domain with clear capabilities and MCP integration.

---

## Available Skills

| Skill | Purpose | MCP Integration |
|-------|---------|-----------------|
| [`component-builder`](component-builder.md) | Build intent-driven React components | magicuidesign, reactbits, 21st-dev, figma |
| [`ai-integration`](ai-integration.md) | LLM integrations for copy & intent | context7, github |
| [`behavior-tracking`](behavior-tracking.md) | Client-side behavior observation | appcontext, context7 |
| [`personalization`](personalization.md) | Rule-based adaptation logic | context7, filesystem |
| [`ethics-compliance`](ethics-compliance.md) | Ethical guardrails & audit | github, filesystem |
| [`testing-validation`](testing-validation.md) | Comprehensive test coverage | github, context7, appcontext |
| [`documentation`](documentation.md) | Clear, comprehensive docs | github, context7, filesystem |
| [`orchestrator`](orchestrator.md) | EventBus & Node Registry | context7, filesystem |
| [`ui-generation`](ui-generation.md) | AI-powered UI generation | magicuidesign, reactbits, 21st-dev, figma |

---

## Skill vs Subagent

| Aspect | Subagent | Skill |
|--------|----------|-------|
| **Purpose** | Role-based agent for complex tasks | Capability for specific operations |
| **Scope** | Broad (e.g., "build all components") | Focused (e.g., "generate animated button") |
| **Invocation** | `@component-architect — build SmartCTA` | Use within tasks via MCP/tools |
| **Output** | Full implementation, architecture | Specific code, configurations |

**Use Subagents** for: Complex multi-step tasks, architecture decisions, full feature implementation

**Use Skills** for: Specific capabilities, component generation, targeted operations

---

## Usage Examples

### Building a SmartCTA Component

```
1. @component-architect — Design SmartCTA with goal="convert"
2. Use ui-generation skill — Create shimmer button variant
3. Use behavior-tracking skill — Add hover/dwell observers
4. Use testing-validation skill — Write unit tests
5. Use documentation skill — Create usage guide
```

### Adding LLM Copy Generation

```
1. @ai-integration-specialist — Implement copy generation
2. Use ai-integration skill — Create PrivacyFilter
3. Use ethics-compliance skill — Add audit logging
4. Use testing-validation skill — Test fallback behavior
```

### Implementing Personalization

```
1. @personalization-engineer — Build UserProfile system
2. Use personalization skill — Create adaptation rules
3. Use orchestrator skill — Connect to EventBus
4. Use ethics-compliance skill — Enforce intervention levels
```

---

## Skill Invocation Format

Skills are invoked implicitly through task execution. Reference them in prompts:

```
"Use the ui-generation skill to create a blur-fade text animation"
"Apply the behavior-tracking skill to add scroll velocity detection"
"Run the ethics-compliance skill to verify intervention levels"
```

---

## MCP Server Mapping

| Skill | Primary MCPs | Secondary MCPs |
|-------|--------------|----------------|
| component-builder | magicuidesign, reactbits, 21st-dev | figma, context7 |
| ai-integration | context7 | github |
| behavior-tracking | appcontext | context7 |
| personalization | context7 | filesystem |
| ethics-compliance | filesystem | github |
| testing-validation | github, appcontext | context7 |
| documentation | github, filesystem | context7 |
| orchestrator | context7 | filesystem |
| ui-generation | magicuidesign, reactbits, 21st-dev | figma |

---

## Development Phase Alignment

| Phase | Primary Skills |
|-------|----------------|
| **Phase 1 (Months 1-3)** | component-builder, ui-generation, ai-integration, testing-validation |
| **Phase 2 (Months 4-8)** | behavior-tracking, personalization, orchestrator, ethics-compliance |
| **Phase 3 (Months 9+)** | All skills for orchestration platform scaling |

---

## Adding New Skills

1. Create `.qwen/skills/skill-name.md`
2. Follow the standard template:
   - Purpose
   - Capabilities
   - When to Use
   - MCP Integration
   - Output
3. Update this README
4. Reference in subagent configurations

---

**Skills are composable** — combine multiple skills for complex tasks while maintaining clear separation of concerns.
