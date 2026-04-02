# Ultra Instinct Claude Code

<p align="center">
  <img src="public/banner.png" alt="Claude Code tips, best practices, cheat sheet, and tutorial -- learn how to use Claude Code" width="100%" />
</p>

<p align="center">
  <strong>Learn Claude Code in one sitting, not one semester.</strong><br/>
  176 tips across 15 sections. Nothing to install. Just read.
</p>

<p align="center">
  <a href="https://ultra-instinct-claude-code.vercel.app/">Browse all tips</a> &middot;
  <a href="cheatsheet.md">Cheat sheet</a> &middot;
  <a href="plugins.md">Plugins & skills</a> &middot;
  <a href="llms.txt">llms.txt</a> &middot;
  <a href="SOURCES.md">Sources</a>
</p>

---

> **Using Claude to read this repo?** Don't load everything. Point it at [`llms.txt`](llms.txt) for a condensed version, or at specific tip files like `tips/01-setup.md`. Each file stands on its own -- Problem, Do this, Why format. No need to ingest the whole thing.

---

## Why we made this

There are dozens of Claude Code repos. Most are either awesome-lists with hundreds of unsorted links, installable toolkits that want you to set up 135 agents before you write a line of code, or meta-prompting frameworks that take days to configure. All of them assume you want to install something.

We just wanted to get better at Claude Code in an afternoon.

So we cloned 17 of the most popular repos, read through all of them, and pulled out what actually matters. When a tip showed up independently in 3+ repos, we paid attention. When it only appeared in one, we were skeptical. The result is 176 tips that survived that filter.

| What's out there | What you get | How long until it's useful |
|---|---|---|
| Awesome-lists | Hundreds of links to sort through | Hours of browsing |
| Agent toolkits | "Install 135 agents, 35 skills, 42 commands" | Setup + learning curve |
| Config frameworks | Meta-prompting systems | Days of tweaking |
| **This repo** | **176 tips you can read and use immediately** | **30 min** |

Full source list with star counts: [SOURCES.md](SOURCES.md).

---

## Where to start

Depends on where you are:

