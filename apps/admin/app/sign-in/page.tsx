import { auth } from "@/auth";
import { LoginButtons } from "@/components/AuthButtons";
import { redirect } from "next/navigation";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user?.email) {
    redirect("/");
  }

  const { error } = await searchParams;
  const message =
    error === "AccessDenied"
      ? "That email address is not allowed to access this admin."
      : null;

  return (
    <div className="min-h-full bg-gradient-to-b from-cream via-sand to-[#F8F3EA] px-4 py-8">
      <div className="mx-auto max-w-md rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(83,54,24,0.08)] backdrop-blur sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-canyon/80">
          Doing Utah Daily
        </p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Admin login</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Sign in with an approved Google or Apple account to access the
          editor and scheduling tools.
        </p>

        {message && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
          </div>
        )}

        <div className="mt-6">
          <LoginButtons />
        </div>

        <p className="mt-5 text-xs leading-5 text-ink/40">
          Access is limited to approved accounts only.
        </p>
      </div>
    </div>
  );
}
