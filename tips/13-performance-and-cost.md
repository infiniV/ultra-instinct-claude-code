[Home](../README.md) > 13 Performance & Cost

# 13 Performance & Cost

### #13.01 Sonnet Default, Opus for Planning

> **Level:** Beginner | **Impact:** High

**Problem:** Using one model for everything either overspends on Opus or gets weak plans from Sonnet.

**Do this:**
```bash
# Daily workflow:
/model claude-sonnet-4-20250514     # Default for implementation
/model claude-opus-4-20250514       # Switch for planning/architecture

# Or set in CLAUDE.md:
# Use Sonnet for code generation. Switch to Opus only for
# architecture decisions and complex planning.
```

**Why:** Opus produces better plans; Sonnet executes faster and cheaper -- use each where it excels.

---

### #13.02 Haiku Subagents Save 60-80%

> **Level:** Beginner | **Impact:** High

**Problem:** Subagents default to Sonnet, burning expensive tokens on file exploration and simple lookups.

**Do this:**
```jsonc
// ~/.claude/settings.json
{
  "env": {
    "CLAUDE_CODE_SUBAGENT_MODEL": "claude-haiku-3-5-20241022"
  }
}
```

**Why:** Haiku handles file reading, grep, and summarization just fine at a fraction of Sonnet's cost -- 60-80% cheaper subagent runs.

---

### #13.03 Reduce MAX_THINKING_TOKENS

> **Level:** Intermediate | **Impact:** Medium

**Problem:** The default thinking budget (31,999 tokens) burns hidden tokens on internal reasoning you never see.

**Do this:**
```jsonc
// ~/.claude/settings.json
{
  "env": {
    "MAX_THINKING_TOKENS": "10000"
  }
}
```

**Why:** Cutting thinking tokens from 32K to 10K reduces hidden reasoning cost by ~70% with minimal quality impact on routine tasks.

---

### #13.04 Real Session Cost Benchmarks

> **Level:** Intermediate | **Impact:** Medium

**Problem:** You have no mental model for what sessions should cost, so you cannot tell when you are overspending.

**Do this:**
```
# Typical session costs (Sonnet, 2025 pricing):
Simple bug fix:          $0.30 - $0.80
Single feature:          $1.00 - $3.00
Large refactor:          $5.00 - $15.00
Architecture session:    $5.00 - $20.00
Multi-agent team:        $10.00 - $30.00

# Red flags:
# - Bug fix costing > $2 -> context is bloated or prompt is unfocused
# - Feature costing > $5 -> break it into smaller tasks
# - Any session > $20 -> use /compact or start fresh
```

**Why:** Knowing the normal range lets you detect and stop runaway sessions before they drain your budget.

---

### #13.05 The 5 Cost Drivers Ranked

> **Level:** Intermediate | **Impact:** High

**Problem:** You are optimizing the wrong thing -- switching models when the real cost driver is session length.

**Do this:**
```
# Cost drivers in order of impact:
1. Long sessions      -> 1hr = 10-50x the cost of five 12-min sessions
2. Opus usage         -> 1.7x Sonnet's cost per token
3. Parallel subagents -> Each bills independently (3 agents = 3x)
4. Large file reads   -> Reading a 5000-line file = ~6K tokens each time
5. Unfocused tool use -> Grep with no path = scans everything

# Fix the big ones first:
# - /clear and restart every 15-20 minutes
# - Use Sonnet by default, Opus only for planning
# - Scope file reads: read specific line ranges, not whole files
```

**Why:** Session length dominates all other cost factors -- five short sessions are dramatically cheaper than one long one.

---

### #13.06 95% Cache Hit Rate (With Data)

> **Level:** Advanced | **Impact:** High

**Problem:** You are paying full price for tokens that could be served from cache at 90% discount.

