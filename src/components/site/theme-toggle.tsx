'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="rounded-full border border-border/60 bg-background/60 hover:bg-secondary"
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-5 w-5 text-amber-300" />
        ) : (
          <Moon className="h-5 w-5 text-primary" />
        )
      ) : (
        <Sun className="h-5 w-5 opacity-0" />
      )}
    </Button>
  )
}
