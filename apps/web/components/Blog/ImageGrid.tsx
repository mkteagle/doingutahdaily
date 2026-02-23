"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ImageGridProps {
  images: { src: string; alt: string }[];
  columns?: 2 | 3 | 4;
}

export function ImageGrid({ images, columns = 2 }: ImageGridProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <div
        className={cn(
          "grid gap-4 my-8",
          columns === 2 && "grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        )}
      >
        {images.map((image, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer group"
            onClick={() => setSelected(image.src)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selected}
              alt="Enlarged view"
              fill
              className="object-contain"
              quality={100}
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
