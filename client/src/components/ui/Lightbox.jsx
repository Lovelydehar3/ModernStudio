import { useEffect, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { optimizeCloudinaryImage } from "../../utils/cloudinary";

function Lightbox({ items, index, onClose, onNavigate }) {
  const [zoomed, setZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const overlayRef = useRef(null);

  const current = items[index];

  const handlePrev = useCallback(() => {
    if (index > 0) {
      setZoomed(false);
      onNavigate(index - 1);
    }
  }, [index, onNavigate]);

  const handleNext = useCallback(() => {
    if (index < items.length - 1) {
      setZoomed(false);
      onNavigate(index + 1);
    }
  }, [index, items.length, onNavigate]);

  const handleClose = useCallback(() => {
    setZoomed(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === " ") {
        e.preventDefault();
        setZoomed((z) => !z);
      }
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleClose, handlePrev, handleNext]);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      diff > 0 ? handleNext() : handlePrev();
    }
    setTouchStart(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleClose();
  };

  if (!current) return null;

  const isVideo = current.type === "video";

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
    >
      {/* Close */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Zoom toggle */}
      {!isVideo && (
        <button
          onClick={() => setZoomed((z) => !z)}
          className="absolute top-6 right-20 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          aria-label={zoomed ? "Zoom out" : "Zoom in"}
        >
          {zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
        </button>
      )}

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 md:left-8"
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Next */}
      {index < items.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 md:right-8"
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Content */}
      <div
        className={`flex h-full w-full items-center justify-center p-4 transition-transform duration-300 md:p-12 ${
          zoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in"
        }`}
        onClick={() => !isVideo && setZoomed((z) => !z)}
      >
        {isVideo ? (
          <video
            src={current.url}
            controls
            autoPlay
            className="max-h-[85vh] max-w-full rounded-lg"
          />
        ) : (
          <img
            src={optimizeCloudinaryImage(current.url, { width: 1600, height: 1200 })}
            alt={current.title || "Gallery image"}
            className="max-h-[85vh] max-w-full rounded-lg object-contain select-none"
            draggable={false}
          />
        )}
      </div>

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/60">
        {index + 1} / {items.length}
      </div>
    </div>,
    document.body
  );
}

export default Lightbox;
