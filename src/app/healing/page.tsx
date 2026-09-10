"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Wind, Star, Flame, Lock, Trash2, Bookmark, BookmarkCheck, ArrowRight, Play, Pause, RotateCcw, AlertCircle, CheckCircle2, ChevronRight, PenLine, Smile, Frown, Moon, CloudRain, HelpCircle } from "lucide-react";

const MOODS = [
  { id: "SENANG", label: "Senang", emoji: "😊" },
  { id: "SEDIH", label: "Sedih", emoji: "🥺" },
  { id: "CEMAS", label: "Cemas", emoji: "😰" },
  { id: "MARAH", label: "Marah", emoji: "😤" },
  { id: "LELAH", label: "Lelah", emoji: "🥱" },
  { id: "TENANG", label: "Tenang", emoji: "😌" },
  { id: "BINGUNG", label: "Bingung", emoji: "😵‍💫" },
];

const MOOD_MESSAGES: Record<string, string> = {
  SENANG: "Nikmati setiap detik kebahagiaan ini, rayakan pencapaian kecilmu hari ini! Kamu sangat layak berbahagia. ✨",
  SEDIH: "Gak apa-apa untuk gak baik-baik saja hari ini. Izinkan hatimu beristirahat, esok adalah lembaran baru. 💙",
  CEMAS: "Kekhawatiran hari ini belum tentu terjadi esok hari. Tarik nafas perlahan, saat ini kamu aman. 🌿",
  MARAH: "Rasa marahmu valid, tapi jangan biarkan ia merusak kedamaianmu. Hembuskan amarah itu perlahan bagai angin lalu. 🌊",
  LELAH: "Tubuh dan jiwamu sudah berjuang sangat hebat hari ini. Istirahatlah sejenak, kamu gak harus menyelesaikan segalanya sekarang. 🌙",
  TENANG: "Simpan rasa damai ini di lubuk hatimu. Biarkan ketenangan ini menjadi jangkar pelindungmu setiap hari. ☁️",
  BINGUNG: "Semuanya terasa overload ya? Gak perlu buru-buru mencari semua jawaban. Fokus saja pada satu langkah terkecil berikutnya. 🧩",
};

interface JournalEntry {
  id: string;
  content: string;
  createdAt: string;
}

interface GuidedPrompt {
  id: string;
  content: string;
  tag: string;
}

interface CalmingSentence {
  id: string;
  content: string;
  tag: string;
  isBookmarked: boolean;
  author: string;
}

