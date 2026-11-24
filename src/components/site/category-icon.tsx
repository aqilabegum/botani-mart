'use client'

import {
  Sprout,
  Flower2,
  TreeDeciduous,
  Package,
  Wrench,
  Layers,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  seedling: Sprout,
  flower: Flower2,
  tree: TreeDeciduous,
  package: Package,
  layers: Layers,
  wrench: Wrench,
}

export function CategoryIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const Icon = ICONS[name] ?? Sprout
  return <Icon className={className} />
}

// Kategori asli Botani Mart (sesuai katalog resmi)
export const CATEGORY_GRADIENTS: Record<string, string> = {
  'Bibit Tanaman Buah': 'from-emerald-500/15 to-emerald-600/5',
  'Tanaman Hias': 'from-pink-500/15 to-pink-600/5',
  Tabulampot: 'from-teal-500/15 to-teal-600/5',
  'Aneka Benih Sayuran': 'from-lime-500/15 to-lime-600/5',
  'Media Tanam & Pupuk': 'from-orange-500/15 to-orange-600/5',
  'Peralatan Berkebun': 'from-stone-500/15 to-stone-600/5',
}
