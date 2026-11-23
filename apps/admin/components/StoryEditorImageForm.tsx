"use client";

import { useEffect, useId, useRef, useState } from "react";
import { STORY_IMAGE_BYTES, STORY_IMAGE_TYPES } from "../lib/storyImageLimits";
import { storyImageUrl } from "../lib/storyMarkdown";

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

type Props = {
  uploadImage: (image: Blob) => Promise<string>;
  initialImage?: { url: string; alt: string };
  initialFile?: File;
  onApply: (photo: { url: string; alt: string } | null) => void;
  onCancel: () => void;
};

function isImageUrl(value: string) {
  if (!value || /[\s\\]/.test(value)) return false;
  try {
    const url = new URL(storyImageUrl(value));
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function StoryEditorImageForm({ uploadImage, initialImage, initialFile, onApply, onCancel }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const mounted = useRef(false);
  const titleId = useId();
  const [file, setFile] = useState<File | null>(initialFile ?? null);
  const [alt, setAlt] = useState(initialImage?.alt ?? "");
  const [url, setUrl] = useState(initialImage?.url ?? "");
  const [previewUrl, setPreviewUrl] = useState(initialImage ? storyImageUrl(initialImage.url) : "");
  const [filePreview, setFilePreview] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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
    setPreviewFailed(false);
    return () => URL.revokeObjectURL(source);
  }, [file]);

  function finish(photo: { url: string; alt: string } | null) {
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
    if (!file) {
      if (source !== initialImage?.url && !isImageUrl(source)) {
        setError("Enter an HTTPS image URL or a site path such as /images/photo.jpg.");
        return;
      }
      finish({ url: source, alt: alt.trim() });
      return;
    }
    setUploading(true);
    setError("");
    try {
      const uploadedUrl = await uploadImage(await prepareImage(file));
      if (mounted.current) finish({ url: uploadedUrl, alt: alt.trim() });
    } catch (error) {
      if (!mounted.current) return;
      setError(error instanceof Error ? error.message : "The image couldn’t be uploaded.");
      setUploading(false);
    }
  }

  return (
    <dialog ref={dialog} className="story-editor-image-dialog" aria-labelledby={titleId} aria-busy={uploading}
      onCancel={(event) => { event.preventDefault(); cancel(); }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.target instanceof HTMLInputElement && event.target.type === "text") {
          event.preventDefault();
          void apply();
        }
      }}>
      <div className="story-editor-image-form">
        <h3 id={titleId}>{initialImage ? "Edit image" : "Insert image"}</h3>
        <div className="story-image-preview">
          {(filePreview || (!file && previewUrl)) && !previewFailed ? (
            <img className="story-image-thumbnail" src={file ? filePreview : previewUrl}
              alt={alt || "Selected image"} onError={() => setPreviewFailed(true)} />
          ) : <p className="story-image-hint">{previewFailed ? "Image preview unavailable." : "Image preview"}</p>}
        </div>
        <label>
          {initialImage ? "Replace with a file" : "Upload an image file"}
          <input ref={fileInput} type="file" accept={STORY_IMAGE_TYPES} disabled={uploading}
            onChange={(event) => { setFile(event.target.files?.[0] ?? null); setPreviewFailed(false); setError(""); }} />
          {file && <span className="story-image-hint">{file.name}</span>}
        </label>
        <label>
          Or use an image URL
          <input type="text" inputMode="url" value={url} disabled={uploading} placeholder="https://…"
            onChange={(event) => {
              setUrl(event.target.value);
              setFile(null);
              if (fileInput.current) fileInput.current.value = "";
              setError("");
            }}
            onBlur={() => {
              setPreviewFailed(false);
              setPreviewUrl(isImageUrl(url.trim()) ? storyImageUrl(url.trim()) : "");
            }} />
        </label>
        <label>
          Alt text
          <input type="text" value={alt} maxLength={160} disabled={uploading} placeholder="Briefly describe the photo"
            onChange={(event) => setAlt(event.target.value)} />
        </label>
        {error && <p role="alert">{error}</p>}
        <div className="story-editor-image-actions">
          <button type="button" className="story-image-apply" disabled={(!file && !url.trim()) || uploading} onClick={() => void apply()}>
            {uploading ? "Uploading…" : initialImage ? "Save changes" : "Insert image"}
          </button>
          {initialImage && <button type="button" className="story-image-remove" disabled={uploading} onClick={() => finish(null)}>Remove image</button>}
          <button type="button" disabled={uploading} onClick={cancel}>Cancel</button>
        </div>
      </div>
    </dialog>
  );
}
