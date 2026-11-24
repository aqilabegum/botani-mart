'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ShieldCheck, MessageCircle, HeartHandshake } from 'lucide-react'
import { Hero } from '@/components/views/hero'
import { ProductCard } from '@/components/site/product-card'
import { CategoryIcon, CATEGORY_GRADIENTS } from '@/components/site/category-icon'
import { useAppStore } from '@/store/app-store'
import type { CategoryInfo, Product } from '@/lib/types'

export function HomeView() {
  const goCatalog = useAppStore((s) => s.goCatalog)
  const goChat = useAppStore((s) => s.goChat)

  const [cats, setCats] = useState<CategoryInfo[]>([])
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ok = true
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
    ])
      .then(([c, p]) => {
        if (!ok) return
        setCats(c)
        setItems(p.slice(0, 4))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
    return () => {
      ok = false
    }
  }, [])

  return (
    <>
      <Hero />

      {/* Kategori */}
      <section className="bg-grain border-b border-border/60 bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Jelajahi
              </span>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                Kategori Produk
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Enam kategori asli Botani Mart: dari bibit buah dan tanaman hias hingga
                peralatan berkebun.
              </p>
            </div>
            <button
              onClick={() => goCatalog()}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Lihat semua
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {cats.map((c, i) => (
              <motion.button
                key={c.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.4) }}
                onClick={() => goCatalog({ category: c.name })}
                className={`group relative flex flex-col items-start gap-3 overflow-hidden rounded-lg border border-border/60 bg-gradient-to-br p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  CATEGORY_GRADIENTS[c.name] ?? 'from-secondary to-secondary/40'
                }`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-background text-primary shadow-sm transition-transform group-hover:scale-110">
                  <CategoryIcon name={c.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-base font-semibold text-foreground">{c.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.blurb}</p>
                </div>
                <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Produk Pilihan */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Kurasi Pilihan
              </span>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                Produk Pilihan
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Beberapa produk favorit untuk memulai kebun hijau kamu.
              </p>
            </div>
            <button
              onClick={() => goCatalog()}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Semua produk
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-lg border border-border/60 bg-secondary/40"
                  />
                ))
              : items.map((p, i) => <ProductCard key={p.slug} p={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Pesan via WhatsApp CTA */}
      <section className="border-b border-border/60 bg-secondary/40 py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <MessageCircle className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Suka produknya? Pesan langsung via WhatsApp.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Setiap produk di katalog punya tombol pesan yang langsung terhubung ke WhatsApp
              resmi Botani Mart (0811-1063-1132). Tim kami siap bantu ketersediaan dan harga.
            </p>
          </div>
          <a
            href="https://wa.me/6281110631132"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:brightness-95"
          >
            <MessageCircle className="h-4 w-4" />
            Chat Botani Mart
          </a>
        </div>
      </section>

      {/* Asisten AI CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <Sparkles className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Bingung pilih tanaman? Tanya Asisten AI.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Asisten AI Botani Mart siap bantu merekomendasikan tanaman dan menjelaskan tips
              perawatan sesuai kebutuhan kamu.
            </p>
          </div>
          <button
            onClick={() => goChat()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:brightness-95"
          >
            <Sparkles className="h-4 w-4" />
            Mulai Tanya Asisten
          </button>
        </div>
      </section>

      {/* Value props */}
      <section className="border-t border-border/60 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Resmi & Terpercaya',
                desc: 'Unit bisnis retail agribisnis di bawah DPUK IPB University, aktif sejak 2018.',
              },
              {
                icon: MessageCircle,
                title: 'Katalog Lengkap',
                desc: 'Bibit buah, tanaman hias, tabulampot, benih varietas IPB, media tanam & pupuk, hingga peralatan berkebun.',
              },
              {
                icon: HeartHandshake,
                title: 'Untuk Semua',
                desc: 'Pecinta tanaman, pehobi urban farming, mahasiswa, hingga masyarakat umum.',
              },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 12 }}
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
      </section>
    </>
  )
}
