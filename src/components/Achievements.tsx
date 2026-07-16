"use client";

import React, { useState, useTransition } from "react";
import { BookOpen, Award, FileText, Calendar, ChevronRight } from "lucide-react";

interface AchievementItem {
  id: string;
  type: "Publication" | "Certification" | "Patent" | "Others";
  title: string;
  subtitle: string;
  date: string;
}

export default function Achievements() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isPending, startTransition] = useTransition();

  const filters = ["All", "Publication", "Certification", "Patent", "Others"];

  const achievements: AchievementItem[] = [
    {
      id: "ach1",
      type: "Publication",
      title: "Pemanfaatan IoT untuk Meningkatkan Produktivitas dan Hasil Penjualan Cabai Organik",
      subtitle: "Jurnal Abdi Insani",
      date: "Dec 06, 2023"
    },
    {
      id: "ach2",
      type: "Publication",
      title: "Analisis Performa Arsitektur CNN Inception dan VGG dalam Klasifikasi Deteksi Kanker",
      subtitle: "Jurnal Ilmiah Penelitian dan Pembelajaran Informatika",
      date: "Dec 06, 2023"
    },
    {
      id: "ach3",
      type: "Certification",
      title: "Accounting for Non Accounting Certified",
      subtitle: "Reg No: 0023/RMI/ANACP/X/2025",
      date: "Jun 06, 2024"
    },
    {
      id: "ach4",
      type: "Patent",
      title: "Kode Program Sritanio Greentech : Transformasi Digital untuk Cabai Organik",
      subtitle: "EC00202501864 - HAKI Kemenkumham RI",
      date: "Jan 06, 2025"
    },
    {
      id: "ach5",
      type: "Patent",
      title: "IoT Node Sensor Sritanio Greentech : Otomatisasi Siram Cabai",
      subtitle: "EC00202501865 - HAKI Kemenkumham RI",
      date: "Jan 06, 2025"
    }
  ];

  const handleFilterChange = (filter: string) => {
    startTransition(() => {
      setActiveFilter(filter);
    });
  };

  const filteredAchievements = achievements.filter((ach) => {
    if (activeFilter === "All") return true;
    return ach.type === activeFilter;
  });

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case "Publication":
        return {
          bg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          icon: <BookOpen className="w-5 h-5" />
        };
      case "Certification":
        return {
          bg: "bg-amber-500/10 text-brand-yellow border-amber-500/20",
          icon: <Award className="w-5 h-5" />
        };
      case "Patent":
        return {
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: <FileText className="w-5 h-5" />
        };
      default:
        return {
          bg: "bg-slate-500/10 text-slate-400 border-slate-500/20",
          icon: <FileText className="w-5 h-5" />
        };
    }
  };

  return (
    <section id="achievements" className="relative w-full bg-[#020912] py-24 px-6 md:px-16 lg:px-24 flex flex-col justify-center overflow-hidden">



      <div className="max-w-6xl mx-auto w-full z-20">
        
        {/* Header Title */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-12">
          <span className="text-sm font-semibold tracking-widest text-brand-yellow uppercase">
            Achievement
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2 leading-tight">
            Publications & Certifications
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

        {/* Rows List Container with Navigation Arrow */}
        <div className="relative flex items-center w-full gap-6">
          
          {/* Rows List */}
          <div 
            className={`flex-grow flex flex-col space-y-4 transition-opacity duration-300 ${
              isPending ? "opacity-55" : "opacity-100"
            }`}
          >
            {filteredAchievements.map((ach) => {
              const badge = getBadgeStyles(ach.type);
              return (
                <div
                  key={ach.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-[#0c1c31] border border-slate-800/80 hover:border-slate-600 transition-all duration-300 shadow-md"
                >
                  <div className="flex items-start sm:items-center space-x-4">
                    {/* Badge Icon Block */}
                    <div className={`p-3.5 rounded-xl border ${badge.bg} flex items-center justify-center shrink-0`}>
                      {badge.icon}
                    </div>

                    {/* Content Block */}
                    <div className="flex flex-col">
                      {/* Mobile tag indicator */}
                      <span className="inline-block sm:hidden text-[10px] font-semibold text-brand-yellow tracking-wider uppercase mb-1">
                        {ach.type}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-brand-yellow transition-colors duration-200">
                        {ach.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
                        {ach.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Date & Metadata */}
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-3 sm:mt-0 pl-14 sm:pl-0 font-light select-none">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ach.date}</span>
                  </div>

                </div>
              );
            })}

            {filteredAchievements.length === 0 && (
              <div className="w-full text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-[#0c1c31]/30">
                <p className="text-slate-400 font-light">No achievements found in this category.</p>
              </div>
            )}
          </div>

          {/* Right Arrow Paging overlay (decorative / reset filter) */}
          <div className="hidden lg:flex shrink-0">
            <button
              onClick={() => handleFilterChange("All")}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-[#0c1c31] border border-slate-800 hover:border-brand-yellow/50 text-slate-300 hover:text-brand-yellow hover:scale-105 active:scale-95 shadow-xl transition-all duration-200"
              aria-label="Show all achievements"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
