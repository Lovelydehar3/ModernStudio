import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import HeroWordStagger from "../../components/motion/HeroWordStagger";
import FadeUpReveal from "../../components/motion/FadeUpReveal";
import SectionHeading from "../../components/common/SectionHeading";
import { RoseCorner, FloralDivider, PetalScatter } from "../../components/decorative/FloralAccents";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import HorizontalScrollRail from "../../components/motion/HorizontalScrollRail";
import StackedImageReveal from "../../components/motion/StackedImageReveal";
import ReelSwitcher from "../../components/motion/ReelSwitcher";
import { homeApi } from "../../services/homeApi";
import { packageApi } from "../../services/packageApi";
import SEO from "../../components/common/SEO";
import { mediaApi } from "../../services/mediaApi";
import { inquiryApi } from "../../services/inquiryApi";
import { packageDefaults } from "../../constants/packageDefaults";
import { extractApiError } from "../../lib/formatters";
import { homeGallery, localImages, localVideos, packageThumbnails } from "../../constants/mediaLibrary";
import { optimizeCloudinaryImage } from "../../utils/cloudinary";
import { useToast } from "../../components/ui/ToastContext";

const signatureServices = [
  {
    direction: 1,
    title: "Wedding Cinematography",
    note: "Full-day wedding video coverage with cinematic editing and color grading.",
    accent: "#D8A7B1",
    glow: "rgba(216, 167, 177, 0.15)"
  },
  {
    direction: 2,
    title: "Model Portfolio Shoots",
    note: "Professional portfolio photography for aspiring and established models.",
    accent: "#8B7AA8",
    glow: "rgba(139, 122, 168, 0.15)"
  },
  {
    direction: 3,
    title: "Pre-Wedding Films",
    note: "Story-driven pre-wedding videos shot at scenic outdoor locations.",
    accent: "#C98C9C",
    glow: "rgba(201, 140, 156, 0.15)"
  },
  {
    direction: 4,
    title: "Bridal Portraits",
    note: "Editorial-style bridal portraits with attention to detail and light.",
    accent: "#D8A7B1",
    glow: "rgba(216, 167, 177, 0.15)"
  },
  {
    direction: 5,
    title: "Event Highlight Reels",
    note: "Quick-cut highlight reels perfect for social media and memories.",
    accent: "#8B7AA8",
    glow: "rgba(139, 122, 168, 0.15)"
  }
];

const signatureRows = [signatureServices.slice(0, 3), signatureServices.slice(3)];

