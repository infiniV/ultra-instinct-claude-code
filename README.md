# Ultra Instinct Claude Code -- tips, best practices & cheat sheet

<p align="center">
  <img src="public/banner.png" alt="Claude Code tips, best practices, cheat sheet, and tutorial -- learn how to use Claude Code" width="100%" />
</p>

<p align="center">
  <strong>Learn Claude Code in one sitting, not one semester.</strong>
</p>

<p align="center">
  140 tips and best practices for Claude Code -- setup, prompting, context window management, CLAUDE.md, shortcuts, git worktrees, multi-agent workflows. Pulled from 17 repositories, tagged by difficulty, sorted by impact. Instead of reading five different repos, read this one.
</p>

<p align="center">
  <a href="https://ultra-instinct-claude-code.vercel.app/">Browse all tips</a> &middot;
  <a href="cheatsheet.md">Claude Code cheat sheet</a> &middot;
  <a href="llms.txt">llms.txt</a> &middot;
  <a href="SOURCES.md">Sources</a>
</p>

---

## Why this Claude Code guide exists

There are dozens of repos about Claude Code. Most fall into three buckets: awesome-lists (hundreds of links to sort through), installable toolkits (agents, skills, hooks -- setup required), and config frameworks (meta-prompting systems that take days to learn). All of them assume you want to install something.

We wanted something you could sit down with for 30 minutes and actually walk away better at Claude Code. Nothing to install, nothing to configure.

| What's out there | What you get | Time before it's useful |
|-----------------|-------------|------------------------|
| Awesome-lists | Hundreds of links to sort through yourself | Hours of browsing |
| Agent toolkits | "Install 135 agents, 35 skills, 42 commands" | Setup + learning curve |
| Config frameworks | Meta-prompting systems that need configuration | Days of tweaking |
| **This repo** | **140 read-and-apply tips, filtered by impact** | **30-60 min** |

We pulled from 17 sources rather than reflecting any single person's setup. When a tip showed up independently in 3+ repos, we flagged it as consensus -- those are the ones worth reading first.

## How to use Claude Code -- quick-start paths

