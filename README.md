# AI Design System

An intent-driven, goal-first design system with adaptive components powered by AI.

## 🎯 Vision

A design system where every component declares its **goal**, observes user **behavior**, and adapts **ethically** to improve outcomes — all while maintaining full transparency and human control.

---

## 📦 Project Structure

```
ia-design-system/
├── .qwen/
│   ├── agents/              # Subagent configurations
│   ├── skills/              # Specialized capabilities
│   ├── subagents.md         # Subagent overview
│   └── mcp-config.json      # MCP server configurations
├── context-docs/
│   ├── task-records/        # Detailed task documentation
│   ├── changelog/           # All project changes
│   ├── session-logs/        # Session context and decisions
│   └── RULES.md             # Project rules and workflows
├── docs/
│   ├── MCP-SETUP.md         # MCP installation guide
│   └── MCP-STATUS.md        # Current MCP status
└── chat-Product Development Analysis.txt
```

---

## 🚀 Development Phases

### Phase 1: Intent Design System (Months 1-3)

**Goal:** Validate the core thesis with installable, functional components.

**Deliverables:**
- ✅ SmartCTA, SmartSection, SmartLayout components
- ✅ Goal declaration contract for nodes
- ✅ BrandVoice + Copy generation via LLM
- ✅ Basic behavior tracking (scroll, hover, dwell)
- ✅ Fallback mechanisms for offline/API failure

**Tech Stack:** React + TypeScript + Zustand + Edge Functions

---

### Phase 2: Adaptive Layer (Months 4-8)

**Goal:** Add intelligent observation and safe automatic adaptation.

**Deliverables:**
- ✅ Intervention spectrum (levels 1-5) automated
- ✅ Behavior tracking with semantic meaning
- ✅ Emphasis map for visual hierarchy
- ✅ A/B Orchestrator for component variants
- ✅ Dashboard for Goal Completion Rate metrics

---

### Phase 3: Orchestration Platform (Months 9+)

**Goal:** Scale to centralized governance and advanced personalization.

**Deliverables:**
- ✅ Full Orchestrator with Decision Engine
- ✅ Human-in-the-Loop dashboard for structural changes
- ✅ Individual personalization with session memory
- ✅ Complete audit log and explainability
- ✅ Enterprise integrations (SSO, RBAC, compliance)

---

## 🤖 Subagents

This project uses 8 specialized subagents for different aspects of development:

| Subagent | Purpose |
|----------|---------|
| `component-architect` | Smart components with goal-first architecture |
| `orchestrator-engineer` | EventBus and Node Registry systems |
| `ai-integration-specialist` | LLM integration for copy and intent |
| `behavior-tracker` | Client-side behavior observation |
| `personalization-engineer` | Deterministic personalization rules |
| `ethics-compliance` | Ethical guardrails and audit logs |
| `testing-validator` | Unit, integration, and E2E tests |
| `documentation-writer` | API docs, guides, and changelog |

See [`.qwen/subagents.md`](.qwen/subagents.md) for details.

## 🛠️ Skills

Specialized capabilities for focused operations:

| Skill | Purpose |
|-------|---------|
| `component-builder` | Build intent-driven React components |
| `ai-integration` | LLM integrations for copy & intent |
| `behavior-tracking` | Client-side behavior observation |
| `personalization` | Rule-based adaptation logic |
| `ethics-compliance` | Ethical guardrails & audit |
| `testing-validation` | Comprehensive test coverage |
| `documentation` | Clear, comprehensive docs |
| `orchestrator` | EventBus & Node Registry |
| `ui-generation` | AI-powered UI generation |

See [`.qwen/skills/README.md`](.qwen/skills/README.md) for full documentation.

---

## 🔌 MCP Integration

This project leverages Model Context Protocol (MCP) servers for enhanced development:

