# 11 MCP, Skills & Plugins

### #11.01 MCP Server Basics

> **Level:** Beginner | **Impact:** High

**Problem:** You want to connect Claude Code to external tools but do not know where to configure MCP servers.

**Do this:**
```jsonc
// .mcp.json (project-level) or ~/.claude/settings.json (global)
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_xxx" }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    }
  }
}
```
```
# Manage in-session:
/mcp
```

**Why:** Keep under 10 servers enabled -- each server's tool schemas consume context tokens even when unused.

---

### #11.02 Skills Are the Canonical Surface, Commands Are Legacy

> **Level:** Beginner | **Impact:** Medium

**Problem:** You are building workflows as custom slash commands but they are brittle and hard to compose.

**Do this:**
```markdown
<!-- skills/review.md (SKILL.md format) -->
---
name: code-review
description: Review code changes for bugs, security, and style
triggers:
  - "review this"
  - "check my code"
---

## When to Use
After completing a feature or before creating a PR.

## How It Works
1. Read all changed files via `git diff`
2. Check for: bugs, security issues, style violations, missing tests
3. Output actionable feedback grouped by severity

## Anti-Patterns
- Do NOT weaken linter configs to pass review
- Do NOT skip files that look "fine"
```

**Why:** Skills with YAML frontmatter are more durable, composable, and discoverable than raw command scripts.

---

### #11.03 Writing Good Skills

> **Level:** Intermediate | **Impact:** High

**Problem:** Your skills do not trigger reliably because Claude does not know when to invoke them.

**Do this:**
```markdown
---
name: tdd-guide
description: >
  Guide test-driven development for any feature. Use when implementing
  new features, fixing bugs, or when the user says "write tests first".
triggers:
  - "tdd"
  - "test first"
  - "write tests before code"
---

## When to Use
- New feature implementation
- Bug fixes (reproduce with test first)
- User explicitly requests TDD

## How It Works
1. Write a failing test that captures the requirement
2. Run the test to confirm it fails
3. Write minimal code to pass
4. Refactor while keeping tests green

## Examples
- "Add user authentication" -> write auth test first
- "Fix the date parsing bug" -> write test that reproduces the bug

## Anti-Patterns
- Writing implementation before any test exists
- Writing tests that test implementation details instead of behavior
```

**Why:** The description field is what Claude reads to decide invocation -- vague descriptions mean skills never fire.

---

### #11.04 Fewer, More Expressive Tools Beat Many Narrow Ones

> **Level:** Intermediate | **Impact:** High

**Problem:** You keep adding MCP tools and custom commands, but Claude gets confused about which to use.

**Do this:**
```markdown
<!-- Instead of 5 narrow tools: -->
<!-- list-users, get-user, create-user, update-user, delete-user -->

<!-- Use 1 expressive tool: -->
<!-- db-query: executes any SQL against the database -->

# A single code execution primitive outperforms
# specialized toolkits by 20% on benchmarks.

# Rule of thumb:
# If you have >10 MCP tools enabled, you're hurting more than helping.
# Each tool schema eats context tokens and adds decision overhead.
```

**Why:** Fewer, more general tools reduce decision overhead and context consumption while increasing flexibility.

---

### #11.05 Custom Slash Commands

> **Level:** Intermediate | **Impact:** Medium

**Problem:** You repeat the same multi-step workflow (debug, test, deploy) manually every time.

**Do this:**
```markdown
<!-- .claude/commands/debug.md -->
Debug the following issue: $ARGUMENTS

Steps:
1. Reproduce the issue by running the relevant test or code path
2. Read the error output carefully
3. Identify the root cause (not just the symptom)
4. Fix the issue
5. Run the test again to confirm the fix
6. Check for similar issues in related code
```
```bash
# Usage in Claude Code:
/debug "TypeError in user registration when email contains +"
```

**Why:** Commands encode your team's best practices into repeatable workflows anyone can invoke with a slash.

---

### #11.06 Skill Placement Policy

> **Level:** Advanced | **Impact:** Medium

**Problem:** Skills from different sources get mixed together, making it unclear which are vetted and which are generated.

**Do this:**
```
# Skill placement hierarchy:
skills/                        # Curated: shipped with repo, code-reviewed
~/.claude/skills/learned/      # Learned: auto-generated from session patterns
~/.claude/skills/imported/     # Imported: pulled from external sources
~/.claude/skills/evolved/      # Evolved: self-modified skills

# Rules:
# 1. Never auto-promote learned -> curated without human review
# 2. Imported skills get audited before first use
# 3. Evolved skills are experimental -- never trust blindly
# 4. Only curated skills belong in version control
```

**Why:** Keeping generated skills separate from shipped skills prevents untested automation from running in production.

---

### #11.07 Playgrounds Plugin for Visual Problems

> **Level:** Advanced | **Impact:** Medium

**Problem:** You are tuning animation parameters, color systems, or layouts by editing code and refreshing -- slow feedback loop.

**Do this:**
```markdown
<!-- Prompt pattern: -->
Generate a standalone HTML playground with interactive controls for tuning
the easing curve. Include:
- Range sliders for bezier control points (x1, y1, x2, y2)
- Live preview animation using the current curve
- CSS output showing the cubic-bezier() value
- Copy-to-clipboard button for the final value

Write it to playground.html -- single file, no dependencies.
```
```bash
# Open and iterate:
open playground.html  # or xdg-open on Linux
```

**Why:** Interactive HTML playgrounds give instant visual feedback for problems that are painful to tune through code alone.

---

### #11.08 Search-First Before Building

> **Level:** Advanced | **Impact:** High

**Problem:** You build a custom solution for something that already exists in your repo, npm, or as an MCP server.

**Do this:**
```markdown
<!-- Decision matrix before building anything: -->

## Search Order:
1. **Repo** -- Does this already exist in the codebase? `grep -r "functionName" src/`
2. **Package** -- Is there a well-maintained npm/PyPI package? Check downloads + last update
3. **MCP** -- Is there an MCP server for this? Check modelcontextprotocol/servers
4. **Skill** -- Is there a community skill? Check ~/.claude/skills/
5. **GitHub** -- Is there a standalone tool? Search GitHub

## Decision:
Adopt > Extend > Compose > Build

# Only build from scratch if:
# - Nothing exists, OR
# - Existing solutions have critical gaps, OR
# - The dependency cost exceeds the build cost
```

**Why:** The cheapest, most reliable code is code someone else already wrote, tested, and maintains.

---
