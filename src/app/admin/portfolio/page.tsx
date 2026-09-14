"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { UserCheck, Sparkles, AlertCircle, CheckCircle2, Image as ImageIcon, User, Upload, X, Crop } from "lucide-react";
import ReactCrop, { type Crop as CropType, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function centerAspectCrop(mediaWidth: number, mediaHeight: number) {
  return centerCrop(
    makeAspectCrop(
      { unit: "%", width: 80 },
      1,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function AdminPortfolioPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusAlert, setStatusAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<CropType>();
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setAdmin(data.user);
          setName(data.user.name || "");
          setBio(data.user.bio || "");
          setPhotoUrl(data.user.photoUrl || "");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setCropModalOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
  }, []);

  const getCroppedBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const image = imgRef.current;
      if (!image || !completedCrop) {
        resolve(null);
        return;
      }

      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const cropX = completedCrop.x * scaleX;
      const cropY = completedCrop.y * scaleY;
      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;

      // Output max 400x400
      const outputSize = Math.min(400, cropWidth, cropHeight);
      canvas.width = outputSize;
      canvas.height = outputSize;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        outputSize,
        outputSize
      );

      canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        0.85
      );
    });
  };

  const handleCropConfirm = async () => {
    setUploading(true);
    try {
      const blob = await getCroppedBlob();
      if (!blob) {
        setStatusAlert({ type: "error", text: "Gagal memproses gambar. Coba lagi." });
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", blob, `avatar-${Date.now()}.jpg`);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        setStatusAlert({ type: "error", text: uploadData.error || "Gagal mengunggah gambar." });
        setUploading(false);
        return;
      }

      setPhotoUrl(uploadData.url);
      setCropModalOpen(false);
      setImgSrc("");
      setStatusAlert({ type: "success", text: "Foto berhasil diunggah! Jangan lupa klik Simpan." });
    } catch (err) {
      setStatusAlert({ type: "error", text: "Gagal mengunggah gambar." });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusAlert(null);

    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, photoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusAlert({ type: "error", text: data.error || "Gagal memperbarui profil." });
        setSaving(false);
        return;
      }

      setStatusAlert({ type: "success", text: "Mini portfolio berhasil diperbarui!" });
      setSaving(false);
    } catch (err) {
      setStatusAlert({ type: "error", text: "Terjadi kesalahan jaringan." });
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Memuat data portfolio...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Edit Mini Portfolio Saya
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Informasi ini akan ditampilkan pada kartu profilmu di halaman Serotonin 5.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-4xl bg-white border border-slate-200 shadow-sm">
        {statusAlert && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-2.5 ${
              statusAlert.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {statusAlert.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{statusAlert.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar Preview */}
            <div className="relative group">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-24 h-24 rounded-3xl object-cover border-2 border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-slate-100 text-slate-400 border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <User className="w-10 h-10" />
                </div>
              )}
              {/* Overlay on hover */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <Upload className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="text-center sm:text-left space-y-2">
              <p className="text-xs font-bold text-slate-800">Foto Profil</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Unggah foto dan crop persegi (1:1) untuk hasil terbaik.<br />
                Format: JPG, PNG. Maks 5 MB.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sero-purple-50 hover:bg-sero-purple-100 text-sero-purple-700 text-xs font-bold transition-colors border border-sero-purple-200"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah Foto</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onSelectFile}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nama Lengkap & Gelar (Display Name)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-sero-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Title / Hierarki Tim
            </label>
            <input
              type="text"
              disabled
              value={admin?.title?.replace("_", " ")}
              className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-100 text-xs text-slate-500 cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Hierarki dan title hanya dapat diubah oleh Superadmin.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Biografi Singkat
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ceritakan sedikit tentang dirimu dan fokus karya kesehatan mentalmu..."
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-sero-purple-400"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-sero-purple-600 hover:bg-sero-purple-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? "Menyimpan Perubahan..." : "Simpan Mini Portfolio"}
            </button>
          </div>
        </form>
      </div>

      {/* Crop Modal */}
      {cropModalOpen && imgSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-4xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Crop className="w-5 h-5 text-sero-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Crop Foto Profil</h3>
              </div>
              <button
                onClick={() => {
                  setCropModalOpen(false);
                  setImgSrc("");
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Crop Area */}
            <div className="px-6 py-4 flex justify-center bg-slate-50 max-h-[60vh] overflow-auto">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop={false}
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className="max-h-[50vh] max-w-full object-contain"
                />
              </ReactCrop>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              <p className="text-[11px] text-slate-400">
                Seret area crop agar pas dengan wajahmu
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCropModalOpen(false);
                    setImgSrc("");
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleCropConfirm}
                  disabled={uploading || !completedCrop}
                  className="px-5 py-2 rounded-xl bg-sero-purple-600 hover:bg-sero-purple-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {uploading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Gunakan Foto Ini</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
