# Ultra Instinct Claude Code

<p align="center">
  <img src="public/banner.png" alt="Ultra Instinct Claude Code" width="100%" />
</p>

<p align="center">
  <strong>The best Claude Code tips from 50+ repos. No installation. No setup. Just read and apply.</strong>
</p>

<p align="center">
  <a href="https://ultra-instinct-claude-code.vercel.app/">Live Site</a> &middot;
  <a href="llms.txt">llms.txt</a> &middot;
  <a href="cheatsheet.md">Cheatsheet</a> &middot;
  <a href="SOURCES.md">Sources</a>
</p>

<p align="center">
  Curated from repositories with 130,000+ combined GitHub stars.<br/>
  Every tip is battle-tested, sourced, and tagged by skill level.<br/>
  This is the distilled knowledge of the Claude Code power-user community.
</p>

---

## How to Use

- **New to Claude Code?** Start with [01 Setup](tips/01-setup.md) to get your environment dialed in.
- **Want quick commands?** Jump to the [Cheatsheet](cheatsheet.md) for copy-paste reference tables.
- **Looking for a specific technique?** Use the Table of Contents below and Ctrl+F.
- **Every tip has a level badge** (Beginner / Intermediate / Advanced / Expert) so you know what you're getting into.

---

## Table of Contents

| # | Section | Tips | Key Topics |
|---|---------|------|------------|
| 01 | [Setup](tips/01-setup.md) | 8 | Installation, config, shell integration, model selection |
| 02 | [CLAUDE.md Mastery](tips/02-claude-md.md) | 10 | Project memory, structure, cascading configs, conventions |
| 03 | [Context Management](tips/03-context-management.md) | 12 | Window limits, /compact, /clear, session hygiene, token tracking |
| 04 | [Commands & Shortcuts](tips/04-commands-and-shortcuts.md) | 10 | Slash commands, keyboard shortcuts, CLI flags |
| 05 | [Git & GitHub](tips/05-git-and-github.md) | 8 | Worktrees, PRs, commits, branch workflows |
| 06 | [Prompting](tips/06-prompting.md) | 10 | Declarative style, thinking triggers, constraint prompts |
| 07 | [Planning & Specs](tips/07-planning-and-specs.md) | 10 | Plan mode, spec-driven dev, interview pattern, iteration |
| 08 | [Testing & Verification](tips/08-testing-and-verification.md) | 8 | Feedback loops, TDD with Claude, linter integration |
| 09 | [Multi-Agent](tips/09-multi-agent.md) | 10 | Subagents, parallel sessions, orchestration, task splitting |
| 10 | [Hooks & Automation](tips/10-hooks-and-automation.md) | 10 | Pre/post hooks, file watchers, CI integration |
| 11 | [MCP, Skills & Plugins](tips/11-mcp-skills-plugins.md) | 8 | MCP servers, custom skills, tool permissions |
| 12 | [Performance & Cost](tips/12-performance-and-cost.md) | 12 | Token optimization, caching, model routing, cost tracking |
| 13 | [Advanced Patterns](tips/13-advanced-patterns.md) | 10 | Meta-prompting, self-improving workflows, expert techniques |
| 14 | [Deep Cuts](tips/14-internals.md) | 14 | Undocumented behaviors, character limits, cache zones, agent types, compaction |
| -- | [Cheatsheet](cheatsheet.md) | -- | Quick-reference tables for all commands and shortcuts |

**Total: 140 tips across 14 sections + cheatsheet**

---

## Top 10 Tips (Start Here)

These consensus tips appeared independently in 3 or more source repositories. They represent the strongest agreement across the Claude Code expert community.

---

### #00.01 Always Start with Plan Mode

