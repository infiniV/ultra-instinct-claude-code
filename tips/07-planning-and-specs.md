# 07 Planning & Specs

### #07.01 Always Start with Plan Mode

> **Level:** Beginner | **Impact:** High

**Problem:** Jumping straight to implementation produces scattered, poorly structured code.

**Do this:**
```
# Press Shift+Tab twice to enter Plan mode before any task
# Pour energy into the plan -- a good plan lets Claude one-shot the implementation
```

**Why:** Investing in the plan phase is the highest-leverage thing you can do for output quality.

---

### #07.02 The Interview Pattern

> **Level:** Beginner | **Impact:** High

**Problem:** Your spec is incomplete and you do not know what you are missing.

**Do this:**
```
"Here's what I want to build: [minimal spec].
Interview me -- ask every question you need to fully understand the requirements.
Use AskUserQuestion. I expect 40+ questions. Don't start implementing until you're done."

# Then execute the plan in a FRESH session with /clear
```

**Why:** Claude surfaces edge cases and requirements you have not considered, and a fresh session executes the complete spec without context pollution.

---

### #07.03 Phase-Gated Plans with Tests

> **Level:** Intermediate | **Impact:** High

**Problem:** Large implementations drift off course and errors compound across phases.

**Do this:**
```markdown
## Phase 1: Auth module
- [ ] Implement login/logout
- [ ] Unit tests (must pass before Phase 2)
- [ ] Integration test: full login flow

## Phase 2: User profile
- [ ] Implement profile CRUD
- [ ] Unit tests (must pass before Phase 3)
- [ ] Integration test: profile + auth flow
```

**Why:** Test gates after each phase catch regressions early instead of letting them cascade into later phases.

---

### #07.04 Second Claude Reviews Your Plan

> **Level:** Intermediate | **Impact:** High

**Problem:** A single session is blind to its own planning assumptions.

**Do this:**
```bash
# Session 1 writes the plan, then:
claude -p "Review this implementation plan as a staff engineer.
Find gaps, missing edge cases, and questionable decisions:
$(cat plan.md)"
```

**Why:** A second session catches assumptions and gaps the planning session cannot see.

---

### #07.05 Prototype Over PRD

> **Level:** Intermediate | **Impact:** Medium

**Problem:** Writing detailed PRDs is slow and they are often wrong anyway.

**Do this:**
```
"Build a rough prototype of [feature]. Don't worry about edge cases or polish."
# Evaluate, then:
"Build version 2 with these changes: [learnings from v1]"
# Repeat 5-10 times -- each version costs minutes, not days
```

**Why:** The cost of building is now so low that 20-30 quick prototypes teach you more than any spec document.

---

### #07.06 The Sprint Chain

> **Level:** Advanced | **Impact:** High

**Problem:** Ad-hoc development skips critical review stages that catch problems early.

**Do this:**
```
office-hours -> CEO review -> design review -> eng review -> build -> review -> QA -> ship -> retro
```
Each step is a skill with a focused persona:
```
- CEO review: scope and priority alignment
- Design review: UX and information architecture
- Eng review: technical feasibility, ASCII architecture diagrams
- Build: implementation with test gates
- QA: verification against original requirements
```

**Why:** Structured review stages with specialized personas catch category errors that a single generalist session misses.

---

### #07.07 Save Plans in GitHub Issues, Not Markdown

> **Level:** Advanced | **Impact:** Medium

**Problem:** Plans in markdown files lose versioning, comments, and cross-references.

**Do this:**
```bash
# Create the plan as an issue
gh issue create --title "Plan: user auth module" --body "$(cat plan.md)"

# Reference it from sub-tasks
gh issue create --title "Implement login flow" --body "Part of #42"

# Claude can read and update it
"Read issue #42 and implement the next incomplete phase"
```

**Why:** GitHub Issues give you versioning, comments, cross-references, and project board integration for free.

---

### #07.08 Orchestration Pattern: Command -> Agent -> Skill

> **Level:** Advanced | **Impact:** Medium

**Problem:** Monolithic prompts try to do everything and do nothing well.

**Do this:**
```
Command (entry point)
  -> Agent (fetches data, has preloaded skills)
    -> Skill (creates output independently)

# Example:
/sprint-plan (command)
  -> Planning Agent (reads issues, codebase)
    -> Architecture Skill (draws system diagram)
    -> Test Plan Skill (generates test matrix)
    -> Task Breakdown Skill (creates phase-gated tasks)
```

**Why:** Separating orchestration from execution lets each component focus on what it does best with minimal context pollution.

---

### #07.09 Four Scope Modes in Plan Review

> **Level:** Expert | **Impact:** Medium

**Problem:** Plans are always reviewed as-is, missing opportunities to deliberately adjust scope.

**Do this:**
```
Review this plan in four modes:

1. EXPANSION: "What's the 10x version for 2x effort?"
2. SELECTIVE EXPANSION: "Which one feature deserves more investment?"
3. HOLD SCOPE: "Is this plan right-sized as written?"
4. REDUCTION: "What's the minimum viable version we can ship tomorrow?"
```

**Why:** Explicitly considering all four scope modes prevents both under-building and over-engineering.

---

### #07.10 Force ASCII Architecture Diagrams

> **Level:** Expert | **Impact:** Medium

**Problem:** Claude describes architecture in prose that hides structural problems.

**Do this:**
```
"Draw the system architecture as an ASCII diagram. Show every service,
data store, and communication path. This is mandatory before implementation."

# Example output:
# [Client] --HTTP--> [API Gateway] --gRPC--> [Auth Service]
#                         |                        |
#                         v                        v
#                   [Cache (Redis)]          [DB (Postgres)]
```

**Why:** LLMs produce significantly more complete and accurate designs when forced to visualize the system structure.

---
