"use client";

import React, { useState, useEffect } from "react";
import { Database, Plus, Trash2, Sparkles, Filter, AlertCircle, CheckCircle2 } from "lucide-react";

interface ContentItem {
  id: string;
  type: "CALMING_SENTENCE" | "GUIDED_PROMPT";
  content: string;
  tag: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    title: string;
  };
}

const MOOD_TAGS = [
  { id: "ALL", label: "Semua Mood" },
  { id: "SENANG", label: "Senang" },
  { id: "SEDIH", label: "Sedih" },
  { id: "CEMAS", label: "Cemas" },
  { id: "MARAH", label: "Marah" },
  { id: "LELAH", label: "Lelah" },
  { id: "TENANG", label: "Tenang" },
  { id: "BINGUNG", label: "Bingung" },
];

export default function AdminContentBankPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [admin, setAdmin] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<"ALL" | "CALMING_SENTENCE" | "GUIDED_PROMPT">("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Modal create
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<"CALMING_SENTENCE" | "GUIDED_PROMPT">("CALMING_SENTENCE");
  const [tag, setTag] = useState("TENANG");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setAdmin(data?.user));
    loadItems();
  }, [selectedType, selectedTag]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedType !== "ALL") params.append("type", selectedType);
      if (selectedTag !== "ALL") params.append("tag", selectedTag);

      const res = await fetch(`/api/content-bank?${params.toString()}`);
      const data = await res.json();
      if (data?.items) setItems(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/content-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, tag, content }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menambahkan konten.");
        setSubmitting(false);
        return;
      }

      setContent("");
      setModalOpen(false);
      loadItems();
    } catch (err) {
      setError("Terjadi kendala jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hanya Superadmin yang berhak menghapus. Hapus item Content Bank ini?")) return;

    try {
      const res = await fetch(`/api/content-bank/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.error || "Gagal menghapus.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isSuperadmin = admin?.role === "SUPERADMIN";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Content Bank Komunitas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Bank kalimat penenang dan guided prompt jurnal untuk para pengunjung.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-sero-purple-600 hover:bg-sero-purple-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Konten Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setSelectedType("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedType === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            Semua Tipe
          </button>
          <button
            onClick={() => setSelectedType("CALMING_SENTENCE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedType === "CALMING_SENTENCE" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            Kalimat Penenang
          </button>
          <button
            onClick={() => setSelectedType("GUIDED_PROMPT")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedType === "GUIDED_PROMPT" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            Guided Prompt
          </button>
        </div>

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-3 py-2 rounded-2xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none"
        >
          {MOOD_TAGS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Memuat Content Bank...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Belum ada konten pada filter ini.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1.5 flex-grow pr-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.type === "CALMING_SENTENCE"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {item.type === "CALMING_SENTENCE" ? "Kalimat Penenang" : "Guided Prompt"}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Tag: {item.tag}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Oleh: {item.createdBy?.name}
                    </span>
                  </div>

                  <p className="text-sm text-slate-800 font-medium italic leading-relaxed">
                    "{item.content}"
                  </p>
                </div>

                {/* Only Superadmin can delete (PRD 3.7) */}
                {isSuperadmin && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex-shrink-0"
                    title="Hapus konten (Superadmin only)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Add Content */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-4xl shadow-2xl border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Tambah ke Content Bank (Auto-Publish)
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tipe Konten
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-sero-purple-400"
                >
                  <option value="CALMING_SENTENCE">Kalimat Penenang (Quote)</option>
                  <option value="GUIDED_PROMPT">Guided Prompt Jurnal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tag Mood Target (7 Kategori)
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-sero-purple-400"
                >
                  <option value="SENANG">Senang</option>
                  <option value="SEDIH">Sedih</option>
                  <option value="CEMAS">Cemas</option>
                  <option value="MARAH">Marah</option>
                  <option value="LELAH">Lelah</option>
                  <option value="TENANG">Tenang</option>
                  <option value="BINGUNG">Bingung</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Teks Konten
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan kalimat penenang atau panduan refleksi jurnal..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-sero-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-sero-purple-600 hover:bg-sero-purple-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Konten"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
