"use client";

import { maxStoryImageWidth } from "@dud/ui/story-image-layout";
import { useLayoutEffect, useRef } from "react";
import type { PointerEvent } from "react";

const corners = [
  { name: "top-left", horizontal: -1, vertical: -1 },
  { name: "top-right", horizontal: 1, vertical: -1 },
  { name: "bottom-left", horizontal: -1, vertical: 1 },
  { name: "bottom-right", horizontal: 1, vertical: 1 },
] as const;

type Drag = {
  handle: HTMLSpanElement;
  pointerId: number;
  x: number;
  y: number;
  width: number;
  heightPerWidth: number;
  inlineWidth: string;
};

export function StoryImageResizeHandles({ image, onResize }: {
  image: HTMLImageElement;
  onResize: (image: HTMLImageElement, width: number) => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag>(null);

  useLayoutEffect(() => {
    const overlay = frame.current;
    const container = overlay?.parentElement;
    if (!overlay || !container) return;

    const positionHandles = () => {
      const bounds = image.getBoundingClientRect();
      const origin = container.getBoundingClientRect();
      Object.assign(overlay.style, {
        display: bounds.width > 0 && bounds.height > 0 ? "" : "none",
        left: `${bounds.left - origin.left}px`,
        top: `${bounds.top - origin.top}px`,
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
      });
    };

    function cancelOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape" || !drag.current) return;
      event.preventDefault();
      const { handle, pointerId } = drag.current;
      endDrag();
      if (handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId);
    }

    positionHandles();
    const observer = new ResizeObserver(positionHandles);
    observer.observe(image);
    observer.observe(container);
    window.addEventListener("keydown", cancelOnEscape);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", cancelOnEscape);
      endDrag();
    };
  }, [image]);

  function endDrag() {
    if (!drag.current) return;
    image.style.width = drag.current.inlineWidth;
    drag.current = null;
  }

  function startDrag(event: PointerEvent<HTMLSpanElement>) {
    if (!event.isPrimary || event.button !== 0 || drag.current) return;
    const { width, height } = image.getBoundingClientRect();
    if (!width || !height) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      handle: event.currentTarget,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      width,
      heightPerWidth: height / width,
      inlineWidth: image.style.width,
    };
  }

  function moveDrag(event: PointerEvent<HTMLSpanElement>, { horizontal, vertical }: typeof corners[number]) {
    const start = drag.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const horizontalDelta = horizontal * (event.clientX - start.x);
    const verticalDelta = vertical * (event.clientY - start.y);
    const { heightPerWidth } = start;
    // Project movement onto the diagonal of the image so either axis can drive the resize.
    const widthDelta = (horizontalDelta + verticalDelta * heightPerWidth) / (1 + heightPerWidth ** 2);
    const minimumWidth = Math.min(start.width, 32);
    const width = Math.min(maxStoryImageWidth, Math.max(minimumWidth, start.width + widthDelta));
    image.style.width = `${width}px`;
  }

  function finishDrag(event: PointerEvent<HTMLSpanElement>) {
    const start = drag.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const width = Math.round(image.getBoundingClientRect().width);
    endDrag();
    if (width && width !== Math.round(start.width)) onResize(image, width);
  }

  return (
    <div className="story-image-resize" ref={frame} aria-hidden="true">
      {corners.map((corner) => (
        <span key={corner.name} data-corner={corner.name}
          onPointerDown={startDrag}
          onPointerMove={(event) => moveDrag(event, corner)}
          onPointerUp={finishDrag}
          onLostPointerCapture={(event) => {
            if (drag.current?.pointerId === event.pointerId) endDrag();
          }} />
      ))}
    </div>
  );
}
