"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Edit3,
  Trash2,
  Search,
  Plus,
  RefreshCw,
  User,
  Check,
  X,
  AlertCircle,
  Sparkles,
  Quote,
  BookOpen,
} from "lucide-react";

interface ContentItem {
  id: string;
  type: "CALMING_SENTENCE" | "GUIDED_PROMPT";
  content: string;
  tag: string;
  createdAt: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    username?: string;
    title: string;
  };
}

interface AdminUser {
  id: string;
  name: string;
  username: string;
  title: string;
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

export default function SuperadminContentBankPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"ALL" | "CALMING_SENTENCE" | "GUIDED_PROMPT">("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [selectedAdminId, setSelectedAdminId] = useState("ALL");

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newType, setNewType] = useState<"CALMING_SENTENCE" | "GUIDED_PROMPT">("CALMING_SENTENCE");
  const [newTag, setNewTag] = useState("TENANG");
  const [newContent, setNewContent] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ContentItem | null>(null);
  const [editType, setEditType] = useState<"CALMING_SENTENCE" | "GUIDED_PROMPT">("CALMING_SENTENCE");
  const [editTag, setEditTag] = useState("TENANG");
  const [editContent, setEditContent] = useState("");
  const [editCreatedById, setEditCreatedById] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [contentRes, adminsRes] = await Promise.all([
        fetch("/api/content-bank"),
        fetch("/api/admin/users"),
      ]);

      const contentData = await contentRes.json();
      const adminsData = await adminsRes.json();

      if (contentData?.items) setItems(contentData.items);
      if (adminsData?.admins) setAdmins(adminsData.admins);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setNewType("CALMING_SENTENCE");
    setNewTag("TENANG");
    setNewContent("");
    setCreateError(null);
    setCreateModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setCreateSubmitting(true);
    setCreateError(null);