| You are... | Start here | Time |
|---|---|---|
| Never used Claude Code | [01 Setup](tips/01-setup.md) | 10 min to running |
| Know the basics, want to level up | [Top 10 tips](#top-10-tips-community-consensus) below | 5 min |
| Looking for a specific command | [Cheat sheet](cheatsheet.md) | 1 min |
| Teaching Claude these patterns | Feed it [`llms.txt`](llms.txt) | Instant |

Tips are tagged Beginner through Expert and rated by impact (High / Medium / Low). Skip what you already know.

---

## Shortcuts worth memorizing

| Shortcut | What it does |
|---|---|
| `Shift+Tab` (x2) | Plan Mode -- plan before you code |
| `/compact` | Compress conversation context |
| `/clear` | Wipe everything, fresh start |
| `Esc` | Stop Claude mid-response |
| `Ctrl+B` | Background a running command |
| `Ctrl+G` | Open your prompt in an external editor |
| `claude -c` | Pick up your last session |
| `claude --add-dir ../repo` | Give Claude access to another repo |
| `"ultrathink"` | Extended reasoning for hard problems |

Everything else is in the [cheat sheet](cheatsheet.md).

---

## All 15 sections

### Getting started
| # | Section | Tips | What's inside |
|---|---|---|---|
| 01 | [Setup](tips/01-setup.md) | 11 | Install, config, models, sandbox, custom agents, `/init` |
| 02 | [CLAUDE.md Mastery](tips/02-claude-md.md) | 14 | Project memory, hierarchy, `@imports`, char limits, modular rules |

### Core skills
| # | Section | Tips | What's inside |
|---|---|---|---|
| 03 | [Context Management](tips/03-context-management.md) | 16 | Window management, `/compact`, handoffs, the 3-file pattern, `/context` |
| 04 | [Commands & Shortcuts](tips/04-commands-and-shortcuts.md) | 14 | Slash commands, keys, `/branch`, `/teleport`, session management |

### Workflows
| # | Section | Tips | What's inside |
|---|---|---|---|
| 05 | [Git & GitHub](tips/05-git-and-github.md) | 8 | Worktrees, PRs, `/commit-push-pr`, `--from-pr` |
| 06 | [Prompting](tips/06-prompting.md) | 12 | Declarative prompts, thinking triggers, instruction budgets |
| 07 | [Planning & Specs](tips/07-planning-and-specs.md) | 13 | Plan mode, the interview pattern, vertical slices, confidence checks |

### Quality
| # | Section | Tips | What's inside |
|---|---|---|---|
| 08 | [Testing & Verification](tips/08-testing-and-verification.md) | 11 | Feedback loops, TDD, regression gates, cross-model QA |
| 14 | [Security & Permissions](tips/14-security.md) | 8 | Sandbox, deny rules, credential scrubbing, supply chain scanning |

### Multi-agent
| # | Section | Tips | What's inside |
|---|---|---|---|
| 09 | [Agents & Orchestration](tips/09-multi-agent.md) | 13 | Custom agents, agent teams, the Ralph loop, model routing |
| 10 | [Hooks & Automation](tips/10-hooks-and-automation.md) | 14 | 22+ hook events, prompt-based hooks, HTTP hooks, profiles |

### Ecosystem
| # | Section | Tips | What's inside |
|---|---|---|---|
| 11 | [Skills & Marketplace](tips/11-skills-and-marketplace.md) | 10 | Skills, the plugin marketplace, custom commands, Context7 |
| 12 | [MCP & Tools](tips/12-mcp-and-tools.md) | 8 | MCP servers, tool budgets, CLI alternatives, OAuth |

### Optimization
| # | Section | Tips | What's inside |
|---|---|---|---|
| 13 | [Performance & Cost](tips/13-performance-and-cost.md) | 15 | Token optimization, caching, PTC, model routing |
| 15 | [Advanced Patterns](tips/15-advanced-patterns.md) | 9 | Pipelines, self-improvement loops, sprint workflows |

| -- | [Cheat sheet](cheatsheet.md) | -- | Every command, flag, and keyboard shortcut |

---

## Top 10 tips (community consensus)

These showed up independently in 3+ source repos. If you only read 10 things, read these.

| # | Tip | Level | Why it matters |
|---|-----|-------|---|
| 1 | [Plan before you code](tips/07-planning-and-specs.md) | Beginner | `Shift+Tab` twice. The plan is the highest-leverage part. |
| 2 | [Give Claude a feedback loop](tips/08-testing-and-verification.md) | Beginner | Put your test/lint commands in CLAUDE.md. Claude will catch its own mistakes. |
| 3 | [Git worktrees for parallel work](tips/05-git-and-github.md) | Intermediate | 3 Claude sessions, 3 branches, zero waiting. The single biggest productivity unlock. |
| 4 | [Invest in CLAUDE.md](tips/02-claude-md.md) | Beginner | Every correction you add carries forward. Saves you from repeating yourself for months. |
| 5 | [Treat context like RAM](tips/03-context-management.md) | Intermediate | `/clear` between tasks, `/compact` at milestones. Quality drops when context fills up. |
| 6 | [Subagents for exploration](tips/09-multi-agent.md) | Advanced | Offload file-reading to a subagent. Only the summary comes back to your main session. |
| 7 | [Say what, not how](tips/06-prompting.md) | Beginner | Tell Claude the outcome you want. It has the full codebase and can figure out the steps. |
| 8 | [Let Claude interview you first](tips/07-planning-and-specs.md) | Intermediate | 15 minutes of questions before coding beats 2 hours of rework after. |
| 9 | [Trigger deeper thinking](tips/06-prompting.md) | Intermediate | Type "ultrathink" when the default reasoning isn't enough. |
| 10 | [Keep sessions short](tips/03-context-management.md) | Beginner | 10-30 min with a clear goal. Long sessions drift and cost more. |

---

## Sources

Every tip traces back to a public repo. We read through all 17, extracted what worked, and threw away the rest. Full list: [SOURCES.md](SOURCES.md).

## Contributing

Found something wrong or have a tip worth adding? [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
