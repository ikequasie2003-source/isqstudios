import { useState } from "react";

interface SplitRevealProps {
  /** Left panel image (front) */
  leftFront: string;
  /** Right panel image (front) */
  rightFront: string;
  /** Hidden image revealed when left panel slides away */
  leftReveal: string;
  /** Hidden image revealed when right panel slides away */
  rightReveal: string;
  /** Optional extra images shown in the bottom strip */
  stripImages?: string[];
}

export function SplitReveal({
  leftFront,
  rightFront,
  leftReveal,
  rightReveal,
  stripImages = [],
}: SplitRevealProps) {
  const [leftHovered, setLeftHovered] = useState(false);
  const [rightHovered, setRightHovered] = useState(false);

  return (
    <div className="w-full select-none">
      {/* Main split panels */}
      <div className="flex h-[70vh] min-h-[480px] w-full overflow-hidden">
        {/* ── Left panel ── */}
        <div
          className="relative flex-1 overflow-hidden cursor-pointer"
          onMouseEnter={() => setLeftHovered(true)}
          onMouseLeave={() => setLeftHovered(false)}
        >
          {/* Reveal layer behind */}
          <img
            src={leftReveal}
            alt="Lookbook reveal"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Front layer slides left on hover */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-in-out"
            style={{ transform: leftHovered ? "translateX(-100%)" : "translateX(0)" }}
          >
            <img
              src={leftFront}
              alt="Lookbook"
              className="h-full w-full object-cover"
            />
            {/* Label */}
            <div className="absolute bottom-6 left-6 transition-opacity duration-300"
              style={{ opacity: leftHovered ? 0 : 1 }}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Hover to reveal</p>
            </div>
          </div>
          {/* Revealed label */}
          <div
            className="absolute bottom-6 left-6 transition-opacity duration-500 delay-300"
            style={{ opacity: leftHovered ? 1 : 0 }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Studio 001</p>
          </div>
        </div>

        {/* ── Thin gold divider ── */}
        <div className="w-px shrink-0 bg-[#C9A227]/40 z-10" />

        {/* ── Right panel ── */}
        <div
          className="relative flex-1 overflow-hidden cursor-pointer"
          onMouseEnter={() => setRightHovered(true)}
          onMouseLeave={() => setRightHovered(false)}
        >
          {/* Reveal layer behind */}
          <img
            src={rightReveal}
            alt="Lookbook reveal"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Front layer slides right on hover */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-in-out"
            style={{ transform: rightHovered ? "translateX(100%)" : "translateX(0)" }}
          >
            <img
              src={rightFront}
              alt="Lookbook"
              className="h-full w-full object-cover"
            />
            {/* Label */}
            <div className="absolute bottom-6 right-6 transition-opacity duration-300"
              style={{ opacity: rightHovered ? 0 : 1 }}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Hover to reveal</p>
            </div>
          </div>
          {/* Revealed label */}
          <div
            className="absolute bottom-6 right-6 transition-opacity duration-500 delay-300"
            style={{ opacity: rightHovered ? 1 : 0 }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">The Reckless Culture</p>
          </div>
        </div>
      </div>

      {/* ── Bottom image strip ── */}
      {stripImages.length > 0 && (
        <div className="mt-1 flex gap-1">
          {stripImages.map((src, i) => (
            <div key={i} className="flex-1 overflow-hidden" style={{ height: "180px" }}>
              <img
                src={src}
                alt={`Lookbook ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
