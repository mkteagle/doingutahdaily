"use client";
import { Shield, Lock, Eye, UserCheck, Database, Cookie, Mail } from "lucide-react";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";

export function PrivacyPage() {
  const { colorMode } = useTheme();

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you subscribe to our newsletter or contact us, we may collect your name, email address, and any other information you voluntarily provide. We use this information solely to communicate with you about Utah events and activities."
        },
        {
          subtitle: "Usage Data",
          text: "We automatically collect certain information when you visit our website, including your IP address, browser type, device information, and pages visited. This helps us understand how visitors use our site and improve our content."
        },
        {
          subtitle: "Google Calendar Integration",
          text: "We integrate with Google Calendar to display event information. This integration only retrieves publicly available event data and does not access your personal calendar information."
        }
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Communication",
          text: "We use your email address to send you newsletters, event updates, and respond to your inquiries. You can unsubscribe from our communications at any time using the link provided in every email."
        },
        {
          subtitle: "Website Improvement",
          text: "Usage data helps us analyze trends, administer the website, track user navigation, and gather demographic information to improve our services and user experience."
        },
        {
          subtitle: "Legal Compliance",
          text: "We may use your information to comply with applicable laws, regulations, legal processes, or enforceable governmental requests."
        }
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        {
          subtitle: "Protection Measures",
          text: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security."
        },
        {
          subtitle: "Data Retention",
          text: "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law."
        }
      ]
    },
    {
      icon: Cookie,
      title: "Cookies and Tracking",
      content: [
        {
          subtitle: "Essential Cookies",
          text: "We use cookies to remember your preferences (such as theme settings) and provide basic functionality. These cookies are essential for the website to function properly."
        },
        {
          subtitle: "Analytics",
          text: "We may use third-party analytics services to help understand how our website is used. These services may use cookies to collect and analyze usage data."
        },
        {
          subtitle: "Your Choices",
          text: "Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer. Note that disabling cookies may affect website functionality."
        }
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        {
          subtitle: "Access and Correction",
          text: "You have the right to access, correct, or update your personal information at any time by contacting us at privacy@doingutahdaily.com."
        },
        {
          subtitle: "Deletion",
          text: "You may request deletion of your personal information, subject to certain legal exceptions. We will respond to such requests within a reasonable timeframe."
        },
        {
          subtitle: "Opt-Out",
          text: "You can opt out of receiving promotional emails by clicking the unsubscribe link in any email or by contacting us directly."
        }
      ]
    },
    {
      icon: Mail,
      title: "Third-Party Services",
      content: [
        {
          subtitle: "External Links",
          text: "Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies."
        },
        {
          subtitle: "Service Providers",
          text: "We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you. These parties are obligated to keep your information confidential."
        },
        {
          subtitle: "Event Organizers",
          text: "When we feature events from third-party organizers, any information you provide directly to those organizers is subject to their privacy policies, not ours."
        }
      ]
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden seasonal-gradient min-h-[60vh] flex items-center grain">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[hsl(var(--seasonal-secondary))] opacity-20 blur-3xl -top-32 -right-32 animate-float"></div>
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[hsl(var(--seasonal-accent))] opacity-20 blur-3xl bottom-0 left-0 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern opacity-10"></div>

        <div className="relative container mx-auto px-6 lg:px-12 py-20 z-10">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8 animate-slide-up">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm tracking-wide">
                PRIVACY POLICY
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-display text-5xl lg:text-7xl text-white mb-6 leading-tight animate-slide-up delay-100">
              Your Privacy
              <span className="block font-serif italic text-white/90 text-4xl lg:text-6xl mt-2">
                Matters to Us
              </span>
            </h1>

            {/* Subheading */}
            <p className="font-serif text-xl lg:text-2xl text-white/95 mb-6 max-w-2xl leading-relaxed animate-slide-up delay-200">
              We are committed to protecting your privacy and being transparent about how we collect and use your information.
            </p>

            <p className="text-white/80 animate-slide-up delay-300">
              <strong>Last Updated:</strong> December 5, 2025
            </p>
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

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Introduction */}
          <div
            className={cn(
              "mb-16 p-8 rounded-2xl border-2",
              colorMode === "dark"
                ? "bg-[hsl(var(--foreground))]/5 border-[hsl(var(--seasonal-primary))]/30"
                : "bg-[hsl(var(--seasonal-secondary))]/20 border-[hsl(var(--seasonal-primary))]/20"
            )}
          >
            <p
              className={cn(
                "font-serif text-lg leading-relaxed",
                colorMode === "dark" ? "text-gray-300" : "text-gray-700"
              )}
            >
              Doing Utah Daily ("we," "our," or "us") operates doingutahdaily.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. By using our website, you consent to the data practices described in this policy.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-16">
            {sections.map((section, index) => (
              <div key={index}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[hsl(var(--seasonal-primary))] to-[hsl(var(--seasonal-accent))] text-white">
                    <section.icon className="w-7 h-7" />
                  </div>
                  <h2 className="font-display text-3xl lg:text-4xl text-[hsl(var(--foreground))]">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6 pl-0 lg:pl-20">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="font-display text-xl mb-3 text-[hsl(var(--seasonal-primary))]">
                        {item.subtitle}
                      </h3>
                      <p
                        className={cn(
                          "font-serif text-lg leading-relaxed",
                          colorMode === "dark" ? "text-gray-300" : "text-gray-700"
                        )}
                      >
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Children's Privacy */}
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[hsl(var(--seasonal-primary))] to-[hsl(var(--seasonal-accent))] text-white">
                <Shield className="w-7 h-7" />
              </div>
              <h2 className="font-display text-3xl lg:text-4xl text-[hsl(var(--foreground))]">
                Children's Privacy
              </h2>
            </div>
            <div className="pl-0 lg:pl-20">
              <p
                className={cn(
                  "font-serif text-lg leading-relaxed mb-4",
                  colorMode === "dark" ? "text-gray-300" : "text-gray-700"
                )}
              >
                Our website is intended for families, but we do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@doingutahdaily.com, and we will delete such information.
              </p>
            </div>
          </div>

          {/* Changes to Privacy Policy */}
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[hsl(var(--seasonal-primary))] to-[hsl(var(--seasonal-accent))] text-white">
                <Shield className="w-7 h-7" />
              </div>
              <h2 className="font-display text-3xl lg:text-4xl text-[hsl(var(--foreground))]">
                Changes to This Policy
              </h2>
            </div>
            <div className="pl-0 lg:pl-20">
              <p
                className={cn(
                  "font-serif text-lg leading-relaxed mb-4",
                  colorMode === "dark" ? "text-gray-300" : "text-gray-700"
                )}
              >
                We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date at the top of this policy. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div
            className={cn(
              "mt-16 p-8 rounded-2xl border-2",
              colorMode === "dark"
                ? "bg-[hsl(var(--foreground))]/5 border-[hsl(var(--seasonal-primary))]/30"
                : "bg-[hsl(var(--seasonal-secondary))]/20 border-[hsl(var(--seasonal-primary))]/20"
            )}
          >
            <h2 className="font-display text-2xl mb-4 text-[hsl(var(--foreground))]">
              Contact Us About Privacy
            </h2>
            <p
              className={cn(
                "font-serif text-lg leading-relaxed mb-6",
                colorMode === "dark" ? "text-gray-300" : "text-gray-700"
              )}
            >
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[hsl(var(--seasonal-primary))]" />
                <a
                  href="mailto:privacy@doingutahdaily.com"
                  className="font-medium text-[hsl(var(--seasonal-primary))] hover:underline"
                >
                  privacy@doingutahdaily.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
