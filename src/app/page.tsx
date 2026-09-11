"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Heart, 
  Wind, 
  BookOpen, 
  ArrowRight, 
  Star, 
  Calendar, 
  ShieldCheck, 
  Compass, 
  Smile, 
  Frown, 
  AlertCircle, 
  Flame, 
  Moon, 
  CloudRain, 
  HelpCircle,
  Lock,
  HeartHandshake,
  ShieldAlert,
  LogIn,
  UserPlus,
  Quote,
  CheckCircle2
} from "lucide-react";

// 7 Moods with Lucide icons (NO EMOJIS)
const MOODS = [
  { id: "SENANG", label: "Senang", icon: Smile, color: "text-amber-500", bg: "bg-amber-50 text-amber-800 border-amber-200" },
  { id: "SEDIH", label: "Sedih", icon: Frown, color: "text-blue-500", bg: "bg-blue-50 text-blue-800 border-blue-200" },
  { id: "CEMAS", label: "Cemas", icon: AlertCircle, color: "text-teal-500", bg: "bg-teal-50 text-teal-800 border-teal-200" },
  { id: "MARAH", label: "Marah", icon: Flame, color: "text-rose-500", bg: "bg-rose-50 text-rose-800 border-rose-200" },
  { id: "LELAH", label: "Lelah", icon: Moon, color: "text-purple-500", bg: "bg-purple-50 text-purple-800 border-purple-200" },
  { id: "TENANG", label: "Tenang", icon: CloudRain, color: "text-sky-500", bg: "bg-sky-50 text-sky-800 border-sky-200" },
  { id: "BINGUNG", label: "Bingung", icon: HelpCircle, color: "text-fuchsia-500", bg: "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200" },
];

const MOOD_FEEDBACK: Record<string, string> = {
  SENANG: "Kondisi hatimu penuh energi positif! Rayakan setiap hal kecil dan sebarkan kebaikan hari ini.",
  SEDIH: "Tidak apa-apa untuk merasa rapuh. Izinkan dirimu beristirahat, kamu tidak harus selalu terlihat kuat.",
  CEMAS: "Tarik napas perlahan. Hari ini belum tentu serumit yang kamu bayangkan, kamu aman saat ini.",
  MARAH: "Perasaanmu valid. Hembuskan nafas perlahan dan jangan biarkan kemarahan melukai kedamaian batinmu.",
  LELAH: "Tubuhmu butuh rehat sejenak. Beristirahat bukan berarti kalah, ini saatnya mengisi kembali energimu.",
  TENANG: "Kedamaian ini sungguh berharga. Jadikan ketenangan ini sebagai pondasi kuat untuk harimu.",
  BINGUNG: "Pikiran terasa kusut? Ambil satu jeda kecil dan fokus pada satu hal sederhana yang ada di depanmu.",
};

