"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

type ToastListener = (toast: ToastItem) => void;
type ConfirmListener = (options: ConfirmOptions, resolve: (val: boolean) => void) => void;

const toastListeners = new Set<ToastListener>();
const confirmListeners = new Set<ConfirmListener>();

export const toast = {
  success: (message: string, duration = 3500) => {
    emitToast({ id: Math.random().toString(36).slice(2), type: "success", message, duration });
  },
  error: (message: string, duration = 4500) => {
    emitToast({ id: Math.random().toString(36).slice(2), type: "error", message, duration });
  },
  warning: (message: string, duration = 4000) => {
    emitToast({ id: Math.random().toString(36).slice(2), type: "warning", message, duration });
  },
  info: (message: string, duration = 3500) => {
    emitToast({ id: Math.random().toString(36).slice(2), type: "info", message, duration });
  },
};

function emitToast(item: ToastItem) {
  toastListeners.forEach((fn) => fn(item));
}

export function confirmModal(options: ConfirmOptions | string): Promise<boolean> {
  const opts: ConfirmOptions =
    typeof options === "string" ? { message: options } : options;

  return new Promise((resolve) => {
    if (confirmListeners.size === 0) {
      // If for any reason container is not mounted, don't block
      resolve(true);
      return;
    }
    confirmListeners.forEach((fn) => fn(opts, resolve));
  });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    options: ConfirmOptions;
    resolve?: (val: boolean) => void;
  } | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handleToast: ToastListener = (newToast) => {
      setToasts((prev) => [...prev.slice(-4), newToast]); // Keep max 5 toasts

      if (newToast.duration) {
        setTimeout(() => {
          removeToast(newToast.id);
        }, newToast.duration);
      }
    };

    const handleConfirm: ConfirmListener = (options, resolve) => {
      setConfirmState({
        open: true,
        options,
        resolve,
      });
    };

    toastListeners.add(handleToast);
    confirmListeners.add(handleConfirm);

    return () => {
      toastListeners.delete(handleToast);
      confirmListeners.delete(handleConfirm);
    };
  }, [removeToast]);

  const handleConfirmAction = (result: boolean) => {
    if (confirmState?.resolve) {
      confirmState.resolve(result);
    }
    setConfirmState(null);
  };

  return (
    <>
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          let bgClass = "bg-white/95 border-slate-200 text-slate-800";
          let icon = <Info className="w-5 h-5 text-sero-blue-600 flex-shrink-0" />;

          if (t.type === "success") {
            bgClass = "bg-emerald-50/95 border-emerald-200 text-emerald-900";
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
          } else if (t.type === "error") {
            bgClass = "bg-rose-50/95 border-rose-200 text-rose-900";
            icon = <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
          } else if (t.type === "warning") {
            bgClass = "bg-amber-50/95 border-amber-200 text-amber-900";
            icon = <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${bgClass}`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
                {t.message}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-black/5 transition-colors"
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {confirmState?.open && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-2xl flex-shrink-0 ${
                  confirmState.options.isDanger ?? true
                    ? "bg-rose-100 text-rose-600"
                    : "bg-sero-purple-100 text-sero-purple-600"
                }`}
              >
                {confirmState.options.isDanger ?? true ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <Info className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {confirmState.options.title || "Konfirmasi Tindakan"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {confirmState.options.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleConfirmAction(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {confirmState.options.cancelText || "Batal"}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmAction(true)}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-sm transition-all ${
                  confirmState.options.isDanger ?? true
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-sero-purple-600 hover:bg-sero-purple-700"
                }`}
              >
                {confirmState.options.confirmText || "Ya, Lanjutkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
