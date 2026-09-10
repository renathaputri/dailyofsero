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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

      {/* Filter Tabs (Upcoming vs Past) */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <button
          onClick={() => setFilter("UPCOMING")}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
            filter === "UPCOMING"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Akan Datang (Upcoming)
        </button>
        <button
          onClick={() => setFilter("PAST")}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
            filter === "PAST"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Telah Selesai (Past)
        </button>
        <button
          onClick={() => setFilter("ALL")}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
            filter === "ALL"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Semua Event
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-56 rounded-4xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 rounded-4xl bg-white/70 border border-slate-200 text-center max-w-md mx-auto">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">Tidak Ada Event</h3>
          <p className="text-xs text-slate-500 mt-1">
            Belum ada jadwal event untuk kategori ini. Nantikan pengumuman selanjutnya ya!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((evt) => {
            const isUpcoming = evt.status === "UPCOMING";
            const dateFormatted = new Date(evt.eventDate).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <div
                key={evt.id}
                className="p-7 sm:p-8 rounded-4xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-sero-blue-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        isUpcoming
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {isUpcoming ? "Upcoming Event ✨" : "Selesai Dituntaskan"}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {dateFormatted}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                    {evt.title}
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  {isUpcoming ? (
                    <a
                      href={evt.formLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-sero-blue-500 to-sero-purple-600 hover:from-sero-blue-600 hover:to-sero-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
                    >
                      <span>Daftar via Google Form</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ) : (
                    <div className="w-full py-3 px-5 rounded-2xl bg-slate-100 text-slate-400 font-semibold text-xs sm:text-sm text-center">
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
