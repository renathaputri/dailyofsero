"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, CheckCircle2, ShieldAlert, Sparkles, KeyRound, Calendar, Flame } from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data?.notifications) setNotifications(data.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "KARYA_TAKEDOWN":
        return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      case "PASSWORD_RESET":
        return <KeyRound className="w-5 h-5 text-amber-500" />;
      case "KARYA_PUBLISHED":
        return <Sparkles className="w-5 h-5 text-emerald-500" />;
      case "EVENT_PUBLISHED":
        return <Calendar className="w-5 h-5 text-indigo-500" />;
      case "STREAK_MILESTONE":
        return <Flame className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Notifikasi In-App
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Riwayat pemberitahuan aktivitas karya, event, dan akunmu.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Tandai Semua Dibaca</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Memuat notifikasi...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Belum ada notifikasi untukmu.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 flex items-start gap-4 transition-colors ${
                  n.isRead ? "bg-white" : "bg-sero-purple-50/40"
                }`}
              >
                <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex-shrink-0">
                  {getIcon(n.type)}
                </div>

                <div className="flex-grow space-y-1">
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[11px] text-slate-400 block">
                    {new Date(n.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                {!n.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-sero-purple-500 flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
