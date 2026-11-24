'use client'

import { useEffect } from 'react'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { HomeView } from '@/components/views/home-view'
import { CatalogView } from '@/components/views/catalog-view'
import { DetailView } from '@/components/views/detail-view'
import { AboutView } from '@/components/views/about-view'
import { ChatView } from '@/components/views/chat-view'
import { useAppStore } from '@/store/app-store'

export default function Page() {
  const view = useAppStore((s) => s.view)
  const selectedSlug = useAppStore((s) => s.selectedSlug)

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view, selectedSlug])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {view === 'home' && <HomeView />}
        {view === 'catalog' && <CatalogView />}
        {view === 'detail' && selectedSlug && <DetailView slug={selectedSlug} />}
        {view === 'about' && <AboutView />}
        {view === 'chat' && <ChatView />}
      </main>
      <Footer />
    </div>
  )
}
