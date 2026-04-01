# 10 Hooks & Automation

### #10.01 Hook Basics

> **Level:** Beginner | **Impact:** High

**Problem:** You need to run custom logic before/after Claude's tool calls but do not know the hook lifecycle.

**Do this:**
```jsonc
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [{ "command": "./hooks/pre.sh" }],   // Before tool runs
    "PostToolUse": [{ "command": "./hooks/post.sh" }],  // After tool runs
    "Stop": [{ "command": "./hooks/stop.sh" }],         // End of response
    "SessionStart": [{ "command": "./hooks/init.sh" }], // Session begins
    "SessionEnd": [{ "command": "./hooks/cleanup.sh" }] // Session ends
  }
}
// Exit codes: 0 = continue, 2 = block the tool call
```

**Why:** Hooks are the extension point for guardrails, automation, and analytics -- every advanced workflow builds on them.

---

### #10.02 Safety Guard Hook

> **Level:** Beginner | **Impact:** High

**Problem:** Claude occasionally runs destructive commands like `rm -rf /`, `git push --force main`, or `DROP TABLE`.

**Do this:**
```bash
#!/usr/bin/env bash
# hooks/block-destructive.sh (PreToolUse on Bash)
set -euo pipefail

INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

[ "$TOOL" != "Bash" ] && exit 0

BLOCKED_PATTERNS="rm -rf|git push --force main|DROP TABLE|chmod 777|mkfs\.|:(){ :|:& };"

if echo "$CMD" | grep -qEi "$BLOCKED_PATTERNS"; then
  echo "BLOCKED: destructive command detected: $CMD" >&2
  exit 2
fi
exit 0
```

**Why:** Exit code 2 blocks the tool call before it executes, preventing catastrophic mistakes.

---

### #10.03 Block --no-verify

> **Level:** Intermediate | **Impact:** High

**Problem:** Claude sometimes adds `--no-verify` to git commits to skip pre-commit hooks.

**Do this:**
```bash
#!/usr/bin/env bash
# hooks/block-no-verify.sh (PreToolUse on Bash)
set -euo pipefail

INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

[ "$TOOL" != "Bash" ] && exit 0

if echo "$CMD" | grep -q '\-\-no-verify'; then
  echo "BLOCKED: --no-verify is not allowed. Fix the hook issue instead." >&2
  exit 2
fi
exit 0
```

**Why:** Pre-commit hooks exist for a reason; skipping them hides lint errors, type failures, and security checks.

---

### #10.04 Config Protection Hook

> **Level:** Intermediate | **Impact:** Medium

**Problem:** Claude weakens linter/formatter configs instead of fixing the actual code violations.

**Do this:**
```bash
#!/usr/bin/env bash
# hooks/protect-configs.sh (PreToolUse on Write and Edit)
set -euo pipefail

INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

PROTECTED=".eslintrc|.prettierrc|tsconfig.json|biome.json|.stylelintrc"

if [[ "$TOOL" == "Write" || "$TOOL" == "Edit" ]]; then
  if echo "$FILE" | grep -qE "$PROTECTED"; then
    echo "BLOCKED: $FILE is protected. Fix the code, not the config." >&2
    exit 2
  fi
fi
exit 0
```

**Why:** Forces the agent to fix code violations rather than taking the easy path of loosening rules.

---

### #10.05 Commit Nudge After 8+ Edits

> **Level:** Intermediate | **Impact:** Medium

**Problem:** Claude makes 20+ edits without committing, creating giant changesets that are hard to revert.

**Do this:**
```bash
#!/usr/bin/env bash
# hooks/commit-nudge.sh (PostToolUse on Edit and Write)
set -euo pipefail

COUNTER_FILE="/tmp/claude-edit-counter-$$"
COUNT=$(cat "$COUNTER_FILE" 2>/dev/null || echo "0")
COUNT=$((COUNT + 1))
echo "$COUNT" > "$COUNTER_FILE"

if [ "$COUNT" -ge 8 ]; then
  echo "Reminder: $COUNT edits without a commit. Consider committing now." >&2
  echo "0" > "$COUNTER_FILE"
fi
exit 0
```

**Why:** Small, frequent commits make it easy to revert bad changes instead of losing an entire session's work.

---

### #10.06 Batch Format+Typecheck at Stop

> **Level:** Advanced | **Impact:** High

**Problem:** Running Prettier and tsc after every single edit is too slow and wastes cycles.

**Do this:**
```bash
#!/usr/bin/env bash
# hooks/batch-check.sh (Stop hook)
set -euo pipefail

EDITED_FILE="/tmp/claude-edited-files-$$"
[ ! -f "$EDITED_FILE" ] && exit 0

FILES=$(sort -u "$EDITED_FILE")
[ -z "$FILES" ] && exit 0

echo "Running formatter on edited files..."
echo "$FILES" | xargs npx prettier --write 2>/dev/null || true

echo "Running typecheck..."
npx tsc --noEmit 2>&1 | head -20 || true

rm -f "$EDITED_FILE"
exit 0
```
```bash
#!/usr/bin/env bash
# hooks/track-edits.sh (PostToolUse on Edit/Write - accumulates files)
set -euo pipefail
INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -n "$FILE" ] && echo "$FILE" >> "/tmp/claude-edited-files-$$"
exit 0
```

