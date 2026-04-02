[Home](README.md) > Plugins & Skills Directory

# Plugins & Skills Directory

Curated plugins, skills, agents, MCP servers, and tools for Claude Code. Sorted by what they do. Every entry links to its source.

**How to install plugins:** Run `/plugin` inside Claude Code to browse, or use the commands below.

---

## Table of contents

- [Workflow frameworks](#workflow-frameworks)
- [Official Anthropic plugins](#official-anthropic-plugins)
- [Marketplace plugins](#marketplace-plugins)
- [Agent collections](#agent-collections)
- [Component marketplace](#component-marketplace)
- [MCP servers](#mcp-servers)
- [Design & UI](#design--ui)
- [Safety & quality](#safety--quality)
- [Monitoring & cost](#monitoring--cost)
- [Lightweight setups](#lightweight-setups)
- [How to pick](#how-to-pick)

---

## Workflow frameworks

Full workflow systems that reshape how you use Claude Code. Pick one, not all.

### gstack
Garry Tan's virtual engineering team. 23 specialists as slash commands: CEO review, design review, eng review, QA, security audit, ship, deploy. Persistent headless browser with sub-second latency. Operational self-improvement across sessions.

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```
61k+ stars | [GitHub](https://github.com/garrytan/gstack)

---

### Get Shit Done (GSD)
Spec-driven development with context engineering. Solves context rot by giving every agent a fresh window. File-based state that survives /clear. Wave-based parallel execution. Works across Claude Code, Codex, Gemini CLI, Copilot, Cursor.

```bash
npx get-shit-done-cc@latest
```
46k+ stars | [GitHub](https://github.com/gsd-build/get-shit-done)

---

### Everything Claude Code
Performance optimization system. 36 agents, 71 commands, 143 skills. Instinct-based learning, security scanning, continuous improvement. Works across Claude Code, Codex, and other harnesses.

```bash
npx everything-claude-code@latest install --profile full
# Or specific: --profile core | developer | security | research
```
132k+ stars | [GitHub](https://github.com/affaan-m/everything-claude-code)

---

### SuperClaude Framework
30 slash commands, 20 agents, 7 behavioral modes (brainstorming, deep research, token-efficiency). Confidence-first implementation pattern. Optional MCP servers for 30-50% token savings.

```bash
pipx install superclaude && superclaude install
# Optional MCP servers:
superclaude mcp --servers tavily --servers context7
```
22k+ stars | [GitHub](https://github.com/SuperClaude-Org/SuperClaude_Framework)

---

## Official Anthropic plugins

Ship with Claude Code. Install via `/plugin` inside Claude Code.

| Plugin | What it does |
|---|---|
| **code-review** | 5 parallel Sonnet agents check CLAUDE.md compliance, bugs, historical context, PR history. Confidence-scored to filter false positives. |
| **feature-dev** | 7-phase workflow: discovery, codebase exploration (parallel agents), clarifying questions, architecture design, implementation, quality review, summary. |
| **hookify** | Analyzes your conversation for frustration signals and unwanted behaviors, then generates hook rules automatically. Takes effect immediately. |
| **commit-commands** | `/commit`, `/commit-push-pr`, `/clean_gone` for streamlined git workflows. |
| **ralph-wiggum** | Iterative self-referential loops. Stop hook blocks exit, re-feeds the prompt. Best for TDD-style tasks with automatic verification. |
| **pr-review-toolkit** | 6 specialized agents: comment-analyzer, test-analyzer, silent-failure-hunter, type-design-analyzer, code-reviewer, code-simplifier. |
| **frontend-design** | Auto-invoked skill for distinctive UI. Bold aesthetic direction, avoids generic AI look. |
| **security-guidance** | PreToolUse hook monitoring 9 security patterns: command injection, XSS, eval, dangerous HTML, pickle, os.system. |
| **plugin-dev** | 7 expert skills for building your own Claude Code plugins. |
| **skill-creator** | Guide for creating effective skills with proper frontmatter and trigger conditions. |
| **mcp-server-dev** | Skills for building MCP servers and apps. |
| **explanatory-output-style** | Explains the "why" behind implementation choices. SessionStart hook. |
| **learning-output-style** | Interactive learning mode that asks you to make decisions at key points. |
| **claude-md-management** | CLAUDE.md improver skill -- analyzes and optimizes your project instructions. |
| **playground** | Interactive playground for experimenting with Claude Code features. |

Source: [github.com/anthropics/claude-code/plugins](https://github.com/anthropics/claude-code/tree/main/plugins)

---

## Marketplace plugins

Install from the Claude Code plugin marketplace.

### Superpowers
14 workflow skills that add structured discipline to your sessions. Brainstorming before implementation, plan-then-execute, TDD enforcement, systematic debugging, code review (requesting and receiving), verification-before-completion, git worktree management, parallel agent dispatch, and skill writing.

```
/plugin install superpowers
```
[GitHub](https://github.com/anthropics/claude-code) (bundled in official marketplace)

---

### Impeccable
17 design skills for frontend work. Not just "make it pretty" -- structured design operations: `/animate` (purposeful motion), `/bolder` (amplify safe designs), `/quieter` (tone down aggressive ones), `/colorize` (add strategic color), `/polish` (final quality pass), `/critique` (UX evaluation), `/audit` (WCAG + performance), `/harden` (error handling + i18n), `/onboard` (first-time UX), `/adapt` (responsive), `/clarify` (UX copy), `/distill` (remove complexity), `/extract` (design system components), `/normalize` (match design system), `/optimize` (performance), `/delight` (moments of joy), `/frontend-design` (full production UI). Includes `/teach-impeccable` for project setup.

```
/plugin install impeccable
```
[GitHub](https://github.com/nichochar/impeccable)

---

### Severity1 -- Prompt Improver
Catches vague prompts before execution. Researches context, generates clarifying questions, and produces enriched execution guidance. Saves tokens by getting things right on the first try.

```
/plugin install prompt-improver
```
[GitHub](https://github.com/severity1/prompt-improver)

---

### Atlassian Integration
5 skills for Jira and Confluence: generate status reports from Jira issues, search company knowledge bases, capture tasks from meeting notes, convert Confluence specs into Jira backlogs, triage bug reports with duplicate detection.

```
/plugin install atlassian
```

---

### Vercel Plugin
25+ skills for Next.js and Vercel development. Covers: Next.js App Router, AI SDK, Chat SDK, shadcn/ui, Turbopack, routing middleware, Vercel CLI, Functions, storage, deployments/CI-CD, environment variables, caching (PPR + use cache), auth (Clerk/Auth0), Vercel Workflow, and more. Auto-triggers based on what you're working on.

```
/plugin install vercel
```

---

## Agent collections

### VoltAgent Subagents
130+ specialized agents across 10 categories. Each has proper frontmatter with model routing and tool scoping.

```bash
# Plugin marketplace:
claude plugin marketplace add VoltAgent/awesome-claude-code-subagents
claude plugin install voltagent-lang     # Language specialists
claude plugin install voltagent-infra    # Infrastructure & DevOps

# Or install script (no clone needed):
curl -sO https://raw.githubusercontent.com/VoltAgent/awesome-claude-code-subagents/main/install-agents.sh
chmod +x install-agents.sh && ./install-agents.sh
```
16k+ stars | [GitHub](https://github.com/VoltAgent/awesome-claude-code-subagents)

Categories: Core Dev (13), Language Experts (25), Infrastructure (11), QA/Security (10), Data/AI (16), DX (15), Specialized (15), Business (12), Orchestration (8), Research (11).

---

### Awesome Claude Code Toolkit
135 agents, 35 skills, 42 commands, 176+ plugins, 20 hooks. The kitchen sink.

```bash
# Plugin marketplace:
/plugin marketplace add rohitg00/awesome-claude-code-toolkit

# Or one-liner:
curl -fsSL https://raw.githubusercontent.com/rohitg00/awesome-claude-code-toolkit/main/setup/install.sh | bash
```
1k+ stars | [GitHub](https://github.com/rohitg00/awesome-claude-code-toolkit)

---

## Component marketplace

### Claude Code Templates
600+ individual components you can install one at a time. Agents, commands, MCPs, hooks, settings. Interactive browser at [aitmpl.com](https://aitmpl.com).

```bash
# Interactive browser:
npx claude-code-templates@latest

# Install specific components:
npx claude-code-templates@latest --agent development-team/frontend-developer --yes
npx claude-code-templates@latest --command testing/generate-tests --yes
npx claude-code-templates@latest --mcp development/github-integration --yes
npx claude-code-templates@latest --hook git/pre-commit-validation --yes

# Extras:
npx claude-code-templates@latest --analytics       # Usage analytics
npx claude-code-templates@latest --health-check    # Diagnose installation
npx claude-code-templates@latest --chats           # Remote conversation monitor
```
24k+ stars | [GitHub](https://github.com/davila7/claude-code-templates)

---

## MCP servers

Keep total MCP servers under 10. Each tool schema costs ~500 tokens per message.

| Server | What it does | Install |
|---|---|---|
| **Context7** | Live library docs. Fetches current API docs for any framework so Claude doesn't use outdated training data. | `claude mcp add context7 -- npx -y @upstash/context7-mcp@latest` |
| **Playwright** | Browser automation, visual testing, form filling. Uses accessibility tree (structured) not screenshot coordinates. | `claude mcp add -s user playwright -- npx @playwright/mcp@latest` |
| **Sequential Thinking** | Step-by-step reasoning for complex multi-part problems. | `claude mcp add sequential -- npx -y @anthropic/sequential-thinking-mcp` |
| **Excalidraw** | Architecture diagrams and visual planning. Draw system designs Claude can reference. | Via `/plugin` marketplace |
| **Stitch** | Design system management. Create, apply, and maintain design systems and screen designs. | Via `/plugin` marketplace |
| **Canva** | Design creation and editing. Generate designs, manage assets, export formats. | Via `/plugin` marketplace |

---

## Design & UI

### Impeccable (detailed breakdown)

The 17 skills split into clear categories:

**Make it better**
| Skill | What it does |
|---|---|
| `/animate` | Add purposeful animations and micro-interactions that improve usability |
| `/bolder` | Amplify safe/boring designs to be more visually interesting |
| `/colorize` | Add strategic color to monochromatic interfaces |
| `/delight` | Add moments of joy and personality |

**Tone it down**
| Skill | What it does |
|---|---|
| `/quieter` | Tone down overly aggressive designs while keeping quality |
| `/distill` | Strip to essence, remove unnecessary complexity |
| `/clarify` | Improve UX copy, error messages, microcopy, labels |

**Quality assurance**
| Skill | What it does |
|---|---|
| `/audit` | Full audit: accessibility, performance, theming, responsive |
| `/critique` | UX evaluation: visual hierarchy, info architecture, emotional resonance |
| `/polish` | Final pass: alignment, spacing, consistency, details |
| `/harden` | Error handling, i18n, text overflow, edge cases |

**System & adaptation**
| Skill | What it does |
|---|---|
| `/adapt` | Responsive design across screen sizes and devices |
| `/normalize` | Match your design system, ensure consistency |
| `/extract` | Pull reusable components and tokens into your design system |
| `/optimize` | Performance: loading speed, rendering, animations, bundle size |
| `/onboard` | Onboarding flows, empty states, first-time user experience |

**Build from scratch**
| Skill | What it does |
|---|---|
| `/frontend-design` | Full production-grade UI with bold aesthetic direction |
| `/teach-impeccable` | One-time setup: gathers design context for your project |

---

## Safety & quality

### cc-safe-setup
6 essential safety hooks in 10 seconds. Destructive command blocker, branch push protection, secret leak prevention, syntax validation.

```bash
npx cc-safe-setup
```
[GitHub](https://github.com/nicekid1/cc-safe-setup)

---

### Bouncer
Independent quality gate. Gemini audits Claude's output via Stop hook. Quick audit and deep audit modes.

[GitHub](https://github.com/buildingopen/bouncer)

---

### preflight
24-tool MCP server that catches vague prompts before they waste tokens. 12-category scorecards, correction pattern learning, cost estimation.

```bash
npx preflight-dev
```
[GitHub](https://github.com/preflight-dev/preflight)

---

## Monitoring & cost

### ccusage
Analyze Claude Code token usage from local JSONL files. Daily, monthly, session, and billing-window reports. Offline, zero API calls.

```bash
npx ccusage
# Or: npx ccusage sessions --model opus
```
11k+ stars | [GitHub](https://github.com/ryoppippi/ccusage)

---

### Claude Code Audio Notify
Desktop audio notifications when Claude finishes a task or needs input. Never miss a completed response.

```
/plugin install claude-code-audio-notify
```

---

## Lightweight setups

Low token overhead. Good for people who don't want a full framework.

### AwesomeClaude Setup
19 slash commands + 17 shell tools. Only ~300 tokens added to context. NLP code analysis without dependencies.

```bash
curl -sSL https://raw.githubusercontent.com/cassler/awesome-claude-code-setup/main/setup.sh | bash
source ~/.zshrc
```
260+ stars | [GitHub](https://github.com/cassler/awesome-claude-code-setup)

---

## How to pick

| You want... | Install this |
|---|---|
| A full workflow system | gstack or GSD (pick one, not both) |
| Structured dev discipline | Superpowers (brainstorm, plan, TDD, review, verify) |
| Better frontend/UI | Impeccable (17 design skills) |
| More agents | VoltAgent (130+ with proper frontmatter) |
| Individual components | Claude Code Templates (600+, pick what you need) |
| Better code review | Official `code-review` plugin |
| Prompt quality gate | Severity1 prompt-improver |
| Next.js / Vercel | Vercel plugin (25+ auto-triggered skills) |
| Jira / Confluence | Atlassian plugin |
| Safety hooks fast | `npx cc-safe-setup` |
| Token usage tracking | `npx ccusage` |
| Live library docs | Context7 MCP |
| Browser testing | Playwright MCP |
| Architecture diagrams | Excalidraw MCP |

---

[Home](README.md)
