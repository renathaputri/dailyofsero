"use client";

import React, { useState } from "react";
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, User } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError("Kamu perlu mencentang persetujuan Kebijakan Privasi & Ketentuan Layanan ya.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, consent }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal membuat akun.");
        setLoading(false);
        return;
      }

      // Auto-login success — redirect to healing
      window.location.href = data.redirect || "/healing";
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-3xl bg-gradient-to-tr from-sero-blue-400 to-sero-purple-500 shadow-md shadow-sero-blue-200 text-white mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Mulai Perjalananmu
          </h1>
          <p className="text-sm text-slate-500">
            Daftar akun gratis untuk mulai menulis jurnal terenkripsi dan merawat kesehatan mentalmu.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-4xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs sm:text-sm leading-relaxed animate-in fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={20}
                  pattern="^[a-zA-Z0-9_]+$"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="nama_kamu"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sero-blue-400 focus:border-transparent text-sm transition-all"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                3-20 karakter. Hanya huruf, angka, dan underscore (_).
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kamu@domain.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sero-blue-400 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sero-blue-400 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-sero-blue-500 focus:ring-sero-blue-400"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  Saya menyetujui{" "}
                  <a href="/privacy" target="_blank" className="text-sero-purple-600 font-semibold hover:underline">
                    Kebijakan Privasi
                  </a>{" "}
                  dan{" "}
                  <a href="/terms" target="_blank" className="text-sero-purple-600 font-semibold hover:underline">
                    Ketentuan Layanan
                  </a>
                  , serta memahami bahwa jurnal pribadi saya disimpan dengan enkripsi aman.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sero-blue-500 via-sero-blue-600 to-sero-purple-500 hover:from-sero-blue-600 hover:to-sero-purple-600 text-white font-bold text-sm shadow-md shadow-sero-blue-300/40 transition-all flex items-center justify-center gap-2 mt-6 ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.01]"
              }`}
            >
              {loading ? (
                <span>Mendaftarkan Akun...</span>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs sm:text-sm text-slate-500">
                Sudah punya akun?{" "}
                <a
                  href="/login"
                  className="font-bold text-sero-purple-600 hover:text-sero-purple-700 hover:underline"
                >
                  Masuk di sini
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
