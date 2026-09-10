"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X, Heart, Shield, LogOut, User as UserIcon, Calendar, Compass, Users } from "lucide-react";

interface SessionUser {
  id: string;
  type: "USER" | "ADMIN";
  email?: string;
  username?: string;
  role?: "ADMIN" | "SUPERADMIN";
  name?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/karya", label: "Galeri Karya" },
    { href: "/healing", label: "Healing Corner" },
    { href: "/event", label: "Event" },
    { href: "/team", label: "Our Team" },
    { href: "/awaremind", label: "AwareMind" },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sero-blue-400 to-sero-purple-500 flex items-center justify-center shadow-md shadow-sero-blue-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sero-blue-600 to-sero-purple-600 bg-clip-text text-transparent">
                GrowthWithSero
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-sero-purple-100 text-sero-purple-600">
                Serotonin ✨
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 bg-white/70 px-4 py-2 rounded-full border border-slate-200/80 shadow-sm backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-sero-blue-400 to-sero-purple-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-sero-purple-600 hover:bg-sero-purple-50/60"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {loading ? (
              <div className="w-24 h-9 bg-slate-100 rounded-full animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                {user.type === "ADMIN" ? (
                  <a
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sero-purple-500 to-sero-purple-600 hover:from-sero-purple-600 hover:to-sero-purple-700 text-white text-xs lg:text-sm font-semibold rounded-full shadow-sm transition-all"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Panel Admin</span>
                  </a>
                ) : (
                  <a
                    href="/profile"
                    className="flex items-center gap-1.5 px-4 py-2 bg-sero-blue-50 text-sero-blue-700 hover:bg-sero-blue-100 border border-sero-blue-200 text-xs lg:text-sm font-semibold rounded-full transition-all"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Akun Saya</span>
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <a
                  href="/login"
                  className="px-4 py-2 text-xs lg:text-sm font-semibold text-slate-600 hover:text-sero-blue-600 rounded-full transition-colors"
                >
                  Masuk
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-sero-blue-400 to-sero-purple-500 hover:from-sero-blue-500 hover:to-sero-purple-600 text-white text-xs lg:text-sm font-semibold rounded-full shadow-md shadow-sero-blue-200/50 hover:shadow-sero-purple-300 transition-all hover:scale-[1.02]"
                >
                  Daftar ✨
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-2xl text-sm font-medium ${
                  pathname === link.href
                    ? "bg-sero-purple-50 text-sero-purple-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                {user.type === "ADMIN" ? (
                  <a
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 bg-sero-purple-600 text-white font-medium text-center rounded-2xl"
                  >
                    Buka Panel Admin
                  </a>
                ) : (
                  <a
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 bg-sero-blue-50 text-sero-blue-700 font-medium text-center rounded-2xl"
                  >
                    Profil Saya
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 text-rose-600 font-medium text-center rounded-2xl hover:bg-rose-50"
                >
                  Keluar
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 border border-slate-200 text-slate-700 font-medium text-center rounded-2xl"
                >
                  Masuk
                </a>
                <a
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 bg-gradient-to-r from-sero-blue-400 to-sero-purple-500 text-white font-medium text-center rounded-2xl shadow-sm"
                >
                  Daftar ✨
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
