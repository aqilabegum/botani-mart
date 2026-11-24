'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/site/product-card'
import { useAppStore } from '@/store/app-store'
import type { CategoryInfo, Product } from '@/lib/types'

export function CatalogView() {
  const q = useAppStore((s) => s.catalogQuery)
  const category = useAppStore((s) => s.catalogCategory)
  const sort = useAppStore((s) => s.catalogSort)
  const setCatalogParam = useAppStore((s) => s.setCatalogParam)

  const [items, setItems] = useState<Product[]>([])
  const [cats, setCats] = useState<CategoryInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCats)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    if (sort) params.set('sort', sort)
    const runFetch = async () => {
      setLoading(true)
      try {
        const r = await fetch(`/api/products?${params}`)
        const d = await r.json()
        setItems(d)
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    const t = setTimeout(runFetch, 200)
    return () => clearTimeout(t)
  }, [q, category, sort])

  const hasFilter = q || category || sort

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Katalog
        </span>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Jelajahi Produk Pertanian
        </h1>
        <p className="mt-2 text-muted-foreground">
          Cari, filter, dan urutkan produk sesuai kebutuhan kamu.
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setCatalogParam('q', e.target.value)}
            placeholder="Cari produk, mis. 'cabai', 'pupuk'…"
            className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-9 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {q && (
            <button
              onClick={() => setCatalogParam('q', '')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-secondary"
              aria-label="Bersihkan pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={category}
              onChange={(e) => setCatalogParam('category', e.target.value)}
              className="h-11 rounded-xl border border-border bg-card pl-9 pr-8 text-sm shadow-sm outline-none transition-colors focus:border-primary"
            >
              <option value="">Semua kategori</option>
              {cats.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <select
            value={sort}
            onChange={(e) => setCatalogParam('sort', e.target.value)}
            className="h-11 rounded-xl border border-border bg-card px-3 text-sm shadow-sm outline-none transition-colors focus:border-primary"
          >
            <option value="">Nama A-Z</option>
            <option value="price_asc">Harga terendah</option>
            <option value="price_desc">Harga tertinggi</option>
          </select>
        </div>
      </div>

      {/* Quick category chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCatalogParam('category', '')}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            !category
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
          }`}
        >
          Semua
        </button>
        {cats.map((c) => (
          <button
            key={c.name}
            onClick={() => setCatalogParam('category', c.name)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              category === c.name
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Result meta */}
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {loading ? 'Memuat…' : `${items.length} produk ditemukan`}
        </span>
        {hasFilter && (
          <button
            onClick={() => {
              setCatalogParam('q', '')
              setCatalogParam('category', '')
              setCatalogParam('sort', '')
            }}
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <X className="h-3.5 w-3.5" /> Reset filter
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl border border-border/60 bg-secondary/40"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 py-20 text-center"
        >
          <Search className="h-10 w-10 text-muted-foreground/60" />
          <h3 className="font-serif text-xl font-semibold">Produk tidak ditemukan</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Coba ubah kata kunci atau hapus filter yang aktif.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.slug} p={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
