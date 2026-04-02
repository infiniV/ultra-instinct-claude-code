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

      // Separate hash fragment from the path
      const [path, hash] = url.split("#");
      const suffix = hash ? `#${hash}` : "";

      // README.md or ../README.md → /readme
      if (path === "README.md" || path === "../README.md") {
        node.url = `/readme${suffix}`;
        return;
      }

      // tips/01-setup.md → /01-setup
      const tipMatch = path.match(/^(?:\.\.\/)?(?:tips\/)?(.+)\.md$/);
      if (tipMatch) {
        const name = tipMatch[1];
        // Map known top-level files
        if (name === "cheatsheet" || name === "Cheatsheet") {
          node.url = `/cheatsheet${suffix}`;
          return;
        }
        if (name === "SOURCES") {
          node.url = `/sources${suffix}`;
          return;
        }
        if (name === "CONTRIBUTING") {
          // No app route for this, link to GitHub
          node.url = "https://github.com/infiniV/ultra-instinct-claude-code/blob/main/CONTRIBUTING.md";
          return;
        }
        // Everything else is a tip slug
        node.url = `/${name}${suffix}`;
        return;
      }
    });
  };
}
