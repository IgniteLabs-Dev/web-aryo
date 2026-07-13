"use client";

import React, { useState, useTransition } from "react";
import { ChevronRight } from "lucide-react";

interface ProjectItem {
  id: string;
  category: "IT" | "Finance" | "Property" | "Others";
  tags: string[];
  title: string;
  description: string;
  skyGrad: string;
  hillColors: string[];
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isPending, startTransition] = useTransition();

  const filters = ["All", "IT", "Finance", "Property", "Others"];

  const projects: ProjectItem[] = [
    {
      id: "proj1",
      category: "IT",
      tags: ["IT", "ERP"],
      title: "Universitas Amikom Yogyakarta",
      description: "Custom enterprise resource planning system development to streamline academic scheduling and student billing operations.",
      skyGrad: "from-sky-200 to-sky-400",
      hillColors: ["#a3e635", "#65a30d"]
    },
    {
      id: "proj2",
      category: "IT",
      tags: ["IT", "WebDev"],
      title: "PT Prolintas Transutama Logistik",
      description: "High-performance freight forwarding web platform with client tracking and automated scheduling features.",
      skyGrad: "from-indigo-200 to-sky-300",
      hillColors: ["#84cc16", "#4d7c0f"]
    },
    {
      id: "proj3",
      category: "Finance",
      tags: ["Finance"],
      title: "PT Prolintas Transutama Logistik",
      description: "Reconciliation, corporate taxation, and automated billing software system for freight log compliance.",
      skyGrad: "from-teal-100 to-cyan-300",
      hillColors: ["#22c55e", "#15803d"]
    },
    {
      id: "proj4",
      category: "Property",
      tags: ["Property"],
      title: "Nusantara Indekos",
      description: "Co-living rental listing site with integrated stripe booking system and dynamic host dashboard.",
      skyGrad: "from-amber-100 to-orange-300",
      hillColors: ["#a3e635", "#65a30d"]
    },
    {
      id: "proj5",
      category: "IT",
      tags: ["IT", "SystemDev"],
      title: "Pengadilan Tinggi Agama Yogya",
      description: "Court case scheduling tracker and document archiving system built for government legal compliance.",
      skyGrad: "from-blue-200 to-indigo-300",
      hillColors: ["#84cc16", "#4d7c0f"]
    },
    {
      id: "proj6",
      category: "Finance",
      tags: ["Finance"],
      title: "PT Prolintas Transutama Logistik",
      description: "Automated audit logs and accounting ledger integration tools featuring excel export pipelines.",
      skyGrad: "from-emerald-100 to-teal-300",
      hillColors: ["#16a34a", "#166534"]
    },
    {
      id: "proj7",
      category: "Property",
      tags: ["Property"],
      title: "Nusantara Indekos",
      description: "Tenant profile vetting workflows and lease agreement automation engine using nextjs.",
      skyGrad: "from-orange-100 to-red-200",
      hillColors: ["#d9f99d", "#4d7c0f"]
    },
    {
      id: "proj8",
      category: "IT",
      tags: ["IT", "IoT"],
      title: "Universitas Amikom Yogyakarta",
      description: "Smart agriculture IoT nodes monitoring crop soil moisture, temperature, and automatic irrigation.",
      skyGrad: "from-violet-200 to-purple-300",
      hillColors: ["#84cc16", "#4d7c0f"]
    }
  ];

  const handleFilterChange = (filter: string) => {
    startTransition(() => {
      setActiveFilter(filter);
    });
  };

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "All") return true;
    return project.category === activeFilter;
  });

  return (
    <section id="projects" className="relative w-full bg-[#030c17] py-24 px-6 md:px-16 lg:px-24 flex flex-col justify-center overflow-hidden">
      
      {/* Thin Fishing Line (Left side) */}
      <div className="absolute left-[12%] sm:left-[10%] lg:left-[8.5%] top-0 w-[1.5px] h-full bg-white/20 z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full z-20">
        
        {/* Header Title */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-12">
          <span className="text-sm font-semibold tracking-widest text-brand-yellow uppercase">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2 leading-tight">
            Projects
          </h2>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-10">
          {filters.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 active:scale-95 border ${
                  isActive
                    ? "bg-brand-yellow border-brand-yellow text-[#030c17] shadow-lg shadow-brand-yellow/10"
                    : "bg-[#091728] border-slate-700/60 text-slate-300 hover:border-slate-500"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Projects Grid Container with Navigation Arrow */}
        <div className="relative flex items-center w-full">
          
          {/* Main Grid */}
          <div 
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full transition-opacity duration-300 ${
              isPending ? "opacity-55" : "opacity-100"
            }`}
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col rounded-2xl overflow-hidden bg-[#0c1c31] border border-slate-800/80 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-brand-yellow/2"
              >
                {/* SVG Landscape Thumbnail */}
                <div className={`relative h-32 bg-gradient-to-b ${project.skyGrad} overflow-hidden border-b border-slate-800/80`}>
                  <svg viewBox="0 0 100 50" className="w-full h-full object-cover" preserveAspectRatio="none">
                    {/* Back hill */}
                    <circle cx="50" cy="50" r="32" fill={project.hillColors[0]} opacity="0.75" />
                    {/* Front hill left */}
                    <circle cx="15" cy="52" r="28" fill={project.hillColors[1]} />
                    {/* Front hill right */}
                    <circle cx="85" cy="52" r="26" fill={project.hillColors[1]} />
                    {/* Clouds */}
                    <ellipse cx="30" cy="12" rx="7" ry="2" fill="white" opacity="0.8" />
                    <ellipse cx="70" cy="10" rx="9" ry="2.5" fill="white" opacity="0.8" />
                  </svg>
                </div>

                {/* Card Info */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase bg-slate-800 text-slate-300 border border-slate-700/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-brand-yellow transition-colors duration-200">
                      {project.title}
                    </h3>
                    
                    <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Right Arrow Paging overlay (decorative / slide control trigger) */}
          <div className="hidden lg:flex absolute right-[-70px] top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={() => handleFilterChange("All")}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0c1c31] border border-slate-800 hover:border-brand-yellow/50 text-slate-300 hover:text-brand-yellow hover:scale-105 active:scale-95 shadow-xl transition-all duration-200"
              aria-label="Show all projects"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
