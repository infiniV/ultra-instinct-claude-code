import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import remarkRewriteLinks from "./src/remark-rewrite-links";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      enforce: "pre" as const,
      ...mdx({
        format: "md",
        mdExtensions: [".md"],
        mdxExtensions: [".mdx"],
        remarkPlugins: [remarkGfm, remarkRewriteLinks],
        rehypePlugins: [rehypeSlug, rehypeHighlight],
      }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],
});
