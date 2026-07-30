"use client";

import React, { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import type { Service } from "@/lib/data-provider";

interface Props {
  service: Service;
  onClose: () => void;
}

export default function ServiceDetailModal({ service, onClose }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const images = service.gallery || [];
  const hasImages = images.length > 0;

  const nextImage = useCallback(() => {
    if (images.length > 1) setCurrentImage((p) => (p + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length > 1) setCurrentImage((p) => (p - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, nextImage, prevImage]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextImage() : prevImage();
    setTouchStart(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0a1729] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 shrink-0">
          <div className="flex-1 pr-4">
            <span className="text-[10px] font-semibold tracking-widest text-brand-yellow uppercase">
              {service.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 leading-tight">
              {service.name}
            </h2>
            <p className="text-slate-400 text-sm mt-1">{service.subject}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {/* Image Carousel */}
          <div
            className="relative bg-black aspect-video w-full"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {hasImages ? (
              <>
                <img
                  src={images[currentImage].image_url}
                  alt={`${service.name} ${currentImage + 1}`}
                  className="w-full h-full object-contain"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all backdrop-blur-sm"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all backdrop-blur-sm"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImage(i)}
                          className={`h-2 rounded-full transition-all ${
                            i === currentImage ? "bg-brand-yellow w-6" : "bg-white/50 w-2 hover:bg-white/80"
                          }`}
                          aria-label={`Image ${i + 1}`}
                        />
                      ))}
                    </div>

                    {/* Counter */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur-sm">
                      {currentImage + 1} / {images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                <ImageOff className="w-12 h-12" />
                <p className="text-sm">No images available</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Description
              </h3>
              <p className="text-slate-200 leading-relaxed text-sm sm:text-base">
                {service.description}
              </p>
            </div>

            {service.detail_description && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Detail Information
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {service.detail_description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.25s ease-out; }
      `}</style>
    </div>
  );
}
