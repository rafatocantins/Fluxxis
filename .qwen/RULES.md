# FLUXXIS Rules

**Version:** 2.0  
**Effective:** 26 de Fevereiro, 2026  
**Status:** Active — Must Follow for All Development

---

## 🎯 Purpose

These rules ensure FLUXXIS maintains:
- ✅ Code quality
- ✅ Security
- ✅ Performance
- ✅ Ethics
- ✅ Team efficiency
- ✅ Long-term maintainability

**Rule 1: Always Follow the Master Plan** is non-negotiable.

---

## 📜 Core Rules (Non-Negotiable)

### Rule 1: Always Follow the Master Plan

**All development must align with the FLUXXIS Master Plan.**

**What This Means:**
- Every feature must map to a task in FLUXXIS-MASTER-PLAN.md
- No unplanned features (no "feature creep")
- Phase N must complete before Phase N+1 begins
- Risk mitigation tasks have equal priority to technical tasks

**Enforcement:**
- PR description must include task ID (e.g., "FLX-AG-01")
- CI check: Plan alignment verification
- Weekly review: Plan alignment check

**Violation:** PR rejected, must be re-aligned with plan.

---

### Rule 2: Performance Budgets Are Non-Negotiable

**If performance budget is exceeded, fix before adding features.**

**Budget Limits:**

| Metric | Limit | Measurement |
|--------|-------|-------------|
| Core bundle size | <10KB gzipped | `packages/core/dist/*.js.gz` |
| React adapter size | <5KB gzipped | `packages/react/dist/*.js.gz` |
| Intent resolution | <10ms | `benchmark:intent` |
| Morph application | <16ms (1 frame) | `benchmark:morph` |
| Signal capture | <1ms | `benchmark:signal` |
| Agent detection | <5ms | `benchmark:agent-detect` |
| License enforcement | <5ms | `benchmark:license` |
| Total overhead | <50ms | End-to-end benchmark |

**Enforcement:**
- CI check: Performance benchmarks
- Violation: PR blocked until fixed

**Violation:** PR blocked, must fix before merge.

---

### Rule 3: Ethics Before Launch

**Third-party ethics audit must pass before public launch.**

**Ethics Requirements:**

1. **No Dark Patterns**
   - No adaptation that hides user rights
   - No adaptation that increases friction for negative actions
   - No manipulative urgency

2. **Transparency**
   - All adaptations traceable
   - Debug mode shows why UI changed
   - User can export adaptation history

3. **User Control**
   - Override controls available
   - Opt-out of adaptation
   - Reset to default

4. **Accessibility**
   - WCAG 2.2 AA compliance required
   - Screen reader compatible
   - Keyboard navigation preserved

**Enforcement:**
- Ethics audit before launch
- Quarterly ethics reports
- 24-hour response to complaints

**Violation:** Launch blocked, must pass audit.

---

### Rule 4: Privacy by Design

**All signals processed client-side. No PII collected.**

**Data Handling:**

| Data Type | Storage | Retention | Transmission |
|-----------|---------|-----------|--------------|
| Behavioral signals | Client-side only | Session only | Never |
| Intent declarations | Client-side only | Until unmount | Never |
| Adaptation history | Client-side only | 24 hours | Never |
| Analytics (opt-in) | Encrypted server | 30 days | With consent only |
| API keys | Hashed server-side | Until revoked | Never (hashed only) |

**PII Definition (Never Collect):**
- Names, emails, user IDs
- IP addresses
- Device fingerprints
- Trackable session IDs

**Enforcement:**
- Code review: PII check
- Automated scanning: PII detection in CI
- Legal opinion: GDPR compliance before launch

**Violation:** PR blocked, legal review required.

---

### Rule 5: Accessibility Non-Negotiable

**WCAG 2.2 AA compliance required for all adaptations.**

**Checklist (Required for Every PR):**
```
□ Semantic HTML preserved
□ ARIA labels updated
□ Focus management implemented
□ Keyboard navigation tested
□ Screen reader tested (NVDA + VoiceOver)
□ Color contrast meets WCAG AA (4.5:1)
□ Reduced motion respected
□ High contrast mode compatible
□ Automated axe-core tests pass
□ Manual accessibility testing completed
```

**Enforcement:**
- CI gate: axe-core tests must pass
- Manual testing: Required for major changes
- Bug priority: Accessibility bugs are P0 (fix within 24 hours)

**Violation:** PR blocked until accessibility fix.

---

### Rule 6: Open Source First

**Core engine is MIT licensed. Community before monetization.**

**License Structure:**

| Component | License |
|-----------|---------|
| Core engine | MIT |
| React adapter | MIT |
| Vue adapter | Commercial |
| Angular adapter | Commercial |
| Basic devtools | MIT |
| Pro devtools | Commercial |
| Enterprise features | Commercial |

**Enforcement:**
- License check in CI
- Community engagement tracked
- Quarterly community reports

**Violation:** License mismatch blocks PR.

---

### Rule 7: Document Everything

**All decisions documented. Weekly progress published.**

**Documentation Requirements:**