    try {
      const res = await fetch("/api/content-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: newType,
          tag: newTag,
          content: newContent.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Gagal menambahkan konten.");
        setCreateSubmitting(false);
        return;
      }

      setCreateModalOpen(false);
      loadData();
    } catch (err) {
      setCreateError("Terjadi kendala jaringan.");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openEditModal = (item: ContentItem) => {
    setCurrentItem(item);
    setEditType(item.type);
    setEditTag(item.tag);
    setEditContent(item.content);
    setEditCreatedById(item.createdById || item.createdBy?.id || "");
    setEditError(null);
    setEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    if (!editContent.trim()) {
      setEditError("Konten teks tidak boleh kosong.");
      return;
    }

    setEditSubmitting(true);
    setEditError(null);

    try {
      const res = await fetch(`/api/content-bank/${currentItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: editType,
          tag: editTag,
          content: editContent.trim(),
          createdById: editCreatedById || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Gagal memperbarui konten.");
        setEditSubmitting(false);
        return;
      }

      setEditModalOpen(false);
      loadData();
    } catch (err) {
      setEditError("Terjadi kesalahan jaringan.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (id: string, textPreview: string) => {
    if (!confirm(`Hapus konten: "${textPreview.slice(0, 40)}..."?`)) return;

    try {
      const res = await fetch(`/api/content-bank/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert(data.error || "Gagal menghapus.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.createdBy?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "ALL" || item.type === selectedType;
    const matchesTag = selectedTag === "ALL" || item.tag === selectedTag;
    const matchesAdmin =
      selectedAdminId === "ALL" ||
      item.createdById === selectedAdminId ||
      item.createdBy?.id === selectedAdminId;

    return matchesSearch && matchesType && matchesTag && matchesAdmin;
  });

  const totalCalming = items.filter((i) => i.type === "CALMING_SENTENCE").length;
  const totalPrompts = items.filter((i) => i.type === "GUIDED_PROMPT").length;

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
            Edit & Kelola Semua Content Bank
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Akses kontrol penuh untuk melihat, menyaring, mengedit teks atau tag, serta menghapus seluruh konten dari semua admin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Konten</span>
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Semua Konten</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{items.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Tersimpan di database</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Kalimat Penenang (Quotes)</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{totalCalming}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Quotes penyejuk untuk user</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Guided Prompts Jurnal</span>
          <p className="text-2xl font-black text-purple-600 mt-1">{totalPrompts}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Panduan refleksi diri</p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari isi konten, pembuat, atau tag mood..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Type filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setSelectedType("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedType === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
              }`}
            >
              Semua Tipe
            </button>
            <button
              onClick={() => setSelectedType("CALMING_SENTENCE")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedType === "CALMING_SENTENCE" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"
              }`}
            >
              Penenang
            </button>
            <button
              onClick={() => setSelectedType("GUIDED_PROMPT")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedType === "GUIDED_PROMPT" ? "bg-white text-purple-700 shadow-sm" : "text-slate-600"
              }`}
            >
              Prompt
            </button>
          </div>

          {/* Dropdown Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full md:w-36 px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {MOOD_TAGS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              value={selectedAdminId}
              onChange={(e) => setSelectedAdminId(e.target.value)}
              className="w-full md:w-44 px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="ALL">Semua Pembuat</option>
              {admins.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
            <span className="text-xs font-medium">Memuat Content Bank...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm space-y-2">
            <p className="font-semibold">Belum ada konten yang sesuai dengan filter.</p>
            <p className="text-xs text-slate-400">Silakan sesuaikan kriteria pencarian atau tambahkan konten baru.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Text & Meta */}
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.type === "CALMING_SENTENCE"
                          ? "bg-blue-50 text-blue-700 border border-blue-100"
                          : "bg-purple-50 text-purple-700 border border-purple-100"
                      }`}
                    >
                      {item.type === "CALMING_SENTENCE" ? "Kalimat Penenang" : "Guided Prompt"}
                    </span>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Mood: {item.tag}
                    </span>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <User className="w-3 h-3" />
                      <span>Oleh: <strong className="text-slate-700 font-semibold">{item.createdBy?.name || "Admin"}</strong></span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      • {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-800 font-medium italic leading-relaxed">
                    "{item.content}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    title="Edit Konten ini"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Konten</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.content)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    title="Hapus Konten ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Edit Content */}
      {editModalOpen && currentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-4xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Edit Content Bank (Superadmin)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Perbarui teks konten, tipe, kategori mood, atau pembuat
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

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              {editError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {/* Type and Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipe Konten
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as any)}
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 bg-white"
                  >
                    <option value="CALMING_SENTENCE">Kalimat Penenang</option>
                    <option value="GUIDED_PROMPT">Guided Prompt Jurnal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tag Mood Target
                  </label>
                  <select
                    value={editTag}
                    onChange={(e) => setEditTag(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 bg-white"
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
              </div>

              {/* Creator selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Atribusi Pembuat (Author)
                </label>
                <select
                  value={editCreatedById}
                  onChange={(e) => setEditCreatedById(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  {admins.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (@{a.username})
                    </option>
                  ))}
                </select>
              </div>

              {/* Text content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Teks Konten Edukasi / Prompt
                </label>
                <textarea
                  rows={5}
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Tuliskan kalimat penenang atau guided prompt..."
                  className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              {/* Footer */}
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
                  disabled={editSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {editSubmitting ? (
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

      {/* Modal Add Content */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-4xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Tambah Konten Baru
                  </h2>
                  <p className="text-xs text-slate-400">
                    Tambahkan kalimat penenang atau guided prompt baru
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {createError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipe Konten
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 bg-white"
                  >
                    <option value="CALMING_SENTENCE">Kalimat Penenang</option>
                    <option value="GUIDED_PROMPT">Guided Prompt Jurnal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tag Mood Target
                  </label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 bg-white"
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
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Teks Konten
                </label>
                <textarea
                  rows={5}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Tuliskan kalimat penenang atau guided prompt..."
                  className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {createSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Konten</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
