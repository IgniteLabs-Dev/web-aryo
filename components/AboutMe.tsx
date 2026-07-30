"use client";

import React, { useState } from "react";
import { ImageOff, User } from "lucide-react";
import { useData } from "@/lib/data-provider";

export default function AboutMe() {
  const { general } = useData();
  const [imageError, setImageError] = useState(false);

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ============================================================
  // CONTENT - dari DB atau fallback
  // ============================================================
  const dbParagraphs = general?.about_description
    ? general.about_description.split("\n").filter((p: string) => p.trim())
    : [];

  const fallbackParagraphs = [
    "I am a multi-talented professional specializing in Web Development, Finance & Accounting, and Property Management. With a diverse skill set spanning technical programming and financial governance, I bring a unique hybrid approach to solving complex business challenges.",
    "Whether building robust database systems, generating comprehensive financial audits, or managing commercial property assets, I focus on delivering high-quality, pixel-perfect, and organized solutions. Let's collaborate and bring your ideas to life!"
  ];

  const content = dbParagraphs.length > 0 ? dbParagraphs : fallbackParagraphs;
  
  // ============================================================
  // IMAGE - dinamis dari DB atau SVG fallback
  // ============================================================
  const hasImage = Boolean(general?.about_image_url && !imageError);

  return (
    <section 
      id="about-me"
      className="relative w-full bg-[#030c17] py-24 px-6 md:px-16 lg:px-24 flex flex-col justify-center overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: Image Dinamis atau SVG Fallback */}
        {/* ============================================================ */}
        <div className="col-span-1 md:col-span-5 flex justify-center items-center">
          <div className="relative w-60 h-60 sm:w-72 sm:h-72 select-none">
            
            {/* Decorative offset borders */}
            <div className="absolute inset-0 border border-slate-500/40 rounded-3xl -translate-x-4 -translate-y-4 pointer-events-none" />
            <div className="absolute inset-0 border border-slate-500/40 rounded-3xl translate-x-4 translate-y-4 pointer-events-none" />
            
            {/* Main Card */}
            <div className={`relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 ${
              !hasImage ? 'bg-gradient-to-b from-[#e0f0ff] to-[#60a5fa]' : 'bg-slate-900'
            }`}>
              
              {/* PRIORITY 1: Image dari database */}
              {hasImage ? (
                <>
                  <img
                    key={general?.about_image_url}  // Force re-fetch kalau URL berubah
                    src={general?.about_image_url}
                    alt="About Me"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    onError={() => {
                      console.warn('⚠️ AboutMe image failed:', general?.about_image_url);
                      setImageError(true);
                    }}
                    onLoad={() => setImageError(false)}
                  />
                  
                  {/* Badge: avatar indicator */}
                  {/* <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Custom</span>
                  </div> */}
                </>
              ) : (
                /* PRIORITY 2: SVG fallback */
                <>
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <rect width="200" height="200" fill="url(#skyGrad)" />
                    
                    {/* Cloud */}
                    <path 
                      d="M 75 75 C 75 62, 92 62, 100 67 C 107 58, 126 58, 130 67 C 138 67, 142 75, 138 84 C 134 88, 80 88, 75 75 Z" 
                      fill="white" 
                      opacity="0.95" 
                    />
                    
                    {/* Hills */}
                    <path d="M -10 200 Q 60 120, 150 165 T 210 200 Z" fill="#84cc16" opacity="0.8" />
                    <path d="M -10 200 Q 110 135, 210 200 Z" fill="#65a30d" />
                    
                    <defs>
                      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#bae6fd" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Error indicator kalau image gagal load */}
                  {imageError && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-red-500/80 backdrop-blur-sm text-white text-[10px] flex items-center gap-1">
                      <ImageOff className="w-3 h-3" />
                      <span>Using fallback</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Bio Content */}
        {/* ============================================================ */}
        <div className="col-span-1 md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left z-20">
          
          <span className="text-sm font-semibold tracking-widest text-brand-yellow uppercase">
            ABOUT ME
          </span>
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2 leading-tight">
            Who I am
          </h2>
          
          <div className="mt-6 text-slate-300 leading-relaxed text-base sm:text-lg space-y-4 w-full">
            {content.map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <button
            onClick={scrollToContact}
            className="mt-8 px-6 py-3 rounded-full bg-brand-yellow hover:bg-brand-yellow-dark text-[#030c17] font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            Lets Connect
          </button>
        </div>
      </div>
    </section>
  );
}
