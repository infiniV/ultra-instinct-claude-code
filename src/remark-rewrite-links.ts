import { visit } from "unist-util-visit";
import type { Root, Link } from "mdast";

/**
 * Remark plugin that rewrites markdown file links to app routes.
 * e.g. `tips/03-context-management.md` → `/03-context-management`
 *      `cheatsheet.md` → `/cheatsheet`
 *      `SOURCES.md` → `/sources`
 */
export default function remarkRewriteLinks() {
  return (tree: Root) => {
    visit(tree, "link", (node: Link) => {
      const url = node.url;

      // Skip external links and anchors
      if (url.startsWith("http") || url.startsWith("#") || url.startsWith("mailto:")) {
        return;
      }

      // README.md or ../README.md → /readme
      if (url === "README.md" || url === "../README.md") {
        node.url = "/readme";
        return;
      }

      // tips/01-setup.md → /01-setup
      const tipMatch = url.match(/^(?:\.\.\/)?(?:tips\/)?(.+)\.md$/);
      if (tipMatch) {
        const name = tipMatch[1];
        // Map known top-level files
        if (name === "cheatsheet" || name === "Cheatsheet") {
          node.url = "/cheatsheet";
          return;
        }
        if (name === "SOURCES") {
          node.url = "/sources";
          return;
        }
        if (name === "CONTRIBUTING") {
          // No app route for this, link to GitHub
          node.url = "https://github.com/infiniV/ultra-instinct-claude-code/blob/main/CONTRIBUTING.md";
          return;
        }
        // Everything else is a tip slug
        node.url = `/${name}`;
        return;
      }
    });
  };
}
