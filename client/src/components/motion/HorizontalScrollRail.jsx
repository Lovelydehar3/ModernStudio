import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { optimizeCloudinaryImage } from "../../utils/cloudinary";

gsap.registerPlugin(ScrollTrigger);

function HorizontalScrollRail({ items = [], eyebrow = "Featured", title = "Stories in Motion" }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current || !trackRef.current) return undefined;

    const context = gsap.context(() => {
      const root = rootRef.current;
      const track = trackRef.current;

      const build = () => {
        ScrollTrigger.getAll()
          .filter((trigger) => trigger.trigger === root)
          .forEach((trigger) => trigger.kill());

        gsap.killTweensOf(track);

        const totalWidth = track.scrollWidth;
        const viewportWidth = root.clientWidth;
        const scrollDistance = Math.max(0, totalWidth - viewportWidth);

        if (scrollDistance === 0) return;

        gsap.to(track, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1
          }
        });
      };

      build();
      window.addEventListener("resize", build);

      return () => window.removeEventListener("resize", build);
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-transparent">
      <div className="mx-auto w-full max-w-7xl px-6 pb-8 pt-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--accent-pink)]">{eyebrow}</p>
        <h2 className="mt-4 font-heading text-5xl uppercase text-[var(--text-primary)] md:text-6xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm text-[var(--text-primary)]/50">
          Scroll to explore. Each frame is part of your real gallery.
        </p>
      </div>

      <div className="pb-14">
        <div
          ref={trackRef}
          className="flex gap-5 px-6 will-change-transform md:gap-6"
          style={{ transform: "translate3d(0,0,0)" }}
        >
          {items.map((item, index) => (
            <article
              key={item.id || item.title || item.src}
              className="group relative h-[62vh] min-w-[80vw] overflow-hidden rounded-3xl border border-[var(--accent-pink)]/[0.12] bg-[var(--surface)] md:min-w-[540px]"
            >
              <img
                src={optimizeCloudinaryImage(item.src, { width: 980, height: 1240 })}
                alt={item.alt || item.title || "Gallery frame"}
                className="absolute inset-0 h-full w-full object-cover object-[center_30%] transition duration-700 group-hover:scale-[1.06]"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "auto"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/60 via-[var(--bg-primary)]/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-secondary)]">{item.kicker}</p>
                <h3 className="mt-3 font-heading text-4xl uppercase text-[var(--text-primary)]">{item.title}</h3>
                <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">{item.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HorizontalScrollRail;
