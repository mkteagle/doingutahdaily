"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function InstagramSyncButton({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string }>();

  async function sync() {
    setSyncing(true);
    setResult(undefined);

    try {
      const res = await fetch("/api/social/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Instagram sync failed.");

      setResult({ success: true, message: `Synced ${data.synced} Instagram posts.` });
      router.refresh();
    } catch (error) {
      setResult({ success: false, message: error instanceof Error ? error.message : "Instagram sync failed." });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button type="button" onClick={() => void sync()} disabled={!configured || syncing}
        className="admin-button disabled:cursor-not-allowed disabled:opacity-55">
        <RefreshCw size={16} className={syncing ? "animate-spin" : undefined} aria-hidden />
        {syncing ? "Syncing Instagram…" : "Sync Instagram"}
      </button>
      {result && <p role={result.success ? "status" : "alert"} className={`max-w-xs text-sm ${result.success ? "text-ink" : "text-red-800"}`}>{result.message}</p>}
    </div>
  );
}
