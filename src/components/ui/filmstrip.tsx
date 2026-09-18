import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface FilmstripProps {
  images: string[];
}

export function Filmstrip({ images }: FilmstripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -480 : 480, behavior: "smooth" });
  };

  return (
    <div className="relative group/strip">
      {/* Scrollable row */}
      <div
        ref={scrollRef}
        onScroll={updateButtons}
        className="flex gap-2 overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.filmstrip-hide-scroll::-webkit-scrollbar { display: none; }`}</style>
        {images.map((src, i) => (
          <div
            key={i}
            className="relative shrink-0 overflow-hidden"
            style={{ width: "clamp(240px, 28vw, 420px)", height: "clamp(300px, 36vw, 560px)" }}
          >
            <img
              src={src}
              alt={`Lookbook ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
            />
            {/* Gold bottom accent on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A227] scale-x-0 origin-left transition-transform duration-500 hover:scale-x-100" />
          </div>
        ))}
      </div>

      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className={`absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-[#F7F4EE]/90 text-[#111111] shadow-md transition-all duration-200 hover:bg-[#C9A227] hover:text-white ${
          canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className={`absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-[#F7F4EE]/90 text-[#111111] shadow-md transition-all duration-200 hover:bg-[#C9A227] hover:text-white ${
          canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Drag hint */}
      <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-[#555555]">
        Drag or use arrows to browse
      </p>
    </div>
  );
}