**Do this:**
```
# Cache behavior (measured from real sessions):
# Sessions > 30 min: 95-96% cache hit rate
# Cache discount: 90% off input token price

# Maximize cache hits:
1. Keep CLAUDE.md short and stable (never edit mid-session)
2. Don't switch models mid-session (destroys entire cache)
3. Longer sessions = higher cache ratio (but higher total cost)
4. System prompt + CLAUDE.md are always cached after first call

# Check your cache rate:
# Look at session summary -> "cache hit rate" after /compact or session end
```

**Why:** A 95% cache hit rate means you pay ~10% of list price for most input tokens -- protect it.

---

### #13.07 The Three Cache Killers

> **Level:** Advanced | **Impact:** High

**Problem:** Your cache hit rate drops to 0% unexpectedly and costs spike.

**Do this:**
```
# Three things that destroy your prompt cache:

1. Editing CLAUDE.md mid-session
   -> CLAUDE.md is part of the system prompt prefix
   -> Any change invalidates the entire cache
   -> Fix: edit CLAUDE.md between sessions, never during

2. Very long CLAUDE.md files
   -> More content = more tokens that must match exactly
   -> Small edits to surrounding files shift token boundaries
   -> Fix: keep CLAUDE.md under 500 lines

3. Switching models mid-session
   -> Each model has its own cache namespace
   -> /model opus -> /model sonnet = two cold starts
   -> Fix: pick one model per session, switch between sessions
```

**Why:** One careless edit to CLAUDE.md mid-session can double your costs for the rest of that session.

---

### #13.08 $200/mo Max Plan = ~$12K API Equivalent

> **Level:** Advanced | **Impact:** Low

**Problem:** You are unsure if the Max plan is worth it versus using the API directly.

**Do this:**
```
# Max plan math:
# $200/month flat rate
# Same usage on API (with caching): ~$12,000/month
# Breakeven: ~1-2 sessions per day

# Worth it if:
# - 5+ sessions/day (60x value)
# - Heavy Opus usage (API Opus is expensive)
# - Multi-agent workflows (parallel billing adds up fast)

# Not worth it if:
# - < 1 session/day
# - Only simple edits (Cursor/Copilot cheaper for that)
```

**Why:** At 5+ sessions per day, the Max plan delivers roughly 60x the value compared to equivalent API usage.

---

### #13.09 The Burn Hook (Cost Anomaly Detection)

> **Level:** Expert | **Impact:** Medium

**Problem:** A runaway session burns through tokens without warning until you check the bill.

**Do this:**
```bash
#!/usr/bin/env bash
# hooks/burn-detector.sh (PostToolUse hook)
set -euo pipefail

TOKEN_FILE="/tmp/claude-token-count-$$"
COUNT=$(cat "$TOKEN_FILE" 2>/dev/null || echo "0")
COUNT=$((COUNT + 1))
echo "$COUNT" > "$TOKEN_FILE"

# Warn at 3x normal session tool calls (~300 for a typical session)
THRESHOLD=900
if [ "$COUNT" -eq "$THRESHOLD" ]; then
  echo "WARNING: $COUNT tool calls this session (3x normal). Consider /compact or /clear." >&2
fi
exit 0
```

**Why:** Early warning at 3x normal usage lets you course-correct before a session costs 10x what it should.

---

### #13.10 90% Token Reduction via Bash Wrappers

> **Level:** Expert | **Impact:** High

**Problem:** MCP tool schemas loaded into the system prompt consume thousands of tokens even when unused.

**Do this:**
```bash
# Instead of loading MCP tools as native tool schemas:
# Run them through bash, so schemas aren't in the system prompt

# Before (MCP tool schema always in context):
# "Use the github_search MCP tool to find issues"

# After (bash wrapper, no schema overhead):
claude -p "Run this command: gh search issues 'bug label:critical' --repo myorg/myrepo"

# Or create a bash wrapper:
#!/usr/bin/env bash
# tools/gh-search.sh
gh search issues "$1" --repo "$2" --json title,url,state
```

**Why:** Running tools through bash instead of MCP eliminates schema tokens from every request -- up to 90% reduction for tool-heavy setups.

---

### #13.11 Context Budget Audit

> **Level:** Expert | **Impact:** Medium

