"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BookOpen, ExternalLink, ArrowLeft, Instagram, Sparkles, User, Heart } from "lucide-react";

interface MemberDetail {
  id: string;
  username: string;
  name: string;
  role: string;
  title: "MIND_CAPTAIN" | "CO_CAPTAIN" | "BA";
  photoUrl?: string;
  bio?: string;
  karya: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    linkPost: string;
    createdAt: string;
  }>;
}

const titleLabels: Record<string, { label: string; badge: string }> = {
  MIND_CAPTAIN: { label: "Mind Captain", badge: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  CO_CAPTAIN: { label: "Co-Captain", badge: "bg-purple-100 text-purple-700 border-purple-200" },
  BA: { label: "Brand Ambassador", badge: "bg-sky-100 text-sky-700 border-sky-200" },
};

export default function MemberPortfolioPage() {
  const params = useParams();
  const username = params.username as string;

  const [member, setMember] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/team/${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.member) setMember(data.member);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-200 animate-pulse mx-auto mb-4" />
        <div className="h-6 w-48 bg-slate-200 animate-pulse mx-auto rounded-full" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Anggota Tim Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500">Profil yang kamu cari mungkin tidak tersedia.</p>
        <a
          href="/team"
          className="inline-flex items-center gap-2 text-sm font-bold text-sero-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Tim
        </a>
      </div>
    );
  }

  const titleConfig = titleLabels[member.title] || { label: member.title, badge: "bg-slate-100 text-slate-700" };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <div className="mb-8">
        <a
          href="/team"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Serotonin 5
        </a>
      </div>

      {/* Mini Portfolio Hero Profile (PRD 3.2) */}
      <div className="p-8 sm:p-10 rounded-4xl bg-white border border-slate-200/80 shadow-lg relative overflow-hidden mb-12">
        <div className="blob-shape bg-sero-purple-100 w-64 h-64 -top-20 -right-20" />
        <div className="blob-shape bg-sero-blue-100 w-64 h-64 -bottom-20 -left-20" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-md flex-shrink-0"
            />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-slate-100 border-2 border-slate-200 text-slate-400 flex items-center justify-center shadow-md flex-shrink-0">
              <User className="w-16 h-16" />
            </div>
          )}

          <div className="space-y-3 flex-grow">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${titleConfig.badge}`}>
                {titleConfig.label}
              </span>
              <span className="text-xs text-slate-400 font-mono">@{member.username}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {member.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              {member.bio || "Menjadi safe space bagi generasi muda untuk bertumbuh dan saling merangkul."}
            </p>

            <div className="pt-2 text-xs font-semibold text-slate-500 flex items-center justify-center sm:justify-start gap-4">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sero-purple-500" />
                {member.karya.length} Karya Dipublikasikan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-linked Karya List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sero-purple-500" />
            Karya Publikasi oleh {member.name}
          </h2>
        </div>

        {member.karya.length === 0 ? (
          <div className="p-12 text-center bg-white/70 rounded-3xl border border-slate-200">
            <p className="text-sm text-slate-500">
              {member.name} belum memiliki karya yang dipublikasikan saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {member.karya.map((k) => (
              <a
                key={k.id}
                href={k.linkPost}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-sero-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {k.category.replace("_", " ")}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sero-purple-600 transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sero-purple-700 transition-colors mb-2 line-clamp-2">
                    {k.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {k.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-500">
                  <span className="flex items-center gap-1">
                    <Instagram className="w-3.5 h-3.5" /> Lihat Karya
                  </span>
                  <span className="text-slate-400 font-normal">
                    {new Date(k.createdAt).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
