"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Shield, Trash2, AlertTriangle, CheckCircle2, Lock, Flame, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Delete account modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          window.location.href = "/login";
        }
      })
      .catch(() => {
        window.location.href = "/login";
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);
    setDeleteLoading(true);

    try {
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Gagal menghapus akun.");
        setDeleteLoading(false);
        return;
      }

      alert("Akun dan seluruh data jurnalmu telah dihapus secara permanen.");
      window.location.href = "/";
    } catch (err) {
      setDeleteError("Terjadi kendala jaringan.");
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse mx-auto mb-4" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Akun Saya</h1>
        <p className="text-sm text-slate-500">Kelola akun dan preferensi privasi kamu</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-4xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sero-blue-400 to-sero-purple-500 text-white font-bold text-2xl flex items-center justify-center shadow-md">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sero-blue-100 text-sero-blue-700">
                Pengunjung Terverifikasi
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{user?.email}</h2>
              <p className="text-xs text-slate-400">
                Data profil minimal untuk menjaga privasi identitasmu
              </p>
            </div>
          </div>

          {/* Streak summary */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {user?.streak?.currentStreak || 0} Hari Streak Journaling
                </p>
                <p className="text-[11px] text-slate-500">
                  Rekor terpanjang: {user?.streak?.longestStreak || 0} hari
                </p>
              </div>
            </div>
            <a
              href="/healing"
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              Buka Healing Corner →
            </a>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href="/healing"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold text-center hover:bg-slate-800 transition-all"
            >
              Tulis Jurnal Hari Ini
            </a>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </div>

        {/* Danger Zone: Delete Account (PRD 3.9) */}
        <div className="p-6 sm:p-8 rounded-4xl bg-rose-50/50 border border-rose-200/80 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-rose-900">
                Hapus Akun Permanen (Zero Retention)
              </h3>
              <p className="text-xs text-rose-700 leading-relaxed mt-1">
                Sesuai komitmen privasi kami, menghapus akun akan menghapus seluruh data secara <strong>hard delete</strong> dari database (termasuk seluruh isi jurnal terenkripsi, bookmark kalimat penenang, streak, dan histori akun). Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Akun Saya</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-4xl shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-rose-900 mb-2">Konfirmasi Hapus Akun</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Seluruh catatan jurnal pribadimu akan dimusnahkan secara permanen. Masukkan kata sandimu untuk konfirmasi:
            </p>

            {deleteError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <input
                  type="password"
                  required
                  placeholder="Masukkan kata sandimu"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setDeletePassword("");
                    setDeleteError(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={deleteLoading || !deletePassword}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50"
                >
                  {deleteLoading ? "Menghapus..." : "Ya, Hapus Total"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
