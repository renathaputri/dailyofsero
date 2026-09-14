"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  Menu, 
  X, 
  Heart, 
  Shield, 
  LogOut, 
  User as UserIcon, 
  Calendar, 
  Users, 
  BookOpen, 
  ShieldAlert, 
  Home, 
  LogIn, 
  UserPlus,
  Compass,
  ArrowRight
} from "lucide-react";

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

  // Public nav links (Healing Corner is hidden until logged in per requirement)
  const publicNavLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/karya", label: "Galeri Karya", icon: BookOpen },
    { href: "/event", label: "Event", icon: Calendar },
    { href: "/team", label: "Serotonin 5", icon: Users },
    { href: "/awaremind", label: "AwareMind", icon: ShieldAlert },
  ];

  // If user is logged in, append Healing Corner
  const activeNavLinks = user 
    ? [
        { href: "/", label: "Beranda", icon: Home },
        { href: "/healing", label: "Healing Corner", icon: Heart, isSpecial: true },
        { href: "/karya", label: "Galeri Karya", icon: BookOpen },
        { href: "/event", label: "Event", icon: Calendar },
        { href: "/team", label: "Serotonin 5", icon: Users },
        { href: "/awaremind", label: "AwareMind", icon: ShieldAlert },
      ]
    : publicNavLinks;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand Logo - Plain Text Only */}
          <a href="/" className="flex items-center focus:outline-none group">
            <span className="font-black text-2xl tracking-tight text-purple-700 group-hover:text-purple-800 transition-colors">
              MindSpace
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 shadow-xs">
            {activeNavLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-sero-purple-700 shadow-sm"
                      : link.isSpecial
                      ? "text-sero-purple-700 font-bold hover:bg-sero-purple-100/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-sero-purple-600" : "opacity-70"}`} />
                  <span>{link.label}</span>
                  {link.isSpecial && (
                    <span className="w-2 h-2 rounded-full bg-sero-purple-500 animate-pulse ml-0.5" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Actions (Auth & User Status) */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-24 h-9 bg-slate-100 rounded-full animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                {user.type === "ADMIN" ? (
                  <a
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sero-purple-600 to-indigo-600 hover:from-sero-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-full shadow-sm transition-all"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Panel Admin</span>
                  </a>
                ) : (
                  <a
                    href="/healing"
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-sero-purple-50 text-sero-purple-700 hover:bg-sero-purple-100 border border-sero-purple-200 text-xs font-bold rounded-full transition-all"
                  >
                    <Heart className="w-4 h-4 text-sero-purple-600" />
                    <span>Healing Corner</span>
                  </a>
                )}

                <a
                  href="/profile"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-full transition-all"
                  title="Lihat Profil"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>{user.name || user.username || "Akun"}</span>
                </a>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                  title="Keluar dari akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 hover:text-sero-purple-700 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </a>
                <a
                  href="/register"
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sero-purple-600 to-indigo-600 hover:from-sero-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-full shadow-md shadow-sero-purple-300/30 transition-all hover:scale-[1.02]"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftar Akun</span>
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {activeNavLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-sero-purple-50 text-sero-purple-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-sero-purple-600" />
                    <span>{link.label}</span>
                  </div>
                  {link.isSpecial && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sero-purple-100 text-sero-purple-700">
                      Member Area
                    </span>
                  )}
                </a>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                {user.type === "ADMIN" ? (
                  <a
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 bg-sero-purple-600 text-white font-bold text-center rounded-xl flex items-center justify-center gap-2 text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Buka Panel Admin</span>
                  </a>
                ) : (
                  <a
                    href="/healing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 bg-sero-purple-50 text-sero-purple-700 border border-sero-purple-200 font-bold text-center rounded-xl flex items-center justify-center gap-2 text-sm"
                  >
                    <Heart className="w-4 h-4 text-sero-purple-600" />
                    <span>Akses Healing Corner</span>
                  </a>
                )}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <a
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 bg-slate-100 text-slate-700 font-semibold text-center rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Profil Saya</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="py-2.5 px-3 text-rose-600 bg-rose-50 font-semibold text-center rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 border border-slate-200 text-slate-700 font-bold text-center rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk</span>
                </a>
                <a
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 bg-gradient-to-r from-sero-purple-600 to-indigo-600 text-white font-bold text-center rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar Akun</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
