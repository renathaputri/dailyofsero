"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit3, User, Upload, Link as LinkIcon, X, Check, AlertCircle, RefreshCw, Tag } from "lucide-react";
import { toast, confirmModal } from "@/components/Toast";

interface Counselor {
  id: string;
  name: string;
  tags?: string | null;
  photoUrl?: string | null;
  createdAt: string;
}

const SUGGESTED_TAGS = [
  "Relasi Romantis",
  "Pengembangan Diri",
  "Dukungan Emosional",
  "Karier & Akademik",
  "Keluarga & Pernikahan",
  "Kecemasan & Overthinking",
  "Mindfulness & Healing",
];

export default function AdminCounselorsPage() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoMode, setPhotoMode] = useState<"upload" | "url">("upload");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track image load errors by counselor id to show fallback avatar
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadCounselors();
  }, []);

  const loadCounselors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/counselors");
      const data = await res.json();
      if (data?.counselors) setCounselors(data.counselors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setName("");
    setTags("");
    setPhotoUrl("");
    setPhotoMode("upload");
    setErrorMessage(null);
    setModalOpen(true);
  };

  const openEditModal = (c: Counselor) => {
    setEditId(c.id);
    setName(c.name);
    setTags(c.tags || "");
    setPhotoUrl(c.photoUrl || "");
    setPhotoMode(c.photoUrl && c.photoUrl.startsWith("http") && !c.photoUrl.startsWith("data:") ? "url" : "upload");
    setErrorMessage(null);
    setModalOpen(true);
  };

  const toggleTag = (tagToAdd: string) => {
    const currentTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const exists = currentTags.some((t) => t.toLowerCase() === tagToAdd.toLowerCase());

    if (exists) {
      const filtered = currentTags.filter((t) => t.toLowerCase() !== tagToAdd.toLowerCase());
      setTags(filtered.join(", "));
    } else {
      setTags([...currentTags, tagToAdd].join(", "));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Silakan pilih file gambar (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar maksimal 5MB.");
      return;
    }

    setUploadingImage(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setPhotoUrl(data.url);
      } else {
        setErrorMessage(data.error || "Gagal mengunggah foto.");
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan saat upload gambar.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Nama konselor wajib diisi.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const url = editId ? `/api/counselors/${editId}` : "/api/counselors";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          tags: tags.trim() || null,
          photoUrl: photoUrl.trim() || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setModalOpen(false);
        // Clear broken image cache for this item if edited
        if (editId) {
          setBrokenImages((prev) => {
            const next = { ...prev };
            delete next[editId];
            return next;
          });
        }
        loadCounselors();
      } else {
        setErrorMessage(data.error || "Gagal menyimpan data konselor.");
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan koneksi server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, counselorName: string) => {
    const confirmed = await confirmModal({
      title: "Hapus Konselor?",
      message: `Apakah kamu yakin ingin menghapus data konselor "${counselorName}"?`,
      confirmText: "Hapus",
      cancelText: "Batal",
      isDanger: true,
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/counselors/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCounselors((prev) => prev.filter((c) => c.id !== id));
        toast.success(`Data konselor "${counselorName}" berhasil dihapus.`);
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menghapus data konselor.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan koneksi.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-2">
            <span>Mitra AwareMind</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kelola Konselor & Psikolog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data konselor mitra AwareMind yang ditampilkan di halaman publik lengkap dengan bidang tagar layanan.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-100 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Konselor</span>
        </button>
      </div>

      {/* Counselor Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-28 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : counselors.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Belum ada konselor mitra</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Silakan klik tombol "Tambah Konselor" di atas untuk menambahkan data konselor mitra ke sistem.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {counselors.map((c) => {
              const isBroken = brokenImages[c.id];
              const showImg = c.photoUrl && !isBroken;
              const tagsList = c.tags ? c.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

              return (
                <div
                  key={c.id}
                  className="p-4 sm:p-5 rounded-3xl border border-slate-200 flex flex-col justify-between gap-3 hover:shadow-md hover:border-indigo-200 transition-all bg-white group min-w-0"
                >
                  {/* Top: Avatar, Name & Tags */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
                      {showImg ? (
                        <img
                          src={c.photoUrl!}
                          alt={c.name}
                          onError={() => {
                            setBrokenImages((prev) => ({ ...prev, [c.id]: true }));
                          }}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-indigo-400" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        className="font-bold text-slate-900 text-sm leading-snug line-clamp-2"
                        title={c.name}
                      >
                        {c.name}
                      </h3>
                      
                      {tagsList.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {tagsList.map((tagItem, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-100"
                            >
                              #{tagItem}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 mt-0.5">Psikolog Mitra</p>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Action Buttons */}
                  <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => openEditModal(c)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                      title="Edit Konselor"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Hapus Konselor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Edit / Add Counselor */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-4xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  {editId ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editId ? "Edit Data Konselor" : "Tambah Konselor Baru"}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {editId ? "Perbarui informasi, nama, dan tagar konselor" : "Tambahkan konselor mitra baru beserta tagar fokus"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Photo Preview & Inputs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Foto Profil Konselor
                </label>

                <div className="flex items-center gap-4 mb-3">
                  {/* Avatar Preview */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 relative">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setPhotoUrl("")}
                      />
                    ) : (
                      <User className="w-8 h-8 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Toggle Upload vs URL */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                      <button
                        type="button"
                        onClick={() => setPhotoMode("upload")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          photoMode === "upload"
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoMode("url")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          photoMode === "url"
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Tautan URL</span>
                      </button>
                    </div>

                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoUrl("")}
                        className="text-[11px] text-rose-500 hover:underline block"
                      >
                        Hapus Foto (Gunakan Default)
                      </button>
                    )}
                  </div>
                </div>

                {/* Upload or URL input area */}
                {photoMode === "upload" ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="counselor-photo-input"
                    />
                    <label
                      htmlFor="counselor-photo-input"
                      className="w-full p-3 rounded-2xl border border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 text-slate-600 cursor-pointer text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <Upload className="w-4 h-4 text-indigo-500" />
                      <span>{uploadingImage ? "Mengunggah..." : "Pilih File Gambar dari Perangkat"}</span>
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Bagian 1: Name field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  1. Nama Lengkap & Gelar Konselor
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Dr. Amanda Permata, M.Psi, Psikolog Klinis"
                  className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Nama lengkap dan gelar profesional konselor mitra.
                </p>
              </div>

              {/* Bagian 2: Tags / Fokus Konseling */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    2. Tagar / Topik Layanan Konselor
                  </label>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-rose-500" /> Contoh: Relasi Romantis, Pengembangan Diri
                  </span>
                </div>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Misal: Relasi Romantis, Pengembangan Diri, Dukungan Emosional"
                  className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                />
                
                {/* Preset Chips */}
                <div className="mt-2.5 space-y-1.5">
                  <p className="text-[11px] text-slate-400 font-medium">
                    Pilih rekomendasi tagar cepat (klik untuk tambah/hapus):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_TAGS.map((stag) => {
                      const currentList = tags.split(",").map((t) => t.trim().toLowerCase());
                      const active = currentList.includes(stag.toLowerCase());
                      return (
                        <button
                          key={stag}
                          type="button"
                          onClick={() => toggleTag(stag)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all border ${
                            active
                              ? "bg-rose-50 border-rose-300 text-rose-700 shadow-xs"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                          }`}
                        >
                          {active ? `✓ #${stag}` : `+ #${stag}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{editId ? "Perbarui Konselor" : "Simpan Konselor"}</span>
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
