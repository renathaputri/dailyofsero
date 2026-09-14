"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Plus, Trash2, Edit3, User } from "lucide-react";

interface Counselor {
  id: string;
  name: string;
  photoUrl?: string;
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
  const [submitting, setSubmitting] = useState(false);

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
    setModalOpen(true);
  };

  const openEditModal = (c: Counselor) => {
    setEditId(c.id);
    setName(c.name);
    setPhotoUrl(c.photoUrl || "");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editId ? `/api/counselors/${editId}` : "/api/counselors";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, photoUrl }),
      });

      if (res.ok) {
        setModalOpen(false);
        loadCounselors();
      } else {
        alert("Gagal menyimpan konselor.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus konselor "${name}"?`)) return;

    try {
      const res = await fetch(`/api/counselors/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCounselors((prev) => prev.filter((c) => c.id !== id));
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
            Kelola Konselor AwareMind
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar showcase konselor mitra AwareMind untuk ditampilkan kepada pengguna.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Konselor Baru</span>
        </button>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-6">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Memuat konselor...</div>
        ) : counselors.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            Belum ada data konselor.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {counselors.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-3xl border border-slate-200 flex items-center justify-between gap-3 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  {c.photoUrl ? (
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{c.name}</h3>
                    <p className="text-[11px] text-slate-400">Psikolog Mitra</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-4xl shadow-2xl border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {editId ? "Edit Konselor" : "Tambah Konselor Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Dr. Amanda Permata, M.Psi"
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  URL Foto Profil
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400"
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
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Konselor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
