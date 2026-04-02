[Home](../README.md) > 12 MCP & Tools

# 12 MCP & Tools

### #12.01 MCP Server Basics

> **Level:** Beginner | **Impact:** High

**Problem:** You want to connect Claude Code to external tools but do not know where to configure MCP servers.

**Do this:**
```jsonc
// .mcp.json (project-level) or ~/.claude.json (global)
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

### #12.02 MCP Tools Are the #1 Context Hog

> **Level:** Intermediate | **Impact:** High

**Problem:** MCP tool schemas consume massive context even when you never call them.

**Do this:**
```
# Each MCP tool schema costs ~500 tokens
# 30-tool server = 15,000 tokens eaten on EVERY message

# Budget:
# - Keep under 10 MCP servers
# - Keep under 80 total tools
# - Audit with: /context

# MCP tool descriptions are capped at 2KB each
# OpenAPI-generated servers can still bloat context
```

**Why:** MCP tools load into every prompt -- 30 unused tools waste more context than your entire CLAUDE.md.

---

### #12.03 Replace MCPs with CLI Skills

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

### #12.04 Tool Search for Large MCP Sets

> **Level:** Advanced | **Impact:** Medium

**Problem:** You need many MCP tools available but they consume over 10% of your context window.

**Do this:**
```bash
# Enable automatic tool search:
ENABLE_TOOL_SEARCH=auto:5 claude

# Or in settings.json:
{ "env": { "ENABLE_TOOL_SEARCH": "true" } }

# How it works:
# - Full tool definitions replaced with name-only stubs
# - Claude searches for relevant tools on demand
# - Only matched tools get full schema loaded
# - Auto-enabled when tools exceed 10% of context
```

**Why:** Tool search gives you access to large tool sets without paying the constant context cost of full schemas.

---

### #12.05 Fewer, More Expressive Tools Win

> **Level:** Intermediate | **Impact:** High

**Problem:** You keep adding MCP tools and custom commands, but Claude gets confused about which to use.

**Do this:**
```
# Instead of 5 narrow tools:
# list-users, get-user, create-user, update-user, delete-user

# Use 1 expressive tool:
# db-query: executes any SQL against the database

# A single code execution primitive outperforms
# specialized toolkits by 20% on benchmarks

# Rule of thumb:
# If you have >10 MCP tools enabled, you're hurting more than helping
```

**Why:** Fewer, more general tools reduce decision overhead and context consumption while increasing flexibility.

---

### #12.06 MCP OAuth and Elicitation

> **Level:** Advanced | **Impact:** Medium

**Problem:** Your MCP server needs authentication or user input mid-task.

**Do this:**
```jsonc
// MCP OAuth: servers can use Dynamic Client Registration
// Pre-configured credentials:
{
  "mcpServers": {
    "my-server": {
      "url": "https://my-server.com/mcp",
      "--client-id": "xxx",
      "--client-secret": "yyy"
    }
  }
}

// MCP Elicitation: servers can request structured input mid-task
// via interactive dialog -- no need to break the workflow
```

**Why:** OAuth lets MCP servers authenticate securely; elicitation lets them ask for user input without stopping the agent loop.

---

### #12.07 MCP Scopes: Project vs User vs Subagent

> **Level:** Intermediate | **Impact:** Medium

**Problem:** You want some MCP servers available to your team and others only for your personal use.

**Do this:**
```
# Project scope (shared with team, checked into git):
.mcp.json

# User scope (personal, all projects):
~/.claude.json

# Subagent scope (only for a specific agent):
# In agent frontmatter: mcpServers: [...]

# Precedence: Subagent > Project > User
# Use env var expansion for secrets: ${GITHUB_TOKEN}
```

**Why:** Scoped MCP configs prevent personal API keys from leaking into team repos while letting subagents access only what they need.

---

### #12.08 90% Token Reduction via Bash Wrappers

> **Level:** Expert | **Impact:** High

**Problem:** MCP tool schemas loaded into the system prompt consume thousands of tokens even when unused.

**Do this:**
```bash
# Instead of loading MCP tools as native tool schemas,
# run them through bash so schemas aren't in the system prompt:

# Before (MCP tool schema always in context):
# "Use the github_search MCP tool to find issues"

# After (bash wrapper, no schema overhead):
claude -p "Run: gh search issues 'bug label:critical' --repo myorg/myrepo"

# Or create a bash wrapper:
#!/usr/bin/env bash
# tools/gh-search.sh
gh search issues "$1" --repo "$2" --json title,url,state
```

**Why:** Running tools through bash instead of MCP eliminates schema tokens from every request -- up to 90% reduction for tool-heavy setups.

---

---

[< 11 Skills & Marketplace](11-skills-and-marketplace.md) | [Home](../README.md) | [13 Performance & Cost >](13-performance-and-cost.md)
