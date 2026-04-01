# Claude Code Cheatsheet

## Launch & Sessions

| Command | Description |
|---------|-------------|
| `claude` | Start interactive session in current directory |
| `claude "prompt"` | One-shot: run a single prompt and exit |
| `claude -c` | Continue the most recent conversation |
| `claude -c SESSION_ID` | Continue a specific session by ID |
| `claude -r` | Resume last session (restores full context) |
| `claude -p "prompt"` | Non-interactive (pipe mode), outputs result to stdout |
| `claude --model sonnet` | Use a specific model (sonnet, opus, haiku) |
| `claude --model claude-sonnet-4-20250514` | Use a specific model by full ID |
| `claude --add-dir ../other-repo` | Add additional directories to context |
| `claude --system-prompt "..."` | Override system prompt |
| `cat file | claude -p "explain"` | Pipe input into Claude |

## In-Session Commands

| Command | Description |
|---------|-------------|
| `/compact` | Compress conversation to save context window |
| `/compact "focus on auth module"` | Compress with specific focus instructions |
| `/clear` | Wipe conversation history, start fresh |
| `/stats` | Show token usage, cache stats, session info |
| `/usage` | Show current billing/token usage |
| `/copy` | Copy last response to clipboard |
| `/voice` | Toggle voice input mode |
| `/chrome` | Open browser integration |
| `/mcp` | Show MCP server status and tools |
| `/config` | Open configuration |
| `/doctor` | Diagnose common issues |
| `/help` | Show all available commands |

## Context Management

| Action | How |
|--------|-----|
| Enter plan mode | `Shift+Tab` twice (toggles) |
| Compact context | `/compact` or `/compact "instructions"` |
| Clear context | `/clear` |
| Rewind last action | `Esc` `Esc` (double-tap Escape) |
| Check token usage | `/stats` |
| Start fresh session | `Ctrl+C` then `claude` |
| Continue previous | `claude -c` |

## Git Shortcuts

| Task | Command/Approach |
|------|-----------------|
| Create a draft PR | `"Create a draft PR for this branch"` |
| Parallel work with worktrees | `git worktree add ../feature-x feature/x` then `cd ../feature-x && claude` |
| Commit with message | `"Commit these changes with a descriptive message"` |
| Disable co-author attribution | Settings: `"git.attribution": false` |
| Review a PR | `"Review PR #123 and leave comments"` |
| Interactive rebase help | `"Squash the last 3 commits"` |

## Model & Config

| Setting | Location / Command |
|---------|-------------------|
| Global config | `~/.claude/settings.json` |
| Project config | `.claude/settings.json` (in repo root) |
| Project memory | `CLAUDE.md` (repo root) |
| User memory | `~/.claude/CLAUDE.md` |
| Select model at launch | `claude --model sonnet` |
| Select model (full ID) | `claude --model claude-sonnet-4-20250514` |
| Override system prompt | `claude --system-prompt "..."` |

## Tool Permissions

| Flag | Description |
|------|-------------|
| `--allowedTools "Bash,Read,Write"` | Whitelist specific tools |
| `--disallowedTools "Bash"` | Block specific tools |
| In settings.json: `"permissions"` | Configure persistent tool permissions |
| Auto-approve pattern | `"allowedTools": ["Bash(npm test)", "Bash(npm run lint)"]` |
| Trust project settings | `"trust_project_settings": true` in global config |

## Output

| Flag / Command | Description |
|----------------|-------------|
| `--output-format json` | JSON output (for scripting) |
| `--output-format text` | Plain text output |
| `--output-format stream-json` | Streaming JSON output |
| `/copy` | Copy last response to clipboard (in-session) |
| `claude -p "..." \| pbcopy` | Pipe to clipboard (macOS) |
| `claude -p "..." \| wl-copy` | Pipe to clipboard (Wayland) |
| `claude -p "..." \| xclip` | Pipe to clipboard (X11) |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Send message |
| `Shift+Enter` | New line in input |
| `Shift+Tab` | Toggle plan mode (press twice) |
| `Tab` | Autocomplete file paths and commands |
| `Ctrl+C` | Cancel current input / exit |
| `Esc` | Stop generation |
| `Esc` `Esc` | Rewind / undo last action |
| `Up arrow` | Cycle through input history |

## Thinking Triggers

| Trigger | Thinking Depth |
|---------|---------------|
| `"think about this"` | Standard extended thinking |
| `"think harder"` | Deeper reasoning |
| `"think step by step"` | Structured chain-of-thought |
| `"ultrathink"` | Maximum reasoning depth |
| `"think for ten paragraphs"` | Explicit depth control |
