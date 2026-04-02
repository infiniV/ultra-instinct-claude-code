[Home](../README.md) > 15 Advanced Patterns

# 15 Advanced Patterns

### #15.01 Docker Sandbox with No Egress

> **Level:** Beginner | **Impact:** High

**Problem:** Running Claude Code on untrusted repos risks data exfiltration or malicious network calls.

**Do this:**
```yaml
# docker-compose.yml
services:
  claude-sandbox:
    image: node:20-slim
    volumes:
      - ./untrusted-repo:/workspace:rw
    networks:
      - agent-internal
    working_dir: /workspace
    command: npx @anthropic-ai/claude-code --dangerously-skip-permissions

networks:
  agent-internal:
    internal: true  # blocks ALL outbound internet access
```
```bash
docker compose up claude-sandbox
```

**Why:** `internal: true` on the network blocks all outbound traffic, so even compromised code cannot phone home.

---

### #15.02 Sequential Pipeline with claude -p

> **Level:** Beginner | **Impact:** High

**Problem:** You need multi-step automation but each step should get a fresh context to avoid confusion.

**Do this:**
```bash
#!/bin/bash
set -e  # Stop on first failure

# Step 1: Analyze
claude -p "Analyze src/api/ and list all endpoints missing input validation" > analysis.txt

# Step 2: Fix
claude -p "Fix these validation gaps: $(cat analysis.txt)"

# Step 3: Test
claude -p "Write tests for all endpoints that were just updated"

# Step 4: Verify
claude -p "Run the test suite and report results"
```

**Why:** Each `claude -p` call gets fresh context, preventing cross-contamination between pipeline stages.

---

### #15.03 SHARED_TASK_NOTES.md for Cross-Iteration Context

> **Level:** Intermediate | **Impact:** High

**Problem:** Each `claude -p` call starts fresh with no memory of what previous calls discovered or decided.

**Do this:**
```markdown
<!-- SHARED_TASK_NOTES.md (persists across claude -p calls) -->
## Task: Add OAuth2 to API
## Status: Step 2 of 4

### Decisions
- Using passport.js for OAuth2 (chosen in step 1)
- Token storage in Redis, not JWT (chosen in step 1)

### Completed
- [x] Endpoint analysis (step 1)

### Blockers
- Redis connection config not found -- check with team

### Next
- Implement passport.js middleware
```
```bash
# In your pipeline prompt:
claude -p "Read SHARED_TASK_NOTES.md for context. Implement step 2. Update the notes when done."
```

**Why:** A shared notes file gives each pipeline step access to decisions, blockers, and progress from previous steps.

---

### #15.04 Model Routing in Pipelines

> **Level:** Intermediate | **Impact:** Medium

**Problem:** Using the same model for every pipeline step wastes money on cheap tasks or gets poor results on hard ones.

**Do this:**
```bash
#!/bin/bash
set -e

# Opus for analysis and architectural decisions
claude -p --model claude-opus-4-20250514 \
  "Analyze the codebase and create an implementation plan for adding WebSocket support" \
  > plan.md

# Sonnet for implementation (faster, cheaper)
claude -p --model claude-sonnet-4-20250514 \
  "Implement this plan: $(cat plan.md)"

# Opus for review (catches what Sonnet misses)
claude -p --model claude-opus-4-20250514 \
  "Review the WebSocket implementation for security, error handling, and edge cases"
```

**Why:** Opus excels at analysis and review; Sonnet excels at implementation speed -- routing by task type optimizes both quality and cost.

---

### #15.05 --allowedTools Restrictions Per Step

> **Level:** Intermediate | **Impact:** Medium

**Problem:** An analysis step accidentally modifies files, or a write step wastes time reading irrelevant code.

**Do this:**
```bash
#!/bin/bash
set -e

# Read-only analysis (cannot modify anything)
claude -p --allowedTools "Read,Grep,Glob" \
  "Analyze src/ for dead code and unused exports" > dead-code.txt

# Write-only implementation (scoped to action)
claude -p --allowedTools "Read,Write,Edit,Bash" \
  "Remove this dead code: $(cat dead-code.txt)"

# Verify-only check (no writes)
claude -p --allowedTools "Read,Bash,Grep" \
  "Run the test suite and verify no regressions from dead code removal"
```

