import { NextResponse } from 'next/server'
import { findProduct, findRelatedProducts } from '@/lib/data'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const product = await findProduct(slug)
  if (!product) {
    return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 })
  }
  const related = await findRelatedProducts(product.category, product.slug, 3)
  return NextResponse.json({ product, related })
}
