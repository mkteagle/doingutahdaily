"use client";

import { createContext, useContext, useState } from "react";

export const MIN_WIDTH = 200;
export const MAX_WIDTH = 360;
export const COLLAPSED_WIDTH = 56;
export const DEFAULT_WIDTH = 224;

interface SidebarContextValue {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  sidebarWidth: number;
  setSidebarWidth: (v: number) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, sidebarWidth, setSidebarWidth }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
