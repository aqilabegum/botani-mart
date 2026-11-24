import { NextRequest, NextResponse } from 'next/server'
import { findProducts } from '@/lib/data'

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const q = sp.get('q') || undefined
  const category = sp.get('category') || undefined
  const sort = sp.get('sort') || undefined
  const minPrice = sp.get('min_price') ? Number(sp.get('min_price')) : undefined
  const maxPrice = sp.get('max_price') ? Number(sp.get('max_price')) : undefined
  const items = await findProducts({ q, category, sort, minPrice, maxPrice })
  return NextResponse.json(items)
}
