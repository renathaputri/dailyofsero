# Product Requirements Document (PRD)
## GrowthWithSero — Mental Health & Community Platform (Tim Serotonin)

**Versi:** 1.0 (MVP)
**Tanggal:** 11 September 2026
**Jenis Proyek:** Tugas Akhir / Capstone — Tim Serotonin
**Status:** Ready for development

---

## 1. Ringkasan Proyek

GrowthWithSero adalah platform yang menggabungkan galeri karya komunitas Brand Ambassador (BA), fitur healing/self-care personal, dan akses ke layanan konseling resmi (AwareMind). Dibangun sebagai proyek akhir, dengan fokus MVP yang ringkas tapi solid secara arsitektur data — khususnya untuk data sensitif (journal, mood).

### 1.1 Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js (React) + TypeScript |
| Styling | Tailwind CSS |
| Database ORM | Prisma |
| File/Image Storage | Vercel Blob |
| Auth | Custom (session/JWT based) |
| Email | Provider TBD (email verification, reset password, notifikasi takedown) |
| Coding environment | Antigravity |

### 1.2 Visual & Tone Guideline

- **Warna dominan:** biru muda (light blue) + ungu (purple) — nuansa calming, soft gradient cocok buat tema mental health.
- **Font:** Montserrat (seluruh UI).
- **UI/UX target:** Gen Z — playful tapi tetap nggak norak, banyak whitespace, rounded corners, micro-interaction ringan (hover, transition halus).
- **Tone of voice (copywriting/microcopy):** santai, ngobrol, bahasa Gen Z, tapi tetap sopan — bukan bahasa formal korporat, dan bukan juga bahasa gaul "lu-gue". Contoh: bukan "Kata sandi Anda telah berhasil diperbarui" tapi "Password baru kamu udah aktif! ✨"
- **Ilustrasi/imagery:** disarankan soft illustration/blob shapes, bukan stock photo formal.

---

## 2. Roles & Permission Model

| Role | Tabel | Deskripsi |
|---|---|---|
| **User (Pengunjung)** | `User` | Publik, self-register, verified via email |
| **Admin (BA)** | `Admin` (role: `ADMIN`) | Dibuat superadmin, punya mini portfolio, kelola karya sendiri |
| **Superadmin** | `Admin` (role: `SUPERADMIN`) | Full control: kelola akun, takedown, content bank, event, dashboard |

**Catatan penting:**
- Hierarki *Mind Captain → Co-Captain → BA* adalah **label/title display saja** (field `title` di tabel `Admin`), **tidak memengaruhi permission**. Semua yang bukan superadmin punya permission yang identik (role `ADMIN`).
- Title hierarki hanya bisa diubah oleh superadmin.
- `User` dan `Admin` adalah dua tabel/database akun yang terpisah total — tidak ada shared login.

---

## 3. Modul & Fitur

### 3.1 Auth

**Login**
- 1 halaman login dengan 2 jalur:
  - **Pengunjung:** email + password.
  - **Tim BA/Superadmin:** username + password (satu jalur yang sama, dibedakan lewat field `role` di tabel `Admin`).

**Registrasi (User/Pengunjung)**
- Self-register: email + password.
- Validasi format email (regex) saat submit.
- Setelah submit → kirim **email verification link/OTP**. Akun berstatus `unverified` sampai email dikonfirmasi. Akun unverified tidak bisa login.
- Ini sekaligus jadi mekanisme validasi "apakah email itu valid & bisa diakses" — tanpa perlu third-party email verification API (di luar scope MVP).

**Password Policy**
- Minimal 6 karakter (semua akun: user & admin).

**Akun Admin/BA**
- Dibuat oleh superadmin lewat panel admin.
- Superadmin langsung set password saat create — **tidak ada force-change password di first login.**
- Superadmin bisa set/ubah `title` (Mind Captain/Co-Captain/BA) dan `role` (ADMIN/SUPERADMIN).

