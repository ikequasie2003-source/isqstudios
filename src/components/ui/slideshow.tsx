import { useEffect, useState } from "react";

interface SlideshowProps {
  images: string[];
  interval?: number; // ms between slides
}

export function Slideshow({ images, interval = 3500 }: SlideshowProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "80vh", minHeight: "500px" }}>
      {images.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: current === i ? 1 : 0 }}
        >
          <img
            src={src}
            alt={`Lookbook ${i + 1}`}
            loading={i < 2 ? "eager" : "lazy"}
            className="h-full w-full object-cover"
          />
          {/* Subtle dark bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* Slide counter bottom left */}
      <div className="absolute bottom-8 left-8 z-10 flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#F7F4EE]/60">
          {String(current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
        <span className="h-px w-10 bg-[#C9A227]/60" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#F7F4EE]/40">Studio 001</span>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 right-8 z-10 flex items-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: current === i ? "24px" : "6px",
              height: "2px",
              backgroundColor: current === i ? "#C9A227" : "rgba(247,244,238,0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
