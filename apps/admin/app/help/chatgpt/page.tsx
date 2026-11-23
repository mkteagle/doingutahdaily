import type { Metadata } from "next";
import { mcpResource } from "@/auth";
import { CopyText } from "./CopyText";

export const metadata: Metadata = { title: "Connect ChatGPT | Doing Utah Daily Admin" };

export default function ChatGptGuidePage() {
  return (
    <div className="admin-page">
      <div className="max-w-3xl space-y-5">
        <header>
          <h1 className="admin-heading">Connect ChatGPT</h1>
          <p className="mt-2 text-ink/75">Use ChatGPT Work or Codex to co-write drafts and add photos to Doing Utah Daily stories.</p>
        </header>

        <section className="admin-panel p-5 sm:p-6" aria-labelledby="setup-heading">
          <h2 id="setup-heading" className="font-display text-2xl font-semibold">Set up the connection</h2>
          <ol className="mt-4 list-decimal space-y-4 pl-5 leading-relaxed marker:font-semibold">
            <li>In the ChatGPT desktop app, open <strong>Settings → MCP servers → Add server</strong>.</li>
            <li>
              Name the server <code>doing-utah-daily</code> and choose <strong>Streamable HTTP</strong>.
              Paste this URL into the server URL field.
              <div className="mt-2"><CopyText value={mcpResource} label="Copy URL" /></div>
            </li>
            <li>Save, restart the app when prompted, then click <strong>Authenticate</strong> next to the server.</li>
            <li>
              In your browser, sign in with your Doing Utah Daily admin account, then choose <strong>Allow access</strong>.
              You can use your passkey if you’ve set one up.
            </li>
          </ol>
        </section>

        <section className="admin-panel p-5 sm:p-6" aria-labelledby="test-heading">
          <h2 id="test-heading" className="font-display text-2xl font-semibold">Try the connection</h2>
          <p className="mb-3 mt-3">Open a new conversation in Work or Codex and send this prompt.</p>
          <CopyText value="List my Doing Utah Daily drafts." label="Copy prompt" />
          <p className="mt-3 leading-relaxed text-ink/75">
            Ask ChatGPT to open a draft or help you start one. When the story is ready to publish, open it under <strong>Stories</strong> in admin.
          </p>
        </section>

        <details className="admin-panel p-5 sm:p-6">
          <summary className="cursor-pointer font-semibold">If the connection asks for a token</summary>
          <p className="mt-3 leading-relaxed text-ink/75">
            Remove the old Doing Utah Daily entry from MCP settings, add it again with the URL above, then choose <strong>Authenticate</strong>.
          </p>
        </details>
      </div>
    </div>
  );
}
