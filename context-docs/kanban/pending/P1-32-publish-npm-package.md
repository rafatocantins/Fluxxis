# Task: Publish npm Package

**ID:** P1-32
**Status:** 📋 Pending
**Created:** 2026-02-26
**Priority:** 🔴 High
**Week:** 9-10 (Polish & Release)

## Description
Publish the AI Design System as an npm package for distribution.

## Acceptance Criteria
- [ ] Configure package.json for publish
- [ ] Setup npm publish script
- [ ] Test local build and pack
- [ ] Publish to npm registry
- [ ] Verify package installation
- [ ] Add npm badge to README
- [ ] Document installation steps

## Implementation Notes
- Use semantic versioning (start at 0.1.0)
- Include only necessary files in package
- Add npmignore for exclusions
- Setup 2FA for npm account
- Consider scoped package (@ia-design-system/react)

## Dependencies
- All components complete
- P1-23: All tests passing
- P1-28: Accessibility audit passed

## Subagent
`testing-validator`

## Skill
`testing-validation`

## MCP Integration
- `github` - Release management
- `filesystem` - Package configuration

## Estimated Effort
2-3 hours

---
**Move to:** `kanban/in-progress/` when starting, `kanban/completed/` when done
