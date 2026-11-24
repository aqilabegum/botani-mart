'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, GraduationCap, Clock, Sprout } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

export function Hero() {
  const goCatalog = useAppStore((s) => s.goCatalog)
  const goChat = useAppStore((s) => s.goChat)

  return (
    <section className="relative overflow-hidden border-b-4 border-accent bg-gradient-to-br from-[#06066e] via-[#0a0a8c] to-[#1c2db5] text-white">
      {/* Decorative grain + blobs */}
      <div className="bg-grain-clay absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-lg bg-accent/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-lg bg-white/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:py-28">
        {/* Text */}
        <div className="text-center md:text-left">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#14163a]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            The One Stop Garden Shop
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-5 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl md:text-6xl"
          >
            Green-ing your life, semua kebutuhan tanamanmu ada di sini.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-5 max-w-xl text-base text-white/85 md:mx-0 md:text-lg"
          >
            Koleksi tanaman pilihan, bibit tanaman buah, tanaman hias, tabulampot, benih
            varietas IPB, media tanam, dan peralatan berkebun — langsung dari Kampus IPB
            Dramaga, Bogor. Pesan mudah lewat website atau WhatsApp.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start"
          >
            <button
              onClick={() => goCatalog()}
              className="group inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-[#14163a] shadow-lg transition-all hover:shadow-xl hover:brightness-95"
            >
              Lihat Katalog
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => goChat()}
              className="inline-flex items-center gap-2 rounded-md border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
            >
              <Sparkles className="h-4 w-4" />
              Tanya Asisten AI
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 justify-center text-sm text-white/80 md:justify-start"
          >
            <span className="inline-flex items-center gap-2">
              <Sprout className="h-4 w-4" /> 100+ Produk Asli Katalog
            </span>
            <span className="inline-flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Dikelola DPUK IPB University
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" /> Buka Setiap Hari 08.00-16.00 WIB
            </span>
          </motion.div>
        </div>

        {/* Visual collage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative hidden h-[400px] md:block"
        >
          <div className="absolute right-0 top-4 flex h-56 w-56 items-center justify-center rounded-lg bg-white/15 text-8xl backdrop-blur-sm">
            🌿
          </div>
          <div className="absolute left-0 top-32 flex h-44 w-44 items-center justify-center rounded-lg bg-accent/30 text-7xl backdrop-blur-sm">
            🪴
          </div>
          <div className="absolute bottom-0 right-12 flex h-40 w-40 items-center justify-center rounded-lg bg-white/15 text-6xl backdrop-blur-sm">
            🍊
          </div>
          <div className="absolute bottom-12 left-10 flex h-32 w-32 items-center justify-center rounded-lg bg-accent/20 text-5xl backdrop-blur-sm">
            🧺
          </div>
        </motion.div>
      </div>
    </section>
  )
}
