"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2, Sparkles, ArrowRight } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setSuccess(false);
      setMessage("Token verifikasi tidak ditemukan dalam URL.");
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        setLoading(false);
        if (ok) {
          setSuccess(true);
          setMessage(data.message || "Email kamu berhasil diverifikasi!");
        } else {
          setSuccess(false);
          setMessage(data.error || "Gagal memverifikasi email.");
        }
      })
      .catch(() => {
        setLoading(false);
        setSuccess(false);
        setMessage("Terjadi kendala jaringan saat menghubungi server.");
      });
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-4xl shadow-xl text-center">
        {loading ? (
          <div className="py-12 space-y-4">
            <Loader2 className="w-12 h-12 text-sero-blue-500 animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-600">Sedang memverifikasi email kamu...</p>
          </div>
        ) : success ? (
          <div className="space-y-5 py-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Email Berhasil Diverifikasi!
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
            <div className="pt-4">
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-sero-blue-500 to-sero-purple-500 text-white font-bold text-sm shadow-md hover:scale-[1.02] transition-all"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Verifikasi Gagal
            </h1>
            <p className="text-sm text-rose-600 leading-relaxed">{message}</p>
            <div className="pt-4">
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
              >
                Kembali ke Login
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-sero-blue-500" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
