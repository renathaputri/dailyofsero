"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  ExternalLink, 
  Instagram, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  SlidersHorizontal,
  LayoutGrid
} from "lucide-react";

interface KaryaItem {
  id: string;
  title: string;
  description: string;
  category: string;
  linkPost: string;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    username: string;
    title: string;
    photoUrl?: string;
  };
}

const CATEGORIES = [
  { id: "ALL", label: "Semua Kategori" },
  { id: "SELF_AWARENESS", label: "Self-Awareness" },
  { id: "MENTAL_HEALTH", label: "Mental Health" },
  { id: "GROWTH", label: "Growth" },
  { id: "CONNECTION", label: "Connection" },
  { id: "COMMUNITY", label: "Community" },
  { id: "OTHER", label: "Other" },
];

const categoryBadgeColors: Record<string, string> = {
  SELF_AWARENESS: "bg-sky-50 text-sky-700 border-sky-200",
  MENTAL_HEALTH: "bg-purple-50 text-purple-700 border-purple-200",
  GROWTH: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CONNECTION: "bg-amber-50 text-amber-700 border-amber-200",
  COMMUNITY: "bg-rose-50 text-rose-700 border-rose-200",
  OTHER: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function KaryaPage() {
  const [karyaList, setKaryaList] = useState<KaryaItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");

  // Slider controls
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    fetchKarya();
  }, [selectedCategory]);

  const fetchKarya = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === "ALL" ? "/api/karya" : `/api/karya?category=${selectedCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.karya) {
        setKaryaList(data.karya);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const current = sliderRef.current;
    if (current) {
      current.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      return () => {
        current.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, [karyaList, viewMode]);

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const renderKaryaCard = (karya: KaryaItem, isSlider: boolean = false) => {
    const badgeClass =
      categoryBadgeColors[karya.category] || "bg-slate-100 text-slate-700 border-slate-200";

    return (
      <a
        key={karya.id}
        href={karya.linkPost}
        target="_blank"
        rel="noopener noreferrer"
        className={`group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-purple-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
          isSlider
            ? "w-[85vw] sm:w-[280px] md:w-[300px] lg:w-[300px] xl:w-[280px] flex-shrink-0 snap-start h-full min-h-[260px]"
            : "h-full min-h-[260px]"
        }`}
      >
        {/* Top: Category & External Link icon */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
              {karya.category.replace("_", " ")}
            </span>
            <div className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-purple-50 text-slate-400 group-hover:text-purple-600 flex items-center justify-center transition-colors">
              <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <h2 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2 leading-snug mb-1.5">
            {karya.title}
          </h2>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">
            {karya.description}
          </p>
        </div>

        {/* Bottom: Owner Info */}
        <div className="pt-3 mt-auto border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {karya.owner?.photoUrl ? (
              <img
                src={karya.owner.photoUrl}
                alt={karya.owner.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200 flex-shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{karya.owner?.name}</p>
              <p className="text-[9px] font-semibold text-purple-600 uppercase truncate">
                {karya.owner?.title?.replace("_", " ") || "Brand Ambassador"}
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 flex-shrink-0">
            <Instagram className="w-3 h-3" />
            <span>Lihat</span>
          </span>
        </div>
      </a>
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Galeri Komunitas
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Karya & Insight Serotonin 5
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Kumpulan konten edukasi, cerita inspiratif, dan safe space refleksi karya teman-teman Brand Ambassador Serotonin 5.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm scale-105"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Controls: View Mode & Slider Navigation */}
      {!loading && karyaList.length > 0 && (
        <div className="flex items-center justify-between gap-3 mb-5 px-1">
          <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-[11px]">
              {karyaList.length} Karya
            </span>
            <span className="hidden sm:inline">Geser atau gunakan tombol panah</span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode("slider")}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === "slider"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Mode Slider"
                aria-label="Mode Slider"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">Slider</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Mode Grid"
                aria-label="Mode Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">Grid</span>
              </button>
            </div>

            {/* Slider Arrow Buttons (only visible in slider mode) */}
            {viewMode === "slider" && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollSlider("left")}
                  disabled={!canScrollLeft}
                  className={`p-2 rounded-xl border transition-all ${
                    !canScrollLeft
                      ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
                      : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200 shadow-xs active:scale-95"
                  }`}
                  title="Geser Kiri"
                  aria-label="Geser Kiri"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollSlider("right")}
                  disabled={!canScrollRight}
                  className={`p-2 rounded-xl border transition-all ${
                    !canScrollRight
                      ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
                      : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200 shadow-xs active:scale-95"
                  }`}
                  title="Geser Kanan"
                  aria-label="Geser Kanan"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content: Slider or Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : karyaList.length === 0 ? (
        <div className="text-center py-14 bg-white/60 rounded-3xl border border-slate-200/80 p-8 max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
          <h3 className="font-bold text-slate-700 text-sm">Belum Ada Karya di Kategori Ini</h3>
          <p className="text-xs text-slate-500 mt-1">Coba pilih kategori lain atau cek lagi nanti ya!</p>
        </div>
      ) : viewMode === "slider" ? (
        /* Slider Mode: Horizontal scroll container with snap effect */
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-4 pt-1 px-1 -mx-1"
          >
            {karyaList.map((karya) => renderKaryaCard(karya, true))}
          </div>

          {/* Mobile swipe hint */}
          <div className="sm:hidden flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-2">
            <span>← Geser untuk melihat karya lainnya →</span>
          </div>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {karyaList.map((karya) => renderKaryaCard(karya, false))}
        </div>
      )}
    </div>
  );
}
