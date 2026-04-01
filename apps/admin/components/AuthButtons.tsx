"use client";

import { signIn, signOut } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";

export function LoginButtons({
  callbackUrl = "/",
}: {
  callbackUrl?: string;
}) {
  return (
    <div className="space-y-3">
      <button
        onClick={() => void signIn("google", { callbackUrl })}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm font-medium text-ink transition hover:border-canyon/30 hover:bg-canyon/5"
      >
        <LogIn size={16} />
        Continue with Google
      </button>
      <button
        onClick={() => void signIn("apple", { callbackUrl })}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
      >
        <LogIn size={16} />
        Continue with Apple
      </button>
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
