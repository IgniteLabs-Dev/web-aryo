"use client";

import React, { useState } from "react";
import { BarChart3, Building2, Code2, ChevronRight } from "lucide-react";

interface ServiceItem {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  sheepX: number;
  sheepY: number;
  hillColor: string;
  skyColor: string;
}

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);

  const services: ServiceItem[] = [
    {
      id: "finance",
      category: "FINANCE & ACCOUNTING",
      title: "PT Prolintas Transutama Logistik",
      description: "Responsible for managing corporate bookkeeping, cash flow optimization, tax reporting, and financial statement audits. Delivered comprehensive analysis resulting in a 15% reduction in administrative overhead.",
      icon: <BarChart3 className="w-4 h-4" />,
      sheepX: 45,
      sheepY: 135,
      hillColor: "#65a30d",
      skyColor: "from-sky-100 to-sky-300"
    },
    {
      id: "property",
      category: "PROPERTY MANAGEMENT",
      title: "Nusantara Indekos",
      description: "Supervised asset operations, tenant acquisitions, rental collections, and preventative maintenance programs. Optimized occupancy rates up to 98% through digital listing integrations and modern tenant services.",
      icon: <Building2 className="w-4 h-4" />,
      sheepX: 95,
      sheepY: 125,
      hillColor: "#84cc16",
      skyColor: "from-blue-100 to-blue-300"
    },
    {
      id: "it",
      category: "WEB DEVELOPMENT & IT",
      title: "Universitas Amikom Yogyakarta",
      description: "Designed and engineered enterprise-grade web platforms and custom database systems. Integrated APIs and developed responsive admin dashboards using modern frontend stacks (Next.js, React, Tailwind CSS).",
      icon: <Code2 className="w-4 h-4" />,
      sheepX: 145,
      sheepY: 132,
      hillColor: "#4d7c0f",
      skyColor: "from-indigo-100 to-blue-200"
    }
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % services.length);
  };

  const activeService = services[activeIndex];

  return (
    <section id="services" className="relative w-full bg-[#030c17] py-24 px-6 md:px-16 lg:px-24 flex flex-col justify-center overflow-hidden">



      <div className="max-w-6xl mx-auto w-full z-20">
        
        {/* Header Title */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-12">
          <span className="text-sm font-semibold tracking-widest text-brand-yellow uppercase">
            What I Do
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2 leading-tight">
            Services
          </h2>
        </div>

        {/* Tab Buttons (Horizontal Selector) */}
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
                {service.icon}
                <span className="capitalize">{service.id === "it" ? "Web Dev / IT" : service.id.replace("-", " & ")}</span>
              </button>
            );
          })}
        </div>

        {/* Card and Navigation Container */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          
          {/* Main Service Card */}
          <div className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0c1c31] transition-all duration-500 hover:border-slate-700 flex flex-col">
            
            {/* Top Half: Landscape SVG with moving sheep */}
            <div className={`relative w-full h-44 sm:h-52 bg-gradient-to-b ${activeService.skyColor} border-b border-slate-800 overflow-hidden`}>
              <svg viewBox="0 0 200 80" className="absolute inset-0 w-full h-full object-cover" preserveAspectRatio="none">
                
                {/* Rolling Hill Back */}
                <path d="M -10 80 Q 40 40, 110 60 T 210 80 Z" fill={activeService.hillColor} opacity="0.6" className="transition-all duration-700" />
                
                {/* Rolling Hill Front */}
                <path d="M -10 80 Q 90 45, 210 80 Z" fill={activeService.hillColor} className="transition-all duration-700" />
                
                {/* Fluffy clouds */}
                <ellipse cx="30" cy="18" rx="12" ry="4" fill="white" opacity="0.8" />
                <ellipse cx="160" cy="15" rx="16" ry="5" fill="white" opacity="0.8" />
                <ellipse cx="170" cy="18" rx="10" ry="4" fill="white" opacity="0.8" />

                {/* Animated Sheep */}
                <g 
                  transform={`translate(${activeService.sheepX}, ${activeService.sheepY})`} 
                  className="transition-all duration-1000 ease-out"
                >
                  {/* Legs */}
                  <line x1="2" y1="6" x2="2" y2="10" stroke="#000" strokeWidth="1" />
                  <line x1="4" y1="6" x2="4" y2="10" stroke="#000" strokeWidth="1" />
                  <line x1="7" y1="6" x2="7" y2="10" stroke="#000" strokeWidth="1" />
                  <line x1="9" y1="6" x2="9" y2="10" stroke="#000" strokeWidth="1" />
                  {/* Fluffy body */}
                  <ellipse cx="5" cy="4" rx="6" ry="4" fill="#ffffff" />
                  {/* Black head */}
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
                {activeService.title}
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