**Why:** Batching format and typecheck to the Stop hook runs them once per response instead of per-edit, saving significant time.

---

### #10.07 Desktop Notification on Stop

> **Level:** Advanced | **Impact:** Medium

**Problem:** You switch to another task while Claude works but miss when it finishes.

**Do this:**
```bash
#!/usr/bin/env bash
# hooks/notify-done.sh (Stop hook)
set -euo pipefail

# Linux (Wayland/X11)
notify-send "Claude Code" "Response complete" --urgency=normal 2>/dev/null || true

# macOS alternative:
# osascript -e 'display notification "Response complete" with title "Claude Code"'

# Optional: play a sound
# paplay /usr/share/sounds/freedesktop/stereo/complete.oga 2>/dev/null || true

exit 0
```

**Why:** Desktop notifications let you context-switch freely and return exactly when Claude is ready for input.

---

### #10.08 Panopticon: Full Tool Call Logging

> **Level:** Advanced | **Impact:** Medium

**Problem:** You have no visibility into what Claude is doing across sessions -- no patterns, no analytics.

**Do this:**
```bash
#!/usr/bin/env bash
# hooks/panopticon.sh (PreToolUse on all tools)
set -euo pipefail

DB="${HOME}/.claude/tool-log.db"
INPUT=$(cat)

sqlite3 "$DB" "CREATE TABLE IF NOT EXISTS calls (
  ts TEXT DEFAULT (datetime('now')),
  tool TEXT, input TEXT, session TEXT
);" 2>/dev/null

TOOL=$(echo "$INPUT" | jq -r '.tool_name // "unknown"')
TINPUT=$(echo "$INPUT" | jq -c '.tool_input // {}' | head -c 500)
SESSION="${CLAUDE_SESSION_ID:-unknown}"

sqlite3 "$DB" "INSERT INTO calls (tool, input, session) VALUES ('$TOOL', '$(echo "$TINPUT" | sed "s/'/''/g")', '$SESSION');"
exit 0
```
```sql
-- Query examples:
SELECT tool, COUNT(*) FROM calls GROUP BY tool ORDER BY COUNT(*) DESC;
SELECT tool, input FROM calls WHERE ts > datetime('now', '-1 hour');
```

**Why:** Logging every tool call to SQLite gives you data to find hotspots, error patterns, and optimization opportunities.

---

### #10.09 The 3-Tier Hook Profile System

> **Level:** Expert | **Impact:** High

**Problem:** You need strict guardrails for production work but minimal friction for quick experiments.

**Do this:**
```bash
#!/usr/bin/env bash
# hooks/router.sh (Central wrapper for all hooks)
set -euo pipefail

PROFILE="${ECC_HOOK_PROFILE:-standard}"

case "$PROFILE" in
  minimal)
    # Only block truly destructive commands
    exec ./hooks/block-destructive.sh
    ;;
  standard)
    # Destructive + config protection + commit nudges
    ./hooks/block-destructive.sh && \
    ./hooks/protect-configs.sh && \
    ./hooks/commit-nudge.sh
    ;;
  strict)
    # Everything: guards + logging + format + typecheck
    ./hooks/block-destructive.sh && \
    ./hooks/protect-configs.sh && \
    ./hooks/block-no-verify.sh && \
    ./hooks/panopticon.sh && \
    ./hooks/commit-nudge.sh
    ;;
esac
```
```bash
# Usage:
export ECC_HOOK_PROFILE=minimal   # quick experiment
export ECC_HOOK_PROFILE=strict    # production work
```

**Why:** A single environment variable switches your entire hook stack, matching guardrail intensity to the risk level of the work.

---

### #10.10 Real Hook Fire Frequency Data

> **Level:** Expert | **Impact:** Medium

**Problem:** You write a hook that takes 200ms and do not realize it fires 10,000 times per session.

**Do this:**
```bash
# Real fire counts from production session sets:
# Bash:   10,000+ fires
# Read:    9,000+ fires
# Edit:    5,000+ fires
# Write:   2,000+ fires
# Glob:    3,000+ fires
# Grep:    4,000+ fires

# Performance budget for PreToolUse hooks:
# Target: < 50ms per invocation
# At 10K fires: 50ms * 10,000 = 500 seconds = 8+ minutes added

# Test your hook speed:
time echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | ./hooks/your-hook.sh
```

**Why:** PreToolUse hooks fire on every tool call -- a slow hook silently adds minutes to every session.

---
