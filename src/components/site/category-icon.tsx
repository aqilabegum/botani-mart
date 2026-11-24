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
  'Bibit Tanaman Buah': 'from-blue-700/15 to-blue-800/5',
  'Tanaman Hias': 'from-indigo-500/15 to-indigo-600/5',
  Tabulampot: 'from-sky-500/15 to-sky-600/5',
  'Aneka Benih Sayuran': 'from-cyan-500/15 to-cyan-600/5',
  'Media Tanam & Pupuk': 'from-amber-500/20 to-amber-600/5',
  'Peralatan Berkebun': 'from-slate-500/15 to-slate-600/5',
}
