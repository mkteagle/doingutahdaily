"use client";
import { Camera, Mail, Instagram, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/theme/theme";
import { cn } from "@/lib/utils";
import { H1, H2, Body, BlockQuote } from "@/components/ui/typography";
import { OptimizedImage } from "../OptimizedImage";

export function AboutPage() {
  const { colors, colorMode } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px]">
        <OptimizedImage
          src="/assets/images/about.jpg"
          alt="Our Story"
          slug="about-hero"
          fill={true}
          priority={true}
          className="z-0 object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 z-10">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-6 h-6 text-white" />
                <span className="text-sm font-medium uppercase tracking-wider text-white">
                  Our Story
                </span>
              </div>
              <H1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Capturing Utah's Magic,{" "}
                <span style={{ color: colors.primary }}>
                  One Adventure at a Time
                </span>
              </H1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-6">
              <Body
                className={
                  colorMode === "dark" ? "text-gray-200" : "text-gray-800"
                }
              >
                My first job was as a photographer, I grew up taking pictures
                and loved my time creating memories for people. Later, I
                graduated with a Bachelor of Science degree majoring in English.
                The best way to combine my two passions was blogging. I started
                blogging as soon as I learned about them back in the day.
              </Body>

              <Body
                className={
                  colorMode === "dark" ? "text-gray-200" : "text-gray-800"
                }
              >
                Since then I have become a mom. I now have a new passion of
                creating daily adventures for my kids where we can create
                memories and while they can learn and explore in a variety of
                settings.
              </Body>

              <Body
                className={
                  colorMode === "dark" ? "text-gray-200" : "text-gray-800"
                }
              >
                I had a lot of friends and family ask for more information on
                some of the things that we have done, so I decided to create
                this page. Highlighting our favorite things to do in Utah, and
                occasionally our adventures outside of Utah as well. Our state
                has so much to offer, and so much of it is free!
              </Body>

              <Body
                className={
                  colorMode === "dark" ? "text-gray-200" : "text-gray-800"
                }
              >
                Let me know if you are curious about a specific area, we have
                traveled all over, I just haven't gotten posts up for everything
                yet. And if you know of something fun for families, please tag
                us @DoingUtahDaily. We would love to see your adventures too!
              </Body>

              <BlockQuote
                className={
                  colorMode === "dark"
                    ? "text-gray-300 border-primary"
                    : "text-gray-700 border-primary"
                }
              >
                Don't wait for everything to be perfect before you decide to
                enjoy your life.
                <footer className="mt-2">- Joyce Meyer</footer>
              </BlockQuote>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div
                className={cn(
                  "rounded-xl border p-6 mb-8",
                  colorMode === "dark"
                    ? "bg-gray-800/50 border-gray-700 text-gray-200"
                    : "bg-white border-gray-200 text-gray-800"
                )}
              >
                <H2 className="text-xl font-semibold mb-6">Get in Touch</H2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail
                      className="w-5 h-5"
                      style={{ color: colors.primary }}
                    />
                    <span>hello@doingutahdaily.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram
                      className="w-5 h-5"
                      style={{ color: colors.primary }}
                    />
                    <span>@DoingUtahDaily</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin
                      className="w-5 h-5"
                      style={{ color: colors.primary }}
                    />
                    <span>Salt Lake City, Utah</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full gap-2 text-white"
                style={{ backgroundColor: colors.primary }}
              >
                <Heart className="w-5 h-5" />
                Follow Our Journey
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
