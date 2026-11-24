-- ============================================================
-- Botani Mart — Skema database PostgreSQL untuk Supabase
-- ============================================================
-- Cara pakai:
-- 1. Buka Supabase Dashboard → SQL Editor → New query
-- 2. Copy-paste seluruh isi file ini → Run
-- 3. Tabel "Product" dan "Category" + data seed otomatis dibuat
-- ============================================================

-- Enable extensions (tidak wajib, tapi berguna)
-- create extension if not exists "pgcrypto";

-- Drop kalau perlu reset (hati-hati, hapus data!)
-- drop table if exists "Product" cascade;
-- drop table if exists "Category" cascade;

-- ---------- Tabel: Category ----------
create table if not exists "Category" (
  "id"        text primary key default gen_random_uuid()::text,
  "name"      text unique not null,
  "icon"      text not null default 'seedling',
  "blurb"     text not null default '',
  "createdAt" timestamptz not null default now()
);

-- ---------- Tabel: Product ----------
create table if not exists "Product" (
  "slug"        text primary key,
  "name"        text not null,
  "category"    text not null,
  "price"       integer not null,
  "unit"        text not null,
  "emoji"       text not null default '🌱',
  "short"       text not null default '',
  "description" text not null default '',
  -- benefits disimpan sebagai JSON array string:
  -- '["Daya kecambah tinggi", "Tahan layu"]'
  "benefits"    text not null default '[]',
  "usage"       text not null default '',
  "createdAt"   timestamptz not null default now(),
  "updatedAt"   timestamptz not null default now()
);

create index if not exists "Product_category_idx" on "Product" ("category");
create index if not exists "Product_price_idx"    on "Product" ("price");

-- ---------- Seed: Kategori ----------
insert into "Category" ("name", "icon", "blurb") values
  ('Benih', 'seedling', 'Benih unggul berdaya kecambah tinggi untuk tanaman pangan & hias.'),
  ('Pupuk', 'flask-conical', 'Pupuk organik & anorganik untuk pertumbuhan optimal.'),
  ('Pestisida Nabati', 'leaf', 'Pengendali hama alami yang ramah lingkungan.'),
  ('Alat Pertanian', 'wrench', 'Alat kerja tahan lama untuk olah lahan & aplikasi.'),
  ('Media Tanam', 'layers', 'Media tanam siap pakai untuk pot, polybag, & hidroponik.')
on conflict ("name") do update set
  "icon"  = excluded."icon",
  "blurb" = excluded."blurb";

