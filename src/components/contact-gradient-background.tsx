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
