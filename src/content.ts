import { lazy, type ComponentType } from "react";

export interface TipEntry {
  slug: string;
  title: string;
  icon: string;
  section?: string;
  count?: number;
  component: ComponentType;
}

// Import all markdown files at build time using Vite glob
const tipModules = import.meta.glob<{ default: ComponentType }>(
  "../tips/*.md",
  { eager: false }
);

const readmeModule = import.meta.glob<{ default: ComponentType }>(
  "../README.md",
  { eager: false }
);

const cheatsheetModule = import.meta.glob<{ default: ComponentType }>(
  "../cheatsheet.md",
  { eager: false }
);

const sourcesModule = import.meta.glob<{ default: ComponentType }>(
  "../SOURCES.md",
  { eager: false }
);

// Map of file patterns to metadata
const tipMeta: Record<string, { title: string; icon: string; section: string; count: number }> = {
  "01-setup": { title: "Setup", icon: "01", section: "Getting Started", count: 11 },
  "02-claude-md": { title: "CLAUDE.md Mastery", icon: "02", section: "Configuration", count: 14 },
  "03-context-management": { title: "Context Management", icon: "03", section: "Core Skills", count: 16 },
  "04-commands-and-shortcuts": { title: "Commands & Shortcuts", icon: "04", section: "Core Skills", count: 14 },
  "05-git-and-github": { title: "Git & GitHub", icon: "05", section: "Workflows", count: 8 },
  "06-prompting": { title: "Prompting", icon: "06", section: "Workflows", count: 12 },
  "07-planning-and-specs": { title: "Planning & Specs", icon: "07", section: "Workflows", count: 13 },
  "08-testing-and-verification": { title: "Testing & Verification", icon: "08", section: "Quality", count: 11 },
  "09-multi-agent": { title: "Agents & Orchestration", icon: "09", section: "Advanced", count: 13 },
  "10-hooks-and-automation": { title: "Hooks & Automation", icon: "10", section: "Advanced", count: 14 },
  "11-skills-and-marketplace": { title: "Skills & Marketplace", icon: "11", section: "Ecosystem", count: 10 },
  "12-mcp-and-tools": { title: "MCP & Tools", icon: "12", section: "Ecosystem", count: 8 },
  "13-performance-and-cost": { title: "Performance & Cost", icon: "13", section: "Optimization", count: 15 },
  "14-security": { title: "Security & Permissions", icon: "14", section: "Quality", count: 8 },
  "15-advanced-patterns": { title: "Advanced Patterns", icon: "15", section: "Expert", count: 9 },
};

// Build the tips array
export const tips: TipEntry[] = [];

// Add README first
for (const [path, importFn] of Object.entries(readmeModule)) {
  tips.push({
    slug: "readme",
    title: "Overview",
    icon: "\u{1F3E0}",
    section: "Guide",
    component: lazy(importFn),
  });
}

// Add tip files
for (const [path, importFn] of Object.entries(tipModules)) {
  const filename = path.split("/").pop()?.replace(".md", "") || "";
  const meta = tipMeta[filename];
  if (meta) {
    tips.push({
      slug: filename,
      title: meta.title,
      icon: meta.icon,
      section: meta.section,
      count: meta.count,
      component: lazy(importFn),
    });
  }
}

// Add cheatsheet
for (const [path, importFn] of Object.entries(cheatsheetModule)) {
  tips.push({
    slug: "cheatsheet",
    title: "Cheatsheet",
    icon: "\u{1F4CB}",
    section: "Reference",
    component: lazy(importFn),
  });
}

// Add sources
for (const [path, importFn] of Object.entries(sourcesModule)) {
  tips.push({
    slug: "sources",
    title: "Sources",
    icon: "\u{1F4DA}",
    section: "Reference",
    component: lazy(importFn),
  });
}
