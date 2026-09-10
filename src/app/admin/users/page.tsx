"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, KeyRound, Edit3, ShieldAlert, CheckCircle2, Lock } from "lucide-react";

interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: "ADMIN" | "SUPERADMIN";
  title: "MIND_CAPTAIN" | "CO_CAPTAIN" | "BA";
  photoUrl?: string;
  bio?: string;
  createdAt: string;
  _count: {
    karya: number;
  };
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Create
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"ADMIN" | "SUPERADMIN">("ADMIN");
  const [title, setTitle] = useState<"MIND_CAPTAIN" | "CO_CAPTAIN" | "BA">("BA");
  const [bio, setBio] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Modal Edit / Reset Password
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [targetAdmin, setTargetAdmin] = useState<AdminUser | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<"ADMIN" | "SUPERADMIN">("ADMIN");
  const [editTitle, setEditTitle] = useState<"MIND_CAPTAIN" | "CO_CAPTAIN" | "BA">("BA");
  const [newPassword, setNewPassword] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editAlert, setEditAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data?.admins) setAdmins(data.admins);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSubmitting(true);
    setCreateError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name, role, title, bio }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Gagal membuat akun admin.");
        setCreateSubmitting(false);
        return;
      }

      setCreateModalOpen(false);
      setUsername("");
      setPassword("");
      setName("");
      setBio("");
      loadAdmins();
      alert(data.message);
    } catch (err) {
      setCreateError("Terjadi kesalahan jaringan.");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openEditModal = (a: AdminUser) => {
    setTargetAdmin(a);
    setEditName(a.name);
    setEditRole(a.role);
    setEditTitle(a.title);
    setNewPassword("");
    setEditAlert(null);
    setEditModalOpen(true);
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAdmin) return;

    setEditSubmitting(true);
    setEditAlert(null);

    try {
      const res = await fetch(`/api/admin/users/${targetAdmin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          role: editRole,
          title: editTitle,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditAlert({ type: "error", text: data.error || "Gagal memperbarui data admin." });
        setEditSubmitting(false);
        return;
      }

      setEditAlert({ type: "success", text: data.message });
      loadAdmins();
      setNewPassword("");
    } catch (err) {
      setEditAlert({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Kelola Akun Tim & Hierarki
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Buat akun Brand Ambassador, ubah hierarki (Mind Captain / Co-Captain / BA), dan reset kata sandi manual.
          </p>
        </div>

        <button
          onClick={() => {
            setCreateError(null);
            setCreateModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Akun Tim Baru</span>
        </button>
      </div>

      {/* Admin List */}
      <div className="bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Memuat daftar admin...</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {admins.map((a) => (
              <div
                key={a.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  {a.photoUrl ? (
                    <img
                      src={a.photoUrl}
                      alt={a.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                      {a.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{a.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {a.title.replace("_", " ")}
                      </span>
                      {a.role === "SUPERADMIN" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          SUPERADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono">@{a.username}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {a._count?.karya || 0} Karya Publikasi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(a)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Ubah / Reset Password</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Create Admin */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-4xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Buat Akun Tim / BA Baru</h2>

            {createError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 text-rose-700 text-xs">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Username (Untuk Login)
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="misal: ba_rizky"
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Password Awal (Min 6 Karakter)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama display..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Title / Hierarki
                  </label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value as any)}
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="BA">Brand Ambassador</option>
                    <option value="CO_CAPTAIN">Co-Captain</option>
                    <option value="MIND_CAPTAIN">Mind Captain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Role Sistem
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPERADMIN">SUPERADMIN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Biografi Singkat (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Fokus minat atau safe space message..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {createSubmitting ? "Membuat..." : "Buat Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit / Reset Password (PRD 3.1) */}
      {editModalOpen && targetAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-4xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Kelola @{targetAdmin.username}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Ubah hierarki jabatan atau reset kata sandi manual.
            </p>

            {editAlert && (
              <div
                className={`mb-4 p-3 rounded-2xl text-xs flex items-center gap-2 ${
                  editAlert.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {editAlert.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{editAlert.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Title / Hierarki
                  </label>
                  <select
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value as any)}
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="BA">Brand Ambassador</option>
                    <option value="CO_CAPTAIN">Co-Captain</option>
                    <option value="MIND_CAPTAIN">Mind Captain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPERADMIN">SUPERADMIN</option>
                  </select>
                </div>
              </div>

              {/* Password Reset Input */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-rose-700 uppercase mb-1 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Reset Kata Sandi Manual</span>
                </label>
                <input
                  type="password"
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Isi jika ingin mereset password baru..."
                  className="w-full p-3 rounded-2xl border border-rose-200 bg-rose-50/30 text-xs text-slate-800 focus:ring-2 focus:ring-rose-400"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Mereset password akan otomatis memicu notifikasi in-app kepada akun ini.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {editSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
