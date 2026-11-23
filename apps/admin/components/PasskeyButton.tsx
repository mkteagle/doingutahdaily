"use client";

import { useState } from "react";
import { Fingerprint } from "lucide-react";
import { oauthProviderClient } from "@better-auth/oauth-provider/client";
import { passkeyClient } from "@better-auth/passkey/client";
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({ plugins: [passkeyClient(), oauthProviderClient()] });

export function PasskeyButton({ action }: { action: "authenticate" | "register" }) {
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const registering = action === "register";

  async function usePasskey() {
    if (!window.PublicKeyCredential) {
      setMessage("This browser can’t use passkeys. Try a current browser or use another sign-in method.");
      return;
    }

    setWorking(true);
    setMessage("");
    setSuccess(false);
    try {
      const result = registering ? await authClient.passkey.addPasskey() : await authClient.signIn.passkey();
      if (result?.error) throw new Error("Passkey request failed");
      if (registering) {
        setSuccess(true);
        setMessage("Passkey added. You can use it the next time you sign in.");
      } else if (!result?.data || !("redirect" in result.data && result.data.redirect === true)) {
        window.location.assign("/");
      }
    } catch (error) {
      setMessage(error instanceof DOMException && error.name === "NotAllowedError"
        ? "The passkey prompt was closed. You can try again."
        : "The passkey couldn’t be used. Try again or use another sign-in method.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={() => void usePasskey()} disabled={working}
        className="admin-button w-full disabled:opacity-65">
        <Fingerprint size={18} aria-hidden />
        {working ? "Waiting for your device…" : registering ? "Add a passkey" : "Continue with a passkey"}
      </button>
      {message && <p className="mt-3 text-sm" role={success ? "status" : "alert"}>{message}</p>}
    </div>
  );
}
