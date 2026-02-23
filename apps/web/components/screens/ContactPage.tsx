"use client";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Sparkles,
  MessageCircle,
  Handshake,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";
import { ContactForm } from "../Contact/ContactForm";

export function ContactPage() {
  const { colorMode } = useTheme();

  const features = [
    {
      icon: Target,
      title: "Engaged Local Audience",
      description:
        "Connect with 50,000+ Utah families actively seeking local experiences and adventures",
    },
    {
      icon: Zap,
      title: "Expert Event Coverage",
      description:
        "Professional content creation and authentic storytelling about your event or venue",
    },
    {
      icon: TrendingUp,
      title: "Extended Reach",
      description:
        "Multi-platform promotion across our blog, social media, and newsletter networks",
    },
  ];

  return (
    <>
      {/* Hero Section - Dramatic Seasonal Gradient */}
      <section className="relative overflow-hidden seasonal-gradient min-h-[70vh] flex items-center grain">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[hsl(var(--seasonal-secondary))] opacity-20 blur-3xl -top-32 -right-32 animate-float"></div>
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[hsl(var(--seasonal-accent))] opacity-20 blur-3xl bottom-0 left-0 animate-float delay-300" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Decorative shapes */}
        <div className="absolute top-20 left-20 w-24 h-24 border-4 border-white/20 rounded-full animate-pulse-glow"></div>
        <div className="absolute bottom-32 right-32 w-32 h-32 border-4 border-white/15 rotate-45"></div>

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern opacity-10"></div>

        <div className="relative container mx-auto px-6 lg:px-12 py-20 z-10">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8 animate-slide-up">
              <Handshake className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm tracking-wide">
                PARTNERSHIPS & COLLABORATIONS
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-display text-5xl lg:text-7xl text-white mb-6 leading-tight animate-slide-up delay-100">
              Let's Create
              <span className="block font-serif italic text-white/90 text-4xl lg:text-6xl mt-2">
                Something Extraordinary
              </span>
            </h1>

            {/* Subheading */}
            <p className="font-serif text-xl lg:text-2xl text-white/95 mb-10 max-w-2xl leading-relaxed animate-slide-up delay-200">
              Partner with Utah's premier family event platform to showcase your venue,
              event, or experience to our engaged community.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 animate-slide-up delay-300">
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-display">50K+</div>
                  <div className="text-sm font-medium">Active Families</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-display">24hr</div>
                  <div className="text-sm font-medium">Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill={colorMode === 'dark' ? 'hsl(15, 25%, 12%)' : 'hsl(45, 35%, 97%)'}
            />
          </svg>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto px-6 lg:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left Column - Why Partner */}
          <div>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-12 bg-[hsl(var(--seasonal-primary))]"></div>
                <span className="text-[hsl(var(--seasonal-primary))] font-bold text-sm tracking-widest uppercase">
                  Benefits
                </span>
              </div>
              <h2 className="font-display text-4xl lg:text-5xl text-[hsl(var(--foreground))] mb-4">
                Why Partner
                <span className="block font-serif italic text-[hsl(var(--seasonal-primary))]">
                  With Us?
                </span>
              </h2>
            </div>

            {/* Features */}
            <div className="space-y-6 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "group p-6 rounded-2xl border-2 transition-all hover-lift",
                    colorMode === "dark"
                      ? "bg-[hsl(var(--foreground))]/5 border-[hsl(var(--seasonal-primary))]/30 hover:border-[hsl(var(--seasonal-primary))]"
                      : "bg-white border-[hsl(var(--seasonal-primary))]/20 hover:border-[hsl(var(--seasonal-primary))]"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[hsl(var(--seasonal-primary))] to-[hsl(var(--seasonal-accent))] text-white flex-shrink-0">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl mb-2 text-[hsl(var(--foreground))]">
                        {feature.title}
                      </h3>
                      <p
                        className={cn(
                          "font-serif leading-relaxed",
                          colorMode === "dark" ? "text-gray-300" : "text-gray-600"
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div
              className={cn(
                "p-8 rounded-2xl border-2",
                colorMode === "dark"
                  ? "bg-[hsl(var(--foreground))]/5 border-[hsl(var(--border))]"
                  : "bg-[hsl(var(--seasonal-secondary))]/20 border-[hsl(var(--seasonal-primary))]/20"
              )}
            >
              <h3 className="font-display text-2xl mb-6 text-[hsl(var(--foreground))]">
                Direct Contact
              </h3>
              <div className="space-y-4">
                <a
                  href="mailto:partnerships@doingutahdaily.com"
                  className="flex items-center gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-[hsl(var(--seasonal-primary))]/10 group-hover:bg-[hsl(var(--seasonal-primary))]/20 transition-colors">
                    <Mail className="w-5 h-5 text-[hsl(var(--seasonal-primary))]" />
                  </div>
                  <span
                    className={cn(
                      "font-medium group-hover:text-[hsl(var(--seasonal-primary))] transition-colors",
                      colorMode === "dark" ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    partnerships@doingutahdaily.com
                  </span>
                </a>
                <a href="tel:+18011234567" className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-[hsl(var(--seasonal-primary))]/10 group-hover:bg-[hsl(var(--seasonal-primary))]/20 transition-colors">
                    <Phone className="w-5 h-5 text-[hsl(var(--seasonal-primary))]" />
                  </div>
                  <span
                    className={cn(
                      "font-medium group-hover:text-[hsl(var(--seasonal-primary))] transition-colors",
                      colorMode === "dark" ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    (801) 123-4567
                  </span>
                </a>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[hsl(var(--seasonal-primary))]/10">
                    <MapPin className="w-5 h-5 text-[hsl(var(--seasonal-primary))]" />
                  </div>
                  <span
                    className={cn(
                      "font-medium",
                      colorMode === "dark" ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    Salt Lake City, Utah
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div
              className={cn(
                "p-8 lg:p-10 rounded-3xl border-2 shadow-layered",
                colorMode === "dark"
                  ? "bg-[hsl(var(--foreground))]/5 border-[hsl(var(--seasonal-primary))]/30"
                  : "bg-white border-[hsl(var(--seasonal-primary))]/20"
              )}
            >
              <div className="flex items-center gap-3 mb-6">
                <Send className="w-6 h-6 text-[hsl(var(--seasonal-primary))]" />
                <h3 className="font-display text-3xl text-[hsl(var(--foreground))]">
                  Get In Touch
                </h3>
              </div>
              <p
                className={cn(
                  "font-serif text-lg mb-8",
                  colorMode === "dark" ? "text-gray-300" : "text-gray-600"
                )}
              >
                Ready to collaborate? Fill out the form below and we'll get back to you within 24 hours.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[hsl(var(--seasonal-primary))] to-[hsl(var(--seasonal-accent))] grain">
        <div className="absolute inset-0 dot-pattern opacity-10"></div>
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative container mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-display text-4xl lg:text-5xl text-white mb-6">
            Let's Build Something
            <span className="block font-serif italic mt-2">Amazing Together</span>
          </h2>
          <p className="font-serif text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Join dozens of successful partnerships helping families discover the best of Utah.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:partnerships@doingutahdaily.com"
              className="group px-8 py-4 bg-white text-[hsl(var(--seasonal-primary))] font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg hover-lift inline-flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
            <a
              href="tel:+18011234567"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-[hsl(var(--seasonal-primary))] transition-all inline-flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
