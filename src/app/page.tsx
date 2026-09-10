"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Wind, BookOpen, ArrowRight, Star, Calendar, ShieldCheck, Compass, Smile, Frown, AlertCircle, Flame, Moon, CloudRain, HelpCircle } from "lucide-react";

const MOODS = [
  { id: "SENANG", label: "Senang", emoji: "😊", icon: Smile, color: "from-amber-400 to-orange-400", bg: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "SEDIH", label: "Sedih", emoji: "🥺", icon: Frown, color: "from-blue-400 to-indigo-400", bg: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "CEMAS", label: "Cemas", emoji: "😰", icon: AlertCircle, color: "from-teal-400 to-emerald-400", bg: "bg-teal-50 text-teal-700 border-teal-200" },
  { id: "MARAH", label: "Marah", emoji: "😤", icon: Flame, color: "from-rose-400 to-red-400", bg: "bg-rose-50 text-rose-700 border-rose-200" },
  { id: "LELAH", label: "Lelah", emoji: "🥱", icon: Moon, color: "from-violet-400 to-purple-400", bg: "bg-violet-50 text-violet-700 border-violet-200" },
  { id: "TENANG", label: "Tenang", emoji: "😌", icon: CloudRain, color: "from-sky-400 to-cyan-400", bg: "bg-sky-50 text-sky-700 border-sky-200" },
  { id: "BINGUNG", label: "Bingung", emoji: "😵‍💫", icon: HelpCircle, color: "from-fuchsia-400 to-pink-400", bg: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" },
];

export default function HomePage() {
  const [qotd, setQotd] = useState<{ content: string; author: string } | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodFeedback, setMoodFeedback] = useState<string | null>(null);
  const [starCount, setStarCount] = useState<number>(5);

  useEffect(() => {
    fetch("/api/content-bank?qotd=true")
      .then((res) => res.json())
      .then((data) => {
        if (data?.quote) setQotd(data.quote);
      })
      .catch(() => {
        setQotd({
          content: "Setiap langkah kecil adalah kemenangan. Tetaplah ramah pada dirimu hari ini. ✨",
          author: "Tim Serotonin",
        });
      });
  }, []);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    const feedbackMap: Record<string, string> = {
      SENANG: "Keren banget! Simpan senyuman ini dan sebarkan kebahagiaanmu hari ini ya! 🌟",
      SEDIH: "Gak apa-apa, kamu gak harus selalu kuat. Izinkan hatimu istirahat sejenak ya. 💙",
      CEMAS: "Tarik nafas dalam-dalam. Satu detik saat ini, kamu aman dan terkendali. 🌿",
      MARAH: "Perasaanmu valid. Hembuskan nafas perlahan, jangan biarkan amarah melukai batinmu. 🌊",
      LELAH: "Tubuhmu butuh jeda. Istirahat bukan berarti menyerah, ini saatnya recharge. 🌙",
      TENANG: "Senangnya merasakan damai ini. Jadikan ini pondasi positif untuk harimu. ☁️",
      BINGUNG: "Pikiran terasa kusut? Coba tulis satu hal kecil di jurnal untuk mengurainya. 🧩",
    };
    setMoodFeedback(feedbackMap[moodId] || "Terima kasih sudah jujur dengan perasaanmu hari ini!");
  };

  return (
    <div className="relative overflow-hidden pb-16">
      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-sero-purple-200/80 shadow-sm backdrop-blur-md animate-bounce-subtle">
            <Sparkles className="w-4 h-4 text-sero-purple-500" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              Safe Space Kesehatan Mental Generasi Z
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
            Bertumbuh, Bernapas, dan{" "}
            <span className="bg-gradient-to-r from-sero-blue-500 via-sero-purple-500 to-sero-purple-600 bg-clip-text text-transparent">
              Pulih Bersama Sero
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Temukan safe space untuk merangkul setiap emosimu. Tulis jurnal pribadi dengan enkripsi aman, jelajahi galeri karya penuh inspirasi dari Brand Ambassador, dan temukan ketenangan setiap hari.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <a
              href="/healing"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-sero-blue-400 via-sero-blue-500 to-sero-purple-500 hover:from-sero-blue-500 hover:to-sero-purple-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-sero-blue-300/40 hover:shadow-sero-purple-400/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Mulai Healing Corner</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/karya"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/90 hover:bg-white text-slate-700 font-bold text-sm sm:text-base border border-slate-200 shadow-sm hover:border-sero-purple-300 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5 text-sero-purple-500" />
              <span>Jelajahi Galeri Karya</span>
            </a>
          </div>
        </div>

        {/* Quote of the Day Banner (PRD 3.6) */}
        <div className="mt-14 max-w-2xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/90 to-sero-purple-50/70 border border-sero-purple-100/80 shadow-md backdrop-blur-xl relative">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-sero-purple-600 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Quote of the Day
              </span>
              <span className="text-[11px] font-medium text-slate-400">Reset 00:00 WIB</span>
            </div>
            <p className="text-base sm:text-xl font-medium text-slate-800 italic leading-relaxed">
              "{qotd ? qotd.content : "Sedang memuat inspirasi hari ini..."}"
            </p>
            <p className="text-right text-xs sm:text-sm font-semibold text-sero-purple-500 mt-3">
              — {qotd?.author || "Tim Serotonin"}
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Mood-Star Teaser (PRD 3.6) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-4xl bg-white/85 border border-slate-200/80 shadow-xl backdrop-blur-md text-center relative overflow-hidden">
          <div className="blob-shape bg-sero-blue-200/50 w-72 h-72 -top-20 -left-20" />
          <div className="blob-shape bg-sero-purple-200/50 w-72 h-72 -bottom-20 -right-20" />

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-sero-blue-100 text-sero-blue-700">
              Check-in Cepat (Mood-Star ⭐)
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Gimana perasaanmu saat ini?
            </h2>
            <p className="text-sm text-slate-600">
              Pilih mood kamu sesi ini. Data ini bersifat sesaat, tidak disimpan ke database, murni untuk ruang jujurmu detik ini.
            </p>

            {/* 7 Moods Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-4">
              {MOODS.map((m) => {
                const isSelected = selectedMood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleMoodSelect(m.id)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                        : "bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-2xl mb-1">{m.emoji}</span>
                    <span className="text-xs font-semibold">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mood-Star Rating Indicator */}
            {selectedMood && (
              <div className="pt-4 animate-in fade-in zoom-in-95 duration-200 space-y-3">
                <div className="flex justify-center items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setStarCount(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= starCount ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-sero-purple-50 border border-sero-purple-200 text-sero-purple-800 text-sm font-medium">
                  {moodFeedback}
                </div>
                <div className="pt-2">
                  <a
                    href="/healing"
                    className="inline-flex items-center gap-2 text-xs font-bold text-sero-blue-600 hover:text-sero-blue-700 hover:underline"
                  >
                    Lanjut tulis jurnal dengan panduan prompt ini →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3 Pillars Showcase */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tiga Ruang Kebaikan untuk Mentalmu
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Semua yang kamu butuhkan untuk bernafas lebih lega hari ini
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Galeri Karya */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-sero-blue-300 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sero-blue-100 text-sero-blue-600 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-sero-blue-600 transition-colors">
                Galeri Karya BA
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kumpulan insight, komik, dan tips kesehatan mental dari Brand Ambassador Tim Serotonin yang terhubung langsung ke postingan Instagram resmi.
              </p>
            </div>
            <div className="pt-6">
              <a
                href="/karya"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sero-blue-600 hover:gap-2.5 transition-all"
              >
                Lihat Galeri <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card 2: Self-Journal & Healing */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-sero-purple-300 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sero-purple-100 text-sero-purple-600 flex items-center justify-center font-bold">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-sero-purple-600 transition-colors">
                Healing & Jurnal Aman
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tulis isi hatimu tanpa rasa takut. Seluruh tulisan jurnal dienkripsi (AES-256) dan bahkan superadmin tidak dapat membacanya. Pantau streak harianmu!
              </p>
            </div>
            <div className="pt-6">
              <a
                href="/healing"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sero-purple-600 hover:gap-2.5 transition-all"
              >
                Mulai Journaling <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card 3: AwareMind */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                Layanan AwareMind
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Showcase konselor profesional dan akses langsung ke layanan konseling resmi AwareMind serta tombol bantuan darurat 24/7.
              </p>
            </div>
            <div className="pt-6">
              <a
                href="/awaremind"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:gap-2.5 transition-all"
              >
                Lihat Konselor <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
