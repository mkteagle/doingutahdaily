"use client";

import { Shield, Lock, Eye, UserCheck, Database, Cookie, Mail } from "lucide-react";

const SECTIONS = [
  {
    icon: Eye,
    title: "Information We Collect",
    content:
      "We collect information you provide directly to us, such as your email address when you subscribe to our newsletter. We also collect information automatically when you use our service, including log data and usage information.",
  },
  {
    icon: Database,
    title: "How We Use Your Information",
    content:
      "We use the information we collect to provide, maintain, and improve our services, send newsletters and event updates, and respond to your requests. We do not sell your personal information to third parties.",
  },
  {
    icon: Lock,
    title: "Information Security",
    content:
      "We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access. However, no security system is impenetrable and we cannot guarantee the security of our systems.",
  },
  {
    icon: Cookie,
    title: "Cookies",
    content:
      "We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content:
      "You may access, update, or delete your personal information by contacting us. You may also opt out of receiving promotional communications from us by following the unsubscribe instructions in those messages.",
  },
];

export function PrivacyPage() {
  return (
    <>
      <section className="relative py-16 sm:py-20 bg-background border-b border-border overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={14} className="text-primary" />
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Legal</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-foreground mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        <p className="font-serif text-base text-muted-foreground leading-relaxed mb-10">
          This Privacy Policy describes how Doing Utah Daily collects, uses, and shares information
          about you when you use our website and services.
        </p>

        <div className="space-y-8">
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
            <h3 className="font-display text-sm text-foreground">Contact us</h3>
          </div>
          <p className="text-sm text-muted-foreground font-serif">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:hello@doingutahdaily.com" className="text-primary hover:underline">
              hello@doingutahdaily.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
