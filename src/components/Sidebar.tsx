import { NavLink } from "react-router-dom";
import { tips } from "../content";
import { useMemo } from "react";
import {
  House,
  Wrench,
  FileCode,
  Stack,
  Terminal,
  GitBranch,
  ChatText,
  MapTrifold,
  TestTube,
  UsersThree,
  Lightning,
  Storefront,
  Plugs,
  Gauge,
  ShieldCheck,
  BracketsCurly,
  ListChecks,
  Package,
  Books,
  Sun,
  Moon,
  MagnifyingGlass,
  GithubLogo,
  Star,
  type IconProps,
} from "@phosphor-icons/react";

type PhosphorIcon = React.ComponentType<IconProps>;

const slugIcon: Record<string, PhosphorIcon> = {
  "readme": House,
  "01-setup": Wrench,
  "02-claude-md": FileCode,
  "03-context-management": Stack,
  "04-commands-and-shortcuts": Terminal,
  "05-git-and-github": GitBranch,
  "06-prompting": ChatText,
  "07-planning-and-specs": MapTrifold,
  "08-testing-and-verification": TestTube,
  "09-multi-agent": UsersThree,
  "10-hooks-and-automation": Lightning,
  "11-skills-and-marketplace": Storefront,
  "12-mcp-and-tools": Plugs,
  "13-performance-and-cost": Gauge,
  "14-security": ShieldCheck,
  "15-advanced-patterns": BracketsCurly,
  "cheatsheet": ListChecks,
  "plugins": Package,
  "sources": Books,
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  dark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
}

function useSectionedTips() {
  return useMemo(() => {
    const seen = new Set<string>();
    const groups: { section: string; items: typeof tips }[] = [];

    for (const tip of tips) {
      const section = tip.section || "Guide";
      if (!seen.has(section)) {
        seen.add(section);
        groups.push({ section, items: [] });
      }
      groups[groups.length - 1].items.push(tip);
    }
    return groups;
  }, []);
}

export default function Sidebar({ open, onClose, dark, onToggleTheme, onOpenSearch }: SidebarProps) {
  const sections = useSectionedTips();

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[260px] bg-notion-sidebar border-r border-notion-border
        flex flex-col
        transition-transform lg:transition-none
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      aria-label="Main navigation"
    >
      {/* Header: Branding */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightning size={16} weight="fill" className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" aria-hidden="true" />
            <div className="leading-none">
              <span className="text-[0.8125rem] font-extrabold tracking-tight text-notion-text">
                Ultra Instinct
              </span>
              <span className="block text-[0.625rem] font-bold tracking-[0.08em] uppercase text-notion-secondary mt-0.5">
                Claude Code
              </span>
            </div>
          </div>
          <button
            onClick={onToggleTheme}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-notion-secondary hover:bg-notion-hover hover:text-notion-text transition-colors"
          >
            {dark ? <Sun size={14} weight="bold" /> : <Moon size={14} weight="bold" />}
          </button>
        </div>

        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border border-notion-border bg-notion-bg/50 text-notion-secondary text-[0.75rem] hover:border-notion-secondary/30 transition-colors"
        >
          <MagnifyingGlass size={13} aria-hidden="true" />
          <span className="flex-1 text-left">Search tips...</span>
          <kbd className="text-[0.625rem] font-mono opacity-50">Ctrl K</kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4" aria-label="Tips navigation">
        {sections.map(({ section, items }, groupIndex) => (
          <div key={section} className={groupIndex > 0 ? "mt-5" : ""}>
            <div className="text-[0.6875rem] font-semibold text-notion-secondary uppercase tracking-wider px-2 mb-1">
              {section}
            </div>
            {items.map((tip) => {
              const Icon = slugIcon[tip.slug];
              return (
                <NavLink
                  key={tip.slug}
                  to={`/${tip.slug}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2 min-h-[2.75rem] rounded-lg text-[0.8125rem] transition-colors ${
                      isActive
                        ? "bg-notion-hover text-notion-text font-medium"
                        : "text-notion-secondary hover:bg-notion-hover hover:text-notion-text"
                    }`
                  }
                >
                  {Icon && (
                    <Icon size={15} className="shrink-0 opacity-60" aria-hidden="true" />
                  )}
                  <span className="truncate">{tip.title}</span>
                  {tip.count && (
                    <span className="ml-auto text-[0.6875rem] font-medium text-notion-secondary tabular-nums bg-notion-hover rounded px-1.5 py-0.5 shrink-0">
                      {tip.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* GitHub card */}
      <div className="px-3 pb-2">
        <a
          href="https://github.com/infiniV/ultra-instinct-claude-code"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-notion-border bg-notion-bg/50 hover:border-notion-secondary/40 hover:bg-notion-hover transition-colors group"
        >
          <GithubLogo size={18} weight="fill" className="shrink-0 text-notion-secondary group-hover:text-notion-text transition-colors" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <span className="block text-[0.75rem] font-semibold text-notion-text leading-tight">
              Star on GitHub
            </span>
            <span className="block text-[0.625rem] text-notion-secondary leading-tight mt-0.5">
              Help others discover these tips
            </span>
          </div>
          <Star size={14} weight="fill" className="shrink-0 text-amber-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
        </a>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-notion-border text-[0.6875rem] text-notion-secondary">
        140 tips curated from 17+ repos
      </div>
    </aside>
  );
}
