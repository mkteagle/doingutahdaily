"use client";

import { Scale, FileText, AlertCircle, Ban, ExternalLink, Mail } from "lucide-react";

const SECTIONS = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content:
      "By accessing and using Doing Utah Daily, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.",
  },
  {
    icon: Scale,
    title: "Use of Service",
    content:
      "You may use our service for lawful purposes only. You agree not to use the service in any way that violates applicable laws or regulations, or that could harm, disable, or impair our servers or networks.",
  },
  {
    icon: AlertCircle,
    title: "Disclaimer of Warranties",
    content:
      "Our service is provided 'as is' without any warranties, express or implied. We do not guarantee the accuracy, completeness, or usefulness of any information on our website.",
  },
  {
    icon: Ban,
    title: "Limitation of Liability",
    content:
      "Doing Utah Daily shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of, or inability to use, our service.",
  },
  {
    icon: ExternalLink,
    title: "Third-Party Links",
    content:
      "Our service may contain links to third-party websites. We are not responsible for the content or practices of those websites and encourage you to review their privacy policies.",
  },
];

export function TermsPage() {
  return (
    <>
      <section className="relative py-16 sm:py-20 bg-background border-b border-border overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Scale size={14} className="text-primary" />
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Legal</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-foreground mb-4">Terms of Use</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        <p className="font-serif text-base text-muted-foreground leading-relaxed mb-10">
          These Terms of Service govern your use of the Doing Utah Daily website and services.
          Please read them carefully before using our service.
        </p>

        <div className="space-y-6">
          {SECTIONS.map(({ icon: Icon, title, content }) => (
            <div key={title} className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-primary" />
                </div>
                <h2 className="font-display text-base text-foreground">{title}</h2>
              </div>
              <p className="text-sm text-muted-foreground font-serif leading-relaxed">{content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-primary/5 border border-primary/15">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={14} className="text-primary" />
            <h3 className="font-display text-sm text-foreground">Questions?</h3>
          </div>
          <p className="text-sm text-muted-foreground font-serif">
            Contact us at{" "}
            <a href="mailto:hello@doingutahdaily.com" className="text-primary hover:underline">
              hello@doingutahdaily.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
