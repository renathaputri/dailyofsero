"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2, Edit3, ExternalLink, ShieldAlert, AlertCircle, CheckCircle2, Instagram } from "lucide-react";

interface KaryaItem {
  id: string;
  title: string;
  description: string;
  category: string;
  linkPost: string;
  ownerId: string;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    username: string;
    title: string;
  };
}

const CATEGORIES = [
  { id: "SELF_AWARENESS", label: "Self-Awareness" },
  { id: "MENTAL_HEALTH", label: "Mental Health" },
  { id: "GROWTH", label: "Growth" },
  { id: "CONNECTION", label: "Connection" },
  { id: "COMMUNITY", label: "Community" },
  { id: "OTHER", label: "Other" },
];

export default function AdminKaryaPage() {
  const [karyaList, setKaryaList] = useState<KaryaItem[]>([]);
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("SELF_AWARENESS");
  const [linkPost, setLinkPost] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Takedown modal (Superadmin only)
  const [takedownModalOpen, setTakedownModalOpen] = useState(false);
  const [takedownTarget, setTakedownTarget] = useState<KaryaItem | null>(null);
  const [takedownReason, setTakedownReason] = useState("");
  const [takedownLoading, setTakedownLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setAdmin(data?.user));
    loadKarya();
  }, []);

  const loadKarya = async () => {
    try {
      const res = await fetch("/api/karya");
      const data = await res.json();
      if (data?.karya) setKaryaList(data.karya);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setCategory("SELF_AWARENESS");
    setLinkPost("");
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (k: KaryaItem) => {
    setEditId(k.id);
    setTitle(k.title);
    setDescription(k.description);
    setCategory(k.category);
    setLinkPost(k.linkPost);
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const url = editId ? `/api/karya/${editId}` : "/api/karya";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, linkPost }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal menyimpan karya.");
        setSubmitting(false);
        return;
      }

      setModalOpen(false);
      loadKarya();
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (k: KaryaItem) => {
    const isOwner = k.ownerId === admin?.id;
    const isSuperadmin = admin?.role === "SUPERADMIN";

    if (isSuperadmin && !isOwner) {
      // Trigger Takedown flow with reason input
      setTakedownTarget(k);
      setTakedownReason("");
      setTakedownModalOpen(true);
      return;
    }

    if (!confirm(`Hapus karya "${k.title}"?`)) return;

    try {
      const res = await fetch(`/api/karya/${k.id}`, { method: "DELETE" });
      if (res.ok) {
        setKaryaList((prev) => prev.filter((item) => item.id !== k.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmTakedown = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!takedownTarget) return;

    setTakedownLoading(true);
    try {
      const url = `/api/karya/${takedownTarget.id}?reason=${encodeURIComponent(takedownReason)}`;
      const res = await fetch(url, { method: "DELETE" });

      if (res.ok) {
        setKaryaList((prev) => prev.filter((item) => item.id !== takedownTarget.id));
        setTakedownModalOpen(false);
        alert("Karya berhasil di-takedown. Notifikasi in-app dan email telah dikirimkan ke BA.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTakedownLoading(false);
    }
  };

  const isSuperadmin = admin?.role === "SUPERADMIN";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Kelola Karya Brand Ambassador
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isSuperadmin
              ? "Semua karya publikasi tim BA (Superadmin memiliki hak Takedown)"
              : "Unggah postingan Instagram edukasi kesehatan mental milikmu"}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full bg-sero-purple-600 hover:bg-sero-purple-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Karya Baru</span>
        </button>
      </div>

      {/* Table / List */}
      <div className="bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Memuat karya...</div>
        ) : karyaList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Belum ada karya yang diunggah. Klik tombol di atas untuk menambah karya pertamamu!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {karyaList.map((k) => {
              const isOwner = k.ownerId === admin?.id;
              const canModify = isOwner || isSuperadmin;

              return (
                <div
                  key={k.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="space-y-1.5 flex-grow pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {k.category.replace("_", " ")}
                      </span>
                      <span className="text-[11px] font-semibold text-sero-purple-600">
                        Oleh: {k.owner?.name} (@{k.owner?.username})
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{k.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl leading-relaxed">
                      {k.description}
                    </p>
                    <a
                      href={k.linkPost}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:underline pt-1"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>{k.linkPost}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Actions */}
                  {canModify && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isOwner && (
                        <button
                          onClick={() => openEditModal(k)}
                          className="p-2 rounded-xl text-slate-500 hover:text-sero-purple-600 hover:bg-slate-100 transition-colors"
                          title="Edit Karya"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(k)}
                        className={`p-2 rounded-xl transition-colors ${
                          !isOwner && isSuperadmin
                            ? "text-rose-600 hover:bg-rose-50 font-semibold text-xs flex items-center gap-1"
                            : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        }`}
                        title={!isOwner && isSuperadmin ? "Takedown Karya Ini" : "Hapus Karya"}
                      >
                        <Trash2 className="w-4 h-4" />
                        {!isOwner && isSuperadmin && <span>Takedown</span>}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Modal (Create / Edit) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 bg-white rounded-4xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editId ? "Edit Karya Publikasi" : "Unggah Karya Baru (Auto-Publish)"}
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Judul Postingan
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: 5 Cara Mengatasi Burnout..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-sero-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kategori Karya (Predefined)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-sero-purple-400"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Link Postingan Instagram
                </label>
                <input
                  type="url"
                  required
                  value={linkPost}
                  onChange={(e) => setLinkPost(e.target.value)}
                  placeholder="https://www.instagram.com/p/..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-sero-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Deskripsi / Ringkasan Konten
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tuliskan intisari pembahasan karya ini..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-sero-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-sero-purple-600 hover:bg-sero-purple-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : editId ? "Perbarui Karya" : "Terbitkan Langsung ✨"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Superadmin Takedown Modal (PRD 3.3) */}
      {takedownModalOpen && takedownTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-4xl shadow-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-rose-600 mb-3">
              <ShieldAlert className="w-6 h-6" />
              <h2 className="text-lg font-bold">Takedown Karya BA</h2>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Tindakan ini akan melakukan <strong>hard delete</strong> karya "
              <strong>{takedownTarget.title}</strong>" milik <strong>{takedownTarget.owner?.name}</strong>. Sistem akan otomatis mengirimkan email dan notifikasi in-app kepada BA pemilik.
            </p>

            <form onSubmit={handleConfirmTakedown} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Alasan Takedown (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={takedownReason}
                  onChange={(e) => setTakedownReason(e.target.value)}
                  placeholder="Misal: Melanggar panduan komunitas atau konten tidak sesuai standar..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTakedownModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={takedownLoading}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {takedownLoading ? "Memproses Takedown..." : "Takedown & Hapus Total"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
