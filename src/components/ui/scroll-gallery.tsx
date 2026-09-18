import { useRef, useEffect, useState } from "react";

interface ScrollGalleryProps {
  images: string[];
}

export function ScrollGallery({ images }: ScrollGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActiveIndex(idx);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    const slides = container.querySelectorAll("[data-index]");
    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (idx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const slide = container.querySelector(`[data-index="${idx}"]`) as HTMLElement;
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  };

  return (
    <div className="relative">
      {/* Scroll container */}
      <div
        ref={containerRef}
        className="h-[85vh] overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            data-index={i}
            className="relative h-[85vh] w-full snap-start overflow-hidden"
          >
            <img
              src={src}
              alt={`Lookbook ${i + 1}`}
              loading={i < 2 ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-700"
              style={{
                transform: activeIndex === i ? "scale(1)" : "scale(1.04)",
                transition: "transform 0.8s ease",
              }}
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Slide counter */}
            <div className="absolute bottom-8 left-8 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#F7F4EE]/60">
                {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>
              <span className="h-px w-10 bg-[#C9A227]/60" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#F7F4EE]/40">
                Studio 001
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dot navigation */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to image ${i + 1}`}
            className="flex h-5 w-5 items-center justify-center"
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: activeIndex === i ? "8px" : "4px",
                height: activeIndex === i ? "8px" : "4px",
                backgroundColor: activeIndex === i ? "#C9A227" : "rgba(247,244,238,0.4)",
              }}
            />
          </button>
        ))}
      </div>

      {/* Scroll hint */}
      <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-[#555555]">
        Scroll to browse
      </p>
    </div>
  );
}
