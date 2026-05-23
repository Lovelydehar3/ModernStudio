/**
 * Decorative floral SVG accents for wedding aesthetic.
 * Pure CSS/SVG - no external images needed.
 */

export function RoseCorner({ className = "", position = "top-right" }) {
  const positionClasses = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0 -scale-x-100",
    "bottom-right": "bottom-0 right-0 -scale-y-100",
    "bottom-left": "bottom-0 left-0 -scale-x-100 -scale-y-100"
  };

  return (
    <div className={`absolute pointer-events-none ${positionClasses[position]} ${className}`}>
      <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Rose bloom */}
        <g opacity="0.15">
          <path d="M140 40C140 40 160 60 150 80C140 100 120 90 120 90C120 90 140 110 120 130C100 150 80 130 80 130C80 130 100 150 80 160C60 170 50 150 50 150" stroke="var(--accent-pink)" strokeWidth="2" fill="none"/>
          <path d="M135 45C135 45 155 65 145 85C135 105 115 95 115 95" stroke="var(--accent-purple)" strokeWidth="1.5" fill="none"/>
          <circle cx="140" cy="40" r="8" fill="var(--accent-pink)" opacity="0.3"/>
          <circle cx="120" cy="90" r="6" fill="var(--accent-purple)" opacity="0.25"/>
          <circle cx="80" cy="130" r="7" fill="var(--accent-light)" opacity="0.2"/>
        </g>
        {/* Leaves */}
        <g opacity="0.12">
          <path d="M160 30C160 30 170 50 155 60C140 70 135 55 135 55C135 55 150 65 145 80" stroke="#8b9e6b" strokeWidth="1.5" fill="none"/>
          <path d="M100 140C100 140 115 155 105 165C95 175 85 160 85 160" stroke="#8b9e6b" strokeWidth="1.5" fill="none"/>
          <ellipse cx="165" cy="35" rx="12" ry="6" fill="#8b9e6b" opacity="0.3" transform="rotate(-30 165 35)"/>
          <ellipse cx="95" cy="150" rx="10" ry="5" fill="#8b9e6b" opacity="0.25" transform="rotate(20 95 150)"/>
        </g>
        {/* Small buds */}
        <g opacity="0.2">
          <circle cx="170" cy="20" r="4" fill="var(--accent-pink)"/>
          <circle cx="165" cy="28" r="3" fill="var(--accent-purple)"/>
          <circle cx="90" cy="165" r="3.5" fill="var(--accent-pink)"/>
        </g>
      </svg>
    </div>
  );
}

export function FloralDivider({ className = "" }) {
  return (
    <div className={`relative flex items-center justify-center py-8 ${className}`}>
      <svg width="300" height="40" viewBox="0 0 300 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
        {/* Center rose */}
        <circle cx="150" cy="20" r="8" fill="var(--accent-pink)" opacity="0.4"/>
        <circle cx="150" cy="20" r="5" fill="var(--accent-purple)" opacity="0.5"/>
        <circle cx="150" cy="20" r="2.5" fill="var(--accent-light)"/>

        {/* Left branch */}
        <path d="M142 20C120 20 100 18 70 20C50 21 30 20 10 20" stroke="var(--accent-pink)" strokeWidth="1" opacity="0.5"/>
        <path d="M120 20C118 15 115 12 110 14C105 16 108 20 112 20" stroke="#8b9e6b" strokeWidth="1" fill="none" opacity="0.4"/>
        <path d="M90 20C88 16 85 14 80 16C75 18 78 20 82 20" stroke="#8b9e6b" strokeWidth="1" fill="none" opacity="0.4"/>
        <circle cx="110" cy="14" r="3" fill="var(--accent-purple)" opacity="0.3"/>
        <circle cx="80" cy="16" r="2.5" fill="var(--accent-pink)" opacity="0.25"/>

        {/* Right branch */}
        <path d="M158 20C180 20 200 18 230 20C250 21 270 20 290 20" stroke="var(--accent-pink)" strokeWidth="1" opacity="0.5"/>
        <path d="M180 20C182 15 185 12 190 14C195 16 192 20 188 20" stroke="#8b9e6b" strokeWidth="1" fill="none" opacity="0.4"/>
        <path d="M210 20C212 16 215 14 220 16C225 18 222 20 218 20" stroke="#8b9e6b" strokeWidth="1" fill="none" opacity="0.4"/>
        <circle cx="190" cy="14" r="3" fill="var(--accent-purple)" opacity="0.3"/>
        <circle cx="220" cy="16" r="2.5" fill="var(--accent-pink)" opacity="0.25"/>
      </svg>
    </div>
  );
}

export function PetalScatter({ className = "" }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Scattered petals */}
      <div className="absolute top-[10%] left-[5%] w-3 h-3 rounded-full bg-[var(--accent-pink)]/10 animate-float-gentle" />
      <div className="absolute top-[20%] right-[8%] w-2 h-2 rounded-full bg-[var(--accent-purple)]/15 animate-float-gentle" style={{ animationDelay: "1s" }} />
      <div className="absolute top-[60%] left-[12%] w-2.5 h-2.5 rounded-full bg-[var(--accent-light)]/12 animate-float-gentle" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[40%] right-[15%] w-3 h-3 rounded-full bg-[var(--accent-pink)]/8 animate-float-gentle" style={{ animationDelay: "3s" }} />
      <div className="absolute top-[80%] left-[20%] w-2 h-2 rounded-full bg-[var(--accent-purple)]/10 animate-float-gentle" style={{ animationDelay: "4s" }} />
      <div className="absolute top-[30%] right-[25%] w-2.5 h-2.5 rounded-full bg-[var(--accent-light)]/15 animate-float-gentle" style={{ animationDelay: "1.5s" }} />
    </div>
  );
}

export function RoseWatermark({ className = "" }) {
  return (
    <svg className={`opacity-[0.04] ${className}`} width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(100,100)">
        {/* Rose petals in spiral */}
        <path d="M0,-30 C15,-25 25,-10 20,5 C15,20 0,25 -10,20 C-20,15 -25,0 -20,-12 C-15,-24 -5,-30 0,-30Z" fill="var(--accent-pink)"/>
        <path d="M0,-20 C10,-18 18,-5 15,5 C12,15 0,18 -8,15 C-16,12 -18,0 -15,-8 C-12,-16 -5,-20 0,-20Z" fill="var(--accent-purple)"/>
        <path d="M0,-12 C6,-10 10,-3 8,3 C6,9 0,12 -5,10 C-10,8 -10,0 -8,-4 C-6,-8 -2,-12 0,-12Z" fill="var(--accent-light)"/>
        {/* Leaves */}
        <path d="M-30,20 C-25,30 -15,35 -5,30 C5,25 0,15 -10,10 C-20,5 -30,10 -30,20Z" fill="#8b9e6b" opacity="0.5"/>
        <path d="M25,25 C30,35 20,40 10,35 C0,30 5,20 15,15 C25,10 25,15 25,25Z" fill="#8b9e6b" opacity="0.4"/>
      </g>
    </svg>
  );
}
