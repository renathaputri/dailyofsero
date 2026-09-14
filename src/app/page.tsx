"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  Flame, 
  Lock, 
  HeartHandshake, 
  ShieldAlert, 
  LogIn, 
  UserPlus, 
  Quote, 
  CheckCircle2, 
  Users, 
  Crown, 
  Award,
  PhoneCall,
  ExternalLink,
  User
} from "lucide-react";

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

export default function HomePage() {
  const [qotd, setQotd] = useState<{ content: string; author: string } | null>(null);
  const [user, setUser] = useState<{ id: string; name?: string } | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);

  const awaremindUrl = process.env.NEXT_PUBLIC_AWAREMIND_URL || "https://awaremind.id";

  useEffect(() => {
    // Check if user is logged in
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});

    // Fetch Quote of the day
    fetch("/api/content-bank?qotd=true")
      .then((res) => res.json())
      .then((data) => {
        if (data?.quote) setQotd(data.quote);
      })
      .catch(() => {
        setQotd({
          content: "Setiap langkah kecil adalah kemenangan. Tetaplah ramah pada dirimu hari ini.",
          author: "Tim Serotonin Batch 5",
        });
      });

    // Fetch Team Serotonin Batch 5
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (data?.team) setTeam(data.team);
      })
      .catch(() => {})
      .finally(() => setTeamLoading(false));
  }, []);

  const rawQuoteContent = qotd?.content || "Setiap langkah kecil adalah kemenangan. Tetaplah ramah pada dirimu hari ini.";
  const cleanQuoteContent = rawQuoteContent.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();

  // Ensure only 1 Mind Captain and 1 Co-Captain
  const mindCaptain = team.filter((m) => m.title === "MIND_CAPTAIN")[0] || null;
  const coCaptain = team.filter((m) => m.title === "CO_CAPTAIN")[0] || null;

  const renderMemberCard = (member: TeamMember, isLeader: boolean = false) => {
    const titleConfig = titleLabels[member.title] || { label: member.title, badge: "bg-slate-100 text-slate-700" };

    return (
      <a
        key={member.id}
        href={`/team/${member.username}`}
        className={`group p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col items-center justify-between text-center ${
          isLeader ? "bg-gradient-to-b from-purple-50/50 via-white to-white border-purple-200" : ""
        }`}
      >
        <div className="flex flex-col items-center w-full">
          {/* Centered Avatar with User icon fallback */}
          <div className="relative mb-4">
            {member.photoUrl ? (
              <img
                src={member.photoUrl}
                alt={member.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 shadow-md group-hover:scale-105 transition-transform mx-auto"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 text-slate-400 flex items-center justify-center shadow-md mx-auto group-hover:text-purple-600 transition-colors">
                <User className="w-10 h-10" />
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

          {/* Centered Badge */}
          <div className="mb-2">
            <span className={`inline-flex items-center justify-center text-[11px] font-bold px-3 py-1 rounded-full border ${titleConfig.badge}`}>
              {titleConfig.label}
            </span>
          </div>

          {/* Centered Name & Username */}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
            {member.name}
          </h3>
          <p className="text-xs text-slate-400 mb-3">@{member.username}</p>

          {/* Centered Bio */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4 px-2">
            {member.bio || "Menjadi bagian dari safe space Tim Serotonin Batch 5 untuk saling menguatkan."}
          </p>
        </div>

        {/* Centered Footer */}
        <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-slate-500">
            <BookOpen className="w-3.5 h-3.5 text-sky-500" />
            {member._count?.karya || 0} Karya
          </span>
          <span className="font-bold text-purple-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            Lihat Profil <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>
    );
  };

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO (PUTIH / LIGHT BACKGROUND - INFO SOAL WEB MINDSPACE)     */}
      {/* ========================================================================= */}
      <section className="w-full bg-white text-slate-900 min-h-[calc(100vh-72px)] flex items-center justify-center border-b border-slate-200/80 relative py-12 sm:py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 text-purple-600" /> Platform Kesehatan Mental & Komunitas
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.2]">
                Ruang Aman untuk Bernapas & Pulih{" "}
                <span className="text-purple-700 block sm:inline">
                  Bersama MindSpace
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
                Temukan ruang aman untuk merangkul setiap emosimu. Tulis jurnal pribadi dengan enkripsi <strong>AES-256</strong>, eksplorasi karya inspiratif dari Brand Ambassador <strong>Tim Serotonin Batch 5</strong>, dan dapatkan pendampingan psikolog resmi dari <strong>AwareMind</strong>.
              </p>

              {/* Trust highlights */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enkripsi AES-256</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Zero Judgement Space</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  <span>Didukung AwareMind</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
                {user ? (
                  <a
                    href="/healing"
                    className="px-8 py-4 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Masuk ke Healing Corner</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <a
                    href="/register"
                    className="px-8 py-4 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Mulai Perjalanan Pulih (Gratis)</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}

                <a
                  href="/karya"
                  className="px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 hover:border-purple-400 transition-all flex items-center justify-center gap-2.5 shadow-xs"
                >
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <span>Jelajahi Galeri Karya</span>
                </a>
              </div>
            </div>

            {/* Right Interactive Card / Daily Quote */}
            <div className="lg:col-span-5">
              <div className="p-8 sm:p-10 rounded-3xl bg-purple-50/60 border-2 border-purple-200 shadow-xl relative">
                <div className="flex items-center justify-between mb-4 text-xs font-bold text-purple-700 uppercase tracking-wider border-b border-purple-200/70 pb-3">
                  <span className="flex items-center gap-2">
                    <Quote className="w-4 h-4 text-purple-600" /> Quote of the Day
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">Pembaruan Tiap 00:00 WIB</span>
                </div>

                <div className="space-y-4 my-3">
                  <p className="text-lg sm:text-xl font-medium text-slate-800 italic leading-relaxed">
                    "{cleanQuoteContent}"
                  </p>
                  <p className="text-right text-xs sm:text-sm font-bold text-purple-700">
                    Oleh {qotd?.author || "Tim Serotonin Batch 5"}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 text-purple-800 font-medium">
                    <Heart className="w-3.5 h-3.5 text-purple-600" /> Sentuhan ketenangan harian
                  </span>
                  <a
                    href="/karya"
                    className="font-bold text-purple-700 hover:underline flex items-center gap-1"
                  >
                    <span>Baca Insight Lain</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: TIGA PILAR EKOSISTEM (UNGU DEEP BACKGROUND)                    */}
      {/* ========================================================================= */}
      <section className="w-full bg-gradient-to-b from-[#4C1D95] via-[#581C87] to-[#3B0764] text-white py-16 sm:py-24 relative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-purple-200 border border-white/15 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" /> Ekosistem Kebaikan
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Tiga Ruang Utama untuk Jiwa & Pikiranmu
            </h2>
            <p className="text-sm sm:text-base text-purple-200 leading-relaxed">
              MindSpace menyediakan wadah komprehensif mulai dari eksplorasi karya edukatif, refleksi jurnal mandiri yang terenkripsi, hingga rujukan bantuan profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Galeri Karya */}
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-purple-300/80 hover:bg-white/15 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold shadow-inner">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                  Galeri Karya Brand Ambassador
                </h3>
                <p className="text-sm text-purple-100 leading-relaxed">
                  Kumpulan tulisan inspiratif, ilustrasi komik, dan tips kesehatan mental dari Brand Ambassador Tim Serotonin Batch 5 yang terhubung langsung ke media sosial resmi.
                </p>
              </div>
              <div className="pt-6">
                <a
                  href="/karya"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-white/20 hover:bg-white hover:text-[#581C87] px-5 py-2.5 rounded-full transition-all"
                >
                  <span>Buka Galeri Karya</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card 2: Healing Corner (Member Area) */}
            <div className="p-8 rounded-3xl bg-white/15 backdrop-blur-md border-2 border-purple-300/40 hover:border-purple-200 hover:bg-white/20 transition-all flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white text-[#581C87] flex items-center justify-center font-bold shadow-md">
                  <Heart className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">
                    Healing Corner
                  </h3>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-900">
                    Fitur Member
                  </span>
                </div>
                <p className="text-sm text-purple-100 leading-relaxed">
                  Ruang privat setelah login untuk Check-in Emosi Harian, journaling dengan enkripsi AES-256, dan latihan pernapasan kotak 4-4-4.
                </p>
              </div>
              <div className="pt-6 relative z-10">
                <a
                  href={user ? "/healing" : "/login?redirect=/healing"}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#581C87] bg-white hover:bg-purple-50 px-5 py-2.5 rounded-full transition-all shadow-md"
                >
                  <span>{user ? "Akses Healing Corner" : "Masuk untuk Akses Dashboard"}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card 3: Layanan AwareMind */}
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-purple-300/80 hover:bg-white/15 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold shadow-inner">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                  Dukungan Konseling AwareMind
                </h3>
                <p className="text-sm text-purple-100 leading-relaxed">
                  Direktori psikolog dan konselor berlisensi resmi dari platform AwareMind serta panduan hotline darurat kesehatan mental 24/7.
                </p>
              </div>
              <div className="pt-6">
                <a
                  href="/awaremind"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-white/20 hover:bg-white hover:text-[#581C87] px-5 py-2.5 rounded-full transition-all"
                >
                  <span>Lihat Tim Konselor</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: AWAREMIND PARTNERSHIP SPOTLIGHT (LIGHT BACKGROUND)             */}
      {/* ========================================================================= */}
      <section className="w-full bg-slate-50 text-slate-900 py-16 sm:py-24 border-y border-slate-200/80 relative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-4xl bg-gradient-to-br from-rose-50/80 via-white to-purple-50/50 border border-slate-200 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4 text-left">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4" /> Kemitraan Resmi Konseling
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  Pendampingan Profesional Bersama AwareMind
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                  MindSpace bekerja sama dengan <strong>AwareMind</strong> untuk memastikan setiap individu yang membutuhkan bimbingan klinis dapat terhubung langsung ke psikolog dan konselor bersertifikat secara aman, privat, dan terpercaya.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-rose-600" /> Konselor Berlisensi
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-rose-600" /> Sesi Privat & Rahasia
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <PhoneCall className="w-4 h-4 text-rose-600" /> Layanan Bantuan 24/7
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <a
                  href="/awaremind"
                  className="px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm text-center shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Daftar Konselor AwareMind</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={awaremindUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-sm text-center transition-all flex items-center justify-center gap-2"
                >
                  <span>Kunjungi Website Resmi</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: SEROTONIN 5 (RATA TENGAH / CENTERED ALIGNMENT)                 */}
      {/* ========================================================================= */}
      <section className="w-full bg-white text-slate-900 py-16 sm:py-24 border-b border-slate-200/80 relative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Rata Tengah */}
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" /> Serotonin 5
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Kenalan dengan Serotonin 5
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Struktur kepemimpinan dan Brand Ambassador yang berdedikasi membangun safe space kesehatan mental di MindSpace.
            </p>
          </div>

          {teamLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-10">
              {/* Mind Captain & Co-Captain: Exactly 1 Each - Rata Tengah */}
              {(mindCaptain || coCaptain) && (
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-600 block mb-1">
                      Kepemimpinan Tim
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      Mind Captain & Co-Captain
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {mindCaptain && renderMemberCard(mindCaptain, true)}
                    {coCaptain && renderMemberCard(coCaptain, true)}
                  </div>
                </div>
              )}

              {/* View Full Team Button - Rata Tengah */}
              <div className="text-center pt-2">
                <a
                  href="/team"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-200 transition-all hover:scale-[1.02]"
                >
                  <Users className="w-4 h-4" />
                  <span>Lihat Seluruh Anggota Serotonin 5</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: MENGAPA MINDSPACE (UNGU DEEP BACKGROUND)                       */}
      {/* ========================================================================= */}
      <section className="w-full bg-gradient-to-b from-[#3B0764] via-[#2E1065] to-[#1E1B4B] text-white py-16 sm:py-24 relative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-purple-200 border border-white/15 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Standar Keamanan & Etika
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Mengapa Memilih MindSpace?
            </h2>
            <p className="text-sm sm:text-base text-purple-200 leading-relaxed">
              Kami memprioritaskan keamanan identitas dan kerahasiaan batinmu di setiap baris kode yang dibangun.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-sm space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Enkripsi AES-256</h3>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                Setiap entri jurnal pribadi dienkripsi sebelum masuk database. Hanya kamu pemegang kunci yang dapat membacanya.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-sm space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Bebas Stigma</h3>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                Tidak ada kompetisi emosi atau tuntutan untuk selalu positif. Semua rasa diterima dengan setara dan dihargai.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-sm space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Streak & Konsistensi</h3>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                Bangun rutinitas journaling yang sehat melalui penghitung streak harian tanpa tekanan yang membebani.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-sm space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Jejaring Bantuan 24/7</h3>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                Terhubung langsung ke konselor profesional AwareMind dan hotline darurat nasional saat kamu berada di situasi kritis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: CTA (PUTIH / LIGHT BACKGROUND)                                */}
      {/* ========================================================================= */}
      <section className="w-full bg-white text-slate-900 py-16 sm:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-14 rounded-4xl bg-gradient-to-br from-purple-50 via-indigo-50/50 to-white border-2 border-purple-200 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-700 text-white mx-auto flex items-center justify-center shadow-md">
              <Heart className="w-7 h-7" />
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Mulai Perjalanan Pemulihan Batinmu Hari Ini
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Bergabunglah dengan ratusan teman seperjuangan di platform MindSpace. Gratis, terenkripsi, dan ramah untuk generasi muda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <a
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Buat Akun Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base border border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Akun</span>
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Gratis Selamanya
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tanpa Iklan yang Mengganggu
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Privasi Enkripsi AES-256
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
