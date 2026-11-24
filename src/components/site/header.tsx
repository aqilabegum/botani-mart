'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background shadow-sm">
      {/* Aksen garis atas ala IPB */}
      <div className="h-1 w-full bg-primary">
        <div className="h-full w-24 bg-accent" />
      </div>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => handleNav('home')}
          className="group flex items-center gap-3"
          aria-label="Beranda Botani Mart"
        >
          <span className="rounded-md bg-white px-1.5 py-1 dark:ring-1 dark:ring-white/20">
            <Image
              src="/logo-ipb.png"
              alt="IPB University"
              width={500}
              height={130}
              priority
              className="h-8 w-auto sm:h-9"
            />
          </span>
          <span className="hidden h-8 w-px bg-border sm:block" />
          <span className="font-serif text-lg font-semibold tracking-tight text-primary sm:text-xl">
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
                'relative px-4 py-5 text-sm font-medium transition-colors',
                view === item.view
                  ? 'text-primary'
                  : 'text-foreground/70 hover:text-primary'
              )}
            >
              {item.label}
              {view === item.view && (
                <span className="absolute inset-x-3 bottom-0 h-[3px] bg-accent" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground md:hidden"
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
        <nav className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {NAV.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNav(item.view)}
                className={cn(
                  'rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors',
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
