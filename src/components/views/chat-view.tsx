'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Bot, User, Loader2, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { rp } from '@/lib/format'
import type { ChatMessage, ChatResponse, Product } from '@/lib/types'

type Msg = ChatMessage & { id: number; products?: string[] }

const TIPS = [
  'Pupuk apa yang cocok untuk cabai?',
  'Cara mengatasi hama kutu daun',
  'Rekomendasi alat untuk pemula',
  'Media tanam terbaik untuk polybag',
]

const WELCOME: Msg = {
  id: 0,
  role: 'assistant',
  content:
    'Halo! Saya Asisten Botani Mart. Tanya apa saja seputar produk pertanian, rekomendasi, atau cara penggunaan. Mau mulai dari mana?',
}

export function ChatView() {
  const goDetail = useAppStore((s) => s.goDetail)

  const [msgs, setMsgs] = useState<Msg[]>([WELCOME])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [recMap, setRecMap] = useState<Record<string, Product>>({})

  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, busy])

  async function fetchRecommended(slugs: string[]) {
    if (!slugs.length) return
    const next: Record<string, Product> = { ...recMap }
    await Promise.all(
      slugs.map(async (slug) => {
        if (next[slug]) return
        try {
          const r = await fetch(`/api/products/${slug}`)
          if (!r.ok) return
          const d = await r.json()
          next[slug] = d.product
        } catch {}
      })
    )
    setRecMap(next)
  }

  async function send(m = text) {
    const content = m.trim()
    if (!content || busy) return
    const history: ChatMessage[] = msgs.map((x) => ({ role: x.role, content: x.content }))
    const userMsg: Msg = { id: Date.now(), role: 'user', content }
    setMsgs((x) => [...x, userMsg])
    setText('')
    setBusy(true)
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history }),
      })
      const d: ChatResponse = await r.json()
      const aiMsg: Msg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: d.reply,
        products: d.products,
      }
      setMsgs((x) => [...x, aiMsg])
      if (d.products?.length) fetchRecommended(d.products)
    } catch {
      setMsgs((x) => [
        ...x,
        {
          id: Date.now() + 2,
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan koneksi. Coba lagi ya.',
        },
      ])
    }
    setBusy(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-10">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
          <Sparkles className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Asisten AI Botani Mart
          </h1>
          <p className="text-sm text-muted-foreground">
            Tanya seputar produk pertanian & rekomendasi.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="scroll-organic flex h-[55vh] min-h-[360px] flex-col gap-4 overflow-y-auto rounded-xl border border-border/60 bg-card p-4 shadow-sm sm:p-6">
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <span
                className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg ${
                  m.role === 'user'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>
              <div className={`max-w-[85%] ${m.role === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`inline-block rounded-lg px-4 py-2.5 text-left text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  {m.content}
                </div>

                {/* Recommended product cards */}
                {m.products && m.products.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {m.products.map((slug) => {
                      const p = recMap[slug]
                      if (!p) return null
                      return (
                        <button
                          key={slug}
                          onClick={() => goDetail(slug)}
                          className="group flex w-full items-center gap-3 rounded-xl border border-border/60 bg-background p-3 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                        >
                          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-secondary text-xl">
                            {p.emoji}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {p.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {p.category} • {rp(p.price)}/{p.unit}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 flex-none text-muted-foreground transition-colors group-hover:text-primary" />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {busy && (
          <div className="flex gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </span>
            <div className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Mengetik…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Tips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {TIPS.map((t) => (
          <button
            key={t}
            onClick={() => send(t)}
            disabled={busy}
            className="rounded-md border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Tulis pertanyaan pertanian kamu…"
          disabled={busy}
          className="h-12 flex-1 rounded-xl border border-border bg-card px-4 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
        />
        <button
          onClick={() => send()}
          disabled={busy || !text.trim()}
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:brightness-95 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Kirim
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Asisten AI bisa saja membuat kesalahan. Verifikasi info pentang produk sebelum dipakai.
      </p>
    </div>
  )
}
