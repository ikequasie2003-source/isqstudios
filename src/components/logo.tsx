/**
 * ISQ Studios — RC Monogram
 * Interlocked R + C, metallic gold, no wordmark
 */

type LogoProps = {
  className?: string;
  dark?: boolean;
  style?: React.CSSProperties;
};

export function Logo({ className = "h-10 w-auto", dark = false, style }: LogoProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ISQ Studios"
    >
      <defs>
        <linearGradient id="rcGold" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%"   stopColor="#f5e090" />
          <stop offset="20%"  stopColor="#d4a830" />
          <stop offset="45%"  stopColor="#f0cc60" />
          <stop offset="70%"  stopColor="#9a7018" />
          <stop offset="100%" stopColor="#c89828" />
        </linearGradient>
      </defs>

      {/* R — tall, positioned top-left */}
      <text
        x="6"
        y="64"
        fontFamily="'Times New Roman', Georgia, 'Palatino Linotype', serif"
        fontSize="66"
        fontWeight="400"
        fill={dark ? "#e8c96a" : "url(#rcGold)"}
      >
        R
      </text>

      {/* C — overlapping, shifted right and down */}
      <text
        x="26"
        y="74"
        fontFamily="'Times New Roman', Georgia, 'Palatino Linotype', serif"
        fontSize="58"
        fontWeight="400"
        fill={dark ? "#e8c96a" : "url(#rcGold)"}
        opacity="0.95"
      >
        C
      </text>
    </svg>
  );
}

// All variants are just the same mark
export const NavLogo = Logo;
export const FooterLogo = Logo;
export const LogoMark = Logo;
