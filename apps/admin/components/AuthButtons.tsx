"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { authClient } from "@/lib/authClient";

export function LoginButtons({ providers }: { providers: ("google" | "apple")[] }) {
  const [message, setMessage] = useState("");

  async function signIn(provider: "google" | "apple") {
    setMessage("");
    const { error } = await authClient.signIn.social({ provider, callbackURL: "/", errorCallbackURL: "/sign-in" });
    if (error) setMessage("Sign-in couldn’t be started. Try again or use another sign-in method.");
  }

  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <button key={provider} type="button" className="admin-secondary w-full"
          onClick={() => void signIn(provider)}>
          <LogIn size={16} aria-hidden />
          Continue with {provider === "google" ? "Google" : "Apple"}
        </button>
      ))}
      {message && <p className="text-sm" role="alert">{message}</p>}
    </div>
  );
}
