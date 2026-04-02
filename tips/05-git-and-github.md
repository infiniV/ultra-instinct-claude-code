[Home](../README.md) > 05 Git & GitHub

# 05 Git & GitHub

### #05.01 Let Claude Handle Commits

> **Level:** Beginner | **Impact:** Medium

**Problem:** Writing commit messages manually breaks your flow and wastes time.

**Do this:**
```
# In .claude/settings.json
{
  "permissions": {
    "allow": ["Bash(git pull:*)", "Bash(git add:*)", "Bash(git commit:*)"],
    "deny": ["Bash(git push:*)"]
  }
}
```

**Why:** Claude writes accurate commit messages from diffs while the deny rule on push keeps you in control of what goes remote.

---

### #05.02 Draft PRs for Safe Review

> **Level:** Beginner | **Impact:** Medium

**Problem:** Claude-created PRs can accidentally get merged before you review them.

**Do this:**
```bash
gh pr create --draft --title "feat: add user auth" --body "Claude-generated PR"
# Review, then mark ready:
gh pr ready
```

**Why:** Draft PRs let Claude do the busywork while you retain a human gate before merge.

---

### #05.03 Git Worktrees for Parallel Sessions

> **Level:** Intermediate | **Impact:** High

**Problem:** One Claude session blocks you while it works, leaving you idle.

**Do this:**
```bash
# Create 3-5 worktrees
git worktree add ../project-a feature-a
git worktree add ../project-b feature-b
git worktree add ../project-c feature-c

# Shell aliases for quick switching
alias za='cd ../project-a && claude'
alias zb='cd ../project-b && claude'
alias zc='cd ../project-c && claude'

# System notification when Claude needs input (add to .claude/settings.json hooks)
# "SessionPause" -> notify-send "Claude needs input in $WORKTREE"
```

**Why:** Running 3-5 parallel Claude sessions across worktrees is the single biggest productivity unlock available.

---

### #05.04 One-Step Branch, Commit, Push, PR

> **Level:** Beginner | **Impact:** High

**Problem:** Creating a branch, committing, pushing, and making a PR is four separate steps.

**Do this:**
```
# Use the built-in plugin command:
/commit-push-pr

# What it does in one shot:
# 1. Creates a branch (if you're on main)
# 2. Commits with a generated message
# 3. Pushes to remote
# 4. Creates a PR with summary and test plan
```

**Why:** Reducing git ceremony from 4 commands to 1 keeps you in flow state instead of doing busywork.

---

### #05.05 Cross-Model Review

> **Level:** Advanced | **Impact:** High

**Problem:** A single model has blind spots it cannot catch in its own output.

**Do this:**
```
1. Claude plans the implementation
2. Codex (or Gemini) reviews the plan
3. Claude implements based on reviewed plan
4. Codex verifies the implementation
```

**Why:** Different models have different failure modes, so cross-model review catches issues that self-review misses.

---

### #05.06 Code Review with Fresh Context

> **Level:** Advanced | **Impact:** High

**Problem:** The Claude session that wrote code is blind to its own context anchoring.

**Do this:**
```bash
# Review a PR from a fresh session with no prior context
claude -p "Review this PR for bugs, edge cases, and design issues: $(gh pr diff 42)"
```

**Why:** A fresh context catches issues the author session is anchored against seeing.

---

### #05.07 No-Squash Merge Hook

> **Level:** Expert | **Impact:** Medium

**Problem:** Squash merges destroy per-commit history that Claude sessions carefully constructed.

**Do this:**
```jsonc
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(gh pr merge*--squash*)",
        "hook": "echo 'BLOCK: Use --merge or --rebase to preserve commit history' && exit 1"
      }
    ]
  }
}
```

**Why:** Preserving individual commits keeps blame history useful and makes future Claude sessions more effective at understanding changes.

---

### #05.08 Resume Sessions Linked to PRs

> **Level:** Intermediate | **Impact:** Medium

**Problem:** You want to continue working on a PR but cannot find the session that created it.

**Do this:**
```bash
# Resume from a PR number:
claude --from-pr 42

# Or from a PR URL:
claude --from-pr https://github.com/org/repo/pull/42

# Sessions are auto-linked when created via gh pr create
```

**Why:** PR-linked sessions preserve full implementation context so you can pick up exactly where you left off.

---

---

[< 04 Commands & Shortcuts](04-commands-and-shortcuts.md) | [Home](../README.md) | [06 Prompting >](06-prompting.md)