| Artifact | When | Where |
|----------|------|-------|
| Task records | End of each task | `docs/task-records/` |
| Changelog entries | End of each day | `docs/changelog/CHANGELOG.md` |
| Session logs | End of each session | `docs/session-logs/` |
| Weekly progress | Every Friday | Twitter/LinkedIn + internal |
| Monthly report | End of each month | Blog post + GitHub Discussions |

**Enforcement:**
- PR requirement: Task record required
- Weekly review: Documentation completeness
- Public accountability: Weekly progress published

**Violation:** PR blocked until documentation added.

---

## 🏆 Team Excellence Rules

### Rule 8: Code Review Required

**No code merged without review.**

**Requirements:**
- Minimum 1 reviewer (2 for major changes)
- Reviewer must not be PR author
- Review checklist completed

**Review Checklist:**
```
□ Code follows style guide
□ Tests included and passing
□ Performance budget met
□ Accessibility checked
□ Security reviewed
□ Documentation updated
□ Task ID in PR description
```

**Violation:** Merge blocked, must get review.

---

### Rule 9: Tests Required

**No code merged without tests.**

**Requirements:**
- Unit tests for all new functions
- Integration tests for new features
- Test coverage >90%
- All tests passing

**Enforcement:**
- CI check: Test coverage verified
- Coverage report: Generated for every PR

**Violation:** PR blocked until tests added.

---

### Rule 10: Security First

**Security vulnerabilities are P0.**

**Security Requirements:**
- API keys hashed before storage
- Rate limiting enforced
- Input validation on all user input
- No secrets in code (use environment variables)
- Dependency scanning (npm audit)

**Enforcement:**
- CI check: npm audit, dependency scanning
- Security review: Required for auth-related changes
- Violation: P0 bug, fix within 24 hours

**Violation:** P0 bug, fix within 24 hours.

---

### Rule 11: Performance Monitoring

**Performance must be monitored continuously.**

**Monitoring Requirements:**
- Real-time performance dashboard
- Alerts for budget violations
- Weekly performance reports
- Monthly performance trends

**Metrics to Track:**
```
- Bundle size (KB)
- Intent resolution time (ms)
- Morph application time (ms)
- Agent detection accuracy (%)
- License enforcement time (ms)
- API response time (ms)
- Error rate (%)
- Uptime (%)
```

**Enforcement:**
- Dashboard: Public performance dashboard
- Alerts: Slack/email alerts for violations
- Reports: Weekly performance reports

**Violation:** Performance review required.

---

### Rule 12: Incident Response

**Incidents must be responded to within SLA.**

**SLA Requirements:**

| Severity | Response Time | Resolution Time | Example |
|----------|--------------|-----------------|---------|
| **P0** | 1 hour | 24 hours | Security breach, data leak |
| **P1** | 4 hours | 48 hours | Core feature broken |
| **P2** | 24 hours | 1 week | Non-critical bug |
| **P3** | 1 week | 1 month | Enhancement request |

**Enforcement:**
- On-call rotation: Weekly rotation
- Status page: Public status page
- Post-mortem: Required for P0/P1

**Violation:** Process review required.

---

### Rule 13: Version Control

**Git workflow must be followed.**

**Git Workflow:**
```
main (protected)
  ↑
develop (protected)
  ↑
feature/* (feature branches)
  ↑
fix/* (bug fixes)
  ↑
hotfix/* (production hotfixes)
```

**Commit Message Format:**
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

**Example:**
```
feat(signals): Add agent detection module

- Implement 6 heuristics for agent detection
- Add real-time detector class
- Add 27 comprehensive tests

Closes: FLX-AG-01
```

**Enforcement:**
- CI check: Commit message format verified
- Branch protection: main/develop protected

**Violation:** Commit rejected.

---

### Rule 14: Continuous Integration

**CI must pass before merge.**

**CI Pipeline:**
```
1. Lint (ESLint, Prettier)
2. Type check (TypeScript)
3. Test (unit, integration)
4. Performance (benchmarks)
5. Security (npm audit)
6. Accessibility (axe-core)
7. Build (verify build works)
```

**Enforcement:**
- GitHub Actions: CI pipeline automated
- Status checks: All must pass
- Violation: Merge blocked

**Violation:** Merge blocked until CI passes.

---

### Rule 15: Deployment Process

**Deployments must follow process.**

**Deployment Process:**
```
1. Code review ✅
2. CI passes ✅
3. Staging deployment ✅
4. Staging tests ✅
5. Production deployment ✅
6. Smoke tests ✅
7. Monitoring ✅
```

**Environments:**
- `development`: Feature branches
- `staging`: Pre-production testing
- `production`: Live environment

**Enforcement:**
- Automated deployments: CI/CD pipeline
- Approval required: Production deployments
- Rollback plan: Must have rollback plan

**Violation:** Deployment blocked.

---

## 📊 Compliance Tracking

### Weekly Checkpoint

Every week, review:

