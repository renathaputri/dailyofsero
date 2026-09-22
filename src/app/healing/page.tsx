"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Heart, 
  Wind, 
  Flame, 
  Lock, 
  Trash2, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  PenLine, 
  Smile, 
  Frown, 
  Moon, 
  CloudRain, 
  HelpCircle,
  Shield,
  ShieldCheck,
  Compass,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  Calendar,
  LogIn,
  UserPlus
} from "lucide-react";
import { toast, confirmModal } from "@/components/Toast";

// 7 Moods with Lucide icons (NO EMOJIS)
const MOODS = [
  { id: "SENANG", label: "Senang", icon: Smile, color: "text-amber-500 bg-amber-50 border-amber-200" },
  { id: "SEDIH", label: "Sedih", icon: Frown, color: "text-blue-500 bg-blue-50 border-blue-200" },
  { id: "CEMAS", label: "Cemas", icon: AlertCircle, color: "text-teal-500 bg-teal-50 border-teal-200" },
  { id: "MARAH", label: "Marah", icon: Flame, color: "text-rose-500 bg-rose-50 border-rose-200" },
  { id: "LELAH", label: "Lelah", icon: Moon, color: "text-purple-500 bg-purple-50 border-purple-200" },
  { id: "TENANG", label: "Tenang", icon: CloudRain, color: "text-sky-500 bg-sky-50 border-sky-200" },
  { id: "BINGUNG", label: "Bingung", icon: HelpCircle, color: "text-fuchsia-500 bg-fuchsia-50 border-fuchsia-200" },
];

