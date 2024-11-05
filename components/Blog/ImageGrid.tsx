"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";

interface ImageGridProps {
  images: {
    src: string;
    alt: string;
  }[];
  columns?: 2 | 3 | 4;
}

export function ImageGrid({ images, columns = 2 }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      {/* Image Grid */}
      <div
        className={cn(
          "grid gap-4 my-8",
          columns === 2 && "grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        )}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => setSelectedImage(image.src)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-all duration-300 group-hover:scale-105"
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          </div>
        ))}
      </div>

      {/* Dialog for Image Modal */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogOverlay className="fixed inset-0 bg-black/90 z-50" />

          <DialogContent className="flex justify-center items-start mt-12 p-4 z-50">
            <div className="relative w-full max-w-5xl aspect-[16/9]">
              <Image
                src={selectedImage}
                alt="Enlarged view"
                fill
                className="object-contain"
                quality={100}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
