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

      // tips/01-setup.md → /01-setup
      const tipMatch = url.match(/^tips\/(.+)\.md$/);
      if (tipMatch) {
        node.url = `/${tipMatch[1]}`;
        return;
      }

      // cheatsheet.md → /cheatsheet
      if (url === "cheatsheet.md") {
        node.url = "/cheatsheet";
        return;
      }

      // SOURCES.md → /sources
      if (url === "SOURCES.md") {
        node.url = "/sources";
        return;
      }
    });
  };
}
