'use client'

import { create } from 'zustand'
import type { View } from '@/lib/types'

type AppState = {
  view: View
  selectedSlug: string | null
  catalogQuery: string
  catalogCategory: string
  catalogSort: string
  // actions
  goHome: () => void
  goCatalog: (opts?: { q?: string; category?: string; sort?: string }) => void
  goDetail: (slug: string) => void
  goAbout: () => void
  goChat: () => void
  setCatalogParam: (key: 'q' | 'category' | 'sort', value: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  view: 'home',
  selectedSlug: null,
  catalogQuery: '',
  catalogCategory: '',
  catalogSort: '',

  goHome: () => set({ view: 'home', selectedSlug: null }),
  goCatalog: (opts) =>
    set({
      view: 'catalog',
      selectedSlug: null,
      catalogQuery: opts?.q ?? get().catalogQuery,
      catalogCategory: opts?.category ?? get().catalogCategory,
      catalogSort: opts?.sort ?? get().catalogSort,
    }),
  goDetail: (slug) => set({ view: 'detail', selectedSlug: slug }),
  goAbout: () => set({ view: 'about', selectedSlug: null }),
  goChat: () => set({ view: 'chat', selectedSlug: null }),
  setCatalogParam: (key, value) =>
    set((state) => ({
      ...state,
      [key === 'q' ? 'catalogQuery' : key === 'category' ? 'catalogCategory' : 'catalogSort']:
        value,
    })),
}))
