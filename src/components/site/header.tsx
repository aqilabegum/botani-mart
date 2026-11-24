'use client'

import { useState } from 'react'
import { Menu, X, Sprout } from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { ThemeToggle } from '@/components/site/theme-toggle'
import { cn } from '@/lib/utils'
import type { View } from '@/lib/types'

const NAV: { label: string; view: View }[] = [
  { label: 'Beranda', view: 'home' },
  { label: 'Katalog', view: 'catalog' },
  { label: 'Tentang', view: 'about' },
  { label: 'Asisten AI', view: 'chat' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const view = useAppStore((s) => s.view)
  const goHome = useAppStore((s) => s.goHome)
  const goCatalog = useAppStore((s) => s.goCatalog)
  const goAbout = useAppStore((s) => s.goAbout)
  const goChat = useAppStore((s) => s.goChat)

  const handleNav = (v: View) => {
    setOpen(false)
    if (v === 'home') goHome()
    else if (v === 'catalog') goCatalog()
    else if (v === 'about') goAbout()
    else if (v === 'chat') goChat()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => handleNav('home')}
          className="group flex items-center gap-2.5"
          aria-label="Beranda Botani Mart"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
            Botani Mart
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNav(item.view)}
              className={cn(
                'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                view === item.view
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label}
              {view === item.view && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground md:hidden"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {NAV.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNav(item.view)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                  view === item.view
                    ? 'bg-secondary text-primary'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