| MCP Server | Status | Purpose |
|------------|--------|---------|
| `filesystem` | ✅ Installed | Secure file access |
| `context7` | ✅ Installed | Latest React/TypeScript documentation |
| `magicuidesign-mcp` | ✅ Installed | 50+ animated React components |
| `reactbits` | ✅ Installed | 135+ animated components |
| `github` | ⏳ Optional | Repository and issue management |
| `21st-dev-magic` | ⏳ Optional | AI-driven UI generation |
| `figma` | ⏳ Optional | Design token extraction |
| `appcontext` | ⏳ Optional | Real-time visual debugging (macOS) |

### Quick Setup

MCPs are already installed! Run the setup script to reinstall:

```bash
# Windows
.\scripts\setup-mcp.bat

# Linux/Mac
./scripts/setup-mcp.sh
```

See [`docs/MCP-STATUS.md`](docs/MCP-STATUS.md) for current status and [`docs/MCP-SETUP.md`](docs/MCP-SETUP.md) for full guide.

---

## 🏗️ Core Concepts

### Goal-First Architecture

Every component declares its intent:

```tsx
<SmartCTA goal="convert" pageContext="pricing" />
<SmartSection goal="inform" sectionId="features" />
<SmartLayout goal="engage" layoutType="comparison" />
```

### Intervention Spectrum

| Level | Type | Automation |
|-------|------|------------|
| 1-3 | Token, Emphasis, Animation | Automatic |
| 4-5 | Copy, Component Variant | Automatic (monitored) |
| 6-8 | Section, Layout, Page Structure | Human approval required |

### Ethical Principles

1. **Protect What Works:** Never modify nodes 20% above baseline
2. **Transparency:** Every decision logged and explainable
3. **Human-in-the-Loop:** Structural changes require approval
4. **Privacy First:** No PII collected or sent to APIs
5. **Fallback Always:** Components work without JS/API/tracking

---

## 📚 Documentation

- [MCP Setup Guide](docs/MCP-SETUP.md) — Install and configure MCP servers
- [Subagents Overview](.qwen/subagents.md) — Specialized development agents
- [Product Analysis](chat-Product Development Analysis.txt) — Full project analysis

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+ (Latest LTS)
- npm or pnpm
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd ia-design-system

# Install dependencies
npm install

# Start development
npm run dev
```

### First Component

```tsx
// Basic SmartCTA usage
import { SmartCTA } from '@ia-design-system/react'

function PricingPage() {
  return (
    <SmartCTA
      goal="convert"
      defaultCopy="Get Started"
      pageContext="pricing"
      brandVoice={{
        tone: "confident-but-warm",
        audience: ["founders"],
        ctaStyle: "direct"
      }}
    />
  )
}
```

---

## 📊 Key Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Goal Completion Rate | >5% | Primary success metric per component |
| Intervention Success | >80% | Percentage of adaptations that improve metrics |
| Fallback Reliability | 100% | Components work without services |
| Decision Latency | <50ms | Time to decide on intervention |
| Explainability | 100% | All decisions have audit trail |

---

## 🤝 Contributing

1. Choose a subagent based on your task
2. Use MCP servers for enhanced capabilities
3. Write tests for all new features
4. Update documentation
5. Run ethics compliance check

---

## 📝 License

MIT — See LICENSE file for details

---

## 🎯 Next Steps

**Week 1-2:** Foundation
- [ ] Setup repository and build system
- [ ] Implement EventBus (minimal viable pub/sub)
- [ ] Create SmartCTA component skeleton
- [ ] Configure MCP servers for UI generation

**Week 3-4:** First Working Demo
- [ ] SmartCTA with scroll-based floating behavior
- [ ] Copy generation via Claude API
- [ ] Basic behavior tracking (scroll, hover)
- [ ] Fallback to static copy when API fails

**Month 2-3:** Phase 1 Complete
- [ ] All smart components functional
- [ ] BrandVoice configuration working
- [ ] Documentation published
- [ ] Demo video showing adaptation in action

---

**Built with** ❤️ **by the AI Design System Team**
