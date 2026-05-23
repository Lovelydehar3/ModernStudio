import { useLayoutEffect } from "react";
import { gsap } from "gsap";

const useHeroWordStagger = (containerRef, deps = []) => {
  useLayoutEffect(() => {
    if (!containerRef.current) return undefined;

    const context = gsap.context(() => {
      const words = containerRef.current.querySelectorAll("[data-word]");
      gsap.fromTo(
        words,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 1.2,
          ease: "power3.out"
        }
      );
    }, containerRef);

    return () => context.revert();
  }, deps);
};

export default useHeroWordStagger;
