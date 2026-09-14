"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"USER" | "ADMIN">("USER");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginType: tab,
          identifier,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal, silakan periksa kembali data kamu.");
        setLoading(false);
        return;
      }

      // Success
      window.location.href = data.redirect || "/";
    } catch (err) {
      setError("Terjadi kendala jaringan saat menghubungi server.");
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
            Selamat Datang Kembali
          </h1>
          <p className="text-sm text-slate-500">
            Masuk ke safe space kamu untuk melanjutkan refleksi hari ini.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-4xl p-6 sm:p-8 shadow-xl">
          {/* Dual Login Tabs (PRD 3.1) */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setTab("USER");
                setError(null);
              }}
              className={`py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                tab === "USER"
                  ? "bg-white text-sero-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Pengunjung (User)
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("ADMIN");
                setError(null);
              }}
              className={`py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                tab === "ADMIN"
                  ? "bg-white text-sero-purple-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Tim BA & Admin
            </button>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs sm:text-sm leading-relaxed animate-in fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {tab === "USER" ? "Email atau Username" : "Username Admin / BA"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  {tab === "USER" ? <Mail className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={tab === "USER" ? "email atau username kamu" : "username_kamu"}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sero-purple-400 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Kata Sandi
                </label>
                {tab === "USER" && (
                  <a
                    href="/forgot-password"
                    className="text-xs font-medium text-sero-purple-600 hover:text-sero-purple-700 hover:underline"
                  >
                    Lupa password?
                  </a>
                )}
              </div>
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
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sero-purple-400 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-2xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-6 ${
                tab === "USER"
                  ? "bg-gradient-to-r from-sero-blue-500 to-sero-blue-600 hover:from-sero-blue-600 hover:to-sero-blue-700 shadow-sero-blue-300/50"
                  : "bg-gradient-to-r from-sero-purple-500 to-sero-purple-600 hover:from-sero-purple-600 hover:to-sero-purple-700 shadow-sero-purple-300/50"
              } ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.01]"}`}
            >
              {loading ? (
                <span>Sedang Masuk...</span>
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {tab === "USER" && (
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs sm:text-sm text-slate-500">
                Belum punya akun?{" "}
                <a
                  href="/register"
                  className="font-bold text-sero-blue-600 hover:text-sero-blue-700 hover:underline"
                >
                  Daftar sekarang
                </a>
              </p>
            </div>
          )}

          {tab === "ADMIN" && (
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 leading-relaxed">
                Akun Brand Ambassador & Mind Captain dibuat langsung oleh Superadmin. Lupa kata sandi? Hubungi Superadmin untuk reset manual.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
