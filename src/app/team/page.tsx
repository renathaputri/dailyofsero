"use client";

import React, { useState, useEffect } from "react";
import { Users, Sparkles, BookOpen, ArrowRight, ShieldCheck, Heart } from "lucide-react";

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
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (data?.team) setTeam(data.team);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const mindCaptains = team.filter((m) => m.title === "MIND_CAPTAIN");
  const coCaptains = team.filter((m) => m.title === "CO_CAPTAIN");
  const brandAmbassadors = team.filter((m) => m.title === "BA");

  const renderMemberCard = (member: TeamMember) => {
    const titleConfig = titleLabels[member.title] || { label: member.title, badge: "bg-slate-100 text-slate-700" };

    return (
      <a
        key={member.id}
        href={`/team/${member.username}`}
        className="group p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-sero-purple-300 transition-all duration-300 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-start gap-4 mb-4">
            {member.photoUrl ? (
              <img
                src={member.photoUrl}
                alt={member.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sero-blue-400 to-sero-purple-500 text-white font-black text-xl flex items-center justify-center shadow-md">
                {member.name.charAt(0)}
              </div>
            )}
            <div className="space-y-1">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${titleConfig.badge}`}>
                {titleConfig.label}
              </span>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-sero-purple-700 transition-colors">
                {member.name}
              </h2>
              <p className="text-xs text-slate-400">@{member.username}</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
            {member.bio || "Menjadi bagian dari safe space Tim Serotonin untuk saling menguatkan."}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-slate-500">
            <BookOpen className="w-4 h-4 text-sero-blue-500" />
            {member._count.karya} Karya Publikasi
          </span>
          <span className="font-bold text-sero-purple-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Mini Portfolio <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sero-blue-100 text-sero-blue-700 text-xs font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" /> Tim Serotonin
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Kenalan bareng Mind Captain & BA
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Struktur kepemimpinan dan Brand Ambassador Tim Serotonin yang senantiasa menghadirkan ruang aman dan karya inspiratif untukmu.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 rounded-3xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Mind Captain Section */}
          {mindCaptains.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-indigo-100">
                <span className="text-xl">👑</span>
                <h2 className="text-xl font-bold text-slate-900">Mind Captain</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mindCaptains.map(renderMemberCard)}
              </div>
            </div>
          )}

          {/* Co-Captain Section */}
          {coCaptains.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-purple-100">
                <span className="text-xl">🌟</span>
                <h2 className="text-xl font-bold text-slate-900">Co-Captain</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coCaptains.map(renderMemberCard)}
              </div>
            </div>
          )}

          {/* Brand Ambassadors Section */}
          {brandAmbassadors.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-sky-100">
                <span className="text-xl">🌱</span>
                <h2 className="text-xl font-bold text-slate-900">Brand Ambassador (BA)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brandAmbassadors.map(renderMemberCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
