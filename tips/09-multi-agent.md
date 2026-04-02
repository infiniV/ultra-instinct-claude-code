[Home](../README.md) > 09 Multi-Agent

# 09 Multi-Agent

### #09.01 Use Subagents for Exploration

> **Level:** Beginner | **Impact:** High

**Problem:** Reading 20+ files in your main conversation bloats context and wastes tokens.

**Do this:**
```
Explore the authentication module using subagents. Read all files in src/auth/
and return a summary of the architecture, entry points, and dependencies.
```

**Why:** The subagent reads everything and returns a compact summary, keeping your main context clean for actual work.

---

### #09.02 One Input, One Output Per Agent

> **Level:** Beginner | **Impact:** Medium

**Problem:** Agents that juggle multiple objectives produce muddled, unfocused results.

**Do this:**
```
# Agent 1: Analyze
"List all API endpoints that lack input validation."

/clear

# Agent 2: Fix
"Add zod validation to these endpoints: POST /users, PUT /users/:id, POST /orders"
```

**Why:** Each agent with a single clear objective produces sharper, more reliable output than one agent multitasking.

---

### #09.03 The Scout Pattern (Haiku Explores, Sonnet Implements)

> **Level:** Intermediate | **Impact:** High

**Problem:** Using Sonnet/Opus to read 30 files for exploration burns expensive tokens on cheap work.

**Do this:**
```jsonc
// settings.json
{
  "env": {
    "CLAUDE_CODE_SUBAGENT_MODEL": "claude-haiku-3-5-20241022"
  }
}
```
```
# Prompt pattern:
Use a subagent to scan all files in src/ and identify which 4-5 files
handle payment processing. Then I'll work on those directly.
```

**Why:** Haiku reads 30 files for pennies, Sonnet reads the 4 that matter -- 10-20x cheaper exploration.

---

### #09.04 Smart Model Routing Per Agent

> **Level:** Intermediate | **Impact:** High

**Problem:** Using Opus for everything is expensive; using Haiku for everything produces weak architecture decisions.

**Do this:**
```
# Route by task type:
Haiku  -> explore, lookup, file scanning, writing drafts
Sonnet -> implementation, debugging, code generation
Opus   -> architecture decisions, complex reviews, planning

# Switch in-session:
/model claude-haiku-3-5-20241022    # cheap exploration
/model claude-sonnet-4-20250514     # implementation
/model claude-opus-4-20250514       # architecture review
```

**Why:** Matching model capability to task complexity saves 30-50% without sacrificing quality where it matters.

---

### #09.05 Parallel Agent Execution

> **Level:** Intermediate | **Impact:** Medium

**Problem:** Running security analysis, then performance review, then type checking sequentially wastes time.

**Do this:**
```
Launch three subagents in parallel:
1. Security audit: scan src/ for SQL injection, XSS, and auth bypass vulnerabilities
2. Performance review: identify N+1 queries, missing indexes, and unbounded loops in src/api/
3. Type coverage: find all `any` types and untyped function parameters in src/
```

**Why:** Independent analyses run simultaneously, cutting wall-clock time to the duration of the slowest agent.

---

### #09.06 Team Mode Staged Pipeline

> **Level:** Advanced | **Impact:** High

**Problem:** Complex features need planning, execution, and verification -- one-shot prompts skip steps.

**Do this:**
```bash
# Pipeline: plan -> PRD -> execute -> verify -> fix
MAX_ATTEMPTS=3
ATTEMPT=0

claude -p "Create a plan for adding OAuth2 to the API" > plan.md
claude -p "Convert this plan to a PRD with acceptance criteria: $(cat plan.md)" > prd.md
claude -p "Implement the PRD: $(cat prd.md)"

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  RESULT=$(claude -p "Run tests and verify the OAuth2 implementation")
  echo "$RESULT" | grep -q "ALL PASS" && break
  claude -p "Fix these failures: $RESULT"
  ATTEMPT=$((ATTEMPT + 1))
done
```

**Why:** Staged pipelines with bounded retries prevent runaway sessions and ensure each phase completes before the next begins.

---

### #09.07 Cross-Model Orchestration via tmux

> **Level:** Advanced | **Impact:** Medium

**Problem:** You want Claude, Codex, and Gemini working on different parts of the same project simultaneously.

**Do this:**
```bash
#!/bin/bash
# Spawn workers in tmux panes
tmux new-session -d -s agents

tmux send-keys -t agents "claude -p 'Implement the REST API in src/api/'" Enter
tmux split-window -h -t agents
tmux send-keys -t agents "codex -p 'Write unit tests for src/api/'" Enter
tmux split-window -v -t agents
tmux send-keys -t agents "gemini -p 'Generate OpenAPI spec from src/api/'" Enter

tmux attach -t agents
```

**Why:** Each model runs in its own tmux pane with isolated context; workers exit when their task completes.

---

### #09.08 Multi-Perspective Split-Role Review

> **Level:** Advanced | **Impact:** High

**Problem:** A single reviewer has blind spots -- security experts miss UX issues, and vice versa.

**Do this:**
```
Launch three review subagents with different perspectives:

1. Factual Reviewer: verify all claims, check for hallucinated APIs, confirm
   function signatures match actual code
2. Security Expert: check for injection, auth bypass, data exposure,
   insecure defaults
3. Consistency Reviewer: check naming conventions, error handling patterns,
   and style consistency with the rest of the codebase

Synthesize all three reviews into a single action list.
```

**Why:** Multi-role review catches issues across all dimensions that single-perspective review is blind to.

---

### #09.09 Proactive Agent Invocation

> **Level:** Expert | **Impact:** High

**Problem:** Users forget to request planning, review, or testing -- critical steps get skipped.

**Do this:**
```markdown
<!-- In CLAUDE.md -->
## Auto-Trigger Rules
- Complex request (3+ files affected) -> invoke planner agent first
- Code written or modified -> invoke reviewer agent before responding
- Bug fix requested -> invoke TDD agent (write failing test first)
- New dependency added -> invoke security audit agent
```

**Why:** Proactive invocation ensures critical quality gates fire automatically instead of relying on the user to remember.

---

### #09.10 Background Agents and Commands

> **Level:** Expert | **Impact:** Medium

**Problem:** Long-running agents block the main conversation, leaving you idle.

**Do this:**
```jsonc
// In a hook or agent config, use background execution:
{
  "run_in_background": true
}
```
```bash
# Background bash for long tasks
claude -p "Run the full test suite and report failures" &

# Continue working in main session while background agents run
# You'll be notified when they complete
```

**Why:** Background execution lets you keep working in the main conversation while agents handle long-running tasks in parallel.

---

---

[< 08 Testing & Verification](08-testing-and-verification.md) | [Home](../README.md) | [10 Hooks & Automation >](10-hooks-and-automation.md)
