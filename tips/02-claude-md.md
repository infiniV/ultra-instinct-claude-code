[Home](../README.md) > 02 CLAUDE.md Mastery

# 02 CLAUDE.md Mastery

### #02.01 The CLAUDE.md Hierarchy

> **Level:** Beginner | **Impact:** High

**Problem:** Claude Code loads CLAUDE.md from multiple locations and you need to know which one wins.

**Do this:**
```
# Loading order (all are merged, not overridden):
~/.claude/CLAUDE.md            # Global personal rules
./CLAUDE.md                    # Project root
./src/CLAUDE.md                # Subdirectory (loaded when working in src/)
./src/api/CLAUDE.md            # Deeper subdirectory (ancestor loading)

# Monorepo tip: each package gets its own CLAUDE.md
# Claude loads ancestors up to the project root automatically
```

**Why:** Ancestor loading means subdirectory instructions compose with project-level ones -- no repetition needed.

---

### #02.02 Keep CLAUDE.md Under 30 Lines

> **Level:** Beginner | **Impact:** High

**Problem:** Every edit to CLAUDE.md breaks the prompt cache, and bloated files waste tokens on every message.

**Do this:**
```markdown
# CLAUDE.md -- keep this short and stable

## Build & Test
- `npm test` to run all tests
- `npm run lint` to check style

## Rules
- Never modify generated files in dist/
- Use named exports, no default exports

## Architecture
- See docs/architecture.md for details
```

**Why:** A short, stable CLAUDE.md hits ~90% prompt cache rate -- a bloated one busts the cache and costs 10x more per message.

---

### #02.03 Update CLAUDE.md After Every Correction

> **Level:** Beginner | **Impact:** High

**Problem:** You keep correcting Claude for the same mistakes across sessions.

**Do this:**
```
# After correcting Claude, say:
"Update your CLAUDE.md so you don't make that mistake again."

# Claude will add a rule like:
# - Always use `pnpm` not `npm` in this project
# - Test files go in __tests__/, not next to source
```

**Why:** Each correction compounds -- CLAUDE.md becomes a project-specific knowledge base that eliminates repeat mistakes.

---

### #02.04 Use Important-If Tags for Critical Rules

> **Level:** Intermediate | **Impact:** High

**Problem:** As CLAUDE.md grows, Claude starts ignoring rules buried deep in the file.

**Do this:**
```markdown
<important if="modifying database schema">
NEVER drop columns in migration files. Always add new columns
and backfill. Dropping columns causes production outages.
</important>

<important if="writing API endpoints">
All endpoints MUST return { data, error, meta } shape.
No exceptions.
</important>
```

**Why:** Conditional importance tags make critical rules stand out so Claude respects them even in large files.

---

### #02.05 Separate Guidance from Enforcement

> **Level:** Intermediate | **Impact:** Medium

**Problem:** Everything lives in CLAUDE.md but some rules absolutely cannot be violated.

**Do this:**
```bash
# If you'd be ANGRY when violated --> make it a hook
# hooks/pre-commit: runs linter, blocks bad patterns

# If you'd be MILDLY ANNOYED --> put it in CLAUDE.md
# "Prefer early returns over nested if/else"

# Example hook in settings.json:
{
  "hooks": {
    "PreCommit": [{
      "command": "npm run lint && npm test",
      "blocking": true
    }]
  }
}
```

**Why:** Hooks are enforced by the harness and cannot be skipped; CLAUDE.md is best-effort guidance.

---

### #02.06 Don't Duplicate Instructions

> **Level:** Intermediate | **Impact:** Medium

**Problem:** The same instruction appears in CLAUDE.md, a skill file, and a rules/ directory -- wasting tokens and risking conflicts.

**Do this:**
```bash
# Audit for duplicates
grep -rh "MUST\|NEVER\|ALWAYS" CLAUDE.md .claude/skills/ rules/ \
  | sort | uniq -d

# Single source of truth:
# CLAUDE.md       -> project-wide rules (short)
# .claude/skills/ -> domain workflows (loaded on demand)
# rules/          -> reference docs (linked, not inlined)
```

**Why:** Duplicate instructions waste context tokens and drift apart when one copy gets updated but the other does not.

---

### #02.07 Settings Hierarchy for Hooks

> **Level:** Advanced | **Impact:** Medium

**Problem:** You need team hooks enforced everywhere but also want personal hooks that stay out of version control.

**Do this:**
```jsonc
// .claude/settings.json (committed -- team enforcement)
{
  "hooks": {
    "PreCommit": [{ "command": "npm run lint", "blocking": true }]
  }
}

// .claude/settings.local.json (gitignored -- personal)
{
  "hooks": {
    "PostResponse": [{ "command": "say 'done'" }]
  }
}

// ~/.claude/settings.json (global -- all projects)
{
  "hooks": {
    "PreCommit": [{ "command": "detect-secrets scan", "blocking": true }]
  }
}
```

**Why:** Global hooks provide baseline protection, project hooks handle build tooling, local hooks are for personal preferences -- never commit permission bypasses.

---

### #02.08 CLAUDE.md Anti-Patterns

> **Level:** Advanced | **Impact:** High

**Problem:** Common CLAUDE.md mistakes silently degrade Claude's performance.

**Do this:**
```markdown
# ANTI-PATTERNS to avoid:

# 1. Kitchen sink -- file over 50 lines
#    Fix: move details to linked docs

# 2. Correcting the same thing repeatedly
#    Fix: if Claude fails twice, run /clear and rephrase

# 3. Over-specified instructions
#    Fix: "use consistent naming" not a 40-line style guide

# 4. Unstable content that changes every session
#    Fix: move WIP notes to HANDOFF.md, keep CLAUDE.md stable
```

**Why:** Bloated files get ignored, unstable files bust the cache, and repeated corrections signal a missing rule.

---

### #02.09 The /improve Command

> **Level:** Advanced | **Impact:** Medium

**Problem:** You forget to update CLAUDE.md and miss patterns hiding in your git history.

**Do this:**
```
# After a session, run:
/improve

# This analyzes recent git history and suggests CLAUDE.md updates
# based on patterns like:
# - Repeated manual fixes
# - Common file structures
# - Build/test commands used
```

**Why:** Automated suggestions catch patterns you would miss, turning session history into permanent project knowledge.

---

### #02.10 Dynamic System Prompt Injection

> **Level:** Expert | **Impact:** Medium

**Problem:** You want different CLAUDE.md-like contexts for different modes (dev, review, deploy) without editing files.

**Do this:**
```bash
# Create mode-specific contexts
mkdir -p ~/.claude/contexts

cat > ~/.claude/contexts/dev.md << 'EOF'
You are in development mode. Run tests after every change.
Prefer small incremental commits.
EOF

cat > ~/.claude/contexts/review.md << 'EOF'
You are in review mode. Do not modify code. Only analyze
and report issues with severity ratings.
EOF

# Aliases for each mode
alias claude-dev='claude --system-prompt "$(cat ~/.claude/contexts/dev.md)"'
alias claude-review='claude --system-prompt "$(cat ~/.claude/contexts/review.md)"'
```

**Why:** Mode-specific prompts let you reuse one CLAUDE.md while switching behavior without editing any files.

---

---

[< 01 Setup](01-setup.md) | [Home](../README.md) | [03 Context Management >](03-context-management.md)