**Reset Password**
- User/Pengunjung: self-service via email (forgot password flow standar — link reset).
- Admin/BA: **manual oleh superadmin** (superadmin reset & set password baru dari panel). Tidak ada self-service forgot password untuk Admin.
- Saat superadmin reset password Admin, kirim **notifikasi in-app** ke akun tersebut.

**Consent**
- Saat registrasi user, tampilkan checkbox persetujuan Privacy Policy & Terms of Service (draft menyusul, wajib ada sebelum go-live karena app menyimpan data sensitif seperti journal).

---

### 3.2 Our Team

- Struktur: **Mind Captain → Co-Captain → BA** (title, ditentukan superadmin).
- Setiap Admin (BA/Co-Captain/Mind Captain) punya **mini portfolio**:
  - Profil: foto, nama, title/hierarki, deskripsi singkat.
  - Daftar karya milik dia sendiri (auto-linked dari tabel Karya).
- User pengunjung **tidak** punya profil visual (lihat 3.7).

---

### 3.3 Karya BA (Galeri)

**Struktur data karya:**
| Field | Detail |
|---|---|
| Title | Teks |
| Deskripsi | Teks |
| Kategori | Select, predefined 6 kategori (lihat bawah) |
| Link Post | URL ke postingan Instagram |
| Owner | Relasi ke Admin (BA) yang upload |
| Status | `PUBLISHED` (auto-tayang setelah submit) |

**6 Kategori Karya (predefined, dikunci di enum):**
1. Self-Awareness
2. Mental Health
3. Growth
4. Connection
5. Community
6. Other

**Perilaku:**
- Galeri publik, bisa diakses siapa saja (tanpa login).
- Sortable/filter by kategori.
- **Tidak ada thumbnail/gambar** — card cukup title + desc + kategori badge.
- Klik card → redirect ke link postingan Instagram (external link, buka tab baru).
- Auto-tayang: begitu BA submit, langsung publish, tanpa approval.
- BA hanya bisa edit/hapus karya miliknya sendiri.
- Superadmin bisa **takedown** karya siapa pun.
- **Takedown = hard delete** dari database.
- **Sebelum hard delete**, sistem kirim **email notifikasi** ke BA pemilik karya (isi: judul karya yang di-takedown, alasan jika diisi superadmin, timestamp) — dikirim sebelum/bersamaan proses delete.
- Tidak ada fitur report dari publik di MVP ini.
- Tidak ada filter berdasarkan orang secara terpisah — karena sudah ter-cover lewat mini portfolio masing-masing Admin.

---

### 3.4 AwareMind

- Halaman **dummy profile** — bukan sistem booking real, murni representasi/showcase karena ini proyek tugas akhir.
- Card konselor berisi: nama, foto, tombol **Book** / **Hubungi**.
- Data konselor (nama, foto) **diinput & dikelola oleh superadmin** lewat panel admin.
- **Semua tombol (Book/Hubungi) redirect ke halaman AwareMind resmi** (link eksternal) — bukan sistem booking internal.
- Link/href resmi AwareMind ditampilkan jelas di halaman ini.
- **Akses darurat**: tombol floating atau footer yang selalu terlihat di seluruh halaman web, redirect ke halaman/kontak resmi AwareMind untuk kondisi darurat. Ini elemen safety-critical — pastikan visible di semua breakpoint (desktop & mobile) dan tidak tertutup elemen lain.

---

### 3.5 Event

**Struktur data:**
| Field | Detail |
|---|---|
| Title | Teks |
| Deskripsi | Teks |
| Tanggal | Date |
| Link Google Form | URL |
| Status | `UPCOMING` / `PAST` (auto atau manual berdasarkan tanggal) |

**Perilaku:**
- Card event → klik → redirect ke Google Form (external link).
- Dikelola sepenuhnya oleh superadmin (create/edit/delete).
- Tidak ada kategori event di MVP ini.
- Status upcoming/past ditentukan berdasarkan perbandingan tanggal event vs tanggal hari ini (bisa dihitung otomatis di query, tidak perlu field manual).

