import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";
import { X } from "lucide-react";

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

          <DialogContent
            className={cn(
              "fixed inset-0 z-50 border-none bg-transparent overflow-hidden",
              // Override default dialog styles
              "!max-w-none !translate-x-0 !translate-y-0 !top-0 !left-0",
              "!w-full !h-full"
            )}
            // Remove default padding
            style={{ padding: 0 }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-[60] text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 backdrop-blur-sm transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image container */}
            <div className="w-full h-full flex items-center justify-center p-8">
              <div className="relative w-[1200px] h-[800px] max-w-[90vw] max-h-[80vh]">
                <Image
                  src={selectedImage}
                  alt="Enlarged view"
                  fill
                  className="object-contain"
                  quality={100}
                  priority
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
