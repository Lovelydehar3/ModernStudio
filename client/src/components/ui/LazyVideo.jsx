import { useRef, useState, useEffect, memo } from "react";

const LazyVideo = memo(function LazyVideo({
  src,
  poster,
  className = "",
  controls = true,
  muted = false,
  loop = false,
  ...props
}) {
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !videoRef.current) return;
    videoRef.current.src = src;
    videoRef.current.load();
  }, [inView, src]);

  const handleClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="group relative overflow-hidden">
      <video
        ref={videoRef}
        poster={poster}
        preload="metadata"
        muted={muted}
        loop={loop}
        playsInline
        controls={controls && isPlaying}
        className={className}
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        onPlaying={() => { setIsBuffering(false); setIsPlaying(true); }}
        onPause={() => setIsPlaying(false)}
        onClick={handleClick}
        {...props}
      />

      {/* Play button overlay */}
      {!isPlaying && (
        <button
          type="button"
          onClick={handleClick}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/40"
          aria-label="Play video"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-purple)]/90 text-white shadow-[0_0_30px_rgba(194,109,186,0.4)] transition-transform hover:scale-110">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}

      {/* Buffering spinner */}
      {isBuffering && inView && isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}
    </div>
  );
});

export default LazyVideo;
