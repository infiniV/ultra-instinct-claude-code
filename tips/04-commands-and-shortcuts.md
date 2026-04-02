[Home](../README.md) > 04 Commands & Shortcuts

# 04 Commands & Shortcuts

### #04.01 Essential Slash Commands

> **Level:** Beginner | **Impact:** High

**Problem:** You keep using workarounds for things slash commands handle natively.

**Do this:**
```
/usage     # Check rate limits and token consumption
/stats     # Activity graph for current session
/clear     # Reset conversation (fresh context)
/compact   # Compress context with optional focus message
/copy      # Copy last response to clipboard
/config    # Open settings configuration
```

**Why:** These six commands cover 90% of session management -- memorize them first.

---

### #04.02 /copy for Clean Output

> **Level:** Beginner | **Impact:** Medium

**Problem:** Copying from the terminal mangles formatting, includes line numbers, and breaks code blocks.

**Do this:**
```
# After Claude responds with code or text you want:
/copy

# Copies the last response as clean markdown to your clipboard
# No line numbers, no terminal artifacts, proper formatting
```

**Why:** /copy gives you clean markdown that pastes correctly into docs, PRs, and messages.

---

### #04.03 /chrome for Browser Integration

> **Level:** Beginner | **Impact:** Medium

**Problem:** You need Claude to interact with web apps for testing, debugging, or form automation.

**Do this:**
```bash
# Toggle browser integration
/chrome

# Or launch with it enabled
claude --chrome

# Claude can now:
# - Navigate to URLs
# - Click buttons and fill forms
# - Take and analyze screenshots
# - Debug web app issues visually
```

**Why:** Browser integration lets Claude test web apps end-to-end without you manually screenshotting.

---

### #04.04 /btw Side-Chain Questions

> **Level:** Intermediate | **Impact:** Medium

**Problem:** You want to ask a quick question while Claude is working without polluting the main context.

**Do this:**
```
# While Claude is working on a task:
/btw what does the retry logic in utils/http.ts do?

# This creates a single-turn side chain:
# - Doesn't enter conversation history
# - Doesn't interrupt current task
# - Reuses prompt cache (cheap)
# - Answer appears inline, then Claude continues
```

**Why:** Side-chain questions let you learn about the codebase mid-task without derailing Claude's focus.

---

### #04.05 /simplify Post-PR Quality Check

> **Level:** Intermediate | **Impact:** High

**Problem:** PRs ship with redundant code, missed abstractions, and inconsistent patterns.

**Do this:**
```
# After completing a feature, before merging:
/simplify

# Spawns 3 parallel review agents checking for:
# - Code reuse opportunities
# - Quality issues
# - Efficiency improvements

# Focus on specific areas:
/simplify focus on error handling
/simplify focus on the new API endpoints
```

**Why:** Three parallel reviewers catch issues a single pass misses -- run this before every significant PR.

---

### #04.06 /batch for Parallel Migrations

> **Level:** Advanced | **Impact:** High

**Problem:** Large-scale migrations (framework, API, style) are tedious file-by-file.

**Do this:**
```
# Plan interactively, then execute in parallel:
/batch migrate src/ from Solid to React

# What happens:
# 1. Claude plans the migration strategy
# 2. Creates isolated git worktrees
# 3. Spawns dozens of parallel agents
# 4. Each agent handles a subset of files
# 5. Results are merged back

# Other examples:
/batch convert all class components to hooks
/batch add error boundaries to every route
```

**Why:** Parallel execution in worktrees turns hour-long migrations into minutes with isolated, mergeable changes.

---

### #04.07 /voice Push-to-Talk

> **Level:** Intermediate | **Impact:** Medium

**Problem:** Typing long, nuanced prompts is slow and breaks your flow.

**Do this:**
```
# Start voice mode:
/voice

# Usage:
# - Hold Space to record
# - Release to send transcription
# - Mix typing and voice freely
# - 20 language support
# - Transcription is free (no extra cost)
```

**Why:** Voice input is 3x faster than typing for exploratory prompts and lets you think out loud naturally.

---

### #04.08 Resume and Continue Sessions

