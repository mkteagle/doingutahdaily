import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/blog";
import { useImageBrightness } from "@/context/ImageBrightnessContext";
import { getFallbackImage } from "@/utils/imageFallbacks";

const calculateBrightness = (
  imageUrl: string,
  callback: (isDark: boolean) => void
) => {
  const img = new window.Image(); // Use native Image from window
  img.crossOrigin = "Anonymous";
  img.src = imageUrl;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let totalBrightness = 0;

    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      totalBrightness += brightness;
    }
    const averageBrightness = totalBrightness / (data.length / 4);
    callback(averageBrightness < 128);
  };
};

interface OptimizedImageProps {
  src: string;
  alt: string;
  slug: string; // Add slug for consistent image retrieval
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  category?: Category;
}

export function OptimizedImage({
  src,
  alt,
  slug,
  className,
  fill = true,
  width,
  height,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  category,
}: OptimizedImageProps) {
  const { setDarkBackground } = useImageBrightness();
  const initialImage =
    src ||
    (typeof window !== "undefined" &&
      localStorage.getItem(`blog_image_${slug}`)) ||
    getFallbackImage(category || "")[0];
  const [imageUrl, setImageUrl] = useState<string>(initialImage);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5; // Maximum retries to cycle through fallback images
  const fallbacks = getFallbackImage(category || "");

  useEffect(() => {
    calculateBrightness(imageUrl, setDarkBackground);
  }, [imageUrl, setDarkBackground]);

  const handleLoadComplete = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`blog_image_${slug}`, imageUrl); // Store successfully loaded image
    }
  };

  const handleError = () => {
    if (retryCount < maxRetries && retryCount < fallbacks.length) {
      // Cycle through fallback images if available
      const nextFallback = fallbacks[retryCount];
      setImageUrl(nextFallback);
      setRetryCount((prev) => prev + 1);
    } else {
      console.warn("All fallback images failed to load.");
    }
  };

  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill={fill}
      priority={priority}
      className={cn(
        "object-cover transition-transform duration-200",
        className
      )}
      onLoadingComplete={handleLoadComplete}
      onError={handleError}
      quality={85}
      sizes={sizes}
      placeholder="blur"
      blurDataURL="/api/placeholder/50/50?blur=20"
      width={width}
      height={height}
    />
  );
}
