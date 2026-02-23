"use client";

import { Mountain } from "lucide-react";

export function EnhancedLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 animate-scale-in">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-lg animate-pulse-glow">
          <Mountain size={28} strokeWidth={2} />
        </div>

        <div className="text-center">
          <div className="font-display text-xl text-foreground mb-1">Doing Utah Daily</div>
          <div className="text-xs font-semibold tracking-widest uppercase text-primary">
            Discovering Utah…
          </div>
        </div>

        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
