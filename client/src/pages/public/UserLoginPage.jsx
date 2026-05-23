import { useRef, useLayoutEffect, createRef } from "react";
import { gsap } from "gsap";
import SEO from "../../components/common/SEO";
import PhotographerScene from "../../components/login/PhotographerScene";
import GlassAuthPanel from "../../components/login/GlassAuthPanel";
import useCursorTracking from "../../hooks/useCursorTracking";
import usePasswordInteraction from "../../hooks/usePasswordInteraction";
import useAuthFlow from "../../hooks/useAuthFlow";

const personaKeys = ["videographer", "storyteller", "fashion"];

function UserLoginPage() {
  const sceneRef = useRef(null);
  const panelRef = useRef(null);
  const passwordRef = useRef(null);
  const toggleRef = useRef(null);

  const personaRefs = useRef(personaKeys.map(() => createRef()));

  useCursorTracking(sceneRef, personaRefs.current);

  usePasswordInteraction(sceneRef, {
    passwordRef,
    toggleRef
  });

  const authFlow = useAuthFlow();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(panelRef.current, {
        opacity: 0,
        x: 40,
        duration: 0.9
      });

      personaKeys.forEach((key, i) => {
        const el = sceneRef.current?.querySelector(`[data-persona="${key}"]`);
        if (el) {
          tl.fromTo(
            el,
            { opacity: 0, y: 50, scale: 0.92 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8 },
            `-=${i === 0 ? 0.4 : 0.55}`
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <SEO title="Sign In" description="Sign in to your account to book sessions and manage your bookings." />
      <div className="flex min-h-screen flex-col md:flex-row">
        <PhotographerScene
          sceneRef={sceneRef}
          personaRefs={personaRefs.current}
        />
        <div ref={panelRef} className="flex-1">
          <GlassAuthPanel
            authFlow={authFlow}
            passwordRef={passwordRef}
            toggleRef={toggleRef}
          />
        </div>
      </div>
    </>
  );
}

export default UserLoginPage;
