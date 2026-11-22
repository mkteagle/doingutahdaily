"use client";

import { signIn, signOut } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";

export function LoginButtons({ providers }: { providers: ("google" | "apple")[] }) {
  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <button key={provider} type="button" className="admin-secondary w-full"
          onClick={() => void signIn(provider, { redirectTo: "/" })}>
          <LogIn size={16} aria-hidden />
          Continue with {provider === "google" ? "Google" : "Apple"}
        </button>
      ))}
    </div>
  );
}

export function LogoutButton() {
  return (
    <button
      onClick={() => void signOut({ callbackUrl: "/sign-in" })}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink/10 px-3 py-2 text-sm text-ink/70 transition hover:bg-sand hover:text-ink"
    >
      <LogOut size={14} />
      Logout
    </button>
  );
}
