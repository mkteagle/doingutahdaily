"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Camera, MapPin, Mail, Mountain, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-background border-b border-border overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Mountain size={14} className="text-primary" />
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">
              Our story
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.0] mb-6 max-w-3xl">
            Capturing Utah&apos;s Magic,{" "}
            <span className="text-gradient">One Adventure</span>{" "}
            at a Time
          </h1>
          <p className="font-serif text-xl text-muted-foreground max-w-2xl leading-relaxed">
            We&apos;re a family-run guide to the best events and adventures across the
            Beehive State — built by Utah parents, for Utah families.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {/* Hero Image */}
          <div className="relative h-96 sm:h-[450px] rounded-2xl overflow-hidden border border-border shadow-lg mb-16">
            <Image
              src="/assets/images/about.jpg"
              alt="Doing Utah Daily - Our family adventures"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Text */}
            <div className="lg:col-span-7 space-y-6 font-serif text-base sm:text-lg text-foreground/80 leading-relaxed">
              <p>
                My first job was as a photographer. I grew up taking pictures and
                loved creating memories for people. Later, I graduated with a
                Bachelor of Science degree majoring in English. The best way to
                combine my two passions was blogging — and I started blogging as
                soon as I learned about them back in the day.
              </p>
              <p>
                Doing Utah Daily began as a way to share the amazing family-friendly
                experiences Utah has to offer. What started as personal blog posts
                about local events grew into something much bigger — a trusted guide
                for thousands of Utah families looking for their next adventure.
              </p>
              <blockquote className="border-l-4 border-primary pl-6 italic text-xl text-foreground font-serif my-8">
                &ldquo;Utah is one of the most extraordinary places in the world to
                raise a family. We want every family to discover that.&rdquo;
              </blockquote>
              <p>
                From SeaQuest aquariums to Luminaria light shows, from baby animal
                days at botanical gardens to Christmas light festivals — we cover it
                all. If it&apos;s happening in Utah and it&apos;s worth your family&apos;s time,
                you&apos;ll find it here.
              </p>
            </div>

            {/* Sidebar - Stats & Values */}
            <div className="lg:col-span-5 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "10+", label: "Years blogging" },
                  { value: "500+", label: "Events monthly" },
                  { value: "50K+", label: "Utah families" },
                  { value: "12+", label: "Cities covered" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="p-5 rounded-2xl bg-card border border-border text-center"
                  >
                    <div className="font-display text-3xl text-primary mb-1">{value}</div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>

              {/* Values */}
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/15 space-y-5">
                <h3 className="font-display text-lg text-foreground">What we stand for</h3>
                {[
                  { icon: Heart, text: "Family-first recommendations" },
                  { icon: Camera, text: "Authentic first-hand experiences" },
                  { icon: MapPin, text: "Hyperlocal Utah focus" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-4">
            Want to work together?
          </h2>
          <p className="font-serif text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            We partner with Utah venues, event organizers, and family-focused
            businesses to spread the word about amazing local experiences.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Get in touch <ArrowRight size={16} />
            </Link>
            <a
              href="mailto:hello@doingutahdaily.com"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
            >
              <Mail size={16} /> Email us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
