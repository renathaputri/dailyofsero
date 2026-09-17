"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2, Edit3, ExternalLink, Instagram } from "lucide-react";

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

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const user = data?.user;
        setAdmin(user);
        if (user?.id) {
          loadMyKarya(user.id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const loadMyKarya = async (ownerId?: string) => {
    setLoading(true);
    try {
      const url = ownerId ? `/api/karya?ownerId=${ownerId}` : "/api/karya?my=true";
      const res = await fetch(url);
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
      if (admin?.id) loadMyKarya(admin.id);
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (k: KaryaItem) => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Kelola Karya Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Unggah, edit, dan pantau karya edukasi kesehatan mental Instagram milikmu yang tampil di Galeri Karya & Portfoliomu.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Karya Baru</span>
        </button>
      </div>

      {/* Superadmin banner shortcut */}
      {admin?.role === "SUPERADMIN" && (
        <div className="p-4 rounded-3xl bg-indigo-50/80 border border-indigo-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-950">
                Kamu memiliki hak akses Superadmin
              </p>
              <p className="text-[11px] text-indigo-700">
                Ingin melihat, mengedit, atau men-takedown karya milik admin/BA lain? Gunakan panel Kontrol Semua Karya.
              </p>
            </div>
          </div>
          <a
            href="/admin/superadmin-karya"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap"
          >
            Buka Kontrol Semua Karya →
          </a>
        </div>
      )}

      {/* Table / List */}
      <div className="bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Memuat karya kamu...</div>
        ) : karyaList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">Belum ada karya yang diunggah</p>
            <p className="text-xs text-slate-400">
              Karya edukasi yang kamu unggah akan otomatis tampil di Galeri Karya publik dan mini portfoliomu.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {karyaList.map((k) => (
              <div
                key={k.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1.5 flex-grow pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                      {k.category.replace("_", " ")}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      Diterbitkan pada {new Date(k.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
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
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(k)}
                    className="p-2.5 rounded-xl text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                    title="Edit Karya"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(k)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Hapus Karya"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal (Create / Edit) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 bg-white rounded-4xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {editId ? "Edit Karya Publikasi" : "Unggah Karya Baru (Auto-Publish)"}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Karya akan langsung dipublikasikan ke Galeri Karya dan mini portfoliomu.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Judul Karya
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="misal: 5 Cara Mengatasi Overthinking..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kategori Karya
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-purple-400"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
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
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-purple-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Deskripsi / Caption Singkat
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan intisari pesan atau ringkasan postingan ini..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md shadow-purple-200 disabled:opacity-50 transition-all"
                >
                  {submitting ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Publikasikan Karya"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
