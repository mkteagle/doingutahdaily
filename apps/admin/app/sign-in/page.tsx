import { getAdminSession, passkeysEnabled, signInMethods } from "@/auth";
import { LoginButtons } from "@/components/AuthButtons";
import { PasskeyButton } from "@/components/PasskeyButton";
import { MountainMark } from "@dud/ui/mountain-mark";
import { redirect } from "next/navigation";
import { getMcpOAuthQuery } from "@/lib/mcpOAuthQuery";

export default async function SignInPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const connecting = await getMcpOAuthQuery(params);
  if (!connecting && await getAdminSession()) redirect("/");
  const { error } = params;
  const message = error === "access_denied"
    ? "That account isn’t approved for this workspace."
    : error ? "Sign-in couldn’t be completed. Please try again." : null;

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
      <div className="flex flex-col justify-center gap-4 bg-[#263d2f] px-6 py-9 text-[#f9f3e8] sm:px-12 lg:px-[13%]">
        <MountainMark className="w-24 text-[#eda484] sm:w-36" />
        <p className="font-display text-5xl leading-none sm:text-7xl">Doing Utah Daily</p>
        <a href="https://www.doingutahdaily.com/" className="mt-2 w-fit text-sm underline underline-offset-4">Visit the public site</a>
      </div>
      <div className="grid content-center justify-items-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="admin-heading">Sign in</h1>
          <p className="mb-6 mt-3 text-ink/75">{connecting
            ? "Use your Doing Utah Daily account to continue connecting the story editor."
            : "Use an approved account to open the editorial workspace."}</p>
          {message && <p role="alert" className="mb-5 rounded-lg bg-red-100 p-3 text-sm text-red-800">{message}</p>}
          <div className="space-y-3">
            {passkeysEnabled && <PasskeyButton action="authenticate" />}
            <LoginButtons providers={signInMethods} />
          </div>
        </div>
      </div>
    </div>
  );
}