**Problem:** You do not know what is eating your context window -- agent descriptions, tools, and CLAUDE.md all compete for space.

**Do this:**
```bash
# Token estimation rules:
# Prose: word_count * 1.3
# Code: char_count / 4
# JSON/schemas: char_count / 3.5 (more tokens per char)

# Audit your context budget:
wc -w CLAUDE.md                        # Words in CLAUDE.md
wc -c .claude/settings.json            # Chars in settings
ls skills/*.md | wc -l                 # Number of skills loaded

# Common budget hogs:
# - CLAUDE.md over 500 lines: 2-4K tokens
# - 10 MCP servers: 5-15K tokens in tool schemas
# - 20 agent descriptions: 3-8K tokens
# - Conversation history after 30min: 50-100K tokens
```

**Why:** You cannot optimize what you cannot measure -- auditing reveals which components are worth their token cost.

---

### #13.12 Microcompact vs Full Compact

> **Level:** Expert | **Impact:** Medium

**Problem:** Full `/compact` loses too much context, but your session is getting expensive without any compaction.

**Do this:**
```
# Two compaction strategies:

# 1. Microcompact (less aggressive)
# Clears old tool call results but keeps conversation flow
# Use when: session is getting long but you still need the context
# How: happens automatically as context fills up

# 2. Full /compact (aggressive)
# Summarizes entire conversation into a compact representation
# Use when: starting a new phase of work in the same session
/compact

# Strategy:
# - Use microcompact to extend sessions past 30 min
# - Use /compact when shifting to a different task
# - Use /clear when starting something completely unrelated
```

**Why:** Microcompact extends session life without destroying context, while full compact is better for phase transitions.

---

### #13.13 CLAUDE.md Lives in the Uncached Zone

> **Level:** Advanced | **Impact:** Medium

**Problem:** You think editing CLAUDE.md breaks the entire prompt cache.

**Do this:**
```
# Claude Code's prompt has two zones:
#
# STATIC (cached across turns -- free after first turn):
#   System instructions, tool definitions, built-in rules
#
# DYNAMIC (recalculated every turn -- costs tokens):
#   Environment info, git status, CLAUDE.md, settings, skills, MCP
#
# Your CLAUDE.md is in the DYNAMIC zone.
# It's always fresh but adds token cost every turn.
# This is why keeping CLAUDE.md short saves money.
```

**Why:** Cache efficiency depends on keeping the dynamic portion small -- short, stable CLAUDE.md equals better cache hit rates and lower cost.

---

### #13.14 Programmatic Tool Calling (PTC)

> **Level:** Expert | **Impact:** High

**Problem:** Each tool call requires a separate inference pass, adding latency and tokens.

**Do this:**
```
# PTC lets Claude write Python that orchestrates multiple tool calls
# in ONE inference pass instead of calling tools one at a time

# Results:
# - ~37% token reduction
# - Only stdout enters context (not full tool call overhead)
# - Faster execution for multi-step operations

# Enabled automatically for supported operations
# Most impactful for: file scanning, bulk edits, data processing
```

**Why:** PTC batches multiple tool calls into a single inference pass -- 37% fewer tokens for multi-step operations.

---

### #13.15 Opus Can Be Cheaper Than Sonnet

> **Level:** Intermediate | **Impact:** Medium

**Problem:** You default to Sonnet to save money, but end up spending more on corrections and re-prompts.

**Do this:**
```
# Counter-intuitive cost math:
# Sonnet: cheaper per token, but needs more steering and correction
# Opus: more expensive per token, but often one-shots the task

# Use Opus when:
# - Task spans 5+ files
# - First attempt with Sonnet failed
# - Security-critical code
# - Architecture decisions

# Use Sonnet when:
# - Simple, well-defined edits
# - Repetitive operations
# - Tasks with clear test verification
```

**Why:** The most capable model often uses fewer total tokens because it needs less correction -- what seems expensive per-token can be cheaper end-to-end.

---

---

[< 12 MCP & Tools](12-mcp-and-tools.md) | [Home](../README.md) | [14 Security & Permissions >](14-security.md)
