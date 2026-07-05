"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { ProductImage } from "@/lib/products";

type Props = {
  images: ProductImage[];
  swatch: string;
  colorName: string;
  stockBadge?: React.ReactNode;
};

function Placeholder({ swatch, label, colorName }: { swatch: string; label: string; colorName: string }) {
  const isLight = ["#f5f2ea", "#e9dfc9", "#d8a9a3"].includes(swatch);
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4"
      style={{ backgroundColor: swatch }}
    >
      <svg
        viewBox="0 0 200 240"
        className={`h-2/5 w-2/5 transition-opacity ${isLight ? "opacity-10" : "opacity-20"}`}
        fill="none"
      >
        <path
          d="M60 30 L100 15 L140 30 L175 50 L165 90 L145 82 L145 220 L55 220 L55 82 L35 90 L25 50 Z"
          stroke={isLight ? "#111" : "#fff"}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={`text-[10px] uppercase tracking-[0.32em] ${isLight ? "text-foreground/30" : "text-white/30"}`}
      >
        {colorName} — {label}
      </span>
    </div>
  );
}

export function ProductGallery({ images, swatch, colorName, stockBadge }: Props) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [lightbox, setLightbox] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  // Reset to first image when images array changes (color/gsm switch)
  useEffect(() => { setActive(0); setZoomed(false); }, [images]);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  // Zoom mouse tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const current = images[active];

  return (
    <>
      <div className="flex gap-3 lg:gap-4">
        {/* Vertical thumbnails — desktop */}
        <div className="hidden flex-col gap-2 sm:flex">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`group relative h-[88px] w-[70px] overflow-hidden border-2 transition-all duration-200 ${
                active === i ? "border-ink" : "border-transparent hover:border-ink/40"
              }`}
              aria-label={img.label}
            >
              {img.src ? (
                <img
                  src={img.src}
                  alt={img.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full" style={{ backgroundColor: swatch }}>
                  <div className={`flex h-full items-center justify-center text-[8px] uppercase tracking-widest ${
                    ["#f5f2ea", "#e9dfc9", "#d8a9a3"].includes(swatch) ? "text-foreground/30" : "text-white/30"
                  }`}>
                    {img.label}
                  </div>
                </div>
              )}
              {/* Active indicator */}
              <span className={`absolute bottom-0 left-0 h-0.5 w-full bg-ink transition-transform duration-200 ${active === i ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className="relative flex-1 overflow-hidden bg-bone">
          {/* Zoom hint */}
          {current.src && (
            <div className="absolute right-3 top-3 z-10 hidden items-center gap-1.5 rounded-sm bg-background/80 px-2 py-1 text-[10px] uppercase tracking-widest backdrop-blur md:flex">
              <ZoomIn className="h-3 w-3" />
              Hover to zoom
            </div>
          )}

          {/* Tap to open lightbox */}
          <div
            ref={mainRef}
            className={`aspect-[3/4] w-full cursor-zoom-in overflow-hidden ${zoomed ? "cursor-zoom-in" : ""}`}
            onMouseEnter={() => current.src && setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
            onClick={() => current.src && setLightbox(true)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {current.src ? (
              <div className="relative h-full w-full overflow-hidden">
                <img
                  key={`${active}-${current.src}`}
                  src={current.src}
                  alt={`${colorName} Essential Tee — ${current.label}`}
                  className="h-full w-full object-cover transition-opacity duration-300 animate-in fade-in"
                  style={
                    zoomed
                      ? {
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                          transform: "scale(1.85)",
                          transition: "transform 0.1s ease-out",
                        }
                      : { transform: "scale(1)", transition: "transform 0.3s ease-out" }
                  }
                />
              </div>
            ) : (
              <Placeholder swatch={swatch} label={current.label} colorName={colorName} />
            )}
          </div>

          {/* Angle label pill */}
          <div className="absolute bottom-3 left-3 bg-background/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] backdrop-blur">
            {current.label}
          </div>

          {/* Stock badge */}
          {stockBadge && <div className="absolute left-3 top-3">{stockBadge}</div>}

          {/* Prev / Next arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-background/80 backdrop-blur transition-opacity hover:bg-background md:opacity-0 md:group-hover:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-background/80 backdrop-blur transition-opacity hover:bg-background md:opacity-0 md:group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Thumbnail dots + label — mobile */}
      <div className="mt-4 sm:hidden">
        {/* Horizontal thumbnail strip */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-14 shrink-0 overflow-hidden border-2 transition-colors ${
                active === i ? "border-ink" : "border-transparent"
              }`}
            >
              {img.src ? (
                <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full" style={{ backgroundColor: swatch }} />
              )}
            </button>
          ))}
        </div>
        {/* Dot indicators */}
        <div className="mt-3 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                active === i ? "w-5 bg-ink" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            {current.src ? (
              <img
                src={current.src}
                alt={`${colorName} — ${current.label}`}
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
            ) : (
              <div className="flex h-[80vh] w-[60vw] items-center justify-center" style={{ backgroundColor: swatch }}>
                <span className="text-sm uppercase tracking-widest text-white/40">{colorName} — {current.label}</span>
              </div>
            )}
            <p className="mt-3 text-center text-xs uppercase tracking-[0.3em] text-white/60">
              {current.label} · {active + 1} / {images.length}
            </p>
          </div>
          <button
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            className="absolute right-4 top-4 text-xs uppercase tracking-widest text-white/50 hover:text-white"
            onClick={() => setLightbox(false)}
          >
            Close ✕
          </button>
        </div>
      )}
    </>
  );
}
