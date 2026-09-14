"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, UserCheck, Database, Calendar, Users, Bell, Shield, LogOut, ArrowLeft, User } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.user || data.user.type !== "ADMIN") {
          window.location.href = "/login";
        } else {
          setAdmin(data.user);
        }
      })
      .catch(() => {
        window.location.href = "/login";
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sero-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isSuperadmin = admin?.role === "SUPERADMIN";

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/karya", label: "Karya Saya", icon: BookOpen },
    { href: "/admin/portfolio", label: "Mini Portfolio Saya", icon: UserCheck },
    { href: "/admin/content-bank", label: "Content Bank", icon: Database },
    { href: "/admin/notifications", label: "Notifikasi In-App", icon: Bell },
  ];

  const superadminNavItems = [
    { href: "/admin/events", label: "Kelola Event", icon: Calendar },
    { href: "/admin/counselors", label: "Konselor AwareMind", icon: Shield },
    { href: "/admin/users", label: "Akun Tim & Password", icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="p-6 rounded-4xl bg-white border border-slate-200/90 shadow-sm sticky top-24 space-y-6">
            {/* Admin Badge */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              {admin?.photoUrl ? (
                <img
                  src={admin.photoUrl}
                  alt={admin.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-slate-900 truncate">{admin?.name}</p>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-sero-purple-100 text-sero-purple-700">
                  {admin?.role === "SUPERADMIN" ? "Superadmin" : admin?.title?.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* General Navigation */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-3 mb-1">
                Menu Utama
              </span>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-sero-purple-500 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Superadmin Exclusive Navigation */}
            {isSuperadmin && (
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block px-3 mb-1">
                  Kontrol Superadmin
                </span>
                {superadminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="/"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Lihat Website Publik</span>
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
}
