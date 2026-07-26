"use client";

import React, { useState, useEffect, useCallback } from "react";

export default function FloatingFishingRod() {
  const [anchor, setAnchor] = useState<{ left: number; top: number } | null>(null);

  const updateAnchor = useCallback(() => {
    const el = document.getElementById("fishing-line-endpoint");
    if (el) {
      const rect = el.getBoundingClientRect();
      
      // Prevent double-bobbing on scroll by finding the Hero's current animation offset
      let yOffset = 0;
      const heroWrapper = el.closest('.animate-bob');
      if (heroWrapper) {
        const style = window.getComputedStyle(heroWrapper);
        const transform = style.transform;
        if (transform && transform !== 'none') {
          const matrix = transform.match(/^matrix\((.+)\)$/);
          if (matrix) {
            const values = matrix[1].split(', ');
            if (values.length === 6) {
              yOffset = parseFloat(values[5]);
            }
          }
        }
      }

      setAnchor({
        left: rect.left + rect.width / 2,
        top: rect.top + rect.height / 2 - yOffset,
      });
    }
  }, []);

  useEffect(() => {
    // Small delay to let Hero render + images load
    const timer = setTimeout(updateAnchor, 300);

    window.addEventListener("resize", updateAnchor);
    window.addEventListener("scroll", updateAnchor, { passive: true });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateAnchor);
      window.removeEventListener("scroll", updateAnchor);
    };
  }, [updateAnchor]);

  // Don't render until we know where to attach
  if (!anchor) return null;

  return (
    <div
      className="fixed bottom-0 z-50 pointer-events-none select-none flex md:flex flex-col items-center"
      style={{
        left: `${anchor.left}px`,
        top: `${anchor.top}px`,
        transform: "translateX(-50%)",
      }}
    >
      {/* 
        This wrapper has animate-bob so the long line bobs in perfect sync 
        with the fisherman in the Hero section! 
      */}
      <div className="flex flex-col items-center w-full h-full animate-bob">
        {/* Thin Fishing Line — continues from the Hero fishing line endpoint */}
        <div className="w-[1.5px] flex-grow bg-white/20" />

        {/* Bait image dangling at the end of the line */}
        <img
          src="/images/cacing.png"
          alt="Cacing"
          className="w-12 h-auto mb-15 rounded-md shadow-md animate-wiggle origin-top shrink-0"
          style={{ animationDuration: "2s" }}
          draggable={false}
        />
      </div>
    </div>
  );
}
