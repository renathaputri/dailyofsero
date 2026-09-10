"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Sparkles, AlertCircle, CheckCircle2, Image as ImageIcon } from "lucide-react";

export default function AdminPortfolioPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusAlert, setStatusAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setAdmin(data.user);
          setName(data.user.name || "");
          setBio(data.user.bio || "");
          setPhotoUrl(data.user.photoUrl || "");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusAlert(null);

    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, photoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusAlert({ type: "error", text: data.error || "Gagal memperbarui profil." });
        setSaving(false);
        return;
      }

      setStatusAlert({ type: "success", text: "Mini portfolio berhasil diperbarui! ✨" });
      setSaving(false);
    } catch (err) {
      setStatusAlert({ type: "error", text: "Terjadi kesalahan jaringan." });
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Memuat data portfolio...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Edit Mini Portfolio Saya
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Informasi ini akan ditampilkan pada kartu profilmu di halaman Our Team.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-4xl bg-white border border-slate-200 shadow-sm">
        {statusAlert && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-2.5 ${
              statusAlert.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {statusAlert.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{statusAlert.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Preview */}
          <div className="flex items-center gap-4">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={name}
                className="w-20 h-20 rounded-3xl object-cover border-2 border-slate-200 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-sero-purple-100 text-sero-purple-600 font-bold text-2xl flex items-center justify-center">
                {name?.charAt(0) || "A"}
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-slate-800">Preview Foto</p>
              <p className="text-[11px] text-slate-400">
                Gunakan URL foto beresolusi persegi untuk hasil terbaik
              </p>
            </div>
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
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-sero-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nama Lengkap & Gelar (Display Name)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-sero-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Title / Hierarki Tim
            </label>
            <input
              type="text"
              disabled
              value={admin?.title?.replace("_", " ")}
              className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-100 text-xs text-slate-500 cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Hierarki dan title hanya dapat diubah oleh Superadmin.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Biografi Singkat
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ceritakan sedikit tentang dirimu dan fokus karya kesehatan mentalmu..."
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-sero-purple-400"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-sero-purple-600 hover:bg-sero-purple-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? "Menyimpan Perubahan..." : "Simpan Mini Portfolio ✨"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