---

### 3.6 Healing (Fitur Utama untuk User)

**Mood-star**
- Representasi mood dengan star rating, **hanya untuk kondisi/sesi saat itu**.
- **Tidak disimpan ke database** — sifatnya sesaat, sekali render lalu hilang. Tidak ada history/tren mood untuk dilihat balik.
- Tidak perlu enkripsi (karena memang tidak persist).
- 7 kategori mood (dipakai juga sebagai tagging di Content Bank — lihat 3.7):
  1. Senang
  2. Sedih
  3. Cemas
  4. Marah
  5. Lelah
  6. Tenang
  7. Bingung/Overwhelmed

  > *Catatan: daftar ini asumsi awal tim dev, silakan disesuaikan sebelum dikunci final ke enum database — tapi jumlahnya tetap 7.*

**Self-Journal**
- Permanen, tersimpan di database.
- **Dienkripsi** (encryption at rest untuk isi journal — field content di-encrypt sebelum disimpan, decrypt saat di-fetch oleh pemiliknya).
- **Superadmin sama sekali tidak bisa mengakses** isi journal user — baik lewat panel admin maupun raw database view (secara desain aplikasi; enkripsi ini juga proteksi tambahan).
- User bisa hapus journal entry miliknya sendiri kapan saja.
- Kalau akun user dihapus, **semua journal entry ikut hard delete** (lihat 3.9 Delete Account).

**Streak**
- Dihitung dari aktivitas **journaling harian** (submit minimal 1 journal entry per hari = streak +1). Terputus kalau ada hari kosong.
- Ditampilkan di halaman Healing/profil user.

**Guided Prompt**
- Diambil dari Content Bank (tipe: Guided Prompt).
- Ditampilkan sebagai starter/inspirasi saat user mau bikin journal entry baru (tap "pakai prompt ini" → prefill textarea journal).

**Bookmark Kalimat Favorit**
- User bisa bookmark kalimat penenang dari Content Bank untuk diakses ulang nanti.
- Relasi many-to-many: `User` ↔ `ContentBank` (tipe: kalimat penenang).

**Breathing Exercise**
- Fitur statis/interaktif sederhana (animasi timer inhale-hold-exhale), tidak perlu data tersimpan.

**Quote of the Day**
- Random dari kalimat penenang di Content Bank (bukan dari guided prompt).
- Reset setiap jam **00:00 (12 AM)**.
- Sama untuk semua user di hari yang sama (deterministic random berdasarkan tanggal, misal `seed = date`, biar konsisten sepanjang hari itu untuk semua orang, bukan random per-request).

---

### 3.7 Content Bank

**Dua tipe konten:**
1. Kalimat Penenang (teks)
2. Guided Prompt (teks)

**Struktur data:**
| Field | Detail |
|---|---|
| Type | `CALMING_SENTENCE` / `GUIDED_PROMPT` |
| Content | Teks |
| Tag/Kategori | Sama seperti 7 kategori mood-star (Senang, Sedih, Cemas, Marah, Lelah, Tenang, Bingung) |
| CreatedBy | Relasi ke Admin (BA atau Superadmin yang nambah) |
| Status | `PUBLISHED` (auto-tayang) |

**Perilaku:**
- Bisa ditambahkan oleh **superadmin dan admin/BA** (semua role Admin).
- Auto-tayang begitu ditambahkan (tanpa approval).
- **Hanya superadmin yang bisa menghapus** konten dari Content Bank (BA tidak bisa hapus, meskipun dia yang nambah — mencegah konten hilang sepihak tanpa kontrol).
- Quote of the Day hanya narik dari tipe `CALMING_SENTENCE`.

---

### 3.8 Notifikasi In-App

Dikirim ke Admin (BA/Superadmin) untuk event-event berikut:

