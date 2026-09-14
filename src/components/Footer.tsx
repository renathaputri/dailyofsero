import React from "react";
import { Sparkles, Heart, ShieldAlert, Instagram } from "lucide-react";

export default function Footer() {
  const awaremindUrl = process.env.NEXT_PUBLIC_AWAREMIND_URL || "https://awaremind.id";

  return (
    <footer className="bg-white/80 border-t border-slate-200/80 pt-14 pb-12 mt-20 relative overflow-hidden">
      {/* Decorative gradient blob in footer */}
      <div className="blob-shape bg-sero-purple-200/40 w-96 h-96 -bottom-32 -left-32" />
      <div className="blob-shape bg-sero-blue-200/40 w-96 h-96 -bottom-32 -right-32" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-purple-600 tracking-tight">
                MindSpace
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Ruang bertumbuh dan berefleksi yang aman untukmu. Dikembangkan dengan cinta dan kepedulian oleh <strong>Tim Serotonin Batch 5</strong> sebagai safe space kesehatan mental generasi muda.
            </p>
            <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
              <span>Dibuat dengan dedikasi oleh Tim Serotonin Batch 5</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3">Eksplorasi</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="/karya" className="hover:text-sero-purple-600 transition-colors">
                  Galeri Karya BA
                </a>
              </li>
              <li>
                <a href="/healing" className="hover:text-sero-purple-600 transition-colors">
                  Healing Corner (Member)
                </a>
              </li>
              <li>
                <a href="/event" className="hover:text-sero-purple-600 transition-colors">
                  Event & Workshop
                </a>
              </li>
              <li>
                <a href="/team" className="hover:text-sero-purple-600 transition-colors">
                  Serotonin 5
                </a>
              </li>
              <li>
                <a href="/awaremind" className="hover:text-sero-purple-600 transition-colors">
                  Konseling AwareMind
                </a>
              </li>
            </ul>
          </div>

          {/* Safety & Legal */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3">Privasi & Keamanan</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="/privacy" className="hover:text-sero-purple-600 transition-colors">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-sero-purple-600 transition-colors">
                  Ketentuan Layanan
                </a>
              </li>
              <li>
                <a
                  href={awaremindUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-600 font-medium transition-colors flex items-center gap-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  Website AwareMind Resmi
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-slate-800 text-xs text-slate-400 block pt-2">
                  Portal Masuk Akun
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 MindSpace oleh Tim Serotonin Batch 5. Hak Cipta Dilindungi.</p>
          <p className="text-center sm:text-right">
            Jurnal pribadimu terenkripsi end-to-end (AES-256) dan tidak dapat diakses siapapun.
          </p>
        </div>
      </div>
    </footer>
  );
}
