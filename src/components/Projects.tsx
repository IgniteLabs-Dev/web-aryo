"use client";

import React, { useState, useTransition, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { useData } from "@/lib/data-provider";

export default function Projects() {
  const { projects, categories, loading } = useData();
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isPending, startTransition] = useTransition();

  // Filter dari DB categories (sama seperti versi lama)
  const filters = useMemo(() => {
    const cats = (categories || []).filter((c) => c.type === "project");
    return ["All", ...cats.map((c) => c.name)];
  }, [categories]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects || [];
    return (projects || []).filter((p) => p.category === activeFilter);
  }, [projects, activeFilter]);

  const handleFilterChange = (filter: string) => {
    startTransition(() => {
      setActiveFilter(filter);
    });
  };

  if (loading && projects.length === 0) {
    return (
      <section id="projects" className="py-24 flex items-center justify-center">
        <div className="text-slate-500">Loading projects...</div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative w-full bg-[#030c17] py-24 px-6 md:px-16 lg:px-24 flex flex-col justify-center overflow-hidden">
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
        {filters.length > 1 && (
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
        )}

        {/* Projects Grid Container */}
        <div className="relative flex items-center w-full">
          
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
                {/* SVG Landscape Thumbnail - sky_grad & hill_colors dari DB */}
                <div className={`relative h-32 bg-gradient-to-b ${project.sky_grad} overflow-hidden border-b border-slate-800/80`}>
                  <svg viewBox="0 0 100 50" className="w-full h-full object-cover" preserveAspectRatio="none">
                    <circle cx="50" cy="50" r="32" fill={project.hill_colors[0]} opacity="0.75" />
                    <circle cx="15" cy="52" r="28" fill={project.hill_colors[1]} />
                    <circle cx="85" cy="52" r="26" fill={project.hill_colors[1]} />
                    <ellipse cx="30" cy="12" rx="7" ry="2" fill="white" opacity="0.8" />
                    <ellipse cx="70" cy="10" rx="9" ry="2.5" fill="white" opacity="0.8" />
                  </svg>
                </div>

                {/* Card Info */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
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
                      {project.name}
                    </h3>
                    
                    <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="col-span-full w-full text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-[#0c1c31]/30">
                <p className="text-slate-400 font-light">No projects found in this category.</p>
              </div>
            )}
          </div>

          {/* Right Arrow Paging overlay */}
          {filteredProjects.length > 0 && (
            <div className="hidden lg:flex absolute right-[-70px] top-1/2 -translate-y-1/2 z-20">
              <button
                onClick={() => handleFilterChange("All")}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0c1c31] border border-slate-800 hover:border-brand-yellow/50 text-slate-300 hover:text-brand-yellow hover:scale-105 active:scale-95 shadow-xl transition-all duration-200"
                aria-label="Show all projects"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
