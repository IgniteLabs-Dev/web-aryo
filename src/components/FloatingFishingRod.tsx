"use client";

import React from "react";

export default function FloatingFishingRod() {
  return (
    <div className="fixed left-[8%] sm:left-[6%] lg:left-[5%] top-0 bottom-0 z-50 pointer-events-none select-none hidden md:flex flex-col items-center">
      {/* Thin Fishing Line — stretches from the top */}
      <div className="w-[1.5px] flex-grow bg-white/20" />

      {/* Worm & Hook SVG dangling at the end of the line */}
      <svg viewBox="0 12.5 60 87.5" className="w-14 h-auto text-white/50 fill-none stroke-current shrink-0" strokeWidth="2">
          {/* Eye of the hook */}
          <circle cx="30" cy="15" r="2.5" fill="#fff" className="text-white/80" />
          
          {/* Hook shank */}
          <line x1="30" y1="17.5" x2="30" y2="65" strokeLinecap="round" />
          
          {/* Hook bend */}
          <path d="M 30 65 C 30 85, 12 85, 12 65 C 12 55, 20 48, 20 48" strokeLinecap="round" />
          {/* Hook barb */}
          <path d="M 20 48 L 17 52" strokeLinecap="round" />
          
          {/* Wiggling worm */}
          <path
            d="M 29 32 Q 37 38, 29 44 T 31 56 T 21 66 T 12 70"
            stroke="#f43f5e"
            strokeWidth="3.8"
            strokeLinecap="round"
            className="animate-wiggle origin-center"
            style={{ animationDuration: "2s" }}
          />
          {/* Worm eye */}
          <circle cx="14" cy="69" r="0.6" fill="black" />
        </svg>
    </div>

  );
}
