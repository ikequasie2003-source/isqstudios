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

      {/* Topo contour lines SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Outer contours — slow */}
        <ellipse cx="720" cy="450" rx="680" ry="380" fill="none" stroke="rgba(212,168,48,0.07)" strokeWidth="1"
          style={{ animation: "topoScale 20s ease-in-out infinite" }} />
        <ellipse cx="720" cy="450" rx="580" ry="310" fill="none" stroke="rgba(212,168,48,0.09)" strokeWidth="1"
          style={{ animation: "topoScale 20s ease-in-out infinite 0.5s" }} />
        <ellipse cx="720" cy="450" rx="480" ry="250" fill="none" stroke="rgba(212,168,48,0.11)" strokeWidth="1"
          style={{ animation: "topoScale 20s ease-in-out infinite 1s" }} />
        <ellipse cx="720" cy="450" rx="380" ry="195" fill="none" stroke="rgba(212,168,48,0.13)" strokeWidth="1"
          style={{ animation: "topoScale 20s ease-in-out infinite 1.5s" }} />
        <ellipse cx="720" cy="450" rx="290" ry="148" fill="none" stroke="rgba(212,168,48,0.15)" strokeWidth="1.2"
          style={{ animation: "topoScale 20s ease-in-out infinite 2s" }} />
        <ellipse cx="720" cy="450" rx="210" ry="108" fill="none" stroke="rgba(212,168,48,0.18)" strokeWidth="1.2"
          style={{ animation: "topoScale 20s ease-in-out infinite 2.5s" }} />
        <ellipse cx="720" cy="450" rx="140" ry="72" fill="none" stroke="rgba(212,168,48,0.22)" strokeWidth="1.5"
          style={{ animation: "topoScale 20s ease-in-out infinite 3s" }} />
        <ellipse cx="720" cy="450" rx="80" ry="42" fill="none" stroke="rgba(212,168,48,0.28)" strokeWidth="1.5"
          style={{ animation: "topoScale 20s ease-in-out infinite 3.5s" }} />
        <ellipse cx="720" cy="450" rx="35" ry="18" fill="none" stroke="rgba(212,168,48,0.35)" strokeWidth="2"
          style={{ animation: "topoScale 20s ease-in-out infinite 4s" }} />

        {/* Secondary topo cluster — top left */}
        <ellipse cx="200" cy="150" rx="320" ry="180" fill="none" stroke="rgba(212,168,48,0.05)" strokeWidth="1"
          style={{ animation: "topoScale 25s ease-in-out infinite 2s" }} />
        <ellipse cx="200" cy="150" rx="240" ry="135" fill="none" stroke="rgba(212,168,48,0.07)" strokeWidth="1"
          style={{ animation: "topoScale 25s ease-in-out infinite 2.8s" }} />
        <ellipse cx="200" cy="150" rx="160" ry="90" fill="none" stroke="rgba(212,168,48,0.09)" strokeWidth="1"
          style={{ animation: "topoScale 25s ease-in-out infinite 3.6s" }} />
        <ellipse cx="200" cy="150" rx="90" ry="50" fill="none" stroke="rgba(212,168,48,0.12)" strokeWidth="1.2"
          style={{ animation: "topoScale 25s ease-in-out infinite 4.4s" }} />

        {/* Secondary topo cluster — bottom right */}
        <ellipse cx="1280" cy="780" rx="350" ry="200" fill="none" stroke="rgba(212,168,48,0.05)" strokeWidth="1"
          style={{ animation: "topoScale 18s ease-in-out infinite 1s" }} />
        <ellipse cx="1280" cy="780" rx="260" ry="150" fill="none" stroke="rgba(212,168,48,0.08)" strokeWidth="1"
          style={{ animation: "topoScale 18s ease-in-out infinite 1.8s" }} />
        <ellipse cx="1280" cy="780" rx="170" ry="98" fill="none" stroke="rgba(212,168,48,0.11)" strokeWidth="1"
          style={{ animation: "topoScale 18s ease-in-out infinite 2.6s" }} />
        <ellipse cx="1280" cy="780" rx="90" ry="52" fill="none" stroke="rgba(212,168,48,0.15)" strokeWidth="1.2"
          style={{ animation: "topoScale 18s ease-in-out infinite 3.4s" }} />

        {/* Subtle glow at center peak */}
        <ellipse cx="720" cy="450" rx="60" ry="32" fill="rgba(212,168,48,0.04)"
          style={{ animation: "topoGlow 4s ease-in-out infinite" }} />
      </svg>

      <style>{`
        @keyframes topoScale {
          0%, 100% { transform-origin: center; transform: scale(1); opacity: 1; }
          50% { transform-origin: center; transform: scale(1.04); opacity: 0.7; }
        }
        @keyframes topoGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
