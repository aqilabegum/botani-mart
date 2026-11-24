'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { rp } from '@/lib/format'
import { useAppStore } from '@/store/app-store'
import type { Product } from '@/lib/types'

export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const goDetail = useAppStore((s) => s.goDetail)

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      onClick={() => goDetail(p.slug)}
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/40"
    >
      {/* Visual */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-secondary to-secondary/60">
        <div className="bg-grain absolute inset-0 opacity-60" />
        <span className="absolute inset-0 flex items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-110">
          {p.emoji}
        </span>
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-primary backdrop-blur">
          {p.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-serif text-base font-semibold leading-snug text-foreground line-clamp-2">
          {p.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{p.short}</p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="font-serif text-lg font-semibold text-primary">{rp(p.price)}</p>
            <p className="text-xs text-muted-foreground">/ {p.unit}</p>
          </div>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.button>
  )
}
