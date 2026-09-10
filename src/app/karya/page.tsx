"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, ExternalLink, Instagram, Sparkles, Filter, User } from "lucide-react";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sero-purple-100 text-sero-purple-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Galeri Komunitas
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Karya & Insight Brand Ambassador
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Kumpulan konten edukasi, cerita inspiratif, dan safe space refleksi karya teman-teman Brand Ambassador Tim Serotonin.
        </p>
      </div>

      {/* Category Filters (PRD 3.3) */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
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

      {/* Karya Cards Grid (No thumbnail, clean cards redirect to IG post) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : karyaList.length === 0 ? (
        <div className="text-center py-16 bg-white/60 rounded-4xl border border-slate-200/80 p-8 max-w-md mx-auto">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-base">Belum Ada Karya di Kategori Ini</h3>
          <p className="text-xs text-slate-500 mt-1">Coba pilih kategori lain atau cek lagi nanti ya!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {karyaList.map((karya) => {
            const badgeClass = categoryBadgeColors[karya.category] || "bg-slate-100 text-slate-700 border-slate-200";
            return (
              <a
                key={karya.id}
                href={karya.linkPost}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-sero-purple-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top: Category & External Link icon */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${badgeClass}`}>
                      {karya.category.replace("_", " ")}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-sero-purple-50 text-slate-400 group-hover:text-sero-purple-600 flex items-center justify-center transition-colors">
                      <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-sero-purple-700 transition-colors line-clamp-2 leading-snug mb-3">
                    {karya.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4">
                    {karya.description}
                  </p>
                </div>

                {/* Bottom: Owner Info */}
                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {karya.owner?.photoUrl ? (
                      <img
                        src={karya.owner.photoUrl}
                        alt={karya.owner.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-sero-purple-100 text-sero-purple-600 flex items-center justify-center text-xs font-bold">
                        {karya.owner?.name?.charAt(0) || "B"}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-800">{karya.owner?.name}</p>
                      <p className="text-[10px] font-semibold text-sero-purple-600 uppercase">
                        {karya.owner?.title?.replace("_", " ") || "Brand Ambassador"}
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-semibold text-rose-500">
                    <Instagram className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Buka IG</span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
