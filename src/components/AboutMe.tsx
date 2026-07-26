"use client";

import React from "react";
import { useData } from "@/lib/data-provider";

export default function AboutMe() {
  const { general } = useData();

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Ambil deskripsi dari DB, split by newline (sama seperti versi lama)
  const dbParagraphs = general?.about_description
    ? general.about_description.split("\n").filter((p) => p.trim())
    : [];

  // Fallback jika DB kosong (UI baru tetap punya konten)
  const fallbackParagraphs = [
    "I am a multi-talented professional specializing in Web Development, Finance & Accounting, and Property Management. With a diverse skill set spanning technical programming and financial governance, I bring a unique hybrid approach to solving complex business challenges.",
    "Whether building robust database systems, generating comprehensive financial audits, or managing commercial property assets, I focus on delivering high-quality, pixel-perfect, and organized solutions. Let's collaborate and bring your ideas to life!"
  ];

  const content = dbParagraphs.length > 0 ? dbParagraphs : fallbackParagraphs;

  return (
    <section className="relative w-full bg-[#030c17] py-24 px-6 md:px-16 lg:px-24 flex flex-col justify-center overflow-hidden">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Stacked Landscape Image Card */}
        <div className="col-span-1 md:col-span-5 flex justify-center items-center">
          <div className="relative w-60 h-60 sm:w-72 sm:h-72 select-none">
            
            {/* Offset Border Top-Left */}
            <div className="absolute inset-0 border border-slate-500/40 rounded-3xl -translate-x-4 -translate-y-4 pointer-events-none" />
            
            {/* Offset Border Bottom-Right */}
            <div className="absolute inset-0 border border-slate-500/40 rounded-3xl translate-x-4 translate-y-4 pointer-events-none" />
            
            {/* Main Card with Landscape SVG */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#e0f0ff] to-[#60a5fa] border border-white/10">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <rect width="200" height="200" fill="url(#skyGrad)" />
                <path d="M 75 75 C 75 62, 92 62, 100 67 C 107 58, 126 58, 130 67 C 138 67, 142 75, 138 84 C 134 88, 80 88, 75 75 Z" fill="white" opacity="0.95" />
                <path d="M -10 200 Q 60 120, 150 165 T 210 200 Z" fill="#84cc16" opacity="0.8" />
                <path d="M -10 200 Q 110 135, 210 200 Z" fill="#65a30d" />
                <defs>
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#bae6fd" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Bio Content */}
        <div className="col-span-1 md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left z-20">
          
          <span className="text-sm font-semibold tracking-widest text-brand-yellow uppercase">
            ABOUT ME
          </span>
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2 leading-tight">
            Who I am
          </h2>
          
          {/* Paragraf dari DB, dengan fallback hardcode */}
          <div className="mt-6 text-slate-300 leading-relaxed text-base sm:text-lg space-y-4 w-full">
            {content.map((p, i) => (
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
