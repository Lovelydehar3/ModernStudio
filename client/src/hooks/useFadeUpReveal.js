import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useFadeUpReveal = (containerRef, deps = []) => {
  useLayoutEffect(() => {
    if (!containerRef.current) return undefined;

    const context = gsap.context(() => {
      const items = containerRef.current.querySelectorAll("[data-reveal]");
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 86%"
            }
          }
        );
      });
    }, containerRef);

    return () => context.revert();
  }, deps);
};

export default useFadeUpReveal;
