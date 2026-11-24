// Format helpers
export const rp = (n: number): string => 'Rp' + n.toLocaleString('id-ID')

// Convert a Prisma product (benefits stored as JSON string) to a clean Product type
export function normalizeProduct(p: {
  slug: string
  name: string
  category: string
  price: number
  unit: string
  emoji: string
  short: string
  description: string
  benefits: string
  usage: string
}) {
  let benefits: string[] = []
  try {
    benefits = JSON.parse(p.benefits)
  } catch {
    benefits = []
  }
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    unit: p.unit,
    emoji: p.emoji,
    short: p.short,
    description: p.description,
    benefits,
    usage: p.usage,
  }
}
