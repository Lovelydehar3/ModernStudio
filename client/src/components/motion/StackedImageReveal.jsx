import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { optimizeCloudinaryImage } from "../../utils/cloudinary";

gsap.registerPlugin(ScrollTrigger);

function StackedImageReveal({
  images = [],
  eyebrow = "Mood",
  title = "Moving Pictures",
  description = "A pinned, scroll-driven stack reveal inspired by modern agency motion."
}) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return undefined;

    const context = gsap.context(() => {
      const panels = gsap.utils.toArray(".stack-panel");
      if (!panels.length) return;

      gsap.set(panels, { willChange: "transform, opacity" });
      gsap.set(panels, { yPercent: 0, opacity: 1 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${Math.max(1, panels.length - 1) * 700}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      panels.slice(0, -1).forEach((panel) => {
        timeline.to(panel, { yPercent: -18, opacity: 0, duration: 1, ease: "none" });
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden px-6">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 py-16 lg:grid-cols-2">
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--accent-pink)]">{eyebrow}</p>
          <h2 className="mt-4 font-heading text-6xl uppercase text-[var(--text-primary)] md:text-7xl">{title}</h2>
          <p className="mt-5 max-w-xl text-[var(--text-secondary)]">{description}</p>
        </div>

        <div className="relative h-[66vh] w-full overflow-hidden rounded-3xl border border-[var(--accent-pink)]/[0.12] bg-[var(--surface)]">
          {images.map((src, index) => (
            <div key={src} className="stack-panel absolute inset-0" style={{ zIndex: images.length - index }}>
              <img
                src={optimizeCloudinaryImage(src, { width: 900, height: 1120 })}
                alt="Cinematic frame"
                className="h-full w-full object-cover object-[center_30%]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/40 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StackedImageReveal;
