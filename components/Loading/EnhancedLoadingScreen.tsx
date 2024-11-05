"use client";

import { useTheme } from "@/theme/theme";
import { useEffect, useState } from "react";

// Deterministic particle positions
const particles = [
  { x: 20, y: 30, delay: 0.5, duration: 4 },
  { x: 80, y: 15, delay: 0.8, duration: 5 },
  { x: 40, y: 70, delay: 1.2, duration: 4.5 },
  { x: 65, y: 25, delay: 0.3, duration: 6 },
  { x: 10, y: 90, delay: 0.9, duration: 5.5 },
  { x: 85, y: 80, delay: 1.5, duration: 4.8 },
  { x: 30, y: 45, delay: 0.6, duration: 5.2 },
  { x: 70, y: 60, delay: 1.1, duration: 4.3 },
  { x: 25, y: 85, delay: 0.4, duration: 5.8 },
  { x: 90, y: 20, delay: 1.4, duration: 4.6 },
  // Add more if needed
];

export function EnhancedLoadingScreen() {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return null on first render to avoid hydration mismatch
  }

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden"
      style={{ width: "100vw", height: "100vh" }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Radial gradient background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at center, ${colors.primary}40 0%, transparent 70%)`,
          }}
        />

        {/* Fixed position particles */}
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-float"
            style={{
              backgroundColor: colors.primary,
              opacity: 0.2,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main logo container */}
      <div
        className={`relative transition-all duration-1000 transform 
        ${mounted ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
      >
        {/* Logo glow effect */}
        <div
          className="absolute inset-0 blur-2xl"
          style={{ backgroundColor: colors.primary, opacity: 0.2 }}
        />

        {/* Main logo with entrance animation */}
        <div className="relative">
          {/* Reveal line animation */}
          <div
            className="absolute -inset-4 animate-reveal-line"
            style={{
              borderLeft: `2px solid ${colors.primary}`,
              opacity: 0.5,
            }}
          />

          {/* Large logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 246.24 155.76"
            className="w-[600px] h-auto"
          >
            {/* Utah shape with animated fill */}
            <path
              d="M.51,120.76c1.53-2.91,2.88-5.94,4.61-8.72,13.88-22.32,29.12-43.72,44.77-64.81,10.98-14.79,22.47-29.19,33.74-43.76.92-1.19,1.95-2.3,2.93-3.45.08,0,.16,0,.24,0,7.99,12.01,15.98,24.02,23.97,36.03,2.21,3.32,5.14,5.87,8.58,7.85,6.49,3.73,13,7.45,19.49,11.19,2.87,1.65,5.62,1.75,8.57,0,4.15-2.45,8.24-2.01,12.01,1.01,1.43,1.15,2.81,2.35,4.2,3.55,1.94,1.67,3.5,1.69,5.4-.01,4.37-3.91,8.69-7.88,13.09-11.75,2.71-2.38,3.66-2.27,5.72.71,8.21,11.87,16.28,23.85,24.58,35.65,7.43,10.56,15.7,20.44,25.19,29.25.15.14.36.25.41.42.29.9.55,1.81.81,2.71-.75-.23-1.58-.34-2.25-.71-10.57-5.84-21.11-11.71-32.38-17.97.23,1.21.17,2,.52,2.51,4.44,6.53,8.94,13.02,13.39,19.54.26.38.19.98.28,1.48-.54.05-1.22.33-1.61.11-9.91-5.55-19.78-11.15-29.66-16.75-.83-.47-1.65-.98-2.5-1.4-3.29-1.61-5.9-1.18-8.49,1.42-5.27,5.28-10.51,10.58-15.93,16.04-2.15-3.1-4.3-6.02-6.26-9.06-2.41-3.76-3.88-4.03-7.31-1.22-6.66,5.47-13.36,10.89-19.97,16.26-8.43-4.65-16.73-9.22-25.04-13.79-4.57-2.52-9.13-5.06-13.73-7.52-.54-.29-1.38-.35-1.97-.16-10.54,3.38-21.06,6.84-31.61,10.21-.61.19-1.51.09-2.06-.23-8.39-4.91-16.75-9.9-25.15-14.8-.47-.28-1.52-.18-1.94.17-7.88,6.44-15.7,12.94-23.55,19.42-.32.26-.75.38-1.13.57,0,0,.03.02.03.02Z"
              style={{
                fill: colors.primary,
                opacity: 0.9,
              }}
              className="animate-draw"
            />

            {/* Letters with staggered fade-in */}
            <g style={{ fill: colors.secondary }} className="animate-fade-in">
              {/* Additional <path> elements for each letter */}
            </g>
          </svg>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: colors.primary,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading text */}
      <div
        className={`absolute bottom-12 text-lg transition-all duration-1000
          ${
            mounted
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-4"
          }`}
        style={{ color: colors.primary }}
      >
        <p className="font-light tracking-wider">DISCOVERING UTAH</p>
      </div>
    </div>
  );
}
