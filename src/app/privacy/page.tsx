import React from "react";
import { ShieldCheck, Lock, Trash2, Heart } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Keamanan Data Sensitif
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Kebijakan Privasi GrowthWithSero
        </h1>
        <p className="text-sm text-slate-500">Terakhir diperbarui: 11 September 2026</p>
      </div>

      <div className="p-8 sm:p-10 rounded-4xl bg-white border border-slate-200/90 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" /> Komitmen Ruang Aman Kami
          </h2>
          <p>
            GrowthWithSero (dibangun oleh Tim Serotonin) menjunjung tinggi privasi setiap individu. Kami menyadari bahwa kesehatan mental dan catatan perasaan merupakan data yang sangat pribadi dan sensitif.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" /> Enkripsi Jurnal Pribadi (AES-256)
          </h2>
          <p>
            Setiap catatan yang kamu tulis di <strong>Self-Journal</strong> langsung dienkripsi di lapisan server menggunakan algoritma <strong>AES-256-GCM</strong> sebelum disimpan ke basis data kami. Kunci enkripsi unik ini memastikan bahwa:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Catatan jurnal kamu hanya dapat dibaca oleh kamu sendiri saat berhasil login.</li>
            <li>Bahkan Superadmin maupun pengelola database <strong>tidak memiliki akses</strong> untuk membaca isi jurnal pribadimu.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-600" /> Hak Penghapusan Akun Total (Zero Retention)
          </h2>
          <p>
            Kamu memiliki kendali penuh atas datamu. Jika kamu memutuskan untuk menghapus akun melalui menu Profil:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Sistem akan melakukan <strong>hard delete</strong> instan terhadap akun, seluruh isi jurnal terenkripsi, bookmark kalimat penenang, dan streak aktivitasmu.</li>
            <li>Kami tidak menyimpan cadangan (retention data), tidak menjual data, dan tidak menggunakan jurnal pribadimu untuk analitik pihak ketiga.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Data Pengunjung Minimalis</h2>
          <p>
            Kami hanya mengumpulkan email dan kata sandi ter-hash (menggunakan bcrypt) untuk kebutuhan autentikasi. Kami tidak meminta foto profil, nama asli, nomor telepon, maupun informasi pribadi lainnya dari pengunjung reguler.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Hubungi Kami</h2>
          <p>
            Pertanyaan seputar kebijakan privasi dan keamanan data dapat kamu sampaikan langsung kepada tim kami melalui Mind Captain Tim Serotonin di platform resmi GrowthWithSero.
          </p>
        </section>
      </div>
    </div>
  );
}
