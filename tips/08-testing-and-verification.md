[Home](../README.md) > 08 Testing & Verification

# 08 Testing & Verification

### #08.01 Give Claude a Feedback Loop

> **Level:** Beginner | **Impact:** High

**Problem:** Without feedback, Claude produces code that looks right but silently breaks.

**Do this:**
```markdown
# In CLAUDE.md
## Verification Commands
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm test`
- Type check: `npx tsc --noEmit`

Always run all verification commands after making changes. Fix failures before moving on.
```

**Why:** Giving Claude access to tests, linters, and build commands produces 2-3x quality improvement over no-feedback generation.

---

### #08.02 TDD: Write Failing Test First

> **Level:** Beginner | **Impact:** High

**Problem:** Writing code first then tests leads to tests that verify implementation rather than behavior.

**Do this:**
```
"Write a failing test for: users should not be able to login with expired tokens.
Do NOT write the implementation yet."

# After test is written and failing:
"Now implement the minimum code to make this test pass."
```

**Why:** A failing test defines the contract before implementation, so Claude builds toward correctness instead of plausibility.

---

### #08.03 Phase-Wise Test Gates

> **Level:** Intermediate | **Impact:** High

**Problem:** Errors in early phases compound into hard-to-debug failures in later phases.

**Do this:**
```
"After completing each phase:
1. Run the build: npm run build
2. Run the linter: npm run lint
3. Run unit tests: npm test -- --grep 'Phase N'
4. Fix ALL failures before starting the next phase
Never skip a gate."
```

**Why:** Catching failures at each gate prevents error cascades that become exponentially harder to debug downstream.

---

### #08.04 Fix-First Review Pattern

> **Level:** Intermediate | **Impact:** Medium

**Problem:** Mixing mechanical fixes with genuine design questions creates noisy, slow reviews.

**Do this:**
```
"Review these changes. For mechanical issues (formatting, imports, naming),
fix them directly without asking. For genuine design decisions,
batch all questions into a single AskUserQuestion."
```

**Why:** Auto-fixing the obvious stuff reduces review noise so you only spend time on decisions that actually need human judgment.

---

### #08.05 The De-Sloppify Pattern

> **Level:** Advanced | **Impact:** Medium

**Problem:** Negative instructions ("don't over-test", "don't add unnecessary comments") make the model hesitant and produce worse output.

**Do this:**
```
# Bad: negative instructions during implementation
"Implement auth. Don't add unnecessary error handling. Don't over-test."

# Good: separate cleanup agent after implementation
"Implement auth with full test coverage."
# Then in a new session:
"Review this code. Remove unnecessary error handling, redundant tests,
and over-engineered abstractions."
```

**Why:** Negative instructions during generation cause hesitation; a separate cleanup pass removes slop without degrading the implementation.

---

### #08.06 Verification Gate Iron Law

> **Level:** Advanced | **Impact:** High

**Problem:** Claude claims "this should work" or "tests should pass" without actually running them.

**Do this:**
```
# In CLAUDE.md
## Iron Law
Confidence is not evidence. NEVER claim code works without running:
  npm run build && npm run lint && npm test
Paste the actual output. "Should work" is not acceptable.
```

**Why:** Always run the actual test/build and verify the output rather than trusting Claude's self-assessment.

---

### #08.07 Review with Fresh Context

> **Level:** Advanced | **Impact:** High

**Problem:** The session that wrote the code is anchored to its own reasoning and cannot see its blind spots.

**Do this:**
```bash
# After implementation is complete, review from a fresh session:
claude -p "Review these changes for bugs, missing edge cases, and design issues.
Be adversarial. $(git diff main...HEAD)"
```

**Why:** A fresh context with zero prior anchoring catches issues the author session is structurally blind to.

---

### #08.08 The Santa Method

> **Level:** Expert | **Impact:** Medium

**Problem:** A single reviewer has systematic blind spots regardless of how thorough the review is.

**Do this:**
```bash
# Agent A reviews independently
claude -p "Review this diff for correctness and security: $(git diff main)" > review-a.md

# Agent B reviews independently
claude -p "Review this diff for correctness and security: $(git diff main)" > review-b.md

# Compare findings
claude -p "Compare these two independent code reviews. Highlight where they
agree (high confidence issues) and where they disagree (needs human judgment):
REVIEW A: $(cat review-a.md)
REVIEW B: $(cat review-b.md)"
```

**Why:** Two independent reviewers with different random seeds catch different issues, and agreement between them signals high-confidence findings.

---

### #08.09 Adversarial Verification Prompts

> **Level:** Advanced | **Impact:** Medium

**Problem:** Your verification steps are too lenient -- they confirm instead of challenge.

**Do this:**
```
"Your job is not to confirm the work. Your job is to BREAK it.
Run the actual tests. Try edge cases. Check error paths.
If you can't break it, THEN it passes.

Common verification failures to avoid:
- Reading code and writing PASS instead of running it
- Being fooled by circular tests or heavy mocks
- Trusting self-reports without evidence
- Hedging with PARTIAL instead of making a call"
```

**Why:** LLMs are naturally agreeable -- verification prompts must explicitly push against this tendency to get genuine quality gates.

---

### #08.10 Cross-Phase Regression Gate

> **Level:** Advanced | **Impact:** High

**Problem:** Phase 2 silently breaks Phase 1, and you do not discover it until everything is wired together.

**Do this:**
```bash
# After completing each phase, run ALL prior phases' tests:
npm test -- --grep "Phase 1"  # Re-run phase 1 tests
npm test -- --grep "Phase 2"  # Run phase 2 tests

# In CLAUDE.md:
## Regression Gate
After completing any phase, run the FULL test suite -- not just
the current phase's tests. Fix any regressions before proceeding.
```

**Why:** Catching regressions at each boundary prevents error cascades that become exponentially harder to debug downstream.

---

### #08.11 Cross-Model QA Gate

> **Level:** Expert | **Impact:** Medium

**Problem:** Claude reviewing its own output has systematic blind spots it cannot see.

**Do this:**
```bash
# Use a different model to audit Claude's work:
# Option 1: Bouncer plugin (Gemini audits Claude via Stop hook)
# Option 2: Manual cross-model review
claude -p "Review this implementation for correctness: $(git diff main)" > claude-review.md

# In a separate terminal with a different model:
codex -p "Review this implementation for correctness: $(git diff main)" > codex-review.md

# Compare findings:
claude -p "Compare these reviews and highlight disagreements:
$(cat claude-review.md) vs $(cat codex-review.md)"
```

**Why:** Different models have different failure modes -- agreement between them signals high confidence, disagreement signals areas needing human judgment.

---

---

[< 07 Planning & Specs](07-planning-and-specs.md) | [Home](../README.md) | [09 Multi-Agent >](09-multi-agent.md)
