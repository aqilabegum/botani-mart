# Panduan Deploy Botani Mart ke Supabase + Vercel

Panduan lengkap untuk men-deploy Botani Mart (Next.js 16 + Prisma) ke **Supabase** (database PostgreSQL) dan **Vercel** (hosting).

---

## Arsitektur

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│   Vercel (Next.js 16)       │        │   Supabase (PostgreSQL)      │
│   - Frontend React/RSC      │ ────── │   - Tabel Product, Category  │
│   - API Routes /api/*       │  Prisma│   - Row Level Security        │
│   - Asisten AI (z-ai SDK)   │        │   - Connection pooling        │
└─────────────────────────────┘        └──────────────────────────────┘
```

---

## Bagian 1 — Setup Supabase (Database)

### 1.1 Buat Project Supabase baru

1. Buka **https://supabase.com** → Sign in (gratis, pakai GitHub/Google)
2. Klik **New project**
3. Isi:
   - **Name**: `botani-mart`
   - **Database password**: buat password kuat, simpan di tempat aman!
   - **Region**: pilih terdekat (mis. `Southeast Asia (Singapore)`)
   - **Plan**: Free (cukup untuk mulai)
4. Klik **Create new project**, tunggu ±2 menit

### 1.2 Jalankan SQL schema

1. Di dashboard Supabase, buka **SQL Editor** → **New query**
2. Buka file `download/supabase-schema.sql` dari project ini
3. Copy seluruh isinya, paste di SQL Editor
4. Klik **Run** (Ctrl+Enter)
5. Pastikan muncul pesan "Success. No rows returned" — tabel `Product` & `Category` + 9 produk + 5 kategori sudah ter-seed

### 1.3 Ambil Connection String

1. Buka **Project Settings** (ikon gear kiri bawah) → **Database**
2. Di bagian **Connection string**, pilih tab **URI**
3. Pilih **Transaction** mode (untuk Vercel Serverless, pooler port 6543)
4. Copy connection string, format-nya seperti:
   ```
   postgresql://postgres.xxxxxxxxx:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
5. Simpan sementara — akan dipakai di Bagian 3

---

## Bagian 2 — Persiapan Kode untuk Produksi

Project ini sudah siap deploy. Satu-satunya perubahan: switch Prisma dari SQLite ke PostgreSQL.

### 2.1 Edit `prisma/schema.prisma`

Buka file `prisma/schema.prisma`, ubah bagian `datasource db`:

```prisma
datasource db {
  provider = "postgresql"   // ubah dari "sqlite"
  url      = env("DATABASE_URL")
}
```

> Catatan: di sandbox preview ini dipakai `sqlite` agar bisa jalan tanpa Supabase. Untuk deploy, ganti ke `postgresql`. Schema model (`Product`, `Category`) tidak perlu diubah — sudah kompatibel.

### 2.2 Commit ke Git

```bash
git init
git add .
git commit -m "Botani Mart — Next.js 16 modern UI + Supabase ready"
git branch -M main
git remote add origin https://github.com/USERNAME/botani-mart.git
git push -u origin main
```

---

## Bagian 3 — Deploy ke Vercel

### 3.1 Import project

1. Buka **https://vercel.com** → Sign in (pakai GitHub)
2. Klik **Add New** → **Project**
3. Import repository `botani-mart` kamu
4. Vercel auto-detect Next.js — biarkan default settings

### 3.2 Set Environment Variables

Sebelum klik Deploy, di bagian **Environment Variables**, tambah:

| Key           | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| `DATABASE_URL` | `postgresql://postgres.xxxx:PASSWORD@...supabase.com:6543/postgres?pgbouncer=true&connection_limit=1` |

> **Penting**: tambahkan `?pgbouncer=true&connection_limit=1` di akhir URL — Supabase pooler butuh ini agar tidak habiskan connection pool di Vercel Serverless.

Centang semua environment (Production, Preview, Development).

### 3.3 Deploy

1. Klik **Deploy**
2. Tunggu ±2 menit sampai build selesai (bun install + next build)
3. Vercel kasih URL seperti `https://botani-mart-xxxx.vercel.app`
4. Klik **Visit** — aplikasi sudah live!

### 3.4 Verifikasi

- Homepage muncul dengan hero & kategori
- Klik salah satu produk → halaman detail muncul
- Buka **Asisten AI** → tanya "Pupuk apa untuk cabai?" → AI jawab + tampil kartu rekomendasi produk
- Cek di Supabase Dashboard → **Table Editor** → tabel `Product` muncul 9 baris

---

## Bagian 4 — Setup Asisten AI di Produksi

Asisten AI memakai `z-ai-web-dev-sdk`. Di sandbox ini config sudah otomatis. Untuk deploy di Vercel, set env vars:

| Key             | Value                          |
| --------------- | ------------------------------ |
| `ZAI_BASE_URL`  | URL API Z.ai (cek dashboard)   |
| `ZAI_API_KEY`   | API key Z.ai kamu              |

Atau buat file `.z-ai-config` di root project:
```json
{
  "baseUrl": "https://api.example.com/v1",
  "apiKey": "YOUR_API_KEY"
}
```

Kalau env vars AI tidak di-set, endpoint `/api/chat` tetap jalan dengan fallback "asisten sedang gangguan teknis" — aplikasi tetap berfungsi tanpa AI.

---

## Bagian 5 — Update Data Produk

### Cara 1: Lewat Supabase Dashboard
- Buka **Table Editor** → tabel `Product` → **Insert row** / edit langsung
- Field `benefits` diisi string JSON: `["manfaat 1", "manfaat 2"]`

### Cara 2: Lewat Prisma (lokal)
```bash
# Set DATABASE_URL ke Supabase di .env lokal
bun run db:seed    # re-seed (upsert, tidak hapus data lain)
```

### Cara 3: Lewat SQL
```sql
insert into "Product" ("slug","name","category","price","unit","emoji","short","description","benefits","usage")
values ('produk-baru', 'Produk Baru', 'Pupuk', 50000, 'kg', '🧪',
  'Deskripsi singkat.',
  'Deskripsi panjang.',
  '["Manfaat 1","Manfaat 2"]',
  'Cara pakai...');
```

---

## Troubleshooting

**Build error: Prisma client tidak generate**
- Tambahkan `"postinstall": "prisma generate"` di `package.json` scripts (Vercel auto-run)

**Database connection limit habis**
- Pastikan pakai Transaction pooler (port 6543) dengan `?pgbouncer=true`
- Jangan pakai Direct connection (port 5432) di serverless

**Hydration mismatch (theme)**
- Pastikan `<html suppressHydrationWarning>` ada di layout (sudah default di project ini)

**AI chat error 500**
- Cek env vars `ZAI_BASE_URL` & `ZAI_API_KEY` sudah di-set di Vercel
- Cek Vercel function logs: Dashboard → Project → Functions → `/api/chat`

---

## Ringkasan Stack

| Bagian       | Teknologi                                    |
| ------------ | -------------------------------------------- |
| Framework    | Next.js 16 (App Router, TypeScript)          |
| UI           | Tailwind CSS 4 + shadcn/ui + Framer Motion   |
| Database     | Supabase (PostgreSQL) + Prisma ORM           |
| Asisten AI   | z-ai-web-dev-sdk (LLM)                       |
| Theme        | next-themes (light/dark)                     |
| State        | Zustand (SPA view)                           |
| Hosting      | Vercel (serverless)                          |

Selamat! Botani Mart kamu sudah live dengan UI modern + AI + database cloud.
