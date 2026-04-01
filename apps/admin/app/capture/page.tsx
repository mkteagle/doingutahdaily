"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { POST_CATEGORIES } from "@/lib/postCategories";

export default function CapturePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [supportingNotes, setSupportingNotes] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleCategory(category: string) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!prompt.trim()) {
      setError("Tell me what you want the post to be about first.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/draft-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          supportingNotes,
          categories: selectedCategories,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create draft.");
      }

      router.push(`/posts/${data.post.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create draft."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-cream via-sand to-[#F8F3EA] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_50px_rgba(83,54,24,0.08)] backdrop-blur sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-canyon/10 text-canyon">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-canyon/80">
                Mobile Capture
              </p>
              <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">
                Turn an idea into a draft
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
                Drop in a rough prompt from your phone, add any notes you have,
                and this will create a blog draft in the editor so you can keep
                refining it.
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="prompt"
                className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45"
              >
                What should we write?
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Example: Draft a post about a spring break day in Ogden for families with younger kids. Keep it warm, practical, and local."
                rows={6}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-[#FFFDF9] px-4 py-3 text-base leading-6 text-ink outline-none transition focus:border-canyon/40"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45"
              >
                Notes, links, or source material
              </label>
              <textarea
                id="notes"
                value={supportingNotes}
                onChange={(event) => setSupportingNotes(event.target.value)}
                placeholder="Paste scraped notes, a rough outline, reminders, prices to verify, or anything else the draft should use."
                rows={7}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-[#FFFDF9] px-4 py-3 text-sm leading-6 text-ink outline-none transition focus:border-canyon/40"
              />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">
                Categories
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {POST_CATEGORIES.map((category) => {
                  const active = selectedCategories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${
                        active
                          ? "border-canyon/30 bg-canyon/10 font-medium text-canyon"
                          : "border-ink/10 bg-white text-ink/55"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="rounded-2xl border border-canyon/10 bg-canyon/5 px-4 py-4 text-sm text-ink/70">
              <div className="flex items-center gap-2 font-medium text-canyon">
                <Wand2 size={16} />
                What happens next
              </div>
              <p className="mt-2 leading-6">
                We create a draft post, save it as unpublished, and send you
                straight into the normal post editor for cleanup, fact checks,
                and scheduling.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-canyon px-4 py-3 text-sm font-semibold text-white transition hover:bg-canyon-deep disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating draft...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Create AI Draft
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
