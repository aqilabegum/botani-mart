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
