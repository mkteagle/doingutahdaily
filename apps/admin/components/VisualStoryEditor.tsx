"use client";

import { Bold, ChevronDown, Heading2, Heading3, Heading4, ImagePlus, Italic, Link2, List, ListOrdered, Quote, Redo2, Type, Undo2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { cleanStoryHtml, storyHtml, storyMarkdown } from "../lib/storyMarkdown";
import { StoryEditorImageForm } from "./StoryEditorImageForm";

const inlineFormats = [
  { label: "Bold", command: "bold", icon: Bold },
  { label: "Italic", command: "italic", icon: Italic },
] as const;

const blockStyles = [
  { label: "Paragraph", tag: "p", icon: Type },
  { label: "Heading 2", tag: "h2", icon: Heading2 },
  { label: "Heading 3", tag: "h3", icon: Heading3 },
  { label: "Heading 4", tag: "h4", icon: Heading4 },
] as const;

const blockFormats = [
  { label: "Bullet list", command: "insertUnorderedList", icon: List },
  { label: "Numbered list", command: "insertOrderedList", icon: ListOrdered },
  { label: "Quote", command: "formatBlock", value: "blockquote", icon: Quote },
] as const;

const formats = [...inlineFormats, ...blockFormats];
const slashItems = [
  ...blockStyles.map(({ label, tag, icon }) => ({ label, command: "formatBlock", value: tag, icon })),
  ...blockFormats,
  { label: "Image", command: "image", icon: ImagePlus },
  { label: "Link", command: "link", icon: Link2 },
] as const;

function readSlashTrigger(root: HTMLElement) {
  const selection = window.getSelection();
  if (!selection?.rangeCount || !selection.isCollapsed) return null;
  const range = selection.getRangeAt(0);
  const node = range.startContainer;
  if (!(node instanceof Text) || !root.contains(node) || node.parentElement?.closest("pre,code")) return null;
  const block = node.parentElement?.closest("p,div,h1,h2,h3,h4,h5,h6,li,blockquote") ?? root;
  if (!root.contains(block)) return null;

  const trigger = range.cloneRange();
  trigger.setStart(block, 0);
  const match = /^\/([a-z0-9 -]{0,30})$/i.exec(trigger.toString());
  if (!match) return null;
  const after = range.cloneRange();
  after.setEnd(block, block.childNodes.length);
  return after.toString().trim() ? null : { range: trigger, query: match[1].toLowerCase().trim() };
}

type Props = {
  value: string;
  onChange: (value: string) => void;
  uploadImage: (image: Blob) => Promise<string>;
};

export function VisualStoryEditor({ value, onChange, uploadImage }: Props) {
  const editable = useRef<HTMLDivElement>(null);
  const lastValue = useRef<string | null>(null);
  const editorSelection = useRef<Range | null>(null);
  const imageSelection = useRef<Range | null>(null);
  const slashId = useId();
  const [empty, setEmpty] = useState(!value.trim());
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [blockStyle, setBlockStyle] = useState("p");
  const [slash, setSlash] = useState<{ query: string; index: number; left: number; top: number; above: boolean } | null>(null);
  const [addingImage, setAddingImage] = useState(false);
  const [addingLink, setAddingLink] = useState(false);
  const [url, setUrl] = useState("");
  const [linkError, setLinkError] = useState("");

  useEffect(() => {
    if (editable.current && value !== lastValue.current) {
      editable.current.innerHTML = storyHtml(value);
      lastValue.current = value;
      editorSelection.current = null;
      imageSelection.current = null;
      setEmpty(!editable.current.innerHTML.trim());
      setActiveFormats([]);
      setBlockStyle("p");
      setSlash(null);
      setAddingImage(false);
      setAddingLink(false);
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
      setBlockStyle(blockStyles.find(({ tag }) => tag === block)?.tag ?? "p");
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

  function focusEditor(savedRange?: Range) {
    const root = editable.current;
    const selection = window.getSelection();
    if (!root || !selection) return null;

    const current = selection.rangeCount ? selection.getRangeAt(0) : null;
    const range = savedRange ?? (current && root.contains(current.commonAncestorContainer) ? current : editorSelection.current);
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
    setAddingImage(false);
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

  function startImage() {
    if (addingImage) return;
    const selection = focusEditor();
    if (!selection?.rangeCount) return;
    imageSelection.current = selection.getRangeAt(0).cloneRange();
    imageSelection.current.collapse(false);
    setAddingLink(false);
    setAddingImage(true);
  }

  function closeImage() {
    const range = imageSelection.current;
    imageSelection.current = null;
    setAddingImage(false);
    focusEditor(range ?? undefined);
  }

  function insertImage(url: string, alt: string) {
    const range = imageSelection.current;
    if (!editable.current || !range || !editable.current.contains(range.commonAncestorContainer)) return;
    focusEditor(range);
    const image = document.createElement("img");
    image.src = url;
    image.alt = alt;
    document.execCommand("insertHTML", false, image.outerHTML);
    imageSelection.current = null;
    setAddingImage(false);
    changed();
  }

  const slashMatches = slash ? slashItems.filter(({ label, ...item }) =>
    label.toLowerCase().includes(slash.query) || ("value" in item && item.value === slash.query),
  ) : [];

  function updateSlash(event: Event) {
    const root = editable.current;
    if (!root || !(event instanceof InputEvent) || event.isComposing) return;
    if (!slash && (event.inputType !== "insertText" || event.data !== "/")) return;
    const trigger = readSlashTrigger(root);
    if (!trigger) {
      setSlash(null);
      return;
    }
    const rect = trigger.range.getBoundingClientRect();
    const bounds = root.getBoundingClientRect();
    const above = window.innerHeight - rect.bottom < Math.min(260, window.innerHeight / 2) && rect.top > window.innerHeight / 2;
    setSlash({
      query: trigger.query,
      index: slash?.query === trigger.query ? slash.index : 0,
      left: Math.max(0, Math.min(rect.left - bounds.left, bounds.width - 260)),
      top: (above ? rect.top - 5 : rect.bottom + 5) - bounds.top,
      above,
    });
  }

  function applySlash(item: (typeof slashItems)[number]) {
    const trigger = editable.current && readSlashTrigger(editable.current);
    setSlash(null);
    if (!trigger) return;

    const selection = focusEditor(trigger.range);
    if (!selection) return;
    document.execCommand("delete");
    changed();
    if (item.command === "image") startImage();
    else if (item.command === "link") startLink();
    else format(item.command, "value" in item ? item.value : undefined);
  }

  function handleSlashKey(event: KeyboardEvent<HTMLDivElement>) {
    if (!slash || event.nativeEvent.isComposing) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setSlash(null);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!slashMatches.length) return;
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const index = (slash.index + direction + slashMatches.length) % slashMatches.length;
      setSlash({ ...slash, index });
      document.getElementById(`${slashId}-${index}`)?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && slashMatches[slash.index]) {
      event.preventDefault();
      applySlash(slashMatches[slash.index]);
    } else if (["ArrowLeft", "ArrowRight", "Home", "End", "Tab", "Enter"].includes(event.key)) {
      setSlash(null);
    }
  }

  return (
    <div className="visual-story-editor">
      <div role="group" aria-label="Text formatting" className="visual-story-toolbar">
        <div className="story-editor-history">
          <button type="button" title="Undo" aria-label="Undo" onMouseDown={(event) => event.preventDefault()} onClick={() => format("undo")}><Undo2 size={16} aria-hidden /></button>
          <button type="button" title="Redo" aria-label="Redo" onMouseDown={(event) => event.preventDefault()} onClick={() => format("redo")}><Redo2 size={16} aria-hidden /></button>
        </div>
        <div className="story-block-style">
          <select aria-label="Block style" value={blockStyle}
            onChange={(event) => {
              const tag = event.target.value;
              format("formatBlock", tag);
              setBlockStyle(tag);
            }}>
            {blockStyles.map(({ label, tag }) => <option key={tag} value={tag}>{label}</option>)}
          </select>
          <ChevronDown size={14} aria-hidden />
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
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={startImage}>
          <ImagePlus size={16} aria-hidden />Image
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
      {addingImage && <StoryEditorImageForm uploadImage={uploadImage} onCancel={closeImage} onInsert={insertImage} />}
      <div className="visual-story-writing">
        <div
          ref={editable}
          className="visual-story-content story-prose"
          role="textbox"
          aria-multiline="true"
          aria-label="Story text"
          aria-controls={slash ? slashId : undefined}
          aria-activedescendant={slash && slashMatches[slash.index] ? `${slashId}-${slash.index}` : undefined}
          contentEditable
          suppressContentEditableWarning
          data-empty={empty || undefined}
          data-placeholder="Start writing your story. Type / for commands."
          onInput={(event) => { changed(); updateSlash(event.nativeEvent); }}
          onKeyDown={handleSlashKey}
          onMouseDown={() => setSlash(null)}
          onBlur={() => setSlash(null)}
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
        {slash && (
          <div id={slashId} className="story-slash-menu" role="listbox" aria-label="Story commands"
            data-above={slash.above || undefined} style={{ left: slash.left, top: slash.top }}>
            {slashMatches.length === 0 && <p role="status">No matching commands</p>}
            {slashMatches.map((item, index) => (
              <button key={item.label} id={`${slashId}-${index}`} type="button" role="option" tabIndex={-1}
                aria-selected={index === slash.index}
                onMouseDown={(event) => event.preventDefault()} onClick={() => applySlash(item)}>
                <item.icon size={16} aria-hidden />{item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