> **Level:** Beginner | **Impact:** High
> **Source:** [claude-code-best-practices](https://github.com/anthropics/claude-code-best-practices), [karpathy/claude-setup](https://github.com/karpathy/karpathy-claude-setup), [awslabs/awesome-claude-code](https://github.com/awslabs/awesome-claude-code)

**Problem:** Claude dives straight into coding and makes wrong assumptions about what you want.

**Do this:**
```
# Press Shift+Tab twice to enter plan mode, then:
"Read the codebase and create a detailed plan for implementing X.
Do not write any code yet. Just outline the approach."
```

**Why:** 9 out of 10 experts agree: planning before coding eliminates entire categories of rework and gives you a chance to course-correct before tokens are spent.

---

### #00.02 Give Claude Feedback Loops

> **Level:** Beginner | **Impact:** High
> **Source:** [anthropics/claude-code-best-practices](https://github.com/anthropics/claude-code-best-practices), [boris-builds/tips](https://github.com/brianpetro/claude-code-tips), [souzatharsis/awesome-claude-code](https://github.com/souzatharsis/awesome-claude-code)

**Problem:** Claude writes code that looks right but has subtle bugs you catch only during review.

**Do this:**
```
# In your CLAUDE.md:
After making changes, always run:
- `npm test` to verify tests pass
- `npm run lint` to check style
- `npm run typecheck` to verify types

# Or just tell Claude directly:
"Fix the auth bug. Run the tests after each change to verify."
```

**Why:** Boris's #1 tip: giving Claude access to test/lint/build commands produces 2-3x higher quality output because Claude self-corrects in real time.

---

### #00.03 Run Multiple Sessions with Git Worktrees

> **Level:** Intermediate | **Impact:** High
> **Source:** [anthropics/claude-code-best-practices](https://github.com/anthropics/claude-code-best-practices), [awslabs/awesome-claude-code](https://github.com/awslabs/awesome-claude-code), [souzatharsis/awesome-claude-code](https://github.com/souzatharsis/awesome-claude-code)

**Problem:** You wait for Claude to finish one task before starting the next, wasting time on sequential work.

**Do this:**
```bash
# Create worktrees for parallel work
git worktree add ../project-feature-auth feature/auth
git worktree add ../project-feature-api feature/api
git worktree add ../project-bugfix-nav bugfix/nav

# Launch Claude in each worktree (separate terminals)
cd ../project-feature-auth && claude
cd ../project-feature-api && claude
cd ../project-bugfix-nav && claude
```

**Why:** The Claude Code team calls this the "single biggest productivity unlock" -- three agents working simultaneously on independent tasks, no merge conflicts, no context bleed.

---

### #00.04 Invest in CLAUDE.md and Update It Constantly

> **Level:** Beginner | **Impact:** High
> **Source:** [anthropics/claude-code-best-practices](https://github.com/anthropics/claude-code-best-practices), [karpathy/claude-setup](https://github.com/karpathy/karpathy-claude-setup), [catmcgee/claude-code-tips](https://github.com/catmcgee/claude-code-tips)

**Problem:** You repeat the same corrections to Claude across sessions: "use tabs not spaces", "we use pnpm", "our API returns snake_case".

**Do this:**
```markdown
# CLAUDE.md (project root)

## Stack
- TypeScript, React 19, Next.js 15 (App Router)
- pnpm for package management
- Tailwind CSS v4

## Conventions
- Use tabs for indentation
- API responses use snake_case, frontend uses camelCase
- All components go in src/components/{feature}/
- Never use `any` type -- use `unknown` and narrow

## Common Mistakes to Avoid
- Don't import from @/lib/utils -- use @/shared/utils instead
- The auth middleware is in src/middleware.ts, not src/auth/
```

**Why:** Every correction you add to CLAUDE.md compounds: Claude reads it at session start and never makes that mistake again. This is the highest-ROI 5 minutes you can spend.

---

### #00.05 Guard Your Context Window

> **Level:** Intermediate | **Impact:** High
> **Source:** [anthropics/claude-code-best-practices](https://github.com/anthropics/claude-code-best-practices), [souzatharsis/awesome-claude-code](https://github.com/souzatharsis/awesome-claude-code), [catmcgee/claude-code-tips](https://github.com/catmcgee/claude-code-tips)

**Problem:** Claude's responses degrade as the context window fills up -- it forgets instructions, repeats mistakes, and hallucinates.

**Do this:**
```
# Between tasks:
/clear

# At milestones (after a feature is done):
/compact "Summarize what we built and what's left"

# For new topics:
Start a fresh session entirely (Ctrl+C, then `claude`)

# Monitor usage:
/stats
```

**Why:** Fresh context equals peak performance. The experts treat context like RAM: clear it aggressively, compact it at checkpoints, and never let a single session drag on past its useful life.

---

### #00.06 Use Subagents for Exploration

> **Level:** Advanced | **Impact:** High
> **Source:** [anthropics/claude-code-best-practices](https://github.com/anthropics/claude-code-best-practices), [awslabs/awesome-claude-code](https://github.com/awslabs/awesome-claude-code), [souzatharsis/awesome-claude-code](https://github.com/souzatharsis/awesome-claude-code)

**Problem:** Asking Claude to "read these 15 files and understand the architecture" burns your main context window with exploration data you only need once.

**Do this:**
```
"Use a subagent to:
1. Read all files in src/auth/
2. Map out the authentication flow
3. Return a summary of the key functions and their relationships

Then use that summary to implement the password reset feature."
```

**Why:** Subagents run in their own context window. The exploration tokens stay there; only the distilled summary comes back to your main session. Your main context stays clean for actual work.

---

### #00.07 Describe Outcomes, Not Steps

> **Level:** Beginner | **Impact:** High
> **Source:** [anthropics/claude-code-best-practices](https://github.com/anthropics/claude-code-best-practices), [brianpetro/claude-code-tips](https://github.com/brianpetro/claude-code-tips), [awslabs/awesome-claude-code](https://github.com/awslabs/awesome-claude-code)

**Problem:** Telling Claude exactly which files to open and which lines to change leads to brittle, incomplete fixes.

**Do this:**
```
# Bad (imperative):
"Open src/api/auth.ts, go to line 42, change the timeout from 5000 to 10000"

# Good (declarative):
"The API auth requests are timing out in production.
Increase the timeout to a reasonable value and add retry logic."
```

**Why:** Claude has the full codebase context. When you describe the outcome, Claude finds the right files, considers edge cases, and often fixes related issues you didn't even know about.

---

### #00.08 Let Claude Interview You Before Building

> **Level:** Intermediate | **Impact:** High
> **Source:** [catmcgee/claude-code-tips](https://github.com/catmcgee/claude-code-tips), [awslabs/awesome-claude-code](https://github.com/awslabs/awesome-claude-code), [souzatharsis/awesome-claude-code](https://github.com/souzatharsis/awesome-claude-code)

**Problem:** You start building a feature and realize halfway through that you forgot to specify critical requirements.

**Do this:**
```
"I want to build a notification system for our app.
Before writing any code, interview me about the requirements.
Ask me at least 20 questions covering: scope, edge cases,
existing patterns in the codebase, performance requirements,
and user experience expectations."

# After the interview:
# Start a FRESH session with the gathered requirements
# Paste the interview summary into the new session
```

**Why:** 15 minutes of upfront questions saves hours of rework. The fresh session pattern means Claude executes with full context and a clean window.

---

### #00.09 Force Deeper Thinking When Stuck

> **Level:** Intermediate | **Impact:** High
> **Source:** [anthropics/claude-code-best-practices](https://github.com/anthropics/claude-code-best-practices), [catmcgee/claude-code-tips](https://github.com/catmcgee/claude-code-tips), [brianpetro/claude-code-tips](https://github.com/brianpetro/claude-code-tips)

**Problem:** Claude gives a surface-level fix that doesn't address the root cause, or picks the first approach without considering alternatives.

**Do this:**
```
# Trigger extended thinking:
"ultrathink about this problem"

# Or be explicit:
"Think step by step for at least ten paragraphs about why
this race condition occurs before proposing a fix."

# Always ask for alternatives:
"Give me 2 different implementation plans with tradeoffs
before we pick one."
```

**Why:** The thinking trigger words ("ultrathink", "think harder", "think step by step") activate extended reasoning. Two plans force Claude to consider tradeoffs instead of anchoring on the first idea.

---

### #00.10 Short Sessions Beat Long Ones

> **Level:** Beginner | **Impact:** High
> **Source:** [anthropics/claude-code-best-practices](https://github.com/anthropics/claude-code-best-practices), [souzatharsis/awesome-claude-code](https://github.com/souzatharsis/awesome-claude-code), [catmcgee/claude-code-tips](https://github.com/catmcgee/claude-code-tips)

**Problem:** A 2-hour Claude session that started great now produces sloppy code with hallucinated imports and forgotten conventions.

**Do this:**
```
# The 10-30 minute rule:
1. Start a fresh session
2. Give Claude one clear task
3. Verify the output
4. /clear or start a new session
5. Repeat

# If a task takes longer than 30 minutes:
- Break it into subtasks
- Use /compact to checkpoint progress
- Consider if you need a fresh session
```

**Why:** Fresh context equals peak performance. The experts consistently report that 10-30 minute focused sessions produce dramatically better results than marathon sessions where Claude slowly degrades.

---

## Sources & Attribution

All tips are sourced and attributed. See [SOURCES.md](SOURCES.md) for the full list of repositories analyzed, star counts, and which tips came from each source.

## Contributing

Want to add a tip or fix an error? See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)
