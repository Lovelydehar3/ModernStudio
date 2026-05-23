import { useEffect, useMemo, useState } from "react";
import SectionHeading from "../../components/common/SectionHeading";
import FadeUpReveal from "../../components/motion/FadeUpReveal";
import { GallerySkeleton } from "../../components/ui/Skeleton";
import Lightbox from "../../components/ui/Lightbox";
import { packageApi } from "../../services/packageApi";
import { mediaApi } from "../../services/mediaApi";
import { packageDefaults } from "../../constants/packageDefaults";
import { packageThumbnails, weddingGallery } from "../../constants/mediaLibrary";
import ListSection from "../../components/ui/ListSection";
import SEO from "../../components/common/SEO";
import { optimizeCloudinaryImage } from "../../utils/cloudinary";

const weddingServices = [
  "Full-Day Wedding Coverage",
  "Cinematic Wedding Films",
  "Pre-Wedding Love Stories",
  "Wedding Teasers and Highlights",
  "Bridal Portrait Sessions",
  "Destination Wedding Coverage"
];

function WeddingsPage() {
  const [packages, setPackages] = useState(packageDefaults);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packageRes, mediaRes] = await Promise.all([
          packageApi.getPublic(),
          mediaApi.getPublic({ category: "wedding" })
        ]);
        setPackages(packageRes.data.data?.length ? packageRes.data.data : packageDefaults);
        const cleanedMedia = (mediaRes.data.data || []).filter(
          (item) => !/(unsplash|picsum)/i.test(item.url || "")
        );
        setMedia(cleanedMedia);
      } catch {
        setPackages(packageDefaults);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const packageRows = useMemo(
    () =>
      (packages.length ? packages : packageDefaults).map((item) => ({
        ...item,
        thumbnail: item.thumbnail || packageThumbnails[item.name] || weddingGallery[0]
      })),
    [packages]
  );

  const gallery = media.length ? media.map((item) => item.url) : weddingGallery;

  return (
    <div className="section-space px-8">
      <SEO title="Wedding Studios" description="Real wedding stories captured with cinematic intent. Browse our collection of wedding films, highlights, and coverage." />
      <div className="mx-auto max-w-7xl">
        <FadeUpReveal>
          <SectionHeading
            eyebrow="Weddings"
            title="Wedding Cinematography by Arun"
            description="Full-day wedding coverage with cinematic editing, from sacred rituals to celebration moments."
            large
          />

          <ListSection
            items={weddingServices.map((service, index) => ({
              number: (index + 1).toString().padStart(2, "0"),
              title: service,
              thumbnail: weddingGallery[index] || weddingGallery[0],
              subtitle: `${12 + index * 2}k Views • Cinematic Quality`
            }))}
          />
        </FadeUpReveal>

        <FadeUpReveal className="mt-28 mb-12">
          <SectionHeading
            eyebrow="Packages"
            title="Wedding Packages"
            description="Clear pricing, no hidden fees."
          />
          <div className="relative flex flex-col gap-10 mt-14 pb-40">
            {packageRows.map((item, index) => {
              const bgColors = ["bg-[var(--surface)]", "bg-[var(--surface)]", "bg-[var(--surface)]"];
              const bgColor = bgColors[index % bgColors.length];

              return (
                <div
                  key={item._id || item.name}
                  className="sticky shadow-[0_8px_40px_rgba(31,31,31,0.04)] transition-all duration-500 w-full rounded-[2rem] overflow-hidden border border-[var(--card-border)]"
                  style={{
                    top: `${140 + index * 50}px`,
                    zIndex: index + 10
                  }}
                >
                  <div className={`group flex flex-col md:flex-row w-full min-h-[200px] ${bgColor}`}>
                    <div className="w-full md:w-[35%] h-40 md:h-auto relative overflow-hidden">
                      <img
                        src={optimizeCloudinaryImage(item.thumbnail, { width: 720, height: 760 })}
                        alt={`${item.name} package`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/10 to-transparent" />
                    </div>

                    <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-6">
                        <div>
                          <h3 className="font-heading text-4xl md:text-5xl uppercase tracking-wider text-[var(--text-primary)]">
                            {item.name}
                          </h3>
                          <p className="mt-3 font-heading text-xl md:text-2xl font-bold text-[var(--accent-pink)]">
                            {item.priceDisplay}
                          </p>
                        </div>
                        <button className="w-fit shrink-0 px-6 py-3 rounded-full border border-[var(--accent-pink)]/20 hover:border-[var(--accent-pink)]/40 bg-[var(--surface-hover)] hover:bg-[var(--accent-pink)]/10 transition text-[var(--text-primary)] font-medium uppercase tracking-widest text-xs md:text-sm">
                          Select Package
                        </button>
                      </div>

                      <div className="w-full h-px bg-[var(--accent-pink)]/10 my-6 md:my-8" />

                      <ul className="space-y-4 text-[var(--text-secondary)] text-base md:text-lg">
                        {item.features?.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <span className="text-[var(--accent-pink)] mt-0.5 md:mt-1">✦</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeUpReveal>

        <FadeUpReveal className="mt-20">
          <SectionHeading eyebrow="Frames" title="Wedding Gallery" />
          {loading ? (
            <GallerySkeleton count={4} />
          ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {gallery.map((image, index) => (
              <div
                key={`${image}-${index}`}
                data-reveal
                onClick={() => setLightboxIndex(index)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-[var(--card-border)]"
              >
                <img
                  src={optimizeCloudinaryImage(image, { width: 980, height: 1240 })}
                  alt="Wedding coverage"
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index < 2 ? "high" : "auto"}
                  className="h-[23rem] w-full object-cover object-[center_28%] transition duration-500 group-hover:scale-[1.05] md:h-[34rem]"
                />
              </div>
            ))}
          </div>
          )}
        </FadeUpReveal>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={gallery.map((url) => ({ url, type: "photo" }))}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}

export default WeddingsPage;
