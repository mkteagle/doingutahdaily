"use client";

import DOMPurify from "dompurify";
import { marked } from "marked";
import { serializeDom } from "crucible-ui/mdx";
import { useEffect, useRef, useState } from "react";

export function storyHtml(markdown: string) {
  return cleanStoryHtml(marked.parse(markdown, { async: false }));
}

function cleanStoryHtml(html: string) {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["style", "form", "input", "button", "iframe"],
    FORBID_ATTR: ["style"],
  });
}

const formats = [
  { label: "Bold", command: "bold" },
  { label: "Italic", command: "italic" },
  { label: "Heading", command: "formatBlock", value: "h2" },
  { label: "Bullet list", command: "insertUnorderedList" },
  { label: "Numbered list", command: "insertOrderedList" },
  { label: "Quote", command: "formatBlock", value: "blockquote" },
];

export function VisualStoryEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editable = useRef<HTMLDivElement>(null);
  const lastValue = useRef<string | null>(null);
  const linkSelection = useRef<Range | null>(null);
  const [addingLink, setAddingLink] = useState(false);
  const [url, setUrl] = useState("");
  const [linkError, setLinkError] = useState("");

  useEffect(() => {
    if (editable.current && value !== lastValue.current) {
      editable.current.innerHTML = storyHtml(value);
      lastValue.current = value;
    }
  }, [value]);

  function changed() {
    if (!editable.current) return;
    lastValue.current = serializeDom(editable.current);
    onChange(lastValue.current);
  }

  function format(command: string, value?: string) {
    const selection = window.getSelection();
    if (!editable.current?.contains(selection?.anchorNode ?? null)) editable.current?.focus();
    document.execCommand(command, false, value);
    changed();
  }

  function startLink() {
    const selection = window.getSelection();
    if (!selection?.rangeCount || !editable.current?.contains(selection.anchorNode)) return;
    linkSelection.current = selection.getRangeAt(0).cloneRange();
    setUrl("");
    setLinkError("");
    setAddingLink(true);
  }

  function addLink() {
    const href = url.trim();
    if (!/^https?:\/\/[^\s]+$/i.test(href) && !/^\/(?!\/)[^\s]*$/.test(href)) {
      setLinkError("Enter a web address beginning with https:// or a site path.");
      return;
    }
    if (linkSelection.current && editable.current?.contains(linkSelection.current.startContainer)) {
      editable.current.focus();
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(linkSelection.current);
      if (linkSelection.current.collapsed) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = href;
        document.execCommand("insertHTML", false, link.outerHTML);
        changed();
      } else {
        format("createLink", href);
      }
    }
    setAddingLink(false);
  }

  return (
    <div className="visual-story-editor">
      <div role="toolbar" aria-label="Text formatting" className="visual-story-toolbar">
        {formats.map(({ label, command, value }) => (
          <button key={label} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => format(command, value)}>
            {label}
          </button>
        ))}
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={startLink}>Link</button>
      </div>
      {addingLink && (
        <div className="visual-story-link">
          <label>Link address <input autoFocus value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => {
            if (event.key === "Escape") setAddingLink(false);
            if (event.key === "Enter") {
              event.preventDefault();
              addLink();
            }
          }} /></label>
          <button type="button" onClick={addLink}>Add link</button>
          <button type="button" onClick={() => setAddingLink(false)}>Cancel</button>
          {linkError && <p role="alert">{linkError}</p>}
        </div>
      )}
      <div
        ref={editable}
        className="visual-story-content"
        role="textbox"
        aria-multiline="true"
        aria-label="Story text"
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Start writing your story…"
        onInput={changed}
        onPaste={(event) => {
          event.preventDefault();
          const html = event.clipboardData.getData("text/html");
          if (html) {
            document.execCommand("insertHTML", false, cleanStoryHtml(html));
          } else {
            document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
          }
          changed();
        }}
      />
    </div>
  );
}
