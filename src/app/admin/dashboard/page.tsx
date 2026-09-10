"use client";

import React, { useState, useEffect } from "react";
import { Users, BookOpen, Calendar, Database, Sparkles, Bell, ArrowRight, ShieldCheck, PlusCircle } from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-4xl bg-white animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-3xl bg-white animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const isSuperadmin = data?.isSuperadmin;
  const stats = data?.stats;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-4xl bg-gradient-to-r from-sero-purple-500 to-sero-blue-500 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sero-purple-100">
            {isSuperadmin ? "👑 Superadmin Control Center" : "🌱 Brand Ambassador Space"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            {isSuperadmin ? "Ringkasan Statistik Komunitas" : "Selamat Datang di Portal BA! ✨"}
          </h1>
          <p className="text-xs sm:text-sm text-sero-purple-50 max-w-xl leading-relaxed">
            {isSuperadmin
              ? "Pantau pertumbuhan user terdaftar, karya publikasi, event, dan kesehatan ekosistem GrowthWithSero."
              : "Kelola karya edukasi Instagram kamu, lengkapi mini portfolio, dan perkaya Content Bank untuk pengunjung."}
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      {isSuperadmin && stats ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Stat 1: Users */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase">User Terdaftar</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{stats.users.verified}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                +{stats.users.unverified} akun menunggu verifikasi email
              </p>
            </div>

            {/* Stat 2: Admin Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Tim Admin & BA</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{stats.admins.total}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                {stats.admins.mindCaptains} Captain • {stats.admins.coCaptains} Co-Captain • {stats.admins.ba} BA
              </p>
            </div>

            {/* Stat 3: Published Karya */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Karya Published</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{stats.karya.published}</p>
              <p className="text-[11px] text-slate-400 mt-1">Tayang di Galeri Komunitas</p>
            </div>

            {/* Stat 4: Events */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Event & Workshop</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{stats.events.total}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                {stats.events.upcoming} Upcoming • {stats.events.past} Selesai
              </p>
            </div>

            {/* Stat 5: Content Bank */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Content Bank</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{stats.contentBank.total}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                {stats.contentBank.calming} Kalimat Penenang • {stats.contentBank.prompts} Guided Prompts
              </p>
            </div>

            {/* Stat 6: Notifications */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Notifikasi Kamu</span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{data.unreadNotifications || 0}</p>
              <p className="text-[11px] text-slate-400 mt-1">Pemberitahuan belum dibaca</p>
            </div>
          </div>

          {/* Recent Activity (PRD 3.10) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Karya */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">5 Karya Terbaru</h3>
                <a href="/admin/karya" className="text-xs text-sero-purple-600 font-bold hover:underline">
                  Kelola Semua →
                </a>
              </div>
              <div className="space-y-3">
                {data.recentKarya?.map((k: any) => (
                  <div key={k.id} className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between text-xs">
                    <div className="overflow-hidden pr-2">
                      <p className="font-bold text-slate-800 truncate">{k.title}</p>
                      <p className="text-slate-400 text-[10px]">Oleh {k.owner?.name}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 whitespace-nowrap">
                      {k.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Users */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">5 User Terbaru Terdaftar</h3>
                <span className="text-xs text-slate-400">Pengunjung</span>
              </div>
              <div className="space-y-3">
                {data.recentUsers?.map((u: any) => (
                  <div key={u.id} className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate">{u.email}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        u.isVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {u.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* BA View */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-8 rounded-4xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sero-purple-100 text-sero-purple-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Karya Milikmu</h3>
              <p className="text-xs text-slate-500 mt-1">
                Kamu telah mempublikasikan <strong>{data.myKaryaCount || 0} karya</strong> di galeri komunitas.
              </p>
            </div>
            <a
              href="/admin/karya"
              className="inline-flex items-center gap-2 text-xs font-bold text-sero-purple-600 hover:underline"
            >
              Upload Karya Baru Sekarang →
            </a>
          </div>

          <div className="p-8 rounded-4xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sero-blue-100 text-sero-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Mini Portfolio</h3>
              <p className="text-xs text-slate-500 mt-1">
                Perbarui foto profil, nama tampilan, dan biografi untuk tampil di halaman Our Team.
              </p>
            </div>
            <a
              href="/admin/portfolio"
              className="inline-flex items-center gap-2 text-xs font-bold text-sero-blue-600 hover:underline"
            >
              Edit Profil Portfolio →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
