# 06 Prompting

### #06.01 Describe Outcomes, Not Steps

> **Level:** Beginner | **Impact:** High

**Problem:** Step-by-step instructions micromanage Claude and produce worse results than stating the goal.

**Do this:**
```
# Bad: imperative
"Open src/auth.ts, find the login function, add a try-catch around the fetch call on line 42"

# Good: declarative
"Fix the unhandled promise rejection in the login flow"
```

**Why:** Declarative prompts let Claude use its full context to find the best solution rather than blindly following possibly-wrong steps.

---

### #06.02 Paste Bug, Say "Fix"

> **Level:** Beginner | **Impact:** High

**Problem:** Context switching between debugging tools and your editor kills momentum.

**Do this:**
```
# Paste the error/stack trace directly, then:
"Fix this"

# Or with Slack MCP enabled:
"Check the #alerts channel, find the latest error, and fix it"
```

**Why:** Claude traces from error to root cause to fix in one shot -- zero context switching required.

---

### #06.03 Challenge Claude to Prove Its Work

> **Level:** Intermediate | **Impact:** High

**Problem:** Claude produces changes that look right but may have subtle issues you miss in review.

**Do this:**
```
"Grill me on these changes and don't make a PR until I pass your test."
```

**Why:** Forcing Claude to quiz you on the changes creates a verification loop that catches misunderstandings before they ship.

---

### #06.04 Scrap and Redo After Mediocre Fix

> **Level:** Intermediate | **Impact:** High

**Problem:** Iterating on a mediocre solution converges on a local optimum instead of the right design.

**Do this:**
```
"Knowing everything you know now, scrap this and implement the elegant solution."
```

**Why:** The second attempt with full context of what went wrong produces dramatically better architecture than incremental patching.

---

### #06.05 After 2 Failed Corrections, Start Fresh

> **Level:** Intermediate | **Impact:** Medium

**Problem:** Correcting Claude a third time usually makes things worse as context gets polluted.

**Do this:**
```
# After two failed correction attempts:
/clear
# Then write a single, better prompt that incorporates what you learned
```

**Why:** A clean context with a well-crafted prompt beats a polluted context with accumulated misunderstandings every time.

---

### #06.06 Force Deeper Thinking

> **Level:** Advanced | **Impact:** High

**Problem:** Default responses are often surface-level when you need deep analysis.

**Do this:**
```
# Maximum thinking effort
"ultrathink"

# Force extended reasoning
"Think for ten paragraphs about what's going on here"

# Force plan comparison
"Give me 2 implementation plans with tradeoffs before writing any code"
```

**Why:** Explicit thinking instructions unlock deeper reasoning and prevent Claude from jumping to the first plausible solution.

---

### #06.07 Concept Elevation Meta-Prompt

> **Level:** Advanced | **Impact:** Medium

**Problem:** Your rough prompt works but could be significantly more effective with better wording.

**Do this:**
```
"Here's my prompt: [paste rough prompt]. Make this prompt more concise and more effective."
# Then use the elevated version in a fresh session
```

**Why:** Claude is better at writing prompts for itself than you are -- let it optimize your instructions before executing them.

---

### #06.08 Write Naive Algorithm First

> **Level:** Advanced | **Impact:** Medium

**Problem:** Asking for an optimized solution upfront often produces clever-but-broken code.

**Do this:**
```
"Implement the simplest correct version first. No optimizations. Then we'll profile and optimize."
```

**Why:** A naive correct implementation anchors the solution so subsequent optimizations can be verified against known-good behavior.

---

### #06.09 Anti-Sycophancy in Brainstorming

> **Level:** Expert | **Impact:** Medium

**Problem:** Claude defaults to agreeable responses that do not challenge your assumptions.

**Do this:**
```
"Never say 'That's an interesting approach' -- take a position instead."

# And when you get a response:
"Push once, then push again -- the first answer is the polished version."
```

**Why:** Forcing Claude past its agreeable defaults gets you genuine critical feedback instead of expensive validation.

---

### #06.10 The Reframe Pattern

> **Level:** Expert | **Impact:** High

**Problem:** Users describe solutions ("build a daily briefing app") when they should describe problems.

**Do this:**
```
"You said 'daily briefing app' but you're actually building a chief of staff AI.
Reframe the problem before proposing any solutions."
```

**Why:** Reframing forces problem understanding before solution design, which prevents building the wrong thing efficiently.

---
