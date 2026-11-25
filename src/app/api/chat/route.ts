import { NextResponse } from 'next/server'
import { findProducts } from '@/lib/data'

export const runtime = 'nodejs'
export const maxDuration = 60

type Body = {
  message: string
  history?: {
    role: 'user' | 'assistant'
    content: string
  }[]
}

// Konfigurasi Gemini API (diambil dari environment variable)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

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

type GeminiPart = { text?: string }
type GeminiResponse = {
  candidates?: { content?: { parts?: GeminiPart[] }; finishReason?: string }[]
  promptFeedback?: { blockReason?: string }
  error?: { message?: string }
}

// Panggil Gemini API (REST, tanpa SDK tambahan).
// History diawali pesan welcome dari assistant, sedangkan Gemini mewajibkan
// turn pertama ber-role "user", jadi pesan assistant di awal dibuang.
async function askGemini(system: string, history: ChatMessage[], message: string): Promise<string> {
  const turns = [...history]
  while (turns.length && turns[0].role !== 'user') turns.shift()

  const contents = [
    ...turns.map((h) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ]

  const generationConfig: Record<string, unknown> = {
    temperature: 0.7,
    maxOutputTokens: 1024,
  }
  // Nonaktifkan "thinking" pada model Gemini 2.5 agar jawaban cepat & hemat token
  if (/gemini-(2\.5|3)/.test(GEMINI_MODEL)) {
    generationConfig.thinkingConfig = { thinkingBudget: 0 }
  }

  const res = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig,
    }),
    signal: AbortSignal.timeout(25_000),
  })

  const data = (await res.json().catch(() => ({}))) as GeminiResponse
  if (!res.ok) {
    throw new Error(`Gemini API ${res.status}: ${data.error?.message || res.statusText}`)
  }

  const text = (data.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || '')
    .join('')
    .trim()
  if (!text) {
    const reason = data.candidates?.[0]?.finishReason || data.promptFeedback?.blockReason
    throw new Error(`Gemini tidak mengembalikan jawaban${reason ? ` (${reason})` : ''}`)
  }
  return text
}

export async function POST(req: Request) {
  let body: Body

  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json(
      { error: 'Body tidak valid' },
      { status: 400 }
    )
  }

  const message = (body.message || '').trim()

  if (!message) {
    return NextResponse.json(
      { error: 'Pesan kosong' },
      { status: 400 }
    )
  }

  const ragApiUrl =
    process.env.RAG_API_URL || 'http://127.0.0.1:8000'

  try {
    const ragResponse = await fetch(`${ragApiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: message,
        history: body.history ?? [],
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(90000),
    })

    if (!ragResponse.ok) {
      const errorText = await ragResponse.text()
      throw new Error(
        `RAG API ${ragResponse.status}: ${errorText}`
      )
    }

    const ragData = await ragResponse.json()
    const reply = ragData.answer?.trim()

    if (!reply) {
      throw new Error('Jawaban dari RAG API kosong.')
    }

    // Mencocokkan produk yang disebutkan AI
    // agar kartu produk website tetap bisa ditampilkan.
    const all = await findProducts({})
    const lower = reply.toLowerCase()

    const mentioned = all
      .filter(
        (p) =>
          lower.includes(p.name.toLowerCase()) ||
          lower.includes(p.slug.toLowerCase())
      )
      .map((p) => p.slug)
      .slice(0, 3)

    return NextResponse.json({
      reply,
      products: mentioned,
      placeholder: false,
    })
  } catch (err) {
    console.error('[chat] RAG API error:', err)

    return NextResponse.json(
      {
        reply:
          'Maaf, Asisten AI sedang tidak dapat dihubungi. Pastikan RAG backend FastAPI sedang berjalan.',
        products: [],
        placeholder: true,
      },
      { status: 200 }
    )
  }
}
