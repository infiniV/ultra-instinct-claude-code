# 14 Deep Cuts (Undocumented Behaviors & Power-User Discoveries)

> Community-tested tips discovered through extensive experimentation and observation.
> These behaviors have been verified across hundreds of sessions by power users.

---

### #14.01 CLAUDE.md Has a Character Limit Per File

> **Level:** Beginner | **Impact:** High
> **Source:** [Community testing](https://github.com/affaan-m/everything-claude-code), [Official docs](https://code.claude.com/docs/en/memory)

**Problem:** Your CLAUDE.md is silently truncated and you don't know it.

**Do this:**
```bash
# Check your CLAUDE.md size:
wc -c CLAUDE.md
# Community testing shows ~4,000 chars per file is the safe limit
# Total across ALL instruction files: ~12,000 chars

# If too long, split into focused files:
# .claude/rules/testing.md
# .claude/rules/style.md
# .claude/rules/architecture.md
```

**Why:** Content beyond these limits gets silently truncated. If your CLAUDE.md is 5K chars, the last 1K disappears. Split into multiple focused files.

---

### #14.02 Use @imports to Keep CLAUDE.md Small

> **Level:** Beginner | **Impact:** High
> **Source:** [Official docs](https://code.claude.com/docs/en/memory), [ykdojo](https://github.com/ykdojo/claude-code-tips)

**Problem:** You need to reference large docs (API specs, architecture) but can't fit them in 4K chars.

**Do this:**
```markdown
# In your CLAUDE.md:
For API patterns, see @docs/api-conventions.md
For architecture, see @docs/architecture.md
For testing, see @docs/testing-guide.md
```

**Why:** The `@path/to/file` syntax inlines content on demand without bloating CLAUDE.md. The character limit applies to the file itself, not imported content.

---

### #14.03 Add Compact Instructions to Your CLAUDE.md

> **Level:** Intermediate | **Impact:** High
> **Source:** [Boris Cherny](https://x.com/bcherny), [Community testing](https://github.com/shanraisshan/claude-code-best-practice)

**Problem:** Compaction loses the specific context YOU care about.

**Do this:**
```markdown
# Add to CLAUDE.md:
## Compact Instructions
When summarizing this conversation, always preserve:
- File paths and line numbers mentioned
- Error messages and stack traces
- Test results and their pass/fail status
- Architectural decisions and their rationale
- Any TODO items or next steps
```

**Why:** The compaction process looks for custom summarization instructions in your CLAUDE.md. This directly controls what the summarizer focuses on and preserves.

---

### #14.04 Compaction Preserves Your Most Recent Messages

> **Level:** Intermediate | **Impact:** High
> **Source:** [Community observation](https://github.com/anipotts/claude-code-tips), [everything-claude-code](https://github.com/affaan-m/everything-claude-code)

**Problem:** You don't know what survives compaction, so you can't plan around it.

**Do this:**
```
# Before compaction hits, ensure critical context is either:
# 1. In your most recent messages (preserved verbatim)
# 2. Written to disk (CLAUDE.md, session notes, TODO file)
# 3. In a compact instruction (preserved by summarizer)

# Community testing shows the summarizer creates sections for:
# - Primary Request and Intent
# - Key Technical Concepts
# - Files and Code Sections (with code snippets)
# - Errors and fixes
# - Problem Solving
# - User messages
# - Pending Tasks
# - Current Work
# - Next Steps
```

**Why:** Recent messages survive compaction intact. Everything older gets summarized. User messages are always preserved, but intermediate reasoning and file contents are lossy.

---

### #14.05 CLAUDE.md Lives in the Dynamic (Uncached) Zone

> **Level:** Advanced | **Impact:** Medium
> **Source:** [Thariq Shihipar](https://x.com/trq212), [cc-bible](https://github.com/4riel/cc-bible)

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

**Why:** Thariq confirmed that cache efficiency depends on keeping the dynamic portion small. Short, stable CLAUDE.md = better cache hit rates = lower cost.

---

### #14.06 CLAUDE.md Can Override Default Behaviors

> **Level:** Advanced | **Impact:** High
> **Source:** [everything-claude-code](https://github.com/affaan-m/everything-claude-code), [cc-bible](https://github.com/4riel/cc-bible)

**Problem:** Claude refuses to create files or add abstractions, even when you want it to.

**Do this:**
```markdown
# Claude Code has conservative defaults like:
# - Avoid creating files unless required
# - Keep changes tightly scoped
# - Don't add speculative abstractions

# Your CLAUDE.md instructions can explicitly override these:

# In CLAUDE.md:
When implementing features, create separate files for each concern.
Create test files alongside every new source file.
Use abstraction layers between modules.
```

**Why:** CLAUDE.md instructions are loaded after the default behavioral rules. Explicit overrides in your CLAUDE.md take precedence. Be specific about what you want.

---

### #14.07 Use Explore Agents for Fast Lookups

> **Level:** Intermediate | **Impact:** Medium
> **Source:** [Official docs](https://code.claude.com/docs/en/sub-agents), [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode)

**Problem:** You use general-purpose agents for simple file lookups, wasting tokens.

**Do this:**
```
# When asking Claude to search/explore:
"Use an Explore agent to find all files related to authentication"

# The Explore agent:
# - Uses a faster, cheaper model
# - Is READ-ONLY (can't edit files)
# - Parallelizes tool calls for speed
# - Tools: Read, Glob, Grep, Bash (read-only)

# For architecture decisions, use Plan agent instead:
# - Uses your current model
# - Also READ-ONLY
# - Produces structured plans with critical file lists
```

**Why:** Explore agents are optimized for speed and cost. Use them for lookups, Plan agents for analysis, and General Purpose only when you need editing.

---

### #14.08 Write Adversarial Verification Prompts

> **Level:** Advanced | **Impact:** Medium
> **Source:** [gstack](https://github.com/garrytan/gstack), [everything-claude-code](https://github.com/affaan-m/everything-claude-code)

**Problem:** Your verification steps are too lenient -- they confirm instead of challenge.

**Do this:**
```markdown
# When writing verify skills or prompts, be adversarial:

"Your job is not to confirm the work. Your job is to BREAK it.
Run the actual tests. Try edge cases. Check error paths.
If you can't break it, THEN it passes.

Common verification failures to avoid:
- Reading code and writing PASS instead of running it
- Being fooled by circular tests or heavy mocks
- Trusting self-reports without evidence
- Hedging with PARTIAL instead of making a call"
```

**Why:** LLMs are naturally agreeable. Verification prompts must explicitly push against this tendency. gstack's Iron Law: "Confidence is not evidence."

---

### #14.09 Make Memory File Names Descriptive

> **Level:** Intermediate | **Impact:** Medium
> **Source:** [Official docs](https://code.claude.com/docs/en/memory), [Community testing](https://github.com/anipotts/claude-code-tips)

**Problem:** Your memory files exist but Claude never loads the right ones.

**Do this:**
```markdown
# Claude selects up to 5 memory files per query based on
# filenames and descriptions only (not file contents).

# BAD: notes.md with description "misc notes"
# GOOD: project_auth_architecture.md with description
#   "Authentication architecture: OAuth2 + JWT, refresh token rotation,
#    session management in Redis, known issues with token expiry"

# Make names and descriptions keyword-rich and specific.
# Warnings and gotchas get prioritized even for familiar tools.
```

**Why:** The memory selection process only sees filenames and one-line descriptions. Rich, specific metadata means your memories actually get loaded when relevant.

---

### #14.10 Hook Denials Steer Claude, Not Just Block

> **Level:** Advanced | **Impact:** Medium
> **Source:** [Official docs](https://code.claude.com/docs/en/hooks), [anipotts](https://github.com/anipotts/claude-code-tips)

**Problem:** Your hooks block actions but Claude just tries the same thing again.

**Do this:**
```bash
#!/usr/bin/env bash
# A hook that STEERS, not just blocks:
set -euo pipefail
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if echo "$COMMAND" | grep -q "rm -rf"; then
  # Don't just say "blocked" -- redirect Claude:
  echo "Blocked: destructive delete. Instead, move files to .trash/ directory or use git stash." >&2
  exit 2
fi
exit 0
```

**Why:** Hook denials with exit code 2 are treated as user feedback. The message you output becomes instructions Claude follows. Include helpful alternatives, not just "blocked."

---

### #14.11 CLAUDE.md Deduplication Saves Tokens

> **Level:** Intermediate | **Impact:** Low
> **Source:** [everything-claude-code](https://github.com/affaan-m/everything-claude-code), [Community testing](https://github.com/shanraisshan/claude-code-best-practice)

**Problem:** You copy the same rules into subdirectory CLAUDE.md files, wasting your character budget.

**Do this:**
```
# DON'T: Copy root CLAUDE.md rules into subdirectory files
# DO: Only add what's DIFFERENT for that subdirectory

# Root CLAUDE.md (applies everywhere):
Use TypeScript strict mode.
Run tests with vitest.

# packages/api/CLAUDE.md (only API-specific rules):
This package uses Express with Zod validation.
API tests require a running Postgres container.

# Identical content across files is automatically deduplicated.
```

**Why:** Claude Code deduplicates identical instruction files. But duplicates still count against your ~12K total character budget before dedup runs. Keep subdirectory files focused on what's unique.

---

### #14.12 Use disable-model-invocation for Dangerous Skills

> **Level:** Advanced | **Impact:** Medium
> **Source:** [Official docs](https://code.claude.com/docs/en/skills), [gstack](https://github.com/garrytan/gstack)

**Problem:** Claude auto-triggers your deploy/release skill when discussing deployment.

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

**Why:** With `disable-model-invocation: true`, only the user can trigger this skill via slash command. Claude cannot auto-invoke it, even if the conversation is about deployment.

---

### #14.13 WebFetch Works Better on Official Documentation Sites

> **Level:** Intermediate | **Impact:** Low
> **Source:** [Community observation](https://github.com/ykdojo/claude-code-tips), [cc-bible](https://github.com/4riel/cc-bible)

**Problem:** You fetch a web page but Claude only gives you a brief summary, missing details.

**Do this:**
```
# Official documentation sites get fuller content extraction.
# Random blogs, forums, and social media get more aggressive summarization.

# To get full content from any site:
# 1. Use /chrome or a browser MCP instead
# 2. Copy-paste the content directly into the conversation
# 3. Save the page locally and use Read tool
# 4. Use Gemini CLI as a fallback (ykdojo tip #11)
```

**Why:** WebFetch applies stricter content limits on untrusted domains to prevent prompt injection. Official docs are trusted and pass through more content.

---

### #14.14 The /init Command Is the Best Way to Bootstrap

> **Level:** Beginner | **Impact:** High
> **Source:** [Official docs](https://code.claude.com/docs/en/features-overview), [claude-howto](https://github.com/luongnv89/claude-howto)

**Problem:** You manually create CLAUDE.md from scratch and miss important conventions.

**Do this:**
```bash
# Just run:
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

**Why:** `/init` creates well-structured, minimal files that respect the character limits. It's better than hand-writing CLAUDE.md.
