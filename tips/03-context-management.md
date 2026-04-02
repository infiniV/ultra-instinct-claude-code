[Home](../README.md) > 03 Context Management

# 03 Context Management

### #03.01 Context Is Milk

> **Level:** Beginner | **Impact:** High

**Problem:** Long conversations accumulate stale context that degrades output quality.

**Do this:**
```bash
# Start a new conversation for each distinct topic
claude                  # fresh session for feature A
# finish feature A
claude                  # fresh session for feature B

# Don't reuse a debugging session for new feature work
```

**Why:** Fresh, condensed context produces better results -- stale context confuses the model and wastes tokens.

---

### #03.02 The 10-30 Minute Sweet Spot

> **Level:** Beginner | **Impact:** High

**Problem:** You do not know when to start a new session vs. keep going.

**Do this:**
```
# Real performance data:
# Active tool rate: flat at 3.4/min across all session lengths
# Wall-time rate: drops 8.8x in sessions over 2 hours
# Sweet spot: 10-30 minutes per session

# Rule of thumb:
# < 10 min  = too short for complex tasks
# 10-30 min = optimal productivity zone
# > 30 min  = consider splitting or compacting
# > 60 min  = definitely start fresh
```

**Why:** Wall-time efficiency drops dramatically in long sessions even though tool usage stays flat -- diminishing returns are real.

---

### #03.03 Know What Survives Compaction

> **Level:** Intermediate | **Impact:** High

**Problem:** After compaction or a new session, you lose track of what Claude still remembers.

**Do this:**
```
# SURVIVES compaction:
# - CLAUDE.md contents
# - Task list / todo items
# - Memory files on disk
# - Git state (commits, branches)
# - Files written to disk

# LOST after compaction:
# - Intermediate reasoning
# - File contents read earlier
# - Conversation nuance and tone
# - Failed approaches and why they failed
# - Variable names discussed but not written

# Save critical context BEFORE compaction:
"Write what we've learned to HANDOFF.md before compacting"
```

**Why:** If it is not on disk or in CLAUDE.md, assume it is gone after compaction -- plan your saves accordingly.

---

### #03.04 Strategic Compaction at Task Boundaries

> **Level:** Intermediate | **Impact:** High

**Problem:** Auto-compaction fires at random points, sometimes mid-implementation, losing critical reasoning.

**Do this:**
```bash
# Disable auto-compact in settings if you want manual control
# Then compact strategically:

/compact Focus on implementing the auth middleware next

# GOOD times to compact:
# - After exploration, before implementation
# - After debugging, before next feature
# - After a failed approach, before trying a new one

# BAD times to compact:
# - Mid-implementation (loses variable context)
# - During debugging (loses hypothesis chain)
# - Right after reading many files (loses file contents)
```

**Why:** Strategic compaction preserves the right context; random compaction loses critical reasoning mid-task.

---

### #03.05 Proactive Handoff Documents

> **Level:** Intermediate | **Impact:** High

**Problem:** Context runs out and the next session starts blind.

**Do this:**
```markdown
# Before context runs low, say:
"Write a HANDOFF.md with what we built, what works, what's broken,
and what to do next."

# HANDOFF.md example:
## What We Built
- Auth middleware in src/middleware/auth.ts
- JWT validation with refresh token rotation

## What Works
- Login flow, token generation, refresh endpoint

## What's Broken
- Logout doesn't invalidate refresh tokens (see TODO in auth.ts:47)

## Next Steps
1. Add token blacklist using Redis
2. Write integration tests for refresh flow
```

**Why:** A handoff document gives the next session (or another developer) full context in seconds.

---

### #03.06 Context-Save Hook on PreCompact

> **Level:** Advanced | **Impact:** Medium

**Problem:** You forget to save context before compaction, and over half of long sessions trigger it automatically.

**Do this:**
```jsonc
// In .claude/settings.json
{
  "hooks": {
    "PreCompact": [{
      "command": "mkdir -p .claude/sessions && date '+%Y-%m-%d_%H%M' | xargs -I{} cp /dev/stdin .claude/sessions/pre-compact-{}.md",
      "blocking": false
    }]
  }
}
```

**Why:** Auto-saving before compaction prevents silent context loss in sessions that run long enough to trigger it.

---

### #03.07 MCP Tools Are the #1 Context Hog

