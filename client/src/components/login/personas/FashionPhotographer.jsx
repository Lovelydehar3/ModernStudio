import { memo } from "react";

const FashionPhotographer = memo(function FashionPhotographer({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`persona-svg ${className}`}
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <g data-anim="glow" opacity="0.12">
        <circle cx="100" cy="150" r="75" fill="url(#fash-glow)" />
      </g>

      {/* Body */}
      <g data-anim="body" stroke="rgba(240,230,240,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Torso */}
        <path d="M82 145 L80 225 Q80 235 90 237 L110 237 Q120 235 120 225 L118 145" />
        {/* Shoulders */}
        <path d="M82 145 Q72 142 68 150 L65 168" />
        <path d="M118 145 Q128 142 132 150 L135 168" />
        {/* Left arm (holding camera bottom) */}
        <path d="M65 168 L62 185 Q60 195 68 200 L80 205" />
        {/* Right arm (on shutter button) */}
        <path d="M135 168 L138 182 Q140 190 135 195 L120 200" />
        {/* Legs */}
        <path d="M90 237 L88 295 Q86 305 90 307 L94 307" />
        <path d="M110 237 L112 295 Q114 305 110 307 L106 307" />
        {/* Shoes */}
        <path d="M90 307 L80 309 Q76 309 76 305" />
        <path d="M106 307 L116 309 Q120 309 120 305" />
      </g>

      {/* Head */}
      <g data-anim="head" stroke="rgba(240,230,240,0.4)" strokeWidth="1.5" strokeLinecap="round">
        {/* Head shape */}
        <ellipse cx="100" cy="115" rx="17" ry="21" />
        {/* Hair (styled) */}
        <path d="M83 110 Q80 90 100 86 Q120 90 117 110" strokeWidth="2" stroke="rgba(240,230,240,0.25)" />
        <path d="M117 105 Q122 95 118 88" strokeWidth="1.5" stroke="rgba(240,230,240,0.2)" />
        {/* Neck */}
        <path d="M96 136 L96 145" />
        <path d="M104 136 L104 145" />
      </g>

      {/* Camera (medium-format, held at eye level) */}
      <g data-anim="camera" stroke="var(--accent-purple)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Camera body */}
        <rect x="75" y="185" width="30" height="22" rx="3" opacity="0.8" />
        {/* Pentaprism */}
        <path d="M80 185 L85 175 L95 175 L100 185" opacity="0.6" />
        {/* Lens */}
        <circle cx="75" cy="196" r="8" opacity="0.5" />
        <circle cx="75" cy="196" r="4" opacity="0.3" />
        {/* Lens ring */}
        <path d="M67 192 Q65 196 67 200" opacity="0.4" strokeWidth="1" />
        {/* Shutter button */}
        <circle cx="102" cy="183" r="2.5" opacity="0.5" />
        {/* Hot shoe */}
        <path d="M85 173 L95 173" opacity="0.3" strokeWidth="1" />
        {/* Grip texture */}
        <path d="M100 190 L105 190" opacity="0.3" strokeWidth="1" />
        <path d="M100 194 L105 194" opacity="0.3" strokeWidth="1" />
        <path d="M100 198 L105 198" opacity="0.3" strokeWidth="1" />
        {/* Strap */}
        <path d="M75 185 Q60 175 65 165" opacity="0.25" strokeWidth="1" />
      </g>

      {/* Accent glow */}
      <g data-anim="glow" opacity="0.08">
        <circle cx="75" cy="196" r="18" fill="var(--accent-purple)" />
      </g>

      <defs>
        <radialGradient id="fash-glow">
          <stop offset="0%" stopColor="var(--accent-purple)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent-purple)" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
});

export default FashionPhotographer;
