import type React from "react";

interface AboutBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export function AboutBackground({ children, className = "" }: AboutBackgroundProps) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${className}`}>
      {/* Base dark background */}
      <div className="absolute inset-0" style={{ background: "#0A0803" }} />

      {/* Floating golden paths */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Path 1 — slow wide arc */}
        <path
          d="M-100,400 C200,100 600,700 900,300 C1100,50 1300,500 1600,200"
          fill="none"
          stroke="rgba(212,168,48,0.18)"
          strokeWidth="2.5"
          style={{ animation: "floatPath1 14s ease-in-out infinite" }}
        />
        {/* Path 2 — mid speed */}
        <path
          d="M0,600 C300,200 700,800 1000,400 C1200,150 1400,600 1500,350"
          fill="none"
          stroke="rgba(245,200,66,0.12)"
          strokeWidth="1.5"
          style={{ animation: "floatPath2 10s ease-in-out infinite" }}
        />
        {/* Path 3 — fast thin */}
        <path
          d="M100,200 C400,500 800,100 1100,450 C1300,700 1400,300 1500,500"
          fill="none"
          stroke="rgba(184,134,11,0.2)"
          strokeWidth="2"
          style={{ animation: "floatPath3 18s ease-in-out infinite" }}
        />
        {/* Path 4 — diagonal drift */}
        <path
          d="M-200,700 C100,300 500,900 800,500 C1000,250 1200,700 1600,400"
          fill="none"
          stroke="rgba(245,200,66,0.08)"
          strokeWidth="3"
          style={{ animation: "floatPath4 22s ease-in-out infinite" }}
        />
        {/* Path 5 — tight wave */}
        <path
          d="M0,450 C150,350 300,550 450,450 C600,350 750,550 900,450 C1050,350 1200,550 1440,450"
          fill="none"
          stroke="rgba(212,168,48,0.15)"
          strokeWidth="1"
          style={{ animation: "floatPath5 8s ease-in-out infinite" }}
        />
        {/* Glowing orb 1 */}
        <circle cx="300" cy="250" r="180" fill="rgba(212,168,48,0.04)"
          style={{ animation: "orb1 12s ease-in-out infinite" }} />
        {/* Glowing orb 2 */}
        <circle cx="1100" cy="600" r="220" fill="rgba(245,200,66,0.05)"
          style={{ animation: "orb2 16s ease-in-out infinite" }} />
        {/* Glowing orb 3 */}
        <circle cx="750" cy="150" r="120" fill="rgba(184,134,11,0.06)"
          style={{ animation: "orb3 9s ease-in-out infinite" }} />
      </svg>

      <style>{`
        @keyframes floatPath1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-30px) translateX(15px); }
          66% { transform: translateY(20px) translateX(-10px); }
        }
        @keyframes floatPath2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(25px) translateX(-20px); }
        }
        @keyframes floatPath3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(15px) translateX(25px); }
          66% { transform: translateY(-20px) translateX(-15px); }
        }
        @keyframes floatPath4 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-40px); }
        }
        @keyframes floatPath5 {
          0%, 100% { transform: translateX(0px) scaleY(1); }
          50% { transform: translateX(-30px) scaleY(1.1); }
        }
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          50% { transform: translate(40px, -30px); opacity: 1; }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.5; }
          50% { transform: translate(-50px, 30px); opacity: 0.9; }
        }
        @keyframes orb3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          50% { transform: translate(20px, 20px) scale(1.2); opacity: 1; }
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
