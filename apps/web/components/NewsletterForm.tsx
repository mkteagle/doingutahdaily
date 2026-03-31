"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

interface NewsletterFormProps {
  variant?: "dark" | "light";
  className?: string;
}

export function NewsletterForm({
  variant = "dark",
  className = "",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");
      setResult(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl ${
          variant === "dark"
            ? "bg-sage/15 border border-sage/25 text-sand"
            : "bg-sage/10 border border-sage/20 text-foreground"
        } ${className}`}
      >
        <CheckCircle2 size={16} className="text-sage shrink-0" />
        <span className="text-sm font-medium">{result}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className={`flex-1 px-5 py-3.5 rounded-xl text-sm focus:outline-none transition-all ${
            variant === "dark"
              ? "bg-white/10 border border-white/15 text-sand placeholder:text-sand/40 focus:border-canyon/50 focus:bg-white/[0.12]"
              : "bg-sand border border-border/60 text-foreground placeholder:text-muted-foreground/50 focus:border-canyon/40"
          }`}
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-7 py-3.5 rounded-xl bg-canyon text-white font-semibold text-sm hover:bg-canyon-deep transition-colors whitespace-nowrap disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin mx-auto" />
          ) : (
            "Subscribe Free"
          )}
        </button>
      </form>
      {error && (
        <p className="text-destructive text-xs mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
