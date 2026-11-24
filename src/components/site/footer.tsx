'use client'

import { Sprout, Mail, MapPin, Phone } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

export function Footer() {
  const goHome = useAppStore((s) => s.goHome)
  const goCatalog = useAppStore((s) => s.goCatalog)
  const goAbout = useAppStore((s) => s.goAbout)
  const goChat = useAppStore((s) => s.goChat)

  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sprout className="h-5 w-5" />
              </span>
              <span className="font-serif text-xl font-semibold">Botani Mart</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Platform informasi & katalog produk pertanian. Membantu petani, mahasiswa, dan
              pehobi tanaman menemukan produk tepat dan memahami cara pakainya.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> halo@botanimart.id
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> +62 812 0000 0000
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Yogyakarta, Indonesia
              </span>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">
              Navigasi
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <button onClick={goHome} className="text-muted-foreground hover:text-primary">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={goCatalog} className="text-muted-foreground hover:text-primary">
                  Katalog
                </button>
              </li>
              <li>
                <button onClick={goAbout} className="text-muted-foreground hover:text-primary">
                  Tentang
                </button>
              </li>
              <li>
                <button onClick={goChat} className="text-muted-foreground hover:text-primary">
                  Asisten AI
                </button>
              </li>
            </ul>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">
              Kategori
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {['Benih', 'Pupuk', 'Pestisida Nabati', 'Alat Pertanian', 'Media Tanam'].map(
                (c) => (
                  <li key={c}>
                    <button
                      onClick={() => goCatalog({ category: c })}
                      className="text-left text-muted-foreground hover:text-primary"
                    >
                      {c}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Botani Mart — Informasi & katalog produk pertanian.</p>
          <p>Dibuat dengan Next.js, Prisma, Supabase, & Vercel.</p>
        </div>
      </div>
    </footer>
  )
}
