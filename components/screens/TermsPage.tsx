"use client";
import { Scale, FileText, AlertCircle, Ban, UserX, ExternalLink, Mail } from "lucide-react";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";

export function TermsPage() {
  const { colorMode } = useTheme();

  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        {
          subtitle: "Agreement to Terms",
          text: "By accessing and using doingutahdaily.com (the 'Website'), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Website."
        },
        {
          subtitle: "Modifications",
          text: "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the Website after changes are posted constitutes your acceptance of the modified terms."
        }
      ]
    },
    {
      icon: UserX,
      title: "Use of Website",
      content: [
        {
          subtitle: "Permitted Use",
          text: "You may use the Website for personal, non-commercial purposes to discover and learn about events and activities in Utah. You agree to use the Website only for lawful purposes and in accordance with these Terms."
        },
        {
          subtitle: "User Conduct",
          text: "You agree not to: (a) use the Website in any way that violates applicable laws or regulations; (b) attempt to gain unauthorized access to any portion of the Website; (c) interfere with or disrupt the Website's functionality; (d) use automated systems to access the Website without our permission; (e) transmit any viruses, malware, or harmful code."
        },
        {
          subtitle: "Account Security",
          text: "If you create an account or subscribe to our services, you are responsible for maintaining the confidentiality of your account information and for all activities under your account."
        }
      ]
    },
    {
      icon: Scale,
      title: "Intellectual Property",
      content: [
        {
          subtitle: "Website Content",
          text: "All content on the Website, including text, graphics, logos, images, photographs, and software, is the property of Doing Utah Daily or its content suppliers and is protected by copyright, trademark, and other intellectual property laws."
        },
        {
          subtitle: "Limited License",
          text: "We grant you a limited, non-exclusive, non-transferable license to access and use the Website for personal purposes. You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content without our express written permission."
        },
        {
          subtitle: "User Submissions",
          text: "If you submit content to us (such as comments, photos, or event suggestions), you grant us a worldwide, royalty-free, perpetual license to use, reproduce, modify, and display such content in connection with our services."
        }
      ]
    },
    {
      icon: AlertCircle,
      title: "Event Information",
      content: [
        {
          subtitle: "Accuracy",
          text: "We strive to provide accurate and up-to-date event information, but we do not guarantee the accuracy, completeness, or timeliness of any event listings. Event details, including dates, times, locations, and prices, are subject to change without notice."
        },
        {
          subtitle: "Third-Party Events",
          text: "Many events listed on our Website are organized by third parties. We are not responsible for the conduct, safety, or quality of third-party events. Your participation in any event is at your own risk."
        },
        {
          subtitle: "Verification",
          text: "We recommend verifying event details directly with event organizers before attending. We are not liable for any losses, damages, or disappointments resulting from event cancellations, changes, or inaccuracies."
        }
      ]
    },
    {
      icon: ExternalLink,
      title: "Third-Party Links",
      content: [
        {
          subtitle: "External Websites",
          text: "Our Website may contain links to third-party websites for your convenience. We do not control, endorse, or assume responsibility for the content, privacy policies, or practices of any third-party websites."
        },
        {
          subtitle: "Your Responsibility",
          text: "Your use of third-party websites is at your own risk. We encourage you to read the terms and privacy policies of any third-party websites you visit."
        }
      ]
    },
    {
      icon: Ban,
      title: "Disclaimers and Limitations",
      content: [
        {
          subtitle: "No Warranties",
          text: "THE WEBSITE IS PROVIDED 'AS IS' AND 'AS AVAILABLE' WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT."
        },
        {
          subtitle: "Limitation of Liability",
          text: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, DOING UTAH DAILY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES."
        },
        {
          subtitle: "Maximum Liability",
          text: "In no event shall our total liability to you for all damages exceed one hundred dollars ($100) or the amount you paid us in the past twelve months, whichever is greater."
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
              <Scale className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm tracking-wide">
                TERMS OF SERVICE
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-display text-5xl lg:text-7xl text-white mb-6 leading-tight animate-slide-up delay-100">
              Terms of
              <span className="block font-serif italic text-white/90 text-4xl lg:text-6xl mt-2">
                Service
              </span>
            </h1>

            {/* Subheading */}
            <p className="font-serif text-xl lg:text-2xl text-white/95 mb-6 max-w-2xl leading-relaxed animate-slide-up delay-200">
              Please read these terms carefully before using our website and services.
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
              These Terms of Service ("Terms") govern your use of the Doing Utah Daily website located at doingutahdaily.com. These Terms apply to all visitors, users, and others who access or use the Website. By using the Website, you agree to be bound by these Terms.
            </p>
          </div>

          {/* Terms Sections */}
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

          {/* Additional Terms */}
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[hsl(var(--seasonal-primary))] to-[hsl(var(--seasonal-accent))] text-white">
                <FileText className="w-7 h-7" />
              </div>
              <h2 className="font-display text-3xl lg:text-4xl text-[hsl(var(--foreground))]">
                Indemnification
              </h2>
            </div>
            <div className="pl-0 lg:pl-20">
              <p
                className={cn(
                  "font-serif text-lg leading-relaxed",
                  colorMode === "dark" ? "text-gray-300" : "text-gray-700"
                )}
              >
                You agree to indemnify, defend, and hold harmless Doing Utah Daily, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of the Website, your violation of these Terms, or your violation of any rights of another.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[hsl(var(--seasonal-primary))] to-[hsl(var(--seasonal-accent))] text-white">
                <Scale className="w-7 h-7" />
              </div>
              <h2 className="font-display text-3xl lg:text-4xl text-[hsl(var(--foreground))]">
                Governing Law
              </h2>
            </div>
            <div className="pl-0 lg:pl-20">
              <p
                className={cn(
                  "font-serif text-lg leading-relaxed",
                  colorMode === "dark" ? "text-gray-300" : "text-gray-700"
                )}
              >
                These Terms shall be governed by and construed in accordance with the laws of the State of Utah, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Website shall be resolved in the courts located in Salt Lake County, Utah.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[hsl(var(--seasonal-primary))] to-[hsl(var(--seasonal-accent))] text-white">
                <FileText className="w-7 h-7" />
              </div>
              <h2 className="font-display text-3xl lg:text-4xl text-[hsl(var(--foreground))]">
                Severability
              </h2>
            </div>
            <div className="pl-0 lg:pl-20">
              <p
                className={cn(
                  "font-serif text-lg leading-relaxed",
                  colorMode === "dark" ? "text-gray-300" : "text-gray-700"
                )}
              >
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
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
              Questions About These Terms?
            </h2>
            <p
              className={cn(
                "font-serif text-lg leading-relaxed mb-6",
                colorMode === "dark" ? "text-gray-300" : "text-gray-700"
              )}
            >
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[hsl(var(--seasonal-primary))]" />
                <a
                  href="mailto:legal@doingutahdaily.com"
                  className="font-medium text-[hsl(var(--seasonal-primary))] hover:underline"
                >
                  legal@doingutahdaily.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