| Trigger | Penerima |
|---|---|
| Karya di-takedown superadmin | BA pemilik karya (+ email, lihat 3.3) |
| Password direset superadmin | Admin yang bersangkutan |
| Karya baru berhasil tayang | BA yang upload (konfirmasi sukses) |
| Event baru dipublish | Semua Admin |
| Konten baru ditambahkan ke Content Bank oleh Admin lain | Semua Admin (opsional, bisa disederhanakan jadi notif ke superadmin aja kalau terlalu ramai) |
| User mencapai milestone streak (misal 7/30/100 hari) | User yang bersangkutan (notifikasi in-app khusus user, terpisah dari notifikasi Admin) |

> *Catatan: daftar ini disusun tim dev berdasarkan "sesuaiin aja" — bisa dipangkas kalau dirasa notifikasi kebanyakan/noisy untuk MVP.*

---

### 3.9 Profil & Account Management

**User (Pengunjung):**
- Data profil minimal: email + password saja. **Tidak ada foto profil.**
- Bisa **delete akun sendiri**.
- Delete akun = hard delete total: akun, journal entries, bookmark, semua data terkait user tersebut. **Tidak ada retensi data sama sekali** (termasuk untuk analytics).

**Admin (BA):**
- Punya profil lengkap: foto, nama, title/hierarki, deskripsi (buat mini portfolio).
- Bisa edit profil & karya miliknya sendiri.
- Tidak bisa delete akun sendiri (akun Admin dikelola sepenuhnya oleh superadmin).

---

### 3.10 Dashboard Superadmin

Ringkasan yang ditampilkan (draft, bisa disesuaikan implementasi):

- Total user terdaftar (verified)
- Total Admin (breakdown by title: Mind Captain/Co-Captain/BA)
- Total karya published
- Total karya yang pernah di-takedown
- Total event (breakdown upcoming/past)
- Total item Content Bank (breakdown kalimat penenang/guided prompt)
- Aktivitas terbaru (misal: 5 karya terbaru, 5 user terbaru register) — opsional, nice-to-have kalau waktu memungkinkan

---

## 4. Skema Database (Prisma — Draft)

```prisma
// ================= AUTH =================

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String   // hashed
  isVerified    Boolean  @default(false)
  createdAt     DateTime @default(now())

  journalEntries JournalEntry[]
  bookmarks      ContentBankBookmark[]
  streak         Streak?
}

enum AdminRole {
  ADMIN
  SUPERADMIN
}

enum AdminTitle {
  MIND_CAPTAIN
  CO_CAPTAIN
  BA
}

model Admin {
  id           String     @id @default(cuid())
  username     String     @unique
  password     String     // hashed
  role         AdminRole  @default(ADMIN)
  title        AdminTitle @default(BA)
  name         String
  photoUrl     String?    // Vercel Blob URL
  bio          String?
  createdAt    DateTime   @default(now())

  karya        Karya[]
  contentBank  ContentBank[]
  notifications Notification[]
}

// ================= KARYA =================

enum KaryaCategory {
  SELF_AWARENESS
  MENTAL_HEALTH
  GROWTH
  CONNECTION
  COMMUNITY
  OTHER
}

model Karya {
  id         String        @id @default(cuid())
  title      String
  description String
  category   KaryaCategory
  linkPost   String        // link ke IG post
  ownerId    String
  owner      Admin         @relation(fields: [ownerId], references: [id])
  createdAt  DateTime      @default(now())
}

// ================= EVENT =================

model Event {
  id          String   @id @default(cuid())
  title       String
  description String
  eventDate   DateTime
  formLink    String
  createdAt   DateTime @default(now())
  // status upcoming/past dihitung dari eventDate vs now() saat query
}

// ================= HEALING =================

model JournalEntry {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  contentEnc  String   // encrypted content
  createdAt   DateTime @default(now())
}

model Streak {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  currentStreak Int      @default(0)
  longestStreak Int      @default(0)
  lastEntryDate DateTime?
}

// ================= CONTENT BANK =================

enum ContentType {
  CALMING_SENTENCE
  GUIDED_PROMPT
}

enum MoodCategory {
  SENANG
  SEDIH
  CEMAS
  MARAH
  LELAH
  TENANG
  BINGUNG
}

model ContentBank {
  id         String       @id @default(cuid())
  type       ContentType
  content    String
  tag        MoodCategory
  createdById String
  createdBy  Admin        @relation(fields: [createdById], references: [id])
  createdAt  DateTime     @default(now())

  bookmarkedBy ContentBankBookmark[]
}

model ContentBankBookmark {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  contentBankId String
  contentBank   ContentBank @relation(fields: [contentBankId], references: [id])
  createdAt     DateTime    @default(now())

  @@unique([userId, contentBankId])
}

// ================= AWAREMIND =================

model Counselor {
  id        String   @id @default(cuid())
  name      String
  photoUrl  String?  // Vercel Blob URL
  createdAt DateTime @default(now())
  // tombol Book/Hubungi redirect ke link resmi AwareMind (bisa hardcode/config, bukan per-counselor)
}

// ================= NOTIFICATIONS =================

enum NotificationType {
  KARYA_TAKEDOWN
  PASSWORD_RESET
  KARYA_PUBLISHED
  EVENT_PUBLISHED
  CONTENT_BANK_ADDED
  STREAK_MILESTONE
}

model Notification {
  id        String           @id @default(cuid())
  adminId   String?
  admin     Admin?           @relation(fields: [adminId], references: [id])
  userId    String?
  type      NotificationType
  message   String
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())
}
```

