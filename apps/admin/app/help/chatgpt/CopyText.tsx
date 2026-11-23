"use client";

import { useState } from "react";

export function CopyText({ value, label }: { value: string; label: string }) {
  const [message, setMessage] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Copied.");
    } catch {
      setMessage("Select the text to copy it manually.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-ink/15 bg-sand p-2 pl-3">
        <span className="min-w-0 flex-1 break-words text-sm text-ink [overflow-wrap:anywhere]">{value}</span>
        <button type="button" className="admin-secondary shrink-0" onClick={() => void copy()}>{label}</button>
      </div>
      <p role="status" className="text-sm text-ink/75 not-empty:mt-2">{message}</p>
    </div>
  );
}
