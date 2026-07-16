"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowDown } from "lucide-react";

export default function Hero() {
  const [roleText, setRoleText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const roles = [
    "Web Developer",
    "Financial Analyst",
    "Property Manager",
    "Problem Solver"
  ];

  // Typewriter effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setRoleText(currentRole.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 50);
    } else {
      timer = setTimeout(() => {
        setRoleText(currentRole.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 100);
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex]);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#e0f0ff] via-[#3b82f6] to-[#030c17]">
      
      {/* Background ripples underneath the boat */}
      <div className="absolute top-[35%] left-[25%] md:left-[22%] translate-x-[-50%] pointer-events-none">
        <div className="ripple-circle" style={{ animationDelay: "0s" }}></div>
        <div className="ripple-circle" style={{ animationDelay: "1.3s" }}></div>
        <div className="ripple-circle" style={{ animationDelay: "2.6s" }}></div>
      </div>


      {/* Header / Nav */}
      <header className="relative w-full flex justify-end p-6 z-50">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="relative group p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 transition-transform active:scale-95"
          aria-label="Toggle navigation menu"
        >
          {/* Sun Menu Button */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            {/* Sun Rays (SVG rotating/pulsing decoration) */}
            <svg 
              className="absolute inset-0 w-full h-full text-brand-yellow animate-spin" 
              style={{ animationDuration: "25s" }}
              viewBox="0 0 100 100"
            >
              <defs>
                <path id="ray" d="M 50 15 L 50 5 M 50 15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </defs>
              <use href="#ray" transform="rotate(0 50 50)" />
              <use href="#ray" transform="rotate(30 50 50)" />
              <use href="#ray" transform="rotate(60 50 50)" />
              <use href="#ray" transform="rotate(90 50 50)" />
              <use href="#ray" transform="rotate(120 50 50)" />
              <use href="#ray" transform="rotate(150 50 50)" />
              <use href="#ray" transform="rotate(180 50 50)" />
              <use href="#ray" transform="rotate(210 50 50)" />
              <use href="#ray" transform="rotate(240 50 50)" />
              <use href="#ray" transform="rotate(270 50 50)" />
              <use href="#ray" transform="rotate(300 50 50)" />
              <use href="#ray" transform="rotate(330 50 50)" />
            </svg>
            {/* Sun Body & Menu Icon */}
            <div className="absolute w-9 h-9 rounded-full bg-brand-yellow flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <Menu className="w-5 h-5 text-[#030c17] stroke-[2.5]" />
            </div>
          </div>
        </button>
      </header>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#030c17]/95 backdrop-blur-md z-50 flex flex-col justify-center items-center transition-all duration-300 animate-fade-in">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 p-3 rounded-full bg-brand-yellow text-[#030c17] hover:scale-110 active:scale-95 transition-transform duration-200"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
          
          <nav className="flex flex-col space-y-6 text-center">
            {["about-me", "services", "projects", "achievements", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-3xl font-serif tracking-wide text-slate-100 hover:text-brand-yellow capitalize transition-colors duration-200"
              >
                {section.replace("-", " ")}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center px-6 md:px-16 lg:px-24 pb-12 z-20">
        
        {/* Left Side: Fisherman Rowboat Illustration */}
        <div className="w-full md:w-1/2 flex justify-center items-center mb-10 md:mb-0 relative select-none">
          
          {/* Pleading speech bubble */}
          <div className="absolute top-[-20px] left-[35%] md:left-[30%] bg-white text-slate-900 px-4 py-2 rounded-2xl shadow-xl border border-slate-300 font-serif italic text-sm md:text-base animate-bounce" style={{ animationDuration: "2s" }}>
            Please give me a job 🥺
            {/* Bubble Tail */}
            <div className="absolute bottom-[-8px] left-12 w-4 h-4 bg-white border-r border-b border-slate-300 rotate-45"></div>
          </div>

          <div className="w-full max-w-[340px] sm:max-w-[420px] animate-bob">
            <svg 
              viewBox="0 0 400 300" 
              className="w-full h-auto text-slate-900 fill-current drop-shadow-2xl"
            >
              {/* Ripple water helper */}
              <ellipse cx="150" cy="205" rx="100" ry="12" className="text-blue-900/20 fill-current" />
              <ellipse cx="140" cy="215" rx="60" ry="6" className="text-blue-900/10 fill-current" />

              {/* Boat Shadow */}
              <path d="M 60 202 C 90 215, 230 215, 260 202 Q 160 218, 60 202 Z" className="text-blue-900/40 fill-current" />

              {/* Boat Body */}
              <path d="M 70 190 C 90 210, 240 210, 260 190 C 250 195, 210 202, 165 202 C 120 202, 80 195, 70 190 Z" />
              <path d="M 69 191 L 261 191 L 263 189 L 67 189 Z" className="text-slate-800 fill-current" />

              {/* Fisherman Silhouette */}
              {/* Head & Hat */}
              <circle cx="178" cy="148" r="9" />
              <path d="M 178 139 L 164 146 L 175 149 Z" /> {/* Cap brim */}
              
              {/* Torso & Arms */}
              <path d="M 178 156 C 182 165, 185 178, 186 186 C 176 189, 160 192, 153 184 C 148 176, 160 167, 168 166 Z" />
              
              {/* Arms holding rod */}
              <path d="M 170 160 Q 155 162, 150 166 C 147 169, 152 173, 158 170 Z" className="text-slate-800 fill-current" />
              
              {/* Legs */}
              <path d="M 186 186 C 188 193, 192 199, 199 199 L 180 199 Z" />

              {/* Fishing rod */}
              <line x1="164" y1="168" x2="35" y2="108" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 166 166 C 163 166, 161 170, 164 170 C 167 170, 169 166, 166 166 Z" className="text-slate-700 fill-current" />

              {/* Fishing rod wire guide rings */}
              <line x1="120" y1="147" x2="119" y2="149" stroke="currentColor" strokeWidth="1" />
              <line x1="80" y1="129" x2="79" y2="131" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Right Side: Text & CTA */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left md:pl-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight tracking-tight">
            Hi, I'm <span className="text-brand-yellow">Aryo</span>.
          </h1>
          
          <div className="mt-4 h-10 flex items-center text-xl sm:text-2xl text-slate-200/90 font-light">
            <span>I'm a&nbsp;</span>
            <span className="font-medium text-brand-yellow border-r-2 border-brand-yellow pr-1 animate-pulse">
              {roleText}
            </span>
          </div>

          <button
            onClick={() => scrollToSection("about-me")}
            className="mt-8 flex items-center space-x-2 px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-[#1e60a3] font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 group"
          >
            <span>Scroll to explore</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-200" />
          </button>
        </div>

      </div>

      {/* Bottom Section Spacer / Anchor */}
      <div id="about-me" className="h-4 w-full" />
    </section>
  );
}
