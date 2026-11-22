import DOMPurify from "dompurify";
import { fromDom } from "hast-util-from-dom";
import { toMdast } from "hast-util-to-mdast";
import { marked } from "marked";
import { gfmToMarkdown } from "mdast-util-gfm";
import { toMarkdown } from "mdast-util-to-markdown";

const publicSite = "https://www.doingutahdaily.com";

function isSitePath(value: unknown): value is string {
  return typeof value === "string" && /^\/(?![/\\])/.test(value);
}

export function cleanStoryHtml(html: string) {
  const fragment = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["style", "form", "button", "iframe", "select", "textarea"],
    FORBID_ATTR: ["style", "contenteditable", "autofocus", "data-story-source", "srcset"],
    RETURN_DOM_FRAGMENT: true,
  });
  for (const input of fragment.querySelectorAll("input")) {
    if (input.type === "checkbox" && input.closest("li")) {
      input.disabled = true;
    } else {
      input.remove();
    }
  }
  for (const image of fragment.querySelectorAll("img")) {
    const source = image.getAttribute("src");
    if (isSitePath(source)) {
      image.dataset.storySource = source;
      image.src = new URL(source, publicSite).href;
    }
  }
  const container = document.createElement("div");
  container.append(fragment);
  return container.innerHTML;
}

export function storyHtml(markdown: string) {
  return cleanStoryHtml(marked.parse(markdown, { async: false, gfm: true }));
}

export function storyMarkdown(editor: HTMLElement) {
  if (!editor.textContent?.trim() && !editor.querySelector("img, hr, table")) return "";

  const tree = fromDom(editor, {
    afterTransform(_node, result) {
      if (result.type !== "element" || result.tagName !== "img") return;
      const originalSource = result.properties.dataStorySource;
      if (isSitePath(originalSource)) result.properties.src = originalSource;
    },
  });
  if (tree.type !== "element") return "";
  const markdown = toMdast({ type: "root", children: tree.children }, {
    document: true,
    newlines: true,
  });
  return toMarkdown(markdown, {
    bullet: "-",
    emphasis: "*",
    fences: true,
    extensions: [gfmToMarkdown()],
  }).trimEnd();
}
