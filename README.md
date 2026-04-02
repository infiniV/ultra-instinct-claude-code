# Ultra Instinct Claude Code

<p align="center">
  <img src="public/banner.png" alt="Ultra Instinct Claude Code" width="100%" />
</p>

<p align="center">
  <strong>140 Claude Code tips pulled from 17 repos (130k+ combined stars). Read them here or on the <a href="https://ultra-instinct-claude-code.vercel.app/">web app</a>.</strong>
</p>

<p align="center">
  <a href="https://ultra-instinct-claude-code.vercel.app/">Web app</a> &middot;
  <a href="cheatsheet.md">Cheatsheet</a> &middot;
  <a href="llms.txt">llms.txt</a> &middot;
  <a href="SOURCES.md">Sources</a>
</p>

---

## Where to start

If you're new, open [01 Setup](tips/01-setup.md). If you just want commands to copy-paste, open the [Cheatsheet](cheatsheet.md). Otherwise, pick a section from the table below or hit Ctrl+F.

Every tip has a level tag (Beginner / Intermediate / Advanced / Expert) so you can skip what you already know.

## All sections

| # | Section | Tips | What's in it |
|---|---------|------|--------------|
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
| -- | [Cheatsheet](cheatsheet.md) | -- | Quick-reference tables for commands and shortcuts |

140 tips across 14 sections, plus a cheatsheet.

---

## Top 10 (community consensus)

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

Each row links to the full tip with problem/solution/code.

---

## Sources

All tips are sourced. See [SOURCES.md](SOURCES.md) for the full list of repos, star counts, and which tips came from where.

## Contributing

Found a mistake or have a tip to add? See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
