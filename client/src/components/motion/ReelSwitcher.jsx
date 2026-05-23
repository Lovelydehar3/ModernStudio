import { useLayoutEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { optimizeCloudinaryImage, optimizeCloudinaryVideo } from "../../utils/cloudinary";

function ReelSwitcher({ reels = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const videoRefs = useRef([]);

  const normalizedReels = useMemo(() => reels.filter(Boolean), [reels]);

  useLayoutEffect(() => {
    if (!rootRef.current) return undefined;
    if (!normalizedReels.length) return undefined;

    const context = gsap.context(() => {
      videoRefs.current.forEach((video, index) => {
        if (!video) return;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        if (index === activeIndex) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      });

      const activeVideo = videoRefs.current[activeIndex];
      if (!activeVideo) return;

      gsap.fromTo(
        activeVideo,
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out" }
      );
    }, rootRef);

    return () => context.revert();
  }, [activeIndex, normalizedReels.length]);

  if (!normalizedReels.length) return null;

  return (
    <section ref={rootRef} className="section-space px-6">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="relative min-h-[62vh] overflow-hidden rounded-3xl border border-[var(--accent-pink)]/[0.12] bg-[#11100f]">
          {normalizedReels.map((reel, index) => (
            <div key={reel.id || `${reel.src}-${index}`} className="absolute inset-0">
              <img
                src={optimizeCloudinaryImage(reel.poster, { width: 1100, height: 1200 })}
                alt=""
                aria-hidden="true"
                className={clsx(
                  "absolute inset-0 h-full w-full scale-110 object-cover opacity-0 blur-2xl transition-opacity duration-700",
                  index === activeIndex && "opacity-45"
                )}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <video
                ref={(node) => {
                  videoRefs.current[index] = node;
                }}
                src={index === activeIndex ? optimizeCloudinaryVideo(reel.src, { width: 1080 }) : undefined}
                className={clsx(
                  "absolute inset-0 z-10 h-full w-full object-contain p-2 opacity-0 transition-opacity duration-700 md:p-4",
                  index === activeIndex && "opacity-100"
                )}
                poster={optimizeCloudinaryImage(reel.poster, { width: 900, height: 1100 })}
                preload={index === activeIndex ? "metadata" : "none"}
                muted
                loop
                playsInline
              />
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-0 z-20 h-1/2 bg-gradient-to-t from-[#11100f]/85 via-[#11100f]/35 to-transparent" />
          <div className="relative z-30 flex min-h-[62vh] flex-col justify-end p-8 md:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--accent-pink)]">
              Featured Work
            </p>
            <h2 className="mt-3 font-heading text-5xl uppercase text-[var(--text-primary)] md:text-6xl">
              {normalizedReels[activeIndex]?.title || "Wedding Films"}
            </h2>
            <p className="mt-3 max-w-xl text-sm text-[var(--text-muted)]">
              {normalizedReels[activeIndex]?.kicker || "Cinematic wedding coverage"}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--accent-pink)]/[0.12] bg-[var(--surface)] p-8 backdrop-blur-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--accent-purple)]">
            Browse Films
          </p>
          <div className="mt-5 space-y-4">
            {normalizedReels.map((reel, index) => (
              <button
                key={reel.id || `${reel.src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={clsx(
                  "flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-400",
                  index === activeIndex
                    ? "border-[var(--accent-pink)]/40 bg-[var(--accent-pink)]/[0.06] shadow-[0_0_20px_rgba(194,109,186,0.12)]"
                    : "border-[var(--accent-pink)]/[0.1] bg-[#faf7f5] hover:bg-[var(--accent-pink)]/[0.04]"
                )}
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--accent-pink)]/15">
                  <img
                    src={optimizeCloudinaryImage(reel.poster, { width: 160, height: 160 })}
                    alt="Reel poster"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-heading text-2xl uppercase text-[var(--text-primary)]">{reel.title}</p>
                  <p className="mt-1 truncate text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {reel.kicker}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReelSwitcher;
