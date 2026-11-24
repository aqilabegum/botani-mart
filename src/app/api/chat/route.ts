import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { findProducts } from '@/lib/data'
import type { ChatMessage } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 30

type Body = {
  message: string
  history?: ChatMessage[]
}

// Build a compact product catalog as context for the LLM
async function buildCatalogContext(): Promise<string> {
  const items = await findProducts({})
  const lines = items.map(
    (p) =>
      `- ${p.name} | slug: ${p.slug} | kategori: ${p.category} | harga: Rp${p.price.toLocaleString(
        'id-ID'
      )}/${p.unit} | ${p.short}`
  )
  return lines.join('\n')
}

const SYSTEM_PROMPT = `Kamu adalah "Asisten Botani Mart", asisten AI untuk platform katalog produk pertanian Botani Mart.

Tugas kamu:
1. Membantu pengguna (petani, mahasiswa pertanian, pehobi tanaman) menemukan produk yang tepat dari katalog.
2. Menjelaskan manfaat, cara penggunaan, dan tips bertani secara singkat & praktis.
3. Merekomendasikan produk dari katalog bila relevan.

Gaya jawaban:
- Bahasa Indonesia yang ramah, hangat, dan ringkas (3-6 kalimat).
- Selalu pakai istilah pertanian yang umum dipahami.
- Jika ditanya di luar topik pertanian, arahkan kembali ke topik pertanian dengan sopan.

PENTING tentang rekomendasi produk:
- Hanya rekomendasikan produk yang ada di KATALOG di bawah ini. Jangan mengarang nama produk.
- Jika ada produk yang relevan dengan pertanyaan, sebutkan nama produknya secara natural dalam jawabanmu.
- Format output jawaban biasa (teks). Jangan pakai markdown atau simbol **.

KATALOG PRODUK BOTANI MART:
{CATALOG}`

export async function POST(req: Request) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 })
  }

  const message = (body.message || '').trim()
  if (!message) {
    return NextResponse.json({ error: 'Pesan kosong' }, { status: 400 })
  }

  const history = Array.isArray(body.history) ? body.history.slice(-10) : []

  try {
    const catalog = await buildCatalogContext()
    const system = SYSTEM_PROMPT.replace('{CATALOG}', catalog)

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: system },
        ...history.map((h) => ({
          role: h.role === 'user' ? ('user' as const) : ('assistant' as const),
          content: h.content,
        })),
        { role: 'user', content: message },
      ],
      thinking: { type: 'disabled' },
      temperature: 0.7,
    })

    const reply =
      completion.choices[0]?.message?.content ||
      'Maaf, saya belum bisa menjawab saat ini. Coba pertanyaan lain ya.'

    // Detect which catalog products are mentioned in the reply, return their slugs
    const all = await findProducts({})
    const lower = reply.toLowerCase()
    const mentioned = all
      .filter((p) => lower.includes(p.name.toLowerCase()) || lower.includes(p.slug.toLowerCase()))
      .map((p) => p.slug)
      .slice(0, 3)

    return NextResponse.json({ reply, products: mentioned, placeholder: false })
  } catch (err) {
    console.error('[chat] LLM error:', err)
    return NextResponse.json(
      {
        reply:
          'Maaf, asisten AI sedang mengalami gangguan teknis. Sementara itu, kamu bisa menjelajahi katalog produk kami dulu ya.',
        products: [],
        placeholder: true,
      },
      { status: 200 }
    )
  }
}
