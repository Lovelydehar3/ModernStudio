import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

const MAX_ROTATION_X = 4;
const MAX_ROTATION_Y = 6;
const EASE_DURATION = 0.5;

export default function useCursorTracking(containerRef, personaRefs) {
  const cursorRef = useRef({ x: 0, y: 0 });
  const isFinePointer = useRef(false);
  const ctxRef = useRef(null);

  const updatePersonas = useCallback(() => {
    const { x, y } = cursorRef.current;
    personaRefs.forEach((ref) => {
      if (!ref.current) return;
      const head = ref.current.querySelector('[data-anim="head"]');
      if (head) {
        gsap.set(head, {
          rotationY: x * MAX_ROTATION_Y,
          rotationX: -y * MAX_ROTATION_X,
          transformPerspective: 400,
          transformOrigin: "center 70%"
        });
      }
    });
  }, [personaRefs]);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    isFinePointer.current = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer.current) return;

    ctxRef.current = gsap.context(() => {
      const xTo = gsap.quickTo(cursorRef.current, "x", {
        duration: EASE_DURATION,
        ease: "power2.out",
        onUpdate: updatePersonas
      });
      const yTo = gsap.quickTo(cursorRef.current, "y", {
        duration: EASE_DURATION,
        ease: "power2.out",
        onUpdate: updatePersonas
      });

      const handleMove = (e) => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const normalizedX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
        const normalizedY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));
        xTo(normalizedX);
        yTo(normalizedY);
      };

      const handleLeave = () => {
        xTo(0);
        yTo(0);
      };

      container.addEventListener("mousemove", handleMove, { passive: true });
      container.addEventListener("mouseleave", handleLeave);

      return () => {
        container.removeEventListener("mousemove", handleMove);
        container.removeEventListener("mouseleave", handleLeave);
      };
    }, container);

    return () => {
      ctxRef.current?.revert();
    };
  }, [containerRef, updatePersonas]);
}