export default function HomePage() {
  const [qotd, setQotd] = useState<{ content: string; author: string } | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [starCount, setStarCount] = useState<number>(5);
  const [user, setUser] = useState<{ id: string; name?: string } | null>(null);

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
          author: "Tim Serotonin",
        });
      });
  }, []);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  return (
    <div className="w-full overflow-hidden">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO (PUTIH / LIGHT BACKGROUND - TEKS UNGU & ACCENTS)         */}
      {/* ========================================================================= */}
      <section className="bg-white text-slate-900 pt-8 sm:pt-14 pb-14 sm:pb-20 border-b border-slate-200/80 relative">
        {/* Subtle decorative background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sero-purple-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sero-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sero-purple-50 border border-sero-purple-200/80 shadow-xs">
                <Sparkles className="w-4 h-4 text-sero-purple-600" />
                <span className="text-xs sm:text-sm font-bold text-sero-purple-800">
                  Safe Space Kesehatan Mental Generasi Muda
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Bertumbuh, Bernapas, dan{" "}
                <span className="bg-gradient-to-r from-sero-purple-700 via-indigo-600 to-sero-blue-600 bg-clip-text text-transparent">
                  Pulih Bersama DailyOfSero
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
                Temukan ruang aman untuk merangkul setiap emosimu. Tulis jurnal pribadi dengan enkripsi <strong>AES-256</strong>, eksplorasi karya inspiratif dari Brand Ambassador, dan dapatkan pendampingan resmi dari <strong>AwareMind</strong>.
              </p>

              {/* Trust highlights */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enkripsi AES-256</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-sero-purple-600" />
                  <span>Zero Judgement Space</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  <span>Didukung AwareMind</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                {user ? (
                  <a
                    href="/healing"
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-sero-purple-600 to-indigo-600 hover:from-sero-purple-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-sero-purple-300/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Masuk ke Healing Corner</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <a
                    href="/register"
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-sero-purple-600 to-indigo-600 hover:from-sero-purple-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-sero-purple-300/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Mulai Perjalanan Pulih (Gratis)</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}

                <a
                  href="/karya"
                  className="px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 hover:border-sero-purple-400 transition-all flex items-center justify-center gap-2.5 shadow-xs"
                >
                  <BookOpen className="w-5 h-5 text-sero-purple-600" />
                  <span>Jelajahi Galeri Karya</span>
                </a>
              </div>
            </div>

            {/* Right Interactive Card / Daily Quote */}
            <div className="lg:col-span-5">
              <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-sero-purple-50/90 via-white to-slate-50 border-2 border-sero-purple-200/90 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 text-xs font-bold text-sero-purple-700 uppercase tracking-wider border-b border-sero-purple-100 pb-3">
                  <span className="flex items-center gap-2">
                    <Quote className="w-4 h-4 text-sero-purple-600" /> Quote of the Day
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">Pembaruan Tiap 00:00 WIB</span>
                </div>

                <div className="space-y-4 my-2">
                  <p className="text-lg sm:text-xl font-medium text-slate-800 italic leading-relaxed">
                    "{qotd ? qotd.content : "Sedang memuat inspirasi hari ini..."}"
                  </p>
                  <p className="text-right text-xs sm:text-sm font-bold text-sero-purple-700">
                    — {qotd?.author || "Tim Serotonin"}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sero-purple-600" /> Sentuhan ketenangan harian
                  </span>
                  <a
                    href="/karya"
                    className="font-bold text-sero-purple-700 hover:underline flex items-center gap-1"
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
      {/* SECTION 2: TIGA PILAR (UNGU DEEP BACKGROUND - TEKS PUTIH)                 */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-[#4C1D95] via-[#581C87] to-[#3B0764] text-white py-16 sm:py-20 relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-purple-200 border border-white/15 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" /> Ekosistem Kebaikan
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Tiga Ruang Utama untuk Jiwa & Pikiranmu
            </h2>
            <p className="text-sm sm:text-base text-purple-200 leading-relaxed">
              DailyOfSero menyediakan wadah komprehensif mulai dari eksplorasi karya edukatif, refleksi jurnal mandiri yang terenkripsi, hingga rujukan bantuan profesional.
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
                  Kumpulan tulisan inspiratif, ilustrasi komik, dan tips kesehatan mental dari Brand Ambassador Tim Serotonin yang terhubung langsung ke media sosial resmi.
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
                    Area Member
                  </span>
                </div>
                <p className="text-sm text-purple-100 leading-relaxed">
                  Ruang privat untuk journaling dengan enkripsi AES-256, latihan pernapasan kotak 4-4-4, serta pencatatan mood harian. Privasi dijamin aman, hanya dapat diakses setelah masuk akun.
                </p>
              </div>
              <div className="pt-6 relative z-10">
                <a
                  href={user ? "/healing" : "/login?redirect=/healing"}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#581C87] bg-white hover:bg-purple-50 px-5 py-2.5 rounded-full transition-all shadow-md"
                >
                  <span>{user ? "Akses Healing Corner" : "Masuk untuk Akses Jurnal"}</span>
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
      {/* SECTION 3: CHECK-IN MOOD (PUTIH / LIGHT BACKGROUND - TEKS UNGU)           */}
      {/* ========================================================================= */}
      <section className="bg-slate-50 text-slate-900 py-16 sm:py-20 border-y border-slate-200/80 relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-4xl bg-white border border-slate-200 shadow-xl text-center relative overflow-hidden">
            <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-sero-purple-100 text-sero-purple-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                Check-in Emosi Harian
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Bagaimana Kondisi Hatimu Detik Ini?
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Pilih suasana emosimu saat ini untuk memperoleh pesan penguatan instan. Data sesi ini bersifat sesaat demi memberikan kenyamanan batinmu.
              </p>

              {/* 7 Moods Grid with Lucide icons (NO EMOJIS) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4">
                {MOODS.map((m) => {
                  const Icon = m.icon;
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleMoodSelect(m.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                          : "bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Icon className={`w-7 h-7 mb-2 ${isSelected ? "text-white" : m.color}`} />
                      <span className="text-xs font-bold">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mood Feedback & Star Rating */}
              {selectedMood && (
                <div className="pt-6 animate-in fade-in zoom-in-95 duration-200 space-y-4 max-w-2xl mx-auto">
                  <div className="flex justify-center items-center gap-2">
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

                  <div className="p-5 rounded-2xl bg-sero-purple-50 border border-sero-purple-200 text-sero-purple-900 text-sm font-medium leading-relaxed">
                    {MOOD_FEEDBACK[selectedMood]}
                  </div>

                  <div className="pt-2">
                    <a
                      href={user ? "/healing" : "/login?redirect=/healing"}
                      className="inline-flex items-center gap-2 text-xs font-bold text-sero-purple-700 hover:text-sero-purple-900 hover:underline"
                    >
                      <span>Simpan perasaan ini ke Jurnal Terenkripsi di Healing Corner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: MENGAPA DAILYOFSERO (UNGU DEEP BACKGROUND - TEKS PUTIH)         */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-[#3B0764] via-[#2E1065] to-[#1E1B4B] text-white py-16 sm:py-20 relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-purple-200 border border-white/15 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Standar Keamanan & Etika
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Mengapa Memilih DailyOfSero?
            </h2>
            <p className="text-sm sm:text-base text-purple-200 leading-relaxed">
              Kami memprioritaskan keamanan identitas dan kerahasiaan batinmu di setiap baris kode yang dibangun.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Enkripsi AES-256</h3>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                Setiap entri jurnal pribadi dienkripsi sebelum masuk database. Hanya kamu pemegang kunci yang dapat membacanya.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Bebas Stigma</h3>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                Tidak ada kompetisi emosi atau tuntutan untuk selalu positif. Semua rasa diterima dengan setara dan dihargai.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Streak & Konsistensi</h3>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                Bangun rutinitas journaling yang sehat melalui penghitung streak harian tanpa tekanan yang membebani.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-sm space-y-3">
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
      {/* SECTION 5: CTA (PUTIH / LIGHT BACKGROUND - TEKS UNGU)                     */}
      {/* ========================================================================= */}
      <section className="bg-white text-slate-900 py-16 sm:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-14 rounded-4xl bg-gradient-to-br from-sero-purple-50 via-indigo-50/50 to-white border-2 border-sero-purple-200 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sero-purple-600 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-md">
              <Heart className="w-7 h-7" />
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Mulai Perjalanan Pemulihan Batinmu Hari Ini
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Bergabunglah dengan ratusan teman seperjuangan di platform DailyOfSero. Gratis, terenkripsi, dan ramah untuk generasi muda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <a
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-sero-purple-600 to-indigo-600 hover:from-sero-purple-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-sero-purple-300/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
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
