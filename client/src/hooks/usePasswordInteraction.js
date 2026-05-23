import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

const PRIVACY_ROTATIONS = {
  videographer: 18,
  fashion: 14,
  storyteller: 16
};

const PEEK_LIFT = 5;

export default function usePasswordInteraction(sceneRef, { passwordRef, toggleRef }) {
  const stateRef = useRef("idle");
  const timelineRef = useRef(null);
  const ctxRef = useRef(null);

  const getPersonaCameras = useCallback(() => {
    const scene = sceneRef?.current;
    if (!scene) return [];
    return [
      { el: scene.querySelector('[data-persona="videographer"] [data-anim="camera"]'), rotation: PRIVACY_ROTATIONS.videographer },
      { el: scene.querySelector('[data-persona="fashion"] [data-anim="camera"]'), rotation: PRIVACY_ROTATIONS.fashion },
      { el: scene.querySelector('[data-persona="storyteller"] [data-anim="camera"]'), rotation: PRIVACY_ROTATIONS.storyteller }
    ].filter((p) => p.el);
  }, [sceneRef]);

  const getGlows = useCallback(() => {
    const scene = sceneRef?.current;
    if (!scene) return [];
    return scene.querySelectorAll('[data-anim="glow"]');
  }, [sceneRef]);

  useEffect(() => {
    const password = passwordRef?.current;
    const toggle = toggleRef?.current;
    if (!password) return;

    ctxRef.current = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      const cameras = getPersonaCameras();
      const glows = getGlows();

      cameras.forEach(({ el, rotation }) => {
        tl.to(el, {
          rotation: rotation,
          transformOrigin: "50% 20%",
          duration: 0.7,
          ease: "power2.inOut"
        }, 0);
      });

      if (glows.length) {
        tl.to(glows, {
          opacity: 0.04,
          duration: 0.5
        }, 0);
      }

      timelineRef.current = tl;

      const handleFocus = () => {
        if (stateRef.current === "peek") return;
        stateRef.current = "privacy";
        tl.play();
      };

      const handleBlur = () => {
        if (stateRef.current === "peek") return;
        stateRef.current = "idle";
        tl.reverse();
      };

      const handleToggle = () => {
        if (stateRef.current === "privacy") {
          stateRef.current = "peek";
          cameras.forEach(({ el }) => {
            gsap.to(el, {
              rotation: `-=${PEEK_LIFT}`,
              duration: 0.35,
              ease: "power2.out"
            });
          });
        } else if (stateRef.current === "peek") {
          stateRef.current = "privacy";
          cameras.forEach(({ el, rotation }) => {
            gsap.to(el, {
              rotation: rotation,
              duration: 0.35,
              ease: "power2.out"
            });
          });
        }
      };

      password.addEventListener("focus", handleFocus);
      password.addEventListener("blur", handleBlur);
      if (toggle) {
        toggle.addEventListener("click", handleToggle);
      }

      return () => {
        password.removeEventListener("focus", handleFocus);
        password.removeEventListener("blur", handleBlur);
        if (toggle) {
          toggle.removeEventListener("click", handleToggle);
        }
      };
    }, sceneRef.current);

    return () => {
      ctxRef.current?.revert();
    };
  }, [sceneRef, passwordRef, toggleRef, getPersonaCameras, getGlows]);
}
