# Subagents Configuration — AI Design System

This project uses specialized subagents to handle different aspects of the AI-driven design system development.

---

## MCP Integration

Subagents can leverage MCP servers for enhanced capabilities:

| MCP Server | Used By | Purpose |
|------------|---------|---------|
| `filesystem` | All | Secure file access for reading/editing |
| `context7` | All | Fetch latest React/TypeScript docs |
| `github` | testing-validator, documentation-writer | Repository management, issues |
| `magicuidesign-mcp` | component-architect | 50+ animated React components |
| `reactbits` | component-architect | 135+ animated components |
| `21st-dev-magic` | component-architect | AI-driven UI generation |
| `figma` | component-architect | Extract design tokens |
| `appcontext` | behavior-tracker, testing-validator | Real-time visual debugging |

See `docs/MCP-SETUP.md` for installation instructions.

---

## Available Subagents

### 1. `component-architect`
**Purpose:** Design and implement smart components (SmartCTA, SmartSection, SmartLayout) with goal-first architecture.

**Responsibilities:**
- Component contract design with declared goals
- Intent-aware component behavior
- Fallback mechanisms for offline/API failure
- Accessibility compliance (WCAG 2.1 AA)
- React + TypeScript implementation

**When to use:**
- Creating new smart components
- Modifying component contracts
- Implementing intent tokens
- Adding behavioral observers to components

---

### 2. `orchestrator-engineer`
**Purpose:** Build and maintain the EventBus and Node Registry systems.

**Responsibilities:**
- Pub/sub event system implementation
- Node registration/deregistration lifecycle
- State management with Zustand
- Event typing and validation
- Performance optimization (debouncing, batching)

**When to use:**
- Setting up event infrastructure
- Debugging event flow issues
- Implementing node contracts
- Optimizing event performance

---

### 3. `ai-integration-specialist`
**Purpose:** Handle LLM integrations for copy generation and intent classification.

**Responsibilities:**
- Edge Function implementation (Vercel/Cloudflare)
- Claude/GPT API integration
- Prompt engineering for BrandVoice
- PrivacyFilter for PII removal
- Fallback strategies for API failures
- Cost monitoring and optimization

**When to use:**
- Implementing copy generation
- Setting up intent classification
- Configuring BrandVoice schemas
- Adding new LLM providers

---

### 4. `behavior-tracker`
**Purpose:** Implement client-side behavior observation systems.

**Responsibilities:**
- IntersectionObserver for scroll tracking
- Hover/dwell time measurement
- Scroll velocity calculation
- Reading pattern detection
- Session data management
- Privacy-first tracking (no PII)

**When to use:**
- Adding behavior observers
- Implementing new tracking signals
- Debugging tracking issues
- Optimizing tracking performance

---

### 5. `personalization-engineer`
**Purpose:** Build deterministic personalization logic (no ML).

**Responsibilities:**
- UserProfile schema and state
- Signal accumulation and decay
- Rule-based adaptation logic
- Confidence scoring
- Cross-session memory (privacy-compliant)

**When to use:**
- Implementing personalization profiles
- Adding adaptation rules
- Modifying signal processing
- Debugging personalization issues

---

### 6. `ethics-compliance`
**Purpose:** Ensure ethical guardrails and compliance are built-in.

**Responsibilities:**
- Intervention spectrum enforcement (levels 1-8)
- Protection rules for high-performing nodes
- Audit logging for decisions
- GDPR compliance checks
- Explainability documentation

**When to use:**
- Adding new intervention types
- Reviewing changes for ethics compliance
- Implementing audit logs
- Creating explainability reports

---

### 7. `testing-validator`
**Purpose:** Write and run tests for all system components.

**Responsibilities:**
- Unit tests for components and utilities
- Integration tests for event flow
- E2E tests for smart components
- Performance benchmarks
- Accessibility testing

**When to use:**
- Adding tests for new features
- Running verification before commits
- Debugging failing tests
- Setting up CI/CD pipelines

---

### 8. `documentation-writer`
**Purpose:** Create and maintain clear documentation.

**Responsibilities:**
- API documentation
- Installation guides
- Usage examples
- Architecture diagrams
- Changelog maintenance

**When to use:**
- Documenting new features
- Creating getting started guides
- Writing migration guides
- Updating README

---

## Subagent Invocation Format

```markdown
@component-architect — [task description]
@orchestrator-engineer — [task description]
@ai-integration-specialist — [task description]
@behavior-tracker — [task description]
@personalization-engineer — [task description]
@ethics-compliance — [task description]
@testing-validator — [task description]
@documentation-writer — [task description]
```

---

## Skills

This project also has specialized **skills** for focused capabilities:

| Skill | Purpose |
|-------|---------|
| [`component-builder`](skills/component-builder.md) | Build intent-driven React components |
| [`ai-integration`](skills/ai-integration.md) | LLM integrations for copy & intent |
| [`behavior-tracking`](skills/behavior-tracking.md) | Client-side behavior observation |
| [`personalization`](skills/personalization.md) | Rule-based adaptation logic |
| [`ethics-compliance`](skills/ethics-compliance.md) | Ethical guardrails & audit |
| [`testing-validation`](skills/testing-validation.md) | Comprehensive test coverage |
| [`documentation`](skills/documentation.md) | Clear, comprehensive docs |
| [`orchestrator`](skills/orchestrator.md) | EventBus & Node Registry |
| [`ui-generation`](skills/ui-generation.md) | AI-powered UI generation |

See [`.qwen/skills/README.md`](skills/README.md) for full skill documentation.

---

## Development Phases Alignment

| Phase | Primary Subagents |
|-------|-------------------|
| **Phase 1 (Months 1-3)** | component-architect, orchestrator-engineer, ai-integration-specialist, testing-validator |
| **Phase 2 (Months 4-8)** | behavior-tracker, personalization-engineer, ethics-compliance, documentation-writer |
| **Phase 3 (Months 9+)** | All subagents for orchestration platform scaling |

---

## General-Purpose Fallback

For tasks that don't fit a specialized subagent, use the `general-purpose` subagent for:
- Project scaffolding
- File structure organization
- General refactoring
- Cross-cutting concerns
