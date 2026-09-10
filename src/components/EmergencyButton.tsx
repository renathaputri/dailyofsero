"use client";

import React, { useState } from "react";
import { PhoneCall, ShieldAlert, X, ExternalLink, HeartHandshake } from "lucide-react";

export default function EmergencyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const emergencyUrl = process.env.NEXT_PUBLIC_AWAREMIND_EMERGENCY_URL || "https://awaremind.id/darurat";

  return (
    <aside aria-label="Akses Darurat AwareMind" className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Expanded Emergency Card Modal */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 p-5 rounded-3xl bg-white shadow-2xl border-2 border-rose-200 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span className="font-bold text-base text-rose-700">Akses Bantuan Darurat</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Tutup panel bantuan darurat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
            Jika kamu atau orang di sekitarmu sedang mengalami krisis emosional hebat atau butuh pertolongan segera, kamu tidak sendirian. Bantuan profesional tersedia:
          </p>

          <div className="space-y-2">
            <a
              href={emergencyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium rounded-2xl shadow-md transition-all text-sm group"
            >
              <div className="flex items-center gap-2.5">
                <HeartHandshake className="w-5 h-5" />
                <span>Hotline Resmi AwareMind</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100 flex items-center justify-between text-xs text-rose-800">
              <span className="font-medium">Layanan Darurat Indonesia (Kemenkes)</span>
              <a href="tel:119" className="font-bold text-rose-700 underline flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5" /> 119 ext 8
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 sm:px-5 py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-rose-400/50 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-rose-200"
        title="Butuh bantuan darurat? Klik di sini"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <ShieldAlert className="w-5 h-5" />
        <span className="font-semibold text-xs sm:text-sm tracking-wide">
          Bantuan Darurat 24/7
        </span>
      </button>
    </aside>
  );
}