> Catatan: `userId` di `Notification` sengaja tanpa relasi eksplisit ke `User` di draft ini supaya fleksibel — bisa disesuaikan (dibuat relasi FK proper atau dipisah jadi `UserNotification` model sendiri) saat implementasi.

---

## 5. Non-Functional Requirements

- **Enkripsi:** isi `JournalEntry.contentEnc` wajib dienkripsi (misal AES-256) sebelum disimpan; decrypt hanya di server saat request datang dari pemilik yang terautentikasi.
- **Email verification:** wajib untuk aktivasi akun User.
- **Password hashing:** bcrypt/argon2 untuk semua password (User & Admin).
- **Rate limiting login:** disarankan untuk mencegah brute force (basic, misal max 5 attempt/menit per IP/akun).
- **Akses darurat AwareMind:** harus selalu visible di semua halaman (floating button/footer), tidak boleh ketutup UI lain — ini fitur safety, prioritas tinggi dari sisi UX.
- **Privacy Policy & Terms of Service:** wajib publish sebelum go-live, mengingat aplikasi menyimpan data sensitif (journal).

---

## 6. Out of Scope (MVP)

- Sistem booking konseling real-time (AwareMind tetap dummy + redirect).
- Report/flag karya dari publik.
- History/tren mood (mood-star sengaja tidak disimpan).
- Kategori/filter event.
- Third-party email verification API.
- Foto profil untuk User (pengunjung).
- Self-service forgot password untuk Admin/BA.

---

## 7. Open Items (perlu difinalisasi sebelum/selagi development)

1. Finalisasi 7 kategori mood-star (draft: Senang, Sedih, Cemas, Marah, Lelah, Tenang, Bingung — bisa direvisi tim).
2. Draft final copy Privacy Policy & Terms of Service.
3. Link resmi AwareMind (URL final untuk redirect Book/Hubungi + akses darurat).
4. Metode enkripsi journal yang dipakai (library/approach spesifik di Next.js + Prisma).
5. Provider email untuk verification, reset password, & notifikasi takedown (Resend, SendGrid, dll).

---

*Dokumen ini merangkum seluruh keputusan yang sudah dikunci dari sesi diskusi. Siap dipakai sebagai acuan development MVP.*
