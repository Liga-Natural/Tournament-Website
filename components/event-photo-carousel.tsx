"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BrandPanel } from "./brand-panel";

interface Slide {
  url: string;
  alt: string;
}

export function EventPhotoCarousel({
  slides,
  fallbackLabel,
  className = "",
}: {
  slides: Slide[];
  fallbackLabel: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4200);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return <BrandPanel accent="gold" label={fallbackLabel} className={className} />;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="relative h-full w-full bg-navy-deep">
        {slides.map((slide, i) => (
          <div
            key={slide.url}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === index ? 1 : 0 }}
            aria-hidden={i !== index}
          >
            <Image src={slide.url} alt={slide.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" priority={i === 0} />
          </div>
        ))}
        {slides.length > 1 && (
          <div className="absolute inset-x-0 bottom-2 z-10 flex items-center justify-center gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.url}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIndex(i);
                }}
                aria-label={`Show photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-gold" : "w-1.5 bg-cream/50"}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
