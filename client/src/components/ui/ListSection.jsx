import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { optimizeCloudinaryImage } from '../../utils/cloudinary';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ListSection = ({ title, subtitle, items }) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".slider-container", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-[90rem]">
        {title && (
          <div className="mb-12 px-6 md:px-12 text-center md:text-left">
            <h2 className="font-heading text-4xl text-[var(--text-primary)] md:text-5xl">{title}</h2>
            {subtitle && <p className="mt-5 max-w-2xl text-[var(--text-primary)]/50 mx-auto md:mx-0">{subtitle}</p>}
          </div>
        )}

        <div className="slider-container relative w-full overflow-hidden pb-14 pt-4">
          <style>{`
            @keyframes infiniteScroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .moving-track {
              display: flex;
              width: max-content;
              animation: infiniteScroll 40s linear infinite;
            }
            .moving-track:hover {
              animation-play-state: paused;
            }
            .moving-track:hover .slide-card {
              opacity: 0.4;
              filter: blur(3px);
              transform: scale(0.96);
            }
            .moving-track .slide-card::before {
              content: "";
              position: absolute;
              left: -1px;
              top: -1px;
              bottom: -1px;
              width: 4px;
              background: linear-gradient(135deg, var(--accent-pink), var(--accent-purple));
              opacity: 0;
              transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1);
              border-top-left-radius: 1.25rem;
              border-bottom-left-radius: 1.25rem;
              z-index: 20;
            }
            .moving-track .slide-card:hover {
              opacity: 1;
              filter: blur(0px);
              transform: scale(1) translateX(8px);
              z-index: 10;
              background-color: #ffffff;
              border-color: rgba(216, 167, 177, 0.2);
              box-shadow: 0 10px 40px rgba(0,0,0,0.08), 0 0 20px rgba(194,109,186,0.12);
            }
            .moving-track .slide-card:hover::before {
              opacity: 1;
            }
            .slide-card.active-card {
              background-color: #ffffff;
              border-color: rgba(216, 167, 177, 0.3);
              box-shadow: 0 0 30px rgba(194,109,186,0.15);
            }
            .slide-card.active-card::before {
              opacity: 1;
            }
          `}</style>

          <div className="moving-track">
            {[1, 2].map((blockIndex) => (
              <div key={blockIndex} className="flex gap-8 pr-8">
                {items.map((item, index) => (
                  <div
                    key={`${blockIndex}-${index}`}
                    className={`slide-card group relative flex w-[78vw] shrink-0 flex-col rounded-[1.25rem] bg-[var(--surface)] border border-[var(--accent-pink)]/[0.1] p-3 transition-all duration-500 md:w-[28rem] select-none ${item.isActive ? 'active-card' : ''}`}
                  >
                    <div className="relative h-72 w-full overflow-hidden rounded-xl bg-[var(--bg-secondary)] md:h-[23rem]">
                      {item.thumbnail ? (
                        <img
                          src={optimizeCloudinaryImage(item.thumbnail, { width: 720, height: 920 })}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading={blockIndex === 1 && index < 2 ? "eager" : "lazy"}
                          decoding="async"
                          draggable="false"
                        />
                      ) : (
                        <div className="flex w-full h-full items-center justify-center text-[var(--accent-pink)]/30 font-heading text-6xl font-bold">
                          {item.number}
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none" />
                    </div>

                    <div className="mt-3 px-2 pb-2">
                      <h3 className="font-heading text-lg text-[var(--text-primary)] tracking-wide">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {item.subtitle || `${item.number} • Modern Wedding Studios Focus`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListSection;
