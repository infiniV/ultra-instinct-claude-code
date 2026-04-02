# Ultra Instinct Claude Code -- tips, best practices & cheat sheet

<p align="center">
  <img src="public/banner.png" alt="Claude Code tips, best practices, cheat sheet, and tutorial -- learn how to use Claude Code" width="100%" />
</p>

<p align="center">
  <strong>Learn Claude Code in one sitting, not one semester.</strong>
</p>

<p align="center">
  176 tips and best practices for Claude Code -- setup, prompting, context management, CLAUDE.md, skills & plugin marketplace, security, multi-agent workflows, hooks. Pulled from 17 repositories, tagged by difficulty, sorted by impact. Instead of reading five different repos, read this one.
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
| **This repo** | **176 read-and-apply tips, filtered by impact** | **30-60 min** |

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
| 01 | [Setup](tips/01-setup.md) | 11 | Installation, config, model selection, sandbox, custom agents, /init |
| 02 | [CLAUDE.md Mastery](tips/02-claude-md.md) | 14 | Project memory, hierarchy, @imports, character limits, modular rules |
| 03 | [Context Management](tips/03-context-management.md) | 16 | Context window, /compact, handoffs, 3-file pattern, /context diagnostics |
| 04 | [Commands & Shortcuts](tips/04-commands-and-shortcuts.md) | 14 | Slash commands, keyboard shortcuts, /branch, /teleport, session management |
| 05 | [Git & GitHub](tips/05-git-and-github.md) | 8 | Worktrees, PRs, commits, /commit-push-pr, --from-pr |
| 06 | [Prompting](tips/06-prompting.md) | 12 | Declarative prompting, thinking triggers, instruction budgets, assumptions mode |
| 07 | [Planning & Specs](tips/07-planning-and-specs.md) | 13 | Plan mode, interview pattern, vertical slices, confidence checks, design docs |
| 08 | [Testing & Verification](tips/08-testing-and-verification.md) | 11 | Feedback loops, TDD, regression gates, adversarial verification, cross-model QA |
| 09 | [Agents & Orchestration](tips/09-multi-agent.md) | 13 | Subagents, custom agents, agent teams, Ralph loop, model routing |
| 10 | [Hooks & Automation](tips/10-hooks-and-automation.md) | 14 | 22+ hook events, prompt-based hooks, HTTP hooks, safety guards, profiles |
| 11 | [Skills & Marketplace](tips/11-skills-and-marketplace.md) | 10 | Skills, plugin marketplace, custom commands, Context7, skill memory |
| 12 | [MCP & Tools](tips/12-mcp-and-tools.md) | 8 | MCP servers, tool budgets, CLI alternatives, OAuth, tool search |
| 13 | [Performance & Cost](tips/13-performance-and-cost.md) | 15 | Token optimization, caching, PTC, model routing, cost tracking |
| 14 | [Security & Permissions](tips/14-security.md) | 8 | Sandbox, deny rules, credential scrubbing, supply chain, enterprise |
| 15 | [Advanced Patterns](tips/15-advanced-patterns.md) | 9 | Pipelines, self-improvement, sprint workflows, Docker sandbox |
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
