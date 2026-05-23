import { useEffect, useMemo, useState } from "react";
import SectionHeading from "../../components/common/SectionHeading";
import Button from "../../components/ui/Button";
import FadeUpReveal from "../../components/motion/FadeUpReveal";
import { GallerySkeleton } from "../../components/ui/Skeleton";
import Lightbox from "../../components/ui/Lightbox";
import { mediaApi } from "../../services/mediaApi";
import { portfolioItems } from "../../constants/mediaLibrary";
import SEO from "../../components/common/SEO";
import { optimizeCloudinaryImage } from "../../utils/cloudinary";

const filterTabs = [
  "all", "wedding", "pre-wedding", "engagement", "haldi", "mehndi",
  "cinematic-films", "drone", "fashion", "baby-shoot"
];

function PortfolioPage() {
  const [media, setMedia] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await mediaApi.getPublic();
        const cleanedMedia = (response.data.data || []).filter(
          (item) => !/(unsplash|picsum)/i.test(item.url || "")
        );
        setMedia(cleanedMedia);
      } catch {
        setMedia(portfolioItems);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const filteredItems = useMemo(() => {
    const base = media.length ? media : portfolioItems;
    if (activeFilter === "all") return base;
    return base.filter((item) => item.category === activeFilter);
  }, [media, activeFilter]);

  return (
    <div className="section-space px-8">
      <SEO title="Portfolio" description="A curated collection of wedding cinematography, model portfolios, and editorial photography by Arun." />
      <div className="mx-auto max-w-7xl">
        <FadeUpReveal>
          <SectionHeading
            eyebrow="Portfolio"
            title="My Work"
            description="A collection of wedding frames, model portraits, and cinematic moments from my shoots."
          />
        </FadeUpReveal>

        <div className="mb-12 flex flex-wrap gap-4">
          {filterTabs.map((tab) => (
            <Button
              key={tab}
              variant={activeFilter === tab ? "primary" : "outline"}
              onClick={() => setActiveFilter(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        <FadeUpReveal>
          {loading ? (
            <GallerySkeleton count={6} />
          ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <div
                key={`${item.url}-${index}`}
                data-reveal
                onClick={() => setLightboxIndex(index)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-[var(--accent-pink)]/[0.12]"
              >
                <img
                  src={optimizeCloudinaryImage(item.url, { width: 760, height: 980 })}
                  alt={item.title || "Portfolio asset"}
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index < 2 ? "high" : "auto"}
                  className="h-[24rem] w-full object-cover object-[center_28%] transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="flex items-center justify-between bg-[var(--surface)] px-5 py-4 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  <span>{item.category}</span>
                  <span>{item.type || "photo"}</span>
                </div>
              </div>
            ))}
          </div>
          )}
        </FadeUpReveal>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={filteredItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}

export default PortfolioPage;
