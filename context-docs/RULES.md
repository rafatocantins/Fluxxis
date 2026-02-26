# Project Rules — AI Design System

These rules ensure context is preserved, documentation stays current, and knowledge is transferable across sessions.

---

## 📋 Core Rules

### Rule 1: Always Update Documentation on Task Completion

**When any task is completed, update these files in order:**

1. **Task Record** - Create detailed record in `context-docs/task-records/`
2. **Changelog** - Add entry to `context-docs/changelog/CHANGELOG.md`
3. **Session Log** (if applicable) - Update `context-docs/session-logs/`
4. **README.md** - Update if project structure or capabilities changed
5. **Related docs** - Update any affected documentation

**Checklist for task completion:**
```markdown
- [ ] Task record created with date and details
- [ ] Changelog updated with Added/Changed/Fixed entry
- [ ] README.md updated (if applicable)
- [ ] Related documentation updated (if applicable)
- [ ] Follow-up tasks noted
- [ ] MCP servers used documented
```

---

### Rule 2: Context Preservation

**Every session must preserve context for future sessions:**

1. **Start of session** - Review recent task records and changelog
2. **During session** - Log decisions and rationale in real-time
3. **End of session** - Update all documentation per Rule 1

**Context files to review:**
- `context-docs/changelog/CHANGELOG.md` - Recent changes
- `context-docs/task-records/` - Recent task details
- `context-docs/session-logs/` - Recent session context

---

### Rule 3: File Naming Conventions

**Task Records:**
```
context-docs/task-records/YYYY-MM-DD-task-name.md
```

**Session Logs:**
```
context-docs/session-logs/YYYY-MM-DD-session-name.md
```

**Changelog Entries:**
```
Date prefix in entry: **YYYY-MM-DD** - Description
```

**General Files:**
- Use kebab-case: `my-file.md` (not `myFile.md` or `My File.md`)
- Include dates for time-sensitive files
- Use UPPERCASE for index files: `README.md`, `CHANGELOG.md`

---

### Rule 4: MCP Server Usage

**When using MCP servers:**

1. **Document which servers were used** in task records
2. **Note any errors or issues** encountered
3. **Record successful patterns** for future reference
4. **Update MCP-STATUS.md** if server status changes

**Available MCPs:**
| Server | Status | Purpose |
|--------|--------|---------|
| filesystem | ✅ Running | File operations |
| context7 | ✅ Running | Documentation lookup |
| magicuidesign-mcp | ✅ Running | UI components |
| reactbits | ✅ Running | UI components |
| github | ✅ Running | Repository management |
| 21st-dev-magic | ✅ Running | AI UI generation |
| figma | ⏳ Not configured | Design tokens |
| appcontext | ⏳ macOS only | Visual debugging |

---

### Rule 5: Subagent & Skill Selection

**Choose the right tool for the task:**

**Use Subagents for:**
- Complex multi-step tasks
- Architecture decisions
- Full feature implementation
- Tasks requiring multiple skills

**Use Skills for:**
- Focused, single-capability tasks
- Component generation
- Specific operations within larger tasks

**Subagent Selection:**
| Task Type | Subagent |
|-----------|----------|
| Building components | `component-architect` |
| Event system | `orchestrator-engineer` |
| LLM integration | `ai-integration-specialist` |
| Behavior tracking | `behavior-tracker` |
| Personalization | `personalization-engineer` |
| Ethics review | `ethics-compliance` |
| Testing | `testing-validator` |
| Documentation | `documentation-writer` |

---

### Rule 6: Code Quality Standards

**All code must:**

1. **Use TypeScript** - No plain JavaScript files
2. **Include types** - All functions, components, and data structures
3. **Follow existing patterns** - Match project conventions
4. **Have tests** - New features require test coverage
5. **Include fallback** - Graceful degradation when services fail
6. **Respect ethics** - Follow ethical principles (see README)

**TypeScript Standards:**
```typescript
// ✅ Good: Typed props, clear interface
interface SmartCTAProps {
  goal: 'convert' | 'inform' | 'engage';
  defaultCopy: string;
  pageContext?: string;
}

const SmartCTA: React.FC<SmartCTAProps> = ({ goal, defaultCopy, pageContext }) => {
  // Implementation
};

// ❌ Bad: Any types, unclear props
const SmartCTA = ({ goal, defaultCopy }) => {
  // Implementation
};
```

---

### Rule 7: Ethical Compliance

**All interventions must:**

1. **Log decisions** - Every adaptation recorded in audit log
2. **Respect protection** - Never modify nodes >20% above baseline
3. **Enable human override** - Structural changes require approval
4. **Preserve privacy** - No PII collected or sent to APIs
5. **Provide fallback** - Components work without JS/API/tracking

**Intervention Levels:**
| Level | Type | Automation |
|-------|------|------------|
| 1-3 | Token, Emphasis, Animation | Automatic |
| 4-5 | Copy, Component Variant | Automatic (monitored) |
| 6-8 | Section, Layout, Page Structure | Human approval required |

---

### Rule 8: Testing Requirements

**Before marking a task complete:**

1. **Unit tests** - For all new functions/components
2. **Integration tests** - For event flow and system interactions
3. **Accessibility check** - WCAG 2.1 AA compliance
4. **Performance check** - <50ms decision latency
5. **Fallback test** - Works without API/services

**Test Coverage Targets:**
| Category | Coverage |
|----------|----------|
| Unit Tests | >90% |
| Integration Tests | >80% |
| E2E Tests | Critical paths only |
| Accessibility | WCAG 2.1 AA |

---

## 🔄 Task Completion Workflow

```
1. Complete the technical work
         ↓
2. Run tests and verify functionality
         ↓
3. Create task record in context-docs/task-records/
         ↓
4. Update changelog in context-docs/changelog/CHANGELOG.md
         ↓
5. Update README.md if structure/capabilities changed
         ↓
6. Update related documentation (if applicable)
         ↓
7. Note any follow-up tasks needed
         ↓
8. Mark task as complete
```

---

## 📁 Documentation Hierarchy

```
ia-design-system/
├── README.md                          # Project overview (always current)
├── context-docs/
│   ├── task-records/                  # Detailed task documentation
│   │   └── README.md                  # Task records index
│   ├── changelog/
│   │   └── CHANGELOG.md               # All changes, chronological
│   └── session-logs/                  # Session context and decisions
│       └── README.md                  # Session logs index
├── docs/
│   ├── MCP-SETUP.md                   # MCP installation guide
│   └── MCP-STATUS.md                  # Current MCP status
└── .qwen/
    ├── subagents.md                   # Subagent documentation
    └── skills/
        └── README.md                  # Skills documentation
```

---

## 🎯 Quick Reference

**End-of-Task Checklist:**
```
□ Task record created?
□ Changelog updated?
□ README updated (if needed)?
□ Related docs updated (if needed)?
□ Tests passing?
□ Follow-ups noted?
```

**Start-of-Session Checklist:**
```
□ Reviewed recent changelog entries?
□ Reviewed recent task records?
□ Reviewed recent session logs?
□ Understand current blockers?
□ Clear on session goals?
```

---

**These rules are living documents.** Update them when processes evolve or new patterns emerge.
