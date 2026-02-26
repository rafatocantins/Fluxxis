# Changelog — AI Design System

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **2026-02-26** - P1-04: Repository structure and build system complete
  - Files: `package.json`, `tsconfig.json`, `tsup.config.ts`, `src/` (full structure), `dist/` (build output)
  - Task: `context-docs/kanban/completed/P1-04-setup-repository-structure.md`
- **2026-02-26** - Phase 1 Kanban board with 21 tasks across 5 sprints
  - Files: `context-docs/kanban/`, `context-docs/kanban/README.md`, `context-docs/kanban/pending/` (18 tasks), `context-docs/kanban/completed/` (4 tasks)
  - Task: `context-docs/task-records/2026-02-26-phase-1-kanban-setup.md`
- **2026-02-26** - Context documentation system with task records, changelog, and session logs
  - Files: `context-docs/`, `context-docs/RULES.md`, `context-docs/task-records/`, `context-docs/changelog/`, `context-docs/session-logs/`
  - Task: `context-docs/task-records/2026-02-26-context-docs-setup.md`
- **2026-02-26** - Skills system with 9 specialized skills
  - Files: `.qwen/skills/README.md`, `.qwen/skills/component-builder.md`, `.qwen/skills/ai-integration.md`, `.qwen/skills/behavior-tracking.md`, `.qwen/skills/personalization.md`, `.qwen/skills/ethics-compliance.md`, `.qwen/skills/testing-validation.md`, `.qwen/skills/documentation.md`, `.qwen/skills/orchestrator.md`, `.qwen/skills/ui-generation.md`
  - Task: `context-docs/task-records/2026-02-26-skills-creation.md`
- **2026-02-26** - MCP server configuration with 8 servers (6 running)
  - Files: `.vscode/mcp.json`, `.env`
  - Task: `context-docs/task-records/2026-02-26-mcp-setup.md`

### Changed
- **2026-02-26** - Updated `README.md` with project structure, skills overview, and context-docs reference
- **2026-02-26** - Updated `.qwen/subagents.md` with skills reference section
- **2026-02-26** - Updated `docs/MCP-STATUS.md` with current running status
- **2026-02-26** - Fixed `.env` file syntax (colon to equals sign for GITHUB_TOKEN)

### Fixed
- **2026-02-26** - Fixed `.env` file syntax (colon to equals sign)

### Deprecated
- None yet

### Removed
- None yet

---

## [0.1.0] - 2026-02-26

### Added
- Initial project setup
- Subagent system (8 specialized agents)
- MCP integration guide and status documentation
- Project vision and development phases

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 0.1.0 | 2026-02-26 | Initial setup with subagents and MCP |

---

## Update Guidelines

**When completing any task, update this changelog with:**

1. **Date** - YYYY-MM-DD format
2. **Category** - Added, Changed, Fixed, Deprecated, Removed
3. **Description** - Clear, concise summary of what changed
4. **Files** - List of files created or modified
5. **Task Record** - Link to detailed task record

**Example entry:**
```markdown
### Added
- **2026-02-26** - Description of change
  - Files: `path/to/file.ts`, `path/to/file2.md`
  - Task: `context-docs/task-records/2026-02-26-task-name.md`
```