export default function HealingPage() {
  const [activeTab, setActiveTab] = useState<"JOURNAL" | "BREATHING" | "BOOKMARKS">("JOURNAL");
  const [user, setUser] = useState<{ id: string; type: string } | null>(null);

  // Mood-Star state (ephemeral, not saved to DB)
  const [selectedMood, setSelectedMood] = useState<string>("TENANG");
  const [starRating, setStarRating] = useState<number>(5);

  // Journal state
  const [journalContent, setJournalContent] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [submittingJournal, setSubmittingJournal] = useState(false);
  const [journalAlert, setJournalAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Guided Prompts
  const [prompts, setPrompts] = useState<GuidedPrompt[]>([]);

  // Calming Sentences & Bookmarks
  const [calmingSentences, setCalmingSentences] = useState<CalmingSentence[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // Breathing timer state (Inhale 4s -> Hold 4s -> Exhale 4s)
  const [breathingPhase, setBreathingPhase] = useState<"Tarik Napas" | "Tahan" | "Hembuskan">("Tarik Napas");
  const [breathingCountdown, setBreathingCountdown] = useState(4);
  const [breathingActive, setBreathingActive] = useState(false);

  useEffect(() => {
    // 1. Fetch user session
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.type === "USER") {
          setUser(data.user);
          loadJournalEntries();
          loadBookmarks();
        }
      })
      .catch(() => {});

    // 2. Fetch Guided Prompts
    fetch("/api/content-bank?type=GUIDED_PROMPT")
      .then((res) => res.json())
      .then((data) => {
        if (data?.items) setPrompts(data.items);
      })
      .catch(() => {});

    // 3. Fetch Calming Sentences
    fetch("/api/content-bank?type=CALMING_SENTENCE")
      .then((res) => res.json())
      .then((data) => {
        if (data?.items) setCalmingSentences(data.items);
      })
      .catch(() => {});
  }, []);

  const loadJournalEntries = async () => {
    try {
      const res = await fetch("/api/journal");
      const data = await res.json();
      if (data?.entries) setEntries(data.entries);
      if (data?.streak) setStreak(data.streak);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBookmarks = async () => {
    try {
      const res = await fetch("/api/content-bank/bookmark");
      const data = await res.json();
      if (data?.bookmarks) setBookmarks(data.bookmarks);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim()) return;

    setSubmittingJournal(true);
    setJournalAlert(null);

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: journalContent }),
      });

      const data = await res.json();

      if (!res.ok) {
        setJournalAlert({ type: "error", text: data.error || "Gagal menyimpan jurnal." });
        setSubmittingJournal(false);
        return;
      }

      setJournalContent("");
      setJournalAlert({
        type: "success",
        text: "Jurnalmu berhasil tersimpan dan terenkripsi aman! 🔒 Streak journaling bertambah ✨",
      });
      loadJournalEntries();
    } catch (err) {
      setJournalAlert({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setSubmittingJournal(false);
    }
  };

  const handleDeleteJournal = async (id: string) => {
    if (!confirm("Apakah kamu yakin ingin menghapus catatan jurnal ini?")) return;

    try {
      const res = await fetch(`/api/journal/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = async (contentBankId: string) => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk menyimpan bookmark ya!");
      return;
    }

    try {
      const res = await fetch("/api/content-bank/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentBankId }),
      });
      const data = await res.json();
      if (res.ok) {
        loadBookmarks();
        // Update local calming list state
        setCalmingSentences((prev) =>
          prev.map((c) => (c.id === contentBankId ? { ...c, isBookmarked: data.bookmarked } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Breathing Box Timer logic (4s - 4s - 4s)
  useEffect(() => {
    if (!breathingActive) return;

    const interval = setInterval(() => {
      setBreathingCountdown((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phase
        if (breathingPhase === "Tarik Napas") {
          setBreathingPhase("Tahan");
          return 4;
        } else if (breathingPhase === "Tahan") {
          setBreathingPhase("Hembuskan");
          return 4;
        } else {
          setBreathingPhase("Tarik Napas");
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingActive, breathingPhase]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sero-purple-100 text-sero-purple-700 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-sero-purple-700" /> Safe Space & Self-Care
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Healing Corner
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Ruang hening untuk mengekspresikan perasaan tanpa dihakimi, mengatur ritme nafas, dan mencatat perjalanan pertumbuhan dirimu.
        </p>
      </div>

      {/* Mood-Star Check-in Card (PRD 3.6 - Ephemeral, instant soothing) */}
      <div className="p-6 sm:p-8 rounded-4xl bg-gradient-to-br from-white to-sero-blue-50/50 border border-sero-blue-200/60 shadow-md mb-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-sero-blue-600 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> Mood-Star Saat Ini
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Bagaimana kondisi hatimu di sesi ini?
            </h3>
          </div>

          {/* Star selector */}
          <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setStarRating(s)}
                className="p-1 hover:scale-125 transition-transform text-amber-400"
              >
                <Star
                  className={`w-5 h-5 ${s <= starRating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 7 Mood buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMood(m.id)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                selectedMood === m.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm scale-105"
                  : "bg-white/80 hover:bg-white text-slate-700 border-slate-200"
              }`}
            >
              <span className="text-xl block mb-1">{m.emoji}</span>
              <span className="text-xs font-semibold">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Soothing Sentence */}
        <div className="mt-4 p-4 rounded-2xl bg-white/90 border border-sero-blue-100 text-slate-800 text-sm leading-relaxed flex items-start gap-3 shadow-sm">
          <Sparkles className="w-5 h-5 text-sero-purple-500 flex-shrink-0 mt-0.5" />
          <p className="font-medium italic">{MOOD_MESSAGES[selectedMood]}</p>
        </div>
      </div>

      {/* Tabs Switcher: Journal, Breathing, Bookmarks */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab("JOURNAL")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
            activeTab === "JOURNAL"
              ? "bg-slate-900 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <PenLine className="w-4 h-4" />
          <span>Self-Journal & Streak</span>
        </button>

        <button
          onClick={() => setActiveTab("BREATHING")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
            activeTab === "BREATHING"
              ? "bg-slate-900 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Latihan Pernapasan</span>
        </button>

        <button
          onClick={() => setActiveTab("BOOKMARKS")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
            activeTab === "BOOKMARKS"
              ? "bg-slate-900 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Kalimat Favorit</span>
        </button>
      </div>

      {/* TAB 1: SELF-JOURNAL & STREAK */}
      {activeTab === "JOURNAL" && (
        <div className="space-y-8 animate-in fade-in">
          {/* User Streak Bar (PRD 3.6) */}
          {user && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-white flex items-center justify-center font-black shadow-md shadow-amber-200">
                  <Flame className="w-7 h-7 fill-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    {streak.currentStreak} Hari Streak Journaling! 🔥
                  </h3>
                  <p className="text-xs text-slate-600">
                    Rekor terpanjang kamu: <strong>{streak.longestStreak} hari</strong> berturut-turut.
                  </p>
                </div>
              </div>
              <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 text-amber-800 border border-amber-200 shadow-sm">
                Tulis minimal 1x sehari untuk jaga streak 🌱
              </div>
            </div>
          )}

          {/* Guided Prompt Suggester */}
          {prompts.length > 0 && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-sero-purple-600 uppercase tracking-wider block mb-2">
                💡 Butuh Ide Tulisan? Coba Guided Prompt Ini:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {prompts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setJournalContent(p.content + "\n\n")}
                    className="whitespace-nowrap px-4 py-2 rounded-2xl bg-slate-50 hover:bg-sero-purple-50 text-slate-700 hover:text-sero-purple-700 border border-slate-200 text-xs font-medium transition-colors flex-shrink-0"
                  >
                    "{p.content.slice(0, 45)}..." <span className="font-bold text-sero-purple-600">Gunakan →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Journal Editor */}
          {user ? (
            <div className="p-6 sm:p-8 rounded-4xl bg-white border border-slate-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Enkripsi Berlapis (AES-256) Aktif
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}
                </span>
              </div>

              {journalAlert && (
                <div
                  className={`mb-4 p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-2.5 ${
                    journalAlert.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  {journalAlert.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span>{journalAlert.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveJournal}>
                <textarea
                  rows={6}
                  required
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder="Keluarkan semua yang ada di kepalamu... Tidak ada penilaian di sini, hanya ada dirimu dan ruang amanmu."
                  className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sero-purple-400 text-sm leading-relaxed transition-all"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                  <span className="text-xs text-slate-400">
                    Hanya kamu yang bisa membaca kembali tulisan ini.
                  </span>
                  <button
                    type="submit"
                    disabled={submittingJournal || !journalContent.trim()}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-sero-purple-500 to-sero-purple-600 hover:from-sero-purple-600 hover:to-sero-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submittingJournal ? (
                      <span>Mengenkripsi & Menyimpan...</span>
                    ) : (
                      <>
                        <span>Simpan Jurnal ✨</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-8 sm:p-12 rounded-4xl bg-white/80 border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-sero-purple-100 text-sero-purple-600 mx-auto flex items-center justify-center">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Masuk untuk Mulai Menulis Jurnal Pribadimu
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Jurnal kamu dienkripsi secara ketat di server dan hanya bisa diakses oleh akun kamu. Daftarkan akunmu secara gratis sekarang.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href="/login"
                  className="px-6 py-2.5 rounded-full border border-slate-300 font-bold text-xs sm:text-sm hover:bg-slate-100"
                >
                  Masuk
                </a>
                <a
                  href="/register"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-sero-blue-400 to-sero-purple-500 text-white font-bold text-xs sm:text-sm shadow-md"
                >
                  Daftar Akun ✨
                </a>
              </div>
            </div>
          )}

          {/* Past Journal Entries List */}
          {user && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Riwayat Jurnalmu ({entries.length})
              </h3>

              {entries.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-400">
                  Belum ada entri jurnal. Mulai tulis ceritamu di atas ya! 🌱
                </div>
              ) : (
                <div className="space-y-3">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-sero-blue-200 shadow-sm transition-all flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-grow">
                        <span className="text-[11px] font-bold text-sero-purple-600">
                          {new Date(entry.createdAt).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {entry.content}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteJournal(entry.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors flex-shrink-0"
                        title="Hapus entri jurnal ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BREATHING EXERCISE (PRD 3.6) */}
      {activeTab === "BREATHING" && (
        <div className="p-8 sm:p-14 rounded-4xl bg-white border border-slate-200 shadow-lg text-center animate-in fade-in space-y-8 max-w-xl mx-auto">
          <div className="space-y-2">
            <span className="text-xs font-bold text-sero-blue-600 uppercase tracking-wider">
              Latihan Pernapasan Kotak (Box Breathing 4-4-4)
            </span>
            <h2 className="text-2xl font-bold text-slate-900">Napas Dulu Yuk... 🌿</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Membantu merilekskan sistem saraf, meredakan cemas, dan mengembalikan fokusmu.
            </p>
          </div>

          {/* Animated Circle */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr from-sero-blue-200 via-sero-purple-200 to-indigo-100 transition-all duration-1000 ${
                breathingActive
                  ? breathingPhase === "Tarik Napas"
                    ? "scale-110 opacity-100"
                    : breathingPhase === "Tahan"
                    ? "scale-110 opacity-90"
                    : "scale-75 opacity-60"
                  : "scale-90 opacity-50"
              }`}
            />
            <div className="relative z-10 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                {breathingActive ? breathingPhase : "Siap?"}
              </span>
              <span className="text-4xl sm:text-5xl font-black text-slate-900">
                {breathingActive ? breathingCountdown : "4"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setBreathingActive(!breathingActive)}
              className="px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              {breathingActive ? (
                <>
                  <Pause className="w-4 h-4" /> Jeda
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Mulai Napas
                </>
              )}
            </button>
            <button
              onClick={() => {
                setBreathingActive(false);
                setBreathingPhase("Tarik Napas");
                setBreathingCountdown(4);
              }}
              className="p-3.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKMARKS & CALMING SENTENCES (PRD 3.6) */}
      {activeTab === "BOOKMARKS" && (
        <div className="space-y-8 animate-in fade-in">
          {/* User Saved Bookmarks */}
          {user && (
            <div className="p-6 sm:p-8 rounded-4xl bg-white border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-sero-purple-600" />
                Kalimat Tersimpan Kamu ({bookmarks.length})
              </h2>

              {bookmarks.length === 0 ? (
                <p className="text-xs sm:text-sm text-slate-400">
                  Belum ada kalimat yang kamu bookmark. Klik ikon bookmark pada kalimat di bawah untuk menyimpannya ke sini!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bookmarks.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-sero-purple-50/60 border border-sero-purple-100 flex flex-col justify-between"
                    >
                      <p className="text-xs sm:text-sm text-slate-800 font-medium italic mb-3">
                        "{b.content}"
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>— {b.author}</span>
                        <button
                          onClick={() => handleToggleBookmark(b.contentBankId)}
                          className="text-rose-500 hover:underline font-bold"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All Calming Sentences from Content Bank */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Jelajahi Kalimat Penenang dari Komunitas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {calmingSentences.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-sero-blue-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.tag}
                      </span>
                      <button
                        onClick={() => handleToggleBookmark(item.id)}
                        className={`p-1.5 rounded-full transition-colors ${
                          item.isBookmarked
                            ? "text-sero-purple-600 bg-sero-purple-50"
                            : "text-slate-400 hover:text-sero-purple-600"
                        }`}
                        title={item.isBookmarked ? "Hapus dari bookmark" : "Simpan ke bookmark"}
                      >
                        {item.isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 fill-sero-purple-600" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-slate-800 font-medium italic leading-relaxed">
                      "{item.content}"
                    </p>
                  </div>
                  <p className="text-right text-[11px] text-slate-400 mt-3">
                    — {item.author || "Tim Serotonin"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
