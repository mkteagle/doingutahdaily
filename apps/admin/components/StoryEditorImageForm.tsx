"use client";

import { useEffect, useRef, useState } from "react";
import { STORY_IMAGE_BYTES, STORY_IMAGE_TYPES } from "../lib/storyImageLimits";

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
  onInsert: (url: string, alt: string) => void;
  onCancel: () => void;
};

export function StoryEditorImageForm({ uploadImage, onInsert, onCancel }: Props) {
  const mounted = useRef(false);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  async function upload() {
    if (!file || uploading) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(await prepareImage(file));
      if (mounted.current) onInsert(url, alt.trim());
    } catch (error) {
      if (!mounted.current) return;
      setError(error instanceof Error ? error.message : "The image couldn’t be uploaded.");
      setUploading(false);
    }
  }

  return (
    <div className="story-editor-image-form" aria-label="Insert image" aria-busy={uploading} role="group">
      <label>
        Image file
        <input type="file" accept={STORY_IMAGE_TYPES} disabled={uploading} autoFocus
          onChange={(event) => { setFile(event.target.files?.[0] ?? null); setError(""); }} />
      </label>
      <label>
        Alt text
        <input type="text" value={alt} maxLength={160} disabled={uploading} placeholder="Briefly describe the photo"
          onChange={(event) => setAlt(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void upload(); } }} />
      </label>
      <div className="story-editor-image-actions">
        <button type="button" disabled={!file || uploading} onClick={() => void upload()}>
          {uploading ? "Uploading…" : "Insert image"}
        </button>
        <button type="button" disabled={uploading} onClick={onCancel}>Cancel</button>
      </div>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