function HomePage() {
  const { showToast } = useToast();
  const [homeContent, setHomeContent] = useState(null);
  const [packages, setPackages] = useState(packageDefaults);
  const [featuredMedia, setFeaturedMedia] = useState([]);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isInquirySubmitting, setIsInquirySubmitting] = useState(false);
  const [pausedRows, setPausedRows] = useState({});

  useEffect(() => {
    const fetchHomeData = async () => {
      // Use Promise.allSettled to handle partial failures gracefully
      const [homeRes, packageRes, mediaRes] = await Promise.allSettled([
        homeApi.getPublic(),
        packageApi.getPublic(),
        mediaApi.getPublic({ category: "home" })
      ]);

      if (homeRes.status === "fulfilled") {
        setHomeContent(homeRes.value.data.data);
      }

      if (packageRes.status === "fulfilled") {
        const pkgData = packageRes.value.data.data;
        setPackages(pkgData?.length ? pkgData : packageDefaults);
      } else {
        setPackages(packageDefaults);
      }

      if (mediaRes.status === "fulfilled") {
        const cleanedMedia = (mediaRes.value.data.data || []).filter(
          (item) => !/(unsplash|picsum)/i.test(item.url || "")
        );
        setFeaturedMedia(cleanedMedia);
      }
    };

    fetchHomeData();
  }, []);

  const gallery = useMemo(() => {
    if (featuredMedia.length) {
      return featuredMedia.slice(0, 4).map((item) => item.url);
    }
    return homeGallery;
  }, [featuredMedia]);

  const packageRows = useMemo(
    () =>
      (packages.length ? packages : packageDefaults).map((item) => ({
        ...item,
        thumbnail: item.thumbnail || packageThumbnails[item.name] || homeGallery[0]
      })),
    [packages]
  );

  const heroBackground = optimizeCloudinaryImage(localImages.photo10, {
    width: 1800,
    height: 1100,
    crop: "fill",
    quality: "auto:good"
  });
  const heroIsVideo = false;

  const handleInquiryChange = (event) => {
    setInquiryForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleInquirySubmit = async (event) => {
    event.preventDefault();
    try {
      setIsInquirySubmitting(true);
      await inquiryApi.create({ ...inquiryForm, sourcePage: "home" });
      setInquiryForm({ name: "", email: "", phone: "", message: "" });
      showToast("Inquiry sent successfully! We'll get back to you soon.", "success");
    } catch (error) {
      showToast(extractApiError(error), "error");
    } finally {
      setIsInquirySubmitting(false);
    }
  };

  const railItems = [
    { id: "rail-01", kicker: "Wedding", title: "Sacred Rituals", subtitle: "Capturing the essence of traditional ceremonies.", src: localImages.photo11 },
    { id: "rail-02", kicker: "Bridal", title: "Portraits", subtitle: "Timeless bridal portraits with natural light.", src: localImages.photo01 },
    { id: "rail-03", kicker: "Destination", title: "Outdoor Shoots", subtitle: "Scenic location photography across India.", src: localImages.photo10 },
    { id: "rail-04", kicker: "Fashion", title: "Model Portfolio", subtitle: "Professional portfolio shoots for models.", src: localImages.photo15 },
    { id: "rail-05", kicker: "Films", title: "Wedding Cinema", subtitle: "Story-driven wedding films and highlights.", src: localImages.photo06 }
  ];

  return (
    <div>
      <SEO title="Cinematic Wedding Films & Portrait Photography" description="Premium wedding cinematography and model photography by Arun. Story-driven films, editorial portraits, and luxury wedding content." />
      {/* ─── Hero Section ─── */}
      <section className="relative flex min-h-[95vh] items-end overflow-hidden px-6 pb-24 sm:px-8 sm:pb-32">
        {heroIsVideo ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" poster={homeGallery[0]}>
            <source src={heroBackground} type="video/mp4" />
          </video>
        ) : (
          <img src={heroBackground} alt="Modern Wedding Studios hero background" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/90 to-transparent" />
        <div className="absolute inset-0 grid-overlay opacity-30" />

        {/* Floating decorative orbs */}
        <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-[var(--accent-pink)]/8 blur-[80px] animate-float-gentle hidden sm:block" />
        <div className="absolute bottom-32 right-40 h-48 w-48 rounded-full bg-[var(--accent-purple)]/6 blur-[60px] animate-float-gentle hidden sm:block" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/3 h-32 w-32 rounded-full bg-[var(--accent-light)]/5 blur-[50px] animate-float-gentle hidden md:block" style={{ animationDelay: "4s" }} />

        {/* Floral accents */}
        <RoseCorner position="top-right" className="opacity-60" />
        <RoseCorner position="bottom-left" className="opacity-40" />
        <PetalScatter />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.4em] text-[var(--accent-pink)] animate-fade-in-up">
            Modern Wedding Studios
          </p>
          <HeroWordStagger
            text={homeContent?.heroTitle || "Wedding Films & Portrait Photography by Arun"}
            className="font-heading text-4xl uppercase text-[var(--text-primary)] drop-shadow-none sm:text-5xl md:max-w-4xl md:text-7xl"
          />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] animate-fade-in-up sm:mt-8 sm:text-lg" style={{ animationDelay: "0.3s" }}>
            {homeContent?.heroSubtitle || "Freelance wedding cinematographer and portrait photographer. Every frame tells your story."}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 animate-fade-in-up sm:mt-12 sm:gap-5" style={{ animationDelay: "0.5s" }}>
            <Link to="/booking">
              <Button className="px-6 sm:px-8">{homeContent?.ctaText || "Book Arun"}</Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="outline" className="px-6 sm:px-8">Explore Portfolio</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Floral Divider ─── */}
      <FloralDivider />

      {/* ─── Reel Switcher ─── */}
      <ReelSwitcher
        reels={[
          { id: "film-01", src: localVideos.film01, poster: localImages.photo10, title: "Wedding Highlights", kicker: "Full-day cinematic coverage" },
          { id: "film-02", src: localVideos.film02, poster: localImages.photo11, title: "Pre-Wedding Film", kicker: "Outdoor love story" },
          { id: "song-01", src: localVideos.song01, poster: localImages.photo15, title: "Wedding Song Edit", kicker: "Musical highlight reel" },
          { id: "wedding-01", src: localVideos.wedding01, poster: localImages.photo01, title: "Wedding Coverage", kicker: "Full ceremony capture" },
          { id: "sequence-01", src: localVideos.sequence01, poster: localImages.photo06, title: "Wedding Sequence", kicker: "Cinematic moments" }
        ]}
      />

      {/* ─── Horizontal Scroll Rail ─── */}
      <HorizontalScrollRail items={railItems} eyebrow="Portfolio" title="Recent Work" />

      {/* ─── Floral Divider ─── */}
      <FloralDivider />

      {/* ─── Signature Services Marquee ─── */}
      <section className="section-space px-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeUpReveal>
            <SectionHeading
              eyebrow="Services"
              title="What I Do"
              description={homeContent?.aboutSnippet || undefined}
            />
            <div className="signature-marquee mt-12 space-y-8">
              {signatureRows.map((row, rowIndex) => (
                <div
                  key={`signature-row-${rowIndex}`}
                  className={`signature-marquee-viewport${pausedRows[rowIndex] ? " signature-marquee-paused" : ""}`}
                  onClick={() => setPausedRows((prev) => ({ ...prev, [rowIndex]: !prev[rowIndex] }))}
                  title={pausedRows[rowIndex] ? "Click to resume" : "Click to pause"}
                >
                  <div
                    className={`signature-marquee-track${rowIndex % 2 === 1 ? " signature-marquee-track-reverse" : ""}`}
                    style={{ "--marquee-duration": `${22 + row.length * 3}s` }}
                  >
                    {[...row, ...row].map((item, index) => (
                      <article
                        key={`${item.title}-${index}`}
                        className="signature-service-card"
                        style={{
                          "--signature-accent": item.accent,
                          "--signature-glow": item.glow,
                          "--signature-delay": `${(index % row.length) * 0.5}s`
                        }}
                      >
                        <span className="signature-service-orb" />
                        <p className="signature-service-label">Direction {item.direction}</p>
                        <p data-reveal className="signature-service-title">{item.title}</p>
                        <p className="signature-service-note">{item.note}</p>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeUpReveal>
        </div>
      </section>

      {/* ─── Stacked Image Reveal ─── */}
      <StackedImageReveal
        eyebrow="Gallery"
        title="Real Frames"
        description="Actual frames from real weddings and model sessions. No stock images."
        images={[localImages.photo07, localImages.photo06, localImages.photo02, localImages.photo01]}
      />

      {/* ─── Decorative Divider ─── */}
      <div className="relative py-16">
        <div className="mx-auto flex items-center gap-4 justify-center">
          <div className="h-[1px] w-16 bg-[var(--accent-pink)]/20" />
          <div className="h-2 w-2 rounded-full bg-[var(--accent-pink)]/30 animate-pulse-glow" />
          <div className="h-[1px] w-16 bg-[var(--accent-purple)]/20" />
        </div>
      </div>

      {/* ─── Packages Section ─── */}
      <section className="section-space px-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeUpReveal>
            <SectionHeading
              eyebrow="Packages"
              title="Transparent Pricing"
              description="Clear pricing for every scale of celebration. No hidden fees."
            />

            <div className="relative flex flex-col gap-10 mt-14 pb-20 md:pb-40">
              <style>{`
                @keyframes diagonalSweep {
                  0% { transform: translateX(-200%) translateY(200%) rotate(-45deg); opacity: 0; }
                  10% { opacity: 0.3; }
                  30% { transform: translateX(200%) translateY(-200%) rotate(-45deg); opacity: 0; }
                  100% { transform: translateX(200%) translateY(-200%) rotate(-45deg); opacity: 0; }
                }
                .animate-light-sweep { animation: diagonalSweep 6s ease-in-out infinite; }
              `}</style>

              {packageRows.map((item, index) => {
                const bgColors = ["bg-[var(--surface)]", "bg-[var(--surface)]", "bg-[var(--surface)]"];
                const bgColor = bgColors[index % bgColors.length];

                return (
                  <div
                    key={item._id || item.name}
                    className="md:sticky shadow-[0_8px_40px_rgba(31,31,31,0.04)] transition-all duration-500 w-full rounded-[2rem] overflow-hidden border border-[var(--card-border)] hover-lift"
                    style={{ top: `clamp(80px, ${140 + index * 50}px, ${140 + index * 50}px)`, zIndex: index + 10 }}
                  >
                    <div className={`relative group flex flex-col md:flex-row w-full min-h-[280px] md:min-h-[320px] ${bgColor} overflow-hidden`}>
                      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 left-0 w-[200%] h-[100%] bg-gradient-to-r from-transparent via-[var(--accent-pink)]/[0.06] to-transparent animate-light-sweep" style={{ animationDelay: `${index * 2}s` }} />
                      </div>

                      <div className="w-full md:w-[45%] h-56 sm:h-72 md:h-auto relative overflow-hidden">
                        <img
                          src={optimizeCloudinaryImage(item.thumbnail, { width: 720, height: 760 })}
                          alt={`${item.name} package`}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/10 to-transparent" />
                      </div>

                      <div className="w-full md:w-[55%] p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-4 sm:gap-6">
                          <div>
                            <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider text-[var(--text-primary)]">{item.name}</h3>
                            <p className="mt-2 sm:mt-3 font-heading text-lg sm:text-xl md:text-2xl font-bold text-[var(--accent-pink)]">{item.priceDisplay}</p>
                          </div>
                          <Link to="/booking" className="shrink-0">
                            <button className="w-fit px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] text-white font-medium uppercase tracking-widest text-xs md:text-sm shadow-[0_4px_20px_rgba(216,167,177,0.25)] transition-all duration-400 hover:shadow-[0_6px_28px_rgba(216,167,177,0.35)] hover:scale-[1.04]">
                              Choose Package
                            </button>
                          </Link>
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-[var(--accent-pink)]/15 via-[var(--accent-purple)]/10 to-transparent my-4 sm:my-6 md:my-8" />

                        <ul className="space-y-3 sm:space-y-4 text-[var(--text-secondary)] text-sm sm:text-base md:text-lg relative z-30">
                          {item.features?.slice(0, 4).map((feature) => (
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
        </div>
      </section>

      {/* ─── Portfolio Grid ─── */}
      <section className="section-space px-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeUpReveal>
            <SectionHeading
              eyebrow="Portfolio"
              title="My Work"
              description="A collection of wedding frames, model portraits, and cinematic moments from my shoots."
            />
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {gallery.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  data-reveal
                  className="group overflow-hidden rounded-2xl border border-[var(--card-border)] hover-lift"
                >
                  <img
                    src={optimizeCloudinaryImage(image, { width: 980, height: 1200 })}
                    alt="Wedding gallery"
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={index < 2 ? "high" : "auto"}
                    className="h-[18rem] w-full object-cover object-[center_30%] transition duration-500 group-hover:scale-[1.05] sm:h-[22rem] md:h-[32rem]"
                  />
                </div>
              ))}
            </div>
          </FadeUpReveal>
        </div>
      </section>

      {/* ─── Inquiry Form ─── */}
      <section className="section-space px-6 pb-24 sm:px-8 sm:pb-32">
        <div className="relative mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-[var(--card-border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-[var(--bg-secondary)] p-6 sm:p-12 lg:grid-cols-2 lg:gap-14 lg:rounded-[2.5rem] overflow-hidden">
          {/* Decorative background orbs */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[var(--accent-pink)]/5 blur-[80px] animate-float-gentle hidden sm:block" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[var(--accent-purple)]/5 blur-[60px] animate-float-gentle hidden sm:block" style={{ animationDelay: "3s" }} />

          {/* Floral accents */}
          <RoseCorner position="top-right" className="opacity-50" />
          <RoseCorner position="bottom-left" className="opacity-40" />

          <div className="relative z-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent-purple)]">Inquiry</p>
            <h3 className="font-heading text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wider text-[var(--text-primary)]">Get in Touch</h3>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-[var(--text-muted)]">
              Share your event vision and I'll get back to you with availability and a custom plan.
            </p>
          </div>
          <form className="relative z-10 space-y-5 sm:space-y-6" onSubmit={handleInquirySubmit}>
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
              <Input name="name" label="Name" required value={inquiryForm.name} onChange={handleInquiryChange} />
              <Input name="email" label="Email" type="email" required value={inquiryForm.email} onChange={handleInquiryChange} />
            </div>
            <Input name="phone" label="Phone" value={inquiryForm.phone} onChange={handleInquiryChange} />
            <label className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
              <span className="font-medium">Message</span>
              <textarea
                name="message"
                required
                rows={4}
                value={inquiryForm.message}
                onChange={handleInquiryChange}
                className="rounded-xl border border-[var(--card-border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-all duration-400 focus:border-[var(--accent-pink)] focus:shadow-[0_0_0_3px_rgba(216,167,177,0.1)]"
              />
            </label>
            <Button type="submit" disabled={isInquirySubmitting} className="w-full py-4 text-sm">
              {isInquirySubmitting ? "Sending..." : "Send Inquiry"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
