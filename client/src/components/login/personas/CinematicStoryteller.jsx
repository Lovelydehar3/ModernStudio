import { memo } from "react";

const CinematicStoryteller = memo(function CinematicStoryteller({ className = "" }) {
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
        <circle cx="100" cy="155" r="70" fill="url(#story-glow)" />
      </g>

      {/* Body */}
      <g data-anim="body" stroke="rgba(240,230,240,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Torso */}
        <path d="M82 148 L80 228 Q80 238 90 240 L110 240 Q120 238 120 228 L118 148" />
        {/* Shoulders */}
        <path d="M82 148 Q72 145 68 152 L65 170" />
        <path d="M118 148 Q128 145 132 152 L135 170" />
        {/* Left arm (holding viewfinder) */}
        <path d="M65 170 L60 188 Q57 198 62 202 L72 208" />
        {/* Right arm (gesturing) */}
        <path d="M135 170 L142 185 Q146 192 140 198 L128 205" />
        {/* Legs */}
        <path d="M90 240 L87 298 Q85 308 90 310 L94 310" />
        <path d="M110 240 L113 298 Q115 308 110 310 L106 310" />
        {/* Shoes */}
        <path d="M90 310 L80 312 Q76 312 76 308" />
        <path d="M106 310 L116 312 Q120 312 120 308" />
      </g>

      {/* Head */}
      <g data-anim="head" stroke="rgba(240,230,240,0.4)" strokeWidth="1.5" strokeLinecap="round">
        {/* Head shape */}
        <ellipse cx="100" cy="118" rx="17" ry="21" />
        {/* Hair */}
        <path d="M83 113 Q82 93 100 89 Q118 93 117 113" strokeWidth="2" stroke="rgba(240,230,240,0.25)" />
        {/* Glasses (subtle) */}
        <circle cx="93" cy="115" r="5" opacity="0.3" strokeWidth="1" />
        <circle cx="107" cy="115" r="5" opacity="0.3" strokeWidth="1" />
        <path d="M98 115 L102 115" opacity="0.3" strokeWidth="1" />
        {/* Neck */}
        <path d="M96 139 L96 148" />
        <path d="M104 139 L104 148" />
      </g>

      {/* Director's Viewfinder */}
      <g data-anim="camera" stroke="var(--accent-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Viewfinder body */}
        <rect x="52" y="190" width="28" height="16" rx="3" opacity="0.7" />
        {/* Eyepiece */}
        <rect x="52" y="193" width="8" height="10" rx="2" opacity="0.5" />
        {/* Front element */}
        <circle cx="80" cy="198" r="6" opacity="0.5" />
        <circle cx="80" cy="198" r="3" opacity="0.3" />
        {/* Grip */}
        <path d="M65 206 L65 215 Q65 218 68 218 L72 218" opacity="0.4" />
        {/* Markings */}
        <path d="M58 192 L58 194" opacity="0.3" strokeWidth="1" />
        <path d="M62 192 L62 194" opacity="0.3" strokeWidth="1" />
      </g>

      {/* Clapperboard (floating nearby) */}
      <g stroke="rgba(240,230,240,0.2)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
        {/* Board */}
        <rect x="125" y="175" width="35" height="22" rx="2" />
        {/* Clapper */}
        <path d="M125 175 L160 175" strokeWidth="2" stroke="rgba(240,230,240,0.15)" />
        <path d="M125 175 L130 168 L155 168 L160 175" stroke="rgba(240,230,240,0.15)" />
        {/* Lines on board */}
        <path d="M130 180 L155 180" opacity="0.2" />
        <path d="M130 184 L155 184" opacity="0.2" />
        <path d="M130 188 L145 188" opacity="0.2" />
      </g>

      {/* Accent glow */}
      <g data-anim="glow" opacity="0.08">
        <circle cx="80" cy="198" r="15" fill="var(--accent-light)" />
      </g>

      <defs>
        <radialGradient id="story-glow">
          <stop offset="0%" stopColor="var(--accent-light)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--accent-light)" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
});

export default CinematicStoryteller;
