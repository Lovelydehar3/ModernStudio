import { useEffect, useState } from "react";
import SectionHeading from "../../components/common/SectionHeading";
import FadeUpReveal from "../../components/motion/FadeUpReveal";
import { mediaApi } from "../../services/mediaApi";
import { fashionGallery } from "../../constants/mediaLibrary";
import ListSection from "../../components/ui/ListSection";
import SEO from "../../components/common/SEO";
import { optimizeCloudinaryImage } from "../../utils/cloudinary";

const galleryServices = [
  "Model Portfolio Shoots",
  "Fashion Photography",
  "Creative Portrait Sessions",
  "Bridal Fashion Campaigns",
  "Beauty and Close-up Portraits",
  "Editorial Concept Shoots"
];

function GalleryPage() {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaRes = await mediaApi.getPublic({ category: "fashion" });
        const cleanedMedia = (mediaRes.data.data || []).filter(
          (item) => !/(unsplash|picsum)/i.test(item.url || "")
        );
        setMedia(cleanedMedia);
      } catch {
        setMedia([]);
      }
    };
    fetchData();
  }, []);

  const images = media.length ? media.map((item) => item.url) : fashionGallery;

  return (
    <div className="section-space px-8">
      <SEO title="Gallery" description="Browse our portfolio of wedding photography, model shoots, and editorial captures. Every frame tells a story." />
      <div className="mx-auto max-w-7xl">
        <FadeUpReveal>
          <SectionHeading
            eyebrow="Gallery"
            title="Model Photography & Portraits"
            description="Professional model portfolio shoots, fashion photography, and creative portrait sessions."
            large
          />

          <ListSection
            items={galleryServices.map((service, index) => ({
              number: (index + 1).toString().padStart(2, "0"),
              title: service,
              thumbnail: fashionGallery[index] || fashionGallery[0],
              subtitle: `${8 + index * 3}k Views • Editorial Focus`
            }))}
          />
        </FadeUpReveal>

        <FadeUpReveal className="mt-24">
          <SectionHeading eyebrow="Portfolio" title="Gallery and Editorial Selection" />
          <div className="grid gap-6 md:grid-cols-2">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                data-reveal
                className="group overflow-hidden rounded-2xl border border-[var(--card-border)]"
              >
                <img
                  src={optimizeCloudinaryImage(image, { width: 980, height: 1240 })}
                  alt="Gallery portfolio"
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index < 2 ? "high" : "auto"}
                  className="h-[23rem] w-full object-cover object-[center_28%] transition duration-500 group-hover:scale-[1.05] md:h-[34rem]"
                />
              </div>
            ))}
          </div>
        </FadeUpReveal>
      </div>
    </div>
  );
}

export default GalleryPage;