**Why:** Restricting tools per step enforces separation of concerns and prevents analysis steps from accidentally mutating code.

---

### #15.06 Completion Signal for Loop Termination

> **Level:** Advanced | **Impact:** Medium

**Problem:** Automated pipelines keep looping after the task is done, wasting money on unnecessary iterations.

**Do this:**
```bash
#!/bin/bash
MAX_ITERATIONS=10
SIGNAL="CONTINUOUS_CLAUDE_PROJECT_COMPLETE"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo "--- Iteration $i ---"
  RESULT=$(claude -p "Read SHARED_TASK_NOTES.md. Work on the next incomplete step. \
    When ALL steps are done, respond with exactly: \
    $SIGNAL $SIGNAL $SIGNAL")

  if echo "$RESULT" | grep -q "$SIGNAL"; then
    echo "Project complete after $i iterations."
    break
  fi
done
```

**Why:** A magic completion phrase (repeated 3x to avoid false positives) lets the agent signal done, preventing wasted iterations.

---

### #15.07 Bacterial Code for the Agent Era

> **Level:** Expert | **Impact:** High

**Problem:** Agents struggle with deep dependency trees, complex imports, and tightly coupled modules.

**Do this:**
```python
# BAD: Agent must understand 12 imports and class hierarchy
from myapp.core.base import BaseProcessor
from myapp.utils.validators import validate_email
from myapp.services.notification import NotificationService
from myapp.config import settings
# ... 8 more imports

class UserProcessor(BaseProcessor):
    def process(self, data):
        # Depends on 5 other modules
        pass

# GOOD: Self-contained, copy-pasteable, zero dependencies
def process_user_signup(email: str, name: str) -> dict:
    """Process a user signup. No external dependencies."""
    import re
    import hashlib
    import json
    from datetime import datetime

    if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
        return {"error": "Invalid email"}

    user_id = hashlib.sha256(f"{email}{datetime.utcnow()}".encode()).hexdigest()[:12]
    return {"user_id": user_id, "email": email, "name": name, "created": datetime.utcnow().isoformat()}
```

**Why:** Self-contained, dependency-free functions are trivially understood, tested, and modified by agents -- the ideal unit of agent-era code.

---

### #15.08 Operational Self-Improvement Across Sessions

> **Level:** Advanced | **Impact:** High

**Problem:** Each Claude session starts from scratch with no memory of what worked or failed in previous sessions.

**Do this:**
```bash
# Pattern: auto-extract learnings at session end
# gstack logs to ~/.gstack/projects/{slug}/learnings.jsonl
# GSD tracks in .planning/debug/knowledge-base.md

# Simpler version for any project:
"Before we end, write what you learned about this codebase to
.claude/learnings.md -- include gotchas, patterns that worked,
and approaches that failed. Next session will read this file."

# Good learnings pass the test:
# "Would knowing this save 5+ minutes in a future session?"
```

**Why:** Learnings compound across sessions -- each session's discoveries make future sessions faster and more accurate.

---

### #15.09 The Sprint Workflow

> **Level:** Advanced | **Impact:** High

**Problem:** Ad-hoc development skips critical review stages that catch problems early.

**Do this:**
```
# Structured sprint:
# think → plan → build → review → test → ship → reflect

# Each step feeds the next:
# /office-hours writes a design doc
# /plan reads the design doc and creates tasks
# /build implements with test gates
# /review checks for bugs and style
# /qa runs comprehensive verification
# /ship creates PR and updates docs
# /reflect logs learnings for next time

# Without process, 10 agents = 10 sources of chaos
# With process, each agent knows what to do and when to stop
```

**Why:** Structured review stages with specialized personas catch category errors that a single generalist session misses.

---

---

[< 14 Security & Permissions](14-security.md) | [Home](../README.md)