- **Never used it before?** Start at [01 Setup](tips/01-setup.md). You'll be running in 10 minutes.
- **Know the basics?** Read the [Top 10](#top-10-claude-code-tips-community-consensus) below -- that's 5 minutes and covers most of what matters.
- **Just need a command reference?** Open the [Claude Code cheat sheet](cheatsheet.md).
- **Want Claude to learn these patterns?** Feed it [llms.txt](llms.txt) at the start of a session.

Every tip has a **level** tag (Beginner / Intermediate / Advanced / Expert) and an **impact** rating so you can skip what you already know. Most people only need the Beginner and Intermediate content -- about 30 minutes of reading.

---

## Claude Code shortcuts and commands (quick reference)

| Shortcut | What it does |
|----------|-------------|
| `Shift+Tab` (x2) | Enter Plan Mode -- plan before coding |
| `/compact` | Compress conversation to save context window |
| `/clear` | Wipe conversation and start fresh |
| `Esc` | Cancel Claude's current response |
| `claude -c` | Continue your most recent conversation |
| `claude --add-dir ../repo` | Add another directory to context |
| `"ultrathink"` | Trigger extended reasoning on hard problems |

Full list in the [Claude Code cheat sheet](cheatsheet.md) -- all commands, flags, and keyboard shortcuts.

---

## Complete Claude Code tutorial -- all sections

| # | Section | Tips | What's in it |
|---|---------|------|--------------|
| 01 | [Setup](tips/01-setup.md) | 8 | Installation, config, shell integration, model selection |
| 02 | [CLAUDE.md Mastery](tips/02-claude-md.md) | 10 | Project memory file, structure, cascading configs, conventions |
| 03 | [Context Management](tips/03-context-management.md) | 12 | Context window limits, /compact, /clear, session hygiene, token tracking |
| 04 | [Commands & Shortcuts](tips/04-commands-and-shortcuts.md) | 10 | Slash commands, keyboard shortcuts, CLI flags |
| 05 | [Git & GitHub](tips/05-git-and-github.md) | 8 | Worktrees, PRs, commits, branch workflows |
| 06 | [Prompting](tips/06-prompting.md) | 10 | Declarative prompting tips, thinking triggers, constraint prompts |
| 07 | [Planning & Specs](tips/07-planning-and-specs.md) | 10 | Plan mode, spec-driven dev, interview pattern, iteration |
| 08 | [Testing & Verification](tips/08-testing-and-verification.md) | 8 | Feedback loops, TDD with Claude, linter integration |
| 09 | [Multi-Agent](tips/09-multi-agent.md) | 10 | Subagents, parallel sessions, orchestration, task splitting |
| 10 | [Hooks & Automation](tips/10-hooks-and-automation.md) | 10 | Pre/post hooks, file watchers, CI integration |
| 11 | [MCP, Skills & Plugins](tips/11-mcp-skills-plugins.md) | 8 | MCP servers, custom skills, tool permissions |
| 12 | [Performance & Cost](tips/12-performance-and-cost.md) | 12 | Token optimization, caching, model routing, cost tracking |
| 13 | [Advanced Patterns](tips/13-advanced-patterns.md) | 10 | Meta-prompting, self-improving workflows, expert techniques |
| 14 | [Deep Cuts](tips/14-internals.md) | 14 | Undocumented behaviors, character limits, cache zones, agent types, compaction |
| -- | [Cheat sheet](cheatsheet.md) | -- | Quick-reference tables for commands and shortcuts |

About 60 minutes cover-to-cover. Most people only need the beginner and intermediate sections, which takes closer to 30.

---

## Top 10 Claude Code tips (community consensus)

These showed up independently in 3+ repos. If you read nothing else, read these.

| # | Tip | Level | Why it matters |
|---|-----|-------|----------------|
| 1 | [Start with Plan Mode](tips/07-planning-and-specs.md) | Beginner | `Shift+Tab` twice. Plan first, code second. Saves you from building the wrong thing. |
| 2 | [Give Claude feedback loops](tips/08-testing-and-verification.md) | Beginner | Put test/lint commands in CLAUDE.md. Claude catches its own mistakes instead of you catching them later. |
| 3 | [Git worktrees for parallel work](tips/05-git-and-github.md) | Intermediate | Three Claude sessions, three branches, zero waiting. |
| 4 | [Invest in CLAUDE.md](tips/02-claude-md.md) | Beginner | Every correction you add carries forward. Five minutes now saves you from repeating yourself for months. |
| 5 | [Guard your context window](tips/03-context-management.md) | Intermediate | `/clear` between tasks, `/compact` at milestones. Treat context like RAM. |
| 6 | [Use subagents for research](tips/09-multi-agent.md) | Advanced | Offload file-reading to a subagent. Only the summary comes back to your main session. |
| 7 | [Describe outcomes, not steps](tips/06-prompting.md) | Beginner | Tell Claude *what* you want, not which file to open. It has the full codebase. |
| 8 | [Let Claude interview you first](tips/07-planning-and-specs.md) | Intermediate | 15 minutes of questions before coding beats 2 hours of rework after. |
| 9 | [Trigger deeper thinking](tips/06-prompting.md) | Intermediate | "ultrathink" and "think step by step" activate extended reasoning when the default isn't enough. |
| 10 | [Keep sessions short](tips/03-context-management.md) | Beginner | 10-30 minute sessions with clear goals. Long sessions drift. |

Each row links to the full tip with the problem, solution, and code.

---

## Sources

Every tip traces back to a public repo. See [SOURCES.md](SOURCES.md) for the full list with star counts and which tips came from where.

## Contributing

Found something wrong, or have a tip worth adding? See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
