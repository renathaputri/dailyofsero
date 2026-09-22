"use client";

import React, { useState, useEffect } from "react";
import { Users, Sparkles, BookOpen, ArrowRight, Crown, Award, User } from "lucide-react";

interface TeamMember {
  id: string;
  username: string;
  name: string;
  role: string;
  title: "MIND_CAPTAIN" | "CO_CAPTAIN" | "BA";
  photoUrl?: string;
  bio?: string;
  _count: {
    karya: number;
  };
}

const titleLabels: Record<string, { label: string; badge: string }> = {
  MIND_CAPTAIN: { label: "Mind Captain", badge: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  CO_CAPTAIN: { label: "Co-Captain", badge: "bg-purple-100 text-purple-700 border-purple-200" },
  BA: { label: "Brand Ambassador", badge: "bg-sky-100 text-sky-700 border-sky-200" },
};

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/team?_t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.team) setTeam(data.team);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Ensure only 1 Mind Captain and 1 Co-Captain
  const mindCaptain = team.filter((m) => m.title === "MIND_CAPTAIN")[0] || null;
  const coCaptain = team.filter((m) => m.title === "CO_CAPTAIN")[0] || null;
  const brandAmbassadors = team.filter((m) => m.title === "BA");

  const renderMemberCard = (member: TeamMember, isLeader: boolean = false) => {
    const titleConfig = titleLabels[member.title] || { label: member.title, badge: "bg-slate-100 text-slate-700" };

    return (
      <a
        key={member.id}
        href={`/team/${member.username}`}
        className={`group rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col items-center justify-between text-center ${
          isLeader
            ? "p-6 sm:p-7 bg-gradient-to-b from-purple-50/40 via-white to-white border-purple-200/80"
            : "p-4 sm:p-5"
        }`}
      >
        <div className="flex flex-col items-center w-full">
          {/* Centered Avatar */}
          <div className="relative mb-3">
            {member.photoUrl ? (
              <img
                src={member.photoUrl}
                alt={member.name}
                className={`rounded-full object-cover border-4 border-slate-100 shadow-md group-hover:scale-105 transition-transform mx-auto ${
                  isLeader ? "w-20 h-20" : "w-16 h-16"
                }`}
              />
            ) : (
              <div
                className={`rounded-full bg-slate-100 border-2 border-slate-200 text-slate-400 flex items-center justify-center shadow-md mx-auto group-hover:text-purple-600 transition-colors ${
                  isLeader ? "w-20 h-20" : "w-16 h-16"
                }`}
              >
                <User className={isLeader ? "w-10 h-10" : "w-8 h-8"} />
              </div>
            )}
            {member.title === "MIND_CAPTAIN" && (
              <div className="absolute -top-1 -right-1 p-1 bg-indigo-600 text-white rounded-full shadow-sm">
                <Crown className="w-3.5 h-3.5" />
              </div>
            )}
            {member.title === "CO_CAPTAIN" && (
              <div className="absolute -top-1 -right-1 p-1 bg-purple-600 text-white rounded-full shadow-sm">
                <Award className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* Centered Role Badge */}
          <div className="mb-2">
            <span
              className={`inline-flex items-center justify-center font-bold px-2.5 py-0.5 rounded-full border ${
                titleConfig.badge
              } ${isLeader ? "text-[11px]" : "text-[10px]"}`}
            >
              {titleConfig.label}
            </span>
          </div>

          {/* Centered Name & Username */}
          <h2
            className={`font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1 ${
              isLeader ? "text-lg" : "text-sm sm:text-base"
            }`}
          >
            {member.name}
          </h2>
          <p className="text-[11px] text-slate-400 mb-2">@{member.username}</p>

          {/* Centered Bio */}
          <p
            className={`text-slate-600 leading-relaxed px-1 mb-4 ${
              isLeader
                ? "text-xs sm:text-sm line-clamp-3"
                : "text-[11px] sm:text-xs line-clamp-2"
            }`}
          >
            {member.bio || "Menjadi bagian dari safe space Serotonin 5 untuk saling menguatkan."}
          </p>
        </div>

        {/* Centered Card Footer */}
        <div
          className={`w-full pt-3 border-t border-slate-100 flex items-center justify-center gap-3 ${
            isLeader ? "text-xs" : "text-[11px]"
          }`}
        >
          <span className="flex items-center gap-1 font-semibold text-slate-500">
            <BookOpen className="w-3 h-3 text-sky-500" />
            {member._count?.karya || 0} Karya
          </span>
          <span className="font-bold text-purple-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            Lihat Profil <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </a>
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header - Rata Tengah */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" /> Serotonin 5
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Kenalan dengan Serotonin 5
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Struktur kepemimpinan dan Brand Ambassador Serotonin 5 yang senantiasa menghadirkan ruang aman dan karya edukatif inspiratif untukmu di MindSpace.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-56 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-16">
          {/* Leadership Section: Exactly 1 Mind Captain & 1 Co-Captain - Rata Tengah */}
          {(mindCaptain || coCaptain) && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-600 block mb-1">
                  Kepemimpinan Komunitas
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  Mind Captain & Co-Captain
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {mindCaptain && renderMemberCard(mindCaptain, true)}
                {coCaptain && renderMemberCard(coCaptain, true)}
              </div>
            </div>
          )}

          {/* Brand Ambassadors Section - 5 Cards Per Row on Desktop */}
          {brandAmbassadors.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-sky-600 block mb-1">
                  Kreator & Edukasi
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  Brand Ambassador (BA)
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 w-full">
                {brandAmbassadors.map((ba) => renderMemberCard(ba, false))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