> **Level:** Intermediate | **Impact:** High

**Problem:** MCP tool schemas consume massive context even when you never call them.

**Do this:**
```
# Each MCP tool schema costs ~500 tokens
# 30-tool server = 15,000 tokens eaten on EVERY message

# Budget:
# - Keep under 10 MCP servers
# - Keep under 80 total tools
# - Audit with: count your tools in /stats

# Example: a Supabase MCP with 25 tools costs 12,500 tokens/msg
# even if you only use 2 of those tools
```

**Why:** MCP tools load into every prompt -- 30 unused tools waste more context than your entire CLAUDE.md.

---

### #03.08 Replace MCPs with CLI Skills

> **Level:** Advanced | **Impact:** High

**Problem:** MCP servers load all their tools at startup even when most go unused.

**Do this:**
```markdown
# Instead of an always-loaded GitHub MCP, create a skill:
# .claude/skills/github.md

Use the `gh` CLI for GitHub operations:
- `gh pr create --title "..." --body "..."`
- `gh issue list --state open`
- `gh pr review --approve`

Do not use any GitHub MCP tools.
```

**Why:** CLI skills load only when triggered and cost zero tokens when idle -- same functionality, no context overhead.

---

### #03.09 Tool Search for Large MCP Sets

> **Level:** Advanced | **Impact:** Medium

**Problem:** You need many MCP tools available but they consume over 10% of your context window.

**Do this:**
```bash
# Enable automatic tool search (replaces full schemas with stubs)
ENABLE_TOOL_SEARCH=auto:5 claude

# How it works:
# - Full tool definitions replaced with name-only stubs
# - Claude searches for relevant tools on demand
# - Only matched tools get full schema loaded
# - Triggers automatically when tools exceed 10% of context
```

**Why:** Tool search gives you access to large tool sets without paying the constant context cost of full schemas.

---

### #03.10 Agent Descriptions Eat Context

> **Level:** Advanced | **Impact:** Medium

**Problem:** Verbose agent/skill descriptions load into every Task tool spawn, wasting tokens at scale.

**Do this:**
```markdown
# BAD: 100+ word description
# "This agent handles all database migrations including schema
#  changes, data backfilling, rollback procedures, index
#  management, and coordinates with the deployment pipeline..."

# GOOD: under 30 words
# "Run database migrations and rollbacks using Prisma CLI."

# Math: 100 words x 20 subagent spawns = 2,600 wasted tokens
# Keep descriptions under 30 words.
```

**Why:** Description text loads into every subagent invocation -- verbose descriptions multiply waste across parallel tasks.

---

### #03.11 Trigger-Table Lazy Loading for Skills

> **Level:** Expert | **Impact:** High

**Problem:** All skills load at startup even though most sessions use only 1-2 of them.

**Do this:**
```markdown
# In CLAUDE.md, use a trigger table instead of loading all skills:

## Skills (load on demand)
| Keyword       | Skill                        |
|---------------|------------------------------|
| "deploy"      | .claude/skills/deploy.md     |
| "database"    | .claude/skills/database.md   |
| "test"        | .claude/skills/testing.md    |
| "api"         | .claude/skills/api-design.md |

When a user message matches a keyword above, read the
corresponding skill file before responding.
```

**Why:** Lazy loading cuts baseline context by 50%+ since skills only load when their keywords appear in the conversation.

---

### #03.12 Plan Acceptance Clears Context By Design

> **Level:** Expert | **Impact:** Medium

**Problem:** You accept a plan and notice the conversation seems to "reset" -- it feels like something broke.

**Do this:**
```
# This is intentional behavior:
# 1. Claude proposes a plan
# 2. You accept it
# 3. Context is auto-cleared
# 4. The plan persists, but messy discussion is gone

# Use this to your advantage:
# - Have a long, messy exploration session
# - Ask Claude to write a plan summarizing the approach
# - Accept the plan to get a clean context with just the plan
# - Implementation starts fresh with clear instructions
```

**Why:** Plan acceptance is a designed context-cleaning mechanism -- the plan survives but exploratory noise gets removed.

---

---

[< 02 CLAUDE.md Mastery](02-claude-md.md) | [Home](../README.md) | [04 Commands & Shortcuts >](04-commands-and-shortcuts.md)
