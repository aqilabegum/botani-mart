'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  Sparkles,
  Sprout,
  Recycle,
  MessageCircle,
  Flower2,
  TreeDeciduous,
  Package,
  Wrench,
  Layers,
} from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { ProductCard } from '@/components/site/product-card'
import { rp } from '@/lib/format'
import type { Product } from '@/lib/types'

// Kategori asli Botani Mart (sesuai katalog resmi)
const USAGE_ICONS: Record<string, typeof Sprout> = {
  'Bibit Tanaman Buah': Sprout,
  'Tanaman Hias': Flower2,
  Tabulampot: TreeDeciduous,
  'Aneka Benih Sayuran': Package,
  'Media Tanam & Pupuk': Layers,
  'Peralatan Berkebun': Wrench,
}

// Nomor WhatsApp resmi Botani Mart IPB
const WA_NUMBER = '6281110631132'

export function DetailView({ slug }: { slug: string }) {
  const goCatalog = useAppStore((s) => s.goCatalog)
  const goChat = useAppStore((s) => s.goChat)
  const goDetail = useAppStore((s) => s.goDetail)

  const [data, setData] = useState<{ product: Product; related: Product[] } | null>(null)
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const run = async () => {
      setLoading(true)
      setErr(false)
      setData(null)
      try {
        const r = await fetch(`/api/products/${slug}`, { signal: controller.signal })
        if (!r.ok) throw new Error('not found')
        const d = await r.json()
        setData(d)
      } catch {
        setErr(true)
      } finally {
        setLoading(false)
      }
    }
    run()
    return () => controller.abort()
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="h-80 animate-pulse rounded-xl bg-secondary/40" />
          <div className="space-y-4">
            <div className="h-6 w-24 animate-pulse rounded bg-secondary/40" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-secondary/40" />
            <div className="h-8 w-32 animate-pulse rounded bg-secondary/40" />
            <div className="h-24 w-full animate-pulse rounded bg-secondary/40" />
          </div>
        </div>
      </div>
    )
  }

  if (err || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-semibold">Produk tidak ditemukan</h1>
        <p className="mt-3 text-muted-foreground">
          Produk yang kamu cari mungkin telah dipindahkan atau tidak tersedia.
        </p>
        <button
          onClick={goCatalog}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
        </button>
      </div>
    )
  }

  const { product: p, related } = data
  const UsageIcon = USAGE_ICONS[p.category] ?? Sprout

  // Link pesan langsung ke WhatsApp resmi Botani Mart
  const waText = encodeURIComponent(
    `Halo Botani Mart! Saya tertarik dengan produk "${p.name}" (kategori: ${p.category}) yang ada di website. Apakah masih tersedia?`
  )
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waText}`

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={goCatalog}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Katalog
      </button>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative flex h-80 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-secondary to-secondary/40 shadow-sm md:h-[440px]"
        >
          <div className="bg-grain absolute inset-0 opacity-50" />
          <span className="relative text-[10rem] md:text-[12rem]">{p.emoji}</span>
          <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-md bg-background/85 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur">
            <UsageIcon className="h-3.5 w-3.5" />
            {p.category}
          </span>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="flex flex-col"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {p.category}
          </span>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {p.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-semibold text-primary">
              {p.price > 0 ? rp(p.price) : 'Hubungi kami'}
            </span>
            <span className="text-sm text-muted-foreground">
              {p.price > 0 ? `/ ${p.unit}` : '— pesan via WhatsApp'}
            </span>
          </div>

          <p className="mt-5 text-base leading-relaxed text-foreground/90">{p.description}</p>

          {/* Benefits */}
          <div className="mt-7">
            <h2 className="font-serif text-lg font-semibold">Manfaat Utama</h2>
            <ul className="mt-3 space-y-2">
              {p.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-foreground/90">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Usage */}
          <div className="mt-7 rounded-lg border border-border/60 bg-secondary/30 p-5">
            <div className="flex items-center gap-2">
              <Recycle className="h-4 w-4 text-primary" />
              <h2 className="font-serif text-base font-semibold">Tips Perawatan</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{p.usage}</p>
          </div>

          {/* CTA */}
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-95"
            >
              <MessageCircle className="h-4 w-4" />
              {p.price > 0 ? 'Pesan via WhatsApp' : 'Tanya Harga via WhatsApp'}
            </a>
            <button
              onClick={() => goChat()}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              <Sparkles className="h-4 w-4" />
              Tanya Asisten AI
            </button>
            <button
              onClick={goCatalog}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              Lihat Produk Lain
            </button>
          </div>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 sm:mt-20">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Produk Serupa
            </h2>
            <button
              onClick={() => goCatalog({ category: p.category })}
              className="text-sm font-medium text-primary hover:underline"
            >
              Lihat semua di {p.category}
            </button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
            {related.map((rel, i) => (
              <ProductCard
                key={rel.slug}
                p={rel}
                index={i}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
