"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; devLink?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal memproses permintaan.");
        setLoading(false);
        return;
      }

      setResult({ message: data.message, devLink: data.resetLinkPreview });
      setLoading(false);
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-4xl shadow-xl">
        <div className="text-center mb-6 space-y-2">
          <div className="w-12 h-12 rounded-3xl bg-sero-purple-100 text-sero-purple-600 flex items-center justify-center mx-auto mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Lupa Kata Sandi?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Masukkan email terdaftarmu. Kami akan mengirimkan tautan untuk membuat kata sandi baru.
          </p>
        </div>

        {result ? (
          <div className="text-center space-y-4 py-2 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {result.message}
            </p>

            {result.devLink && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <span className="text-[11px] font-bold text-sero-purple-600 uppercase block mb-1">
                  Mode Pengujian / Reset Link Preview:
                </span>
                <a
                  href={result.devLink}
                  className="text-xs text-sero-blue-600 hover:underline break-all font-mono"
                >
                  {result.devLink}
                </a>
              </div>
            )}

            <div className="pt-4">
              <a
                href="/login"
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
              >
                Kembali ke Halaman Login
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs sm:text-sm animate-in fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Alamat Email Akunmu
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
                  placeholder="nama@domain.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sero-purple-400 text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-sero-purple-600 hover:bg-sero-purple-700 text-white font-bold text-sm shadow-md shadow-sero-purple-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <span>Mengirim Tautan...</span> : <span>Kirim Link Reset</span>}
            </button>

            <div className="pt-4 text-center">
              <a
                href="/login"
                className="text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                Sudah ingat password? Masuk
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
