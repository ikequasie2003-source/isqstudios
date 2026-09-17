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

      {/* Topo contour lines + orbiting planets */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* ── Center topo rings ── */}
        <ellipse cx="720" cy="450" rx="680" ry="380" fill="none" stroke="rgba(212,168,48,0.07)" strokeWidth="1" />
        <ellipse cx="720" cy="450" rx="580" ry="310" fill="none" stroke="rgba(212,168,48,0.09)" strokeWidth="1" />
        <ellipse cx="720" cy="450" rx="480" ry="250" fill="none" stroke="rgba(212,168,48,0.11)" strokeWidth="1" />
        <ellipse cx="720" cy="450" rx="380" ry="195" fill="none" stroke="rgba(212,168,48,0.13)" strokeWidth="1" />
        <ellipse cx="720" cy="450" rx="290" ry="148" fill="none" stroke="rgba(212,168,48,0.15)" strokeWidth="1.2" />
        <ellipse cx="720" cy="450" rx="210" ry="108" fill="none" stroke="rgba(212,168,48,0.18)" strokeWidth="1.2" />
        <ellipse cx="720" cy="450" rx="140" ry="72"  fill="none" stroke="rgba(212,168,48,0.22)" strokeWidth="1.5" />
        <ellipse cx="720" cy="450" rx="80"  ry="42"  fill="none" stroke="rgba(212,168,48,0.28)" strokeWidth="1.5" />
        <ellipse cx="720" cy="450" rx="35"  ry="18"  fill="none" stroke="rgba(212,168,48,0.35)" strokeWidth="2"   />

        {/* ── Top-left cluster ── */}
        <ellipse cx="200" cy="150" rx="320" ry="180" fill="none" stroke="rgba(212,168,48,0.05)" strokeWidth="1" />
        <ellipse cx="200" cy="150" rx="240" ry="135" fill="none" stroke="rgba(212,168,48,0.07)" strokeWidth="1" />
        <ellipse cx="200" cy="150" rx="160" ry="90"  fill="none" stroke="rgba(212,168,48,0.09)" strokeWidth="1" />
        <ellipse cx="200" cy="150" rx="90"  ry="50"  fill="none" stroke="rgba(212,168,48,0.12)" strokeWidth="1.2" />

        {/* ── Bottom-right cluster ── */}
        <ellipse cx="1280" cy="780" rx="350" ry="200" fill="none" stroke="rgba(212,168,48,0.05)" strokeWidth="1" />
        <ellipse cx="1280" cy="780" rx="260" ry="150" fill="none" stroke="rgba(212,168,48,0.08)" strokeWidth="1" />
        <ellipse cx="1280" cy="780" rx="170" ry="98"  fill="none" stroke="rgba(212,168,48,0.11)" strokeWidth="1" />
        <ellipse cx="1280" cy="780" rx="90"  ry="52"  fill="none" stroke="rgba(212,168,48,0.15)" strokeWidth="1.2" />

        {/* ── Orbiting planets on center rings ── */}
        {/* Planet on rx=680 ry=380 — slow */}
        <circle r="7" fill="#D4A830" opacity="0.9">
          <animateMotion dur="28s" repeatCount="indefinite">
            <mpath href="#orbit1" />
          </animateMotion>
        </circle>

        {/* Planet on rx=480 ry=250 — medium */}
        <circle r="5" fill="#F5C842" opacity="0.85">
          <animateMotion dur="20s" repeatCount="indefinite" begin="-7s">
            <mpath href="#orbit3" />
          </animateMotion>
        </circle>

        {/* Small moon on rx=380 ry=195 */}
        <circle r="3.5" fill="#B8860B" opacity="0.95">
          <animateMotion dur="15s" repeatCount="indefinite" begin="-3s">
            <mpath href="#orbit4" />
          </animateMotion>
        </circle>

        {/* Tiny planet on rx=210 ry=108 — fast */}
        <circle r="4" fill="#F5C842" opacity="0.8">
          <animateMotion dur="10s" repeatCount="indefinite" begin="-5s">
            <mpath href="#orbit6" />
          </animateMotion>
        </circle>

        {/* Glowing planet on rx=140 ry=72 */}
        <circle r="6" fill="#FFD700" opacity="0.9" filter="url(#glow)">
          <animateMotion dur="8s" repeatCount="indefinite" begin="-2s">
            <mpath href="#orbit7" />
          </animateMotion>
        </circle>

        {/* Planet on top-left cluster rx=240 ry=135 */}
        <circle r="4" fill="#D4A830" opacity="0.75">
          <animateMotion dur="18s" repeatCount="indefinite" begin="-9s">
            <mpath href="#orbitTL" />
          </animateMotion>
        </circle>

        {/* Planet on bottom-right cluster rx=260 ry=150 */}
        <circle r="5" fill="#F5C842" opacity="0.7">
          <animateMotion dur="22s" repeatCount="indefinite" begin="-4s">
            <mpath href="#orbitBR" />
          </animateMotion>
        </circle>

        {/* ── Path definitions for orbits ── */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Center orbits */}
          <path id="orbit1" d="M1400,450 A680,380 0 1,1 1399.9,450" fill="none" transform="translate(720,450) translate(-720,-450)" />
          <path id="orbit3" d="M1200,450 A480,250 0 1,1 1199.9,450" fill="none" transform="translate(720,450) translate(-720,-450)" />
          <path id="orbit4" d="M1100,450 A380,195 0 1,1 1099.9,450" fill="none" transform="translate(720,450) translate(-720,-450)" />
          <path id="orbit6" d="M930,450 A210,108 0 1,1 929.9,450"  fill="none" transform="translate(720,450) translate(-720,-450)" />
          <path id="orbit7" d="M860,450 A140,72  0 1,1 859.9,450"  fill="none" transform="translate(720,450) translate(-720,-450)" />

          {/* Top-left orbit */}
          <path id="orbitTL" d="M440,150 A240,135 0 1,1 439.9,150" fill="none" transform="translate(200,150) translate(-200,-150)" />

          {/* Bottom-right orbit */}
          <path id="orbitBR" d="M1540,780 A260,150 0 1,1 1539.9,780" fill="none" transform="translate(1280,780) translate(-1280,-780)" />
        </defs>
      </svg>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
