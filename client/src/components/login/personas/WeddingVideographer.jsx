import { memo } from "react";

const WeddingVideographer = memo(function WeddingVideographer({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`persona-svg ${className}`}
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <g data-anim="glow" opacity="0.15">
        <circle cx="100" cy="160" r="80" fill="url(#vid-glow)" />
      </g>

      {/* Body */}
      <g data-anim="body" stroke="rgba(240,230,240,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Torso */}
        <path d="M80 140 L80 220 Q80 230 90 232 L110 232 Q120 230 120 220 L120 140" />
        {/* Shoulders */}
        <path d="M80 140 Q70 138 65 145 L60 165" />
        <path d="M120 140 Q130 138 135 145 L140 165" />
        {/* Left arm (supporting camera) */}
        <path d="M60 165 L55 185 Q52 195 58 200 L75 210" />
        {/* Right arm (on camera grip) */}
        <path d="M140 165 L145 180 Q148 190 142 195 L125 200" />
        {/* Legs */}
        <path d="M90 232 L85 290 Q83 300 88 302 L92 302" />
        <path d="M110 232 L115 290 Q117 300 112 302 L108 302" />
        {/* Shoes */}
        <path d="M88 302 L78 304 Q74 304 74 300" />
        <path d="M108 302 L118 304 Q122 304 122 300" />
      </g>

      {/* Head */}
      <g data-anim="head" stroke="rgba(240,230,240,0.4)" strokeWidth="1.5" strokeLinecap="round">
        {/* Head shape */}
        <ellipse cx="100" cy="110" rx="18" ry="22" />
        {/* Hair */}
        <path d="M82 105 Q82 85 100 82 Q118 85 118 105" strokeWidth="2" stroke="rgba(240,230,240,0.25)" />
        {/* Neck */}
        <path d="M95 132 L95 140" />
        <path d="M105 132 L105 140" />
      </g>

      {/* Camera Rig */}
      <g data-anim="camera" stroke="var(--accent-pink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Shoulder mount */}
        <path d="M65 155 Q60 150 65 145 L85 140" strokeWidth="2" opacity="0.6" />
        {/* Camera body */}
        <rect x="50" y="175" width="35" height="25" rx="3" opacity="0.8" />
        {/* Lens hood */}
        <path d="M50 182 L35 178 L35 192 L50 188" opacity="0.7" />
        {/* Lens */}
        <circle cx="35" cy="185" r="6" opacity="0.5" />
        {/* Viewfinder */}
        <rect x="55" y="170" width="12" height="8" rx="2" opacity="0.6" />
        {/* Follow focus */}
        <circle cx="30" cy="185" r="3" opacity="0.4" strokeWidth="1" />
        {/* Matte box */}
        <path d="M38 175 L28 172 L28 198 L38 195" opacity="0.4" strokeWidth="1" />
        {/* Grip */}
        <path d="M85 185 L95 190 L95 200 L85 195" opacity="0.5" />
        {/* Recording light */}
        <circle cx="68" cy="173" r="2" fill="var(--accent-pink)" opacity="0.6" />
      </g>

      {/* Accent glow on equipment */}
      <g data-anim="glow" opacity="0.1">
        <circle cx="35" cy="185" r="15" fill="var(--accent-pink)" />
        <circle cx="68" cy="185" r="10" fill="var(--accent-pink)" />
      </g>

      <defs>
        <radialGradient id="vid-glow">
          <stop offset="0%" stopColor="var(--accent-pink)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent-pink)" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
});

export default WeddingVideographer;
