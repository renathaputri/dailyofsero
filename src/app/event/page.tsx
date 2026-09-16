"use client";

import React, { useState, useEffect } from "react";
import { Calendar, ExternalLink, Sparkles, Clock, CheckCircle2 } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  formLink: string;
  status: "UPCOMING" | "PAST";
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filter, setFilter] = useState<"ALL" | "UPCOMING" | "PAST">("UPCOMING");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (data?.events) setEvents(data.events);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter((e) => {
    if (filter === "ALL") return true;
    return e.status === filter;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sero-blue-100 text-sero-blue-700 text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" /> Ruang Belajar & Temu
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Event & Workshop Serotonin
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Ikuti sesi diskusi interaktif, webinar kesehatan mental, dan workshop journaling bersama tim psikolog dan narasumber inspiratif.
        </p>
      </div>

      {/* Filter Tabs (Akan Datang vs Selesai) */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <button
          onClick={() => setFilter("UPCOMING")}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${filter === "UPCOMING"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
        >
          Akan Datang
        </button>
        <button
          onClick={() => setFilter("PAST")}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${filter === "PAST"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
        >
          Sudah Selesai
        </button>
        <button
          onClick={() => setFilter("ALL")}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${filter === "ALL"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
        >
          Semua Event
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white/70 border border-slate-200 text-center max-w-md mx-auto">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
          <h3 className="font-bold text-slate-800 text-sm">Tidak Ada Event</h3>
          <p className="text-xs text-slate-500 mt-1">
            Belum ada jadwal event untuk kategori ini. Nantikan pengumuman selanjutnya ya!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => {
            const isUpcoming = evt.status === "UPCOMING";
            const dateFormatted = new Date(evt.eventDate).toLocaleDateString("id-ID", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={evt.id}
                className="p-5 sm:p-5.5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${isUpcoming
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                    >
                      {isUpcoming ? "Akan Datang" : "Selesai"}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 whitespace-nowrap">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {dateFormatted}
                    </span>
                  </div>

                  <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-purple-700 transition-colors line-clamp-2">
                    {evt.title}
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-auto">
                  {isUpcoming ? (
                    <a
                      href={evt.formLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 group"
                    >
                      <span>Daftar via Google Form</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ) : (
                    <div className="w-full py-2 px-4 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs text-center">
                      Event Ini Telah Selesai
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
