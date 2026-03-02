# FLUXXIS Governing Rules

**Version:** 1.0  
**Effective:** 2026-02-26  
**Status:** Active

---

## 📜 Rule 1: Always Follow the Master Plan

**All development must align with the FLUXXIS Master Plan.**

### What This Means

1. **No Unplanned Features**
   - Every feature must map to a task in [FLUXXIS-MASTER-PLAN.md](./FLUXXIS-MASTER-PLAN.md)
   - New features require plan amendment before implementation
   - Feature requests go to backlog, not active development

2. **Phased Rollout Discipline**
   - Phase N must complete before Phase N+1 begins
   - No skipping phases (even if "easy")
   - Phase completion requires all success metrics met

3. **Risk Mitigation Priority**
   - Risk mitigation tasks (MIT-*) have equal priority to technical tasks (FLX-*)
   - 20% of development time allocated to risk mitigation
   - Confidence score tracked weekly

4. **Documentation Updates**
   - Plan documents updated before code changes
   - Task status updated within 24 hours
   - Weekly progress summary published

### Enforcement

- **Code Review:** All PRs checked against master plan
- **CI Gates:** Plan compliance check in CI pipeline
- **Weekly Review:** Plan alignment reviewed in weekly checkpoint

---

## 📜 Rule 2: Performance Budgets Are Non-Negotiable

**If performance budget is exceeded, fix before adding features.**

### Budget Limits

| Metric | Limit | Measurement |
|--------|-------|-------------|
| Core bundle size | <10KB gzipped | `packages/core/dist/*.js.gz` |
| React adapter size | <5KB gzipped | `packages/react/dist/*.js.gz` |
| Intent resolution | <10ms | `benchmark:intent` |
| Morph application | <16ms (1 frame) | `benchmark:morph` |
| Signal capture | <1ms | `benchmark:signal` |
| Total overhead | <50ms | End-to-end benchmark |

### Enforcement

```yaml
# .github/workflows/performance.yml
name: Performance Budget

on: [pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - name: Bundle Size Check
        uses: preactjs/compressed-size-action@v2
        with:
          max-size: '10kb'  # Core
          pattern: './packages/core/dist/**/*.js'
      
      - name: Intent Resolution Benchmark
        run: pnpm benchmark:intent
        # Must complete in <10ms
      
      - name: Morph Animation Benchmark
        run: pnpm benchmark:morph
        # Must maintain 60fps (<16ms per frame)
      
      - name: Fail if Budget Exceeded
        run: |
          if [ $INTENT_MS -gt 10 ]; then
            echo "Intent resolution exceeded budget ($INTENT_MS > 10ms)"
            exit 1
          fi
          if [ $MORPH_MS -gt 16 ]; then
            echo "Morph application exceeded budget ($MORPH_MS > 16ms)"
            exit 1
          fi
```

### Violations

| Violation | Action |
|-----------|--------|
| First offense | PR blocked, must fix |
| Second offense | Team review required |
| Third offense | Performance freeze (no features until fixed) |

---

## 📜 Rule 3: Ethics Before Launch

**Third-party ethics audit must pass before public launch.**

### Ethics Requirements

1. **No Dark Patterns**
   - No adaptation that hides user rights
   - No adaptation that increases friction for negative actions (cancel, delete, export)
   - No manipulative urgency (false scarcity, fake countdowns)

2. **Transparency**
   - All adaptations traceable (audit log)
   - Debug mode shows why UI changed
   - User can export adaptation history

3. **User Control**
   - Override controls ("keep this layout")
   - Opt-out of adaptation
   - Reset to default

4. **Accessibility**
   - WCAG 2.2 AA compliance required
   - Screen reader compatible
   - Keyboard navigation preserved
   - Reduced motion respected

### Audit Process

```
Timeline: Before launch (Week 4)
Auditor: Third-party firm (Omidyar, Center for Humane Technology, or EFF)
Scope:
  1. Review all adaptation rules for dark patterns
  2. Verify transparency mechanisms
  3. Test user override controls
  4. Accessibility compliance (WCAG 2.2 AA)
  5. Privacy implementation (GDPR, CCPA)

Deliverable: Public ethics certification
Validity: 1 year (renew annually)
```

### Enforcement

- **Launch Gate:** Ethics audit certificate required for launch
- **Quarterly Reviews:** Public ethics report published quarterly
- **Violation Response:** 24-hour response to ethics complaints

---

## 📜 Rule 4: Privacy by Design

**All signals processed client-side. No PII collected.**

### Data Handling Rules

| Data Type | Storage | Retention | Transmission |
|-----------|---------|-----------|--------------|
| Behavioral signals | Client-side only | Session only | Never |
| Intent declarations | Client-side only | Until unmount | Never |
| Adaptation history | Client-side only | 24 hours | Never |
| Analytics (opt-in) | Encrypted server | 30 days | With consent only |

### PII Definition

**Never collect:**
- Names
- Email addresses
- User IDs
- IP addresses
- Device fingerprints
- Session IDs (trackable across sessions)

