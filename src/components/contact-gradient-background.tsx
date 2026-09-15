import type React from "react";

interface ContactGradientBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export function ContactGradientBackground({ children, className = "" }: ContactGradientBackgroundProps) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${className}`}>
      {/* Main gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #0F0A02 20%, #3A2800 40%, #B8860B 70%, #F5C842 100%)",
        }}
      />

      {/* Dark scrim so text stays readable over bright gold */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Animated waves */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full"
          style={{ animation: "wave1 8s ease-in-out infinite", transformOrigin: "bottom" }}
          viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="rgba(245,200,66,0.15)" d="M0,160L48,176C96,192,192,224,288,218.7C384,213,480,171,576,160C672,149,768,171,864,186.7C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
        </svg>
        <svg
          className="absolute bottom-0 w-full"
          style={{ animation: "wave2 12s ease-in-out infinite", transformOrigin: "bottom" }}
          viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="rgba(184,134,11,0.2)" d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,197.3C840,192,960,160,1080,154.7C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"/>
        </svg>
        <svg
          className="absolute bottom-0 w-full"
          style={{ animation: "wave3 6s ease-in-out infinite", transformOrigin: "bottom" }}
          viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="rgba(245,200,66,0.1)" d="M0,96L80,128C160,160,320,224,480,229.3C640,235,800,181,960,160C1120,139,1280,149,1360,154.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"/>
        </svg>
      </div>

      <style>{`
        @keyframes wave1 {
          0%, 100% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(-3%) scaleY(1.05); }
        }
        @keyframes wave2 {
          0%, 100% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(3%) scaleY(0.95); }
        }
        @keyframes wave3 {
          0%, 100% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(-2%) scaleY(1.08); }
        }
      `}</style>

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-5 bg-repeat"
        style={{
          backgroundImage: 'url("https://cdn.21st.dev/assets/mirror/f5/f55dfc553c100e6da0ad95258a042b4100f0ff4bb03a5313d1f541984275e262.png")',
          backgroundSize: "149.76px",
        }}
      />

      {/* Geometric grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Diagonal lines overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
