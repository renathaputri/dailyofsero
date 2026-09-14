import React from "react";
import { FileText, Sparkles, ShieldAlert } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sero-purple-100 text-sero-purple-700 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-4 h-4" /> Ketentuan Layanan
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Syarat & Ketentuan Penggunaan
        </h1>
        <p className="text-sm text-slate-500">Terakhir diperbarui: 11 September 2026</p>
      </div>

      <div className="p-8 sm:p-10 rounded-4xl bg-white border border-slate-200/90 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Definisi Layanan</h2>
          <p>
            MindSpace adalah platform berbasis komunitas yang dikembangkan oleh Tim Serotonin Batch 5. Layanan mencakup galeri edukasi karya Brand Ambassador, fitur healing/journaling mandiri, dan integrasi informasi ke layanan konseling resmi AwareMind.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" /> 2. Batasan Layanan Medis Darurat
          </h2>
          <p>
            Fitur-fitur di MindSpace (termasuk pelacak mood, latihan pernapasan, dan jurnal) dirancang sebagai alat bantu self-care, <strong>bukan pengganti diagnosa klinis, terapi medis, atau penanganan darurat kejiwaan</strong>.
          </p>
          <p>
            Jika kamu mengalami krisis kejiwaan akut atau memiliki kecenderungan melukai diri, segera gunakan tombol bantuan darurat yang tersedia untuk menghubungi hotline AwareMind atau layanan darurat kesehatan 119 ext 8.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Hak Cipta Karya Komunitas</h2>
          <p>
            Seluruh konten yang dipublikasikan di Galeri Karya adalah karya intelektual dari Brand Ambassador Tim Serotonin yang terhubung ke Instagram resmi. Dilarang menggandakan atau mendistribusikan karya tanpa mencantumkan kredit pembuat asli.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Penutupan Akun</h2>
          <p>
            Pengguna bebas menghapus akunnya sewaktu-waktu. Seluruh data yang terkait akan langsung dimusnahkan secara permanen.
          </p>
        </section>
      </div>
    </div>
  );
}
