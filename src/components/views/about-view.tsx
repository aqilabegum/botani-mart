'use client'

import { motion } from 'framer-motion'
import { Sprout, Target, Compass, Users, Sparkles, BookOpen } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

const VALUES = [
  {
    icon: BookOpen,
    title: 'Informatif',
    desc: 'Setiap produk dilengkapi manfaat, cara penggunaan, dan tips praktis.',
  },
  {
    icon: Sprout,
    title: 'Terpercaya',
    desc: 'Katalog dikurasi untuk petani, mahasiswa, dan pegiat tanaman.',
  },
  {
    icon: Sparkles,
    title: 'Cerdas',
    desc: 'Asisten AI membantu rekomendasi produk dan edukasi pertanian.',
  },
]

export function AboutView() {
  const goCatalog = useAppStore((s) => s.goCatalog)
  const goChat = useAppStore((s) => s.goChat)

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
          Botani Mart
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Platform informasi & katalog produk pertanian yang membantu petani, mahasiswa, dan
          pehobi tanaman menemukan produk yang tepat serta memahami cara menggunakannya.
        </p>
      </motion.div>

      {/* Vision / Mission */}
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
            <Target className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-serif text-xl font-semibold">Visi</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Mewujudkan pertanian Indonesia yang lebih produktif melalui akses informasi yang
            mudah, akurat, dan inklusif untuk semua kalangan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
            <Compass className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-serif text-xl font-semibold">Misi</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li>• Menyediakan katalog produk pertanian yang lengkap & informatif.</li>
            <li>• Memberdayakan petani dengan pengetahuan praktis.</li>
            <li>• Mendukung pertanian berkelanjutan & ramah lingkungan.</li>
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
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
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
        className="mt-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground shadow-md"
      >
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6" />
          <h2 className="font-serif text-xl font-semibold">Untuk Siapa?</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-primary-foreground/90">
          Botani Mart dirancang untuk petani praktisi, mahasiswa pertanian, peneliti, hingga
          pehobi tanaman urban yang ingin mengembangkan kebun di lahan sempit. Semua bisa akses
          informasi produk dan edukasi pertanian dalam satu tempat.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={goCatalog}
            className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:brightness-95"
          >
            Jelajahi Katalog
          </button>
          <button
            onClick={goChat}
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 bg-primary-foreground/10 px-5 py-2.5 text-sm font-semibold text-primary-foreground backdrop-blur transition-all hover:bg-primary-foreground/20"
          >
            <Sparkles className="h-4 w-4" /> Tanya Asisten AI
          </button>
        </div>
      </motion.div>
    </div>
  )
}
