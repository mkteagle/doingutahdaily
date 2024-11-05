"use client";
import { Card, FeatureCard } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Handshake,
} from "lucide-react";
import { useTheme } from "@/theme/theme";
import { Body, H2, H3 } from "../ui/typography";
import { ContactForm } from "../Contact/ContactForm";

export function ContactPage() {
  const { colors } = useTheme();

  const features = [
    {
      icon: Users,
      title: "Engaged Local Audience",
      description:
        "Connect with 50,000+ Utah families actively seeking local experiences",
    },
    {
      icon: Calendar,
      title: "Expert Event Coverage",
      description:
        "Professional content creation and authentic storytelling about your event or venue",
    },
    {
      icon: ArrowRight,
      title: "Extended Reach",
      description:
        "Multi-platform promotion across our blog, social media, and newsletter networks",
    },
  ];

  return (
    <div className="min-h-screen dark">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white py-24">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div
            className="absolute top-0 right-0 w-1/2 h-full opacity-10"
            style={{
              background: `linear-gradient(45deg, transparent 0%, ${colors.primary} 100%)`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="flex items-center gap-2 mb-6">
            <Handshake className="w-6 h-6" style={{ color: colors.primary }} />
            <span
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: colors.primary }}
            >
              Partnerships & Collaborations
            </span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Let's Create Something
              <span className="block" style={{ color: colors.primary }}>
                Extraordinary Together
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Partner with Utah's premier family event and activity platform to
              showcase your venue, event, or experience to our engaged community
              of adventure-seeking families.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Value Proposition */}
          <div>
            <H2 className="text-3xl font-semibold mb-8">
              Why Partner With Us?
            </H2>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>

            <div className="mt-12 space-y-6">
              <H3 className="text-2xl font-semibold">Direct Contact</H3>
              <div className="space-y-4">
                <Body className="flex items-center gap-3">
                  <Mail className="w-5 h-5" style={{ color: colors.primary }} />
                  <span>partnerships@doingutahdaily.com</span>
                </Body>
                <Body className="flex items-center gap-3">
                  <Phone
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                  <span>(801) 123-4567</span>
                </Body>
                <Body className="flex items-center gap-3">
                  <MapPin
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                  <span>Salt Lake City, Utah</span>
                </Body>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <Card className="p-8 shadow-lg">
              <H3 className="text-2xl font-semibold mb-6">
                Start the Conversation
              </H3>
              <ContactForm />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
