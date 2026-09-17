"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit3, User, Upload, Link as LinkIcon, X, Check, AlertCircle, RefreshCw } from "lucide-react";

interface Counselor {
  id: string;
  name: string;
  photoUrl?: string | null;
  createdAt: string;
}

export default function AdminCounselorsPage() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
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
    setPhotoUrl("");
    setPhotoMode("upload");
    setErrorMessage(null);
    setModalOpen(true);
  };

  const openEditModal = (c: Counselor) => {
    setEditId(c.id);
    setName(c.name);
    setPhotoUrl(c.photoUrl || "");
    setPhotoMode(c.photoUrl && c.photoUrl.startsWith("http") && !c.photoUrl.startsWith("data:") ? "url" : "upload");
    setErrorMessage(null);
    setModalOpen(true);
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
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, counselorName: string) => {
    if (!confirm(`Apakah kamu yakin ingin menghapus konselor "${counselorName}"?`)) return;

    try {
      const res = await fetch(`/api/counselors/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCounselors((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Gagal menghapus konselor.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Kelola Konselor AwareMind
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar showcase konselor mitra AwareMind untuk ditampilkan kepada pengguna.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Konselor Baru</span>
        </button>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-6">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
            <span className="text-xs font-medium">Memuat daftar konselor...</span>
          </div>
        ) : counselors.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            Belum ada data konselor. Klik tombol "Tambah Konselor Baru" untuk menambahkan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {counselors.map((c) => {
              const isBroken = brokenImages[c.id];
              const showImg = c.photoUrl && !isBroken;

              return (
                <div
                  key={c.id}
                  className="p-4 sm:p-5 rounded-3xl border border-slate-200 flex items-center justify-between gap-3 hover:shadow-md hover:border-indigo-200 transition-all bg-white group min-w-0"
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
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
                        className="font-bold text-slate-900 text-sm truncate block"
                        title={c.name}
                      >
                        {c.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">Psikolog Mitra</p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                      title="Edit Konselor"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Hapus Konselor"
                    >
                      <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-4xl shadow-2xl border border-slate-100 overflow-hidden">
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
                    {editId ? "Perbarui informasi dan foto konselor" : "Tambahkan konselor mitra baru ke sistem"}
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

              {/* Name field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap, Gelar & Spesialisasi
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
                  Cantumkan gelar akademis serta fokus layanan mitra (misal: Konselor Keluarga).
                </p>
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
