// Data access layer for Botani Mart
import { db } from '@/lib/db'
import { normalizeProduct } from '@/lib/format'

export async function findProducts(opts: {
  q?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
}) {
  const { q, category, minPrice, maxPrice, sort } = opts
  const where: Record<string, unknown> = {}
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { short: { contains: q } },
      { description: { contains: q } },
    ]
  }
  if (category) where.category = category
  const price: Record<string, number> = {}
  if (minPrice) price.gte = minPrice
  if (maxPrice) price.lte = maxPrice
  if (Object.keys(price).length) where.price = price

  let orderBy: Record<string, string> = { name: 'asc' }
  if (sort === 'price_asc') orderBy = { price: 'asc' }
  else if (sort === 'price_desc') orderBy = { price: 'desc' }

  // SQLite is case-sensitive for contains; do a post-filter for case-insensitive search
  const rows = await db.product.findMany({
    where: where as never,
    orderBy: orderBy as never,
    take: 200,
  })
  let list = rows.map(normalizeProduct)
  if (q) {
    const needle = q.toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.short.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle)
    )
  }
  return list
}

export async function findProduct(slug: string) {
  const p = await db.product.findUnique({ where: { slug } })
  if (!p) return null
  return normalizeProduct(p)
}

export async function findCategories() {
  const rows = await db.category.findMany({ orderBy: { name: 'asc' } })
  return rows.map((c) => ({ name: c.name, icon: c.icon, blurb: c.blurb }))
}

export async function findCategoryNames() {
  const rows = await db.product.findMany({
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  })
  return rows.map((r) => r.category)
}

export async function findFeaturedProducts(limit = 4) {
  const rows = await db.product.findMany({ take: limit, orderBy: { createdAt: 'asc' } })
  return rows.map(normalizeProduct)
}

export async function findRelatedProducts(category: string, excludeSlug: string, limit = 3) {
  const rows = await db.product.findMany({
    where: { category, slug: { not: excludeSlug } },
    take: limit,
  })
  return rows.map(normalizeProduct)
}
