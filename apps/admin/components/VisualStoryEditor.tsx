"use client";

import { Bold, Heading2, Italic, Link2, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cleanStoryHtml, storyHtml, storyMarkdown } from "../lib/storyMarkdown";

const formats = [
  { label: "Bold", command: "bold", icon: Bold },
  { label: "Italic", command: "italic", icon: Italic },
  { label: "Heading", command: "formatBlock", value: "h2", icon: Heading2 },
  { label: "Bullet list", command: "insertUnorderedList", icon: List },
  { label: "Numbered list", command: "insertOrderedList", icon: ListOrdered },
  { label: "Quote", command: "formatBlock", value: "blockquote", icon: Quote },
] as const;

export function VisualStoryEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editable = useRef<HTMLDivElement>(null);
  const lastValue = useRef<string | null>(null);
  const editorSelection = useRef<Range | null>(null);
  const [empty, setEmpty] = useState(!value.trim());
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [addingLink, setAddingLink] = useState(false);
  const [url, setUrl] = useState("");
  const [linkError, setLinkError] = useState("");

  useEffect(() => {
    if (editable.current && value !== lastValue.current) {
      editable.current.innerHTML = storyHtml(value);
      lastValue.current = value;
      editorSelection.current = null;
      setEmpty(!editable.current.innerHTML.trim());
      setActiveFormats([]);
    }
  }, [value]);

  useEffect(() => {
    function trackSelection() {
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;
      const range = selection.getRangeAt(0);
      if (!editable.current?.contains(range.commonAncestorContainer)) return;
      editorSelection.current = range.cloneRange();

      const block = document.queryCommandValue("formatBlock").toLowerCase();
      const active = formats
        .filter((format) => "value" in format ? block === format.value : document.queryCommandState(format.command))
        .map((format) => format.label);
      setActiveFormats((current) =>
        current.length === active.length && current.every((label, index) => label === active[index]) ? current : active,
      );
    }
    document.addEventListener("selectionchange", trackSelection);
    return () => document.removeEventListener("selectionchange", trackSelection);
  }, []);

  function changed() {
    if (!editable.current) return;
    const markdown = storyMarkdown(editable.current);
    if (markdown === lastValue.current) return;
    lastValue.current = markdown;
    setEmpty(!markdown);
    onChange(markdown);
  }

  function focusEditor() {
    const root = editable.current;
    const selection = window.getSelection();
    if (!root || !selection) return null;

    const current = selection.rangeCount ? selection.getRangeAt(0) : null;
    const range = current && root.contains(current.commonAncestorContainer) ? current : editorSelection.current;
    root.focus();
    if (range && root.contains(range.commonAncestorContainer)) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    return selection;
  }

  function format(command: string, value?: string) {
    if (!focusEditor()) return;
    document.execCommand(command, false, value);
    changed();
  }

  function startLink() {
    const selection = focusEditor();
    if (!selection?.rangeCount) return;
    editorSelection.current = selection.getRangeAt(0).cloneRange();
    setUrl("");
    setLinkError("");
    setAddingLink(true);
  }

  function closeLink() {
    setAddingLink(false);
    focusEditor();
  }

  function addLink() {
    const href = url.trim();
    if (!/^https?:\/\/[^\s]+$/i.test(href) && !/^\/(?!\/)[^\s]*$/.test(href)) {
      setLinkError("Enter a web address beginning with https:// or a site path.");
      return;
    }
    const selection = focusEditor();
    if (!selection?.rangeCount) return;
    if (selection.isCollapsed) {
      const link = document.createElement("a");
      link.setAttribute("href", href);
      link.textContent = href;
      document.execCommand("insertHTML", false, link.outerHTML);
    } else {
      document.execCommand("createLink", false, href);
    }
    changed();
    setAddingLink(false);
  }

  return (
    <div className="visual-story-editor">
      <div role="group" aria-label="Text formatting" className="visual-story-toolbar">
        <div className="story-editor-history">
          <button type="button" title="Undo" aria-label="Undo" onMouseDown={(event) => event.preventDefault()} onClick={() => format("undo")}><Undo2 size={16} aria-hidden /></button>
          <button type="button" title="Redo" aria-label="Redo" onMouseDown={(event) => event.preventDefault()} onClick={() => format("redo")}><Redo2 size={16} aria-hidden /></button>
        </div>
        {formats.map((item) => {
          const pressed = activeFormats.includes(item.label);
          return (
            <button key={item.label} type="button" aria-pressed={pressed}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => format(item.command, "value" in item ? (pressed ? "p" : item.value) : undefined)}>
              <item.icon size={16} aria-hidden />{item.label}
            </button>
          );
        })}
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={startLink}>
          <Link2 size={16} aria-hidden />Link
        </button>
      </div>
      {addingLink && (
        <div className="visual-story-link">
          <label>Link address <input autoFocus type="text" inputMode="url" value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => {
            if (event.key === "Escape") closeLink();
            if (event.key === "Enter") {
              event.preventDefault();
              addLink();
            }
          }} /></label>
          <button type="button" onClick={addLink}>Add link</button>
          <button type="button" onClick={closeLink}>Cancel</button>
          {linkError && <p role="alert">{linkError}</p>}
        </div>
      )}
      <div
        ref={editable}
        className="visual-story-content story-prose"
        role="textbox"
        aria-multiline="true"
        aria-label="Story text"
        contentEditable
        suppressContentEditableWarning
        data-empty={empty || undefined}
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
