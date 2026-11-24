# Botani Mart

Katalog & informasi produk pertanian modern — Next.js 16 + TypeScript + Tailwind + shadcn/ui + Prisma.

## Stack
- Next.js 16 (App Router, TypeScript)
- Tailwind CSS 4 + shadcn/ui + Framer Motion
- Prisma ORM (PostgreSQL via Supabase)
- z-ai-web-dev-sdk (Asisten AI)
- next-themes (dark mode)
- Zustand (SPA state)

## Quick start (lokal)
```bash
bun install              # atau npm install
cp .env.example .env     # edit DATABASE_URL
bun run db:push          # sync schema ke DB
bun run db:seed          # isi data produk
bun run dev              # buka http://localhost:3000
```

## Deploy ke Supabase + Vercel
Baca **DEPLOY.md** untuk panduan lengkap step-by-step.

## Sitemap (SPA, route `/`)
- Beranda · Katalog (search/filter/sort) · Detail Produk · Tentang · Asisten AI
