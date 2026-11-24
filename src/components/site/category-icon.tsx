'use client'

import {
  Sprout,
  FlaskConical,
  Leaf,
  Wrench,
  Layers,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  seedling: Sprout,
  'flask-conical': FlaskConical,
  leaf: Leaf,
  wrench: Wrench,
  layers: Layers,
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

export const CATEGORY_GRADIENTS: Record<string, string> = {
  Benih: 'from-emerald-500/15 to-emerald-600/5',
  Pupuk: 'from-amber-500/15 to-amber-600/5',
  'Pestisida Nabati': 'from-lime-500/15 to-lime-600/5',
  'Alat Pertanian': 'from-stone-500/15 to-stone-600/5',
  'Media Tanam': 'from-orange-500/15 to-orange-600/5',
}
