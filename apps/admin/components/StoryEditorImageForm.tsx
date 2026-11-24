"use client";

import {
  maxStoryImageWidth,
  originalStoryImageLayout,
  parseStoryImageRatio,
  parseStoryImageWidth,
  storyImageWidth,
  type StoryImageLayout,
} from "@dud/ui/story-image-layout";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { STORY_IMAGE_BYTES, STORY_IMAGE_TYPES } from "../lib/storyImageLimits";
import { isStoryImageUrl, storyImageUrl } from "../lib/storyImageUrl";

async function prepareImage(file: File) {
  if (file.size <= STORY_IMAGE_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);
    try {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Image resizing is unavailable.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const image = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", .85));
      if (image && image.size <= STORY_IMAGE_BYTES) return image;
    } finally {
      bitmap.close();
    }
  } catch {
    // Unsupported files may fail browser decoding.
  }
  throw new Error("Choose a smaller JPEG, PNG, WebP, or AVIF image.");
}

export type StoryEditorImage = { url: string; alt: string; layout?: StoryImageLayout };
export type LoadStoryImageThumbnail = (url: string) => Promise<{ src: string; width: number; height: number }>;

type Props = {
  uploadImage: (image: Blob) => Promise<string>;
  loadThumbnail?: LoadStoryImageThumbnail;
  purpose?: "inline" | "cover";
  initialImage?: StoryEditorImage;
  initialFile?: File;
  initialUrl?: string;
  onApply: (photo: StoryEditorImage | null) => void;
  onCancel: () => void;
};

const sizeOptions = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "original", label: "Original" },
  { value: "custom", label: "Custom" },
] as const;

const ratioOptions = [
  { value: "", label: "Original" },
  { value: "1:1", label: "Square (1:1)" },
  { value: "4:3", label: "4:3" },
  { value: "3:2", label: "3:2" },
  { value: "16:9", label: "16:9" },
  { value: "custom", label: "Custom" },
];

