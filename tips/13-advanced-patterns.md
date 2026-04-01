# 13 Advanced Patterns

### #13.01 Docker Sandbox with No Egress

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

### #13.02 Sequential Pipeline with claude -p

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

### #13.03 SHARED_TASK_NOTES.md for Cross-Iteration Context

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

### #13.04 Model Routing in Pipelines

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

### #13.05 --allowedTools Restrictions Per Step

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

### #13.06 Completion Signal for Loop Termination

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

### #13.07 Scan for Hidden Unicode Prompt Injection

> **Level:** Advanced | **Impact:** High

**Problem:** Malicious skills or hooks can contain invisible zero-width Unicode characters that inject hidden prompts.

**Do this:**
```bash
# Scan for zero-width characters in skills, hooks, and configs:
rg -nP '[\x{200B}\x{200C}\x{200D}\x{2060}\x{FEFF}]' \
  skills/ hooks/ .claude/ CLAUDE.md

# What to look for:
# U+200B  Zero Width Space
# U+200C  Zero Width Non-Joiner
# U+200D  Zero Width Joiner
# U+2060  Word Joiner
# U+FEFF  Zero Width No-Break Space (BOM)

# Automate as a pre-session hook:
#!/usr/bin/env bash
# hooks/scan-injection.sh (SessionStart)
HITS=$(rg -cP '[\x{200B}\x{200C}\x{200D}\x{2060}\x{FEFF}]' skills/ hooks/ 2>/dev/null || true)
if [ -n "$HITS" ]; then
  echo "WARNING: Hidden Unicode characters found:" >&2
  echo "$HITS" >&2
fi
exit 0
```

**Why:** Zero-width characters are invisible in editors but processed by the model -- treat skills and hooks as supply chain artifacts.

---

### #13.08 Permission Deny Rules for Sensitive Paths

> **Level:** Advanced | **Impact:** High

**Problem:** Claude can read SSH keys, AWS credentials, and .env files unless explicitly blocked.

**Do this:**
```jsonc
// ~/.claude/settings.json
{
  "permissions": {
    "deny": [
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)",
      "Read(~/.gnupg/**)",
      "Read(**/.env*)",
      "Read(**/*credentials*)",
      "Read(**/*secret*)",
      "Bash(curl * | bash)",
      "Bash(wget * | bash)"
    ]
  }
}
```

**Why:** Deny rules prevent accidental exposure of secrets even if a prompt injection tricks Claude into trying to read them.

---

### #13.09 Kill Process Groups, Not Parents

> **Level:** Expert | **Impact:** Medium

**Problem:** Killing a parent process leaves child processes orphaned, consuming resources or holding ports.

**Do this:**
```javascript
// Kill entire process group, not just the parent
const { spawn } = require('child_process');

const child = spawn('npm', ['run', 'dev'], {
  detached: true  // creates new process group
});

// Kill the entire group (negative PID):
function cleanup() {
  try {
    process.kill(-child.pid, 'SIGKILL');  // note the negative PID
  } catch (e) {
    // process already dead
  }
}

// Dead-man switch: if parent stops sending heartbeats, child dies
const HEARTBEAT_INTERVAL = 30000; // 30 seconds
setInterval(() => {
  try {
    child.stdin.write('heartbeat\n');
  } catch (e) {
    cleanup();
  }
}, HEARTBEAT_INTERVAL);
```

**Why:** Negative PID kills the entire process group, preventing orphaned processes that silently consume resources.

---

### #13.10 Bacterial Code for the Agent Era

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
