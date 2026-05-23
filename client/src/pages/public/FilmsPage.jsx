import { useEffect, useState } from "react";
import SectionHeading from "../../components/common/SectionHeading";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import LazyVideo from "../../components/ui/LazyVideo";
import FadeUpReveal from "../../components/motion/FadeUpReveal";
import { filmApi } from "../../services/filmApi";
import { fallbackFilms } from "../../constants/mediaLibrary";
import SEO from "../../components/common/SEO";
import { optimizeCloudinaryImage, optimizeCloudinaryVideo } from "../../utils/cloudinary";

function FilmsPage() {
  const [films, setFilms] = useState(fallbackFilms);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await filmApi.getPublic();
        setFilms(response.data.data?.length ? response.data.data : fallbackFilms);
      } catch {
        setFilms(fallbackFilms);
      }
    };
    fetchFilms();
  }, []);

  return (
    <div className="section-space px-8">
      <SEO title="Wedding Films" description="Story-driven wedding films, highlight reels, and cinematic previews from real weddings. Watch our latest work." />
      <div className="mx-auto max-w-7xl">
        <FadeUpReveal>
          <SectionHeading
            eyebrow="Films"
            title="Wedding Films & Reels"
            description="Story-driven wedding films, highlight reels, and cinematic previews from real weddings."
          />
        </FadeUpReveal>

        <FadeUpReveal>
          <div className="grid gap-8 md:grid-cols-2">
            {films.map((film) => {
              const isMp4 = typeof film.videoUrl === "string" && film.videoUrl.endsWith(".mp4");
              return (
                <Card key={film._id || film.title} className="group overflow-hidden p-0">
                  <div className="overflow-hidden rounded-xl border border-[var(--accent-pink)]/[0.12]">
                    {isMp4 ? (
                      <LazyVideo
                        src={optimizeCloudinaryVideo(film.videoUrl, { width: 960 })}
                        poster={optimizeCloudinaryImage(film.coverImage || fallbackFilms[0].coverImage, {
                          width: 960,
                          height: 1180
                        })}
                        className="h-[26rem] w-full bg-[#11100f] object-contain transition duration-500 group-hover:scale-[1.02] md:h-[32rem]"
                        controls={false}
                        muted
                        loop
                      />
                    ) : (
                      <img
                        src={optimizeCloudinaryImage(film.coverImage || fallbackFilms[0].coverImage, {
                          width: 960,
                          height: 1180
                        })}
                        alt={film.title}
                        loading="lazy"
                        decoding="async"
                        className="h-[26rem] w-full object-cover object-[center_28%] transition duration-500 group-hover:scale-[1.04] md:h-[32rem]"
                      />
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="font-heading text-4xl uppercase text-[var(--text-primary)]">{film.title}</h3>
                    <p className="mt-3 text-sm text-[var(--text-muted)]">{film.summary}</p>
                    {film.videoUrl ? (
                      <a href={film.videoUrl} target="_blank" rel="noreferrer" className="mt-5 inline-block">
                        <Button variant="outline">Open Film</Button>
                      </a>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>
        </FadeUpReveal>
      </div>
    </div>
  );
}

export default FilmsPage;