export function StoryEditorImageForm({ uploadImage, loadThumbnail, purpose = "inline", initialImage, initialFile, initialUrl, onApply, onCancel }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const mounted = useRef(false);
  const titleId = useId();
  const [file, setFile] = useState<File | null>(initialFile ?? null);
  const [alt, setAlt] = useState(initialImage?.alt ?? "");
  const sourceUrl = initialImage?.url ?? initialUrl ?? "";
  const [url, setUrl] = useState(sourceUrl);
  const [previewUrl, setPreviewUrl] = useState(() => storyImageUrl(sourceUrl));
  const [filePreview, setFilePreview] = useState("");
  const [previewImage, setPreviewImage] = useState<{ source: string; width: number; height: number }>();
  const [remotePreview, setRemotePreview] = useState<{
    source: string;
    thumbnail: Awaited<ReturnType<LoadStoryImageThumbnail>> | null;
  }>();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const initialLayout = initialImage?.layout ?? originalStoryImageLayout;
  const initialRatio = initialLayout.ratio ?? "";
  const [size, setSize] = useState(initialLayout.size);
  const [customWidth, setCustomWidth] = useState(initialLayout.size === "custom" ? String(initialLayout.width) : "");
  const [ratioOption, setRatioOption] = useState(ratioOptions.some(({ value }) => value === initialRatio) ? initialRatio : "custom");
  const [customRatio, setCustomRatio] = useState(ratioOption === "custom" ? initialRatio : "");
  const isCover = purpose === "cover";
  const title = isCover ? "Cover image" : initialImage ? "Edit image" : "Insert image";
  const applyLabel = isCover ? "Set cover image" : initialImage ? "Save changes" : title;
  const width = parseStoryImageWidth(customWidth);
  const ratio = parseStoryImageRatio(ratioOption === "custom" ? customRatio : ratioOption);
  const layout: StoryImageLayout | undefined = size === "custom"
    ? width ? { size, width, ratio } : undefined
    : { size, ratio };
  const address = url.trim();
  const resolvedUrl = address && (address === initialImage?.url || isStoryImageUrl(address)) ? storyImageUrl(address) : "";
  const source = file ? filePreview : resolvedUrl === previewUrl ? previewUrl : "";
  const directPreview = previewImage?.source === source ? previewImage : undefined;
  const directFailed = directPreview?.width === 0;
  const thumbnailUrl = directFailed && !file && loadThumbnail ? source : "";
  const thumbnail = remotePreview?.source === thumbnailUrl ? remotePreview.thumbnail : undefined;
  const previewSrc = directFailed ? thumbnail?.src : source;
  const previewFailed = directFailed && (!thumbnailUrl || thumbnail === null);
  const dimensions = thumbnail ?? directPreview;
  const previewLoading = !previewFailed && !dimensions?.width && Boolean(file || resolvedUrl);
  const displayWidth = layout && storyImageWidth(layout);
  const [ratioWidth, ratioHeight] = ratio?.split(":").map(Number) ?? [];
  const naturalRatio = dimensions?.width ? dimensions.width / dimensions.height : undefined;
  const previewRatio = ratio ? ratioWidth / ratioHeight : naturalRatio;
  const previewWidth = displayWidth ?? dimensions?.width;
  const previewScale = isCover || !previewWidth ? 1 : Math.min(1, previewWidth / 720);
  const previewFit = previewRatio ? `min(100%, ${previewRatio * 100}cqh)` : "100%";

  useEffect(() => {
    mounted.current = true;
    const modal = dialog.current;
    modal?.showModal();
    return () => {
      mounted.current = false;
      modal?.close();
    };
  }, []);

  useEffect(() => {
    if (!file) {
      setFilePreview("");
      return;
    }
    const source = URL.createObjectURL(file);
    setFilePreview(source);
    return () => URL.revokeObjectURL(source);
  }, [file]);

  useEffect(() => {
    if (file || !resolvedUrl || previewUrl === resolvedUrl) return;
    const timer = window.setTimeout(() => setPreviewUrl(resolvedUrl), 250);
    return () => window.clearTimeout(timer);
  }, [file, previewUrl, resolvedUrl]);

  useEffect(() => {
    if (!thumbnailUrl || !loadThumbnail) return;
    let current = true;
    void loadThumbnail(thumbnailUrl).then(
      (thumbnail) => { if (current) setRemotePreview({ source: thumbnailUrl, thumbnail }); },
      () => { if (current) setRemotePreview({ source: thumbnailUrl, thumbnail: null }); },
    );
    return () => { current = false; };
  }, [loadThumbnail, thumbnailUrl]);

  function finish(photo: StoryEditorImage | null) {
    dialog.current?.close();
    onApply(photo);
  }

  function cancel() {
    if (uploading) return;
    dialog.current?.close();
    onCancel();
  }

  async function apply() {
    if (uploading) return;
    const source = url.trim();
    if (!file && source !== initialImage?.url && !isStoryImageUrl(source)) {
      setError("Choose a file or enter an HTTPS image URL or site path.");
      return;
    }
    if (!isCover && !layout) {
      setError(`Enter a width between 1 and ${maxStoryImageWidth} pixels.`);
      return;
    }
    if (!isCover && ratioOption === "custom" && !ratio) {
      setError("Enter an aspect ratio as width:height, such as 5:4.");
      return;
    }
    const settings = { alt: alt.trim(), layout: isCover ? undefined : layout };
    if (!file) {
      finish({ url: source, ...settings });
      return;
    }
    setUploading(true);
    setError("");
    try {
      const uploadedUrl = await uploadImage(await prepareImage(file));
      if (mounted.current) finish({ url: uploadedUrl, ...settings });
    } catch (error) {
      if (!mounted.current) return;
      setError(error instanceof Error ? error.message : "The image couldn’t be uploaded.");
      setUploading(false);
    }
  }

  const sourceFields = (
    <div className="story-image-source-fields">
      <div>
        <button type="button" className="story-image-choose-file" disabled={uploading} onClick={() => fileInput.current?.click()}>
          <Upload size={15} aria-hidden />
          Choose file
        </button>
        <input hidden ref={fileInput} type="file" accept={STORY_IMAGE_TYPES} disabled={uploading}
          onChange={(event) => {
            const selected = event.target.files?.[0];
            if (!selected) return;
            setFile(selected);
            setError("");
            event.target.value = "";
          }} />
      </div>
      <label>
        Image URL
        <input type="text" inputMode="url" value={url} disabled={uploading} placeholder="https://…"
          onChange={(event) => {
            setUrl(event.target.value);
            setFile(null);
            setError("");
          }} />
      </label>
    </div>
  );

  return (
    <dialog ref={dialog} className="story-editor-image-dialog" aria-labelledby={titleId} aria-busy={uploading}
      data-cover={isCover || undefined}
      onCancel={(event) => { event.preventDefault(); cancel(); }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.nativeEvent.isComposing && event.target instanceof HTMLInputElement &&
            ["text", "number"].includes(event.target.type)) {
          event.preventDefault();
          void apply();
        }
      }}>
      <header className="story-image-header">
        <h3 id={titleId}>{title}</h3>
        <button type="button" className="story-image-close" aria-label="Close image dialog" disabled={uploading} onClick={cancel}>
          <X size={19} aria-hidden />
        </button>
      </header>
      <div className="story-image-body">
        <div className="story-image-source">
          <div className="story-image-preview">
            {previewSrc && (
              <img key={previewSrc} src={previewSrc} alt=""
                style={{
                  width: `calc(${previewFit} * ${previewScale})`,
                  aspectRatio: previewRatio,
                  visibility: previewLoading ? "hidden" : undefined,
                }}
                onLoad={({ currentTarget: image }) => {
                  if (!thumbnail) setPreviewImage({ source, width: image.naturalWidth, height: image.naturalHeight });
                }}
                onError={() => {
                  if (thumbnail) setRemotePreview({ source, thumbnail: null });
                  else setPreviewImage({ source, width: 0, height: 0 });
                }} />
            )}
            {(previewLoading || !previewSrc) && (
              <p className="story-image-preview-empty" role="status">
                <ImageIcon size={26} aria-hidden />
                {previewLoading ? "Loading preview…" : previewFailed ? "Preview unavailable" : "No image selected"}
              </p>
            )}
          </div>
          {file && <p className="story-image-file-name" title={file.name}>{file.name}</p>}
          {initialFile || initialImage ? (
            <details className="story-image-replace">
              <summary>Replace image</summary>
              {sourceFields}
            </details>
          ) : sourceFields}
        </div>
        {!isCover && <div className="story-image-settings">
          <fieldset className="story-image-sizes" disabled={uploading}>
            <legend>Display size</legend>
            <div className="story-image-size-options">
              {sizeOptions.map(({ value, label }) => (
                <label key={value}>
                  <input type="radio" name={`${titleId}-size`} value={value} checked={size === value}
                    onChange={() => { setSize(value); setError(""); }} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {size === "custom" && <label>
            Width (px)
            <input type="number" min={1} max={maxStoryImageWidth} value={customWidth} disabled={uploading} placeholder="560"
              onChange={(event) => { setCustomWidth(event.target.value); setError(""); }} />
          </label>}
          <label>
            Aspect ratio
            <select value={ratioOption} disabled={uploading}
              onChange={(event) => { setRatioOption(event.target.value); setError(""); }}>
              {ratioOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          {ratioOption === "custom" && <label>
            Custom ratio (width:height)
            <input type="text" value={customRatio} disabled={uploading} placeholder="5:4" maxLength={13}
              onChange={(event) => { setCustomRatio(event.target.value); setError(""); }} />
          </label>}
          <label>
            Alt text
            <input type="text" value={alt} maxLength={160} disabled={uploading} placeholder="Briefly describe the photo"
              onChange={(event) => setAlt(event.target.value)} />
          </label>
        </div>}
        {error && <p role="alert">{error}</p>}
      </div>
      <footer className="story-editor-image-actions">
        {initialImage && <button type="button" className="story-image-remove" disabled={uploading} onClick={() => finish(null)}>
          {isCover ? "Remove cover image" : "Remove image"}
        </button>}
        <div>
          <button type="button" disabled={uploading} onClick={cancel}>Cancel</button>
          <button type="button" className="story-image-apply" disabled={(!file && !url.trim()) || uploading} onClick={() => void apply()}>
            {uploading ? "Uploading…" : applyLabel}
          </button>
        </div>
      </footer>
    </dialog>
  );
}
