[Home](../README.md) > 14 Security & Permissions

# 14 Security & Permissions

### #14.01 Permission Deny Rules for Sensitive Paths

> **Level:** Beginner | **Impact:** High

**Problem:** Claude can read SSH keys, AWS credentials, and .env files unless explicitly blocked.

**Do this:**
```jsonc
// ~/.claude/settings.json
{
  "permissions": {
    "deny": [
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)",
      "Read(~/.gnupg/**)",
      "Read(**/.env*)",
      "Read(**/*credentials*)",
      "Read(**/*secret*)",
      "Bash(curl * | bash)",
      "Bash(wget * | bash)"
    ]
  }
}
```

**Why:** Deny rules prevent accidental exposure of secrets even if a prompt injection tricks Claude into trying to read them.

---

### #14.02 Enable Sandbox Mode

> **Level:** Intermediate | **Impact:** High

**Problem:** You want filesystem and network restrictions without the overhead of Docker containers.

**Do this:**
```jsonc
// In .claude/settings.json
{
  "sandbox": {
    "enabled": true,
    "network": {
      "allowedDomains": ["api.github.com", "registry.npmjs.org"]
    },
    "filesystem": {
      "denyRead": ["~/.ssh/**", "~/.aws/**"],
      "allowWrite": ["./**"]
    },
    "autoAllowBashIfSandboxed": true
  }
}
```

**Why:** Built-in sandboxing restricts file and network access without Docker -- reduces permission prompts while maintaining safety.

---

### #14.03 Scan Skills and Hooks Like Supply Chain Artifacts

> **Level:** Intermediate | **Impact:** High

**Problem:** Third-party skills can contain invisible prompt injection or hidden malicious commands.

**Do this:**
```bash
# Scan for zero-width Unicode characters (hidden prompt injection):
rg -nP '[\x{200B}\x{200C}\x{200D}\x{2060}\x{FEFF}]' \
  skills/ hooks/ .claude/ CLAUDE.md

# Scan for suspicious outbound commands:
rg -n 'curl|wget|nc|scp|ssh|ANTHROPIC_BASE_URL' \
  .claude/skills/ .claude/hooks/

# Snyk found prompt injection in 36% of 3,984 public skills
# Treat skills and hooks as supply chain dependencies
```

**Why:** Zero-width characters are invisible in editors but processed by the model -- treat skills and hooks as supply chain artifacts that need auditing.

---

### #14.04 Separate Agent Identity from Personal Accounts

> **Level:** Intermediate | **Impact:** High

**Problem:** Claude runs with YOUR credentials -- a compromised agent with your GitHub token IS you.

**Do this:**
```
# Create separate identities for AI agents:
# - agent@yourdomain.com for email
# - Dedicated bot user for GitHub (with scoped permissions)
# - Separate Slack bot user
# - Scoped API keys with minimum necessary permissions

# Never give agents:
# - Your personal SSH keys
# - Admin-level API tokens
# - Write access to production databases
```

**Why:** Credential isolation means a compromised agent can only affect its scoped resources, not your entire digital identity.

---

### #14.05 Strip Credentials from Subprocesses

> **Level:** Advanced | **Impact:** High

**Problem:** Bash commands, hooks, and MCP servers inherit your shell environment -- including API keys.

**Do this:**
```bash
# Enable environment scrubbing:
export CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1

# This strips Anthropic and cloud provider credentials from:
# - Bash tool invocations
# - Hook script environments
# - MCP server processes

# Prevents accidental credential leakage through subprocesses
```

**Why:** Without scrubbing, every subprocess has access to your API keys -- a malicious hook or MCP server could exfiltrate them.

---

### #14.06 Enterprise Managed Settings

> **Level:** Expert | **Impact:** Medium

**Problem:** You need to enforce security policies across your entire engineering team.

**Do this:**
```jsonc
// managed-settings.json (enforced by policy)
{
  "disableBypassPermissionsMode": "disable",
  "allowManagedPermissionRulesOnly": true,
  "allowManagedHooksOnly": true,
  "permissions": {
    "deny": ["Bash(curl * | bash)", "Read(**/.env*)"]
  }
}

// Drop-in policy fragments:
// managed-settings.d/security-baseline.json
// managed-settings.d/compliance-rules.json
// Fragments merge alphabetically
```

**Why:** Managed settings enforce security policies that individual developers cannot override -- essential for compliance-regulated teams.

---

### #14.07 Never Skip Permissions on Autonomous Loops

> **Level:** Beginner | **Impact:** High

**Problem:** Using `--dangerously-skip-permissions` on automated loops with public repos is the highest-risk anti-pattern.

**Do this:**
```
# NEVER use --dangerously-skip-permissions with:
# - Public or untrusted repositories
# - Root or admin access
# - Direct push access to main/production
# - Autonomous loops (Ralph, pipelines)

# Instead, use granular permissions:
{
  "permissions": {
    "allow": ["Bash(npm test:*)", "Bash(git add:*)", "Bash(git commit:*)"],
    "deny": ["Bash(git push:*)", "Bash(rm -rf:*)"]
  }
}

# CVE-2025-59536 (CVSS 8.7): allowed code execution before trust dialog
# Keep Claude Code updated: claude update
```

**Why:** One unreviewed command in an autonomous loop can delete data, push malicious code, or exfiltrate secrets -- granular permissions are always safer.

---

### #14.08 Kill Process Groups, Not Parents

> **Level:** Expert | **Impact:** Medium

**Problem:** Killing a parent process leaves child processes orphaned, consuming resources or holding ports.

**Do this:**
```javascript
const { spawn } = require('child_process');

const child = spawn('npm', ['run', 'dev'], {
  detached: true  // creates new process group
});

// Kill the entire group (negative PID):
function cleanup() {
  try {
    process.kill(-child.pid, 'SIGKILL');  // note the negative PID
  } catch (e) { /* process already dead */ }
}

// Dead-man switch: if parent stops sending heartbeats, child dies
setInterval(() => {
  try { child.stdin.write('heartbeat\n'); }
  catch (e) { cleanup(); }
}, 30000);
```

**Why:** Negative PID kills the entire process group, preventing orphaned processes that silently consume resources.

---

---

[< 13 Performance & Cost](13-performance-and-cost.md) | [Home](../README.md) | [15 Advanced Patterns >](15-advanced-patterns.md)
