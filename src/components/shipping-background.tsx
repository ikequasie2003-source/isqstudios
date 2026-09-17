import type React from "react";

interface ShippingBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export function ShippingBackground({ children, className = "" }: ShippingBackgroundProps) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0" style={{ background: "#0A0803" }} />

      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Center cluster orbits */}
          <path id="ring1" d="M 1400,450 A 680,380 0 1,1 1399.99,450.01" fill="none"/>
          <path id="ring2" d="M 1300,450 A 580,310 0 1,1 1299.99,450.01" fill="none"/>
          <path id="ring3" d="M 1200,450 A 480,250 0 1,1 1199.99,450.01" fill="none"/>
          <path id="ring4" d="M 1100,450 A 380,195 0 1,1 1099.99,450.01" fill="none"/>
          <path id="ring5" d="M 1010,450 A 290,148 0 1,1 1009.99,450.01" fill="none"/>
          <path id="ring6" d="M 930,450  A 210,108 0 1,1 929.99,450.01"  fill="none"/>
          <path id="ring7" d="M 860,450  A 140,72  0 1,1 859.99,450.01"  fill="none"/>
          <path id="ring8" d="M 800,450  A 80,42   0 1,1 799.99,450.01"  fill="none"/>
          <path id="ring9" d="M 755,450  A 35,18   0 1,1 754.99,450.01"  fill="none"/>

          {/* Top-left cluster */}
          <path id="ringTL1" d="M 520,150  A 320,180 0 1,1 519.99,150.01" fill="none"/>
          <path id="ringTL2" d="M 440,150  A 240,135 0 1,1 439.99,150.01" fill="none"/>
          <path id="ringTL3" d="M 360,150  A 160,90  0 1,1 359.99,150.01" fill="none"/>
          <path id="ringTL4" d="M 290,150  A 90,50   0 1,1 289.99,150.01" fill="none"/>

          {/* Bottom-right cluster */}
          <path id="ringBR1" d="M 1630,780 A 350,200 0 1,1 1629.99,780.01" fill="none"/>
          <path id="ringBR2" d="M 1540,780 A 260,150 0 1,1 1539.99,780.01" fill="none"/>
          <path id="ringBR3" d="M 1450,780 A 170,98  0 1,1 1449.99,780.01" fill="none"/>
          <path id="ringBR4" d="M 1370,780 A 90,52   0 1,1 1369.99,780.01" fill="none"/>
        </defs>

        {/* ── Center rings ── */}
        <use href="#ring1" stroke="rgba(212,168,48,0.07)" strokeWidth="1" fill="none"/>
        <use href="#ring2" stroke="rgba(212,168,48,0.09)" strokeWidth="1" fill="none"/>
        <use href="#ring3" stroke="rgba(212,168,48,0.11)" strokeWidth="1" fill="none"/>
        <use href="#ring4" stroke="rgba(212,168,48,0.13)" strokeWidth="1" fill="none"/>
        <use href="#ring5" stroke="rgba(212,168,48,0.15)" strokeWidth="1.2" fill="none"/>
        <use href="#ring6" stroke="rgba(212,168,48,0.18)" strokeWidth="1.2" fill="none"/>
        <use href="#ring7" stroke="rgba(212,168,48,0.22)" strokeWidth="1.5" fill="none"/>
        <use href="#ring8" stroke="rgba(212,168,48,0.28)" strokeWidth="1.5" fill="none"/>
        <use href="#ring9" stroke="rgba(212,168,48,0.35)" strokeWidth="2"   fill="none"/>

        {/* ── Top-left rings ── */}
        <use href="#ringTL1" stroke="rgba(212,168,48,0.05)" strokeWidth="1" fill="none"/>
        <use href="#ringTL2" stroke="rgba(212,168,48,0.07)" strokeWidth="1" fill="none"/>
        <use href="#ringTL3" stroke="rgba(212,168,48,0.09)" strokeWidth="1" fill="none"/>
        <use href="#ringTL4" stroke="rgba(212,168,48,0.12)" strokeWidth="1.2" fill="none"/>

        {/* ── Bottom-right rings ── */}
        <use href="#ringBR1" stroke="rgba(212,168,48,0.05)" strokeWidth="1" fill="none"/>
        <use href="#ringBR2" stroke="rgba(212,168,48,0.08)" strokeWidth="1" fill="none"/>
        <use href="#ringBR3" stroke="rgba(212,168,48,0.11)" strokeWidth="1" fill="none"/>
        <use href="#ringBR4" stroke="rgba(212,168,48,0.15)" strokeWidth="1.2" fill="none"/>

        {/* ══ PLANETS — one per ring ══ */}

        {/* Center ring1 */}
        <circle r="18" fill="#D4A830" opacity="0.9">
          <animateMotion dur="32s" repeatCount="indefinite" rotate="auto"><mpath href="#ring1"/></animateMotion>
        </circle>
        {/* Center ring2 */}
        <circle r="14" fill="#F5C842" opacity="0.8">
          <animateMotion dur="27s" repeatCount="indefinite" begin="-10s" rotate="auto"><mpath href="#ring2"/></animateMotion>
        </circle>
        {/* Center ring3 */}
        <circle r="15" fill="#B8860B" opacity="0.85">
          <animateMotion dur="22s" repeatCount="indefinite" begin="-5s" rotate="auto"><mpath href="#ring3"/></animateMotion>
        </circle>
        {/* Center ring4 */}
        <circle r="12" fill="#FFD700" opacity="0.9">
          <animateMotion dur="17s" repeatCount="indefinite" begin="-7s" rotate="auto"><mpath href="#ring4"/></animateMotion>
        </circle>
        {/* Center ring5 */}
        <circle r="11" fill="#D4A830" opacity="0.85">
          <animateMotion dur="13s" repeatCount="indefinite" begin="-3s" rotate="auto"><mpath href="#ring5"/></animateMotion>
        </circle>
        {/* Center ring6 */}
        <circle r="12" fill="#F5C842" opacity="0.8">
          <animateMotion dur="10s" repeatCount="indefinite" begin="-6s" rotate="auto"><mpath href="#ring6"/></animateMotion>
        </circle>
        {/* Center ring7 — glowing */}
        <circle r="20" fill="#FFD700" opacity="0.95" filter="url(#glow)">
          <animateMotion dur="8s" repeatCount="indefinite" begin="-2s" rotate="auto"><mpath href="#ring7"/></animateMotion>
        </circle>
        {/* Center ring8 */}
        <circle r="9" fill="#D4A830" opacity="0.8">
          <animateMotion dur="6s" repeatCount="indefinite" begin="-1s" rotate="auto"><mpath href="#ring8"/></animateMotion>
        </circle>
        {/* Center ring9 (innermost) */}
        <circle r="8" fill="#FFD700" opacity="0.9">
          <animateMotion dur="4s" repeatCount="indefinite" begin="-2s" rotate="auto"><mpath href="#ring9"/></animateMotion>
        </circle>

        {/* Top-left ringTL1 */}
        <circle r="12" fill="#D4A830" opacity="0.7">
          <animateMotion dur="24s" repeatCount="indefinite" begin="-12s" rotate="auto"><mpath href="#ringTL1"/></animateMotion>
        </circle>
        {/* Top-left ringTL2 */}
        <circle r="11" fill="#F5C842" opacity="0.75">
          <animateMotion dur="18s" repeatCount="indefinite" begin="-6s" rotate="auto"><mpath href="#ringTL2"/></animateMotion>
        </circle>
        {/* Top-left ringTL3 */}
        <circle r="9" fill="#B8860B" opacity="0.8">
          <animateMotion dur="12s" repeatCount="indefinite" begin="-4s" rotate="auto"><mpath href="#ringTL3"/></animateMotion>
        </circle>
        {/* Top-left ringTL4 */}
        <circle r="8" fill="#FFD700" opacity="0.85">
          <animateMotion dur="8s" repeatCount="indefinite" begin="-3s" rotate="auto"><mpath href="#ringTL4"/></animateMotion>
        </circle>

        {/* Bottom-right ringBR1 */}
        <circle r="15" fill="#D4A830" opacity="0.7">
          <animateMotion dur="28s" repeatCount="indefinite" begin="-14s" rotate="auto"><mpath href="#ringBR1"/></animateMotion>
        </circle>
        {/* Bottom-right ringBR2 */}
        <circle r="12" fill="#F5C842" opacity="0.75">
          <animateMotion dur="22s" repeatCount="indefinite" begin="-8s" rotate="auto"><mpath href="#ringBR2"/></animateMotion>
        </circle>
        {/* Bottom-right ringBR3 */}
        <circle r="11" fill="#B8860B" opacity="0.8">
          <animateMotion dur="15s" repeatCount="indefinite" begin="-5s" rotate="auto"><mpath href="#ringBR3"/></animateMotion>
        </circle>
        {/* Bottom-right ringBR4 */}
        <circle r="9" fill="#FFD700" opacity="0.9">
          <animateMotion dur="9s" repeatCount="indefinite" begin="-2s" rotate="auto"><mpath href="#ringBR4"/></animateMotion>
        </circle>
      </svg>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
