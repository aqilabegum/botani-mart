'use client'

import { motion } from 'framer-motion'
import {
  Sprout,
  Target,
  Compass,
  Users,
  Sparkles,
  BookOpen,
  MapPin,
  Clock,
  MessageCircle,
  Instagram,
  Music2,
  ShoppingBag,
} from 'lucide-react'
import { useAppStore } from '@/store/app-store'

const VALUES = [
  {
    icon: BookOpen,
    title: 'Informatif',
    desc: 'Setiap produk dilengkapi info varietas, harga, dan tips perawatan tanaman.',
  },
  {
    icon: Sprout,
    title: 'Terpercaya',
    desc: 'Unit bisnis resmi di bawah DPUK IPB University, aktif sejak 2018.',
  },
  {
    icon: Sparkles,
    title: 'Cerdas',
    desc: 'Asisten AI membantu rekomendasi produk dan edukasi seputar tanaman.',
  },
]

export function AboutView() {
  const goCatalog = useAppStore((s) => s.goCatalog)
  const goChat = useAppStore((s) => s.goChat)

  const waUrl = 'https://wa.me/6281110631132'
  const socials = [
    { label: 'Instagram', href: 'https://www.instagram.com/botanimartipb/', Icon: Instagram },
    { label: 'TikTok', href: 'https://www.tiktok.com/@botanimart', Icon: Music2 },
    { label: 'Shopee', href: 'https://shopee.co.id/ipb_mart', Icon: ShoppingBag },
    { label: 'WhatsApp', href: waUrl, Icon: MessageCircle },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Tentang Kami
        </span>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Botani Mart IPB
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-primary sm:text-lg">
          The One Stop Garden Shop — Green-ing Your Life
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Botani Mart adalah unit bisnis retail agribisnis di bawah Direktorat Pengelola Usaha
          Kampus (DPUK) IPB University. Aktif sejak 2018, Botani Mart menjadi pusat kebutuhan
          tanaman dan perlengkapan berkebun di Kampus IPB Dramaga, Bogor — menghadirkan koleksi
          tanaman pilihan, bibit unggul, benih varietas IPB, media tanam berkualitas, serta
          berbagai perlengkapan untuk para pecinta tanaman.
        </p>
      </motion.div>

      {/* Vision / Mission */}
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-lg border border-border/60 bg-card p-6 shadow-sm"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
            <Target className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-serif text-xl font-semibold">Visi</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Green-ing Your Life — menghadirkan hidup yang lebih hijau untuk semua kalangan
            melalui tanaman pilihan dan produk pertanian berkualitas hasil riset IPB University.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="rounded-lg border border-border/60 bg-card p-6 shadow-sm"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
            <Compass className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-serif text-xl font-semibold">Misi</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li>• Menyediakan koleksi tanaman, bibit unggul, dan benih varietas IPB berkualitas.</li>
            <li>• Menjadi pusat informasi dan edukasi berkebun bagi pecinta tanaman.</li>
            <li>• Mendukung inovasi kampus dan produk olahan pangan sehat berbasis riset.</li>
          </ul>
        </motion.div>
      </div>

      {/* Values */}
      <div className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">Nilai Kami</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-lg border border-border/60 bg-card p-6 shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <v.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Audience */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mt-12 rounded-lg border-b-4 border-accent bg-gradient-to-br from-[#06066e] via-[#0a0a8c] to-[#1c2db5] p-8 text-white shadow-md"
      >
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6" />
          <h2 className="font-serif text-xl font-semibold">Untuk Siapa?</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/90">
          Botani Mart melayani pecinta tanaman, pehobi urban farming yang berkebun di lahan
          sempit, mahasiswa dan akademisi IPB, hingga masyarakat umum yang ingin menghadirkan
          hijau di rumahnya. Semua bisa menemukan produk dan info perawatan tanaman dalam satu
          tempat.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={goCatalog}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-[#14163a] transition-all hover:brightness-95"
          >
            Jelajahi Katalog
          </button>
          <button
            onClick={goChat}
            className="inline-flex items-center gap-2 rounded-md border border-white/50 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
          >
            <Sparkles className="h-4 w-4" /> Tanya Asisten AI
          </button>
        </div>
      </motion.div>

      {/* Kunjungi Kami */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mt-12 rounded-lg border border-border/60 bg-card p-8 shadow-sm"
      >
        <h2 className="font-serif text-2xl font-semibold tracking-tight">Kunjungi Kami</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-5 w-5 flex-none text-primary" />
            <span>
              Jl. Raya Dramaga, Kampus IPB Dramaga, Bogor 16680, Jawa Barat
              <br />
              <a
                href="https://share.google/Tc86vksGh7pPZNuMX"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block font-medium text-primary hover:underline"
              >
                Lihat di Google Maps
              </a>
            </span>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Clock className="mt-0.5 h-5 w-5 flex-none text-primary" />
            <span>
              Senin - Minggu
              <br />
              08.00 - 16.00 WIB
            </span>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-95"
          >
            <MessageCircle className="h-4 w-4" />
            Chat WhatsApp 0811-1063-1132
          </a>
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