-- ---------- Seed: Produk ----------
insert into "Product" ("slug", "name", "category", "price", "unit", "emoji", "short", "description", "benefits", "usage") values
  (
    'benih-cabai-rawit', 'Benih Cabai Rawit Unggul', 'Benih', 25000, 'sachet 10 g', '🌶️',
    'Benih cabai rawit daya tumbuh tinggi.',
    'Benih hibrida tahan penyakit layu, cocok dataran rendah hingga menengah. Diolah dengan teknologi primer untuk menjaga viabilitas benih hingga 2 tahun penyimpanan.',
    '["Daya kecambah ≥ 85%","Tahan layu bakteri","Produktif hingga 1 kg/tanaman"]',
    'Rendam benih 4 jam, semai pada media halus 3-4 minggu, pindah tanam dengan jarak 50x60 cm.'
  ),
  (
    'benih-tomat-ceri', 'Benih Tomat Ceri', 'Benih', 30000, 'sachet 5 g', '🍅',
    'Tomat ceri manis, cocok pot dan polybag.',
    'Varietas determinate dengan buah kecil manis dan panen berkelanjutan. Ideal untuk pehobi lahan sempit dan urban farming.',
    '["Cocok lahan sempit","Rasa manis","Panen 60-70 HST"]',
    'Semai di media halus, pindah tanam saat 4 daun sejati. Butuh sangga buah.'
  ),
  (
    'benih-padi-inpari', 'Benih Padi Inpari 32', 'Benih', 14000, 'kg', '🌾',
    'Padi tahan wereng dan blas.',
    'Varietas padi sawah umur genjah dengan potensi hasil tinggi. Tahan terhadap serangan wereng coklat dan penyakit blas.',
    '["Umur ±120 hari","Tahan blas","Potensi 8 ton/ha"]',
    'Rendam 24 jam, peram 24 jam, semai 18-21 hari sebelum pindah tanam.'
  ),
  (
    'pupuk-npk-16', 'Pupuk NPK 16-16-16', 'Pupuk', 18000, 'kg', '🧪',
    'Pupuk majemuk seimbang untuk semua tanaman.',
    'Pupuk granul dengan kandungan N, P, K seimbang 16-16-16. Serbaguna untuk sayuran, buah, dan tanaman hias.',
    '["Mempercepat pertumbuhan","Memperbanyak bunga dan buah","Mudah larut"]',
    'Tabur 5-10 g per tanaman setiap 2 minggu, jauhkan dari batang untuk hindari bakar akar.'
  ),
  (
    'pupuk-kompos-organik', 'Pupuk Kompos Organik', 'Pupuk', 35000, '5 kg', '🌱',
    'Kompos matang untuk memperbaiki tanah.',
    'Kompos dari limbah pertanian terfermentasi sempurna selama 60 hari. Bebas bau dan patogen, kaya mikroba menguntungkan.',
    '["Memperbaiki struktur tanah","Ramah lingkungan","Menambah mikroba baik"]',
    'Campurkan 1:3 dengan tanah saat pengolahan lahan awal.'
  ),
  (
    'pestisida-neem', 'Pestisida Nabati Neem', 'Pestisida Nabati', 45000, 'botol 500 ml', '🍃',
    'Pengendali hama alami dari biji mimba.',
    'Ekstrak neem (azadirachtin) efektif untuk kutu daun, ulat, dan thrips. Ramah serangga penyerbuk dan residunya rendah.',
    '["Aman bagi serangga penyerbuk","Residu rendah","Bahan alami"]',
    'Larutkan 5 ml per liter air, semprot sore hari tiap 5-7 hari.'
  ),
  (
    'cangkul-baja', 'Cangkul Baja Karbon', 'Alat Pertanian', 85000, 'unit', '⛏️',
    'Cangkul kuat bergagang kayu jati.',
    'Mata cangkul baja karbon tahan aus untuk pengolahan lahan. Gagang kayu jati ergonomis dengan finish halus.',
    '["Tahan lama","Gagang ergonomis","Tidak mudah bengkok"]',
    'Bersihkan dan keringkan setelah pakai; asah berkala agar selalu tajam.'
  ),
  (
    'sprayer-manual-16l', 'Sprayer Manual 16 Liter', 'Alat Pertanian', 220000, 'unit', '💦',
    'Sprayer punggung untuk pupuk cair dan pestisida.',
    'Tangki 16 liter dengan tuas pompa manual dan nozzle dapat diatur. Tali punggung empuk dengan bantalan spons.',
    '["Semprotan merata","Tali punggung empuk","Nozzle 3 mode"]',
    'Isi tidak lebih dari batas maksimal, pompa hingga tekanan cukup sebelum semprot.'
  ),
  (
    'cocopeat-blok', 'Cocopeat Blok 5 kg', 'Media Tanam', 22000, 'blok', '🥥',
    'Media tanam serabut kelapa, retensi air baik.',
    'Blok cocopeat 5 kg yang mengembang hingga 70 liter saat direndam. Bersih, bebas gulma, dan pH netral.',
    '["Menyimpan air","Aerasi baik","Bebas gulma"]',
    'Rendam dalam air hingga mengembang, cuci untuk hilangkan tanin, lalu campur sekam/kompos.'
  )
on conflict ("slug") do update set
  "name"        = excluded."name",
  "category"    = excluded."category",
  "price"       = excluded."price",
  "unit"        = excluded."unit",
  "emoji"       = excluded."emoji",
  "short"       = excluded."short",
  "description" = excluded."description",
  "benefits"    = excluded."benefits",
  "usage"       = excluded."usage",
  "updatedAt"   = now();

-- ---------- Row Level Security (opsional, untuk keamanan) ----------
-- Aktifkan RLS & buat policy read-only untuk public (anon key):
alter table "Product" enable row level security;
alter table "Category" enable row level security;

-- Policy: siapa saja bisa baca (select)
drop policy if exists "Public can read Product" on "Product";
create policy "Public can read Product" on "Product" for select using (true);

drop policy if exists "Public can read Category" on "Category";
create policy "Public can read Category" on "Category" for select using (true);

-- Catatan: API routes Next.js memakai connection string (service role)
-- yang bypass RLS, jadi operasi tulis (insert/update) tetap jalan dari server.
