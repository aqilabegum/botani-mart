'use client'

import {
  Sprout,
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Music2,
  ShoppingBag,
} from 'lucide-react'
import { useAppStore } from '@/store/app-store'

// Kontak & sosmed resmi Botani Mart IPB
export const CONTACT = {
  wa: 'https://wa.me/6281110631132',
  waDisplay: '0811-1063-1132',
  email: 'bisnis@apps.ipb.ac.id',
  phone: '+62 251 8622642',
  address: 'Jl. Raya Dramaga, Kampus IPB Dramaga, Bogor 16680',
  maps: 'https://share.google/Tc86vksGh7pPZNuMX',
  instagram: 'https://www.instagram.com/botanimartipb/',
  tiktok: 'https://www.tiktok.com/@botanimart',
  shopee: 'https://shopee.co.id/ipb_mart',
}

// Kategori asli sesuai katalog Botani Mart
export const REAL_CATEGORIES = [
  'Bibit Tanaman Buah',
  'Tanaman Hias',
  'Tabulampot',
  'Aneka Benih Sayuran',
  'Media Tanam & Pupuk',
  'Peralatan Berkebun',
]

export function Footer() {
  const goHome = useAppStore((s) => s.goHome)
  const goCatalog = useAppStore((s) => s.goCatalog)
  const goAbout = useAppStore((s) => s.goAbout)
  const goChat = useAppStore((s) => s.goChat)

  const socials = [
    { label: 'WhatsApp', href: CONTACT.wa, Icon: MessageCircle },
    { label: 'Instagram', href: CONTACT.instagram, Icon: Instagram },
    { label: 'TikTok', href: CONTACT.tiktok, Icon: Music2 },
    { label: 'Shopee', href: CONTACT.shopee, Icon: ShoppingBag },
  ]

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
            <p className="mt-2 text-sm font-medium text-primary">
              The One Stop Garden Shop — Green-ing Your Life
            </p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Unit bisnis retail agribisnis di bawah Direktorat Pengelola Usaha Kampus (DPUK)
              IPB University. Pusat kebutuhan tanaman dan perlengkapan berkebun di Kampus IPB
              Dramaga, Bogor.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href={CONTACT.wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp {CONTACT.waDisplay}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <Mail className="h-4 w-4 text-primary" /> {CONTACT.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> {CONTACT.phone}
              </span>
              <a
                href={CONTACT.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <MapPin className="h-4 w-4 text-primary" /> {CONTACT.address}
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
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
              <li>
                <a
                  href={CONTACT.wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  Pesan via WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">
              Kategori
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {REAL_CATEGORIES.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => goCatalog({ category: c })}
                    className="text-left text-muted-foreground hover:text-primary"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Botani Mart — Unit Bisnis DPUK IPB University.</p>
          <p>Buka Senin-Minggu, 08.00-16.00 WIB.</p>
        </div>
      </div>
    </footer>
  )
}