| Rule | Status | Notes |
|------|--------|-------|
| Rule 1: Follow Master Plan | ✅ / ❌ | Tasks aligned? |
| Rule 2: Performance Budget | ✅ / ❌ | Benchmarks passing? |
| Rule 3: Ethics | ✅ / ❌ | Audit on track? |
| Rule 4: Privacy | ✅ / ❌ | No PII collected? |
| Rule 5: Accessibility | ✅ / ❌ | WCAG tests passing? |
| Rule 6: Open Source | ✅ / ❌ | Community engaged? |
| Rule 7: Documentation | ✅ / ❌ | Records up to date? |
| Rule 8: Code Review | ✅ / ❌ | Reviews completed? |
| Rule 9: Tests | ✅ / ❌ | Coverage >90%? |
| Rule 10: Security | ✅ / ❌ | No vulnerabilities? |
| Rule 11: Performance Monitoring | ✅ / ❌ | Dashboard updated? |
| Rule 12: Incident Response | ✅ / ❌ | SLA met? |
| Rule 13: Version Control | ✅ / ❌ | Git workflow followed? |
| Rule 14: CI | ✅ / ❌ | CI passing? |
| Rule 15: Deployment | ✅ / ❌ | Process followed? |

### Confidence Score Impact

| Rule Violated | Confidence Impact |
|--------------|-------------------|
| Rule 1 (Plan) | -5% |
| Rule 2 (Performance) | -10% |
| Rule 3 (Ethics) | -15% |
| Rule 4 (Privacy) | -15% |
| Rule 5 (Accessibility) | -10% |
| Rule 6 (Open Source) | -5% |
| Rule 7 (Documentation) | -3% |
| Rule 8 (Code Review) | -5% |
| Rule 9 (Tests) | -10% |
| Rule 10 (Security) | -15% |
| Rule 11 (Performance Monitoring) | -5% |
| Rule 12 (Incident Response) | -5% |
| Rule 13 (Version Control) | -3% |
| Rule 14 (CI) | -5% |
| Rule 15 (Deployment) | -5% |

**Current Confidence:** 100% (Phase 0 Complete)  
**Target:** Maintain >90%

---

## 🎯 Enforcement Mechanisms

### Automated

| Mechanism | What It Checks | Frequency |
|-----------|---------------|-----------|
| CI Performance Gates | Bundle size, benchmarks | Every PR |
| License Check | License compliance | Every PR |
| axe-core Tests | Accessibility | Every PR |
| PII Scanner | Privacy violations | Every PR |
| Plan Alignment | Task ID in PR description | Every PR |
| Test Coverage | Coverage >90% | Every PR |
| Security Scan | npm audit, dependencies | Every PR |

### Manual

| Mechanism | What It Checks | Frequency |
|-----------|---------------|-----------|
| Code Review | All rules | Every PR |
| Weekly Checkpoint | All rules | Weekly |
| Ethics Audit | Rule 3 | Before launch, annually |
| Legal Review | Rules 4, 5 | Before launch, annually |
| Security Review | Rule 10 | Before launch, quarterly |

### Consequences

| Violation Count | Consequence |
|-----------------|-------------|
| 1st | Warning, must fix |
| 2nd | Team review, public acknowledgment |
| 3rd | Development freeze until fixed |
| 4th | Confidence score reduced, investor notification |

---

## 📝 Amendment Process

**These rules can be amended, but only with proper process:**

1. **Proposal** — RFC posted to GitHub Discussions
2. **Discussion** — 7-day community comment period
3. **Vote** — Core team + advisory board vote (2/3 majority required)
4. **Implementation** — Rules updated, changelog entry created
5. **Notification** — Community notified of changes

**Emergency Amendments:**
- Core team can enact emergency amendments (security, legal compliance)
- Must be ratified by vote within 30 days
- Public explanation required

---

## 🎯 Acknowledgment

**By contributing to FLUXXIS, you acknowledge:**

- [ ] I have read and understood these rules
- [ ] I will follow these rules in my contributions
- [ ] I understand the consequences of violations
- [ ] I agree to the dual-license model
- [ ] I commit to ethical development practices

**Signature:** _________________  
**Date:** _________________

---

## 📚 Related Documents

| Document | Purpose |
|----------|---------|
| [FLUXXIS-MASTER-PLAN.md](./FLUXXIS-MASTER-PLAN.md) | Complete roadmap |
| [FLUXXIS-PAPER.md](./FLUXXIS-PAPER.md) | Technical foundation |
| [FLUXXIS-VISION.md](./FLUXXIS-VISION.md) | Paradigm vision |
| [FLUXXIS-AGENTIC-ERA.md](./FLUXXIS-AGENTIC-ERA.md) | Agentic strategy |
| [docs/phase-0/README.md](./docs/phase-0/README.md) | Phase 0 completion |
| [.qwen/AGENTS.md](./.qwen/AGENTS.md) | Agent ecosystem |
| [.qwen/SKILLS.md](./.qwen/SKILLS.md) | Skill ecosystem |

---

**Last Updated:** 26 de Fevereiro, 2026  
**Next Review:** 26 de Março, 2026 (monthly)  
**Status:** Active — Must Follow

---

**"Rules are not constraints. They are commitments to our users and ourselves."**