const MOOD_MESSAGES: Record<string, string> = {
  SENANG: "Nikmati setiap detik kebahagiaan ini dan rayakan pencapaian kecilmu hari ini. Kamu layak berbahagia.",
  SEDIH: "Tidak apa-apa untuk merasa tidak baik-baik saja hari ini. Izinkan hatimu beristirahat, esok adalah lembaran baru.",
  CEMAS: "Kekhawatiran hari ini belum tentu terjadi esok hari. Tarik nafas perlahan, saat ini kamu berada di tempat yang aman.",
  MARAH: "Rasa marahmu valid, namun jangan biarkan kemarahan mengikis kedamaian batinmu. Hembuskan amarah perlahan.",
  LELAH: "Tubuh dan jiwamu sudah berjuang sangat hebat. Istirahatlah sejenak, kamu tidak harus menyelesaikan segalanya hari ini.",
  TENANG: "Simpan rasa damai ini di lubuk hatimu. Biarkan ketenangan ini menjadi pelindung batinmu sepanjang hari.",
  BINGUNG: "Pikiran terasa penuh? Tidak perlu mencari seluruh jawaban sekaligus. Ambil satu langkah kecil berikutnya.",
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

type TabType = "OVERVIEW" | "JOURNAL" | "MOOD" | "BREATHING" | "BOOKMARKS" | "PROMPTS";

export default function HealingPage() {
  const [activeTab, setActiveTab] = useState<TabType>("OVERVIEW");
  const [user, setUser] = useState<{ id: string; name?: string; username?: string; email?: string; type?: "USER" | "ADMIN" } | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Mood state
  const [selectedMood, setSelectedMood] = useState<string>("TENANG");

  // Journal state
  const [journalContent, setJournalContent] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [submittingJournal, setSubmittingJournal] = useState(false);
  const [journalAlert, setJournalAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Prompts & Calming
  const [prompts, setPrompts] = useState<GuidedPrompt[]>([]);
  const [calmingSentences, setCalmingSentences] = useState<CalmingSentence[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // Breathing Box Timer (4s - 4s - 4s)
  const [breathingPhase, setBreathingPhase] = useState<"Tarik Napas" | "Tahan" | "Hembuskan">("Tarik Napas");
  const [breathingCountdown, setBreathingCountdown] = useState(4);
  const [breathingActive, setBreathingActive] = useState(false);

  useEffect(() => {
    // 1. Fetch user session (non-blocking)
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoadingAuth(false));

    // 2. Load Journal Entries & Bookmarks unconditionally for everyone (guest, user, admin)
    loadJournalEntries();
    loadBookmarks();

    // 3. Fetch Guided Prompts
    fetch("/api/content-bank?type=GUIDED_PROMPT")
      .then((res) => res.json())
      .then((data) => {
        if (data?.items) setPrompts(data.items);
      })
      .catch(() => {});

    // 4. Fetch Calming Sentences
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
        text: "Jurnalmu berhasil tersimpan dan terenkripsi aman dengan AES-256. Streak journaling bertambah!",
      });
      loadJournalEntries();
    } catch (err) {
      setJournalAlert({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setSubmittingJournal(false);
    }
  };

  const handleDeleteJournal = async (id: string) => {
    const confirmed = await confirmModal({
      title: "Hapus Catatan Jurnal?",
      message: "Catatan jurnal terenkripsi ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.",
      confirmText: "Hapus Jurnal",
      cancelText: "Batal",
      isDanger: true,
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/journal/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
        toast.success("Catatan jurnal berhasil dihapus.");
      } else {
        toast.error("Gagal menghapus catatan jurnal.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan jaringan.");
    }
  };

  const handleToggleBookmark = async (contentBankId: string) => {
    try {
      const res = await fetch("/api/content-bank/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentBankId }),
      });
      const data = await res.json();
      if (res.ok) {
        loadBookmarks();
        setCalmingSentences((prev) =>
          prev.map((c) => (c.id === contentBankId ? { ...c, isBookmarked: data.bookmarked } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Breathing Box Timer logic
  useEffect(() => {
    if (!breathingActive) return;

    const interval = setInterval(() => {
      setBreathingCountdown((prev) => {
        if (prev > 1) return prev - 1;

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

  // All visitors (guest, user, admin) have full access to Safe Space
  return (
    <div className="w-full max-w-[1500px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT SIDEBAR */}
        <aside className="w-full lg:w-72 flex-shrink-0 bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm lg:sticky lg:top-24 space-y-6">
          {/* User Profile & Streak Overview */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sero-purple-50 to-indigo-50 border border-sero-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sero-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <Heart className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-slate-900 text-sm truncate">
                  {user ? (user.name || user.username || "Teman Sero") : "Tamu Safe Space"}
                </h3>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  {user?.type === "ADMIN" ? (
                    <>
                      <Shield className="w-3 h-3 text-indigo-600" /> Akun Admin / BA
                    </>
                  ) : user ? (
                    <>
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Member Terverifikasi
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-sero-purple-600" /> Ruang Bebas Akses
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="mt-3 pt-3 border-t border-sero-purple-200/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-700">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold">{streak.currentStreak} Hari Streak</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                Rekor: {streak.longestStreak}h
              </span>
            </div>
          </div>

          {/* Sidebar Menu Navigation */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
              Menu Healing Corner
            </span>

            <button
              onClick={() => setActiveTab("OVERVIEW")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "OVERVIEW"
                  ? "bg-sero-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Ringkasan Harian</span>
            </button>

            <button
              onClick={() => setActiveTab("JOURNAL")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "JOURNAL"
                  ? "bg-sero-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <PenLine className="w-4 h-4" />
              <span>Jurnal Pribadi (AES-256)</span>
            </button>

            <button
              onClick={() => setActiveTab("MOOD")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "MOOD"
                  ? "bg-sero-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>Check-in Mood Harian</span>
            </button>

            <button
              onClick={() => setActiveTab("BREATHING")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "BREATHING"
                  ? "bg-sero-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Wind className="w-4 h-4" />
              <span>Latihan Pernapasan (4-4-4)</span>
            </button>

            <button
              onClick={() => setActiveTab("BOOKMARKS")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "BOOKMARKS"
                  ? "bg-sero-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Kalimat Favorit ({bookmarks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("PROMPTS")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "PROMPTS"
                  ? "bg-sero-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Inspirasi Guided Prompt</span>
            </button>
          </div>

          {/* Quick Support & Back link */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <a
              href="/awaremind"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" /> Bantuan Konselor
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="/"
              className="w-full flex items-center gap-2 p-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-medium hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </a>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 w-full min-w-0">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "OVERVIEW" && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sero-purple-600 via-indigo-600 to-indigo-700 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10 max-w-xl space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sero-purple-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Ruang Aman Pribadimu
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black">
                    Halo, {user?.name || user?.username || "Sahabat Sero"}
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                    Setiap emosi yang hadir hari ini berharga. Ambil jeda sejenak untuk bernafas, mencatat isi pikiranmu, dan memulihkan energi batin.
                  </p>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab("JOURNAL")}
                  className="p-5 rounded-2xl bg-white border border-slate-200 text-left hover:border-sero-purple-300 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-sero-purple-100 text-sero-purple-700 flex items-center justify-center mb-3">
                    <PenLine className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-sero-purple-700 transition-colors">
                    Tulis Jurnal Hari Ini
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Enkripsi AES-256 aktif. Jaga streak journaling-mu!
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab("BREATHING")}
                  className="p-5 rounded-2xl bg-white border border-slate-200 text-left hover:border-sky-300 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                    <Wind className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-sky-700 transition-colors">
                    Latihan Napas Kotak
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    4 detik tarik, 4 detik tahan, 4 detik hembuskan.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab("MOOD")}
                  className="p-5 rounded-2xl bg-white border border-slate-200 text-left hover:border-amber-300 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                    <Smile className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition-colors">
                    Check-in Mood Harian
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Kenali dan peluk suasana hatimu di sesi ini.
                  </p>
                </button>
              </div>

              {/* Recent Journal & Quote */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-600" /> Jurnal Terakhir Kamu
                    </h3>
                    <button
                      onClick={() => setActiveTab("JOURNAL")}
                      className="text-xs font-bold text-sero-purple-600 hover:underline"
                    >
                      Buka Semua →
                    </button>
                  </div>

                  {entries.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-slate-50 text-center text-xs text-slate-500">
                      Belum ada catatan jurnal. Tulis refleksi pertamamu hari ini!
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-[11px] font-bold text-sero-purple-600">
                        {new Date(entries[0].createdAt).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                      <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
                        {entries[0].content}
                      </p>
                    </div>
                  )}
                </div>

                {/* Calming Insight */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-sero-purple-50/80 to-white border border-sero-purple-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sero-purple-700 flex items-center gap-1.5 mb-3">
                      <Sparkles className="w-4 h-4" /> Ketenangan Hari Ini
                    </span>
                    <p className="text-sm font-medium text-slate-800 italic leading-relaxed">
                      "{MOOD_MESSAGES[selectedMood]}"
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Mood sesi ini: {selectedMood}</span>
                    <button
                      onClick={() => setActiveTab("MOOD")}
                      className="font-bold text-sero-purple-700 hover:underline"
                    >
                      Ubah Mood
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JOURNAL (AES-256) */}
          {activeTab === "JOURNAL" && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Self-Journal Pribadi Terenkripsi
                      </h2>
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        Standar Enkripsi AES-256 Aktif
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}
                  </span>
                </div>

                {/* Guided Prompt Suggester */}
                {prompts.length > 0 && (
                  <div className="pt-1">
                    <span className="text-xs font-bold text-sero-purple-700 block mb-2">
                      Inspirasi Prompt Cepat:
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {prompts.slice(0, 5).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setJournalContent(p.content + "\n\n")}
                          className="whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-sero-purple-50 text-slate-700 hover:text-sero-purple-700 border border-slate-200 text-xs font-medium transition-colors flex-shrink-0"
                        >
                          "{p.content.slice(0, 40)}..." <span className="font-bold text-sero-purple-600">Pakai</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {journalAlert && (
                  <div
                    className={`p-4 rounded-2xl border text-xs flex items-start gap-2.5 ${
                      journalAlert.type === "success"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                  >
                    {journalAlert.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{journalAlert.text}</span>
                  </div>
                )}

                <form onSubmit={handleSaveJournal} className="space-y-4">
                  <textarea
                    rows={8}
                    required
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    placeholder="Tuliskan apapun yang ada di benakmu hari ini... Tidak ada penghakiman, tidak ada penilaian. Ruang ini murni milikmu."
                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sero-purple-400 text-sm leading-relaxed transition-all"
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-slate-400">
                      Tersimpan secara lokal dan dienkripsi di basis data server.
                    </span>
                    <button
                      type="submit"
                      disabled={submittingJournal || !journalContent.trim()}
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-sero-purple-600 to-indigo-600 hover:from-sero-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submittingJournal ? (
                        <span>Mengenkripsi & Menyimpan...</span>
                      ) : (
                        <>
                          <PenLine className="w-4 h-4" />
                          <span>Simpan Jurnal</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Past Entries List */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
                  <span>Riwayat Jurnal ({entries.length})</span>
                </h3>

                {entries.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-400">
                    Belum ada catatan jurnal. Mulai tulis ceritamu di formulir atas!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-sero-purple-200 shadow-sm transition-all flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-grow">
                          <span className="text-[11px] font-bold text-sero-purple-600 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
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
            </div>
          )}

          {/* TAB 3: MOOD CHECK-IN */}
          {activeTab === "MOOD" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 text-purple-500" /> Check-in Emosi Harian
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  Bagaimana Kondisi Hatimu Saat Ini?
                </h2>
                <p className="text-xs text-slate-500">
                  Tidak ada emosi yang salah. Setiap rasa layak untuk didengarkan.
                </p>
              </div>

              {/* 7 Mood Selector with Lucide icons (ZERO EMOJIS) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {MOODS.map((m) => {
                  const Icon = m.icon;
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMood(m.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      <Icon className={`w-7 h-7 mb-2 ${isSelected ? "text-white" : m.color.split(" ")[0]}`} />
                      <span className="text-xs font-bold">{m.label}</span>
                    </button>
                  );
                })}
              </div>



              {/* Dynamic Affirmation */}
              <div className="p-5 rounded-2xl bg-sero-purple-50 border border-sero-purple-200 text-slate-800 text-sm leading-relaxed flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-sero-purple-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-sero-purple-700 uppercase tracking-wider block">
                    Pesan Refleksi untuk Emosi {selectedMood}:
                  </span>
                  <p className="font-medium italic">{MOOD_MESSAGES[selectedMood]}</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setJournalContent(`Hari ini saya merasa ${selectedMood}. ${MOOD_MESSAGES[selectedMood]}\n\n`);
                    setActiveTab("JOURNAL");
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <PenLine className="w-4 h-4" />
                  <span>Tuangkan Rasa Ini ke Jurnal Pribadi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: BREATHING EXERCISE */}
          {activeTab === "BREATHING" && (
            <div className="p-8 sm:p-14 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-8 max-w-xl mx-auto">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider">
                  <Wind className="w-3.5 h-3.5" /> Box Breathing 4-4-4
                </span>
                <h2 className="text-2xl font-bold text-slate-900">Atur Napasmu Perlahan</h2>
                <p className="text-xs text-slate-500">
                  Latihan pernapasan kotak terbukti secara klinis mengaktifkan sistem saraf parasimpatis dan menurunkan ketegangan.
                </p>
              </div>

              {/* Animated Circle */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-tr from-sky-200 via-indigo-200 to-purple-200 transition-all duration-1000 ${
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
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest block">
                    {breathingActive ? breathingPhase : "Tekan Mulai"}
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
                      <Pause className="w-4 h-4" /> Jeda Latihan
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" /> Mulai Latihan
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
                  title="Reset timer pernapasan"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: BOOKMARKS & CALMING SENTENCES */}
          {activeTab === "BOOKMARKS" && (
            <div className="space-y-6">
              {/* User Saved Bookmarks */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-sero-purple-600" />
                  Kalimat Favorit Tersimpan ({bookmarks.length})
                </h3>

                {bookmarks.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    Belum ada kalimat yang kamu bookmark. Klik ikon bookmark pada kalimat di bawah untuk menyimpannya ke koleksi pribadimu.
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
                          <span>Oleh {b.author}</span>
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

              {/* All Calming Sentences */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Eksplorasi Kalimat Penenang Komunitas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {calmingSentences.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-sero-purple-200 shadow-sm flex flex-col justify-between"
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
                            title={item.isBookmarked ? "Hapus bookmark" : "Simpan bookmark"}
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
                        Oleh {item.author || "Tim Serotonin"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GUIDED PROMPTS */}
          {activeTab === "PROMPTS" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Kumpulan Guided Prompt Refleksi
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Gunakan pertanyaan refleksi ini untuk mengurai pikiran kusut saat menulis jurnal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {prompts.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sero-purple-300 flex flex-col justify-between transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sero-purple-100 text-sero-purple-700 uppercase tracking-wider mb-2 inline-block">
                        {p.tag}
                      </span>
                      <p className="text-sm font-semibold text-slate-800 leading-relaxed mb-4">
                        "{p.content}"
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setJournalContent(`Prompt: ${p.content}\n\n`);
                        setActiveTab("JOURNAL");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-sero-purple-600 hover:text-sero-purple-700 transition-colors"
                    >
                      <span>Gunakan untuk Menulis Jurnal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
