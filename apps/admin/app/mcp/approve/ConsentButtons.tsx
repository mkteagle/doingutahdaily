"use client";

import { useState } from "react";
import { authClient } from "@/lib/authClient";

export function ConsentButtons({ query }: { query: string }) {
  const [working, setWorking] = useState(false);
  const [error, setError] = useState(false);

  async function respond(accept: boolean) {
    setWorking(true);
    setError(false);
    try {
      const { data, error } = await authClient.oauth2.consent({ accept, oauth_query: query });
      if (error || !data?.url) throw new Error("The connection could not be completed.");
      window.location.assign(data.url);
    } catch {
      setError(true);
      setWorking(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="admin-button" disabled={working} onClick={() => void respond(true)}>Allow access</button>
        <button type="button" className="admin-secondary" disabled={working} onClick={() => void respond(false)}>Cancel</button>
      </div>
      {error && <p role="alert" className="text-sm">The connection couldn’t be completed. Try again or reopen it from your app.</p>}
    </div>
  );
}
