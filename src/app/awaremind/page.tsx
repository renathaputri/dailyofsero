"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, ExternalLink, HeartHandshake, PhoneCall, Sparkles, CheckCircle2, UserCheck, User } from "lucide-react";

interface Counselor {
  id: string;
  name: string;
  photoUrl?: string;
}

export default function AwareMindPage() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);

  const officialUrl = process.env.NEXT_PUBLIC_AWAREMIND_URL || "https://awaremind.id";
  const emergencyUrl = process.env.NEXT_PUBLIC_AWAREMIND_EMERGENCY_URL || "https://awaremind.id/darurat";

  useEffect(() => {
    fetch("/api/counselors")
      .then((res) => res.json())
      .then((data) => {
        if (data?.counselors) setCounselors(data.counselors);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4" /> Kolaborasi & Konseling Resmi
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Layanan Konseling AwareMind
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          MindSpace bermitra resmi dengan <strong>AwareMind</strong> untuk menghubungkanmu dengan psikolog dan konselor profesional berlisensi.
        </p>
      </div>

      {/* Official Link Banner & Disclaimer (PRD 3.4) */}
      <div className="p-6 sm:p-8 rounded-4xl bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-xl mb-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-200 block">
            Akses Platform Konseling Resmi
          </span>
          <h2 className="text-xl sm:text-2xl font-black">
            Siap untuk Berkonsultasi dengan Psikolog?
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl leading-relaxed">
            Seluruh proses penjadwalan dan sesi konseling dilakukan melalui platform resmi AwareMind secara aman dan terenkripsi.
          </p>
        </div>

        <div className="flex-shrink-0 relative z-10 flex flex-col sm:flex-row gap-3">
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Kunjungi Website Resmi</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href={emergencyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full bg-rose-700/80 hover:bg-rose-700 text-white border border-rose-400/40 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Kontak Darurat</span>
          </a>
        </div>
      </div>

      {/* Counselors Showcase Grid (PRD 3.4 dummy profile showcase) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-rose-500" />
            Daftar Konselor & Psikolog Mitra
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            (Pemesanan sesi melalui tautan AwareMind)
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : counselors.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-sm text-slate-500">
            Belum ada data konselor yang ditambahkan oleh Superadmin.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {counselors.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-center"
              >
                <div>
                  <div className="relative w-28 h-28 mx-auto mb-4">
                    {c.photoUrl ? (
                      <img
                        src={c.photoUrl}
                        alt={c.name}
                        className="w-full h-full rounded-2xl object-cover border-2 border-slate-100 shadow-md"
                      />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {c.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mb-4">
                    Psikolog Berlisensi • Mitra AwareMind
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Book / Hubungi Sesi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-[10px] text-slate-400">
                    Redirect ke awaremind.id
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
