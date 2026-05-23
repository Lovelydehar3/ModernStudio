import { memo } from "react";
import WeddingVideographer from "./personas/WeddingVideographer";
import FashionPhotographer from "./personas/FashionPhotographer";
import CinematicStoryteller from "./personas/CinematicStoryteller";

const PhotographerScene = memo(function PhotographerScene({ sceneRef, personaRefs = [] }) {
  return (
    <div
      ref={sceneRef}
      className="login-scene-bg relative hidden md:flex md:w-1/2 lg:w-1/2 flex-col items-center justify-center overflow-hidden"
    >
      {/* Grid overlay */}
      <div className="grid-overlay absolute inset-0 opacity-30 pointer-events-none" />

      {/* Ambient orbs */}
      <div className="absolute top-[15%] left-[20%] w-48 h-48 rounded-full bg-[var(--accent-pink)]/8 blur-[80px] animate-float-gentle pointer-events-none" />
      <div className="absolute bottom-[20%] right-[15%] w-40 h-40 rounded-full bg-[var(--accent-purple)]/6 blur-[70px] animate-float-gentle pointer-events-none" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[50%] left-[50%] w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-light)]/5 blur-[60px] animate-float-gentle pointer-events-none" style={{ animationDelay: "4s" }} />

      {/* Personas */}
      <div className="relative z-10 flex items-end justify-center gap-4 lg:gap-8 h-full pt-16 pb-12">
        {/* Wedding Videographer - left */}
        <div ref={personaRefs[0]} className="w-28 lg:w-36 xl:w-44 shrink-0 opacity-0" data-persona="videographer">
          <WeddingVideographer className="w-full h-auto" />
        </div>

        {/* Cinematic Storyteller - center back */}
        <div ref={personaRefs[1]} className="w-24 lg:w-32 xl:w-40 shrink-0 opacity-0 -mt-8" data-persona="storyteller">
          <CinematicStoryteller className="w-full h-auto" />
        </div>

        {/* Fashion Photographer - right */}
        <div ref={personaRefs[2]} className="w-28 lg:w-36 xl:w-44 shrink-0 opacity-0" data-persona="fashion">
          <FashionPhotographer className="w-full h-auto" />
        </div>
      </div>

      {/* Scene label */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">
          The Artists
        </p>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)]/80 to-transparent pointer-events-none" />
    </div>
  );
});

export default PhotographerScene;
