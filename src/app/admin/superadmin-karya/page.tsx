"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Edit3,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  User,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  Instagram,
  AlertTriangle,
} from "lucide-react";

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
    photoUrl?: string | null;
  };
}

interface AdminUser {
  id: string;
  name: string;
  username: string;
  title: string;
}

const CATEGORIES = [
  { id: "ALL", label: "Semua Kategori" },
  { id: "SELF_AWARENESS", label: "Self-Awareness" },
  { id: "MENTAL_HEALTH", label: "Mental Health" },
  { id: "GROWTH", label: "Growth" },
  { id: "CONNECTION", label: "Connection" },
  { id: "COMMUNITY", label: "Community" },
  { id: "OTHER", label: "Other" },
];

export default function SuperadminKaryaPage() {
  const [karyaList, setKaryaList] = useState<KaryaItem[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedAdminId, setSelectedAdminId] = useState("ALL");

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentKarya, setCurrentKarya] = useState<KaryaItem | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("SELF_AWARENESS");
  const [linkPost, setLinkPost] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Takedown Modal State
  const [takedownModalOpen, setTakedownModalOpen] = useState(false);
  const [takedownTarget, setTakedownTarget] = useState<KaryaItem | null>(null);
  const [takedownReason, setTakedownReason] = useState("");
  const [takedownSubmitting, setTakedownSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [karyaRes, adminsRes] = await Promise.all([
        fetch("/api/karya"),
        fetch("/api/admin/users"),
      ]);

      const karyaData = await karyaRes.json();
      const adminsData = await adminsRes.json();

      if (karyaData?.karya) setKaryaList(karyaData.karya);
      if (adminsData?.admins) setAdmins(adminsData.admins);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (k: KaryaItem) => {
    setCurrentKarya(k);
    setTitle(k.title);
    setDescription(k.description);
    setCategory(k.category);
    setLinkPost(k.linkPost);
    setOwnerId(k.ownerId);
    setEditError(null);
    setEditModalOpen(true);
  };

  const handleUpdateKarya = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentKarya) return;

    setSubmitting(true);
    setEditError(null);

    try {
      const res = await fetch(`/api/karya/${currentKarya.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          linkPost,
          ownerId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Gagal memperbarui karya.");
        setSubmitting(false);
        return;
      }

      setEditModalOpen(false);
      loadData();
    } catch (err) {
      setEditError("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const openTakedownModal = (k: KaryaItem) => {
    setTakedownTarget(k);
    setTakedownReason("");
    setTakedownModalOpen(true);
  };

  const handleExecuteTakedown = async () => {
    if (!takedownTarget) return;

    setTakedownSubmitting(true);
    try {
      const query = takedownReason.trim()
        ? `?reason=${encodeURIComponent(takedownReason.trim())}`
        : "";
      const res = await fetch(`/api/karya/${takedownTarget.id}${query}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        setKaryaList((prev) => prev.filter((k) => k.id !== takedownTarget.id));
        setTakedownModalOpen(false);
        alert(data.message || "Karya berhasil di-takedown.");
      } else {
        alert(data.error || "Gagal menghapus karya.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setTakedownSubmitting(false);
    }
  };

  // Filtered List
  const filteredKarya = karyaList.filter((k) => {
    const matchesSearch =
      searchQuery === "" ||
      k.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.owner?.username?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || k.category === selectedCategory;

    const matchesAdmin =
      selectedAdminId === "ALL" || k.ownerId === selectedAdminId;

    return matchesSearch && matchesCategory && matchesAdmin;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              Superadmin Control Center
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Edit & Kelola Semua Karya Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Akses kontrol penuh untuk melihat, mengedit metadata, memindahkan pemilik, dan men-takedown seluruh karya dari semua Brand Ambassador & Admin.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Semua Karya</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{karyaList.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Tayang di Galeri Publik</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Kontributor Admin/BA</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {new Set(karyaList.map((k) => k.ownerId)).size}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Admin yang aktif mempublikasi</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Hasil Filter Saat Ini</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{filteredKarya.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Karya cocok dengan kriteria pencarian</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul karya, deskripsi, atau nama admin/BA..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Admin filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedAdminId}
              onChange={(e) => setSelectedAdminId(e.target.value)}
              className="w-full md:w-48 px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="ALL">Semua Penulis / Admin</option>
              {admins.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.title?.replace("_", " ")})
                </option>
              ))}
            </select>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-44 px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Karya List Grid */}
      <div className="bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
            <span className="text-xs font-medium">Memuat data karya...</span>
          </div>
        ) : filteredKarya.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm space-y-2">
            <p className="font-semibold">Tidak ada karya yang sesuai dengan filter.</p>
            <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau filter admin/kategori.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredKarya.map((k) => (
              <div
                key={k.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Info Area */}
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Category badge */}
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {k.category.replace("_", " ")}
                    </span>

                    {/* Author chip */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      <div className="w-4 h-4 rounded-full bg-slate-300 overflow-hidden flex items-center justify-center shrink-0 text-slate-500 text-[9px]">
                        {k.owner?.photoUrl ? (
                          <img src={k.owner.photoUrl} alt={k.owner.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-2.5 h-2.5" />
                        )}
                      </div>
                      <span className="truncate max-w-[120px]">{k.owner?.name}</span>
                      <span className="text-[9px] text-slate-400 uppercase">
                        ({k.owner?.title?.replace("_", " ")})
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {new Date(k.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {k.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {k.description}
                    </p>
                  </div>

                  {/* IG Link */}
                  {k.linkPost && (
                    <a
                      href={k.linkPost}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline pt-0.5"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span className="truncate max-w-xs">{k.linkPost}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <button
                    onClick={() => openEditModal(k)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Karya</span>
                  </button>

                  <button
                    onClick={() => openTakedownModal(k)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    title="Takedown Karya ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Takedown</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Edit Karya */}
      {editModalOpen && currentKarya && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-4xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Edit Karya Admin (Superadmin)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Perbarui konten, kategori, tautan, atau alihkan kepemilikan karya
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateKarya} className="p-6 space-y-4">
              {editError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Karya
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              {/* Category & Owner Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kategori Karya
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 bg-white"
                  >
                    <option value="SELF_AWARENESS">Self-Awareness</option>
                    <option value="MENTAL_HEALTH">Mental Health</option>
                    <option value="GROWTH">Growth</option>
                    <option value="CONNECTION">Connection</option>
                    <option value="COMMUNITY">Community</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pemilik / Author Karya
                  </label>
                  <select
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 bg-white"
                  >
                    {admins.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} (@{a.username})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Instagram link */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tautan Postingan Instagram
                </label>
                <div className="relative">
                  <Instagram className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={linkPost}
                    onChange={(e) => setLinkPost(e.target.value)}
                    placeholder="https://www.instagram.com/p/..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi / Sinopsis Edukasi
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Takedown Karya */}
      {takedownModalOpen && takedownTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-4xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Takedown Karya Admin
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Karya <strong className="text-slate-800">"{takedownTarget.title}"</strong> oleh <strong className="text-slate-800">{takedownTarget.owner?.name}</strong> akan dihapus permanen dari galeri dan notifikasi akan dikirimkan ke author.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Alasan Takedown (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={takedownReason}
                  onChange={(e) => setTakedownReason(e.target.value)}
                  placeholder="Misal: Pelanggaran pedoman konten atau format tidak sesuai..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTakedownModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteTakedown}
                  disabled={takedownSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {takedownSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Konfirmasi Takedown</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
