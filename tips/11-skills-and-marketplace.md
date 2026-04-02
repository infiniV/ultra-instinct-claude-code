[Home](../README.md) > 11 Skills & Marketplace

# 11 Skills & Marketplace

### #11.01 Skills Are the Canonical Workflow Surface

> **Level:** Beginner | **Impact:** High

**Problem:** You are building workflows as custom slash commands but they are brittle and hard to compose.

**Do this:**
```markdown
<!-- .claude/skills/review.md -->
---
name: code-review
description: Review code changes for bugs, security, and style.
  Invoke when user says "review this" or before creating a PR.
---

## Steps
1. Read all changed files via `git diff`
2. Check for: bugs, security issues, style violations, missing tests
3. Output actionable feedback grouped by severity

## Anti-Patterns
- Do NOT weaken linter configs to pass review
- Do NOT skip files that look "fine"
```

**Why:** Skills with YAML frontmatter auto-trigger on context, compose with other skills, and are more durable than raw command scripts.

---

### #11.02 The Description Field Is for the Model

> **Level:** Beginner | **Impact:** High

**Problem:** Your skills never fire because Claude does not know when to invoke them.

**Do this:**
```yaml
# BAD: vague description
description: Helps with testing stuff

# GOOD: trigger-condition description  
description: >
  Guide test-driven development. Invoke when implementing new features,
  fixing bugs, or when the user says "write tests first" or "TDD".

# The description is what Claude reads to decide invocation
# Write it as a trigger condition, not a summary
```

**Why:** Vague descriptions mean skills never fire -- write descriptions as "invoke when X" conditions.

---

### #11.03 The Plugin Marketplace

> **Level:** Beginner | **Impact:** High

**Problem:** You are building everything from scratch when production-ready plugins already exist.

**Do this:**
```bash
# Browse available plugins:
/plugin

# Install from marketplace:
claude plugin marketplace add VoltAgent/awesome-claude-code-subagents
claude plugin install voltagent-lang

# Essential plugins worth installing:
# - code-review     (5 parallel agents, confidence-scored findings)
# - feature-dev     (7-phase guided workflow with clarifying questions)
# - hookify         (create hooks from conversation analysis)
# - commit-commands  (/commit, /commit-push-pr, /clean_gone)

# Validate before publishing your own:
claude plugin validate
```

**Why:** The plugin marketplace has production-tested workflows so you do not waste time rebuilding what already exists.

---

### #11.04 Plugin Structure

> **Level:** Intermediate | **Impact:** Medium

**Problem:** You want to package and share your skills, hooks, and agents as a single installable unit.

**Do this:**
```
my-plugin/
  .claude-plugin/
    plugin.json       # Name, version, description
  commands/           # Slash commands (.md files)
  agents/             # Custom agent definitions
  skills/             # Auto-triggered skills
  hooks/              # Hook scripts
  .mcp.json           # MCP server configs (optional)

# Sources: git repos, npm packages, local directories
# Install local plugins for development:
claude --plugin-dir ./my-plugin

# Persistent state that survives updates:
${CLAUDE_PLUGIN_DATA}/my-data.json
```

**Why:** Plugins bundle everything into one installable unit -- share your team's best practices as a single `claude plugin install`.

---

### #11.05 Custom Slash Commands (The Quick Version)

> **Level:** Beginner | **Impact:** Medium

**Problem:** You repeat the same multi-step workflow manually every time.

**Do this:**
```markdown
<!-- .claude/commands/debug.md -->
---
description: Debug an issue with structured investigation
allowed-tools: Read, Grep, Glob, Bash
---

Debug the following issue: $ARGUMENTS

Steps:
1. Reproduce the issue by running the relevant test
2. Read the error output carefully
3. Identify the root cause (not just the symptom)
4. Fix the issue
5. Run the test again to confirm the fix
```
```bash
# Usage:
/debug "TypeError in user registration when email contains +"
```

**Why:** Commands encode your best practices into repeatable workflows anyone can invoke with a slash.

---

### #11.06 Skills Can Have Memory and On-Demand Hooks

> **Level:** Advanced | **Impact:** High

**Problem:** Your skill needs persistent state across sessions, and safety hooks that only activate during the skill's execution.

**Do this:**
```markdown
<!-- Skills can store data persistently -->
${CLAUDE_PLUGIN_DATA}/learnings.jsonl   # Append-only log
${CLAUDE_PLUGIN_DATA}/config.json       # Settings
${CLAUDE_PLUGIN_DATA}/state.db          # Even SQLite

<!-- Skills can include on-demand hooks -->
<!-- Example: /careful blocks destructive commands only while active -->
<!-- Example: /freeze restricts edits to one directory while active -->
<!-- These hooks activate when the skill is called, last for the session -->
```

**Why:** Persistent memory lets skills learn across sessions; on-demand hooks provide safety guardrails that only activate when needed.

---

### #11.07 Context7 for Always-Current Documentation

> **Level:** Intermediate | **Impact:** High

**Problem:** Claude's training data may not reflect recent API changes in the libraries you use.

**Do this:**
```jsonc
// Install Context7 MCP:
// In .mcp.json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp"]
    }
  }
}

// Claude automatically fetches current docs when you ask about
// React, Next.js, Prisma, Express, Tailwind, Django, etc.
// Even well-known libraries change APIs between versions
```

**Why:** Context7 fetches live documentation so Claude uses current APIs instead of potentially outdated training data.

---

### #11.08 Disable Auto-Invocation for Dangerous Skills

> **Level:** Advanced | **Impact:** Medium

**Problem:** Claude auto-triggers your deploy or release skill when merely discussing deployment.

**Do this:**
```yaml
# In .claude/skills/deploy/SKILL.md:
---
name: deploy
description: Deploy to production. ONLY invoke when user explicitly asks.
disable-model-invocation: true
---

# Steps to deploy...
```

**Why:** `disable-model-invocation: true` means only the user can trigger this skill via slash command -- Claude cannot auto-invoke it even if the conversation is about deployment.

---

### #11.09 Skill Placement Policy

> **Level:** Advanced | **Impact:** Medium

**Problem:** Skills from different sources get mixed together, making it unclear which are vetted and which are generated.

**Do this:**
```
# Skill placement hierarchy:
.claude/skills/              # Curated: shipped with repo, code-reviewed
~/.claude/skills/learned/    # Learned: auto-generated from patterns
~/.claude/skills/imported/   # Imported: from marketplace or external
~/.claude/skills/evolved/    # Evolved: self-modified skills

# Rules:
# 1. Never auto-promote learned -> curated without human review
# 2. Imported skills get audited before first use
# 3. Only curated skills belong in version control
```

**Why:** Keeping generated skills separate from shipped skills prevents untested automation from running in production.

---

### #11.10 Search Before Building

> **Level:** Intermediate | **Impact:** High

**Problem:** You build a custom solution for something that already exists in the marketplace, npm, or your repo.

**Do this:**
```
# Search order before building anything:
1. Repo    -- Does this exist in the codebase? grep -r "functionName" src/
2. Package -- Is there a maintained npm/PyPI package?
3. Plugin  -- Is there a marketplace plugin? /plugin
4. MCP     -- Is there an MCP server? Check modelcontextprotocol/servers
5. Skill   -- Is there a community skill?

# Decision:  Adopt > Extend > Compose > Build
# Only build from scratch if nothing exists or has critical gaps
```

**Why:** The cheapest, most reliable code is code someone else already wrote, tested, and maintains.

---

---

[< 10 Hooks & Automation](10-hooks-and-automation.md) | [Home](../README.md) | [12 MCP & Tools >](12-mcp-and-tools.md)
