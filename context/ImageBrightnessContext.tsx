"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

interface ImageBrightnessContextType {
  isDarkBackground: boolean;
  setDarkBackground: (isDark: boolean) => void;
}

const ImageBrightnessContext = createContext<
  ImageBrightnessContextType | undefined
>(undefined);

export const ImageBrightnessProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  const setDarkBackground = useCallback((isDark: boolean) => {
    setIsDarkBackground(isDark);
  }, []);

  return (
    <ImageBrightnessContext.Provider
      value={{ isDarkBackground, setDarkBackground }}
    >
      {children}
    </ImageBrightnessContext.Provider>
  );
};

export const useImageBrightness = () => {
  const context = useContext(ImageBrightnessContext);
  if (!context) {
    throw new Error(
      "useImageBrightness must be used within an ImageBrightnessProvider"
    );
  }
  return context;
};
