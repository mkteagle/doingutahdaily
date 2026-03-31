"use client";

import { useState } from "react";
import {
  Send,
  CheckCircle2,
  MapPin,
  Clock,
  Baby,
  DollarSign,
  Accessibility,
  Loader2,
} from "lucide-react";

const AGE_OPTIONS = [
  { value: "0-2", label: "0–2" },
  { value: "3-5", label: "3–5" },
  { value: "6-8", label: "6–8" },
  { value: "9-11", label: "9–11" },
  { value: "12-14", label: "12–14" },
  { value: "15-17", label: "15–17" },
  { value: "all_ages", label: "All Ages" },
];

const CATEGORY_OPTIONS = [
  "Outdoor Adventures",
  "Indoor Activities",
  "Seasonal Events",
  "Arts & Culture",
  "Food & Dining",
  "Sports & Rec",
  "Educational",
  "Holiday Events",
  "Free Events",
];

export function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    submitterName: "",
    submitterEmail: "",
    submitterRole: "",
    businessName: "",
    title: "",
    description: "",
    address: "",
    city: "",
    website: "",
    phone: "",
    categories: [] as string[],
    ageBands: [] as string[],
    costTier: "",
    isFree: false,
    duration: "",
    parking: "",
    restrooms: false,
    strollerFriendly: false,
    wheelchairAccessible: false,
  });

  const updateField = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleArrayField = (field: "categories" | "ageBands", value: string) =>
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-sand">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-sage/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-sage" />
          </div>
          <h1 className="font-display text-3xl text-ink mb-3">
            Thanks for sharing!
          </h1>
          <p className="font-serif italic text-muted-foreground text-lg mb-2">
            We&apos;ll review your submission and add it to the site once
            we&apos;ve verified the details.
          </p>
          <p className="text-sm text-muted-foreground">
            That means someone on our team will actually go there. Because
            that&apos;s how we roll.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <div className="bg-cream border-b border-border/50">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-canyon mb-2">
            Submit a Spot
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink mb-3">
            Know a great spot?
          </h1>
          <p className="font-serif italic text-muted-foreground text-lg max-w-xl">
            Own a venue, organize events, or just found a hidden gem? Tell us
            about it. We&apos;ll visit, verify, and share it with Utah families.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Your info */}
          <fieldset>
            <legend className="font-display text-lg text-ink mb-4">
              About you
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Your name *
                </label>
                <input
                  type="text"
                  required
                  value={form.submitterName}
                  onChange={(e) => updateField("submitterName", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-cream border border-border/60 text-sm focus:outline-none focus:border-canyon/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={form.submitterEmail}
                  onChange={(e) => updateField("submitterEmail", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-cream border border-border/60 text-sm focus:outline-none focus:border-canyon/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Your role
                </label>
                <select
                  value={form.submitterRole}
                  onChange={(e) => updateField("submitterRole", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-cream border border-border/60 text-sm focus:outline-none focus:border-canyon/40 transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="owner">Venue owner</option>
                  <option value="organizer">Event organizer</option>
                  <option value="visitor">Visitor / local</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Business name
                </label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  placeholder="If applicable"
                  className="w-full px-4 py-3 rounded-xl bg-cream border border-border/60 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-canyon/40 transition-colors"
                />
              </div>
            </div>
          </fieldset>

          {/* Activity details */}
          <fieldset>
            <legend className="font-display text-lg text-ink mb-4">
              The activity
            </legend>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Activity name *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. Bells Canyon Trail, Discovery Gateway Museum"
                  className="w-full px-4 py-3 rounded-xl bg-cream border border-border/60 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-canyon/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Tell us what makes this spot great for families. Be honest — we love the real details."
                  className="w-full px-4 py-3 rounded-xl bg-cream border border-border/60 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-canyon/40 transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-cream border border-border/60 text-sm focus:outline-none focus:border-canyon/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="Salt Lake City"
                    className="w-full px-4 py-3 rounded-xl bg-cream border border-border/60 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-canyon/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Website
                  </label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    placeholder="https://"
                    className="w-full px-4 py-3 rounded-xl bg-cream border border-border/60 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-canyon/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-cream border border-border/60 text-sm focus:outline-none focus:border-canyon/40 transition-colors"
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* Categories & Ages */}
          <fieldset>
            <legend className="font-display text-lg text-ink mb-4">
              Who&apos;s it for?
            </legend>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">
                Age ranges
              </label>
              <div className="flex flex-wrap gap-2">
                {AGE_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleArrayField("ageBands", value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      form.ageBands.includes(value)
                        ? "bg-canyon text-white border-canyon"
                        : "bg-cream border-border/60 text-foreground hover:border-canyon/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleArrayField("categories", cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      form.categories.includes(cat)
                        ? "bg-sky text-white border-sky"
                        : "bg-cream border-border/60 text-foreground hover:border-sky/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Cost
                </label>
                <select
                  value={form.costTier}
                  onChange={(e) => {
                    updateField("costTier", e.target.value);
                    updateField("isFree", e.target.value === "free");
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-cream border border-border/60 text-sm focus:outline-none focus:border-canyon/40 transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="free">Free</option>
                  <option value="budget">Budget ($1–$15)</option>
                  <option value="moderate">Moderate ($15–$50)</option>
                  <option value="premium">Premium ($50+)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Duration
                </label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => updateField("duration", e.target.value)}
                  placeholder="e.g. ~90 min"
                  className="w-full px-4 py-3 rounded-xl bg-cream border border-border/60 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-canyon/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Parking
                </label>
                <input
                  type="text"
                  value={form.parking}
                  onChange={(e) => updateField("parking", e.target.value)}
                  placeholder="e.g. Free lot, street parking"
                  className="w-full px-4 py-3 rounded-xl bg-cream border border-border/60 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-canyon/40 transition-colors"
                />
              </div>
            </div>
          </fieldset>

          {/* Accessibility */}
          <fieldset>
            <legend className="font-display text-lg text-ink mb-4">
              The practical stuff
            </legend>
            <p className="text-sm text-muted-foreground mb-4 font-serif italic">
              These details matter more than you think when you&apos;ve got a
              stroller and three kids.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                {
                  field: "restrooms" as const,
                  label: "Restrooms available",
                },
                {
                  field: "strollerFriendly" as const,
                  label: "Stroller-friendly",
                },
                {
                  field: "wheelchairAccessible" as const,
                  label: "Wheelchair accessible",
                },
              ].map(({ field, label }) => (
                <label
                  key={field}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                    form[field]
                      ? "bg-sage/10 border-sage/30 text-sage"
                      : "bg-cream border-border/60 text-foreground"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form[field]}
                    onChange={(e) => updateField(field, e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      form[field]
                        ? "bg-sage border-sage text-white"
                        : "border-border"
                    }`}
                  >
                    {form[field] && <CheckCircle2 size={14} />}
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Submit */}
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-canyon text-white font-semibold text-base hover:bg-canyon-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Activity
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
