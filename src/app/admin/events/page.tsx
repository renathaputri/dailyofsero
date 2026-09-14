"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Edit3, ExternalLink, Clock } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  formLink: string;
  status: "UPCOMING" | "PAST";
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [formLink, setFormLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data?.events) setEvents(data.events);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setEventDate(new Date().toISOString().slice(0, 10));
    setFormLink("");
    setModalOpen(true);
  };

  const openEditModal = (e: EventItem) => {
    setEditId(e.id);
    setTitle(e.title);
    setDescription(e.description);
    setEventDate(new Date(e.eventDate).toISOString().slice(0, 10));
    setFormLink(e.formLink);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editId ? `/api/events/${editId}` : "/api/events";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, eventDate, formLink }),
      });

      if (res.ok) {
        setModalOpen(false);
        loadEvents();
      } else {
        alert("Gagal menyimpan event.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus event "${title}"?`)) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Kelola Event & Workshop
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Publikasikan webinar dan workshop interaktif untuk komunitas.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Event Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Memuat event...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Belum ada event. Klik tombol di atas untuk membuat event.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1.5 flex-grow pr-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        evt.status === "UPCOMING"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {evt.status === "UPCOMING" ? "Akan Datang" : "Selesai"}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(evt.eventDate).toLocaleDateString("id-ID", {
                        dateStyle: "long",
                      })}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{evt.title}</h3>
                  <p className="text-xs text-slate-600 max-w-2xl">{evt.description}</p>
                  <a
                    href={evt.formLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline pt-1"
                  >
                    <span>Form Pendaftaran</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(evt)}
                    className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(evt.id, evt.title)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-4xl shadow-2xl border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {editId ? "Edit Event" : "Buat Event Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Judul Event
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Webinar: Mengatasi Overthinking..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tanggal Pelaksanaan
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Link Google Form Pendaftaran
                </label>
                <input
                  type="url"
                  required
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  placeholder="https://forms.gle/..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Deskripsi Event
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Informasi detail kegiatan dan narasumber..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