> **Level:** Intermediate | **Impact:** Medium

**Problem:** You closed the terminal and need to pick up where you left off.

**Do this:**
```bash
# Continue the most recent session
claude -c

# Browse and pick a session interactively
claude -r

# Resume a specific session by ID with a new query
claude --resume abc123 "now add the unit tests"

# Tip: -c is for "I just closed the terminal"
# -r is for "I want to find that session from yesterday"
```

**Why:** Session resume preserves full context so you do not waste tokens re-explaining what you were doing.

---

### #04.09 Headless Piping Mode

> **Level:** Advanced | **Impact:** High

**Problem:** You want to use Claude Code in scripts, CI pipelines, or chained with other tools.

**Do this:**
```bash
# Single prompt, output to stdout
claude -p "explain this error" < error.log

# Pipe input
cat logs.txt | claude -p "summarize the failures"

# Machine-readable JSON output
claude -p "list all TODO comments" --output-format json

# Limit turns for focused queries
claude -p "what does main.go do?" --max-turns 3

# Chain with other tools
git diff HEAD~5 | claude -p "write release notes" | wl-copy
```

**Why:** Piping mode turns Claude into a composable Unix tool that fits into any automation pipeline.

---

### #04.10 Keyboard Navigation

> **Level:** Beginner | **Impact:** Medium

**Problem:** You rely on mouse and slash commands when keyboard shortcuts would be faster.

**Do this:**
```
# Essential shortcuts:
Ctrl+C        # Cancel current operation
Esc            # Stop generation
Shift+Tab      # Toggle plan mode
Esc Esc        # Rewind to last checkpoint
Tab            # Autocomplete file paths and commands
Ctrl+A         # Select all input text
```

**Why:** Keyboard shortcuts eliminate the round-trip of typing commands and keep you in flow state.

---

### #04.11 /branch to Fork Conversations

> **Level:** Intermediate | **Impact:** High

**Problem:** You want to explore an alternate approach without losing your current progress.

**Do this:**
```
# Fork the current conversation:
/branch

# Or from CLI:
claude --resume <session-id> --fork-session

# The fork gets a full copy of your conversation context
# Try a risky approach in the fork, keep the safe version in main
```

**Why:** Conversation forking lets you experiment freely -- if the fork fails, your original session is untouched.

---

### #04.12 /teleport and /remote-control

> **Level:** Intermediate | **Impact:** Medium

**Problem:** You started a session on your laptop but need to continue it from your phone or another device.

**Do this:**
```bash
# Move a cloud session to your local terminal:
claude --teleport

# Control a local session from your phone/browser:
/remote-control

# Enable for all sessions in /config:
# "Remote Control for all sessions" → enabled
```

**Why:** Session mobility means you are never stuck on one device -- start on desktop, continue on phone, finish on laptop.

---

### #04.13 Ctrl+B, Ctrl+G, Ctrl+S Power Keys

> **Level:** Intermediate | **Impact:** Medium

**Problem:** You are missing three keyboard shortcuts that dramatically improve your workflow.

**Do this:**
```
Ctrl+B    # Background a running command (keep working while it runs)
Ctrl+G    # Open prompt in external editor (for long/complex prompts)
Ctrl+S    # Stash current prompt input (save it, type something else, restore later)

# Set your preferred editor:
export EDITOR=vim  # or code, nano, etc.
```

**Why:** These three shortcuts eliminate the most common workflow interruptions -- waiting, typing limits, and lost input.

---

### #04.14 /rename for Multi-Instance Clarity

> **Level:** Beginner | **Impact:** Medium

**Problem:** You have 4 Claude sessions open and cannot tell which is which.

**Do this:**
```
# Name your sessions:
/rename auth-feature
/rename api-refactor
/rename bug-fix-123

# Without arguments, auto-generates a name from context:
/rename

# Also updates your terminal tab title
```

**Why:** Named sessions prevent the "which window is this?" confusion when running parallel Claude instances.

---

---

[< 03 Context Management](03-context-management.md) | [Home](../README.md) | [05 Git & GitHub >](05-git-and-github.md)
