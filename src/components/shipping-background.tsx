import type React from "react";

interface ShippingBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export function ShippingBackground({ children, className = "" }: ShippingBackgroundProps) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${className}`}>
      {/* Base dark background */}
      <div className="absolute inset-0" style={{ background: "#0A0803" }} />

      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Exact ellipse paths for animateMotion — center cluster */}
          <path id="ring1" d="M 1400,450 A 680,380 0 1,1 1399.99,450.01" fill="none"/>
          <path id="ring2" d="M 1300,450 A 580,310 0 1,1 1299.99,450.01" fill="none"/>
          <path id="ring3" d="M 1200,450 A 480,250 0 1,1 1199.99,450.01" fill="none"/>
          <path id="ring4" d="M 1100,450 A 380,195 0 1,1 1099.99,450.01" fill="none"/>
          <path id="ring5" d="M 1010,450 A 290,148 0 1,1 1009.99,450.01" fill="none"/>
          <path id="ring6" d="M 930,450 A 210,108 0 1,1 929.99,450.01" fill="none"/>
          <path id="ring7" d="M 860,450 A 140,72  0 1,1 859.99,450.01"  fill="none"/>
          <path id="ring8" d="M 800,450 A 80,42   0 1,1 799.99,450.01"  fill="none"/>

          {/* Top-left cluster */}
          <path id="ringTL" d="M 440,150 A 240,135 0 1,1 439.99,150.01" fill="none"/>

          {/* Bottom-right cluster */}
          <path id="ringBR" d="M 1540,780 A 260,150 0 1,1 1539.99,780.01" fill="none"/>
        </defs>

        {/* ── Center topo rings ── */}
        <use href="#ring1" stroke="rgba(212,168,48,0.07)" strokeWidth="1" />
        <use href="#ring2" stroke="rgba(212,168,48,0.09)" strokeWidth="1" />
        <use href="#ring3" stroke="rgba(212,168,48,0.11)" strokeWidth="1" />
        <use href="#ring4" stroke="rgba(212,168,48,0.13)" strokeWidth="1" />
        <use href="#ring5" stroke="rgba(212,168,48,0.15)" strokeWidth="1.2" />
        <use href="#ring6" stroke="rgba(212,168,48,0.18)" strokeWidth="1.2" />
        <use href="#ring7" stroke="rgba(212,168,48,0.22)" strokeWidth="1.5" />
        <use href="#ring8" stroke="rgba(212,168,48,0.28)" strokeWidth="1.5" />
        <ellipse cx="720" cy="450" rx="35" ry="18" fill="none" stroke="rgba(212,168,48,0.35)" strokeWidth="2" />

        {/* ── Top-left cluster ── */}
        <use href="#ringTL" stroke="rgba(212,168,48,0.07)" strokeWidth="1" />
        <ellipse cx="200" cy="150" rx="320" ry="180" fill="none" stroke="rgba(212,168,48,0.05)" strokeWidth="1" />
        <ellipse cx="200" cy="150" rx="160" ry="90"  fill="none" stroke="rgba(212,168,48,0.09)" strokeWidth="1" />
        <ellipse cx="200" cy="150" rx="90"  ry="50"  fill="none" stroke="rgba(212,168,48,0.12)" strokeWidth="1.2" />

        {/* ── Bottom-right cluster ── */}
        <use href="#ringBR" stroke="rgba(212,168,48,0.08)" strokeWidth="1" />
        <ellipse cx="1280" cy="780" rx="350" ry="200" fill="none" stroke="rgba(212,168,48,0.05)" strokeWidth="1" />
        <ellipse cx="1280" cy="780" rx="170" ry="98"  fill="none" stroke="rgba(212,168,48,0.11)" strokeWidth="1" />
        <ellipse cx="1280" cy="780" rx="90"  ry="52"  fill="none" stroke="rgba(212,168,48,0.15)" strokeWidth="1.2" />

        {/* ── Planets on exact ring paths ── */}

        {/* On ring1 (outermost) */}
        <circle r="6" fill="#D4A830" opacity="0.9">
          <animateMotion dur="30s" repeatCount="indefinite" rotate="auto">
            <mpath href="#ring1"/>
          </animateMotion>
        </circle>

        {/* On ring3 */}
        <circle r="5" fill="#F5C842" opacity="0.85">
          <animateMotion dur="22s" repeatCount="indefinite" begin="-8s" rotate="auto">
            <mpath href="#ring3"/>
          </animateMotion>
        </circle>

        {/* On ring4 */}
        <circle r="4" fill="#B8860B" opacity="0.95">
          <animateMotion dur="16s" repeatCount="indefinite" begin="-4s" rotate="auto">
            <mpath href="#ring4"/>
          </animateMotion>
        </circle>

        {/* On ring5 */}
        <circle r="3.5" fill="#FFD700" opacity="0.8">
          <animateMotion dur="12s" repeatCount="indefinite" begin="-2s" rotate="auto">
            <mpath href="#ring5"/>
          </animateMotion>
        </circle>

        {/* On ring7 — glowing */}
        <circle r="7" fill="#FFD700" opacity="0.95" filter="url(#glow)">
          <animateMotion dur="9s" repeatCount="indefinite" begin="-1s" rotate="auto">
            <mpath href="#ring7"/>
          </animateMotion>
        </circle>

        {/* On ring8 */}
        <circle r="3" fill="#D4A830" opacity="0.8">
          <animateMotion dur="6s" repeatCount="indefinite" begin="-3s" rotate="auto">
            <mpath href="#ring8"/>
          </animateMotion>
        </circle>

        {/* On top-left cluster */}
        <circle r="4" fill="#D4A830" opacity="0.75">
          <animateMotion dur="18s" repeatCount="indefinite" begin="-9s" rotate="auto">
            <mpath href="#ringTL"/>
          </animateMotion>
        </circle>

        {/* On bottom-right cluster */}
        <circle r="5" fill="#F5C842" opacity="0.7">
          <animateMotion dur="24s" repeatCount="indefinite" begin="-12s" rotate="auto">
            <mpath href="#ringBR"/>
          </animateMotion>
        </circle>
      </svg>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
