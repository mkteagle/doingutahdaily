import { notFound, redirect } from "next/navigation";
import { getAdminSession, passkeysEnabled } from "@/auth";
import { PasskeyButton } from "@/components/PasskeyButton";

export default async function AccountPage() {
  if (!passkeysEnabled) notFound();
  const session = await getAdminSession();
  if (!session) redirect("/sign-in");

  return (
    <div className="admin-page">
      <h1 className="admin-heading">Account security</h1>
      <p className="mb-7 mt-3 text-ink/75">{session.user.email}</p>
      <section className="admin-panel max-w-xl p-6">
        <h2 className="font-display text-3xl">Passkeys</h2>
        <p className="mb-5 mt-2 text-ink/75">
          Add a passkey from a device you use to edit the site. Your device will confirm it’s you the next time you sign in.
        </p>
        <PasskeyButton action="register" />
      </section>
    </div>
  );
}
