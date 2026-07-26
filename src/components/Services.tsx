"use client";

import React, { useState, useMemo } from "react";
import { BarChart3, Building2, Code2, ChevronRight, Layers } from "lucide-react";
import { useData } from "@/lib/data-provider";

// Map icon name (string di DB) ke komponen Lucide (sama seperti versi lama)
const ICON_MAP: Record<string, React.ReactNode> = {
  BarChart3: <BarChart3 className="w-4 h-4" />,
  Building2: <Building2 className="w-4 h-4" />,
  Code2: <Code2 className="w-4 h-4" />,
};

export default function Services() {
  const { services, loading } = useData();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeService = useMemo(() => services[activeIndex], [services, activeIndex]);

  const handleNext = () => {
    if (services.length > 0) {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }
  };

  if (loading && services.length === 0) {
    return (
      <section id="services" className="py-24 flex items-center justify-center">
        <div className="text-slate-500">Loading services...</div>
      </section>
    );
  }

  if (!activeService) {
    return (
      <section id="services" className="relative w-full bg-[#030c17] py-24 px-6 flex flex-col items-center">
        <span className="text-sm font-semibold tracking-widest text-brand-yellow uppercase">What I Do</span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2 leading-tight">Services</h2>
        <p className="text-slate-500 mt-6">No services yet. Add them via admin panel.</p>
      </section>
    );
  }

  return (
    <section id="services" className="relative w-full bg-[#030c17] py-24 px-6 md:px-16 lg:px-24 flex flex-col justify-center overflow-hidden">
      <div className="max-w-6xl mx-auto w-full z-20">
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-12">
          <span className="text-sm font-semibold tracking-widest text-brand-yellow uppercase">
            What I Do
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2 leading-tight">
            Services
          </h2>
        </div>

        {/* Tab Buttons - Subject & icon dari DB */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
          {services.map((service, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={service.id}
                onClick={() => setActiveIndex(index)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 active:scale-95 border ${
                  isActive
                    ? "bg-brand-yellow border-brand-yellow text-[#030c17] shadow-lg shadow-brand-yellow/20"
                    : "bg-[#091728] border-slate-700/60 text-slate-300 hover:border-slate-500"
                }`}
              >
                {ICON_MAP[service.icon] || <Layers className="w-4 h-4" />}
                <span>{service.subject}</span>
              </button>
            );
          })}
        </div>

        {/* Card and Navigation Container */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          
          {/* Main Service Card */}
          <div className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0c1c31] transition-all duration-500 hover:border-slate-700 flex flex-col">
            
            {/* Top Half: Landscape SVG with moving sheep */}
            <div className={`relative w-full h-44 sm:h-52 bg-gradient-to-b ${activeService.sky_grad} border-b border-slate-800 overflow-hidden`}>
              <svg viewBox="0 0 200 80" className="absolute inset-0 w-full h-full object-cover" preserveAspectRatio="none">
                <path d="M -10 80 Q 40 40, 110 60 T 210 80 Z" fill={activeService.hill_color} opacity="0.6" className="transition-all duration-700" />
                <path d="M -10 80 Q 90 45, 210 80 Z" fill={activeService.hill_color} className="transition-all duration-700" />
                <ellipse cx="30" cy="18" rx="12" ry="4" fill="white" opacity="0.8" />
                <ellipse cx="160" cy="15" rx="16" ry="5" fill="white" opacity="0.8" />
                <ellipse cx="170" cy="18" rx="10" ry="4" fill="white" opacity="0.8" />
                <g 
                  transform={`translate(${activeService.sheep_x}, ${activeService.sheep_y})`} 
                  className="transition-all duration-1000 ease-out"
                >
                  <line x1="2" y1="6" x2="2" y2="10" stroke="#000" strokeWidth="1" />
                  <line x1="4" y1="6" x2="4" y2="10" stroke="#000" strokeWidth="1" />
                  <line x1="7" y1="6" x2="7" y2="10" stroke="#000" strokeWidth="1" />
                  <line x1="9" y1="6" x2="9" y2="10" stroke="#000" strokeWidth="1" />
                  <ellipse cx="5" cy="4" rx="6" ry="4" fill="#ffffff" />
                  <circle cx="11" cy="3" r="2" fill="#1e293b" />
                </g>
              </svg>
            </div>

            {/* Bottom Half: Details */}
            <div className="p-8 sm:p-10 flex flex-col items-start">
              <span className="text-xs font-semibold tracking-widest text-brand-yellow uppercase">
                {activeService.category}
              </span>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 leading-tight">
                {activeService.name}
              </h3>
              
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                {activeService.description}
              </p>

              <button className="mt-8 px-5 py-2.5 rounded-full bg-slate-700/50 hover:bg-slate-700 text-slate-100 font-semibold text-xs sm:text-sm active:scale-95 transition-all duration-200">
                View Details &gt;
              </button>
            </div>
          </div>

          {/* Right Arrow Navigation Button */}
          <button
            onClick={handleNext}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-[#0c1c31] border border-slate-800 hover:border-brand-yellow/50 text-slate-300 hover:text-brand-yellow hover:scale-105 active:scale-95 shadow-xl hover:shadow-brand-yellow/5 transition-all duration-200"
            aria-label="Next service"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}
