[Home](../README.md) > 01 Setup

# 01 Setup

### #01.01 Install Claude Code

> **Level:** Beginner | **Impact:** High

**Problem:** Nothing works until the CLI is installed and on your PATH.

**Do this:**
```bash
# Option A: npm
npm install -g @anthropic-ai/claude-code

# Option B: curl
curl -fsSL https://claude.ai/install.sh | sh

# Verify
claude --version
```

**Why:** Always confirm the install before investing time in configuration.

---

### #01.02 Choose Your Model

> **Level:** Beginner | **Impact:** High

**Problem:** One model for everything either burns money or produces weak plans.

**Do this:**
```bash
# Use Opus for planning and architecture
claude --model opus

# Use Sonnet for execution and repetitive edits
claude --model sonnet
```

**Why:** Opus reasons better; Sonnet executes faster and cheaper -- use both strategically.

---

### #01.03 First Settings Configuration

> **Level:** Beginner | **Impact:** Medium

**Problem:** Settings live across five levels and knowing which file controls what saves debugging time.

**Do this:**
```
# 5-level hierarchy (highest to lowest priority):
# 1. Enterprise policy     (managed)
# 2. Global user settings  ~/.claude/settings.json
# 3. Project shared        .claude/settings.json       (commit this)
# 4. Project local         .claude/settings.local.json  (gitignore this)
# 5. Defaults

# Create your global settings
mkdir -p ~/.claude
cat > ~/.claude/settings.json << 'EOF'
{
  "permissions": {
    "allow": ["Bash(git *)"],
    "deny": []
  }
}
EOF
```

**Why:** Understanding the hierarchy prevents personal preferences from leaking into shared config or silently getting overridden.

---

### #01.04 Set Up Terminal Aliases

> **Level:** Beginner | **Impact:** Medium

**Problem:** Typing `claude` dozens of times a day adds up fast.

**Do this:**
```bash
# Add to ~/.bashrc or ~/.zshrc
alias c='claude'
alias ch='claude --chrome'

# Quick session management
# c -c  = continue last session
# c -r  = resume with session picker
```

**Why:** Shaving keystrokes compounds -- aliases turn Claude Code into muscle memory.

---

### #01.05 Enable Sandbox Mode

> **Level:** Intermediate | **Impact:** High

**Problem:** Running Claude Code with full filesystem and network access feels risky, but Docker is overkill for most cases.

**Do this:**
```jsonc
// In .claude/settings.json
{
  "sandbox": {
    "enabled": true,
    "network": {
      "allowedDomains": ["api.github.com", "registry.npmjs.org"]
    },
    "filesystem": {
      "denyRead": ["~/.ssh/**", "~/.aws/**"],
      "allowWrite": ["./**"]
    }
  }
}
```

**Why:** Built-in sandboxing restricts file and network access without Docker -- reduces permission prompts while maintaining safety.

---

### #01.06 Disable Attribution

> **Level:** Intermediate | **Impact:** Low

**Problem:** Claude Code appends "Co-Authored-By" and footer text to commits and PRs by default.

**Do this:**
```jsonc
// In ~/.claude/settings.json or .claude/settings.json
{
  "attribution": {
    "commit": "",
    "pr": ""
  }
}
```

**Why:** Keeps your git history clean when your team does not want AI attribution in every commit.

---

### #01.07 Set Up Voice Input

> **Level:** Intermediate | **Impact:** High

**Problem:** Typing long prompts is slow -- speaking is roughly 3x faster.

**Do this:**
```bash
# Built-in: use the /voice slash command inside Claude Code
/voice

# Or for always-on local transcription, pair with a local Whisper server
# and pipe transcripts into claude -p
whisper-stream | claude -p
```

**Why:** Voice input dramatically speeds up prompt entry, especially for exploratory or conversational tasks.

---

### #01.08 Quick Health Check

> **Level:** Beginner | **Impact:** Low

**Problem:** You need to verify your install, check rate limits, and see session activity at a glance.

**Do this:**
```
/doctor    # Diagnose installation issues
/stats     # Show activity graph for current session
/usage     # Check rate limits and token consumption
```

**Why:** These three commands confirm everything is working and surface quota issues before they block you.

---

### #01.09 Bootstrap with /init

> **Level:** Beginner | **Impact:** High

**Problem:** You manually create CLAUDE.md from scratch and miss important conventions.

**Do this:**
```
# Run in any project:
/init

# It does 8 phases:
# 1. Ask what to set up (CLAUDE.md, skills, hooks)
# 2. Explore codebase (reads manifests, CI, formatters, existing configs)
# 3. Interview you to fill gaps
# 4. Write CLAUDE.md (respects character limits)
# 5. Write CLAUDE.local.md (gitignored, personal)
# 6. Create skills
# 7. Suggest optimizations (gh CLI, linting hooks)
# 8. Summary and next steps

# It even detects and imports from:
# .cursor/rules, .cursorrules, .github/copilot-instructions.md,
# .windsurfrules, .clinerules, AGENTS.md
```

**Why:** `/init` creates well-structured, minimal files that respect the character limits -- better than hand-writing CLAUDE.md.

---

### #01.10 Custom Agent Definitions

> **Level:** Intermediate | **Impact:** High

**Problem:** You want specialized agents (reviewers, architects, explorers) but only have generic subagents.

**Do this:**
```markdown
# Create .claude/agents/reviewer.md
---
name: reviewer
description: Review code changes for bugs and security issues
model: sonnet
tools: Read, Grep, Glob
---

Review the current git diff for bugs, security issues, and 
style violations. Be adversarial. Report only high-confidence findings.
```
```bash
# Launch it:
claude --agent=reviewer
# Or reference in conversation: @reviewer
```

**Why:** Custom agents with scoped tools and models let you build a team of specialists instead of one generalist.

---

### #01.11 Headless Fast Mode with --bare

> **Level:** Advanced | **Impact:** Medium

**Problem:** Scripts and CI pipelines waste time loading hooks, skills, MCPs, and CLAUDE.md on every `claude -p` call.

**Do this:**
```bash
# Skip all loading for raw API speed
ANTHROPIC_API_KEY=sk-ant-xxx claude --bare -p "explain this function" < code.py

# ~14% faster to first API request
# Skips: hooks, LSP, plugin sync, skill walks, CLAUDE.md, auto-memory
```

**Why:** In automation pipelines where you control the prompt completely, `--bare` eliminates startup overhead.

---

---

[Home](../README.md) | [02 CLAUDE.md Mastery >](02-claude-md.md)