**Allowed (aggregated, anonymized):**
- Dwell time (milliseconds)
- Hover count
- Scroll depth (percentage)
- Click count
- Device type (mobile/tablet/desktop - not specific model)

### GDPR Compliance

```typescript
// ✅ GOOD: Anonymous, session-only
{
  type: 'click',
  componentId: 'button-123',
  dwellTime: 1500,  // Aggregated metric
  anonymized: true
}

// ❌ BAD: Collects PII
{
  type: 'click',
  userId: 'john@example.com',  // PII!
  sessionId: 'abc123',  // Trackable!
  timestamp: 1234567890
}
```

### Enforcement

- **Code Review:** All signal collection reviewed for PII
- **Automated Scanning:** PII detection in CI pipeline
- **Legal Opinion:** Written GDPR compliance opinion before launch

---

## 📜 Rule 5: Accessibility Non-Negotiable

**WCAG 2.2 AA compliance required for all adaptations.**

### Accessibility Checklist (Required for Every PR)

```
□ Semantic HTML preserved after adaptation
□ ARIA labels updated on structural changes
□ Focus management implemented
□ Keyboard navigation tested
□ Screen reader tested (NVDA + VoiceOver)
□ Color contrast meets WCAG AA (4.5:1)
□ Reduced motion respected
□ High contrast mode compatible
□ Automated axe-core tests pass
□ Manual accessibility testing completed
```

### Tooling

```json
{
  "devDependencies": {
    "@axe-core/react": "^4.0.0",
    "eslint-plugin-jsx-a11y": "^6.0.0",
    "jest-axe": "^8.0.0"
  },
  "scripts": {
    "test:a11y": "jest --config jest.axe.config.js",
    "lint:a11y": "eslint --plugin jsx-a11y src/"
  }
}
```

### Enforcement

- **CI Gate:** axe-core tests must pass
- **Manual Testing:** Screen reader testing required for major changes
- **Bug Priority:** Accessibility bugs are P0 (fix within 24 hours)

---

## 📜 Rule 6: Open Source First

**Core engine is MIT licensed. Community before monetization.**

### License Structure

| Component | License | Rationale |
|-----------|---------|-----------|
| Core engine | MIT | Maximum adoption |
| React adapter | MIT | Largest ecosystem |
| Vue adapter | Commercial | Development cost |
| Angular adapter | Commercial | Development cost |
| Basic devtools | MIT | Community debugging |
| Pro devtools | Commercial | Advanced features |
| Enterprise features | Commercial | Compliance, support |

### Community Commitments

1. **Transparent Development**
   - Build in public (weekly progress threads)
   - RFC process for major changes
   - Public roadmap

2. **Contributor Friendly**
   - Good First Issue labels
   - Contributor documentation
   - Monthly contributor calls

3. **Recognition**
   - Contributor spotlight (monthly)
   - Contributor swag
   - Advisory board for top contributors

### Enforcement

- **License Check:** Automated license verification in CI
- **Community Manager:** Dedicated time for community engagement
- **Quarterly Report:** Community health metrics published

---

## 📜 Rule 7: Document Everything

**All decisions documented. Weekly progress published.**

### Documentation Requirements

| Artifact | When | Where |
|----------|------|-------|
| Task records | End of each task | `context-docs/task-records/` |
| Changelog entries | End of each day | `context-docs/changelog/CHANGELOG.md` |
| Session logs | End of each session | `context-docs/session-logs/` |
| Weekly progress | Every Friday | Twitter/LinkedIn + internal |
| Monthly report | End of each month | Blog post + GitHub Discussions |

### Task Record Template

```markdown
# Task: [Task Name]

**Date:** YYYY-MM-DD
**Status:** ✅ Completed / ⏳ In Progress / ❌ Blocked
**Agent:** [Who worked on it]

## Objective
[Brief description]

## Actions Taken
1. [Action 1]
2. [Action 2]

## Files Created/Modified
- `path/to/file.ts` - Created

## Outcomes
- ✅ [Outcome 1]
- ✅ [Outcome 2]

## Follow-up Required
- [ ] [Task 1]
- [ ] [Task 2]
```

### Enforcement

- **PR Requirement:** Task record required for PR merge
- **Weekly Review:** Documentation completeness reviewed weekly
- **Public Accountability:** Weekly progress published regardless of status

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

**Current Confidence:** 87%  
**Target:** Maintain >85%

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

### Manual

| Mechanism | What It Checks | Frequency |
|-----------|---------------|-----------|
| Code Review | All rules | Every PR |
| Weekly Checkpoint | All rules | Weekly |
| Ethics Audit | Rule 3 | Before launch, annually |
| Legal Review | Rules 4, 5 | Before launch, annually |

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

1. **Proposal** - RFC posted to GitHub Discussions
2. **Discussion** - 7-day community comment period
3. **Vote** - Core team + advisory board vote (2/3 majority required)
4. **Implementation** - Rules updated, changelog entry created
5. **Notification** - Community notified of changes

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

**Last Updated:** 2026-02-26  
**Next Review:** 2026-03-26 (quarterly)  
**Status:** Active

---

**"Rules are not constraints. They are commitments to our users and ourselves."**
